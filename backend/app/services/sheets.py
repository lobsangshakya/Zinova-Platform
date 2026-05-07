"""
Google Sheets Service Module

This module provides CRUD operations for interacting with Google Sheets.
It handles authentication, data validation, and error handling.
"""

import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import logging

logger = logging.getLogger(__name__)

# Google Sheets API scope
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# Sheet names
USERS_SHEET = 'Users'
INVENTORY_SHEET = 'Inventory'
ANALYTICS_SHEET = 'Analytics'

RENDER_SERVICE_ACCOUNT_FILE = Path('/etc/secrets/service-account.json')
LOCAL_SERVICE_ACCOUNT_FILE = Path(__file__).resolve().parents[3] / 'service-account.json'


def resolve_service_account_path(preferred_path: Optional[str] = None) -> Optional[Path]:
    candidates = [RENDER_SERVICE_ACCOUNT_FILE]

    if preferred_path:
        candidates.append(Path(preferred_path))

    candidates.append(LOCAL_SERVICE_ACCOUNT_FILE)

    seen = set()
    for candidate in candidates:
        candidate = candidate.expanduser()
        candidate_key = str(candidate)
        if candidate_key in seen:
            continue
        seen.add(candidate_key)

        if candidate.exists():
            logger.info("Using Google service account file from %s", candidate.parent)
            return candidate

    logger.error("Google service account file not found in Render secrets or local project path")
    return None


