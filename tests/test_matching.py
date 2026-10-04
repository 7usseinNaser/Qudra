"""Comprehensive tests for Feature 7: Explainable Matching.

Tests cover:
- Matching service initialization and weight configuration
- Candidate discovery (batch queries)
- Component score calculations (capability, practical, oral, project relevance, freshness)
- Total score formula with MATCHING_WEIGHTS
- Explanation builder (strengths, gaps, relevant projects)
- End-to-end matching via API endpoints
- Recalculation endpoint
- Edge cases (no candidates, no evidence, unanalyzed problems)
- Ranking determinism (descending total_score)
- MatchResult persistence
"""

import uuid
from datetime import datetime, timezone

import pytest
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.db.models.capability import Capability
from app.db.models.evidence import Evidence, EvidenceType, VerificationStatus
from app.db.models.match_result import MatchResult
from app.db.models.problem import (
    Problem,
    ProblemAnalysis,
    ProblemCapability,
    ProblemStatus,
)
from app.db.models.project import Project, ProjectStatus
from app.db.models.project_capability import ProjectCapability
from app.db.models.user import User
from app.db.models.user_capability import UserCapability
from app.services.matching_service import MATCHING_WEIGHTS, MatchingService


# ── Helpers ──────────────────────────────────────────────────────────────


def _make_user(db: Session, email: str, name: str = "Test User", active: bool = True) -> User:
    user = User(
        email=email,
        hashed_password=hash_password("Pass1234!"),
        full_name=name,
        is_active=active,
    )
    db.add(user)
    db.flush()
    return user


def _make_capability(db: Session, name: str) -> Capability:
    cap = Capability(name=name, description=f"{name} capability")
    db.add(cap)
    db.flush()
    return cap


def _make_analyzed_problem(
    db: Session,
    user: User,
    title: str,
    capabilities: list[tuple[Capability, int, str]],
) -> Problem:
    """Creates a fully analyzed problem with linked capabilities.

    capabilities: list of (Capability, importance_int, required_level_str)
    """
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
        solution_direction="Build a solution",
    )
    db.add(analysis)
    db.flush()

    for cap, importance, req_level in capabilities:
        pc = ProblemCapability(
            problem_id=problem.id,
            capability_id=cap.id,
            importance=importance,
            required_level=req_level,
            reason=f"Required: {cap.name}",
        )
        db.add(pc)
    db.flush()
    db.refresh(problem)
    return problem


def _make_user_capability(
    db: Session,
    user: User,
    cap: Capability,
    evidence_strength: float = 0.0,
    breakdown: dict | None = None,
) -> UserCapability:
    uc = UserCapability(
        user_id=user.id,
        capability_id=cap.id,
        strength=evidence_strength,
        evidence_strength=evidence_strength,
        evidence_count=1,
        last_evaluated_at=datetime.now(timezone.utc),
        breakdown=breakdown or {"practical": 0, "project": 0, "oral": 0, "freshness": 0},
    )
    db.add(uc)
    db.flush()
    return uc


def _make_evidence(
    db: Session,
    user: User,
    cap: Capability,
    etype: EvidenceType = EvidenceType.PRACTICAL,
    score: float = 80.0,
    project_id: uuid.UUID | None = None,
) -> Evidence:
    ev = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=etype,
        title=f"{etype.value} evidence for {cap.name}",
        description="Test evidence",
        strength=score,
        score=score,
        verification_status=VerificationStatus.VERIFIED,
        project_id=project_id,
    )
    db.add(ev)
    db.flush()
    return ev


def _make_project(db: Session, user: User, title: str = "Test Project") -> Project:
    project = Project(
        owner_id=user.id,
        title=title,
        description="Test project",
        status=ProjectStatus.COMPLETED,
    )
    db.add(project)
    db.flush()
    return project


def _make_project_capability(db: Session, project: Project, cap: Capability) -> ProjectCapability:
    pc = ProjectCapability(project_id=project.id, capability_id=cap.id)
    db.add(pc)
    db.flush()
    return pc


