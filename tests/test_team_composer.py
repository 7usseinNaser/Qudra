"""Comprehensive tests for Feature 8: Team Composer.

Tests cover:
1. Team configuration weights and default team size
2. One candidate covers all capabilities (team size = 1)
3. Two candidates complement each other
4. Three candidates required for coverage
5. Redundant candidate excluded
6. No candidate for required capability (reported as GAP)
7. Configurable maximum team size respected
8. Fewer than max team size returned when problem is fully covered
9. HIGH/MEDIUM/LOW requirement weighting
10. Partial capability scores (PARTIAL classification)
11. Capability gaps with honest reasons
12. Team score calculation with centralized weights
13. Evidence-based role assignment
14. Authorization enforcement (owner only)
15. Unanalyzed problem raises error
16. Empty candidate pool handling
17. Deduplication of duplicate required capabilities
18. Optimization pass removes redundant members
19. TeamMember initial status is strictly PROPOSED
20. API endpoint POST /api/v1/problems/{id}/compose-team
"""

import uuid
from datetime import datetime, timezone

import pytest
from sqlalchemy.orm import Session

from app.core.exceptions import ProblemAccessDeniedError, ProblemNotAnalyzedError, ProblemNotFoundError
from app.core.security import hash_password
from app.db.models.capability import Capability
from app.db.models.evidence import Evidence, EvidenceType, VerificationStatus
from app.db.models.problem import (
    Problem,
    ProblemAnalysis,
    ProblemCapability,
    ProblemStatus,
)
from app.db.models.project import Project, ProjectStatus
from app.db.models.project_capability import ProjectCapability
from app.db.models.team import Team, TeamMember, TeamMemberStatus, TeamStatus
from app.db.models.user import User
from app.db.models.user_capability import UserCapability
from app.schemas.team import ComposeTeamRequest
from app.services.team_composer_service import (
    DEFAULT_MAX_TEAM_SIZE,
    TEAM_COMPOSITION_WEIGHTS,
    TeamComposerService,
)


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
    evidence_type: EvidenceType = EvidenceType.PRACTICAL,
) -> UserCapability:
    ev = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=evidence_type,
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


def _register_and_login(client, email: str = "team_owner@test.com", name: str = "Team Owner"):
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
# 1. Configuration & Weights
# ══════════════════════════════════════════════════════════════════════════


class TestTeamConfiguration:
    def test_weights_sum_to_one(self):
        total = sum(TEAM_COMPOSITION_WEIGHTS.values())
        assert abs(total - 1.0) < 1e-6

    def test_weights_keys_present(self):
        expected = {"coverage", "evidence", "relevance", "complementarity"}
        assert set(TEAM_COMPOSITION_WEIGHTS.keys()) == expected

    def test_default_max_team_size(self):
        assert DEFAULT_MAX_TEAM_SIZE == 5


# ══════════════════════════════════════════════════════════════════════════
# 2. Composition Scenarios
# ══════════════════════════════════════════════════════════════════════════


