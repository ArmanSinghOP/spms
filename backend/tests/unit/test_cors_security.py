from fastapi.testclient import TestClient
from app.main import app
from app.core.config import Settings

client = TestClient(app)

def test_cors_allowed_origins():
    # Test localhost:5173
    res1 = client.options(
        "/api/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET"
        }
    )
    assert res1.status_code == 200
    assert res1.headers.get("access-control-allow-origin") == "http://localhost:5173"
    assert res1.headers.get("access-control-allow-credentials") == "true"

    # Test 127.0.0.1:5173
    res2 = client.options(
        "/api/health",
        headers={
            "Origin": "http://127.0.0.1:5173",
            "Access-Control-Request-Method": "GET"
        }
    )
    assert res2.status_code == 200
    assert res2.headers.get("access-control-allow-origin") == "http://127.0.0.1:5173"

def test_cors_disallowed_origin():
    res = client.options(
        "/api/health",
        headers={
            "Origin": "http://unauthorized-domain.com",
            "Access-Control-Request-Method": "GET"
        }
    )
    assert res.headers.get("access-control-allow-origin") is None

def test_settings_strips_wildcard_cors():
    s = Settings(
        SECRET_KEY="a" * 32,
        MONGODB_URL="mongodb://localhost:27017",
        BACKEND_CORS_ORIGINS=["http://localhost:5173", "*", "http://127.0.0.1:5173"]
    )
    assert "*" not in s.BACKEND_CORS_ORIGINS
    assert "http://localhost:5173" in s.BACKEND_CORS_ORIGINS