def _register_and_login(client, email: str = "owner@test.com", name: str = "Owner"):
    """Registers a user and returns the auth header."""
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
# 1. MATCHING_WEIGHTS configuration
# ══════════════════════════════════════════════════════════════════════════


class TestMatchingWeights:
    def test_weights_sum_to_one(self):
        total = sum(MATCHING_WEIGHTS.values())
        assert abs(total - 1.0) < 1e-6

    def test_weights_keys_present(self):
        expected = {"capability_match", "practical", "project_relevance", "oral", "freshness"}
        assert set(MATCHING_WEIGHTS.keys()) == expected

    def test_capability_match_is_dominant(self):
        assert MATCHING_WEIGHTS["capability_match"] >= max(
            MATCHING_WEIGHTS["practical"],
            MATCHING_WEIGHTS["project_relevance"],
            MATCHING_WEIGHTS["oral"],
            MATCHING_WEIGHTS["freshness"],
        )


# ══════════════════════════════════════════════════════════════════════════
# 2. Candidate Discovery
# ══════════════════════════════════════════════════════════════════════════


class TestCandidateDiscovery:
    def test_finds_users_with_required_capabilities(self, db_session: Session):
        cap = _make_capability(db_session, "Python-disc")
        user = _make_user(db_session, "disc1@test.com", "Disc User")
        _make_user_capability(db_session, user, cap, evidence_strength=80.0)

        svc = MatchingService(db_session)
        candidates = svc.find_candidates([cap.id])
        assert len(candidates) == 1
        assert candidates[0].id == user.id

    def test_excludes_inactive_users(self, db_session: Session):
        cap = _make_capability(db_session, "Python-inactive")
        active = _make_user(db_session, "active@test.com", "Active", active=True)
        inactive = _make_user(db_session, "inactive@test.com", "Inactive", active=False)
        _make_user_capability(db_session, active, cap, evidence_strength=80.0)
        _make_user_capability(db_session, inactive, cap, evidence_strength=80.0)

        svc = MatchingService(db_session)
        candidates = svc.find_candidates([cap.id])
        ids = {c.id for c in candidates}
        assert active.id in ids
        assert inactive.id not in ids

    def test_no_candidates_with_empty_cap_ids(self, db_session: Session):
        svc = MatchingService(db_session)
        assert svc.find_candidates([]) == []


# ══════════════════════════════════════════════════════════════════════════
# 3. Capability Match Score
# ══════════════════════════════════════════════════════════════════════════


class TestCapabilityMatchScore:
    def test_full_coverage_high_scores(self, db_session: Session):
        cap = _make_capability(db_session, "React-cap")
        user = _make_user(db_session, "cap1@test.com")
        uc = _make_user_capability(db_session, user, cap, evidence_strength=90.0)

        problem_owner = _make_user(db_session, "capowner@test.com")
        problem = _make_analyzed_problem(
            db_session, problem_owner, "React Problem", [(cap, 80, "HIGH")]
        )

        svc = MatchingService(db_session)
        user_caps = {cap.id: uc}
        score, breakdowns = svc.calculate_capability_match(
            user_caps, problem.capabilities
        )
        assert score == 90.0
        assert len(breakdowns) == 1
        assert breakdowns[0].status == "COVERED"

    def test_zero_evidence_gives_gap(self, db_session: Session):
        cap = _make_capability(db_session, "Docker-cap")
        user = _make_user(db_session, "cap2@test.com")

        problem_owner = _make_user(db_session, "capowner2@test.com")
        problem = _make_analyzed_problem(
            db_session, problem_owner, "Docker Problem", [(cap, 90, "HIGH")]
        )

        svc = MatchingService(db_session)
        score, breakdowns = svc.calculate_capability_match({}, problem.capabilities)
        assert score == 0.0
        assert breakdowns[0].status == "GAP"

    def test_partial_coverage(self, db_session: Session):
        cap = _make_capability(db_session, "SQL-cap")
        user = _make_user(db_session, "cap3@test.com")
        uc = _make_user_capability(db_session, user, cap, evidence_strength=50.0)

        problem_owner = _make_user(db_session, "capowner3@test.com")
        problem = _make_analyzed_problem(
            db_session, problem_owner, "SQL Problem", [(cap, 60, "MEDIUM")]
        )

        svc = MatchingService(db_session)
        score, breakdowns = svc.calculate_capability_match(
            {cap.id: uc}, problem.capabilities
        )
        assert score == 50.0
        assert breakdowns[0].status == "PARTIAL"


