# api/routes/register.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone
from db.conn import db
# 🎯 1. Import the password hashing function
from utils.security import hash_password

router = APIRouter()

# Pydantic model updated to include a password
class Donor(BaseModel):
    full_name: str = Field(..., example="John Doe")
    email: EmailStr
    password: str = Field(..., min_length=6) # Added password field
    phone: str = Field(..., example="+91-9876543210")
    blood_group: str = Field(..., example="O+")
    age: int = Field(..., ge=18, le=65)
    city: str
    last_donation_date: str | None = Field(None, example="2025-05-01")

# NEW: Pydantic model for Hospital registration
class Hospital(BaseModel):
    hospitalName: str = Field(..., example="City General Hospital")
    address: str
    email: EmailStr
    phone: str = Field(..., example="+91-9876543210")
    registrationNumber: str
    password: str = Field(..., min_length=6) # Added password field

@router.post("/donor")
async def register_donor(donor: Donor):
    existing = await db.donors.find_one({
        "$or": [{"email": donor.email}, {"phone": donor.phone}]
    })
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email or phone already exists.")

    donor_data = donor.model_dump()
    
    # Hash the password before saving it
    donor_data["password"] = hash_password(donor.password)
    
    donor_data["created_at"] = datetime.now(timezone.utc)
    
    result = await db.donors.insert_one(donor_data)

    created_donor = await db.donors.find_one({"_id": result.inserted_id})

    if created_donor:
        return {
            "message": "Donor registered successfully",
            "donor_id": str(created_donor["_id"])
        }
    else:
        raise HTTPException(status_code=500, detail="Failed to register donor")

# NEW: Hospital registration endpoint
@router.post("/hospital")
async def register_hospital(hospital: Hospital):
    # Check for existing hospital based on email, phone, or registration number
    existing = await db.hospitals.find_one({
        "$or": [{"email": hospital.email}, {"phone": hospital.phone}, {"registrationNumber": hospital.registrationNumber}]
    })
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email, phone, or registration number already exists.")

    hospital_data = hospital.model_dump()

    # Hash the password before saving it
    hospital_data["password"] = hash_password(hospital.password)

    # Set the user role
    hospital_data["role"] = "hospital"
    
    hospital_data["created_at"] = datetime.now(timezone.utc)

    result = await db.hospitals.insert_one(hospital_data)

    created_hospital = await db.hospitals.find_one({"_id": result.inserted_id})

    if created_hospital:
        return {
            "message": "Hospital registered successfully",
            "hospital_id": str(created_hospital["_id"])
        }
    else:
        raise HTTPException(status_code=500, detail="Failed to register hospital")