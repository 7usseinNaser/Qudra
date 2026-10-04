"""Comprehensive tests for Feature 9: Human / AI Allocation.

Tests cover:
1. AI-suitable task (documentation, scaffolding, boilerplate) -> AI
2. Mandatory human task (physical, negotiation, security audit) -> HUMAN
3. Collaborative task (feature implementation, architecture review) -> HUMAN_AI
4. Human capability matching with TeamMember evidence
5. Correct TeamMember assignment from composed team
6. Handling task when no team is composed yet
7. Selecting best member when multiple team members exist
8. Task with no capability requirements
9. Complex task requiring verification
10. Allocation recalculation
11. Persistence and retrieval
12. Authorization checks (owner only)
13. Unauthenticated access rejected
14. API endpoints (POST /tasks, POST /tasks/{id}/allocation, GET /tasks/{id}/allocation, GET /problems/{id}/tasks)
"""

import uuid
from datetime import datetime, timezone

import pytest
from sqlalchemy.orm import Session

from app.core.exceptions import ProblemAccessDeniedError, ProblemNotFoundError
from app.core.security import hash_password
from app.db.models.capability import Capability
from app.db.models.evidence import Evidence, EvidenceType, VerificationStatus
from app.db.models.problem import (
    Problem,
    ProblemAnalysis,
    ProblemCapability,
    ProblemStatus,
)
from app.db.models.task import (
    AllocationType,
    Task,
    TaskAllocation,
    TaskComplexity,
    TaskPriority,
    TaskStatus,
)
from app.db.models.team import Team, TeamMember, TeamMemberStatus, TeamStatus
from app.db.models.user import User
from app.db.models.user_capability import UserCapability
from app.schemas.allocation import TaskCapabilityCreate, TaskCreate
from app.services.task_allocation_service import (
    TaskAccessDeniedError,
    TaskAllocationService,
    TaskNotFoundError,
)
from app.services.team_composer_service import TeamComposerService


# ── Test Helpers ─────────────────────────────────────────────────────────


def _create_user(db: Session, email: str, name: str = "Test User") -> User:
    user = User(
        email=email,
        hashed_password=hash_password("Pass1234!"),
        full_name=name,
        is_active=True,
    )
    db.add(user)
    db.flush()
    return user


def _create_capability(db: Session, name: str) -> Capability:
    cap = Capability(name=name, description=f"{name} capability")
    db.add(cap)
    db.flush()
    return cap


def _create_analyzed_problem(
    db: Session,
    user: User,
    title: str,
    capabilities: list[tuple[Capability, int, str]],
) -> Problem:
    problem = Problem(
        user_id=user.id,
        title=title,
        description=f"{title} description",
        domain="technology",
        status=ProblemStatus.ANALYZED,
    )
    db.add(problem)
    db.flush()

    analysis = ProblemAnalysis(
        problem_id=problem.id,
        project_type="web",
        domain="technology",
        problem_summary=f"Summary of {title}",
        solution_direction="Build solution",
    )
    db.add(analysis)
    db.flush()

    for cap, importance, req_level in capabilities:
        pc = ProblemCapability(
            problem_id=problem.id,
            capability_id=cap.id,
            importance=importance,
            required_level=req_level,
            reason=f"Required {cap.name}",
        )
        db.add(pc)
    db.flush()
    db.refresh(problem)
    return problem


def _add_user_capability_with_evidence(
    db: Session,
    user: User,
    cap: Capability,
    score: float,
) -> UserCapability:
    ev = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.PRACTICAL,
        title=f"Evidence for {cap.name}",
        description="Verified proof",
        strength=score,
        score=score,
        verification_status=VerificationStatus.VERIFIED,
    )
    db.add(ev)
    db.flush()

    uc = UserCapability(
        user_id=user.id,
        capability_id=cap.id,
        strength=score,
        evidence_strength=score,
        evidence_count=1,
        last_evaluated_at=datetime.now(timezone.utc),
        breakdown={"practical": score, "project": 0.0, "oral": 0.0, "freshness": 100.0},
    )
    db.add(uc)
    db.flush()
    return uc


