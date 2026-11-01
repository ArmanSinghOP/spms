from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List

from app.core.database import get_database
from app.dependencies.auth import get_current_user, require_roles
from app.schemas.analytics import TPODashboardStats, StudentDashboardStats, DepartmentStat
from app.services.eligibility_service import check_student_eligibility

router = APIRouter()

@router.get("/tpo", response_model=TPODashboardStats)
async def get_tpo_analytics(
    current_user: dict = Depends(require_roles(["tpo", "admin"])),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    total_students = await db.students.count_documents({})
    placed_students = await db.students.count_documents({"placement_status": "placed"})
    unplaced_students = total_students - placed_students
    placement_percentage = round((placed_students / total_students * 100), 1) if total_students > 0 else 0.0
    
    total_drives = await db.drives.count_documents({})
    active_drives = await db.drives.count_documents({"status": "active"})
    total_offers = await db.applications.count_documents({"status": {"$in": ["Offered", "Selected", "Accepted"]}})
    
    # Calculate highest and average package from active or completed drives with offers
    cursor = db.drives.find({}, {"package_ctc": 1})
    drives_ctc = await cursor.to_list(length=100)
    ctc_list = [d.get("package_ctc", 0.0) for d in drives_ctc if d.get("package_ctc")]
    
    highest_package = max(ctc_list) if ctc_list else 0.0
    average_package = round(sum(ctc_list) / len(ctc_list), 2) if ctc_list else 0.0
    
    # Department breakdown
    departments = ["CSE", "CSE(AIML)", "CSE(AI)", "CSIT", "IT", "CS", "ECE", "EEE", "ME"]
    dept_stats: List[DepartmentStat] = []
    
    for dept in departments:
        dept_total = await db.students.count_documents({"department": dept})
        dept_placed = await db.students.count_documents({"department": dept, "placement_status": "placed"})
        rate = round((dept_placed / dept_total * 100), 1) if dept_total > 0 else 0.0
        dept_stats.append(DepartmentStat(
            department=dept,
            total_students=dept_total,
            placed_students=dept_placed,
            placement_rate=rate,
            average_ctc=average_package
        ))
        
    return TPODashboardStats(
        total_students=total_students,
        placed_students=placed_students,
        unplaced_students=unplaced_students,
        placement_percentage=placement_percentage,
        total_drives=total_drives,
        active_drives=active_drives,
        total_offers=total_offers,
        highest_package_lpa=highest_package,
        average_package_lpa=average_package,
        department_stats=dept_stats
    )

@router.get("/student", response_model=StudentDashboardStats)
async def get_student_analytics(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    if current_user.get("role") != "student":
        raise HTTPException(status_code=400, detail="User is not a student")
        
    student = await db.students.find_one({"user_id": current_user["id"]})
    if not student:
        return StudentDashboardStats(
            total_active_drives=0,
            eligible_drives_count=0,
            applied_count=0,
            shortlisted_count=0,
            offers_count=0,
            placement_status="unplaced",
            cgpa=0.0,
            department="CSE"
        )
        
    student_id = str(student["_id"])
    active_drives = await db.drives.find({"status": "active"}).to_list(length=100)
    
    eligible_count = 0
    student_dict = dict(student)
    student_dict["id"] = student_id
    for d in active_drives:
        eligibility = check_student_eligibility(student_dict, d.get("eligibility_criteria", {}))
        if eligibility.eligible:
            eligible_count += 1
            
    applied_count = await db.applications.count_documents({"student_id": student_id})
    shortlisted_count = await db.applications.count_documents({
        "student_id": student_id,
        "status": {"$in": ["OA Shortlisted", "Interview Round 1", "Interview Round 2", "HR Round", "Offered"]}
    })
    offers_count = await db.applications.count_documents({
        "student_id": student_id,
        "status": {"$in": ["Offered", "Selected", "Accepted"]}
    })
    
    return StudentDashboardStats(
        total_active_drives=len(active_drives),
        eligible_drives_count=eligible_count,
        applied_count=applied_count,
        shortlisted_count=shortlisted_count,
        offers_count=offers_count,
        placement_status=student.get("placement_status", "unplaced"),
        cgpa=student.get("cgpa", 0.0),
        department=student.get("department", "CSE")
    )
