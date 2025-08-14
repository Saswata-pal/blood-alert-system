# main.py
import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Any
from db.conn import ensure_indexes_async, get_database
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from datetime import datetime, timezone
from bson import ObjectId

# --- Lifespan Event Handler ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles startup and shutdown events for the application.
    This is where we ensure database indexes are created.
    """
    print("Application starting up...")
    await ensure_indexes_async()
    yield
    print("Application shutting down...")

# --- FastAPI App Initialization ---
app = FastAPI(
    title="Blood Alert Backend",
    version="1.0.0",
    description="API for managing blood donation requests and donor alerts.",
    lifespan=lifespan
)

# --- CORS Middleware ---
# For a production environment, replace "*" with your frontend's domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Import Routers ---
from api.routes.auth import router as auth_router
from api.routes.register import router as register_router
from api.routes.donors import router as donors_router
from api.routes.hospitals import router as hospitals_router
from api.routes.alerts import router as alerts_router

# --- Register Routers ---
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(register_router, prefix="/register", tags=["Registration"])
app.include_router(donors_router, prefix="/donors", tags=["Donors"])
app.include_router(hospitals_router, prefix="/hospitals", tags=["Hospitals"])
app.include_router(alerts_router, prefix="/alerts", tags=["Alerts"])

# --- Test Routes (Corrected for async) ---
# Pydantic model for testing
class Donor(BaseModel):
    name: str
    blood_type: str
    phone: str
    email: str
    location: dict

@app.get("/")
def home():
    """Simple root endpoint to confirm the server is running."""
    return {"message": "Backend is running!"}

@app.get("/test-db")
async def test_db(db: AsyncIOMotorClient = Depends(get_database)):
    """Tests the database connection by fetching a few donor documents."""
    try:
        donors_cursor = db.donors.find().limit(5)
        donors = []
        async for donor in donors_cursor:
            donor["_id"] = str(donor["_id"])
            donors.append(donor)
        
        return {
            "status": "success",
            "count": len(donors),
            "sample_data": donors
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection error: {str(e)}"
        )

@app.post("/add-test-donor")
async def add_test_donor(donor: Donor, db: AsyncIOMotorClient = Depends(get_database)):
    """Adds a test donor to the database asynchronously."""
    try:
        donor_data = donor.model_dump()
        donor_data["created_at"] = datetime.now(timezone.utc)
        
        # Await the asynchronous insert operation
        result = await db.donors.insert_one(donor_data)
        
        return {"status": "success", "inserted_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add donor: {str(e)}"
        )