def _register_and_login(client, email: str = "alloc_owner@test.com", name: str = "Alloc Owner"):
    client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "Pass1234!", "full_name": name},
    )
    resp = client.post(
        "/api/v1/auth/login",
        data={"username": email, "password": "Pass1234!"},
    )
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


# ══════════════════════════════════════════════════════════════════════════
# 1. Allocation Decision Rules Tests
# ══════════════════════════════════════════════════════════════════════════


class TestAllocationDecisions:
    def test_pure_ai_task_allocation(self, db_session: Session):
        """Documentation and template scaffolding task -> AI."""
        owner = _create_user(db_session, "ai_task_owner@test.com", "Owner")
        cap = _create_capability(db_session, "Python-Doc")
        problem = _create_analyzed_problem(db_session, owner, "Doc Problem", [(cap, 50, "MEDIUM")])

        svc = TaskAllocationService(db_session)
        task = svc.create_task(
            owner.id,
            TaskCreate(
                problem_id=problem.id,
                title="Generate API documentation and boilerplate",
                description="Draft markdown documentation and template schemas",
                task_type="DOCUMENTATION",
                complexity=TaskComplexity.LOW,
                requires_human_judgment=False,
                requires_verification=False,
            ),
        )

        alloc = svc.allocate_task(task.id, owner.id)
        assert alloc.allocation_type == AllocationType.AI
        assert alloc.ai_suitability_score >= 75.0
        assert len(alloc.ai_contribution) > 0
        assert alloc.primary_team_member_id is None

    def test_mandatory_human_task_allocation(self, db_session: Session):
        """Physical task / client negotiation / security audit -> HUMAN."""
        owner = _create_user(db_session, "human_task_owner@test.com", "Owner")
        cap = _create_capability(db_session, "Security-Cap")
        problem = _create_analyzed_problem(db_session, owner, "Audit Problem", [(cap, 90, "HIGH")])

        # Team member
        auditor = _create_user(db_session, "auditor@test.com", "Auditor")
        _add_user_capability_with_evidence(db_session, auditor, cap, 95.0)

        # Compose team
        TeamComposerService(db_session).compose_team(problem.id, owner.id)

        svc = TaskAllocationService(db_session)
        task = svc.create_task(
            owner.id,
            TaskCreate(
                problem_id=problem.id,
                title="Conduct onsite compliance negotiation and physical security audit",
                description="Client meeting and stakeholder sign-off",
                task_type="GOVERNANCE",
                complexity=TaskComplexity.HIGH,
                requires_human_judgment=True,
                required_capabilities=[TaskCapabilityCreate(capability_id=cap.id, importance=90)],
            ),
        )

        alloc = svc.allocate_task(task.id, owner.id)
        assert alloc.allocation_type == AllocationType.HUMAN
        assert alloc.primary_team_member_id is not None
        assert "Auditor" in alloc.primary_team_member_name
        assert len(alloc.human_contribution) > 0

    def test_collaborative_human_ai_allocation(self, db_session: Session):
        """Feature development with code generation + human review -> HUMAN_AI."""
        owner = _create_user(db_session, "collab_owner@test.com", "Owner")
        cap = _create_capability(db_session, "Backend-Collab")
        problem = _create_analyzed_problem(db_session, owner, "Collab Problem", [(cap, 85, "HIGH")])

        dev = _create_user(db_session, "dev_collab@test.com", "Developer")
        _add_user_capability_with_evidence(db_session, dev, cap, 90.0)

        TeamComposerService(db_session).compose_team(problem.id, owner.id)

        svc = TaskAllocationService(db_session)
        task = svc.create_task(
            owner.id,
            TaskCreate(
                problem_id=problem.id,
                title="Implement user authentication API",
                description="Scaffold endpoints and write unit tests with human security review",
                task_type="BACKEND",
                complexity=TaskComplexity.MEDIUM,
                requires_human_judgment=True,
                requires_verification=True,
                required_capabilities=[TaskCapabilityCreate(capability_id=cap.id, importance=85)],
            ),
        )

        alloc = svc.allocate_task(task.id, owner.id)
        assert alloc.allocation_type == AllocationType.HUMAN_AI
        assert alloc.primary_team_member_id is not None
        assert "Developer" in alloc.primary_team_member_name
        assert len(alloc.ai_contribution) > 0
        assert len(alloc.human_contribution) > 0


