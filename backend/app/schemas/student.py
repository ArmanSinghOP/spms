from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class StudentBase(BaseModel):
    roll_number: str
    department: str = Field(..., description="Department: CSE, CSE(AIML), CSE(AI), CSIT, IT, CS, ECE, EEE, ME")
    batch: int = Field(default=2025)
    cgpa: float = Field(ge=0.0, le=10.0, default=0.0)
    tenth_percentage: float = Field(ge=0.0, le=100.0, default=0.0)
    twelfth_percentage: float = Field(ge=0.0, le=100.0, default=0.0)
    active_backlogs: int = Field(ge=0, default=0)
    history_backlogs: int = Field(ge=0, default=0)
    skills: List[str] = Field(default_factory=list)
    resume_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    placement_status: str = Field(default="unplaced", description="unplaced, placed, opted_out")
    offers_count: int = Field(default=0)

class StudentProfileCreate(StudentBase):
    pass

class StudentProfileUpdate(BaseModel):
    roll_number: Optional[str] = None
    department: Optional[str] = None
    batch: Optional[int] = None
    cgpa: Optional[float] = Field(None, ge=0.0, le=10.0)
    tenth_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)
    twelfth_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)
    active_backlogs: Optional[int] = Field(None, ge=0)
    history_backlogs: Optional[int] = Field(None, ge=0)
    skills: Optional[List[str]] = None
    resume_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    placement_status: Optional[str] = None

class StudentResponse(StudentBase):
    id: str
    user_id: str
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
