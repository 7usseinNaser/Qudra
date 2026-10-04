import logging
import uuid
from typing import Any

from sqlalchemy.orm import Session

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
    RequiredCapabilityAnalysis,
    RequiredCapabilityRead,
)
from app.utils.normalization import canonical_key, normalize_capability_name

logger = logging.getLogger("qudra.problem_analysis")


class ProblemAnalysisService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = ProblemRepository(db)
        self.cap_repo = CapabilityRepository(db)

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

        self.repo.update_status(problem, ProblemStatus.ANALYZING)

        try:
            analysis_response = self._generate_analysis(
                description=problem.description,
                title=problem.title,
                domain=problem.domain,
            )
            validated_response = ProblemAnalysisResponse.model_validate(analysis_response)
        except Exception as exc:
            logger.exception("Problem analysis failed for problem %s: %s", problem_id, exc)
            self.repo.update_status(problem, ProblemStatus.FAILED)
            raise ProblemAnalysisFailedError("Problem analysis encountered an error.") from exc

        mapped_capabilities: list[tuple[Capability, int, str, str | None]] = []
        for req_cap in validated_response.required_capabilities:
            cap_entity = self._get_or_create_capability(req_cap.name, req_cap.category)
            mapped_capabilities.append(
                (cap_entity, req_cap.importance, req_cap.required_level, req_cap.reason)
            )

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
                    name=pc.capability.name if pc.capability else "Unknown",
                    category=pc.capability.category if pc.capability else None,
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

    def _generate_analysis(
        self, description: str, title: str | None = None, domain: str | None = None
    ) -> dict[str, Any]:
        desc_lower = description.lower()
        title_lower = (title or "").lower()
        domain_val = domain or "Technology"

        req_capabilities: list[dict[str, Any]] = []

        if "audio" in desc_lower or "speech" in desc_lower or "reading" in desc_lower or "voice" in desc_lower:
            req_capabilities.append(
                {
                    "name": "Speech Processing",
                    "category": "Artificial Intelligence",
                    "importance": 95,
                    "required_level": "HIGH",
                    "reason": "The application needs to process student audio recording.",
                }
            )
            req_capabilities.append(
                {
                    "name": "NLP",
                    "category": "Artificial Intelligence",
                    "importance": 90,
                    "required_level": "HIGH",
                    "reason": "The system needs to analyze and score textual feedback.",
                }
            )

        if "mobile" in desc_lower or "app" in desc_lower or "flutter" in desc_lower:
            req_capabilities.append(
                {
                    "name": "Mobile Development",
                    "category": "Software Engineering",
                    "importance": 80,
                    "required_level": "HIGH",
                    "reason": "Front-end mobile interface for user interaction.",
                }
            )

        if "ui" in desc_lower or "ux" in desc_lower or "design" in desc_lower:
            req_capabilities.append(
                {
                    "name": "UI/UX Design",
                    "category": "Design",
                    "importance": 65,
                    "required_level": "MEDIUM",
                    "reason": "User experience and interface design.",
                }
            )

        if not req_capabilities:
            req_capabilities = [
                {
                    "name": "Backend Development",
                    "category": "Software Engineering",
                    "importance": 85,
                    "required_level": "HIGH",
                    "reason": "The application requires robust APIs and server processing.",
                },
                {
                    "name": "Database Design",
                    "category": "Software Engineering",
                    "importance": 70,
                    "required_level": "MEDIUM",
                    "reason": "Relational database setup to persist user data.",
                },
            ]
        else:
            req_capabilities.append(
                {
                    "name": "Backend Development",
                    "category": "Software Engineering",
                    "importance": 85,
                    "required_level": "HIGH",
                    "reason": "API endpoints and server side orchestration.",
                }
            )

        proj_type = (
            f"AI {domain_val} Application"
            if "ai" in desc_lower or "ai" in title_lower
            else f"{domain_val} Software Platform"
        )

        return {
            "project_type": proj_type,
            "domain": domain_val,
            "target_users": ["End Users", "Administrators"],
            "problem_summary": f"Problem summary for {title or 'project'}: {description[:100]}...",
            "solution_direction": "Construct a modular service with secure APIs and client apps.",
            "required_capabilities": req_capabilities,
            "technical_requirements": ["RESTful API", "Secure Auth", "Relational Database"],
            "potential_features": ["User Dashboard", "Real-time Processing", "Export Reports"],
            "constraints": ["Data Privacy", "Scalability"],
        }

    def _get_or_create_capability(self, name: str, category: str | None) -> Capability:
        norm_name = normalize_capability_name(name)
        norm_key = canonical_key(norm_name)

        existing = self.cap_repo.get_by_name(norm_name)
        if existing:
            return existing

        all_caps = self.cap_repo.list_all()
        for cap in all_caps:
            if canonical_key(cap.name) == norm_key:
                return cap

        return self.cap_repo.create(
            name=norm_name,
            category=category or "General",
            description=f"Auto-created capability from Problem analysis: {norm_name}",
        )

    def _to_problem_read(self, problem: Problem) -> ProblemRead:
        req_caps: list[RequiredCapabilityRead] = []
        if problem.capabilities:
            for pc in problem.capabilities:
                req_caps.append(
                    RequiredCapabilityRead(
                        capability_id=pc.capability_id,
                        name=pc.capability.name if pc.capability else "Unknown",
                        category=pc.capability.category if pc.capability else None,
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
