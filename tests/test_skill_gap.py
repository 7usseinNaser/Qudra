import uuid
from datetime import datetime, timezone
import pytest
from sqlalchemy.orm import Session

from app.db.models.capability import Capability
from app.db.models.evidence import Evidence, EvidenceType, VerificationStatus
from app.db.models.problem import Problem, ProblemAnalysis, ProblemCapability, ProblemStatus
from app.db.models.user import User
from app.db.models.user_capability import UserCapability
from app.services.capability_scoring_service import CapabilityScoringService
from app.services.skill_gap_service import (
    IMPORTANCE_WEIGHTS,
    SKILL_GAP_THRESHOLDS,
    SkillGapService,
)


def _auth_headers(client, email="gap_user@example.com"):
    client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "strongpass123", "full_name": "Gap User"},
    )
    resp = client.post(
        "/api/v1/auth/login", data={"username": email, "password": "strongpass123"}
    )
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}


# ---------------------------------------------------------------------------
# Unit tests for SkillGapService
# ---------------------------------------------------------------------------


def test_all_capabilities_covered(db_session: Session):
    user = User(email="all_cov@example.com", hashed_password="pw", full_name="Covered")
    db_session.add(user)
    db_session.commit()

    cap1 = Capability(name="Backend Development")
    cap2 = Capability(name="Database Design")
    db_session.add_all([cap1, cap2])
    db_session.commit()

    # User has high scores for both (>70)
    uc1 = UserCapability(
        user_id=user.id,
        capability_id=cap1.id,
        strength=85.0,
        evidence_strength=85.0,
        evidence_count=2,
        last_evaluated_at=datetime.now(timezone.utc),
    )
    uc2 = UserCapability(
        user_id=user.id,
        capability_id=cap2.id,
        strength=90.0,
        evidence_strength=90.0,
        evidence_count=2,
        last_evaluated_at=datetime.now(timezone.utc),
    )
    db_session.add_all([uc1, uc2])

    problem = Problem(
        user_id=user.id,
        title="Web Platform",
        description="A scalable web platform requiring backend and database.",
        status=ProblemStatus.ANALYZED,
    )
    db_session.add(problem)
    db_session.commit()

    analysis = ProblemAnalysis(
        problem_id=problem.id,
        project_type="Web Platform",
        problem_summary="Platform summary",
        solution_direction="Modular backend",
    )
    pc1 = ProblemCapability(
        problem_id=problem.id,
        capability_id=cap1.id,
        importance=85,
        required_level="HIGH",
        reason="Core API",
    )
    pc2 = ProblemCapability(
        problem_id=problem.id,
        capability_id=cap2.id,
        importance=70,
        required_level="MEDIUM",
        reason="Data storage",
    )
    db_session.add_all([analysis, pc1, pc2])
    db_session.commit()

    service = SkillGapService(db_session)
    res = service.analyze_skill_gap(user.id, problem.id)

    assert res.summary.covered == 2
    assert res.summary.partial == 0
    assert res.summary.gaps == 0
    for item in res.capabilities:
        assert item.status == "COVERED"
        assert item.gap == 0.0
        assert item.priority == "NONE"


def test_all_capabilities_are_gaps(db_session: Session):
    user = User(email="all_gaps@example.com", hashed_password="pw", full_name="Gaps User")
    db_session.add(user)
    db_session.commit()

    cap1 = Capability(name="Rust")
    cap2 = Capability(name="Cryptography")
    db_session.add_all([cap1, cap2])
    db_session.commit()

    # User has no UserCapability records at all

    problem = Problem(
        user_id=user.id,
        title="Blockchain Node",
        description="A secure distributed node in Rust.",
        status=ProblemStatus.ANALYZED,
    )
    db_session.add(problem)
    db_session.commit()

    analysis = ProblemAnalysis(
        problem_id=problem.id,
        project_type="Blockchain",
        problem_summary="Node summary",
        solution_direction="Rust node",
    )
    pc1 = ProblemCapability(
        problem_id=problem.id,
        capability_id=cap1.id,
        importance=90,
        required_level="HIGH",
        reason="Core Rust",
    )
    pc2 = ProblemCapability(
        problem_id=problem.id,
        capability_id=cap2.id,
        importance=85,
        required_level="HIGH",
        reason="Crypto primitives",
    )
    db_session.add_all([analysis, pc1, pc2])
    db_session.commit()

    service = SkillGapService(db_session)
    res = service.analyze_skill_gap(user.id, problem.id)

    assert res.summary.covered == 0
    assert res.summary.partial == 0
    assert res.summary.gaps == 2
    assert res.overall_readiness == 0.0
    for item in res.capabilities:
        assert item.status == "GAP"
        assert item.current_score == 0.0
        assert item.gap == 70.0  # 70 - 0 = 70
        assert item.priority == "CRITICAL"  # HIGH + GAP = CRITICAL