# ══════════════════════════════════════════════════════════════════════════
# 2. Team Member Matching & Selection Tests
# ══════════════════════════════════════════════════════════════════════════


class TestTeamMemberSelection:
    def test_assigns_most_qualified_team_member(self, db_session: Session):
        """When multiple members exist, task is assigned to the member with strongest evidence for task capabilities."""
        owner = _create_user(db_session, "multi_owner@test.com", "Owner")
        cap_be = _create_capability(db_session, "Backend-Multi")
        cap_fe = _create_capability(db_session, "Frontend-Multi")

        problem = _create_analyzed_problem(
            db_session, owner, "Multi Problem",
            [(cap_be, 80, "HIGH"), (cap_fe, 80, "HIGH")]
        )

        be_dev = _create_user(db_session, "be_expert@test.com", "BE Expert")
        _add_user_capability_with_evidence(db_session, be_dev, cap_be, 95.0)

        fe_dev = _create_user(db_session, "fe_expert@test.com", "FE Expert")
        _add_user_capability_with_evidence(db_session, fe_dev, cap_fe, 95.0)

        TeamComposerService(db_session).compose_team(problem.id, owner.id)

        svc = TaskAllocationService(db_session)
        # Backend task
        be_task = svc.create_task(
            owner.id,
            TaskCreate(
                problem_id=problem.id,
                title="Design PostgreSQL database schema",
                description="Database optimization",
                task_type="BACKEND",
                required_capabilities=[TaskCapabilityCreate(capability_id=cap_be.id, importance=90)],
            ),
        )

        be_alloc = svc.allocate_task(be_task.id, owner.id)
        assert be_alloc.primary_team_member_id is not None
        assert be_alloc.primary_team_member_name == "BE Expert"

        # Frontend task
        fe_task = svc.create_task(
            owner.id,
            TaskCreate(
                problem_id=problem.id,
                title="Build React interactive UI widgets",
                description="User interface widgets",
                task_type="FRONTEND",
                required_capabilities=[TaskCapabilityCreate(capability_id=cap_fe.id, importance=90)],
            ),
        )

        fe_alloc = svc.allocate_task(fe_task.id, owner.id)
        assert fe_alloc.primary_team_member_id is not None
        assert fe_alloc.primary_team_member_name == "FE Expert"

    def test_allocation_without_composed_team(self, db_session: Session):
        """When no team exists yet, allocation succeeds with primary_team_member_id as None."""
        owner = _create_user(db_session, "noteam_owner@test.com", "Owner")
        cap = _create_capability(db_session, "General-Cap")
        problem = _create_analyzed_problem(db_session, owner, "No Team Problem", [(cap, 50, "MEDIUM")])

        svc = TaskAllocationService(db_session)
        task = svc.create_task(
            owner.id,
            TaskCreate(
                problem_id=problem.id,
                title="General project research and documentation",
                task_type="DOCUMENTATION",
            ),
        )

        alloc = svc.allocate_task(task.id, owner.id)
        assert alloc.allocation_type == AllocationType.AI
        assert alloc.primary_team_member_id is None


# ══════════════════════════════════════════════════════════════════════════
# 3. Recalculation & Retrieval Tests
# ══════════════════════════════════════════════════════════════════════════


class TestAllocationRecalculation:
    def test_recalculation_updates_stored_allocation(self, db_session: Session):
        owner = _create_user(db_session, "recalc_alloc_owner@test.com", "Owner")
        cap = _create_capability(db_session, "Recalc-Cap")
        problem = _create_analyzed_problem(db_session, owner, "Recalc Problem", [(cap, 60, "MEDIUM")])

        svc = TaskAllocationService(db_session)
        task = svc.create_task(
            owner.id,
            TaskCreate(
                problem_id=problem.id,
                title="Draft release notes",
                task_type="DOCUMENTATION",
            ),
        )

        alloc1 = svc.allocate_task(task.id, owner.id)
        assert alloc1.allocation_type == AllocationType.AI

        # Re-fetch via get_allocation
        alloc2 = svc.get_allocation(task.id, owner.id)
        assert alloc2.id == alloc1.id
        assert alloc2.allocation_type == alloc1.allocation_type

        # Force recalculate
        alloc3 = svc.recalculate_allocation(task.id, owner.id)
        assert alloc3.id == alloc1.id


