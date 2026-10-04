import uuid
from datetime import datetime, timedelta, timezone
import pytest
from sqlalchemy.orm import Session

from app.db.models.capability import Capability
from app.db.models.evidence import Evidence, EvidenceType, VerificationStatus
from app.db.models.project import Project, ProjectStatus
from app.db.models.user import User
from app.db.models.user_capability import UserCapability
from app.services.capability_scoring_service import (
    CAPABILITY_SCORE_WEIGHTS,
    CapabilityScoringService,
)


def _auth_headers(client, email="scorer@example.com"):
    client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "strongpass123", "full_name": "Scorer User"},
    )
    resp = client.post(
        "/api/v1/auth/login", data={"username": email, "password": "strongpass123"}
    )
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}


# ---------------------------------------------------------------------------
# Unit tests for CapabilityScoringService directly
# ---------------------------------------------------------------------------


def test_no_evidence_returns_zero(db_session: Session):
    service = CapabilityScoringService(db_session)
    user = User(email="no_ev@example.com", hashed_password="pw", full_name="No Ev")
    cap = Capability(name="No Evidence Cap")
    db_session.add_all([user, cap])
    db_session.commit()

    result = service.calculate_capability_score(user.id, cap.id)
    assert result["score"] == 0.0
    assert result["evidence_count"] == 0
    assert result["components"]["practical"] == 0.0
    assert result["components"]["project"] == 0.0
    assert result["components"]["oral"] == 0.0
    assert result["components"]["freshness"] == 0.0


def test_project_evidence_only(db_session: Session):
    service = CapabilityScoringService(db_session)
    user = User(email="proj_only@example.com", hashed_password="pw", full_name="Proj User")
    cap = Capability(name="Project Only Cap")
    db_session.add_all([user, cap])
    db_session.commit()

    proj = Project(owner_id=user.id, title="P1", status=ProjectStatus.COMPLETED)
    db_session.add(proj)
    db_session.commit()

    # Verified project evidence with score 80
    ev = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.PROJECT,
        project_id=proj.id,
        title="Built core service",
        strength=80.0,
        score=80.0,
        verification_status=VerificationStatus.VERIFIED,
    )
    db_session.add(ev)
    db_session.commit()

    result = service.calculate_capability_score(user.id, cap.id)
    # project_score = 80, freshness = 100 (brand new)
    # raw_score = 80 * 0.30 + 100 * 0.10 = 24.0 + 10.0 = 34.0
    assert result["components"]["project"] == 80.0
    assert result["components"]["practical"] == 0.0
    assert result["components"]["oral"] == 0.0
    assert result["components"]["freshness"] == 100.0
    assert result["score"] == 34.0
    assert result["evidence_count"] == 1


def test_practical_evidence_only(db_session: Session):
    service = CapabilityScoringService(db_session)
    user = User(email="prac_only@example.com", hashed_password="pw", full_name="Prac User")
    cap = Capability(name="Practical Only Cap")
    db_session.add_all([user, cap])
    db_session.commit()

    ev = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.PRACTICAL,
        title="Completed coding challenge",
        strength=90.0,
        score=90.0,
        verification_status=VerificationStatus.VERIFIED,
    )
    db_session.add(ev)
    db_session.commit()

    result = service.calculate_capability_score(user.id, cap.id)
    # practical_score = 90, freshness = 100
    # raw_score = 90 * 0.40 + 100 * 0.10 = 36.0 + 10.0 = 46.0
    assert result["components"]["practical"] == 90.0
    assert result["components"]["project"] == 0.0
    assert result["components"]["oral"] == 0.0
    assert result["components"]["freshness"] == 100.0
    assert result["score"] == 46.0


