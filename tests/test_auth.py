def _register(client, email="dana@example.com", password="strongpass123", full_name="Dana"):
    return client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password, "full_name": full_name},
    )


def _login(client, email="dana@example.com", password="strongpass123"):
    return client.post(
        "/api/v1/auth/login",
        data={"username": email, "password": password},
    )


def test_register_success(client):
    response = _register(client)
    assert response.status_code == 201
    body = response.json()
    assert body["email"] == "dana@example.com"
    assert body["full_name"] == "Dana"
    assert body["is_active"] is True
    assert "hashed_password" not in body
    assert "password" not in body


def test_register_duplicate_email_rejected(client):
    _register(client)
    response = _register(client)
    assert response.status_code == 409


def test_register_invalid_email_rejected(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "not-an-email", "password": "strongpass123", "full_name": "Dana"},
    )
    assert response.status_code == 422


def test_register_short_password_rejected(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "x@example.com", "password": "short", "full_name": "Dana"},
    )
    assert response.status_code == 422


def test_login_success_returns_token(client):
    _register(client)
    response = _login(client)
    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


def test_login_wrong_password_rejected(client):
    _register(client)
    response = _login(client, password="wrongpassword")
    assert response.status_code == 401


def test_login_nonexistent_user_rejected(client):
    response = _login(client, email="ghost@example.com")
    assert response.status_code == 401


def test_current_user_with_valid_token(client):
    _register(client)
    token = _login(client).json()["access_token"]
    response = client.get(
        "/api/v1/users/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "dana@example.com"


def test_current_user_without_token_rejected(client):
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401


def test_current_user_with_invalid_token_rejected(client):
    response = client.get(
        "/api/v1/users/me", headers={"Authorization": "Bearer garbage.token.here"}
    )
    assert response.status_code == 401
