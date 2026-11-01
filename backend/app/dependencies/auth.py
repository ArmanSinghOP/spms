from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId
from pymongo.asynchronous.database import AsyncDatabase
from typing import List, Dict, Any

from app.core.security import decode_access_token
from app.core.database import get_database
from app.core.roles import normalize_role, role_matches

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncDatabase = Depends(get_database)
) -> Dict[str, Any]:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id = payload.get("sub")
    if not user_id:
        raise credentials_exception

    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        user = await db.users.find_one({"_id": user_id})

    if user is None:
        raise credentials_exception

    if not user.get("is_active", True):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user account")

    user["id"] = str(user["_id"])
    user["role"] = normalize_role(user.get("role", "STUDENT")).value
    return user

def require_roles(allowed_roles: List[str]):
    async def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        user_role = current_user.get("role", "STUDENT")
        if not role_matches(user_role, allowed_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required roles: {allowed_roles}, your role: {user_role}"
            )
        return current_user
    return role_checker

async def get_current_tpo(current_user: Dict[str, Any] = Depends(require_roles(["PLACEMENT_OFFICER", "ADMIN", "tpo"]))) -> Dict[str, Any]:
    return current_user

async def get_current_admin(current_user: Dict[str, Any] = Depends(require_roles(["ADMIN"]))) -> Dict[str, Any]:
    return current_user

async def get_current_recruiter(current_user: Dict[str, Any] = Depends(require_roles(["RECRUITER", "ADMIN"]))) -> Dict[str, Any]:
    return current_user

async def get_current_student(
    current_user: Dict[str, Any] = Depends(require_roles(["STUDENT", "student"])),
    db: AsyncDatabase = Depends(get_database)
) -> Dict[str, Any]:
    student_profile = await db.students.find_one({"user_id": current_user["id"]})
    if not student_profile:
        profile_data = {
            "user_id": current_user["id"],
            "roll_number": current_user.get("roll_number", f"STU{str(current_user['id'])[:6]}"),
            "department": current_user.get("department", "CSE"),
            "batch": 2025,
            "cgpa": 7.5,
            "tenth_percentage": 75.0,
            "twelfth_percentage": 75.0,
            "active_backlogs": 0,
            "history_backlogs": 0,
            "skills": ["Python", "Problem Solving", "Web Basics"],
            "placement_status": "unplaced",
            "offers_count": 0
        }
        res = await db.students.insert_one(profile_data)
        profile_data["_id"] = res.inserted_id
        student_profile = profile_data

    student_profile["id"] = str(student_profile["_id"])
    student_profile["user"] = current_user
    return student_profile
