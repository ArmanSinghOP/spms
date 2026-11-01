from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class RoundHistoryEntry(BaseModel):
    round_name: str
    status: str = Field(..., description="Cleared, In Review, Rejected, Scheduled")
    remarks: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ApplicationCreate(BaseModel):
    drive_id: str

class ApplicationStatusUpdate(BaseModel):
    status: str = Field(..., description="Applied, OA Shortlisted, Interview Round 1, Interview Round 2, Offered, Rejected, Withdrawn")
    round_name: Optional[str] = None
    remarks: Optional[str] = None
    current_round: Optional[int] = None
    offer_ctc: Optional[float] = None

class ApplicationResponse(BaseModel):
    id: str
    drive_id: str
    student_id: str
    student_user_id: Optional[str] = None
    student_name: Optional[str] = None
    student_roll: Optional[str] = None
    student_department: Optional[str] = None
    student_cgpa: Optional[float] = None
    student_email: Optional[str] = None
    student_resume_url: Optional[str] = None

    company_name: Optional[str] = None
    drive_title: Optional[str] = None
    job_role: Optional[str] = None
    package_ctc: Optional[float] = None

    status: str
    current_round: int = 1
    round_history: List[RoundHistoryEntry] = Field(default_factory=list)
    applied_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
