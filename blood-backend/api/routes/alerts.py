from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from db.conn import db
from bson import ObjectId
from datetime import datetime, timezone
from typing import List
from utils.security import require_role

router = APIRouter()

# --- Pydantic Models ---
class AlertCreate(BaseModel):
    blood_group: str
    units_required: int
    # The hospital's location will be fetched from their profile
    
class AlertResponse(BaseModel):
    id: str
    hospital_id: str
    hospital_name: str
    blood_group: str
    units_required: int
    location: dict
    created_at: datetime
    status: str # e.g., 'active', 'fulfilled'

# --- Endpoints ---

@router.post("/", response_model=AlertResponse, status_code=status.HTTP_201_CREATED, summary="[Hospital] Create a blood alert")
def create_alert(alert_data: AlertCreate, current_user: dict = Depends(require_role("hospital"))):
    """
    Protected endpoint for hospitals to create a new blood alert.
    The hospital's ID, name, and location are automatically taken from their profile.
    """
    hospital_id = current_user["id"]
    hospital_location = current_user.get("location")
    hospital_name = current_user.get("name")

    if not hospital_location:
        raise HTTPException(status_code=400, detail="Hospital profile must have a location to create an alert.")

    new_alert = {
        "hospital_id": hospital_id,
        "hospital_name": hospital_name,
        "blood_group": alert_data.blood_group,
        "units_required": alert_data.units_required,
        "location": hospital_location,
        "status": "active",
        "created_at": datetime.now(timezone.utc)
    }

    result = db.alerts.insert_one(new_alert)
    
    # We need to fetch the inserted document to return it in the correct format
    created_alert = db.alerts.find_one({"_id": result.inserted_id})
    created_alert["id"] = str(created_alert["_id"])
    
    # Here you would add logic to notify nearby donors.
    # For now, we just return the created alert.

    return created_alert


@router.get("/", response_model=List[AlertResponse], summary="[Admin] List all active alerts")
def list_all_alerts(admin_user: dict = Depends(require_role("admin"))):
    """
    Protected endpoint for admins to view all alerts in the system.
    """
    alerts_cursor = db.alerts.find({"status": "active"}).sort("created_at", -1)
    alerts = []
    for alert in alerts_cursor:
        alert["id"] = str(alert["_id"])
        alerts.append(alert)
    return alerts