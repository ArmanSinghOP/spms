from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CompanyBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    industry: str = Field(default="Information Technology")
    website: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    tier: str = Field(default="Tier 1 - Dream (>10 LPA)")
    location: str = Field(default="Pan-India")
    description: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    tier: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None

class CompanyResponse(CompanyBase):
    id: str
    active_drives_count: int = 0
    total_hires_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
