def _auth_headers(client, email="dana@example.com"):
    client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "strongpass123", "full_name": "Dana"},
    )
    resp = client.post(
        "/api/v1/auth/login", data={"username": email, "password": "strongpass123"}
    )
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}


def test_create_oral_evidence_updates_capability_profile(client):
    headers = _auth_headers(client)
    capability = client.post(
        "/api/v1/capabilities", json={"name": "Public Speaking"}, headers=headers
    ).json()

    resp = client.post(
        "/api/v1/evidence",
        json={
            "capability_id": capability["id"],
            "type": "ORAL",
            "title": "Explained system design in interview",
            "strength": 5.0,
        },
        headers=headers,
    )
    assert resp.status_code == 201
    assert resp.json()["project_id"] is None

    profile_resp = client.get("/api/v1/users/me/capabilities", headers=headers)
    assert profile_resp.status_code == 200
    profile = profile_resp.json()
    assert len(profile) == 1
    assert profile[0]["capability_name"] == "Public Speaking"
    assert profile[0]["strength"] == 5.0


def test_multiple_evidence_accumulates_strength(client):
    headers = _auth_headers(client)
    capability = client.post(
        "/api/v1/capabilities", json={"name": "Java"}, headers=headers
    ).json()

    for _ in range(3):
        client.post(
            "/api/v1/evidence",
            json={
                "capability_id": capability["id"],
                "type": "PRACTICAL",
                "title": "Practical challenge",
                "strength": 10.0,
            },
            headers=headers,
        )

    profile = client.get("/api/v1/users/me/capabilities", headers=headers).json()
    assert profile[0]["strength"] == 30.0


def test_project_evidence_requires_owned_project(client):
    headers = _auth_headers(client)
    capability = client.post(
        "/api/v1/capabilities", json={"name": "Backend Dev"}, headers=headers
    ).json()
    project = client.post(
        "/api/v1/projects", json={"title": "QUDRA Backend"}, headers=headers
    ).json()

    resp = client.post(
        "/api/v1/evidence",
        json={
            "capability_id": capability["id"],
            "type": "PROJECT",
            "project_id": project["id"],
            "title": "Built the auth module",
            "strength": 15.0,
        },
        headers=headers,
    )
    assert resp.status_code == 201
    assert resp.json()["project_id"] == project["id"]


def test_project_evidence_without_project_id_rejected(client):
    headers = _auth_headers(client)
    capability = client.post(
        "/api/v1/capabilities", json={"name": "DevOps"}, headers=headers
    ).json()

    resp = client.post(
        "/api/v1/evidence",
        json={
            "capability_id": capability["id"],
            "type": "PROJECT",
            "title": "Missing project reference",
            "strength": 5.0,
        },
        headers=headers,
    )
    assert resp.status_code == 422


def test_project_evidence_for_unowned_project_rejected(client):
    headers_a = _auth_headers(client, email="a@example.com")
    headers_b = _auth_headers(client, email="b@example.com")

    capability = client.post(
        "/api/v1/capabilities", json={"name": "Design"}, headers=headers_a
    ).json()
    project = client.post(
        "/api/v1/projects", json={"title": "A's project"}, headers=headers_a
    ).json()

    resp = client.post(
        "/api/v1/evidence",
        json={
            "capability_id": capability["id"],
            "type": "PROJECT",
            "project_id": project["id"],
            "title": "Claiming someone else's project",
            "strength": 5.0,
        },
        headers=headers_b,
    )
    assert resp.status_code == 403


def test_evidence_unknown_capability_rejected(client):
    headers = _auth_headers(client)
    resp = client.post(
        "/api/v1/evidence",
        json={
            "capability_id": "00000000-0000-0000-0000-000000000000",
            "type": "ORAL",
            "title": "Ghost capability",
            "strength": 5.0,
        },
        headers=headers,
    )
    assert resp.status_code == 404


def test_list_my_evidence(client):
    headers = _auth_headers(client)
    capability = client.post(
        "/api/v1/capabilities", json={"name": "SQL"}, headers=headers
    ).json()
    client.post(
        "/api/v1/evidence",
        json={"capability_id": capability["id"], "type": "ORAL", "title": "Explained SQL joins", "strength": 5.0},
        headers=headers,
    )

    resp = client.get("/api/v1/evidence", headers=headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1
