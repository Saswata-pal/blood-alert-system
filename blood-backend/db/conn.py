# blood-backend/db/conn.py
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from typing import AsyncGenerator
from bson import ObjectId
import asyncio

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB", "blood_alert")

if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable is not set. Please add it to your .env file.")

# Global client and database instance
client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB_NAME]

async def ensure_indexes_async():
    """Asynchronously creates unique and geospatial indexes on collections."""
    try:
        print("Ensuring MongoDB indexes...")
        
        # Unique email indexes for all user types
        await db.donors.create_index("email", unique=True)
        await db.hospitals.create_index("email", unique=True)
        await db.admins.create_index("email", unique=True)

        # Geospatial index for donor locations
        await db.donors.create_index([("location", "2dsphere")])
        
        print("MongoDB indexes ensured successfully.")
    except Exception as e:
        print(f"Failed to create indexes: {e}")

async def get_database() -> AsyncGenerator[AsyncIOMotorClient, None]:
    """Dependency that provides an async database connection."""
    yield db