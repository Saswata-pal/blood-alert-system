# api/routes/auth.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import timedelta
from db.conn import db
from utils.security import verify_password, create_access_token
from bson import ObjectId

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

# 🎯 1. Change the function to be asynchronous
@router.post("/login")
async def login(req: LoginRequest):
    # Try each role's collection
    for role, collection in [("donor", db.donors), ("hospital", db.hospitals), ("admin", db.admins)]:
        # 🎯 2. Add 'await' to the database call
        user = await collection.find_one({"email": req.email})
        
        # This line will now work correctly
        if user and verify_password(req.password, user["password"]):
            token_data = {
                "user_id": str(user["_id"]),
                "role": role
            }
            token = create_access_token(token_data, expires_delta=timedelta(minutes=1440))
            return {
                "access_token": token,
                "token_type": "bearer",
                "user_info": {
                    "id": str(user["_id"]),
                    "name": user.get("full_name") or user.get("name"), # Handles both donor and other user types
                    "email": user["email"],
                    "role": role
                }
            }
            
    raise HTTPException(status_code=401, detail="Invalid email or password")