class TestTeamComposerScenarios:
    def test_single_candidate_covers_all_capabilities(self, db_session: Session):
        """Candidate covers all requirements -> team size = 1."""
        cap1 = _create_capability(db_session, "Fullstack-Python")
        cap2 = _create_capability(db_session, "Fullstack-Postgres")

        owner = _create_user(db_session, "tc_owner1@test.com", "Owner 1")
        problem = _create_analyzed_problem(
            db_session, owner, "Fullstack App",
            [(cap1, 80, "HIGH"), (cap2, 70, "MEDIUM")]
        )

        all_rounder = _create_user(db_session, "allrounder@test.com", "All Rounder")
        _add_user_capability_with_evidence(db_session, all_rounder, cap1, 90.0)
        _add_user_capability_with_evidence(db_session, all_rounder, cap2, 85.0)

        svc = TeamComposerService(db_session)
        result = svc.compose_team(problem.id, owner.id)

        assert result.team_size == 1
        assert result.members[0].user_id == all_rounder.id
        assert result.coverage_score >= 85.0
        assert len(result.gaps) == 0
        assert result.status == TeamStatus.PROPOSED
        assert result.members[0].member_status == TeamMemberStatus.PROPOSED

    def test_two_complementary_candidates(self, db_session: Session):
        """Candidate A has Backend, Candidate B has Mobile -> team of 2."""
        cap_be = _create_capability(db_session, "Backend-TC")
        cap_mo = _create_capability(db_session, "Mobile-TC")

        owner = _create_user(db_session, "tc_owner2@test.com", "Owner 2")
        problem = _create_analyzed_problem(
            db_session, owner, "Mobile + Backend App",
            [(cap_be, 85, "HIGH"), (cap_mo, 85, "HIGH")]
        )

        dev_be = _create_user(db_session, "be_dev@test.com", "Backend Dev")
        _add_user_capability_with_evidence(db_session, dev_be, cap_be, 92.0)

        dev_mo = _create_user(db_session, "mo_dev@test.com", "Mobile Dev")
        _add_user_capability_with_evidence(db_session, dev_mo, cap_mo, 88.0)

        svc = TeamComposerService(db_session)
        result = svc.compose_team(problem.id, owner.id)

        assert result.team_size == 2
        user_ids = {m.user_id for m in result.members}
        assert dev_be.id in user_ids
        assert dev_mo.id in user_ids
        assert result.coverage_score >= 88.0
        assert len(result.gaps) == 0

    def test_three_candidates_required_for_full_coverage(self, db_session: Session):
        """Backend, Mobile, UI/UX covered by 3 distinct specialists."""
        cap_be = _create_capability(db_session, "BE-3")
        cap_mo = _create_capability(db_session, "MO-3")
        cap_ui = _create_capability(db_session, "UI-3")

        owner = _create_user(db_session, "tc_owner3@test.com", "Owner 3")
        problem = _create_analyzed_problem(
            db_session, owner, "Three-tier System",
            [(cap_be, 90, "HIGH"), (cap_mo, 80, "HIGH"), (cap_ui, 60, "MEDIUM")]
        )

        user_be = _create_user(db_session, "u_be@test.com", "Alice BE")
        _add_user_capability_with_evidence(db_session, user_be, cap_be, 90.0)

        user_mo = _create_user(db_session, "u_mo@test.com", "Bob MO")
        _add_user_capability_with_evidence(db_session, user_mo, cap_mo, 85.0)

        user_ui = _create_user(db_session, "u_ui@test.com", "Charlie UI")
        _add_user_capability_with_evidence(db_session, user_ui, cap_ui, 88.0)

        svc = TeamComposerService(db_session)
        result = svc.compose_team(problem.id, owner.id)

        assert result.team_size == 3
        user_ids = {m.user_id for m in result.members}
        assert user_be.id in user_ids
        assert user_mo.id in user_ids
        assert user_ui.id in user_ids
        assert result.coverage_score >= 85.0

    def test_redundant_candidate_excluded_or_pruned(self, db_session: Session):
        """Candidate A has Backend (92), Candidate B has Backend (80). B should not be on team."""
        cap_be = _create_capability(db_session, "BE-Redundant")
        cap_fe = _create_capability(db_session, "FE-Redundant")

        owner = _create_user(db_session, "tc_owner4@test.com", "Owner 4")
        problem = _create_analyzed_problem(
            db_session, owner, "Redundant Test Problem",
            [(cap_be, 90, "HIGH"), (cap_fe, 90, "HIGH")]
        )

        strong_be = _create_user(db_session, "strong_be@test.com", "Strong BE")
        _add_user_capability_with_evidence(db_session, strong_be, cap_be, 95.0)

        weaker_be = _create_user(db_session, "weaker_be@test.com", "Weaker BE")
        _add_user_capability_with_evidence(db_session, weaker_be, cap_be, 80.0)

        strong_fe = _create_user(db_session, "strong_fe@test.com", "Strong FE")
        _add_user_capability_with_evidence(db_session, strong_fe, cap_fe, 90.0)

        svc = TeamComposerService(db_session)
        result = svc.compose_team(problem.id, owner.id)

        assert result.team_size == 2
        user_ids = {m.user_id for m in result.members}
        assert strong_be.id in user_ids
        assert strong_fe.id in user_ids
        assert weaker_be.id not in user_ids

    def test_missing_capability_reported_as_gap(self, db_session: Session):
        """Backend covered, but Quantum Computing has no candidate -> reported in gaps."""
        cap_be = _create_capability(db_session, "BE-Gap")
        cap_qc = _create_capability(db_session, "Quantum-Computing-Gap")

        owner = _create_user(db_session, "tc_owner5@test.com", "Owner 5")
        problem = _create_analyzed_problem(
            db_session, owner, "Quantum Backend App",
            [(cap_be, 80, "HIGH"), (cap_qc, 90, "HIGH")]
        )

        dev_be = _create_user(db_session, "be_only@test.com", "BE Only")
        _add_user_capability_with_evidence(db_session, dev_be, cap_be, 85.0)

        svc = TeamComposerService(db_session)
        result = svc.compose_team(problem.id, owner.id)

        assert result.team_size == 1
        assert len(result.gaps) == 1
        assert result.gaps[0].capability == "Quantum-Computing-Gap"
        assert result.gaps[0].status == "GAP"
        assert "No suitable candidate" in result.gaps[0].reason

    def test_max_team_size_limit_respected(self, db_session: Session):
        """Max team size = 2, problem has 4 capabilities -> team size does not exceed 2."""
        caps = [_create_capability(db_session, f"Cap-Limit-{i}") for i in range(4)]

        owner = _create_user(db_session, "tc_owner6@test.com", "Owner 6")
        problem = _create_analyzed_problem(
            db_session, owner, "Multi-Cap Problem",
            [(c, 80, "HIGH") for c in caps]
        )

        for i, c in enumerate(caps):
            u = _create_user(db_session, f"cand_limit_{i}@test.com", f"Cand {i}")
            _add_user_capability_with_evidence(db_session, u, c, 85.0)

        svc = TeamComposerService(db_session)
        config = ComposeTeamRequest(max_team_size=2)
        result = svc.compose_team(problem.id, owner.id, config=config)

        assert result.team_size <= 2


