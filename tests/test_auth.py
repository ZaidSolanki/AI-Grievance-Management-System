import pytest
from app import create_app, db


@pytest.fixture()
def client():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
    })
    with app.app_context():
        db.drop_all()
        db.create_all()

    with app.test_client() as client:
        yield client


def test_user_signup_and_login(client):
    signup_response = client.post(
        "/auth/signup",
        data={
            "username": "alice",
            "email": "alice@example.com",
            "password": "secret123",
            "role": "user",
        },
    )
    assert signup_response.status_code == 201
    assert b"Account created successfully" in signup_response.data

    login_response = client.post(
        "/auth/login",
        data={
            "email": "alice@example.com",
            "password": "secret123",
            "role": "user",
        },
    )
    assert login_response.status_code == 200
    assert b"Login successful" in login_response.data


def test_admin_signup_and_login(client):
    signup_response = client.post(
        "/auth/signup",
        data={
            "username": "admin1",
            "email": "admin1@example.com",
            "password": "adminpass",
            "role": "admin",
        },
    )
    assert signup_response.status_code == 201
    assert b"Account created successfully" in signup_response.data

    login_response = client.post(
        "/auth/login",
        data={
            "email": "admin1@example.com",
            "password": "adminpass",
            "role": "admin",
        },
    )
    assert login_response.status_code == 200
    assert b"Login successful" in login_response.data