# ══════════════════════════════════════════════════════════════════════════
# 4. Security & Authorization Tests
# ══════════════════════════════════════════════════════════════════════════


class TestAllocationSecurity:
    def test_non_owner_cannot_create_or_allocate_task(self, db_session: Session):
        owner = _create_user(db_session, "sec_task_owner@test.com", "Owner")
        intruder = _create_user(db_session, "sec_task_intruder@test.com", "Intruder")
        cap = _create_capability(db_session, "Sec-Task-Cap")
        problem = _create_analyzed_problem(db_session, owner, "Sec Problem", [(cap, 50, "MEDIUM")])

        svc = TaskAllocationService(db_session)
        with pytest.raises(ProblemAccessDeniedError):
            svc.create_task(intruder.id, TaskCreate(problem_id=problem.id, title="Hacked Task"))

        # Create valid task
        task = svc.create_task(owner.id, TaskCreate(problem_id=problem.id, title="Legit Task"))

        with pytest.raises(TaskAccessDeniedError):
            svc.allocate_task(task.id, intruder.id)

    def test_nonexistent_task_raises_not_found(self, db_session: Session):
        owner = _create_user(db_session, "notfound_owner@test.com")
        svc = TaskAllocationService(db_session)
        with pytest.raises(TaskNotFoundError):
            svc.get_task(uuid.uuid4(), owner.id)


# ══════════════════════════════════════════════════════════════════════════
# 5. API Endpoint Tests
# ══════════════════════════════════════════════════════════════════════════


class TestTaskAllocationAPI:
    def test_task_allocation_api_flow(self, client, db_session: Session):
        headers = _register_and_login(client, "api_alloc_user@test.com", "API Alloc User")

        # 1. Create problem
        prob_resp = client.post(
            "/api/v1/problems",
            json={"title": "Task Problem", "description": "Need fullstack application with backend and frontend"},
            headers=headers,
        )
        problem_id = prob_resp.json()["id"]
        client.post(f"/api/v1/problems/{problem_id}/analyze", headers=headers)

        # 2. Create task
        task_resp = client.post(
            "/api/v1/tasks",
            json={
                "problem_id": problem_id,
                "title": "Write API schema documentation",
                "description": "Generate swagger and markdown docs",
                "task_type": "DOCUMENTATION",
                "complexity": "LOW",
                "requires_human_judgment": False,
                "requires_verification": False,
            },
            headers=headers,
        )
        assert task_resp.status_code == 201
        task_id = task_resp.json()["id"]

        # 3. Allocate task
        alloc_resp = client.post(f"/api/v1/tasks/{task_id}/allocation", headers=headers)
        assert alloc_resp.status_code == 200
        alloc_data = alloc_resp.json()
        assert alloc_data["task_id"] == task_id
        assert alloc_data["allocation_type"] == "AI"
        assert "ai_contribution" in alloc_data

        # 4. Get allocation
        get_alloc_resp = client.get(f"/api/v1/tasks/{task_id}/allocation", headers=headers)
        assert get_alloc_resp.status_code == 200
        assert get_alloc_resp.json()["id"] == alloc_data["id"]

        # 5. Recalculate allocation
        recalc_resp = client.post(f"/api/v1/tasks/{task_id}/allocation/recalculate", headers=headers)
        assert recalc_resp.status_code == 200

        # 6. List tasks for problem
        list_resp = client.get(f"/api/v1/problems/{problem_id}/tasks", headers=headers)
        assert list_resp.status_code == 200
        assert len(list_resp.json()) == 1

    def test_unauthenticated_requests_rejected(self, client):
        fake_id = str(uuid.uuid4())
        assert client.post(f"/api/v1/tasks/{fake_id}/allocation").status_code == 401
        assert client.get(f"/api/v1/tasks/{fake_id}/allocation").status_code == 401