def test_oral_evidence_only(db_session: Session):
    service = CapabilityScoringService(db_session)
    user = User(email="oral_only@example.com", hashed_password="pw", full_name="Oral User")
    cap = Capability(name="Oral Only Cap")
    db_session.add_all([user, cap])
    db_session.commit()

    ev = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.ORAL,
        title="Technical oral presentation",
        strength=75.0,
        score=75.0,
        verification_status=VerificationStatus.VERIFIED,
    )
    db_session.add(ev)
    db_session.commit()

    result = service.calculate_capability_score(user.id, cap.id)
    # oral_score = 75, freshness = 100
    # raw_score = 75 * 0.20 + 100 * 0.10 = 15.0 + 10.0 = 25.0
    assert result["components"]["oral"] == 75.0
    assert result["components"]["practical"] == 0.0
    assert result["components"]["project"] == 0.0
    assert result["components"]["freshness"] == 100.0
    assert result["score"] == 25.0


def test_all_evidence_types_and_exact_weighting(db_session: Session):
    """Practical = 90 (40%), Project = 80 (30%), Oral = 75 (20%), Freshness = 100 (10%)

    Expected: 90*0.40 + 80*0.30 + 75*0.20 + 100*0.10 = 36 + 24 + 15 + 10 = 85.0
    """
    service = CapabilityScoringService(db_session)
    user = User(email="all_types@example.com", hashed_password="pw", full_name="All Types")
    cap = Capability(name="Full Stack Cap")
    db_session.add_all([user, cap])
    db_session.commit()

    proj = Project(owner_id=user.id, title="Main App", status=ProjectStatus.COMPLETED)
    db_session.add(proj)
    db_session.commit()

    ev1 = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.PRACTICAL,
        title="Practical lab",
        strength=90.0,
        score=90.0,
        verification_status=VerificationStatus.VERIFIED,
    )
    ev2 = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.PROJECT,
        project_id=proj.id,
        title="Project work",
        strength=80.0,
        score=80.0,
        verification_status=VerificationStatus.VERIFIED,
    )
    ev3 = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.ORAL,
        title="Oral defense",
        strength=75.0,
        score=75.0,
        verification_status=VerificationStatus.VERIFIED,
    )
    db_session.add_all([ev1, ev2, ev3])
    db_session.commit()

    result = service.calculate_capability_score(user.id, cap.id)
    assert result["components"]["practical"] == 90.0
    assert result["components"]["project"] == 80.0
    assert result["components"]["oral"] == 75.0
    assert result["components"]["freshness"] == 100.0
    assert result["score"] == 85.0
    assert result["evidence_count"] == 3


def test_freshness_age_decay(db_session: Session):
    """Test the 5 freshness age brackets:

    <=180 days: 100
    181-365 days: 90
    366-730 days: 75
    731-1095 days: 60
    >1095 days: 40
    """
    service = CapabilityScoringService(db_session)
    now = datetime.now(timezone.utc)

    # Bracket 1: 30 days old -> 100
    ev1 = Evidence(
        user_id=uuid.uuid4(),
        capability_id=uuid.uuid4(),
        type=EvidenceType.PRACTICAL,
        title="Recent",
        strength=100.0,
        created_at=now - timedelta(days=30),
    )
    assert service.calculate_freshness_score([ev1]) == 100.0

    # Bracket 2: 200 days old (6-12 months) -> 90
    ev2 = Evidence(
        user_id=uuid.uuid4(),
        capability_id=uuid.uuid4(),
        type=EvidenceType.PRACTICAL,
        title="6-12m",
        strength=100.0,
        created_at=now - timedelta(days=200),
    )
    assert service.calculate_freshness_score([ev2]) == 90.0

    # Bracket 3: 500 days old (1-2 years) -> 75
    ev3 = Evidence(
        user_id=uuid.uuid4(),
        capability_id=uuid.uuid4(),
        type=EvidenceType.PRACTICAL,
        title="1-2y",
        strength=100.0,
        created_at=now - timedelta(days=500),
    )
    assert service.calculate_freshness_score([ev3]) == 75.0

    # Bracket 4: 800 days old (2-3 years) -> 60
    ev4 = Evidence(
        user_id=uuid.uuid4(),
        capability_id=uuid.uuid4(),
        type=EvidenceType.PRACTICAL,
        title="2-3y",
        strength=100.0,
        created_at=now - timedelta(days=800),
    )
    assert service.calculate_freshness_score([ev4]) == 60.0

    # Bracket 5: 1200 days old (>3 years) -> 40
    ev5 = Evidence(
        user_id=uuid.uuid4(),
        capability_id=uuid.uuid4(),
        type=EvidenceType.PRACTICAL,
        title=">3y",
        strength=100.0,
        created_at=now - timedelta(days=1200),
    )
    assert service.calculate_freshness_score([ev5]) == 40.0


