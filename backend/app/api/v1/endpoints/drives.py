from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

from app.core.database import get_database
from app.dependencies.auth import get_current_user, require_roles
from app.schemas.drive import DriveCreate, DriveUpdate, DriveResponse, EligibilityCheckResult
from app.services.eligibility_service import check_student_eligibility

router = APIRouter()

@router.get("/", response_model=List[DriveResponse])
async def list_drives(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    query = {}
    if status_filter:
        query["status"] = status_filter
        
    cursor = db.drives.find(query).sort("created_at", -1)
    drives = await cursor.to_list(length=100)
    
    # If the user is a student, fetch their profile and existing applications to compute eligibility
    student_profile = None
    applied_drive_map = {}
    if current_user.get("role") == "student":
        student_profile = await db.students.find_one({"user_id": current_user["id"]})
        if student_profile:
            student_profile["id"] = str(student_profile["_id"])
            student_apps = await db.applications.find({"student_id": student_profile["id"]}).to_list(length=100)
            applied_drive_map = {app["drive_id"]: app.get("status", "Applied") for app in student_apps}
            
    # Also fetch applicant counts per drive
    results = []
    for d in drives:
        d_id = str(d["_id"])
        d["id"] = d_id
        
        # Count applicants
        applicant_count = await db.applications.count_documents({"drive_id": d_id})
        d["total_applicants"] = applicant_count
        
        # Student specific calculations
        if student_profile:
            eligibility_res = check_student_eligibility(student_profile, d.get("eligibility_criteria", {}))
            d["user_eligibility"] = eligibility_res
            d["has_applied"] = d_id in applied_drive_map
            d["application_status"] = applied_drive_map.get(d_id)
            
        results.append(d)
        
    return results

@router.post("/", response_model=DriveResponse)
async def create_drive(
    drive_in: DriveCreate,
    current_user: dict = Depends(require_roles(["tpo", "admin", "recruiter"])),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    drive_dict = drive_in.dict()
    drive_dict["created_by"] = current_user["id"]
    drive_dict["created_at"] = datetime.utcnow()
    drive_dict["updated_at"] = datetime.utcnow()
    
    result = await db.drives.insert_one(drive_dict)
    drive_dict["id"] = str(result.inserted_id)
    drive_dict["total_applicants"] = 0
    return drive_dict

@router.get("/{drive_id}", response_model=DriveResponse)
async def get_drive(
    drive_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        drive = await db.drives.find_one({"_id": ObjectId(drive_id)})
    except Exception:
        drive = await db.drives.find_one({"_id": drive_id})
        
    if not drive:
        raise HTTPException(status_code=404, detail="Drive not found")
        
    drive["id"] = str(drive["_id"])
    drive["total_applicants"] = await db.applications.count_documents({"drive_id": drive["id"]})
    
    if current_user.get("role") == "student":
        student_profile = await db.students.find_one({"user_id": current_user["id"]})
        if student_profile:
            student_profile["id"] = str(student_profile["_id"])
            drive["user_eligibility"] = check_student_eligibility(student_profile, drive.get("eligibility_criteria", {}))
            existing_app = await db.applications.find_one({"drive_id": drive["id"], "student_id": student_profile["id"]})
            drive["has_applied"] = existing_app is not None
            drive["application_status"] = existing_app.get("status") if existing_app else None
            
    return drive

@router.put("/{drive_id}", response_model=DriveResponse)
async def update_drive(
    drive_id: str,
    drive_in: DriveUpdate,
    current_user: dict = Depends(require_roles(["tpo", "admin", "recruiter"])),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    update_data = {k: v for k, v in drive_in.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    try:
        query = {"_id": ObjectId(drive_id)}
    except Exception:
        query = {"_id": drive_id}
        
    updated = await db.drives.find_one_and_update(
        query,
        {"$set": update_data},
        return_document=True
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Drive not found")
        
    updated["id"] = str(updated["_id"])
    updated["total_applicants"] = await db.applications.count_documents({"drive_id": updated["id"]})
    return updated

@router.delete("/{drive_id}")
async def delete_drive(
    drive_id: str,
    current_user: dict = Depends(require_roles(["tpo", "admin"])),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        query = {"_id": ObjectId(drive_id)}
    except Exception:
        query = {"_id": drive_id}
        
    res = await db.drives.delete_one(query)
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Drive not found")
        
    # Also delete associated applications
    await db.applications.delete_many({"drive_id": drive_id})
    return {"message": "Drive and its applications successfully removed."}
