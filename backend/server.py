from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import random
import jwt
import secrets

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', secrets.token_hex(32))
JWT_ALGORITHM = "HS256"

# Create the main app
app = FastAPI(title="Skilled Genie API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# =============== MODELS ===============

class OTPRequest(BaseModel):
    phone: str

class OTPVerify(BaseModel):
    phone: str
    otp: str

class AuthResponse(BaseModel):
    success: bool
    session_token: Optional[str] = None
    genie: Optional[Dict[str, Any]] = None
    message: str

class Location(BaseModel):
    lat: float
    lng: float

class Customer(BaseModel):
    name: str
    phone: str
    address: str
    location: Optional[Location] = None

class Job(BaseModel):
    job_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    service_type: str  # plumbing, electrical, cleaning, carpentry, painting, other
    status: str = "available"  # available, accepted, in_progress, completed, cancelled
    customer: Customer
    description: str
    estimated_duration: int  # minutes
    estimated_pay: float
    distance_km: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    scheduled_time: Optional[datetime] = None
    assigned_genie_id: Optional[str] = None
    accepted_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class GenieProfile(BaseModel):
    genie_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    skills: List[str] = []
    rating: float = 5.0
    total_jobs: int = 0
    total_earnings: float = 0.0
    is_online: bool = False
    current_location: Optional[Location] = None
    availability_hours: Optional[Dict[str, str]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Rating(BaseModel):
    rating_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    genie_id: str
    job_id: str
    customer_name: str
    rating: float
    comment: Optional[str] = None
    service_type: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LocationUpdate(BaseModel):
    lat: float
    lng: float

class AvailabilityUpdate(BaseModel):
    is_online: bool

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    skills: Optional[List[str]] = None

# =============== HELPER FUNCTIONS ===============

def create_token(genie_id: str, phone: str) -> str:
    payload = {
        "genie_id": genie_id,
        "phone": phone,
        "exp": datetime.utcnow() + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> Optional[Dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

async def get_current_genie(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    genie = await db.genies.find_one({"genie_id": payload["genie_id"]})
    if not genie:
        raise HTTPException(status_code=401, detail="Genie not found")
    
    return genie

# =============== SEED MOCK DATA ===============

async def seed_mock_jobs():
    """Seed some mock jobs for testing"""
    existing_jobs = await db.jobs.count_documents({})
    if existing_jobs > 0:
        return
    
    service_types = ["plumbing", "electrical", "cleaning", "carpentry", "painting"]
    descriptions = {
        "plumbing": ["Fix leaking faucet", "Unclog drain", "Install new shower head", "Repair toilet", "Fix water heater"],
        "electrical": ["Install ceiling fan", "Fix power outlet", "Replace light switch", "Electrical inspection", "Install doorbell"],
        "cleaning": ["Deep house cleaning", "Post-renovation cleanup", "Office cleaning", "Window cleaning", "Carpet cleaning"],
        "carpentry": ["Fix door hinge", "Build shelf", "Repair cabinet", "Install door", "Fix wooden floor"],
        "painting": ["Paint bedroom", "Touch up walls", "Paint exterior", "Paint kitchen", "Wallpaper installation"]
    }
    names = ["John Smith", "Sarah Johnson", "Mike Davis", "Emily Brown", "Chris Wilson", "Lisa Anderson", "David Martinez", "Jennifer Taylor"]
    addresses = [
        "123 Main St, Downtown", "456 Oak Ave, Westside", "789 Pine Rd, Eastville",
        "321 Elm St, Northpark", "654 Maple Dr, Southview", "987 Cedar Ln, Midtown"
    ]
    
    mock_jobs = []
    for i in range(10):
        service_type = random.choice(service_types)
        job = {
            "job_id": str(uuid.uuid4()),
            "service_type": service_type,
            "status": "available",
            "customer": {
                "name": random.choice(names),
                "phone": f"+1555***{random.randint(1000, 9999)}",
                "address": random.choice(addresses),
                "location": {"lat": 37.7749 + random.uniform(-0.05, 0.05), "lng": -122.4194 + random.uniform(-0.05, 0.05)}
            },
            "description": random.choice(descriptions[service_type]),
            "estimated_duration": random.choice([30, 45, 60, 90, 120]),
            "estimated_pay": round(random.uniform(50, 250), 2),
            "distance_km": round(random.uniform(0.5, 15), 1),
            "created_at": datetime.utcnow() - timedelta(minutes=random.randint(5, 60)),
            "scheduled_time": None,
            "assigned_genie_id": None
        }
        mock_jobs.append(job)
    
    await db.jobs.insert_many(mock_jobs)
    logger.info(f"Seeded {len(mock_jobs)} mock jobs")

async def seed_mock_ratings(genie_id: str):
    """Seed mock ratings for a genie"""
    existing_ratings = await db.ratings.count_documents({"genie_id": genie_id})
    if existing_ratings > 0:
        return
    
    comments = [
        "Great service! Very professional.",
        "On time and did excellent work.",
        "Would recommend to anyone.",
        "Friendly and efficient.",
        "Very knowledgeable and helpful.",
        None,  # Some ratings without comments
        "Solved the problem quickly!",
        "Best service I've had in years."
    ]
    names = ["John S.", "Sarah J.", "Mike D.", "Emily B.", "Chris W.", "Lisa A."]
    service_types = ["plumbing", "electrical", "cleaning", "carpentry", "painting"]
    
    mock_ratings = []
    for i in range(15):
        rating = {
            "rating_id": str(uuid.uuid4()),
            "genie_id": genie_id,
            "job_id": str(uuid.uuid4()),
            "customer_name": random.choice(names),
            "rating": round(random.uniform(4.0, 5.0), 1),
            "comment": random.choice(comments),
            "service_type": random.choice(service_types),
            "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 30))
        }
        mock_ratings.append(rating)
    
    await db.ratings.insert_many(mock_ratings)
    logger.info(f"Seeded {len(mock_ratings)} mock ratings for genie {genie_id}")

@app.on_event("startup")
async def startup_event():
    await seed_mock_jobs()

# =============== AUTH ROUTES ===============

@api_router.post("/auth/send-otp")
async def send_otp(request: OTPRequest):
    """Send OTP to phone number (mock - always succeeds)"""
    # In production, integrate with SMS service
    # For testing, OTP is always 123456
    await db.otp_codes.update_one(
        {"phone": request.phone},
        {"$set": {"phone": request.phone, "otp": "123456", "created_at": datetime.utcnow()}},
        upsert=True
    )
    logger.info(f"OTP sent to {request.phone}")
    return {"success": True, "message": "OTP sent successfully"}

@api_router.post("/auth/verify-otp", response_model=AuthResponse)
async def verify_otp(request: OTPVerify):
    """Verify OTP and return session token"""
    # For testing, accept 123456 as valid OTP
    if request.otp != "123456":
        stored_otp = await db.otp_codes.find_one({"phone": request.phone})
        if not stored_otp or stored_otp.get("otp") != request.otp:
            raise HTTPException(status_code=401, detail="Invalid OTP")
    
    # Find or create genie profile
    genie = await db.genies.find_one({"phone": request.phone})
    
    if not genie:
        # Create new genie profile
        new_genie = GenieProfile(
            phone=request.phone,
            name=f"Genie {request.phone[-4:]}",
            skills=[],
            rating=5.0,
            total_jobs=random.randint(10, 100),  # Mock data
            total_earnings=round(random.uniform(1000, 10000), 2)
        )
        genie_dict = new_genie.dict()
        await db.genies.insert_one(genie_dict)
        genie = genie_dict
        # Seed mock ratings for new genie
        await seed_mock_ratings(genie["genie_id"])
    
    # Generate JWT token
    token = create_token(genie["genie_id"], genie["phone"])
    
    # Remove MongoDB _id for response
    genie_response = {k: v for k, v in genie.items() if k != "_id"}
    
    return AuthResponse(
        success=True,
        session_token=token,
        genie=genie_response,
        message="Authentication successful"
    )

# =============== GENIE ROUTES ===============

@api_router.get("/genie/profile")
async def get_profile(genie = Depends(get_current_genie)):
    """Get current genie profile"""
    genie_response = {k: v for k, v in genie.items() if k != "_id"}
    return {"success": True, "genie": genie_response}

@api_router.put("/genie/profile")
async def update_profile(update: ProfileUpdate, genie = Depends(get_current_genie)):
    """Update genie profile"""
    update_dict = {k: v for k, v in update.dict().items() if v is not None}
    if update_dict:
        await db.genies.update_one(
            {"genie_id": genie["genie_id"]},
            {"$set": update_dict}
        )
    updated = await db.genies.find_one({"genie_id": genie["genie_id"]})
    updated_response = {k: v for k, v in updated.items() if k != "_id"}
    return {"success": True, "genie": updated_response}

@api_router.put("/genie/location")
async def update_location(location: LocationUpdate, genie = Depends(get_current_genie)):
    """Update genie location"""
    await db.genies.update_one(
        {"genie_id": genie["genie_id"]},
        {"$set": {"current_location": location.dict()}}
    )
    return {"success": True, "message": "Location updated"}

@api_router.put("/genie/availability")
async def update_availability(update: AvailabilityUpdate, genie = Depends(get_current_genie)):
    """Update online/offline status"""
    await db.genies.update_one(
        {"genie_id": genie["genie_id"]},
        {"$set": {"is_online": update.is_online}}
    )
    return {"success": True, "is_online": update.is_online}

@api_router.get("/genie/available-jobs")
async def get_available_jobs(genie = Depends(get_current_genie)):
    """Get list of available jobs"""
    jobs = await db.jobs.find({"status": "available"}).sort("created_at", -1).to_list(50)
    jobs_response = [{k: v for k, v in job.items() if k != "_id"} for job in jobs]
    return {"success": True, "jobs": jobs_response, "count": len(jobs_response)}

@api_router.get("/genie/active-jobs")
async def get_active_jobs(genie = Depends(get_current_genie)):
    """Get genie's active jobs"""
    jobs = await db.jobs.find({
        "assigned_genie_id": genie["genie_id"],
        "status": {"$in": ["accepted", "in_progress"]}
    }).sort("accepted_at", -1).to_list(20)
    jobs_response = [{k: v for k, v in job.items() if k != "_id"} for job in jobs]
    return {"success": True, "jobs": jobs_response, "count": len(jobs_response)}

@api_router.get("/genie/job/{job_id}")
async def get_job_details(job_id: str, genie = Depends(get_current_genie)):
    """Get job details"""
    job = await db.jobs.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job_response = {k: v for k, v in job.items() if k != "_id"}
    return {"success": True, "job": job_response}

@api_router.post("/genie/jobs/{job_id}/accept")
async def accept_job(job_id: str, genie = Depends(get_current_genie)):
    """Accept a job"""
    job = await db.jobs.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["status"] != "available":
        raise HTTPException(status_code=400, detail="Job is no longer available")
    
    # Update job
    await db.jobs.update_one(
        {"job_id": job_id},
        {"$set": {
            "status": "accepted",
            "assigned_genie_id": genie["genie_id"],
            "accepted_at": datetime.utcnow()
        }}
    )
    
    # Reveal customer phone
    updated_job = await db.jobs.find_one({"job_id": job_id})
    # In real app, unmask phone here
    job_response = {k: v for k, v in updated_job.items() if k != "_id"}
    
    return {"success": True, "job": job_response, "message": "Job accepted successfully"}

@api_router.post("/genie/jobs/{job_id}/start")
async def start_job(job_id: str, genie = Depends(get_current_genie)):
    """Start working on a job"""
    job = await db.jobs.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["assigned_genie_id"] != genie["genie_id"]:
        raise HTTPException(status_code=403, detail="Not your job")
    if job["status"] != "accepted":
        raise HTTPException(status_code=400, detail="Job not in accepted state")
    
    await db.jobs.update_one(
        {"job_id": job_id},
        {"$set": {"status": "in_progress", "started_at": datetime.utcnow()}}
    )
    
    updated_job = await db.jobs.find_one({"job_id": job_id})
    job_response = {k: v for k, v in updated_job.items() if k != "_id"}
    
    return {"success": True, "job": job_response}

@api_router.post("/genie/jobs/{job_id}/complete")
async def complete_job(job_id: str, genie = Depends(get_current_genie)):
    """Complete a job"""
    job = await db.jobs.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["assigned_genie_id"] != genie["genie_id"]:
        raise HTTPException(status_code=403, detail="Not your job")
    if job["status"] != "in_progress":
        raise HTTPException(status_code=400, detail="Job not in progress")
    
    await db.jobs.update_one(
        {"job_id": job_id},
        {"$set": {"status": "completed", "completed_at": datetime.utcnow()}}
    )
    
    # Update genie stats
    await db.genies.update_one(
        {"genie_id": genie["genie_id"]},
        {
            "$inc": {"total_jobs": 1, "total_earnings": job["estimated_pay"]}
        }
    )
    
    updated_job = await db.jobs.find_one({"job_id": job_id})
    job_response = {k: v for k, v in updated_job.items() if k != "_id"}
    
    return {"success": True, "job": job_response, "message": "Job completed!"}

@api_router.get("/genie/my-ratings")
async def get_my_ratings(limit: int = 50, genie = Depends(get_current_genie)):
    """Get genie's ratings"""
    ratings = await db.ratings.find({"genie_id": genie["genie_id"]}).sort("created_at", -1).to_list(limit)
    ratings_response = [{k: v for k, v in r.items() if k != "_id"} for r in ratings]
    
    # Calculate average
    total = sum(r["rating"] for r in ratings_response) if ratings_response else 0
    average = round(total / len(ratings_response), 1) if ratings_response else 5.0
    
    return {
        "success": True,
        "ratings": ratings_response,
        "total_ratings": len(ratings_response),
        "average_rating": average
    }

@api_router.get("/genie/earnings")
async def get_earnings(days: int = 7, genie = Depends(get_current_genie)):
    """Get earnings for specified period"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Get completed jobs in period
    jobs = await db.jobs.find({
        "assigned_genie_id": genie["genie_id"],
        "status": "completed",
        "completed_at": {"$gte": start_date}
    }).to_list(100)
    
    earnings = sum(job.get("estimated_pay", 0) for job in jobs)
    jobs_count = len(jobs)
    
    # Get genie's total earnings
    genie_data = await db.genies.find_one({"genie_id": genie["genie_id"]})
    total_earnings = genie_data.get("total_earnings", 0)
    
    return {
        "success": True,
        "period_days": days,
        "period_earnings": round(earnings, 2),
        "period_jobs": jobs_count,
        "total_earnings": round(total_earnings, 2),
        "total_jobs": genie_data.get("total_jobs", 0)
    }

@api_router.get("/genie/job-history")
async def get_job_history(limit: int = 20, genie = Depends(get_current_genie)):
    """Get completed job history"""
    jobs = await db.jobs.find({
        "assigned_genie_id": genie["genie_id"],
        "status": "completed"
    }).sort("completed_at", -1).to_list(limit)
    jobs_response = [{k: v for k, v in job.items() if k != "_id"} for job in jobs]
    return {"success": True, "jobs": jobs_response, "count": len(jobs_response)}

# =============== BASIC ROUTES ===============

@api_router.get("/")
async def root():
    return {"message": "Skilled Genie API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