def test_multiple_evidence_freshness_uses_newest(db_session: Session):
    """Old evidence must not degrade freshness when newer verified evidence exists."""
    service = CapabilityScoringService(db_session)
    now = datetime.now(timezone.utc)

    old_ev = Evidence(
        user_id=uuid.uuid4(),
        capability_id=uuid.uuid4(),
        type=EvidenceType.PRACTICAL,
        title="Ancient",
        strength=100.0,
        created_at=now - timedelta(days=1200),
    )
    new_ev = Evidence(
        user_id=uuid.uuid4(),
        capability_id=uuid.uuid4(),
        type=EvidenceType.PRACTICAL,
        title="Recent",
        strength=100.0,
        created_at=now - timedelta(days=10),
    )
    assert service.calculate_freshness_score([old_ev, new_ev]) == 100.0


def test_rejected_and_pending_evidence_excluded(db_session: Session):
    service = CapabilityScoringService(db_session)
    user = User(email="filter_status@example.com", hashed_password="pw", full_name="Filter User")
    cap = Capability(name="Status Filter Cap")
    db_session.add_all([user, cap])
    db_session.commit()

    ev_pending = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.PRACTICAL,
        title="Pending challenge",
        strength=100.0,
        score=100.0,
        verification_status=VerificationStatus.PENDING,
    )
    ev_rejected = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.ORAL,
        title="Rejected talk",
        strength=100.0,
        score=100.0,
        verification_status=VerificationStatus.REJECTED,
    )
    db_session.add_all([ev_pending, ev_rejected])
    db_session.commit()

    result = service.calculate_capability_score(user.id, cap.id)
    assert result["score"] == 0.0
    assert result["evidence_count"] == 0
    assert result["components"]["practical"] == 0.0
    assert result["components"]["oral"] == 0.0
    assert result["components"]["freshness"] == 0.0


def test_multiple_evidence_records_aggregation(db_session: Session):
    """Scores for a type are aggregated from the top 3 strongest verified items."""
    service = CapabilityScoringService(db_session)
    user = User(email="multi_ev@example.com", hashed_password="pw", full_name="Multi Ev")
    cap = Capability(name="Multi Records Cap")
    db_session.add_all([user, cap])
    db_session.commit()

    # 4 practical records: 100, 90, 80, 20
    # Top 3: 100, 90, 80 -> avg = 90.0 (the 20 is excluded by top-3 aggregation)
    for score_val in [100.0, 90.0, 80.0, 20.0]:
        db_session.add(
            Evidence(
                user_id=user.id,
                capability_id=cap.id,
                type=EvidenceType.PRACTICAL,
                title=f"Lab {score_val}",
                strength=score_val,
                score=score_val,
                verification_status=VerificationStatus.VERIFIED,
            )
        )
    db_session.commit()

    result = service.calculate_capability_score(user.id, cap.id)
    assert result["components"]["practical"] == 90.0
    assert result["evidence_count"] == 4


