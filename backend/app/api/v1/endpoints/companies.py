from fastapi import APIRouter, Depends, HTTPException, Query, status
from pymongo.asynchronous.database import AsyncDatabase
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

from app.core.database import get_database
from app.dependencies.auth import get_current_user, require_roles
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse

router = APIRouter()

@router.get("/", response_model=List[CompanyResponse])
async def list_companies(
    industry: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_database)
):
    query = {}
    if industry:
        query["industry"] = industry
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"industry": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}}
        ]
        
    cursor = db.companies.find(query).sort("name", 1)
    companies = await cursor.to_list(length=100)
    
    results = []
    for c in companies:
        c_id = str(c["_id"])
        c["id"] = c_id
        c["active_drives_count"] = await db.drives.count_documents({"company_name": c["name"], "status": "active"})
        c["total_hires_count"] = await db.applications.count_documents({"company_name": c["name"], "status": {"$in": ["Offered", "Selected"]}})
        results.append(c)
        
    return results

@router.post("/", response_model=CompanyResponse)
async def create_company(
    comp_in: CompanyCreate,
    current_user: dict = Depends(require_roles(["PLACEMENT_OFFICER", "ADMIN", "tpo"])),
    db: AsyncDatabase = Depends(get_database)
):
    existing = await db.companies.find_one({"name": comp_in.name})
    if existing:
        raise HTTPException(status_code=400, detail="A company with this name is already registered.")
        
    comp_dict = comp_in.dict()
    comp_dict["created_at"] = datetime.utcnow()
    comp_dict["updated_at"] = datetime.utcnow()
    
    result = await db.companies.insert_one(comp_dict)
    comp_dict["id"] = str(result.inserted_id)
    comp_dict["active_drives_count"] = 0
    comp_dict["total_hires_count"] = 0
    return comp_dict

@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_database)
):
    try:
        comp = await db.companies.find_one({"_id": ObjectId(company_id)})
    except Exception:
        comp = await db.companies.find_one({"_id": company_id})
        
    if not comp:
        raise HTTPException(status_code=404, detail="Company not found")
        
    comp["id"] = str(comp["_id"])
    comp["active_drives_count"] = await db.drives.count_documents({"company_name": comp["name"], "status": "active"})
    comp["total_hires_count"] = await db.applications.count_documents({"company_name": comp["name"], "status": {"$in": ["Offered", "Selected"]}})
    return comp

@router.put("/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: str,
    comp_in: CompanyUpdate,
    current_user: dict = Depends(require_roles(["PLACEMENT_OFFICER", "ADMIN", "tpo"])),
    db: AsyncDatabase = Depends(get_database)
):
    update_data = {k: v for k, v in comp_in.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    try:
        query = {"_id": ObjectId(company_id)}
    except Exception:
        query = {"_id": company_id}
        
    updated = await db.companies.find_one_and_update(
        query,
        {"$set": update_data},
        return_document=True
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Company not found")
        
    updated["id"] = str(updated["_id"])
    updated["active_drives_count"] = await db.drives.count_documents({"company_name": updated["name"], "status": "active"})
    updated["total_hires_count"] = await db.applications.count_documents({"company_name": updated["name"], "status": {"$in": ["Offered", "Selected"]}})
    return updated

@router.delete("/{company_id}")
async def delete_company(
    company_id: str,
    current_user: dict = Depends(require_roles(["PLACEMENT_OFFICER", "ADMIN", "tpo"])),
    db: AsyncDatabase = Depends(get_database)
):
    try:
        query = {"_id": ObjectId(company_id)}
    except Exception:
        query = {"_id": company_id}
        
    res = await db.companies.delete_one(query)
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Company not found")
        
    return {"message": "Company deleted successfully."}
