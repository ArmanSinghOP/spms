import jwt
from datetime import datetime, timedelta, timezone
from app.core.security import (
    create_access_token,
    decode_access_token,
    get_password_hash,
    verify_password,
)

def test_password_hashing_and_verification():
    password = "SecurePassword@2026!"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword@123", hashed) is False

def test_valid_jwt_creation_and_decoding():
    user_id = "654321654321654321654321"
    role = "STUDENT"
    token = create_access_token(subject=user_id, role=role)
    payload = decode_access_token(token)
    assert payload is not None
    assert payload.get("sub") == user_id
    assert payload.get("role") == role
    assert "exp" in payload
    assert "iat" in payload

def test_reject_token_with_synthetic_old_signing_key():
    """Verify that tokens signed with a different key are rejected"""
    user_id = "654321654321654321654321"
    synthetic_old_key = "synthetic-deprecated-test-key-32chars-min-len!"
    payload = {
        "sub": user_id,
        "role": "STUDENT",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        "iat": datetime.now(timezone.utc)
    }
    old_token = jwt.encode(payload, synthetic_old_key, algorithm="HS256")

    # Decoding with the current rotated settings.SECRET_KEY MUST fail
    decoded = decode_access_token(old_token)
    assert decoded is None

def test_reject_expired_token():
    user_id = "654321654321654321654321"
    token = create_access_token(
        subject=user_id,
        role="STUDENT",
        expires_delta=timedelta(seconds=-10) # Expired in past
    )
    decoded = decode_access_token(token)
    assert decoded is None

def test_reject_tampered_token_payload():
    user_id = "654321654321654321654321"
    token = create_access_token(subject=user_id, role="STUDENT")
    parts = token.split(".")
    # Tamper with payload part
    tampered_token = f"{parts[0]}.eyJuZXdfcm9sZSI6ICJBRE1JTiJ9.{parts[2]}"
    decoded = decode_access_token(tampered_token)
    assert decoded is None

def test_reject_algorithm_none():
    user_id = "654321654321654321654321"
    header = {"alg": "none", "typ": "JWT"}
    payload = {
        "sub": user_id,
        "role": "ADMIN",
        "exp": int((datetime.now(timezone.utc) + timedelta(hours=1)).timestamp())
    }
    # Algorithm none attack representation (mock test vector)
    raw_none_token = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTYiLCJyb2xlIjoiQURNSU4ifQ."  # gitleaks:allow
    decoded = decode_access_token(raw_none_token)
    assert decoded is None
