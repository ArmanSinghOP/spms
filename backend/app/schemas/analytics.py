from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class DepartmentStat(BaseModel):
    department: str
    total_students: int
    placed_students: int
    placement_rate: float
    average_ctc: float

class TPODashboardStats(BaseModel):
    total_students: int
    placed_students: int
    unplaced_students: int
    placement_percentage: float
    total_drives: int
    active_drives: int
    total_offers: int
    highest_package_lpa: float
    average_package_lpa: float
    department_stats: List[DepartmentStat]

class StudentDashboardStats(BaseModel):
    total_active_drives: int
    eligible_drives_count: int
    applied_count: int
    shortlisted_count: int
    offers_count: int
    placement_status: str
    cgpa: float
    department: str