def test_mixed_covered_partial_gap_and_readiness(db_session: Session):
    """Example from spec:

    Required:
      Backend HIGH (1.0 weight) -> score 80 -> COVERED
      Flutter HIGH (1.0 weight) -> score 50 -> PARTIAL
      Database MEDIUM (0.7 weight) -> score 90 -> COVERED

    Expected readiness:
      (80*1.0 + 50*1.0 + 90*0.7) / (1.0 + 1.0 + 0.7)
      = (80 + 50 + 63) / 2.7 = 193 / 2.7 = 71.5
    """
    user = User(email="mixed_user@example.com", hashed_password="pw", full_name="Mixed")
    db_session.add(user)
    db_session.commit()

    cap_backend = Capability(name="Backend Development")
    cap_flutter = Capability(name="Flutter")
    cap_db = Capability(name="Database")
    db_session.add_all([cap_backend, cap_flutter, cap_db])
    db_session.commit()

    db_session.add_all(
        [
            UserCapability(
                user_id=user.id,
                capability_id=cap_backend.id,
                strength=80.0,
                evidence_strength=80.0,
                last_evaluated_at=datetime.now(timezone.utc),
            ),
            UserCapability(
                user_id=user.id,
                capability_id=cap_flutter.id,
                strength=50.0,
                evidence_strength=50.0,
                last_evaluated_at=datetime.now(timezone.utc),
            ),
            UserCapability(
                user_id=user.id,
                capability_id=cap_db.id,
                strength=90.0,
                evidence_strength=90.0,
                last_evaluated_at=datetime.now(timezone.utc),
            ),
        ]
    )

    problem = Problem(
        user_id=user.id,
        title="Mobile App",
        description="Mobile and backend application.",
        status=ProblemStatus.ANALYZED,
    )
    db_session.add(problem)
    db_session.commit()

    analysis = ProblemAnalysis(
        problem_id=problem.id,
        project_type="Mobile",
        problem_summary="Summary",
        solution_direction="Flutter + Backend",
    )
    pc1 = ProblemCapability(
        problem_id=problem.id,
        capability_id=cap_backend.id,
        importance=85,
        required_level="HIGH",
        reason="API",
    )
    pc2 = ProblemCapability(
        problem_id=problem.id,
        capability_id=cap_flutter.id,
        importance=85,
        required_level="HIGH",
        reason="Client App",
    )
    pc3 = ProblemCapability(
        problem_id=problem.id,
        capability_id=cap_db.id,
        importance=60,
        required_level="MEDIUM",
        reason="Storage",
    )
    db_session.add_all([analysis, pc1, pc2, pc3])
    db_session.commit()

    service = SkillGapService(db_session)
    res = service.analyze_skill_gap(user.id, problem.id)

    assert res.summary.covered == 2
    assert res.summary.partial == 1
    assert res.summary.gaps == 0

    expected_readiness = round((80 * 1.0 + 50 * 1.0 + 90 * 0.7) / (1.0 + 1.0 + 0.7), 1)
    assert res.overall_readiness == expected_readiness

    backend_item = next(c for c in res.capabilities if c.capability_id == cap_backend.id)
    flutter_item = next(c for c in res.capabilities if c.capability_id == cap_flutter.id)
    db_item = next(c for c in res.capabilities if c.capability_id == cap_db.id)

    assert backend_item.status == "COVERED"
    assert backend_item.gap == 0.0
    assert backend_item.priority == "NONE"

    assert flutter_item.status == "PARTIAL"
    assert flutter_item.gap == 20.0  # 70 - 50 = 20
    assert flutter_item.priority == "HIGH"  # HIGH req + PARTIAL = HIGH

    assert db_item.status == "COVERED"
    assert db_item.gap == 0.0
    assert db_item.priority == "NONE"


