import asyncio
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field, BeforeValidator
from datetime import datetime, timedelta, timezone
from typing import List, Optional, Any, Annotated
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from utils.security import require_role
from db.conn import get_database

router = APIRouter()

# --- Custom Pydantic Type for ObjectId ---
# This is a key part of the fix. It tells Pydantic to convert ObjectId objects to strings.
ObjectIdStr = Annotated[str, BeforeValidator(str)]

# --- New Pydantic Models for Dashboard Data ---
class HospitalProfile(BaseModel):
    id: ObjectIdStr = Field(alias="_id") # Use ObjectIdStr and alias for Pydantic
    name: str
    email: str
    role: str
    address: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[dict] = None

class HospitalUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[dict] = None

class BloodRequest(BaseModel):
    # Use ObjectIdStr for all ObjectId fields
    id: ObjectIdStr = Field(alias="_id")
    hospital_id: ObjectIdStr
    bloodType: str
    unitsRequested: int
    urgency: str  # 'Critical' | 'High' | 'Medium' | 'Low'
    status: str   # 'Active' | 'Matched' | 'Completed' | 'Cancelled'
    requestedAt: datetime
    donorResponses: int
    hospitalResponses: int
    
    # Allows Pydantic to handle `_id` and `id` conversion
    model_config = {
        "populate_by_name": True,
    }

class NewBloodRequest(BaseModel):
    bloodType: str
    unitsRequested: int
    urgency: str

class BloodInventory(BaseModel):
    id: ObjectIdStr = Field(alias="_id")
    hospital_id: ObjectIdStr
    bloodType: str
    unitsAvailable: int
    expiringIn7Days: int
    minimumRequired: int
    status: str  # 'Critical' | 'Low' | 'Normal' | 'Adequate'

class DonorResponse(BaseModel):
    id: ObjectIdStr = Field(alias="_id")
    request_id: ObjectIdStr
    donor_id: ObjectIdStr
    donorName: str
    bloodType: str
    distance: str
    lastDonation: str
    phone: str
    status: str  # 'Available' | 'Contacted' | 'Confirmed' | 'Completed'

class HospitalStats(BaseModel):
    totalRequests: int
    activeRequests: int
    completedToday: int
    averageResponseTime: str

# --- Dashboard Endpoints ---
@router.get("/me/dashboard/stats", response_model=HospitalStats)
async def get_dashboard_stats(
    current_user: dict = Depends(require_role("hospital")),
    db: AsyncIOMotorClient = Depends(get_database)
):
    """
    Fetches key statistics for the hospital dashboard.
    """
    hospital_id = ObjectId(current_user['id'])

    # Await all database calls to get the actual results
    total_requests_future = db.blood_requests.count_documents({"hospital_id": hospital_id})
    active_requests_future = db.blood_requests.count_documents({"hospital_id": hospital_id, "status": "Active"})

    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    completed_today_future = db.blood_requests.count_documents({
        "hospital_id": hospital_id,
        "status": "Completed",
        "completedAt": {"$gte": today}
    })

    # Run database calls concurrently for efficiency
    total_requests, active_requests, completed_today = await asyncio.gather(
        total_requests_future,
        active_requests_future,
        completed_today_future
    )

    # Placeholder for average response time calculation
    average_response_time = "12 min"  # Hardcoded for now

    return HospitalStats(
        totalRequests=total_requests,
        activeRequests=active_requests,
        completedToday=completed_today,
        averageResponseTime=average_response_time
    )

@router.get("/me/dashboard/requests", response_model=List[BloodRequest])
async def get_active_blood_requests(
    current_user: dict = Depends(require_role("hospital")),
    db: AsyncIOMotorClient = Depends(get_database)
):
    """
    Fetches all active blood requests for the logged-in hospital.
    """
    hospital_id = ObjectId(current_user['id'])
    # Await the database cursor and iterate asynchronously
    requests_cursor = db.blood_requests.find({"hospital_id": hospital_id, "status": "Active"})

    # The conversion from ObjectId to str is handled by the `BloodRequest` Pydantic model
    # due to the `ObjectIdStr` type hint.
    requests = await requests_cursor.to_list(length=None)

    return requests

