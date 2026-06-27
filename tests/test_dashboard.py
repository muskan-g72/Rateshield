import uuid
def test_dashboard_without_token(client):
    response = client.get("/dashboard")

    assert response.status_code == 401

def test_dashboard_invalid_token(client):
    headers = {
        "Authorization": "Bearer invalidtoken"
    }

    response = client.get(
        "/dashboard",
        headers=headers
    )

    assert response.status_code == 401

def test_dashboard_with_valid_token(client):
    email = f"{uuid.uuid4()}@example.com"

    register_response = client.post(
        "/register",
        json={
            "name": "Dashboard User",
            "email": email,
            "password": "password123"
        }
    )

    assert register_response.status_code == 200

    login_response = client.post(
        "/login",
        json={
            "email": email,
            "password": "password123"
        }
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    dashboard_response = client.get(
        "/dashboard",
        headers=headers
    )

    assert dashboard_response.status_code == 200

    data = dashboard_response.json()

    assert data["name"] == "Dashboard User"
    assert data["email"] == email