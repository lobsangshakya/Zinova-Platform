import logging
import os
import re
import uuid
from datetime import datetime
from functools import lru_cache
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, HTTPException
from google.oauth2 import service_account
from googleapiclient.discovery import build
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["form"])
EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
SPREADSHEET_ID = os.getenv(
    "GOOGLE_SPREADSHEET_ID", "1_T4c75_Jjbi8b16HJLqsSeBK3iZxRLQCgpq-OnXJCGY"
)
SHEET_RANGE = os.getenv("GOOGLE_SHEET_RANGE", "Sheet1!A:H")
RENDER_SERVICE_ACCOUNT_FILE = Path("/etc/secrets/service-account.json")
LOCAL_SERVICE_ACCOUNT_FILE = Path(__file__).resolve().parents[3] / "service-account.json"

# Sheet names for registrations
PLATFORM_INQUIRIES_SHEET = "Platform_Inquiries"
NGO_SHEET = "NGO_Registrations"
KITCHEN_SHEET = "Kitchen_Registrations"


def resolve_service_account_path() -> Path:
    for candidate in (RENDER_SERVICE_ACCOUNT_FILE, LOCAL_SERVICE_ACCOUNT_FILE):
        if candidate.exists():
            logger.info("Using Google service account file from %s", candidate.parent)
            return candidate

    logger.error("Google service account file not found in Render secrets or local project path")
    raise RuntimeError("Google service account file not found")


class SubmitRequest(BaseModel):
    name: str
    email: str
    organization: str = ""
    message: str = ""
    source: Literal["landing", "contact"] = "landing"


class GeneralLeadRequest(BaseModel):
    fullName: str
    email: str
    organizationName: str
    userType: Literal["NGO", "Restaurant"]
    messageSource: str
    notes: str = ""


class NGORegistrationRequest(BaseModel):
    """NGO registration form data"""
    orgName: str
    email: str
    orgType: str
    regNumber: str
    contactPerson: str
    phone: str


class KitchenRegistrationRequest(BaseModel):
    """Kitchen registration form data"""
    businessName: str
    email: str
    businessType: str
    address: str
    city: str
    phone: str


@lru_cache(maxsize=1)
def get_sheets_client():
    if not SPREADSHEET_ID:
        raise RuntimeError("GOOGLE_SPREADSHEET_ID is not configured")

    try:
        service_account_path = resolve_service_account_path()
        credentials = service_account.Credentials.from_service_account_file(
            str(service_account_path), scopes=SCOPES
        )
        return build("sheets", "v4", credentials=credentials, cache_discovery=False)
    except Exception:
        logger.exception("Failed to initialize Google Sheets client")
        raise


@router.post("/submit")
def submit_form(body: SubmitRequest):
    name = body.name.strip()
    email = str(body.email).strip()
    organization = body.organization.strip()
    message = body.message.strip()
    source = body.source.strip() if body.source else "landing"

    if not name:
        raise HTTPException(status_code=400, detail="name is required")
    if not email:
        raise HTTPException(status_code=400, detail="email is required")
    if not EMAIL_REGEX.match(email):
        raise HTTPException(status_code=400, detail="email format is invalid")

    row_id = str(uuid.uuid4())
    timestamp = datetime.now().isoformat()

    row = [
        row_id,
        timestamp,
        name,
        email,
        organization or "",
        message or "",
        source or "landing",
        "new",
    ]

    try:
        sheets = get_sheets_client()
        sheets.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range="Sheet1!A:H",
            valueInputOption="USER_ENTERED",
            insertDataOption="INSERT_ROWS",
            body={"values": [row]},
        ).execute()

        logger.info("Form submission stored: %s <%s>", name, email)
        return {"success": True, "message": "Data stored successfully"}

    except Exception as exc:
        logger.exception("Google Sheets append failed")
        return {"success": False, "error": str(exc)}