# ══════════════════════════════════════════════════════════════════════════
# 4. Practical / Oral Evidence Scores
# ══════════════════════════════════════════════════════════════════════════


class TestEvidenceScores:
    def test_practical_score_from_evidence(self, db_session: Session):
        cap = _make_capability(db_session, "Go-prac")
        user = _make_user(db_session, "prac1@test.com")
        _make_evidence(db_session, user, cap, EvidenceType.PRACTICAL, score=85.0)

        svc = MatchingService(db_session)
        score = svc.calculate_practical_score(user.id, [cap.id])
        assert score == 85.0

    def test_oral_score_from_evidence(self, db_session: Session):
        cap = _make_capability(db_session, "Go-oral")
        user = _make_user(db_session, "oral1@test.com")
        _make_evidence(db_session, user, cap, EvidenceType.ORAL, score=70.0)

        svc = MatchingService(db_session)
        score = svc.calculate_oral_score(user.id, [cap.id])
        assert score == 70.0

    def test_no_evidence_returns_zero(self, db_session: Session):
        cap = _make_capability(db_session, "Rust-noev")
        user = _make_user(db_session, "noev@test.com")

        svc = MatchingService(db_session)
        assert svc.calculate_practical_score(user.id, [cap.id]) == 0.0
        assert svc.calculate_oral_score(user.id, [cap.id]) == 0.0


# ══════════════════════════════════════════════════════════════════════════
# 5. Project Relevance Score
# ══════════════════════════════════════════════════════════════════════════


class TestProjectRelevance:
    def test_full_project_coverage(self, db_session: Session):
        cap1 = _make_capability(db_session, "JS-proj")
        cap2 = _make_capability(db_session, "TS-proj")
        user = _make_user(db_session, "proj1@test.com")
        project = _make_project(db_session, user, "My JS/TS Project")
        _make_project_capability(db_session, project, cap1)
        _make_project_capability(db_session, project, cap2)

        svc = MatchingService(db_session)
        score, titles = svc.calculate_project_relevance(user.id, [cap1.id, cap2.id])
        assert score == 100.0
        assert "My JS/TS Project" in titles

    def test_partial_project_coverage(self, db_session: Session):
        cap1 = _make_capability(db_session, "Vue-proj")
        cap2 = _make_capability(db_session, "Angular-proj")
        user = _make_user(db_session, "proj2@test.com")
        project = _make_project(db_session, user, "Vue Project")
        _make_project_capability(db_session, project, cap1)

        svc = MatchingService(db_session)
        score, titles = svc.calculate_project_relevance(user.id, [cap1.id, cap2.id])
        assert score == 50.0

    def test_no_projects_returns_zero(self, db_session: Session):
        cap = _make_capability(db_session, "Dart-proj")
        user = _make_user(db_session, "proj3@test.com")

        svc = MatchingService(db_session)
        score, titles = svc.calculate_project_relevance(user.id, [cap.id])
        assert score == 0.0
        assert titles == []


# ══════════════════════════════════════════════════════════════════════════
# 6. Total Score Formula
# ══════════════════════════════════════════════════════════════════════════


class TestTotalScore:
    def test_total_score_formula(self, db_session: Session):
        svc = MatchingService(db_session)
        total = svc.calculate_total_score(
            capability_score=80.0,
            practical_score=60.0,
            project_relevance_score=50.0,
            oral_score=70.0,
            freshness_score=100.0,
        )
        expected = (
            80.0 * 0.40
            + 60.0 * 0.25
            + 50.0 * 0.20
            + 70.0 * 0.10
            + 100.0 * 0.05
        )
        assert total == round(expected, 1)

    def test_all_zero(self, db_session: Session):
        svc = MatchingService(db_session)
        assert svc.calculate_total_score(0, 0, 0, 0, 0) == 0.0

    def test_all_max(self, db_session: Session):
        svc = MatchingService(db_session)
        assert svc.calculate_total_score(100, 100, 100, 100, 100) == 100.0


