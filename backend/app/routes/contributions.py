import logging
import os
from functools import lru_cache
from pathlib import Path

from fastapi import APIRouter, HTTPException, Query
from google.oauth2 import service_account
from googleapiclient.discovery import build

router = APIRouter(prefix="/api", tags=["contributions"])
logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
SPREADSHEET_ID = os.getenv(
    "GOOGLE_SPREADSHEET_ID", "1_T4c75_Jjbi8b16HJLqsSeBK3iZxRLQCgpq-OnXJCGY"
)
RENDER_SERVICE_ACCOUNT_FILE = Path("/etc/secrets/service-account.json")
LOCAL_SERVICE_ACCOUNT_FILE = Path(__file__).resolve().parents[3] / "service-account.json"


def resolve_service_account_path() -> Path:
    for candidate in (RENDER_SERVICE_ACCOUNT_FILE, LOCAL_SERVICE_ACCOUNT_FILE):
        if candidate.exists():
            logger.info("Using Google service account file from %s", candidate.parent)
            return candidate

    logger.error("Google service account file not found in Render secrets or local project path")
    raise RuntimeError("Google service account file not found")


@lru_cache(maxsize=1)
def get_sheets_client():
    try:
        path = resolve_service_account_path()
        creds = service_account.Credentials.from_service_account_file(
            str(path), scopes=SCOPES
        )
        return build("sheets", "v4", credentials=creds, cache_discovery=False)
    except Exception:
        logger.exception("Failed to initialize Google Sheets client")
        raise


@router.get("/contributions")
def get_contributions(email: str = Query(..., description="User email")):
    """
    Return all form submissions for a given email from the Google Sheet.
    Sheet columns: Id | Timestamp | Name | Email | Organization | Message | Source | Status
    """
    if not email:
        raise HTTPException(status_code=400, detail="email is required")

    try:
        sheets = get_sheets_client()
        result = (
            sheets.spreadsheets()
            .values()
            .get(spreadsheetId=SPREADSHEET_ID, range="Sheet1!A:H")
            .execute()
        )
        rows = result.get("values", [])
    except Exception as exc:
        logger.exception("Failed to read Google Sheet")
        raise HTTPException(status_code=500, detail=str(exc))

    # Skip header row (row 0) and filter by email (column index 3)
    contributions = []
    for row in rows[1:]:
        if len(row) > 3 and row[3].strip().lower() == email.strip().lower():
            contributions.append({
                "id":           row[0] if len(row) > 0 else "",
                "timestamp":    row[1] if len(row) > 1 else "",
                "name":         row[2] if len(row) > 2 else "",
                "email":        row[3] if len(row) > 3 else "",
                "organization": row[4] if len(row) > 4 else "",
                "message":      row[5] if len(row) > 5 else "",
                "source":       row[6] if len(row) > 6 else "",
                "status":       row[7] if len(row) > 7 else "",
            })

    # Sort newest first
    contributions.sort(key=lambda x: x["timestamp"], reverse=True)

    return {
        "email": email,
        "total": len(contributions),
        "contributions": contributions,
    }
