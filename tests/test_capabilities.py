def _register_and_login(client, email="dana@example.com"):
    client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "strongpass123", "full_name": "Dana"},
    )
    resp = client.post(
        "/api/v1/auth/login", data={"username": email, "password": "strongpass123"}
    )
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_and_list_capability(client):
    headers = _register_and_login(client)
    resp = client.post(
        "/api/v1/capabilities",
        json={"name": "Python", "category": "Programming", "description": "Python language"},
        headers=headers,
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["name"] == "Python"

    list_resp = client.get("/api/v1/capabilities", headers=headers)
    assert list_resp.status_code == 200
    names = [c["name"] for c in list_resp.json()]
    assert "Python" in names


def test_create_duplicate_capability_rejected(client):
    headers = _register_and_login(client)
    client.post("/api/v1/capabilities", json={"name": "Rust"}, headers=headers)
    resp = client.post("/api/v1/capabilities", json={"name": "Rust"}, headers=headers)
    assert resp.status_code == 409


def test_get_capability_not_found(client):
    headers = _register_and_login(client)
    resp = client.get(
        "/api/v1/capabilities/00000000-0000-0000-0000-000000000000", headers=headers
    )
    assert resp.status_code == 404


def test_capabilities_require_auth(client):
    resp = client.get("/api/v1/capabilities")
    assert resp.status_code == 401


def test_get_user_capability_profile_empty(client):
    headers = _register_and_login(client)
    resp = client.get("/api/v1/users/me/capabilities", headers=headers)
    assert resp.status_code == 200
    assert resp.json() == []

