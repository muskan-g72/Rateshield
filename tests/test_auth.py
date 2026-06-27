import uuid
def test_register_user(client):
    email = f"alice_{uuid.uuid4().hex}@example.com"
    response = client.post(
        "/register",
        json={
            "name": "Alice",
            "email": email,
            "password": "password123"
        }
    )

    assert response.status_code == 200
    data = response.json()
    print(data)

    assert data["message"] == "User created"
    assert "user_id" in data

def test_register_duplicate_email(client):
    email = f"bob_{uuid.uuid4().hex}@example.com"

    user = {
        "name": "Bob",
        "email": email,
        "password": "password123"
    }

    client.post("/register", json=user)

    response = client.post("/register", json=user)

    assert response.status_code == 400

    data = response.json()

    assert data["detail"] == "Email already registered"

def test_login_success(client):

    email = f"login_{uuid.uuid4().hex}@example.com"

    user = {
        "name": "Charlie",
        "email": email,
        "password": "password123"
    }

    # Arrange: Register the user
    client.post("/register", json=user)

    # Act: Login
    response = client.post(
        "/login",
        json={
            "email": email,
            "password": "password123"
        }
    )

    # Assert
    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_password(client):
    email = f"wrongpass_{uuid.uuid4().hex}@example.com"

    user = {
        "name": "David",
        "email": email,
        "password": "password123"
    }

    # Arrange
    client.post("/register", json=user)

    # Act
    response = client.post(
        "/login",
        json={
            "email": email,
            "password": "wrongpassword"
        }
    )

    # Assert
    assert response.status_code == 401

    data = response.json()

    assert data["detail"] == "Invalid email or password"

def test_login_nonexistent_user(client):
    response = client.post(
        "/login",
        json={
            "email": f"nouser_{uuid.uuid4().hex}@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 401

    data = response.json()

    assert data["detail"] == "Invalid email or password"
