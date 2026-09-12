import uuid
from typing import Sequence

from sqlalchemy import select, func
from sqlalchemy.orm import Session, selectinload

from app.db.models.capability import Capability
from app.db.models.problem import Problem, ProblemAnalysis, ProblemCapability, ProblemStatus
from app.schemas.problem import ProblemAnalysisResponse


class ProblemRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self, *, user_id: uuid.UUID, title: str, description: str, domain: str | None = None
    ) -> Problem:
        problem = Problem(
            user_id=user_id,
            title=title,
            description=description,
            domain=domain,
            status=ProblemStatus.DRAFT,
        )
        self.db.add(problem)
        self.db.commit()
        self.db.refresh(problem)
        return problem

    def get_by_id(self, problem_id: uuid.UUID) -> Problem | None:
        stmt = (
            select(Problem)
            .options(
                selectinload(Problem.capabilities).selectinload(ProblemCapability.capability),
                selectinload(Problem.analysis),
            )
            .where(Problem.id == problem_id)
        )
        return self.db.execute(stmt).scalar_one_or_none()

    def list_by_user(
        self, user_id: uuid.UUID, skip: int = 0, limit: int = 10
    ) -> Sequence[Problem]:
        stmt = (
            select(Problem)
            .options(
                selectinload(Problem.capabilities).selectinload(ProblemCapability.capability),
                selectinload(Problem.analysis),
            )
            .where(Problem.user_id == user_id)
            .order_by(Problem.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return self.db.execute(stmt).scalars().all()

    def update_status(
        self,
        problem: Problem,
        status: ProblemStatus,
        project_type: str | None = None,
        domain: str | None = None,
    ) -> Problem:
        problem.status = status
        if project_type is not None:
            problem.project_type = project_type
        if domain is not None:
            problem.domain = domain
        self.db.commit()
        self.db.refresh(problem)
        return problem

    def save_analysis(
        self,
        problem: Problem,
        analysis_data: ProblemAnalysisResponse,
        mapped_capabilities: list[tuple[Capability, int, str, str | None]],
    ) -> Problem:
        # 1. Clear existing analysis if present
        if problem.analysis:
            self.db.delete(problem.analysis)

        # 2. Clear existing problem capabilities if present
        for pc in problem.capabilities:
            self.db.delete(pc)

        self.db.flush()

        # 3. Create ProblemAnalysis record
        analysis = ProblemAnalysis(
            problem_id=problem.id,
            project_type=analysis_data.project_type,
            domain=analysis_data.domain or problem.domain,
            problem_summary=analysis_data.problem_summary,
            solution_direction=analysis_data.solution_direction,
            target_users=analysis_data.target_users,
            technical_requirements=analysis_data.technical_requirements,
            potential_features=analysis_data.potential_features,
            constraints=analysis_data.constraints,
        )
        self.db.add(analysis)

        # 4. Link required capabilities
        for cap, importance, req_level, reason in mapped_capabilities:
            prob_cap = ProblemCapability(
                problem_id=problem.id,
                capability_id=cap.id,
                importance=importance,
                required_level=req_level,
                reason=reason,
            )
            self.db.add(prob_cap)

        # 5. Update problem status
        problem.status = ProblemStatus.ANALYZED
        problem.project_type = analysis_data.project_type
        if analysis_data.domain:
            problem.domain = analysis_data.domain

        self.db.commit()
        self.db.refresh(problem)
        return problem