@router.post("/general-leads")
def submit_general_lead(body: GeneralLeadRequest):
    full_name = body.fullName.strip()
    email = str(body.email).strip()
    organization_name = body.organizationName.strip()
    user_type = body.userType.strip()
    message_source = body.messageSource.strip()
    notes = body.notes.strip()

    if not full_name:
        raise HTTPException(status_code=400, detail="Full Name is required")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    if not EMAIL_REGEX.match(email):
        raise HTTPException(status_code=400, detail="Email format is invalid")
    if not organization_name:
        raise HTTPException(status_code=400, detail="Organization Name is required")
    if user_type not in {"NGO", "Restaurant"}:
        raise HTTPException(status_code=400, detail="User Type is required")
    if not message_source:
        raise HTTPException(status_code=400, detail="Message Source is required")

    timestamp = datetime.now().isoformat()
    row = [
        timestamp,
        full_name,
        email,
        organization_name,
        user_type,
        message_source,
        notes,
    ]

    try:
        sheets = get_sheets_client()
        sheets.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range=f"{PLATFORM_INQUIRIES_SHEET}!A:G",
            valueInputOption="USER_ENTERED",
            insertDataOption="INSERT_ROWS",
            body={"values": [row]},
        ).execute()

        logger.info(
            "General lead stored: %s <%s> [%s]",
            full_name,
            email,
            message_source,
        )
        return {"success": True, "message": "Lead submitted successfully"}

    except Exception as exc:
        logger.exception("General lead submission failed: Google Sheets append failed")
        return {"success": False, "error": str(exc)}


@router.post("/register/ngo")
def register_ngo(body: NGORegistrationRequest):
    """Register an NGO and store data in NGO_Registrations sheet"""
    
    # Validate required fields
    org_name = body.orgName.strip()
    email = str(body.email).strip()
    org_type = body.orgType.strip()
    reg_number = body.regNumber.strip()
    contact_person = body.contactPerson.strip()
    phone = body.phone.strip()

    if not org_name:
        raise HTTPException(status_code=400, detail="Organization Name is required")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    if not EMAIL_REGEX.match(email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    if not org_type:
        raise HTTPException(status_code=400, detail="Organization Type is required")
    if not reg_number:
        raise HTTPException(status_code=400, detail="Registration Number is required")
    if not contact_person:
        raise HTTPException(status_code=400, detail="Contact Person Name is required")
    if not phone:
        raise HTTPException(status_code=400, detail="Phone Number is required")

    timestamp = datetime.now().isoformat()

    # Prepare row data for Google Sheets
    # Columns: Timestamp, Organization Name, Official Email, Organization Type, Registration Number, Contact Person Name, Phone Number
    row = [
        timestamp,
        org_name,
        email,
        org_type,
        reg_number,
        contact_person,
        phone,
    ]

    try:
        sheets = get_sheets_client()
        sheets.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range=f"{NGO_SHEET}!A:G",
            valueInputOption="USER_ENTERED",
            insertDataOption="INSERT_ROWS",
            body={"values": [row]},
        ).execute()

        logger.info("NGO registration stored: %s <%s>", org_name, email)
        return {"success": True, "message": "NGO registration successful"}

    except Exception as exc:
        logger.exception("NGO registration failed: Google Sheets append failed")
        return {"success": False, "error": str(exc)}


@router.post("/register/kitchen")
def register_kitchen(body: KitchenRegistrationRequest):
    """Register a Kitchen and store data in Kitchen_Registrations sheet"""
    
    # Validate required fields
    business_name = body.businessName.strip()
    email = str(body.email).strip()
    business_type = body.businessType.strip()
    address = body.address.strip()
    city = body.city.strip()
    phone = body.phone.strip()

    if not business_name:
        raise HTTPException(status_code=400, detail="Kitchen/Restaurant Name is required")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    if not EMAIL_REGEX.match(email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    if not business_type:
        raise HTTPException(status_code=400, detail="Business Type is required")
    if not address:
        raise HTTPException(status_code=400, detail="Street Address is required")
    if not city:
        raise HTTPException(status_code=400, detail="City is required")
    if not phone:
        raise HTTPException(status_code=400, detail="Phone Number is required")

    timestamp = datetime.now().isoformat()

    # Prepare row data for Google Sheets
    # Columns: Timestamp, Kitchen/Restaurant Name, Business Email, Business Type, Street Address, City, Phone Number
    row = [
        timestamp,
        business_name,
        email,
        business_type,
        address,
        city,
        phone,
    ]

    try:
        sheets = get_sheets_client()
        sheets.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range=f"{KITCHEN_SHEET}!A:G",
            valueInputOption="USER_ENTERED",
            insertDataOption="INSERT_ROWS",
            body={"values": [row]},
        ).execute()

        logger.info("Kitchen registration stored: %s <%s>", business_name, email)
        return {"success": True, "message": "Kitchen registration successful"}

    except Exception as exc:
        logger.exception("Kitchen registration failed: Google Sheets append failed")
        return {"success": False, "error": str(exc)}