# ══════════════════════════════════════════════════════════════════════════
# 7. Explanation Builder
# ══════════════════════════════════════════════════════════════════════════


class TestExplanationBuilder:
    def test_explanation_with_mixed_statuses(self, db_session: Session):
        from app.schemas.matching import MatchCapabilityBreakdown

        svc = MatchingService(db_session)
        breakdowns = [
            MatchCapabilityBreakdown(
                capability_id=uuid.uuid4(),
                capability_name="Python",
                required_level="HIGH",
                importance=90,
                user_score=85.0,
                status="COVERED",
            ),
            MatchCapabilityBreakdown(
                capability_id=uuid.uuid4(),
                capability_name="Docker",
                required_level="MEDIUM",
                importance=60,
                user_score=0.0,
                status="GAP",
            ),
        ]
        expl = svc.build_explanation("Alice", 65.0, breakdowns, ["My Project"])
        assert "Alice" in expl.summary
        assert "1/2" in expl.summary
        assert len(expl.strengths) == 1
        assert "Python" in expl.strengths[0]
        assert len(expl.gaps) == 1
        assert "Docker" in expl.gaps[0]
        assert "My Project" in expl.relevant_projects


# ══════════════════════════════════════════════════════════════════════════
# 8. Freshness Score
# ══════════════════════════════════════════════════════════════════════════


class TestFreshnessScore:
    def test_recent_evidence_high_freshness(self, db_session: Session):
        cap = _make_capability(db_session, "Fresh-cap")
        user = _make_user(db_session, "fresh1@test.com")
        _make_evidence(db_session, user, cap, EvidenceType.PRACTICAL, score=80.0)

        svc = MatchingService(db_session)
        score = svc.calculate_freshness(user.id, [cap.id])
        assert score == 100.0  # < 180 days

    def test_no_evidence_zero_freshness(self, db_session: Session):
        cap = _make_capability(db_session, "Stale-cap")
        user = _make_user(db_session, "fresh2@test.com")

        svc = MatchingService(db_session)
        assert svc.calculate_freshness(user.id, [cap.id]) == 0.0


# ══════════════════════════════════════════════════════════════════════════
# 9. End-to-End Matching (Service Layer)
# ══════════════════════════════════════════════════════════════════════════


