import pytest
from app.ai.provider import AIProvider
from app.schemas.problem import ProblemAnalysisResponse, RequiredCapabilityAnalysis


def _register_and_login(client, email="user_problems@example.com"):
    client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "strongpassword123", "full_name": "Problem Owner"},
    )
    resp = client.post(
        "/api/v1/auth/login", data={"username": email, "password": "strongpassword123"}
    )
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


class FailingAIProvider(AIProvider):
    async def analyze_problem(self, description: str, title: str | None = None, domain: str | None = None) -> ProblemAnalysisResponse:
        raise RuntimeError("Simulated AI API Outage")


def test_create_problem_success(client):
    headers = _register_and_login(client, "user1@example.com")
    resp = client.post(
        "/api/v1/problems",
        json={
            "title": "AI Study Assistant",
            "description": "I want to build an application that analyzes student reading audio and provides feedback.",
            "domain": "Education",
        },
        headers=headers,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "AI Study Assistant"
    assert data["domain"] == "Education"
    assert data["status"] == "DRAFT"
    assert data["id"]
    assert "user_id" in data


def test_create_problem_unauthorized(client):
    resp = client.post(
        "/api/v1/problems",
        json={
            "title": "Unauthorized Problem",
            "description": "No auth header provided for problem creation.",
        },
    )
    assert resp.status_code == 401


def test_get_own_problem(client):
    headers = _register_and_login(client, "owner@example.com")
    create_resp = client.post(
        "/api/v1/problems",
        json={
            "title": "My Private Problem",
            "description": "Building a custom analytics solution for IoT devices.",
        },
        headers=headers,
    )
    prob_id = create_resp.json()["id"]

    get_resp = client.get(f"/api/v1/problems/{prob_id}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["title"] == "My Private Problem"


def test_prevent_access_to_other_user_problem(client):
    headers_owner = _register_and_login(client, "alice@example.com")
    headers_other = _register_and_login(client, "bob@example.com")

    create_resp = client.post(
        "/api/v1/problems",
        json={
            "title": "Alice Secret Project Idea",
            "description": "Confidential hardware and software system description.",
        },
        headers=headers_owner,
    )
    prob_id = create_resp.json()["id"]

    # Bob attempts to read Alice's problem
    get_resp = client.get(f"/api/v1/problems/{prob_id}", headers=headers_other)
    assert get_resp.status_code == 403


def test_list_user_problems_pagination(client):
    headers = _register_and_login(client, "list_user@example.com")

    for i in range(5):
        client.post(
            "/api/v1/problems",
            json={
                "title": f"Problem #{i}",
                "description": f"Detailed description for problem number {i} in list.",
            },
            headers=headers,
        )

    resp = client.get("/api/v1/problems?page=1&page_size=3", headers=headers)
    assert resp.status_code == 200
    items = resp.json()
    assert len(items) == 3


def test_analyze_problem_success(client):
    headers = _register_and_login(client, "analyzer@example.com")
    create_resp = client.post(
        "/api/v1/problems",
        json={
            "title": "Lecture Summarizer",
            "description": "I want to build an application that records university lectures and converts audio to text summaries.",
            "domain": "Education",
        },
        headers=headers,
    )
    prob_id = create_resp.json()["id"]

    analyze_resp = client.post(f"/api/v1/problems/{prob_id}/analyze", headers=headers)
    assert analyze_resp.status_code == 200
    analysis = analyze_resp.json()
    assert analysis["problem_id"] == prob_id
    assert len(analysis["required_capabilities"]) > 0

    # Verify problem status is updated to ANALYZED
    prob_resp = client.get(f"/api/v1/problems/{prob_id}", headers=headers)
    assert prob_resp.json()["status"] == "ANALYZED"


def test_get_problem_analysis(client):
    headers = _register_and_login(client, "analysis_reader@example.com")
    create_resp = client.post(
        "/api/v1/problems",
        json={
            "title": "Voice Assistant",
            "description": "Voice reading app that analyzes student speech audio.",
        },
        headers=headers,
    )
    prob_id = create_resp.json()["id"]

    client.post(f"/api/v1/problems/{prob_id}/analyze", headers=headers)

    get_analysis_resp = client.get(f"/api/v1/problems/{prob_id}/analysis", headers=headers)
    assert get_analysis_resp.status_code == 200
    data = get_analysis_resp.json()
    assert data["problem_id"] == prob_id
    assert "technical_requirements" in data
    assert "potential_features" in data


def test_duplicate_capability_prevention_via_slug_normalization(client):
    headers = _register_and_login(client, "slug_user@example.com")

    # Create capability named "Speech Processing"
    client.post(
        "/api/v1/capabilities",
        json={"name": "Speech Processing", "category": "AI"},
        headers=headers,
    )

    create_resp = client.post(
        "/api/v1/problems",
        json={
            "title": "Speech App",
            "description": "Application reading audio speech input.",
        },
        headers=headers,
    )
    prob_id = create_resp.json()["id"]

    client.post(f"/api/v1/problems/{prob_id}/analyze", headers=headers)

    # Check registered capabilities - ensure no duplicate "speech-processing" capability was created
    cap_resp = client.get("/api/v1/capabilities", headers=headers)
    names = [c["name"] for c in cap_resp.json()]
    assert names.count("Speech Processing") == 1
