from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

from app.core.database import get_database
from app.dependencies.auth import get_current_user, require_roles
from app.schemas.application import ApplicationCreate, ApplicationStatusUpdate, ApplicationResponse, RoundHistoryEntry
from app.services.eligibility_service import check_student_eligibility

router = APIRouter()

@router.post("/", response_model=ApplicationResponse)
async def apply_to_drive(
    app_in: ApplicationCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    if current_user.get("role") != "student":
        raise HTTPException(status_code=400, detail="Only students can apply to placement drives.")
        
    student = await db.students.find_one({"user_id": current_user["id"]})
    if not student:
        raise HTTPException(status_code=400, detail="Student profile not found. Please complete profile first.")
        
    student_id = str(student["_id"])
    
    # Check drive
    try:
        drive = await db.drives.find_one({"_id": ObjectId(app_in.drive_id)})
    except Exception:
        drive = await db.drives.find_one({"_id": app_in.drive_id})
        
    if not drive:
        raise HTTPException(status_code=404, detail="Placement drive not found.")
        
    if drive.get("status") != "active":
        raise HTTPException(status_code=400, detail=f"Cannot apply: drive status is {drive.get('status')}.")
        
    # Check application deadline
    deadline = drive.get("application_deadline")
    if deadline and datetime.utcnow() > deadline:
        raise HTTPException(status_code=400, detail="Application deadline for this drive has expired.")
        
    # Check existing application
    existing = await db.applications.find_one({"drive_id": app_in.drive_id, "student_id": student_id})
    if existing:
        raise HTTPException(status_code=400, detail="You have already submitted an application for this drive.")
        
    # Verify Eligibility
    student_profile_dict = dict(student)
    student_profile_dict["id"] = student_id
    eligibility = check_student_eligibility(student_profile_dict, drive.get("eligibility_criteria", {}))
    if not eligibility.eligible:
        raise HTTPException(
            status_code=400,
            detail=f"Eligibility criteria not satisfied: {'; '.join(eligibility.reasons)}"
        )
        
    # Create application
    now = datetime.utcnow()
    app_doc = {
        "drive_id": app_in.drive_id,
        "student_id": student_id,
        "student_user_id": current_user["id"],
        "status": "Applied",
        "current_round": 1,
        "round_history": [
            {
                "round_name": "Application Submission",
                "status": "Submitted",
                "remarks": "Application registered and eligibility verified successfully.",
                "updated_at": now
            }
        ],
        "applied_at": now,
        "updated_at": now
    }
    
    result = await db.applications.insert_one(app_doc)
    app_id = str(result.inserted_id)
    
    return ApplicationResponse(
        id=app_id,
        drive_id=app_in.drive_id,
        student_id=student_id,
        student_user_id=current_user["id"],
        student_name=current_user.get("full_name"),
        student_roll=student.get("roll_number"),
        student_department=student.get("department"),
        student_cgpa=student.get("cgpa"),
        student_email=current_user.get("email"),
        student_resume_url=student.get("resume_url"),
        company_name=drive.get("company_name"),
        drive_title=drive.get("title"),
        job_role=drive.get("job_role"),
        package_ctc=drive.get("package_ctc"),
        status="Applied",
        current_round=1,
        round_history=[RoundHistoryEntry(
            round_name="Application Submission",
            status="Submitted",
            remarks="Application registered and eligibility verified successfully.",
            updated_at=now
        )],
        applied_at=now,
        updated_at=now
    )

@router.get("/my", response_model=List[ApplicationResponse])
async def get_my_applications(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    if current_user.get("role") != "student":
        raise HTTPException(status_code=400, detail="Only students have personal applications.")
        
    student = await db.students.find_one({"user_id": current_user["id"]})
    if not student:
        return []
        
    student_id = str(student["_id"])
    cursor = db.applications.find({"student_id": student_id}).sort("applied_at", -1)
    apps = await cursor.to_list(length=100)
    
    results = []
    for app in apps:
        app_id = str(app["_id"])
        
        # Load drive info
        drive_info = {}
        try:
            d = await db.drives.find_one({"_id": ObjectId(app["drive_id"])})
            if d:
                drive_info = d
        except Exception:
            pass
            
        history_entries = [
            RoundHistoryEntry(
                round_name=h.get("round_name", ""),
                status=h.get("status", ""),
                remarks=h.get("remarks"),
                updated_at=h.get("updated_at", app["applied_at"])
            )
            for h in app.get("round_history", [])
        ]
        
        results.append(ApplicationResponse(
            id=app_id,
            drive_id=app["drive_id"],
            student_id=student_id,
            student_user_id=current_user["id"],
            student_name=current_user.get("full_name"),
            student_roll=student.get("roll_number"),
            student_department=student.get("department"),
            student_cgpa=student.get("cgpa"),
            student_email=current_user.get("email"),
            student_resume_url=student.get("resume_url"),
            company_name=drive_info.get("company_name", "Company"),
            drive_title=drive_info.get("title", "Placement Drive"),
            job_role=drive_info.get("job_role", "Software Role"),
            package_ctc=drive_info.get("package_ctc"),
            status=app.get("status", "Applied"),
            current_round=app.get("current_round", 1),
            round_history=history_entries,
            applied_at=app.get("applied_at", datetime.utcnow()),
            updated_at=app.get("updated_at")
        ))
        
    return results

@router.get("/drive/{drive_id}", response_model=List[ApplicationResponse])
async def get_drive_applicants(
    drive_id: str,
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: dict = Depends(require_roles(["tpo", "admin", "recruiter"])),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    query = {"drive_id": drive_id}
    if status_filter:
        query["status"] = status_filter
        
    cursor = db.applications.find(query).sort("applied_at", -1)
    apps = await cursor.to_list(length=200)
    
    # Load drive info
    drive_info = {}
    try:
        d = await db.drives.find_one({"_id": ObjectId(drive_id)})
        if d:
            drive_info = d
    except Exception:
        pass
        
    results = []
    for app in apps:
        app_id = str(app["_id"])
        
        # Load student & user info
        student = None
        user = None
        try:
            student = await db.students.find_one({"_id": ObjectId(app["student_id"])})
            if student:
                user = await db.users.find_one({"_id": ObjectId(student["user_id"])})
        except Exception:
            pass
            
        history_entries = [
            RoundHistoryEntry(
                round_name=h.get("round_name", ""),
                status=h.get("status", ""),
                remarks=h.get("remarks"),
                updated_at=h.get("updated_at", app["applied_at"])
            )
            for h in app.get("round_history", [])
        ]
        
        results.append(ApplicationResponse(
            id=app_id,
            drive_id=drive_id,
            student_id=app["student_id"],
            student_user_id=student.get("user_id") if student else None,
            student_name=user.get("full_name", "Student") if user else "Student",
            student_roll=student.get("roll_number", "N/A") if student else "N/A",
            student_department=student.get("department", "CSE") if student else "CSE",
            student_cgpa=student.get("cgpa", 0.0) if student else 0.0,
            student_email=user.get("email") if user else None,
            student_resume_url=student.get("resume_url") if student else None,
            company_name=drive_info.get("company_name", "Company"),
            drive_title=drive_info.get("title", "Placement Drive"),
            job_role=drive_info.get("job_role", "Software Role"),
            package_ctc=drive_info.get("package_ctc"),
            status=app.get("status", "Applied"),
            current_round=app.get("current_round", 1),
            round_history=history_entries,
            applied_at=app.get("applied_at", datetime.utcnow()),
            updated_at=app.get("updated_at")
        ))
        
    return results

@router.put("/{application_id}/status")
async def update_application_status(
    application_id: str,
    status_update: ApplicationStatusUpdate,
    current_user: dict = Depends(require_roles(["tpo", "admin", "recruiter"])),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        app_obj_id = ObjectId(application_id)
        app = await db.applications.find_one({"_id": app_obj_id})
    except Exception:
        app = await db.applications.find_one({"_id": application_id})
        app_obj_id = application_id
        
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    now = datetime.utcnow()
    new_entry = {
        "round_name": status_update.round_name or f"Status changed to {status_update.status}",
        "status": status_update.status,
        "remarks": status_update.remarks or "",
        "updated_at": now
    }
    
    update_fields = {
        "status": status_update.status,
        "updated_at": now
    }
    if status_update.current_round is not None:
        update_fields["current_round"] = status_update.current_round
        
    await db.applications.update_one(
        {"_id": app["_id"]},
        {
            "$set": update_fields,
            "$push": {"round_history": new_entry}
        }
    )
    
    # If student is Offered, update student placement status to 'placed'
    if status_update.status.lower() in ["offered", "selected", "accepted"]:
        try:
            await db.students.update_one(
                {"_id": ObjectId(app["student_id"])},
                {
                    "$set": {"placement_status": "placed", "updated_at": now},
                    "$inc": {"offers_count": 1}
                }
            )
        except Exception:
            pass
            
    return {"message": "Application status updated successfully", "status": status_update.status}
