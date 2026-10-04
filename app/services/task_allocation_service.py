"""Feature 9: Human / AI Allocation Service.

Determines whether a project task should be performed by HUMAN, AI, or HUMAN_AI,
assigning primary responsibility to the most qualified TeamMember from Feature 8.
"""

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.exceptions import (
    AppError,
    ProblemAccessDeniedError,
    ProblemNotFoundError,
)
from app.db.models.capability import Capability
from app.db.models.problem import Problem
from app.db.models.task import (
    AllocationType,
    Task,
    TaskAllocation,
    TaskCapability,
    TaskComplexity,
    TaskPriority,
    TaskStatus,
)
from app.db.models.team import Team, TeamMember, TeamStatus
from app.db.models.user_capability import UserCapability
from app.repositories.problem_repository import ProblemRepository
from app.schemas.allocation import (
    TaskAllocationRead,
    TaskCapabilityCreate,
    TaskCapabilityRead,
    TaskCreate,
    TaskRead,
)
from app.services.skill_gap_service import IMPORTANCE_WEIGHTS, SkillGapService


class TaskNotFoundError(AppError):
    status_code = 404
    detail = "Task not found."


class TaskAccessDeniedError(AppError):
    status_code = 403
    detail = "You do not have access to this task."


# Centralized AI Suitability Classification Keywords & Heuristics
AI_FAVORABLE_KEYWORDS: set[str] = {
    "documentation",
    "document",
    "boilerplate",
    "scaffold",
    "summarize",
    "summary",
    "draft",
    "formatting",
    "parse",
    "extract",
    "classify",
    "template",
    "mock",
    "translate",
    "regex",
    "clean",
}

HUMAN_MANDATORY_KEYWORDS: set[str] = {
    "physical",
    "negotiate",
    "negotiation",
    "client meeting",
    "interview",
    "hire",
    "hiring",
    "security audit",
    "compliance audit",
    "governance",
    "sign-off",
    "contract",
    "stakeholder",
    "onsite",
    "hardware",
}


