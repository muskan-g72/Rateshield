import uuid

def test_list_api_keys_empty(client):
    email = f"{uuid.uuid4()}@example.com"

    # Register
    client.post(
        "/register",
        json={
            "name": "API User",
            "email": email,
            "password": "password123"
        }
    )

    # Login
    login = client.post(
        "/login",
        json={
            "email": email,
            "password": "password123"
        }
    )

    assert login.status_code == 200

    token = login.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Call GET /api-keys
    response = client.get("/api-keys", headers=headers)

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)



def test_create_api_key(client):
    email = f"{uuid.uuid4()}@example.com"

    # Register
    client.post(
        "/register",
        json={
            "name": "Key User",
            "email": email,
            "password": "password123"
        }
    )

    # Login
    login = client.post(
        "/login",
        json={
            "email": email,
            "password": "password123"
        }
    )

    token = login.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Create API Key
    response = client.post(
        "/api-keys",
        json={
            "name": "test-key"
        },
        headers=headers
    )

    assert response.status_code == 200

    data = response.json()

    assert "api_key" in data
    assert data["name"] == "test-key"


def test_list_api_keys(client):
    email = f"{uuid.uuid4()}@example.com"

    # Register
    client.post(
        "/register",
        json={
            "name": "Key User",
            "email": email,
            "password": "password123"
        }
    )

    # Login
    login = client.post(
        "/login",
        json={
            "email": email,
            "password": "password123"
        }
    )

    token = login.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Create API Key first
    client.post(
        "/api-keys",
        json={"name": "key1"},
        headers=headers
    )

    # List keys
    response = client.get("/api-keys", headers=headers)

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1


def test_revoke_api_key(client):
    email = f"{uuid.uuid4()}@example.com"

    # Register + Login
    client.post("/register", json={
        "name": "Key User",
        "email": email,
        "password": "password123"
    })

    login = client.post("/login", json={
        "email": email,
        "password": "password123"
    })

    token = login.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Create key
    create_res = client.post(
        "/api-keys",
        json={"name": "to-revoke"},
        headers=headers
    )

    key_id = create_res.json()["id"]

    # Revoke key
    revoke_res = client.delete(
        f"/api-keys/{key_id}",
        headers=headers
    )

    assert revoke_res.status_code == 200

    # Verify still listed but inactive
    list_res = client.get("/api-keys", headers=headers)

    keys = list_res.json()

    found = [k for k in keys if k["id"] == key_id]

    assert len(found) == 1
    assert found[0]["active"] is False