@router.post("/me/dashboard/requests", response_model=BloodRequest, status_code=status.HTTP_201_CREATED)
async def create_new_blood_request(
    request_data: NewBloodRequest,
    current_user: dict = Depends(require_role("hospital")),
    db: AsyncIOMotorClient = Depends(get_database)
):
    """
    Creates a new blood request for the logged-in hospital.
    """
    hospital_id = ObjectId(current_user['id'])

    # Prepare the new request data
    new_request_doc = request_data.model_dump()
    new_request_doc.update({
        "hospital_id": hospital_id,
        "status": "Active",
        "requestedAt": datetime.now(timezone.utc),
        "donorResponses": 0,
        "hospitalResponses": 0
    })

    # Await the asynchronous insert operation
    result = await db.blood_requests.insert_one(new_request_doc)
    
    # Fetch the newly created document to ensure a complete response
    created_request_doc = await db.blood_requests.find_one({"_id": result.inserted_id})

    if not created_request_doc:
        raise HTTPException(status_code=500, detail="Failed to retrieve created request.")
    
    # Pydantic model with `ObjectIdStr` will handle the conversion of `_id` and `hospital_id`
    return created_request_doc

@router.get("/me/dashboard/inventory", response_model=List[BloodInventory])
async def get_blood_inventory(
    current_user: dict = Depends(require_role("hospital")),
    db: AsyncIOMotorClient = Depends(get_database)
):
    """
    Fetches the current blood inventory for the logged-in hospital.
    """
    hospital_id = ObjectId(current_user['id'])

    inventory_cursor = db.blood_inventory.find({"hospital_id": hospital_id})
    inventory = await inventory_cursor.to_list(length=None)

    return inventory

@router.get("/me/dashboard/donor-responses", response_model=List[DonorResponse])
async def get_all_donor_responses(
    current_user: dict = Depends(require_role("hospital")),
    db: AsyncIOMotorClient = Depends(get_database)
):
    """
    Fetches donor responses for all of the hospital's active requests.
    """
    hospital_id = ObjectId(current_user['id'])

    # Await the asynchronous database call
    active_requests = await db.blood_requests.find(
        {"hospital_id": hospital_id, "status": "Active"},
        {"_id": 1}
    ).to_list(length=None)

    active_request_ids = [req['_id'] for req in active_requests]

    # Await the find call and convert the cursor to a list
    responses_cursor = db.donor_responses.find({"request_id": {"$in": active_request_ids}})
    responses = await responses_cursor.to_list(length=None)

    return responses

@router.post("/me/dashboard/donor-responses/{response_id}/contact", status_code=status.HTTP_204_NO_CONTENT)
async def contact_donor(
    response_id: str,
    current_user: dict = Depends(require_role("hospital")),
    db: AsyncIOMotorClient = Depends(get_database)
):
    """
    Updates a donor's response status to 'Contacted'.
    """
    try:
        response_obj_id = ObjectId(response_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid response ID format")

    # Await the find_one call
    response = await db.donor_responses.find_one({"_id": response_obj_id})
    if not response:
        raise HTTPException(status_code=404, detail="Donor response not found")

    # Verify the response belongs to a request from the current hospital
    request = await db.blood_requests.find_one({
        "_id": response['request_id'],
        "hospital_id": ObjectId(current_user['id'])
    })
    if not request:
        raise HTTPException(status_code=403, detail="Not authorized to contact this donor")

    # Await the update_one call
    result = await db.donor_responses.update_one(
        {"_id": response_obj_id},
        {"$set": {"status": "Contacted"}}
    )

    if result.modified_count == 0:
        # This could happen if the status was already 'Contacted'
        raise HTTPException(status_code=409, detail="Donor response status not modified")

    return {"message": "Donor status updated successfully"}