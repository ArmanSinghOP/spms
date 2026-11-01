from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.asynchronous.database import AsyncDatabase
from datetime import datetime

from app.core.database import get_database
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.roles import AppRole, normalize_role
from app.schemas.user import UserRegister, UserLogin, UserResponse, Token
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.post("/register", response_model=Token)
async def register(user_in: UserRegister, db: AsyncDatabase = Depends(get_database)):
    # Security Rule: Public registration must only be for STUDENTS
    requested_role = normalize_role(user_in.role or "STUDENT")
    if requested_role != AppRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Public registration is restricted to Students only. Administrative and Recruiter accounts must be created by institution management."
        )

    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_in.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists in the system."
        )

    # Create user doc
    user_doc = {
        "email": user_in.email.lower(),
        "password_hash": get_password_hash(user_in.password),
        "full_name": user_in.full_name,
        "phone": user_in.phone or "",
        "role": AppRole.STUDENT.value,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    user_doc["id"] = user_id

    # Create student profile
    student_doc = {
        "user_id": user_id,
        "roll_number": user_in.roll_number or f"210029{user_id[-5:]}",
        "department": user_in.department or "CSE",
        "batch": user_in.batch or 2025,
        "cgpa": user_in.cgpa or 7.8,
        "tenth_percentage": 82.0,
        "twelfth_percentage": 80.0,
        "active_backlogs": 0,
        "history_backlogs": 0,
        "skills": ["Python", "DSA", "Problem Solving"],
        "placement_status": "unplaced",
        "offers_count": 0,
        "resume_url": "",
        "created_at": datetime.utcnow()
    }
    await db.students.insert_one(student_doc)

    access_token = create_access_token(subject=user_id, role=user_doc["role"])

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user_id,
            email=user_doc["email"],
            full_name=user_doc["full_name"],
            phone=user_doc["phone"],
            role=user_doc["role"],
            is_active=True,
            created_at=user_doc["created_at"]
        )
    )

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncDatabase = Depends(get_database)):
    user = await db.users.find_one({"email": credentials.email.lower()})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password combination."
        )

    if not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password combination."
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact TPO administrator."
        )

    user_id = str(user["_id"])
    canonical_role = normalize_role(user.get("role", "STUDENT")).value
    access_token = create_access_token(subject=user_id, role=canonical_role)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user_id,
            email=user["email"],
            full_name=user["full_name"],
            phone=user.get("phone"),
            role=canonical_role,
            is_active=user["is_active"],
            created_at=user.get("created_at", datetime.utcnow())
        )
    )

@router.get("/me")
async def get_current_user_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_database)
):
    profile_data = {"user": current_user}
    if normalize_role(current_user.get("role")) == AppRole.STUDENT:
        student = await db.students.find_one({"user_id": current_user["id"]})
        if student:
            student["id"] = str(student["_id"])
            profile_data["student_profile"] = student
    return profile_data