def test_gap_priorities_matrix(db_session: Session):
    """Verify priority mapping across all levels and statuses:

    HIGH + GAP -> CRITICAL
    HIGH + PARTIAL -> HIGH
    MEDIUM + GAP -> HIGH
    MEDIUM + PARTIAL -> MEDIUM
    LOW + GAP -> LOW
    LOW + PARTIAL -> LOW
    ANY + COVERED -> NONE
    """
    service = SkillGapService(db_session)

    assert service.calculate_priority("HIGH", "GAP") == "CRITICAL"
    assert service.calculate_priority("HIGH", "PARTIAL") == "HIGH"
    assert service.calculate_priority("HIGH", "COVERED") == "NONE"

    assert service.calculate_priority("MEDIUM", "GAP") == "HIGH"
    assert service.calculate_priority("MEDIUM", "PARTIAL") == "MEDIUM"
    assert service.calculate_priority("MEDIUM", "COVERED") == "NONE"

    assert service.calculate_priority("LOW", "GAP") == "LOW"
    assert service.calculate_priority("LOW", "PARTIAL") == "LOW"
    assert service.calculate_priority("LOW", "COVERED") == "NONE"


def test_boundary_scores_0_and_100(db_session: Session):
    service = SkillGapService(db_session)

    # Score 0
    assert service.classify_capability(0.0, "HIGH") == "GAP"
    assert service.calculate_gap(0.0) == 70.0

    # Score exactly 40 (partial threshold)
    assert service.classify_capability(40.0, "HIGH") == "PARTIAL"
    assert service.calculate_gap(40.0) == 30.0

    # Score exactly 70 (covered threshold)
    assert service.classify_capability(70.0, "HIGH") == "COVERED"
    assert service.calculate_gap(70.0) == 0.0

    # Score 100
    assert service.classify_capability(100.0, "HIGH") == "COVERED"
    assert service.calculate_gap(100.0) == 0.0


def test_duplicate_required_capabilities_deduplication(db_session: Session):
    user = User(email="dup_req@example.com", hashed_password="pw", full_name="Dup Req")
    db_session.add(user)
    db_session.commit()

    cap = Capability(name="Python")
    db_session.add(cap)
    db_session.commit()

    problem = Problem(
        user_id=user.id,
        title="Data Script",
        description="Script in python.",
        status=ProblemStatus.ANALYZED,
    )
    db_session.add(problem)
    db_session.commit()

    analysis = ProblemAnalysis(problem_id=problem.id, project_type="Script")
    pc1 = ProblemCapability(
        problem_id=problem.id,
        capability_id=cap.id,
        importance=50,
        required_level="MEDIUM",
    )
    db_session.add_all([analysis, pc1])
    db_session.commit()

    service = SkillGapService(db_session)
    res = service.analyze_skill_gap(user.id, problem.id)
    assert len(res.capabilities) == 1


def test_consistency_with_feature_5_scores(db_session: Session):
    """When a UserCapability is evaluated through Feature 5 CapabilityScoringService,

    Feature 6 must consume the exact same score.
    """
    user = User(email="f5_cons@example.com", hashed_password="pw", full_name="F5 User")
    db_session.add(user)
    db_session.commit()

    cap = Capability(name="Cloud Computing")
    db_session.add(cap)
    db_session.commit()

    # Add verified practical evidence with score 80
    ev = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.PRACTICAL,
        title="Deployed to AWS",
        strength=80.0,
        score=80.0,
        verification_status=VerificationStatus.VERIFIED,
    )
    db_session.add(ev)
    db_session.commit()

    # Calculate score using Feature 5
    f5_service = CapabilityScoringService(db_session)
    uc = f5_service.recalculate_user_capability(user.id, cap.id)
    expected_f5_score = uc.evidence_strength

    problem = Problem(
        user_id=user.id,
        title="Cloud Migration",
        description="Migrate infrastructure to cloud.",
        status=ProblemStatus.ANALYZED,
    )
    db_session.add(problem)
    db_session.commit()

    analysis = ProblemAnalysis(problem_id=problem.id, project_type="Cloud")
    pc = ProblemCapability(
        problem_id=problem.id,
        capability_id=cap.id,
        importance=80,
        required_level="HIGH",
    )
    db_session.add_all([analysis, pc])
    db_session.commit()

    f6_service = SkillGapService(db_session)
    res = f6_service.analyze_skill_gap(user.id, problem.id)

    assert len(res.capabilities) == 1
    assert res.capabilities[0].current_score == expected_f5_score


# ---------------------------------------------------------------------------
# API Integration tests
# ---------------------------------------------------------------------------