def test_score_bounded_0_to_100(db_session: Session):
    service = CapabilityScoringService(db_session)
    user = User(email="bounded@example.com", hashed_password="pw", full_name="Bounded User")
    cap = Capability(name="Bounded Cap")
    db_session.add_all([user, cap])
    db_session.commit()

    # Perfect scores
    ev = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.PRACTICAL,
        title="Perfect",
        strength=100.0,
        score=100.0,
        verification_status=VerificationStatus.VERIFIED,
    )
    ev2 = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.ORAL,
        title="Perfect oral",
        strength=100.0,
        score=100.0,
        verification_status=VerificationStatus.VERIFIED,
    )
    db_session.add_all([ev, ev2])
    db_session.commit()

    proj = Project(owner_id=user.id, title="Perfect Proj", status=ProjectStatus.COMPLETED)
    db_session.add(proj)
    db_session.commit()
    ev3 = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.PROJECT,
        project_id=proj.id,
        title="Perfect proj",
        strength=100.0,
        score=100.0,
        verification_status=VerificationStatus.VERIFIED,
    )
    db_session.add(ev3)
    db_session.commit()

    result = service.calculate_capability_score(user.id, cap.id)
    assert result["score"] == 100.0
    assert result["components"]["practical"] == 100.0
    assert result["components"]["project"] == 100.0
    assert result["components"]["oral"] == 100.0
    assert result["components"]["freshness"] == 100.0


def test_oral_structured_fallback_evaluation(db_session: Session):
    """When oral evidence has no overall score, it evaluates:

    correctness * 0.35 + relevance * 0.25 + depth * 0.25 + clarity * 0.15
    """
    service = CapabilityScoringService(db_session)
    user = User(email="oral_struct@example.com", hashed_password="pw", full_name="Oral Struct")
    cap = Capability(name="Oral Struct Cap")
    db_session.add_all([user, cap])
    db_session.commit()

    ev = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.ORAL,
        title="Detailed Viva",
        strength=50.0,
        score=0.0,  # no overall score
        evidence_metadata={
            "correctness": 80.0,
            "relevance": 90.0,
            "depth": 70.0,
            "clarity": 100.0,
        },
        verification_status=VerificationStatus.VERIFIED,
    )
    db_session.add(ev)
    db_session.commit()

    # 80*0.35 (28) + 90*0.25 (22.5) + 70*0.25 (17.5) + 100*0.15 (15) = 83.0
    result = service.calculate_capability_score(user.id, cap.id)
    assert result["components"]["oral"] == 83.0


def test_recalculate_user_capability_updates_db(db_session: Session):
    service = CapabilityScoringService(db_session)
    user = User(email="recalc_db@example.com", hashed_password="pw", full_name="Recalc DB")
    cap = Capability(name="Recalc Cap")
    db_session.add_all([user, cap])
    db_session.commit()

    ev = Evidence(
        user_id=user.id,
        capability_id=cap.id,
        type=EvidenceType.PRACTICAL,
        title="Challenge 1",
        strength=80.0,
        score=80.0,
        verification_status=VerificationStatus.VERIFIED,
    )
    db_session.add(ev)
    db_session.commit()

    user_cap = service.recalculate_user_capability(user.id, cap.id)
    assert user_cap.evidence_strength > 0.0
    assert user_cap.evidence_count == 1
    assert user_cap.last_evaluated_at is not None
    assert "practical" in user_cap.breakdown


# ---------------------------------------------------------------------------
# API Integration tests
# ---------------------------------------------------------------------------


def test_api_get_my_capabilities_scores(client):
    headers = _auth_headers(client, email="api_caps@example.com")
    cap_resp = client.post(
        "/api/v1/capabilities", json={"name": "FastAPI Development"}, headers=headers
    )
    cap_id = cap_resp.json()["id"]

    client.post(
        "/api/v1/evidence",
        json={
            "capability_id": cap_id,
            "type": "PRACTICAL",
            "title": "Built REST endpoints",
            "strength": 80.0,
            "score": 80.0,
            "verification_status": "VERIFIED",
        },
        headers=headers,
    )

    resp = client.get("/api/v1/users/me/capabilities", headers=headers)
    assert resp.status_code == 200
    caps = resp.json()
    assert len(caps) >= 1
    target = next(c for c in caps if c["capability_id"] == cap_id)
    assert target["evidence_strength"] > 0
    assert target["evidence_count"] == 1
    assert target["last_evaluated_at"] is not None


