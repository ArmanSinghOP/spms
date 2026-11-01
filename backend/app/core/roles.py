from enum import Enum
from typing import List

class AppRole(str, Enum):
    STUDENT = "STUDENT"
    PLACEMENT_OFFICER = "PLACEMENT_OFFICER"
    RECRUITER = "RECRUITER"
    ADMIN = "ADMIN"

def normalize_role(role_str: str) -> AppRole:
    """Normalize input role strings, preserving backward compatibility for aliases like 'tpo'."""
    if not role_str:
        return AppRole.STUDENT

    cleaned = role_str.strip().upper()
    if cleaned in ("TPO", "PLACEMENT_OFFICER", "PLACEMENT-OFFICER", "OFFICER"):
        return AppRole.PLACEMENT_OFFICER
    elif cleaned in ("STUDENT", "STU"):
        return AppRole.STUDENT
    elif cleaned in ("RECRUITER", "COMPANY", "HR"):
        return AppRole.RECRUITER
    elif cleaned in ("ADMIN", "ADMINISTRATOR", "SUPERADMIN"):
        return AppRole.ADMIN
    else:
        return AppRole.STUDENT

def role_matches(user_role: str, allowed_roles: List[str]) -> bool:
    """Check if normalized user_role matches any of the allowed role strings."""
    norm_user = normalize_role(user_role)
    norm_allowed = [normalize_role(r) for r in allowed_roles]
    return norm_user in norm_allowed