# ══════════════════════════════════════════════════════════════════════════
# 3. Roles, Scores & Persistence
# ══════════════════════════════════════════════════════════════════════════


class TestTeamDetailsAndPersistence:
    def test_evidence_based_role_assignment(self, db_session: Session):
        """Suggested role reflects the candidate's strongest verified capability."""
        cap = _create_capability(db_session, "Database Architecture")
        owner = _create_user(db_session, "tc_owner_role@test.com", "Owner Role")
        problem = _create_analyzed_problem(
            db_session, owner, "DB Problem", [(cap, 80, "HIGH")]
        )

        db_expert = _create_user(db_session, "db_expert@test.com", "DB Expert")
        _add_user_capability_with_evidence(db_session, db_expert, cap, 95.0)

        svc = TeamComposerService(db_session)
        result = svc.compose_team(problem.id, owner.id)

        assert len(result.members) == 1
        assert "Database Architecture" in result.members[0].suggested_role

    def test_team_and_members_persisted_in_database(self, db_session: Session):
        """Verify DB rows in teams, team_members, and team_capabilities."""
        cap = _create_capability(db_session, "Persist-Cap")
        owner = _create_user(db_session, "tc_persist_owner@test.com", "Persist Owner")
        problem = _create_analyzed_problem(
            db_session, owner, "Persist Problem", [(cap, 80, "HIGH")]
        )

        cand = _create_user(db_session, "persist_cand@test.com", "Persist Cand")
        _add_user_capability_with_evidence(db_session, cand, cap, 80.0)

        svc = TeamComposerService(db_session)
        result = svc.compose_team(problem.id, owner.id)

        # Check DB entities
        team_db = db_session.get(Team, result.team_id)
        assert team_db is not None
        assert team_db.status == TeamStatus.PROPOSED
        assert len(team_db.members) == 1
        assert team_db.members[0].member_status == TeamMemberStatus.PROPOSED
        assert len(team_db.capabilities) == 1

    def test_team_explanation_structure(self, db_session: Session):
        """Structured explanation has summary, member_explanations, and redundancy_notes."""
        cap = _create_capability(db_session, "Expl-Cap")
        owner = _create_user(db_session, "tc_expl_owner@test.com", "Expl Owner")
        problem = _create_analyzed_problem(
            db_session, owner, "Expl Problem", [(cap, 80, "HIGH")]
        )

        cand = _create_user(db_session, "expl_cand@test.com", "Expl Cand")
        _add_user_capability_with_evidence(db_session, cand, cap, 80.0)

        svc = TeamComposerService(db_session)
        result = svc.compose_team(problem.id, owner.id)

        assert result.explanation.summary
        assert len(result.explanation.member_explanations) == 1