class TaskAllocationService:
    """Intelligent, deterministic engine allocating tasks to Human, AI, or Human+AI collaboration."""

    def __init__(self, db: Session):
        self.db = db
        self.problem_repo = ProblemRepository(db)
        self.skill_gap_service = SkillGapService(db)

    # ── Task Management ──────────────────────────────────────────────────

    def create_task(self, user_id: uuid.UUID, data: TaskCreate) -> TaskRead:
        """Creates a task with optional required capabilities associated with a problem."""
        problem = self.problem_repo.get_by_id(data.problem_id)
        if not problem:
            raise ProblemNotFoundError()
        if problem.user_id != user_id:
            raise ProblemAccessDeniedError()

        task = Task(
            problem_id=data.problem_id,
            team_id=data.team_id,
            title=data.title,
            description=data.description,
            task_type=data.task_type,
            priority=data.priority,
            complexity=data.complexity,
            requires_human_judgment=data.requires_human_judgment,
            requires_verification=data.requires_verification,
            status=TaskStatus.TODO,
        )
        self.db.add(task)
        self.db.flush()

        # Link capabilities
        for req in data.required_capabilities:
            tc = TaskCapability(
                task_id=task.id,
                capability_id=req.capability_id,
                importance=req.importance,
                required_level=req.required_level,
            )
            self.db.add(tc)

        self.db.commit()
        return self.get_task(task.id, user_id)

    def get_task(self, task_id: uuid.UUID, user_id: uuid.UUID) -> TaskRead:
        """Fetches a task by ID with verified authorization."""
        stmt = (
            select(Task)
            .options(
                selectinload(Task.capabilities).selectinload(TaskCapability.capability),
                selectinload(Task.problem),
            )
            .where(Task.id == task_id)
        )
        task = self.db.execute(stmt).scalar_one_or_none()
        if not task:
            raise TaskNotFoundError()
        if task.problem.user_id != user_id:
            raise TaskAccessDeniedError()

        cap_reads = [
            TaskCapabilityRead(
                capability_id=tc.capability_id,
                capability_name=tc.capability.name if tc.capability else "Unknown",
                importance=tc.importance,
                required_level=tc.required_level,
            )
            for tc in task.capabilities
        ]

        return TaskRead(
            id=task.id,
            problem_id=task.problem_id,
            team_id=task.team_id,
            title=task.title,
            description=task.description,
            task_type=task.task_type,
            status=task.status,
            priority=task.priority,
            complexity=task.complexity,
            requires_human_judgment=task.requires_human_judgment,
            requires_verification=task.requires_verification,
            capabilities=cap_reads,
            created_at=task.created_at,
            updated_at=task.updated_at,
        )

    def list_tasks_for_problem(
        self, problem_id: uuid.UUID, user_id: uuid.UUID
    ) -> list[TaskRead]:
        """Lists all tasks for a specific problem."""
        problem = self.problem_repo.get_by_id(problem_id)
        if not problem:
            raise ProblemNotFoundError()
        if problem.user_id != user_id:
            raise ProblemAccessDeniedError()

        stmt = (
            select(Task)
            .options(
                selectinload(Task.capabilities).selectinload(TaskCapability.capability),
            )
            .where(Task.problem_id == problem_id)
            .order_by(Task.created_at.asc())
        )
        tasks = list(self.db.execute(stmt).scalars().all())

        results = []
        for task in tasks:
            cap_reads = [
                TaskCapabilityRead(
                    capability_id=tc.capability_id,
                    capability_name=tc.capability.name if tc.capability else "Unknown",
                    importance=tc.importance,
                    required_level=tc.required_level,
                )
                for tc in task.capabilities
            ]
            results.append(
                TaskRead(
                    id=task.id,
                    problem_id=task.problem_id,
                    team_id=task.team_id,
                    title=task.title,
                    description=task.description,
                    task_type=task.task_type,
                    status=task.status,
                    priority=task.priority,
                    complexity=task.complexity,
                    requires_human_judgment=task.requires_human_judgment,
                    requires_verification=task.requires_verification,
                    capabilities=cap_reads,
                    created_at=task.created_at,
                    updated_at=task.updated_at,
                )
            )
        return results

    # ── Allocation Engine ────────────────────────────────────────────────

    def allocate_task(
        self, task_id: uuid.UUID, user_id: uuid.UUID
    ) -> TaskAllocationRead:
        """Determines and saves Human/AI allocation for a task."""
        stmt = (
            select(Task)
            .options(
                selectinload(Task.capabilities).selectinload(TaskCapability.capability),
                selectinload(Task.problem),
                selectinload(Task.allocation).selectinload(TaskAllocation.primary_team_member).selectinload(TeamMember.user),
            )
            .where(Task.id == task_id)
        )
        task = self.db.execute(stmt).scalar_one_or_none()
        if not task:
            raise TaskNotFoundError()
        if task.problem.user_id != user_id:
            raise TaskAccessDeniedError()

        # 1. Load team members from Feature 8 composed team
        team_members = self._get_problem_team_members(task.problem_id, task.team_id)

        # 2. Evaluate Human Suitability and Best Member Match
        human_score, best_member = self._evaluate_human_suitability(task, team_members)

        # 3. Evaluate AI Suitability
        ai_score = self._evaluate_ai_suitability(task)

        # 4. Determine Allocation Decision
        decision = self._decide_allocation(
            task=task,
            ai_score=ai_score,
            human_score=human_score,
            best_member=best_member,
        )

        # 5. Persist TaskAllocation
        allocation = self._persist_allocation(
            task_id=task.id,
            allocation_type=decision["allocation_type"],
            primary_team_member_id=best_member.id if best_member and decision["allocation_type"] != AllocationType.AI else None,
            human_suitability_score=human_score,
            ai_suitability_score=ai_score,
            reason=decision["reason"],
            ai_contribution=decision["ai_contribution"],
            human_contribution=decision["human_contribution"],
        )

        member_name = best_member.user.full_name if best_member and best_member.user else None
        if decision["allocation_type"] == AllocationType.AI:
            member_name = None

        return TaskAllocationRead(
            id=allocation.id,
            task_id=task.id,
            task_title=task.title,
            allocation_type=allocation.allocation_type,
            primary_team_member_id=allocation.primary_team_member_id,
            primary_team_member_name=member_name,
            human_suitability_score=allocation.human_suitability_score,
            ai_suitability_score=allocation.ai_suitability_score,
            reason=allocation.reason,
            ai_contribution=allocation.ai_contribution or [],
            human_contribution=allocation.human_contribution or [],
            created_at=allocation.created_at,
            updated_at=allocation.updated_at,
        )

    def get_allocation(
        self, task_id: uuid.UUID, user_id: uuid.UUID
    ) -> TaskAllocationRead:
        """Retrieves current allocation or triggers allocation if not yet performed."""
        stmt = (
            select(Task)
            .options(
                selectinload(Task.allocation).selectinload(TaskAllocation.primary_team_member).selectinload(TeamMember.user),
                selectinload(Task.problem),
            )
            .where(Task.id == task_id)
        )
        task = self.db.execute(stmt).scalar_one_or_none()
        if not task:
            raise TaskNotFoundError()
        if task.problem.user_id != user_id:
            raise TaskAccessDeniedError()

        if not task.allocation:
            return self.allocate_task(task_id, user_id)

        alloc = task.allocation
        member_name = (
            alloc.primary_team_member.user.full_name
            if alloc.primary_team_member and alloc.primary_team_member.user
            else None
        )

        return TaskAllocationRead(
            id=alloc.id,
            task_id=task.id,
            task_title=task.title,
            allocation_type=alloc.allocation_type,
            primary_team_member_id=alloc.primary_team_member_id,
            primary_team_member_name=member_name,
            human_suitability_score=alloc.human_suitability_score,
            ai_suitability_score=alloc.ai_suitability_score,
            reason=alloc.reason,
            ai_contribution=alloc.ai_contribution or [],
            human_contribution=alloc.human_contribution or [],
            created_at=alloc.created_at,
            updated_at=alloc.updated_at,
        )

    def recalculate_allocation(
        self, task_id: uuid.UUID, user_id: uuid.UUID
    ) -> TaskAllocationRead:
        """Forces recalculation of a task's allocation."""
        return self.allocate_task(task_id, user_id)

    # ── Suitability Evaluators ───────────────────────────────────────────

    def _get_problem_team_members(
        self, problem_id: uuid.UUID, team_id: uuid.UUID | None
    ) -> list[TeamMember]:
        """Loads team members from the composed team."""
        stmt = select(TeamMember).options(selectinload(TeamMember.user))
        if team_id:
            stmt = stmt.where(TeamMember.team_id == team_id)
        else:
            # Find latest team for this problem
            team_stmt = (
                select(Team.id)
                .where(Team.problem_id == problem_id)
                .order_by(Team.created_at.desc())
                .limit(1)
            )
            team_id_res = self.db.execute(team_stmt).scalar_one_or_none()
            if not team_id_res:
                return []
            stmt = stmt.where(TeamMember.team_id == team_id_res)

        return list(self.db.execute(stmt).scalars().all())

    def _evaluate_human_suitability(
        self, task: Task, team_members: list[TeamMember]
    ) -> tuple[float, TeamMember | None]:
        """Calculates human suitability score and selects the best matching team member."""
        if not team_members:
            # No team composed yet
            base_score = 75.0 if task.requires_human_judgment else 50.0
            return base_score, None

        required_caps = task.capabilities
        if not required_caps:
            # No specific capability required -> pick member with highest general contribution
            best_member = max(team_members, key=lambda m: m.contribution_score)
            return round(best_member.contribution_score, 1), best_member

        # Batch-fetch UserCapability for all team members × required capabilities
        user_ids = [m.user_id for m in team_members]
        cap_ids = [tc.capability_id for tc in required_caps]

        uc_stmt = select(UserCapability).where(
            UserCapability.user_id.in_(user_ids),
            UserCapability.capability_id.in_(cap_ids),
        )
        ucs = list(self.db.execute(uc_stmt).scalars().all())
        uc_map: dict[tuple[uuid.UUID, uuid.UUID], float] = {
            (uc.user_id, uc.capability_id): float(uc.evidence_strength) for uc in ucs
        }

        best_score = -1.0
        best_member: TeamMember | None = None

        for member in team_members:
            total_weighted = 0.0
            total_weights = 0.0

            for tc in required_caps:
                req_level = self.skill_gap_service.normalize_required_level(
                    tc.required_level, tc.importance
                )
                weight = IMPORTANCE_WEIGHTS.get(req_level, 0.7)

                strength = uc_map.get((member.user_id, tc.capability_id), 0.0)
                total_weighted += strength * weight
                total_weights += weight

            member_match = (total_weighted / total_weights) if total_weights > 0 else 0.0
            if member_match > best_score:
                best_score = member_match
                best_member = member

        if best_member is None:
            best_member = team_members[0]
            best_score = best_member.contribution_score

        # Boost human suitability if human judgment or verification is explicitly flagged
        if task.requires_human_judgment:
            best_score = max(best_score, 80.0)

        final_human_score = round(max(0.0, min(100.0, best_score)), 1)
        return final_human_score, best_member

    def _evaluate_ai_suitability(self, task: Task) -> float:
        """Determines AI suitability based on task type, keywords, complexity, and oversight."""
        text = f"{task.title} {task.description or ''} {task.task_type or ''}".lower()

        # Check for strictly human mandatory keywords
        if any(kw in text for kw in HUMAN_MANDATORY_KEYWORDS):
            return 15.0

        score = 50.0

        # Check for AI-favorable keywords
        favorable_count = sum(1 for kw in AI_FAVORABLE_KEYWORDS if kw in text)
        score += favorable_count * 12.0

        # Task type adjustments
        t_type = (task.task_type or "").upper()
        if t_type in ("DOCUMENTATION", "BOILERPLATE", "SCAFFOLDING", "TRANSLATION"):
            score += 25.0
        elif t_type in ("RESEARCH", "TESTING", "API_DESIGN", "BACKEND", "FRONTEND", "DEVELOPMENT"):
            score += 15.0
        elif t_type in ("GOVERNANCE", "PHYSICAL", "NEGOTIATION", "SECURITY_AUDIT"):
            score -= 40.0

        # Complexity adjustments
        if task.complexity == TaskComplexity.HIGH:
            score -= 10.0
        elif task.complexity == TaskComplexity.LOW:
            score += 10.0

        # Human judgment adjustment (affects autonomous execution score)
        if task.requires_human_judgment:
            score -= 15.0

        return round(max(0.0, min(100.0, score)), 1)

    # ── Decision Logic ───────────────────────────────────────────────────

    def _decide_allocation(
        self,
        task: Task,
        ai_score: float,
        human_score: float,
        best_member: TeamMember | None,
    ) -> dict[str, Any]:
        """Rules-based deterministic mapping to HUMAN, AI, or HUMAN_AI."""
        text = f"{task.title} {task.description or ''} {task.task_type or ''}".lower()
        member_name = (
            best_member.user.full_name if best_member and best_member.user else "an assigned team member"
        )

        is_mandatory_human = any(kw in text for kw in HUMAN_MANDATORY_KEYWORDS)

        # 1. Pure Human (physical, interpersonal, governance, or negligible AI suitability)
        if is_mandatory_human or ai_score < 30.0 or (task.requires_human_judgment and ai_score < 35.0):
            allocation = AllocationType.HUMAN
            reason = (
                f"This task involves critical domain judgment, direct execution, or interpersonal/governance "
                f"responsibilities best handled by human expertise. Assigned to {member_name}."
            )
            ai_contrib = []
            human_contrib = [
                f"Lead execution of {task.title}",
                "Apply contextual domain judgment",
                "Ensure compliance and quality assurance",
            ]

        # 2. Pure AI (highly automatable, standard structure, low ambiguity, no human judgment blocker)
        elif (
            ai_score >= 70.0
            and not task.requires_human_judgment
            and task.complexity != TaskComplexity.HIGH
            and not is_mandatory_human
        ):
            allocation = AllocationType.AI
            reason = (
                f"The task is highly structured and automatable (score: {ai_score}), "
                "suitable for autonomous AI execution without blocking team members."
            )
            ai_contrib = [
                f"Generate complete deliverables for {task.title}",
                "Perform automated transformations and validations",
                "Format output according to project standards",
            ]
            human_contrib = [
                "Optional spot-check of the completed artifact",
            ]

        # 3. Human + AI Collaboration (AI scaffolds/drafts, Human reviews/validates/approves)
        else:
            allocation = AllocationType.HUMAN_AI
            reason = (
                f"AI can accelerate scaffolding and initial drafting (AI suitability: {ai_score}), "
                f"while {member_name} provides critical review, validation, and final integration."
            )
            ai_contrib = [
                f"Draft initial implementation and scaffolding for {task.title}",
                "Generate test cases and edge-case templates",
                "Analyze potential bottlenecks or missing endpoints",
            ]
            human_contrib = [
                f"{member_name} to review and refine AI-generated artifacts",
                "Validate architectural alignment and security standards",
                "Approve and merge the final deliverable",
            ]

        return {
            "allocation_type": allocation,
            "reason": reason,
            "ai_contribution": ai_contrib,
            "human_contribution": human_contrib,
        }


    # ── Persistence ──────────────────────────────────────────────────────

    def _persist_allocation(
        self,
        task_id: uuid.UUID,
        allocation_type: AllocationType,
        primary_team_member_id: uuid.UUID | None,
        human_suitability_score: float,
        ai_suitability_score: float,
        reason: str,
        ai_contribution: list[str],
        human_contribution: list[str],
    ) -> TaskAllocation:
        """Upserts TaskAllocation row."""
        stmt = select(TaskAllocation).where(TaskAllocation.task_id == task_id)
        existing = self.db.execute(stmt).scalar_one_or_none()

        now = datetime.now(timezone.utc)
        if existing:
            existing.allocation_type = allocation_type
            existing.primary_team_member_id = primary_team_member_id
            existing.human_suitability_score = human_suitability_score
            existing.ai_suitability_score = ai_suitability_score
            existing.reason = reason
            existing.ai_contribution = ai_contribution
            existing.human_contribution = human_contribution
            existing.updated_at = now
            alloc = existing
        else:
            alloc = TaskAllocation(
                task_id=task_id,
                allocation_type=allocation_type,
                primary_team_member_id=primary_team_member_id,
                human_suitability_score=human_suitability_score,
                ai_suitability_score=ai_suitability_score,
                reason=reason,
                ai_contribution=ai_contribution,
                human_contribution=human_contribution,
            )
            self.db.add(alloc)

        self.db.commit()
        self.db.refresh(alloc)
        return alloc
