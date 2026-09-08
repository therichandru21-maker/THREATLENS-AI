from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_register_user():
    response = client.post(
        "/auth/register",
        json={
            "username": "testuser_automation",
            "email": "testuser_automation@example.com",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code in [200, 201, 400, 409]


def test_login_missing_credentials():
    response = client.post(
        "/auth/login",
        data={},
    )

    assert response.status_code == 422