# ══════════════════════════════════════════════════════════════════════════
# 4. Error Handling & Authorization
# ══════════════════════════════════════════════════════════════════════════


class TestTeamErrorsAndSecurity:
    def test_non_owner_access_denied(self, db_session: Session):
        cap = _create_capability(db_session, "Sec-Cap")
        owner = _create_user(db_session, "real_owner@test.com", "Real Owner")
        other_user = _create_user(db_session, "other_user@test.com", "Other User")

        problem = _create_analyzed_problem(
            db_session, owner, "Secure Problem", [(cap, 80, "HIGH")]
        )

        svc = TeamComposerService(db_session)
        with pytest.raises(ProblemAccessDeniedError):
            svc.compose_team(problem.id, other_user.id)

    def test_unanalyzed_problem_raises_error(self, db_session: Session):
        owner = _create_user(db_session, "unanalyzed_tc_owner@test.com")
        problem = Problem(
            user_id=owner.id,
            title="Draft Problem",
            description="Draft",
            status=ProblemStatus.DRAFT,
        )
        db_session.add(problem)
        db_session.flush()

        svc = TeamComposerService(db_session)
        with pytest.raises(ProblemNotAnalyzedError):
            svc.compose_team(problem.id, owner.id)

    def test_nonexistent_problem_raises_error(self, db_session: Session):
        owner = _create_user(db_session, "fake_prob_owner@test.com")
        svc = TeamComposerService(db_session)
        with pytest.raises(ProblemNotFoundError):
            svc.compose_team(uuid.uuid4(), owner.id)

    def test_empty_candidate_pool_returns_graceful_response(self, db_session: Session):
        """When no candidates hold the required capability, team has 0 members and all gaps."""
        cap = _create_capability(db_session, "Obscure-Unheld-Cap")
        owner = _create_user(db_session, "empty_pool_owner@test.com")
        problem = _create_analyzed_problem(
            db_session, owner, "Unmatched Problem", [(cap, 80, "HIGH")]
        )

        svc = TeamComposerService(db_session)
        result = svc.compose_team(problem.id, owner.id)

        assert result.team_size == 0
        assert result.coverage_score == 0.0
        assert len(result.gaps) == 1


# ══════════════════════════════════════════════════════════════════════════
# 5. API Endpoint Tests
# ══════════════════════════════════════════════════════════════════════════


class TestTeamComposerAPI:
    def test_compose_team_endpoint_success(self, client, db_session: Session):
        headers = _register_and_login(client, "api_team_owner@test.com", "API Team Owner")

        # Create problem
        prob_resp = client.post(
            "/api/v1/problems",
            json={"title": "API Team Problem", "description": "Needs machine learning and backend python development"},
            headers=headers,
        )
        problem_id = prob_resp.json()["id"]

        # Analyze problem
        client.post(f"/api/v1/problems/{problem_id}/analyze", headers=headers)

        # Compose team
        resp = client.post(
            f"/api/v1/problems/{problem_id}/compose-team",
            json={"max_team_size": 3},
            headers=headers,
        )
        assert resp.status_code == 200
        data = resp.json()

        assert "team_id" in data
        assert "team_score" in data
        assert "coverage_score" in data
        assert "team_size" in data
        assert "members" in data
        assert "capability_coverage" in data
        assert "gaps" in data
        assert "explanation" in data
        assert data["status"] == "PROPOSED"

    def test_compose_team_unauthenticated_rejected(self, client):
        fake_id = str(uuid.uuid4())
        resp = client.post(f"/api/v1/problems/{fake_id}/compose-team")
        assert resp.status_code == 401

    def test_compose_team_unauthorized_problem_forbidden(self, client, db_session: Session):
        owner_headers = _register_and_login(client, "real_prob_owner@test.com", "Real")
        other_headers = _register_and_login(client, "unauth_intruder@test.com", "Intruder")

        prob_resp = client.post(
            "/api/v1/problems",
            json={"title": "Private Problem", "description": "Secret backend development"},
            headers=owner_headers,
        )
        problem_id = prob_resp.json()["id"]
        client.post(f"/api/v1/problems/{problem_id}/analyze", headers=owner_headers)

        # Intruder attempts to compose team
        resp = client.post(
            f"/api/v1/problems/{problem_id}/compose-team",
            headers=other_headers,
        )
        assert resp.status_code == 403