class TestEndToEndMatching:
    def test_find_matches_with_candidates(self, db_session: Session):
        """Full matching scenario: 2 candidates, 2 required capabilities."""
        cap_py = _make_capability(db_session, "Python-e2e")
        cap_db = _make_capability(db_session, "Postgres-e2e")

        owner = _make_user(db_session, "e2eowner@test.com", "Owner")
        problem = _make_analyzed_problem(
            db_session, owner, "Backend E2E",
            [(cap_py, 90, "HIGH"), (cap_db, 70, "MEDIUM")],
        )

        # Candidate 1 — strong Python, no DB
        c1 = _make_user(db_session, "e2ec1@test.com", "Alice")
        _make_user_capability(db_session, c1, cap_py, evidence_strength=90.0)
        _make_evidence(db_session, c1, cap_py, EvidenceType.PRACTICAL, score=85.0)

        # Candidate 2 — moderate both
        c2 = _make_user(db_session, "e2ec2@test.com", "Bob")
        _make_user_capability(db_session, c2, cap_py, evidence_strength=60.0)
        _make_user_capability(db_session, c2, cap_db, evidence_strength=65.0)
        _make_evidence(db_session, c2, cap_py, EvidenceType.PRACTICAL, score=55.0)
        _make_evidence(db_session, c2, cap_db, EvidenceType.PRACTICAL, score=60.0)

        svc = MatchingService(db_session)
        result = svc.find_matches(problem.id)

        assert result.problem_id == problem.id
        assert result.total_candidates == 2
        assert len(result.matches) == 2
        # Ranked by total_score
        assert result.matches[0].total_score >= result.matches[1].total_score
        # Explanations are populated
        assert result.matches[0].explanation.summary
        assert len(result.matches[0].capability_breakdown) == 2

    def test_find_matches_no_candidates(self, db_session: Session):
        """Problem with required capability that no user has."""
        cap = _make_capability(db_session, "Obscure-e2e")
        owner = _make_user(db_session, "e2enone@test.com", "Owner2")
        problem = _make_analyzed_problem(
            db_session, owner, "Obscure Problem", [(cap, 80, "HIGH")]
        )

        svc = MatchingService(db_session)
        result = svc.find_matches(problem.id)
        assert result.total_candidates == 0
        assert result.matches == []

    def test_find_matches_unanalyzed_problem_raises(self, db_session: Session):
        from app.core.exceptions import ProblemNotAnalyzedError

        owner = _make_user(db_session, "e2eunanalyzed@test.com")
        problem = Problem(
            user_id=owner.id,
            title="Draft Problem",
            description="Not analyzed",
            status=ProblemStatus.DRAFT,
        )
        db_session.add(problem)
        db_session.flush()

        svc = MatchingService(db_session)
        with pytest.raises(ProblemNotAnalyzedError):
            svc.find_matches(problem.id)

    def test_find_matches_nonexistent_problem_raises(self, db_session: Session):
        from app.core.exceptions import ProblemNotFoundError

        svc = MatchingService(db_session)
        with pytest.raises(ProblemNotFoundError):
            svc.find_matches(uuid.uuid4())


# ══════════════════════════════════════════════════════════════════════════
# 10. Recalculation
# ══════════════════════════════════════════════════════════════════════════


class TestRecalculation:
    def test_recalculate_clears_and_rebuilds(self, db_session: Session):
        cap = _make_capability(db_session, "Recalc-cap")
        owner = _make_user(db_session, "recalc_owner@test.com", "RecalcOwner")
        problem = _make_analyzed_problem(
            db_session, owner, "Recalc Problem", [(cap, 80, "HIGH")]
        )
        candidate = _make_user(db_session, "recalc_c@test.com", "RecalcCandidate")
        _make_user_capability(db_session, candidate, cap, evidence_strength=70.0)
        _make_evidence(db_session, candidate, cap, EvidenceType.PRACTICAL, score=70.0)

        svc = MatchingService(db_session)
        result1 = svc.find_matches(problem.id)
        assert result1.total_candidates == 1

        result2 = svc.recalculate_matches(problem.id)
        assert result2.total_candidates == 1
        assert result2.matches[0].total_score == result1.matches[0].total_score


# ══════════════════════════════════════════════════════════════════════════
# 11. MatchResult Persistence
# ══════════════════════════════════════════════════════════════════════════


class TestMatchResultPersistence:
    def test_results_are_persisted(self, db_session: Session):
        cap = _make_capability(db_session, "Persist-cap")
        owner = _make_user(db_session, "persist_owner@test.com", "PersistOwner")
        problem = _make_analyzed_problem(
            db_session, owner, "Persist Problem", [(cap, 80, "HIGH")]
        )
        candidate = _make_user(db_session, "persist_c@test.com", "PersistCandidate")
        _make_user_capability(db_session, candidate, cap, evidence_strength=75.0)
        _make_evidence(db_session, candidate, cap, EvidenceType.PRACTICAL, score=75.0)

        svc = MatchingService(db_session)
        svc.find_matches(problem.id)

        from sqlalchemy import select
        stmt = select(MatchResult).where(MatchResult.problem_id == problem.id)
        rows = list(db_session.execute(stmt).scalars().all())
        assert len(rows) == 1
        assert rows[0].user_id == candidate.id
        assert rows[0].total_score > 0


# ══════════════════════════════════════════════════════════════════════════
# 12. API Endpoint Tests
# ══════════════════════════════════════════════════════════════════════════


