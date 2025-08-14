# api/routes/donors.py
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from db.conn import db
from bson import ObjectId
from typing import List
from utils.security import require_role, get_current_user

router = APIRouter()

# --- Pydantic Models ---
class DonorProfile(BaseModel):
    id: str
    name: str
    email: str
    role: str
    blood_group: str | None = None
    phone: str | None = None
    location: dict | None = None

class DonorUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    location: dict | None = None
    # Add other fields a donor can update

# --- Endpoints ---

# This endpoint is now for ADMINS ONLY to get a list of all donors.
@router.get("/", response_model=List[DonorProfile], dependencies=[Depends(require_role("admin"))])
def list_all_donors():
    """
    Protected endpoint. Only users with the 'admin' role can access this.
    """
    donors_cursor = db.donors.find()
    donors = []
    for donor in donors_cursor:
        donor['id'] = str(donor['_id'])
        donors.append(donor)
    return donors

# NEW: Endpoint for a logged-in donor to get their own profile data
@router.get("/me", response_model=DonorProfile)
def get_donor_me(current_user: dict = Depends(require_role("donor"))):
    """
    Protected endpoint for donors.
    A user with a 'donor' role token can get their own profile.
    This is the primary endpoint for the Donor Dashboard.
    """
    return current_user

# Endpoint for a logged-in donor to update their own profile
@router.put("/me", response_model=DonorProfile)
def update_donor_me(updates: DonorUpdate, current_user: dict = Depends(require_role("donor"))):
    """
    Protected endpoint for donors to update their own info.
    """
    update_data = updates.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")

    result = db.donors.update_one(
        {"_id": ObjectId(current_user["id"])},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Donor not found")

    # Retrieve the updated document to return it
    updated_donor = db.donors.find_one({"_id": ObjectId(current_user["id"])})
    updated_donor['id'] = str(updated_donor['_id'])
    return updated_donor

# Admin endpoint to delete a donor
@router.delete("/{donor_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_role("admin"))])
def delete_donor(donor_id: str):
    """
    Protected endpoint. Only admins can delete donors.
    """
    if not ObjectId.is_valid(donor_id):
        raise HTTPException(status_code=400, detail="Invalid donor ID")

    result = db.donors.delete_one({"_id": ObjectId(donor_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Donor not found")

    return {"message": "Donor deleted successfully"}