def test_api_skill_gap_workflow(client):
    headers = _auth_headers(client, email="api_gap@example.com")

    # 1. Create a problem
    prob_resp = client.post(
        "/api/v1/problems",
        json={
            "title": "Smart Attendance Mobile App",
            "description": "A cross-platform mobile application with facial recognition and backend APIs.",
            "domain": "Education",
        },
        headers=headers,
    )
    assert prob_resp.status_code == 201
    problem_id = prob_resp.json()["id"]

    # 2. Before analysis, attempting skill-gap should return 400
    gap_pre = client.get(f"/api/v1/problems/{problem_id}/skill-gap", headers=headers)
    assert gap_pre.status_code == 400
    assert "analyzed" in gap_pre.json()["detail"].lower()

    # 3. Analyze problem
    analyze_resp = client.post(f"/api/v1/problems/{problem_id}/analyze", headers=headers)
    assert analyze_resp.status_code == 200
    req_caps = analyze_resp.json()["required_capabilities"]
    assert len(req_caps) > 0

    # Pick one required capability and add verified evidence
    target_cap_id = req_caps[0]["capability_id"]
    client.post(
        "/api/v1/evidence",
        json={
            "capability_id": target_cap_id,
            "type": "PRACTICAL",
            "title": "Completed challenge",
            "strength": 85.0,
            "score": 85.0,
            "verification_status": "VERIFIED",
        },
        headers=headers,
    )

    # 4. Request skill-gap analysis
    gap_resp = client.get(f"/api/v1/problems/{problem_id}/skill-gap", headers=headers)
    assert gap_resp.status_code == 200
    data = gap_resp.json()

    assert data["problem_id"] == problem_id
    assert "overall_readiness" in data
    assert "summary" in data
    assert "covered" in data["summary"]
    assert "partial" in data["summary"]
    assert "gaps" in data["summary"]
    assert len(data["capabilities"]) == len(req_caps)

    # Verify the target capability is evaluated with evidence
    target_eval = next(c for c in data["capabilities"] if c["capability_id"] == target_cap_id)
    assert target_eval["current_score"] > 0
    assert target_eval["status"] in ("COVERED", "PARTIAL", "GAP")
    assert target_eval["reason"] != ""

    # Test /api prefix compatibility
    gap_resp_api = client.get(f"/api/problems/{problem_id}/skill-gap", headers=headers)
    assert gap_resp_api.status_code == 200


def test_api_unauthorized_problem_access_blocked(client):
    headers_owner = _auth_headers(client, email="owner@example.com")
    headers_intruder = _auth_headers(client, email="intruder@example.com")

    # Owner creates and analyzes problem
    prob_resp = client.post(
        "/api/v1/problems",
        json={"title": "Private Problem", "description": "Highly secret platform project description."},
        headers=headers_owner,
    )
    problem_id = prob_resp.json()["id"]
    client.post(f"/api/v1/problems/{problem_id}/analyze", headers=headers_owner)

    # Intruder tries to analyze skill gap on owner's problem
    resp = client.get(f"/api/v1/problems/{problem_id}/skill-gap", headers=headers_intruder)
    assert resp.status_code == 403


def test_api_unauthenticated_request_rejected(client):
    fake_id = str(uuid.uuid4())
    resp = client.get(f"/api/v1/problems/{fake_id}/skill-gap")
    assert resp.status_code == 401


def test_api_nonexistent_problem_not_found(client):
    headers = _auth_headers(client, email="notfound_gap@example.com")
    fake_id = str(uuid.uuid4())
    resp = client.get(f"/api/v1/problems/{fake_id}/skill-gap", headers=headers)
    assert resp.status_code == 404


def test_empty_required_capabilities(db_session: Session):
    user = User(email="empty_req@example.com", hashed_password="pw", full_name="Empty Req")
    db_session.add(user)
    db_session.commit()

    problem = Problem(
        user_id=user.id,
        title="Trivial Task",
        description="Task with no required capabilities identified.",
        status=ProblemStatus.ANALYZED,
    )
    db_session.add(problem)
    db_session.commit()

    analysis = ProblemAnalysis(problem_id=problem.id, project_type="Trivial")
    db_session.add(analysis)
    db_session.commit()

    service = SkillGapService(db_session)
    res = service.analyze_skill_gap(user.id, problem.id)

    assert res.overall_readiness == 0.0
    assert res.summary.covered == 0
    assert res.summary.partial == 0
    assert res.summary.gaps == 0
    assert len(res.capabilities) == 0


def test_openapi_schema_contains_skill_gap_endpoint(client):
    resp = client.get("/openapi.json")
    assert resp.status_code == 200
    schema = resp.json()
    paths = schema.get("paths", {})

    assert any("skill-gap" in p for p in paths)

