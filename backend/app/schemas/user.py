from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: str = Field(default="student", description="Role: student, tpo, admin, recruiter")

class UserRegister(UserBase):
    password: str = Field(min_length=6)
    # Optional student profile fields for convenience when registering
    roll_number: Optional[str] = None
    department: Optional[str] = None
    batch: Optional[int] = 2025
    cgpa: Optional[float] = 0.0

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenPayload(BaseModel):
    sub: str
    role: str
    exp: int
