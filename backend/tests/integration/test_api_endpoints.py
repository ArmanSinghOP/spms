import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture(scope="module")
def tpo_headers(client):
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "tpo@kiet.edu",
        "password": "Admin@123"
    })
    assert login_resp.status_code == 200, f"TPO login failed: {login_resp.text}"
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="module")
def student_headers():
    token = create_access_token(subject="demo_student_user_id", role="STUDENT")
    return {"Authorization": f"Bearer {token}"}

def test_api_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database_engine"] == "PyMongo Async API"

def test_api_root(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_login_invalid_credentials(client):
    response = client.post("/api/v1/auth/login", json={
        "email": "nonexistent.user@kiet.edu",
        "password": "wrongpassword123"  # gitleaks:allow
    })
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]

def test_unauthenticated_drives_access(client):
    response = client.get("/api/v1/drives")
    assert response.status_code == 401

def test_authenticated_drives_listing(client, tpo_headers):
    response = client.get("/api/v1/drives", headers=tpo_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        drive = data[0]
        assert "company_name" in drive
        assert "job_role" in drive
        assert "package_ctc" in drive

def test_company_directory(client, tpo_headers):
    response = client.get("/api/v1/companies", headers=tpo_headers)
    assert response.status_code == 200
    companies = response.json()
    assert isinstance(companies, list)
    assert len(companies) >= 4
    company_names = [c["name"] for c in companies]
    assert "Google" in company_names
    assert "Microsoft" in company_names

def test_tpo_analytics(client, tpo_headers):
    response = client.get("/api/v1/analytics/tpo", headers=tpo_headers)
    assert response.status_code == 200
    stats = response.json()
    assert "total_students" in stats
    assert "active_drives" in stats
    assert "department_stats" in stats
