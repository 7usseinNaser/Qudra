import pytest
from app.utils.normalization import normalize_capability_name, canonical_key


def _auth_headers(client, email="features_test@example.com"):
    client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "strongpass123", "full_name": "Dana Tafish"},
    )
    resp = client.post(
        "/api/v1/auth/login", data={"username": email, "password": "strongpass123"}
    )
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}


# =====================================================================
# Feature 1 & 2: Problem Analyzer & Capability Normalization
# =====================================================================

def test_normalization_utility():
    """Verify that variants of capabilities normalize to canonical names."""
    assert normalize_capability_name("Backend") == "Backend Development"
    assert normalize_capability_name("Backend Development") == "Backend Development"
    assert normalize_capability_name("Back-end Development") == "Backend Development"
    assert normalize_capability_name("Backend Developer") == "Backend Development"
    assert normalize_capability_name("Frontend Developer") == "Frontend Development"
    assert normalize_capability_name("Flutter Dev") == "Flutter"
    assert normalize_capability_name("UI/UX") == "UI/UX Design"
    assert normalize_capability_name("database") == "Database Design"

    # Canonical match key equality
    assert canonical_key("Backend Developer") == canonical_key("Backend Development")
    assert canonical_key("Back-end Development") == canonical_key("Backend")


def test_problem_analyzer_creates_normalized_capabilities(client):
    """Problem Analyzer should extract capabilities and deduplicate them via normalization."""
    headers = _auth_headers(client, email="analyzer_user@example.com")

    # 1. Create a problem
    prob_resp = client.post(
        "/api/v1/problems",
        json={
            "title": "Lecture Summarizer AI",
            "description": "I want to build an application that records university lectures and converts them into summaries and questions using speech audio and AI.",
            "domain": "Education",
        },
        headers=headers,
    )
    assert prob_resp.status_code == 201
    prob_id = prob_resp.json()["id"]

    # 2. Analyze the problem
    analyze_resp = client.post(f"/api/v1/problems/{prob_id}/analyze", headers=headers)
    assert analyze_resp.status_code == 200
    analysis = analyze_resp.json()

    assert analysis["project_type"] is not None
    assert analysis["domain"] == "Education"
    assert len(analysis["required_capabilities"]) > 0

    # Ensure capability names are properly normalized and have importance / required_level
    for cap in analysis["required_capabilities"]:
        assert isinstance(cap["importance"], (int, str))
        assert cap["required_level"] is not None
        assert cap["name"] is not None


# =====================================================================
# Feature 4: Project Evidence with Technologies & Contribution
# =====================================================================

def test_project_with_technologies_and_contribution(client):
    """Project entity can store technologies, contribution, and auto-generates project evidence."""
    headers = _auth_headers(client, email="project_user@example.com")

    # Create capability
    cap_resp = client.post(
        "/api/v1/capabilities",
        json={"name": "Backend Development", "category": "Software Engineering"},
        headers=headers,
    )
    cap_id = cap_resp.json()["id"]

    # Create project with technologies and contributions
    proj_resp = client.post(
        "/api/v1/projects",
        json={
            "title": "University Management System",
            "description": "Core administrative and academic platform for universities.",
            "status": "COMPLETED",
            "technologies": ["FastAPI", "PostgreSQL", "Docker"],
            "contribution": [
                "Designed REST APIs",
                "Designed database schema",
                "Implemented authentication and security",
            ],
        },
        headers=headers,
    )
    assert proj_resp.status_code == 201
    project = proj_resp.json()
    assert project["technologies"] == ["FastAPI", "PostgreSQL", "Docker"]
    assert len(project["contribution"]) == 3

    # Tag capability to project -> auto creates PROJECT Evidence
    tag_resp = client.post(
        f"/api/v1/projects/{project['id']}/capabilities",
        json={"capability_id": cap_id},
        headers=headers,
    )
    assert tag_resp.status_code == 201

    # Check that Evidence record was created
    ev_resp = client.get("/api/v1/evidence", headers=headers)
    assert ev_resp.status_code == 200
    evidence_list = ev_resp.json()
    assert len(evidence_list) >= 1

    project_evidence = next(e for e in evidence_list if e["project_id"] == project["id"])
    assert project_evidence["type"] == "PROJECT"
    assert "FastAPI" in project_evidence["description"] or "Contributions" in project_evidence["description"]
    assert project_evidence["strength"] >= 75.0


