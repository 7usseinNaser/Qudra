def _auth_headers(client, email="dana@example.com"):
    client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "strongpass123", "full_name": "Dana"},
    )
    resp = client.post(
        "/api/v1/auth/login", data={"username": email, "password": "strongpass123"}
    )
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}


def test_create_list_get_project(client):
    headers = _auth_headers(client)
    create_resp = client.post(
        "/api/v1/projects",
        json={"title": "Offline City App", "description": "A graduation project"},
        headers=headers,
    )
    assert create_resp.status_code == 201
    project = create_resp.json()
    assert project["title"] == "Offline City App"
    assert project["status"] == "DRAFT"

    list_resp = client.get("/api/v1/projects", headers=headers)
    assert list_resp.status_code == 200
    assert len(list_resp.json()) == 1

    get_resp = client.get(f"/api/v1/projects/{project['id']}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == project["id"]


def test_update_project(client):
    headers = _auth_headers(client)
    project = client.post(
        "/api/v1/projects", json={"title": "Initial"}, headers=headers
    ).json()

    resp = client.patch(
        f"/api/v1/projects/{project['id']}",
        json={"status": "IN_PROGRESS"},
        headers=headers,
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "IN_PROGRESS"
    assert resp.json()["title"] == "Initial"  # unchanged


def test_project_not_owned_by_other_user_forbidden(client):
    headers_a = _auth_headers(client, email="a@example.com")
    headers_b = _auth_headers(client, email="b@example.com")

    project = client.post(
        "/api/v1/projects", json={"title": "Private"}, headers=headers_a
    ).json()

    resp = client.get(f"/api/v1/projects/{project['id']}", headers=headers_b)
    assert resp.status_code == 403


def test_project_not_found(client):
    headers = _auth_headers(client)
    resp = client.get(
        "/api/v1/projects/00000000-0000-0000-0000-000000000000", headers=headers
    )
    assert resp.status_code == 404


def test_add_capability_to_project(client):
    headers = _auth_headers(client)
    capability = client.post(
        "/api/v1/capabilities", json={"name": "Flutter"}, headers=headers
    ).json()
    project = client.post(
        "/api/v1/projects", json={"title": "Mobile App"}, headers=headers
    ).json()

    resp = client.post(
        f"/api/v1/projects/{project['id']}/capabilities",
        json={"capability_id": capability["id"]},
        headers=headers,
    )
    assert resp.status_code == 201
    assert resp.json()["capability_id"] == capability["id"]

    dup_resp = client.post(
        f"/api/v1/projects/{project['id']}/capabilities",
        json={"capability_id": capability["id"]},
        headers=headers,
    )
    assert dup_resp.status_code == 409
