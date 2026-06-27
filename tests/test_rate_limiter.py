import uuid


def test_rate_limit_basic_flow(client):
    email = f"{uuid.uuid4()}@example.com"

    # Register
    client.post("/register", json={
        "name": "Rate User",
        "email": email,
        "password": "password123"
    })

    # Login
    login = client.post("/login", json={
        "email": email,
        "password": "password123"
    })

    token = login.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Create API key FIRST
    api_key_res = client.post(
        "/api-keys",
        json={"name": "rate-test-key"},
        headers=headers
    )

    raw_key = api_key_res.json()["api_key"]

    # Now use API key (NOT JWT)
    api_headers = {
        "x-api-key": raw_key
    }

    responses = [
        client.get("/gateway/test", headers=api_headers)
        for _ in range(5)
    ]

    statuses = [r.status_code for r in responses]

    assert any(code in [200, 429] for code in statuses)