def test_api_get_single_capability_score(client):
    headers = _auth_headers(client, email="single_score@example.com")
    cap_resp = client.post(
        "/api/v1/capabilities", json={"name": "Cloud Architecture"}, headers=headers
    )
    cap_id = cap_resp.json()["id"]

    client.post(
        "/api/v1/evidence",
        json={
            "capability_id": cap_id,
            "type": "ORAL",
            "title": "Architecture Interview",
            "strength": 70.0,
            "score": 70.0,
            "verification_status": "VERIFIED",
        },
        headers=headers,
    )

    resp = client.get(f"/api/v1/users/me/capabilities/{cap_id}", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["capability"]["id"] == cap_id
    assert data["capability"]["name"] == "Cloud Architecture"
    assert data["score"] > 0
    assert "practical" in data["components"]
    assert "project" in data["components"]
    assert "oral" in data["components"]
    assert "freshness" in data["components"]
    assert data["weights"]["practical"] == 0.40
    assert data["weights"]["project"] == 0.30
    assert data["weights"]["oral"] == 0.20
    assert data["weights"]["freshness"] == 0.10
    assert data["evidence_count"] == 1
    assert data["last_evaluated_at"] is not None


def test_api_recalculate_endpoint(client):
    headers = _auth_headers(client, email="api_recalc@example.com")
    cap_resp = client.post(
        "/api/v1/capabilities", json={"name": "DevSecOps"}, headers=headers
    )
    cap_id = cap_resp.json()["id"]

    resp = client.post(f"/api/v1/users/me/capabilities/{cap_id}/recalculate", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["score"] == 0.0
    assert data["evidence_count"] == 0


def test_api_unauthorized_access_rejected(client):
    fake_id = str(uuid.uuid4())
    resp = client.get(f"/api/v1/users/me/capabilities/{fake_id}")
    assert resp.status_code == 401

    resp_recalc = client.post(f"/api/v1/users/me/capabilities/{fake_id}/recalculate")
    assert resp_recalc.status_code == 401


def test_api_invalid_capability_not_found(client):
    headers = _auth_headers(client, email="notfound_test@example.com")
    fake_id = str(uuid.uuid4())
    resp = client.get(f"/api/v1/users/me/capabilities/{fake_id}", headers=headers)
    assert resp.status_code == 404

    resp_recalc = client.post(f"/api/v1/users/me/capabilities/{fake_id}/recalculate", headers=headers)
    assert resp_recalc.status_code == 404


def test_automatic_recalculation_on_evidence_status_change(client):
    """When an evidence status is updated (e.g.

    VERIFIED -> REJECTED), recalculation occurs automatically.
    """
    headers = _auth_headers(client, email="auto_recalc@example.com")
    cap_resp = client.post(
        "/api/v1/capabilities", json={"name": "Kubernetes"}, headers=headers
    )
    cap_id = cap_resp.json()["id"]

    ev_resp = client.post(
        "/api/v1/evidence",
        json={
            "capability_id": cap_id,
            "type": "PRACTICAL",
            "title": "K8s Deployment",
            "strength": 80.0,
            "score": 80.0,
            "verification_status": "VERIFIED",
        },
        headers=headers,
    )
    ev_id = ev_resp.json()["id"]

    # Check score is positive
    score_resp = client.get(f"/api/v1/users/me/capabilities/{cap_id}", headers=headers)
    assert score_resp.json()["score"] > 0

    # Now reject the evidence
    patch_resp = client.patch(
        f"/api/v1/evidence/{ev_id}/status",
        json={"status": "REJECTED"},
        headers=headers,
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["verification_status"] == "REJECTED"

    # Capability score should now automatically be 0 because the only evidence was rejected
    score_after = client.get(f"/api/v1/users/me/capabilities/{cap_id}", headers=headers)
    assert score_after.json()["score"] == 0.0
    assert score_after.json()["evidence_count"] == 0
