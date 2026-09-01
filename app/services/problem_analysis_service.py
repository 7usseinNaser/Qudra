import logging
import re
import uuid
from typing import Any

from sqlalchemy.orm import Session

from app.ai.provider import AIProvider, MockAIProvider
from app.core.exceptions import (
    ProblemAccessDeniedError,
    ProblemAnalysisFailedError,
    ProblemNotFoundError,
)
from app.db.models.capability import Capability
from app.db.models.problem import Problem, ProblemStatus
from app.repositories.capability_repository import CapabilityRepository
from app.repositories.problem_repository import ProblemRepository
from app.schemas.problem import (
    ProblemAnalysisRead,
    ProblemAnalysisResponse,
    ProblemCreate,
    ProblemRead,
    RequiredCapabilityRead,
)

logger = logging.getLogger("qudra.problem_analysis")


def slugify_name(name: str) -> str:
    """Normalize capability name to prevent duplicate variants (e.g. Backend Development -> backend-development)."""
    clean = re.sub(r"[^\w\s-]", "", name.lower()).strip()
    return re.sub(r"[-\s]+", "-", clean)


class ProblemAnalysisService:
    def __init__(self, db: Session, ai_provider: AIProvider | None = None):
        self.db = db
        self.repo = ProblemRepository(db)
        self.cap_repo = CapabilityRepository(db)
        self.ai_provider = ai_provider or MockAIProvider()

    def create_problem(self, user_id: uuid.UUID, data: ProblemCreate) -> ProblemRead:
        problem = self.repo.create(
            user_id=user_id,
            title=data.title,
            description=data.description,
            domain=data.domain,
        )
        return self._to_problem_read(problem)

    def get_problem(self, problem_id: uuid.UUID, user_id: uuid.UUID) -> ProblemRead:
        problem = self.repo.get_by_id(problem_id)
        if not problem:
            raise ProblemNotFoundError()
        if problem.user_id != user_id:
            raise ProblemAccessDeniedError()

        return self._to_problem_read(problem)

    def list_user_problems(
        self, user_id: uuid.UUID, page: int = 1, page_size: int = 10
    ) -> list[ProblemRead]:
        skip = (max(1, page) - 1) * max(1, page_size)
        problems = self.repo.list_by_user(user_id, skip=skip, limit=page_size)
        return [self._to_problem_read(p) for p in problems]

    async def analyze_problem(
        self, problem_id: uuid.UUID, user_id: uuid.UUID
    ) -> ProblemAnalysisRead:
        problem = self.repo.get_by_id(problem_id)
        if not problem:
            raise ProblemNotFoundError()
        if problem.user_id != user_id:
            raise ProblemAccessDeniedError()

        if not problem.description or len(problem.description.strip()) < 10:
            raise ProblemAnalysisFailedError("Problem description is too short to analyze.")

        # 1. Update status to ANALYZING
        self.repo.update_status(problem, ProblemStatus.ANALYZING)

        # 2. Call AI Provider with fallback / retry
        try:
            analysis_response = await self.ai_provider.analyze_problem(
                description=problem.description,
                title=problem.title,
                domain=problem.domain,
            )
            # Validate model structure explicitly
            validated_response = ProblemAnalysisResponse.model_validate(analysis_response)
        except Exception as exc:
            logger.exception("AI problem analysis failed for problem %s: %s", problem_id, exc)
            self.repo.update_status(problem, ProblemStatus.FAILED)
            raise ProblemAnalysisFailedError("AI analysis service encountered an error.") from exc

        # 3. Map capabilities and handle duplicate normalization
        mapped_capabilities: list[tuple[Capability, int, str, str | None]] = []

        for req_cap in validated_response.required_capabilities:
            cap_entity = self._get_or_create_capability(req_cap.name, req_cap.category)
            mapped_capabilities.append(
                (cap_entity, req_cap.importance, req_cap.required_level, req_cap.reason)
            )

        # 4. Save analysis results in DB
        updated_problem = self.repo.save_analysis(problem, validated_response, mapped_capabilities)

        return self.get_analysis(updated_problem.id, user_id)

    def get_analysis(self, problem_id: uuid.UUID, user_id: uuid.UUID) -> ProblemAnalysisRead:
        problem = self.repo.get_by_id(problem_id)
        if not problem:
            raise ProblemNotFoundError()
        if problem.user_id != user_id:
            raise ProblemAccessDeniedError()

        if not problem.analysis:
            raise ProblemNotFoundError("Analysis has not been generated for this problem.")

        req_caps: list[RequiredCapabilityRead] = []
        for pc in problem.capabilities:
            req_caps.append(
                RequiredCapabilityRead(
                    capability_id=pc.capability_id,
                    name=pc.capability.name,
                    category=pc.capability.category,
                    importance=pc.importance,
                    required_level=pc.required_level,
                    reason=pc.reason,
                )
            )

        return ProblemAnalysisRead(
            problem_id=problem.id,
            project_type=problem.analysis.project_type,
            domain=problem.analysis.domain,
            problem_summary=problem.analysis.problem_summary,
            solution_direction=problem.analysis.solution_direction,
            target_users=problem.analysis.target_users or [],
            technical_requirements=problem.analysis.technical_requirements or [],
            potential_features=problem.analysis.potential_features or [],
            constraints=problem.analysis.constraints or [],
            required_capabilities=req_caps,
            created_at=problem.analysis.created_at,
        )

    def _get_or_create_capability(self, name: str, category: str | None) -> Capability:
        norm_slug = slugify_name(name)

        # First check exact name
        existing = self.cap_repo.get_by_name(name)
        if existing:
            return existing

        # Second check all existing capabilities for slug match
        all_caps = self.cap_repo.list_all()
        for cap in all_caps:
            if slugify_name(cap.name) == norm_slug:
                return cap

        # Create new capability with normalized title-cased name
        formatted_name = name.strip()
        return self.cap_repo.create(
            name=formatted_name,
            category=category or "General",
            description=f"Auto-created capability from AI analysis: {formatted_name}",
        )

    def _to_problem_read(self, problem: Problem) -> ProblemRead:
        req_caps: list[RequiredCapabilityRead] = []
        if problem.capabilities:
            for pc in problem.capabilities:
                req_caps.append(
                    RequiredCapabilityRead(
                        capability_id=pc.capability_id,
                        name=pc.capability.name,
                        category=pc.capability.category,
                        importance=pc.importance,
                        required_level=pc.required_level,
                        reason=pc.reason,
                    )
                )

        return ProblemRead(
            id=problem.id,
            user_id=problem.user_id,
            title=problem.title,
            description=problem.description,
            domain=problem.domain,
            project_type=problem.project_type,
            status=problem.status,
            created_at=problem.created_at,
            updated_at=problem.updated_at,
            required_capabilities=req_caps,
        )