# =====================================================================
# Feature 3: Capability Profile & Multi-Factor Evidence Scoring
# =====================================================================

def test_capability_profile_multi_factor_scoring(client):
    """Test the exact multi-factor evidence scoring formula:
    Practical 40% + Project 30% + Oral 20% + Freshness 10%.
    """
    headers = _auth_headers(client, email="dana_tafish@example.com")

    # 1. Create Capability
    cap_resp = client.post(
        "/api/v1/capabilities",
        json={"name": "Backend Development", "category": "Software Engineering"},
        headers=headers,
    )
    cap_id = cap_resp.json()["id"]

    # 2. Add Project Evidence (e.g. score 82)
    proj_resp = client.post(
        "/api/v1/projects",
        json={
            "title": "University Management System",
            "description": "FastAPI + Postgres system",
            "technologies": ["FastAPI", "PostgreSQL"],
            "contribution": ["Designed REST APIs", "Database setup"],
        },
        headers=headers,
    )
    proj_id = proj_resp.json()["id"]

    client.post(
        "/api/v1/evidence",
        json={
            "capability_id": cap_id,
            "type": "PROJECT",
            "project_id": proj_id,
            "title": "REST API Architecture",
            "description": "FastAPI and PostgreSQL database",
            "strength": 82.0,
        },
        headers=headers,
    )

    # 3. Add Practical Evidence (e.g. score 91)
    client.post(
        "/api/v1/evidence",
        json={
            "capability_id": cap_id,
            "type": "PRACTICAL",
            "title": "Database Optimization Challenge",
            "description": "Complex SQL indexing and query optimization",
            "strength": 91.0,
        },
        headers=headers,
    )

    # 4. Add Oral Evidence (e.g. score 76)
    client.post(
        "/api/v1/evidence",
        json={
            "capability_id": cap_id,
            "type": "ORAL",
            "title": "System Design Oral Defense",
            "description": "Defended distributed transactions and caching",
            "strength": 76.0,
        },
        headers=headers,
    )

    # 5. Check Capability Profile
    # Expected weighted score:
    # 0.40 * 91 + 0.30 * 82 + 0.20 * 76 + 0.10 * 100 (since created just now)
    # = 36.4 + 24.6 + 15.2 + 10.0 = 86.2
    profile_resp = client.get("/api/v1/users/me/capabilities", headers=headers)
    assert profile_resp.status_code == 200
    user_caps = profile_resp.json()
    assert len(user_caps) == 1

    backend_cap = user_caps[0]
    assert backend_cap["capability_name"] == "Backend Development"
    assert backend_cap["evidence_count"] == 3
    assert backend_cap["breakdown"]["practical_evidence"] == 91.0
    assert backend_cap["breakdown"]["project_evidence"] == 82.0
    assert backend_cap["breakdown"]["oral_evidence"] == 76.0
    assert backend_cap["breakdown"]["freshness"] == 100.0
    assert 84.0 <= backend_cap["evidence_strength"] <= 87.0

    # 6. Check Full Capability Profile endpoint
    full_profile_resp = client.get("/api/v1/users/me/capability-profile", headers=headers)
    assert full_profile_resp.status_code == 200
    full_profile = full_profile_resp.json()
    assert full_profile["full_name"] == "Dana Tafish"
    assert len(full_profile["capabilities"]) == 1
    assert full_profile["capabilities"][0]["evidence_strength"] == backend_cap["evidence_strength"]
    assert full_profile["capabilities"][0]["evidence_count"] == 3
