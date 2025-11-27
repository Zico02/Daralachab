from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends
from fastapi.security import APIKeyHeader
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from email_utils import send_reservation_email
from sms_utils import send_reservation_sms

# --------------------------------------------------
# Environment & DB setup
# --------------------------------------------------
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# --------------------------------------------------
# FastAPI app & router
# --------------------------------------------------
app = FastAPI()
api_router = APIRouter(prefix="/api")

# --------------------------------------------------
# Logging
# --------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# --------------------------------------------------
# Admin API key auth
# --------------------------------------------------
ADMIN_API_KEY = os.environ.get("ADMIN_API_KEY", "")
api_key_header = APIKeyHeader(name="x-admin-key", auto_error=False)


async def verify_admin_key(x_admin_key: Optional[str] = Header(None)):
    """
    Verify admin API key for protected endpoints.

    Raises 401 if key is invalid or missing (when ADMIN_API_KEY is set).
    """
    if not ADMIN_API_KEY:
        logger.warning(
            "ADMIN_API_KEY not configured. Admin endpoints are unprotected (dev mode)."
        )
        return

    if not x_admin_key or x_admin_key != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing admin API key")


# --------------------------------------------------
# Pydantic models
# --------------------------------------------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB _id field

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ReservationCreate(BaseModel):
    name: str
    phone: str
    email: str | None = None
    date: str
    time: str
    persons: int
    message: str | None = None
    # optional; frontend or future tools could set it, otherwise defaulted below
    status: str | None = None


class Reservation(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str | None = None
    date: str
    time: str
    persons: int
    message: str | None = None
    status: str = Field(default="en_attente")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ReservationStatusUpdate(BaseModel):
    status: str  # expected: "en_attente", "confirme", "arrive"


class ReservationPersonsUpdate(BaseModel):
    persons: int


# --------------------------------------------------
# Routes
# --------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)

    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()

    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)

    for check in status_checks:
        if isinstance(check["timestamp"], str):
            check["timestamp"] = datetime.fromisoformat(check["timestamp"])

    return status_checks


@api_router.post("/reservations", response_model=Reservation)
async def create_reservation(input: ReservationCreate):
    reservation_dict = input.model_dump()

    # Ensure a default status if none was provided
    if not reservation_dict.get("status"):
        reservation_dict["status"] = "en_attente"

    reservation_obj = Reservation(**reservation_dict)

    doc = reservation_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()

    # Save reservation to MongoDB
    await db.reservations.insert_one(doc)

    # Log reservation
    logger.info(
        f"New reservation: {reservation_obj.name} - {reservation_obj.phone} "
        f"- {reservation_obj.date} {reservation_obj.time}"
    )

    # Email notification (non-blocking)
    try:
        send_reservation_email(
            reservation=reservation_dict,
            recipient_email=reservation_dict.get("email"),
        )
    except Exception as e:
        logger.error(f"Failed to send email notification: {e}")

    # SMS notification (non-blocking)
    try:
        send_reservation_sms(reservation=reservation_dict)
    except Exception as e:
        logger.error(f"Failed to send SMS notification: {e}")

    return reservation_obj


@api_router.get("/reservations", response_model=List[Reservation])
async def get_reservations(admin_key=Depends(verify_admin_key)):
    """
    Get all reservations (admin-only endpoint).
    Requires x-admin-key header with valid ADMIN_API_KEY.
    Returns reservations sorted by newest first.
    """
    reservations = await db.reservations.find({}, {"_id": 0}).to_list(1000)

    for reservation in reservations:
        ts = reservation.get("timestamp")
        if isinstance(ts, str):
            reservation["timestamp"] = datetime.fromisoformat(ts)
        # Backwards compatibility: old docs without status
        if not reservation.get("status"):
            reservation["status"] = "en_attente"

    def sort_key(res):
        ts = res.get("timestamp")
        if ts:
            return ts
        return f"{res.get('date', '')} {res.get('time', '')}"

    reservations.sort(key=sort_key, reverse=True)
    return reservations


@api_router.patch("/reservations/{reservation_id}/status", response_model=Reservation)
async def update_reservation_status(
    reservation_id: str,
    payload: ReservationStatusUpdate,
    admin_key=Depends(verify_admin_key),
):
    """
    Update the status of a reservation (en_attente / confirme / arrive).
    """
    await db.reservations.update_one(
        {"id": reservation_id},
        {"$set": {"status": payload.status}},
    )

    doc = await db.reservations.find_one({"id": reservation_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Reservation not found")

    ts = doc.get("timestamp")
    if isinstance(ts, str):
        doc["timestamp"] = datetime.fromisoformat(ts)
    if not doc.get("status"):
        doc["status"] = "en_attente"

    return Reservation(**doc)


@api_router.patch(
    "/reservations/{reservation_id}/persons", response_model=Reservation
)
async def update_reservation_persons(
    reservation_id: str,
    payload: ReservationPersonsUpdate,
    admin_key=Depends(verify_admin_key),
):
    """
    Update the number of persons for a reservation.
    """
    await db.reservations.update_one(
      {"id": reservation_id},
      {"$set": {"persons": payload.persons}},
    )

    doc = await db.reservations.find_one({"id": reservation_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Reservation not found")

    ts = doc.get("timestamp")
    if isinstance(ts, str):
        doc["timestamp"] = datetime.fromisoformat(ts)
    if not doc.get("status"):
        doc["status"] = "en_attente"

    return Reservation(**doc)


@api_router.delete("/reservations/{reservation_id}")
async def delete_reservation(
    reservation_id: str,
    admin_key=Depends(verify_admin_key),
):
    """
    Delete a reservation by its id.
    """
    result = await db.reservations.delete_one({"id": reservation_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return {"success": True}


# --------------------------------------------------
# CORS configuration
# --------------------------------------------------
cors_origins_env = os.environ.get("CORS_ORIGINS")
if cors_origins_env:
    origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]
else:
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Mount router & shutdown hook
# --------------------------------------------------
app.include_router(api_router)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
