from fastapi import APIRouter
from app.api.v1.endpoints import auth, students, drives, applications, analytics, companies

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(students.router, prefix="/students", tags=["Students"])
api_router.include_router(companies.router, prefix="/companies", tags=["Companies"])
api_router.include_router(drives.router, prefix="/drives", tags=["Placement Drives"])
api_router.include_router(applications.router, prefix="/applications", tags=["Applications"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics & KPIs"])
