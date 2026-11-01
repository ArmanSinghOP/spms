from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class DriveRound(BaseModel):
    round_number: int
    name: str = Field(..., description="e.g., Online Assessment, Technical Interview 1, HR Round")
    description: Optional[str] = None

class EligibilityCriteria(BaseModel):
    min_cgpa: float = Field(default=6.0, ge=0.0, le=10.0)
    min_tenth_percentage: float = Field(default=60.0, ge=0.0, le=100.0)
    min_twelfth_percentage: float = Field(default=60.0, ge=0.0, le=100.0)
    max_active_backlogs: int = Field(default=0, ge=0)
    max_history_backlogs: int = Field(default=2, ge=0)
    allowed_departments: List[str] = Field(default_factory=lambda: ["CSE", "CSE(AIML)", "CSE(AI)", "CSIT", "IT", "CS", "ECE", "EEE", "ME"])
    allowed_batches: List[int] = Field(default_factory=lambda: [2025, 2026])
    allow_already_placed: bool = False

class DriveBase(BaseModel):
    title: str
    company_name: str
    job_role: str
    job_description: str
    package_ctc: float = Field(..., description="CTC in LPA, e.g., 12.5")
    stipend: Optional[str] = "N/A"
    job_location: str = "Pan India / Hybrid"
    drive_date: datetime
    application_deadline: datetime
    status: str = Field(default="active", description="upcoming, active, completed, cancelled")
    eligibility_criteria: EligibilityCriteria
    rounds: List[DriveRound] = Field(default_factory=lambda: [
        DriveRound(round_number=1, name="Online Assessment (OA)", description="Aptitude & DSA coding test"),
        DriveRound(round_number=2, name="Technical Interview", description="Core CS concepts & project deep dive"),
        DriveRound(round_number=3, name="HR / Fitment Interview", description="Behavioral and cultural fitment")
    ])

class DriveCreate(DriveBase):
    pass

class DriveUpdate(BaseModel):
    title: Optional[str] = None
    company_name: Optional[str] = None
    job_role: Optional[str] = None
    job_description: Optional[str] = None
    package_ctc: Optional[float] = None
    stipend: Optional[str] = None
    job_location: Optional[str] = None
    drive_date: Optional[datetime] = None
    application_deadline: Optional[datetime] = None
    status: Optional[str] = None
    eligibility_criteria: Optional[EligibilityCriteria] = None
    rounds: Optional[List[DriveRound]] = None

class EligibilityCheckResult(BaseModel):
    eligible: bool
    reasons: List[str] = Field(default_factory=list)

class DriveResponse(DriveBase):
    id: str
    created_by: Optional[str] = None
    created_at: datetime
    total_applicants: Optional[int] = 0
    # Dynamic field computed for a specific student requesting drive details
    user_eligibility: Optional[EligibilityCheckResult] = None
    has_applied: Optional[bool] = False
    application_status: Optional[str] = None

    class Config:
        from_attributes = True