class GoogleSheetsService:
    """Service for interacting with Google Sheets"""
    
    def __init__(self, credentials_path: str, spreadsheet_id: str):
        """
        Initialize Google Sheets service
        
        Args:
            credentials_path: Path to service account JSON credentials
            spreadsheet_id: Google Sheets ID
        """
        self.spreadsheet_id = spreadsheet_id
        self.service = None
        
        try:
            resolved_path = resolve_service_account_path(credentials_path)
            if not resolved_path:
                logger.warning("Google Sheets credentials file not found")
                return
            
            credentials = Credentials.from_service_account_file(
                str(resolved_path),
                scopes=SCOPES
            )
            self.service = build('sheets', 'v4', credentials=credentials)
            logger.info("Google Sheets service initialized successfully")
        except Exception as e:
            logger.exception("Failed to initialize Google Sheets service")
    
    def is_available(self) -> bool:
        """Check if Google Sheets service is available"""
        return self.service is not None
    
    def _append_row(self, sheet_name: str, values: List[Any]) -> Optional[Dict]:
        """
        Append a row to a sheet
        
        Args:
            sheet_name: Name of the sheet
            values: List of values to append
            
        Returns:
            Response from API or None if failed
        """
        if not self.service:
            logger.error("Google Sheets service not available")
            return None
        
        try:
            result = self.service.spreadsheets().values().append(
                spreadsheetId=self.spreadsheet_id,
                range=f'{sheet_name}!A:Z',
                valueInputOption='USER_ENTERED',
                body={'values': [values]}
            ).execute()
            logger.info(f"Row appended to {sheet_name}")
            return result
        except HttpError as e:
            logger.error(f"Failed to append row to {sheet_name}: {e}")
            return None
    
    def _get_rows(self, sheet_name: str, range_name: str = 'A:Z') -> List[List[Any]]:
        """
        Get rows from a sheet
        
        Args:
            sheet_name: Name of the sheet
            range_name: Range to read (default: all columns)
            
        Returns:
            List of rows or empty list if failed
        """
        if not self.service:
            logger.error("Google Sheets service not available")
            return []
        
        try:
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=f'{sheet_name}!{range_name}'
            ).execute()
            return result.get('values', [])
        except HttpError as e:
            logger.error(f"Failed to get rows from {sheet_name}: {e}")
            return []
    
    def _update_row(self, sheet_name: str, row_index: int, values: List[Any]) -> Optional[Dict]:
        """
        Update a row in a sheet
        
        Args:
            sheet_name: Name of the sheet
            row_index: Row index (1-based)
            values: List of values to update
            
        Returns:
            Response from API or None if failed
        """
        if not self.service:
            logger.error("Google Sheets service not available")
            return None
        
        try:
            result = self.service.spreadsheets().values().update(
                spreadsheetId=self.spreadsheet_id,
                range=f'{sheet_name}!A{row_index}:Z{row_index}',
                valueInputOption='USER_ENTERED',
                body={'values': [values]}
            ).execute()
            logger.info(f"Row {row_index} updated in {sheet_name}")
            return result
        except HttpError as e:
            logger.error(f"Failed to update row in {sheet_name}: {e}")
            return None
    
    def _delete_row(self, sheet_name: str, row_index: int) -> Optional[Dict]:
        """
        Delete a row from a sheet
        
        Args:
            sheet_name: Name of the sheet
            row_index: Row index (1-based)
            
        Returns:
            Response from API or None if failed
        """
        if not self.service:
            logger.error("Google Sheets service not available")
            return None
        
        try:
            # Get sheet ID
            sheet_metadata = self.service.spreadsheets().get(
                spreadsheetId=self.spreadsheet_id
            ).execute()
            
            sheet_id = None
            for sheet in sheet_metadata.get('sheets', []):
                if sheet['properties']['title'] == sheet_name:
                    sheet_id = sheet['properties']['sheetId']
                    break
            
            if sheet_id is None:
                logger.error(f"Sheet {sheet_name} not found")
                return None
            
            # Delete row
            result = self.service.spreadsheets().batchUpdate(
                spreadsheetId=self.spreadsheet_id,
                body={
                    'requests': [{
                        'deleteDimension': {
                            'range': {
                                'sheetId': sheet_id,
                                'dimension': 'ROWS',
                                'startIndex': row_index - 1,
                                'endIndex': row_index
                            }
                        }
                    }]
                }
            ).execute()
            logger.info(f"Row {row_index} deleted from {sheet_name}")
            return result
        except HttpError as e:
            logger.error(f"Failed to delete row from {sheet_name}: {e}")
            return None
    
    # ── User Operations ──────────────────────────────────────────────────────
    
    def create_user(self, email: str, preferences: Optional[Dict] = None) -> bool:
        """
        Create a new user record
        
        Args:
            email: User email
            preferences: User preferences (optional)
            
        Returns:
            True if successful, False otherwise
        """
        now = datetime.utcnow().isoformat() + 'Z'
        prefs = preferences or {"theme": "light"}
        
        values = [
            email,
            now,
            now,
            str(prefs)
        ]
        
        result = self._append_row(USERS_SHEET, values)
        return result is not None
    
    def get_user(self, email: str) -> Optional[Dict]:
        """
        Get user by email
        
        Args:
            email: User email
            
        Returns:
            User data or None if not found
        """
        rows = self._get_rows(USERS_SHEET)
        
        for i, row in enumerate(rows):
            if len(row) > 0 and row[0] == email:
                return {
                    'row_index': i + 1,
                    'email': row[0] if len(row) > 0 else None,
                    'created_at': row[1] if len(row) > 1 else None,
                    'last_login': row[2] if len(row) > 2 else None,
                    'preferences': row[3] if len(row) > 3 else None,
                }
        
        return None
    
    def update_user_last_login(self, email: str) -> bool:
        """
        Update user's last login timestamp
        
        Args:
            email: User email
            
        Returns:
            True if successful, False otherwise
        """
        user = self.get_user(email)
        if not user:
            return False
        
        now = datetime.utcnow().isoformat() + 'Z'
        values = [
            email,
            user['created_at'],
            now,
            user['preferences']
        ]
        
        result = self._update_row(USERS_SHEET, user['row_index'], values)
        return result is not None
    
    # ── Inventory Operations ─────────────────────────────────────────────────
    
    def create_inventory_item(
        self,
        item_name: str,
        quantity: float,
        unit: str,
        expiry_date: str,
        category: str,
        user_email: str
    ) -> Optional[str]:
        """
        Create a new inventory item
        
        Args:
            item_name: Name of the item
            quantity: Quantity
            unit: Unit of measurement
            expiry_date: Expiry date (YYYY-MM-DD)
            category: Category
            user_email: User's email
            
        Returns:
            Item ID if successful, None otherwise
        """
        item_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat() + 'Z'
        
        values = [
            item_id,
            item_name,
            quantity,
            unit,
            expiry_date,
            category,
            user_email,
            now,
            now
        ]
        
        result = self._append_row(INVENTORY_SHEET, values)
        return item_id if result else None
    
    def get_inventory_items(self, user_email: str) -> List[Dict]:
        """
        Get all inventory items for a user
        
        Args:
            user_email: User's email
            
        Returns:
            List of inventory items
        """
        rows = self._get_rows(INVENTORY_SHEET)
        items = []
        
        for i, row in enumerate(rows):
            if len(row) > 6 and row[6] == user_email:
                items.append({
                    'row_index': i + 1,
                    'id': row[0] if len(row) > 0 else None,
                    'item_name': row[1] if len(row) > 1 else None,
                    'quantity': float(row[2]) if len(row) > 2 else 0,
                    'unit': row[3] if len(row) > 3 else None,
                    'expiry_date': row[4] if len(row) > 4 else None,
                    'category': row[5] if len(row) > 5 else None,
                    'user_email': row[6] if len(row) > 6 else None,
                    'created_at': row[7] if len(row) > 7 else None,
                    'updated_at': row[8] if len(row) > 8 else None,
                })
        
        return items
    
    def update_inventory_item(
        self,
        item_id: str,
        user_email: str,
        **kwargs
    ) -> bool:
        """
        Update an inventory item
        
        Args:
            item_id: Item ID
            user_email: User's email
            **kwargs: Fields to update (item_name, quantity, unit, expiry_date, category)
            
        Returns:
            True if successful, False otherwise
        """
        items = self.get_inventory_items(user_email)
        
        for item in items:
            if item['id'] == item_id:
                now = datetime.utcnow().isoformat() + 'Z'
                
                values = [
                    item_id,
                    kwargs.get('item_name', item['item_name']),
                    kwargs.get('quantity', item['quantity']),
                    kwargs.get('unit', item['unit']),
                    kwargs.get('expiry_date', item['expiry_date']),
                    kwargs.get('category', item['category']),
                    user_email,
                    item['created_at'],
                    now
                ]
                
                result = self._update_row(INVENTORY_SHEET, item['row_index'], values)
                return result is not None
        
        return False
    
    def delete_inventory_item(self, item_id: str, user_email: str) -> bool:
        """
        Delete an inventory item
        
        Args:
            item_id: Item ID
            user_email: User's email
            
        Returns:
            True if successful, False otherwise
        """
        items = self.get_inventory_items(user_email)
        
        for item in items:
            if item['id'] == item_id:
                result = self._delete_row(INVENTORY_SHEET, item['row_index'])
                return result is not None
        
        return False
    
    # ── Analytics Operations ─────────────────────────────────────────────────
    
    def create_analytics_record(
        self,
        user_email: str,
        metric_name: str,
        metric_value: float,
        category: str
    ) -> bool:
        """
        Create an analytics record
        
        Args:
            user_email: User's email
            metric_name: Name of the metric
            metric_value: Value of the metric
            category: Category of the metric
            
        Returns:
            True if successful, False otherwise
        """
        now = datetime.utcnow().isoformat() + 'Z'
        
        values = [
            user_email,
            metric_name,
            metric_value,
            now,
            category
        ]
        
        result = self._append_row(ANALYTICS_SHEET, values)
        return result is not None
    
    def get_analytics(self, user_email: str) -> List[Dict]:
        """
        Get all analytics records for a user
        
        Args:
            user_email: User's email
            
        Returns:
            List of analytics records
        """
        rows = self._get_rows(ANALYTICS_SHEET)
        records = []
        
        for row in rows:
            if len(row) > 0 and row[0] == user_email:
                records.append({
                    'user_email': row[0] if len(row) > 0 else None,
                    'metric_name': row[1] if len(row) > 1 else None,
                    'metric_value': float(row[2]) if len(row) > 2 else 0,
                    'timestamp': row[3] if len(row) > 3 else None,
                    'category': row[4] if len(row) > 4 else None,
                })
        
        return records


# Global service instance
_sheets_service: Optional[GoogleSheetsService] = None


def get_sheets_service() -> Optional[GoogleSheetsService]:
    """Get or create the global Google Sheets service instance"""
    global _sheets_service
    
    if _sheets_service is None:
        spreadsheet_id = os.getenv('GOOGLE_SHEETS_ID')
        
        if not spreadsheet_id:
            logger.warning("GOOGLE_SHEETS_ID not set in environment")
            return None
        
        _sheets_service = GoogleSheetsService('', spreadsheet_id)
    
    return _sheets_service
