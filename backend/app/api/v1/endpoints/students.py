from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, status
from pymongo.asynchronous.database import AsyncDatabase
from bson import ObjectId
from typing import List, Optional
import os
import shutil
from datetime import datetime

from app.core.database import get_database
from app.core.config import settings
from app.core.roles import normalize_role, AppRole
from app.dependencies.auth import get_current_user, require_roles
from app.schemas.student import StudentProfileUpdate, StudentResponse

router = APIRouter()

@router.get("/me", response_model=StudentResponse)
async def get_my_student_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_database)
):
    if normalize_role(current_user.get("role")) != AppRole.STUDENT:
        raise HTTPException(status_code=400, detail="User is not a student")
        
    student = await db.students.find_one({"user_id": current_user["id"]})
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    student["id"] = str(student["_id"])
    student["full_name"] = current_user.get("full_name")
    student["email"] = current_user.get("email")
    student["phone"] = current_user.get("phone")
    return student

@router.put("/me", response_model=StudentResponse)
async def update_my_student_profile(
    profile_update: StudentProfileUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_database)
):
    if normalize_role(current_user.get("role")) != AppRole.STUDENT:
        raise HTTPException(status_code=400, detail="User is not a student")
        
    update_data = {k: v for k, v in profile_update.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.students.find_one_and_update(
        {"user_id": current_user["id"]},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    result["id"] = str(result["_id"])
    result["full_name"] = current_user.get("full_name")
    result["email"] = current_user.get("email")
    result["phone"] = current_user.get("phone")
    return result

@router.post("/me/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_database)
):
    if normalize_role(current_user.get("role")) != AppRole.STUDENT:
        raise HTTPException(status_code=400, detail="User is not a student")
        
    if not file.filename.lower().endswith(('.pdf', '.doc', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and Word documents are permitted for resumes")
        
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"resume_{current_user['id']}_{int(datetime.utcnow().timestamp())}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    resume_url = f"/uploads/{filename}"
    await db.students.update_one(
        {"user_id": current_user["id"]},
        {"$set": {"resume_url": resume_url, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Resume uploaded successfully", "resume_url": resume_url, "filename": filename}

@router.get("/", response_model=List[StudentResponse])
async def list_students(
    department: Optional[str] = Query(None),
    batch: Optional[int] = Query(None),
    placement_status: Optional[str] = Query(None),
    min_cgpa: Optional[float] = Query(None),
    search: Optional[str] = Query(None),
    current_user: dict = Depends(require_roles(["PLACEMENT_OFFICER", "ADMIN", "RECRUITER", "tpo"])),
    db: AsyncDatabase = Depends(get_database)
):
    query = {}
    if department:
        query["department"] = department.upper()
    if batch:
        query["batch"] = batch
    if placement_status:
        query["placement_status"] = placement_status
    if min_cgpa is not None:
        query["cgpa"] = {"$gte": min_cgpa}
    if search:
        query["$or"] = [
            {"roll_number": {"$regex": search, "$options": "i"}},
            {"skills": {"$regex": search, "$options": "i"}}
        ]
        
    cursor = db.students.find(query).limit(100)
    students = await cursor.to_list(length=100)
    
    # Attach user info for each student
    user_ids = [s["user_id"] for s in students if "user_id" in s]
    users_cursor = db.users.find({"_id": {"$in": [ObjectId(uid) for uid in user_ids if ObjectId.is_valid(uid)]}})
    users_list = await users_cursor.to_list(length=len(user_ids))
    users_map = {str(u["_id"]): u for u in users_list}
    
    results = []
    for s in students:
        s["id"] = str(s["_id"])
        u = users_map.get(s["user_id"], {})
        s["full_name"] = u.get("full_name", "Student")
        s["email"] = u.get("email", "")
        s["phone"] = u.get("phone", "")
        results.append(s)
        
    return results

@router.get("/{student_id}", response_model=StudentResponse)
async def get_student_by_id(
    student_id: str,
    current_user: dict = Depends(require_roles(["PLACEMENT_OFFICER", "ADMIN", "RECRUITER", "tpo"])),
    db: AsyncDatabase = Depends(get_database)
):
    try:
        student = await db.students.find_one({"_id": ObjectId(student_id)})
    except Exception:
        student = await db.students.find_one({"user_id": student_id})
        
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    student["id"] = str(student["_id"])
    try:
        user = await db.users.find_one({"_id": ObjectId(student["user_id"])})
        if user:
            student["full_name"] = user.get("full_name")
            student["email"] = user.get("email")
            student["phone"] = user.get("phone")
    except Exception:
        pass
        
    return student