class TestMatchingAPI:
    def test_get_matches_endpoint(self, client, db_session: Session):
        """Test GET /api/v1/problems/{id}/matches returns valid response."""
        headers = _register_and_login(client, "matchapi@test.com", "MatchOwner")

        # Create capability + problem via API
        cap_resp = client.post(
            "/api/v1/capabilities",
            json={"name": "API-Match-Cap", "description": "Test"},
            headers=headers,
        )
        cap_id = cap_resp.json()["id"]

        prob_resp = client.post(
            "/api/v1/problems",
            json={"title": "API Match Problem", "description": "testing machine learning and api design"},
            headers=headers,
        )
        problem_id = prob_resp.json()["id"]

        # Analyze the problem
        client.post(f"/api/v1/problems/{problem_id}/analyze", headers=headers)

        # Get matches
        resp = client.get(f"/api/v1/problems/{problem_id}/matches", headers=headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "problem_id" in data
        assert "total_candidates" in data
        assert "matches" in data
        assert "weights" in data

    def test_recalculate_matches_endpoint(self, client, db_session: Session):
        """Test POST /api/v1/problems/{id}/matches/recalculate."""
        headers = _register_and_login(client, "recalcapi@test.com", "RecalcAPI")

        prob_resp = client.post(
            "/api/v1/problems",
            json={"title": "Recalc API Problem", "description": "testing web development and python"},
            headers=headers,
        )
        problem_id = prob_resp.json()["id"]
        client.post(f"/api/v1/problems/{problem_id}/analyze", headers=headers)

        resp = client.post(
            f"/api/v1/problems/{problem_id}/matches/recalculate",
            headers=headers,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["problem_id"] == problem_id

    def test_matches_unanalyzed_returns_400(self, client, db_session: Session):
        """Test that matching an unanalyzed problem returns 400."""
        headers = _register_and_login(client, "unanalyzed_api@test.com", "Unanalyzed")

        prob_resp = client.post(
            "/api/v1/problems",
            json={"title": "Unanalyzed", "description": "draft problem"},
            headers=headers,
        )
        problem_id = prob_resp.json()["id"]

        resp = client.get(f"/api/v1/problems/{problem_id}/matches", headers=headers)
        assert resp.status_code == 400

    def test_matches_nonexistent_returns_404(self, client, db_session: Session):
        """Test that matching a non-existent problem returns 404."""
        headers = _register_and_login(client, "notfound_api@test.com", "NotFound")
        fake_id = str(uuid.uuid4())

        resp = client.get(f"/api/v1/problems/{fake_id}/matches", headers=headers)
        assert resp.status_code == 404

    def test_matches_unauthenticated_returns_401(self, client):
        """Test that matching without auth returns 401."""
        fake_id = str(uuid.uuid4())
        resp = client.get(f"/api/v1/problems/{fake_id}/matches")
        assert resp.status_code == 401


# ══════════════════════════════════════════════════════════════════════════
# 13. Ranking Determinism
# ══════════════════════════════════════════════════════════════════════════


class TestRankingDeterminism:
    def test_candidates_ranked_descending(self, db_session: Session):
        cap = _make_capability(db_session, "Rank-cap")
        owner = _make_user(db_session, "rank_owner@test.com", "RankOwner")
        problem = _make_analyzed_problem(
            db_session, owner, "Rank Problem", [(cap, 80, "HIGH")]
        )

        high_user = _make_user(db_session, "rank_high@test.com", "HighRank")
        _make_user_capability(db_session, high_user, cap, evidence_strength=95.0)
        _make_evidence(db_session, high_user, cap, EvidenceType.PRACTICAL, score=90.0)

        low_user = _make_user(db_session, "rank_low@test.com", "LowRank")
        _make_user_capability(db_session, low_user, cap, evidence_strength=30.0)
        _make_evidence(db_session, low_user, cap, EvidenceType.PRACTICAL, score=25.0)

        svc = MatchingService(db_session)
        result = svc.find_matches(problem.id)

        assert len(result.matches) == 2
        assert result.matches[0].user_name == "HighRank"
        assert result.matches[1].user_name == "LowRank"
        assert result.matches[0].total_score > result.matches[1].total_score
