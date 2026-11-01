from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token
from app.core.roles import AppRole, normalize_role, role_matches

def test_password_hashing_and_verification():
    raw_password = "KietSecurePassword2026!"
    hashed = get_password_hash(raw_password)

    assert hashed != raw_password
    assert "$argon2" in hashed
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False

def test_jwt_token_creation_and_decoding():
    user_id = "test_student_123"
    role = "STUDENT"
    token = create_access_token(subject=user_id, role=role)

    assert isinstance(token, str)
    assert len(token) > 20

    payload = decode_access_token(token)
    assert payload is not None
    assert payload["sub"] == user_id
    assert payload["role"] == role
    assert "exp" in payload

def test_invalid_jwt_token_decoding():
    assert decode_access_token("invalid.token.payload") is None
    assert decode_access_token("") is None

def test_role_normalization():
    assert normalize_role("tpo") == AppRole.PLACEMENT_OFFICER
    assert normalize_role("TPO") == AppRole.PLACEMENT_OFFICER
    assert normalize_role("PLACEMENT_OFFICER") == AppRole.PLACEMENT_OFFICER
    assert normalize_role("student") == AppRole.STUDENT
    assert normalize_role("recruiter") == AppRole.RECRUITER
    assert normalize_role("admin") == AppRole.ADMIN
    assert normalize_role("unknown_role") == AppRole.STUDENT

def test_role_matches():
    assert role_matches("tpo", ["PLACEMENT_OFFICER", "ADMIN"]) is True
    assert role_matches("STUDENT", ["RECRUITER"]) is False
    assert role_matches("HR", ["RECRUITER"]) is True
