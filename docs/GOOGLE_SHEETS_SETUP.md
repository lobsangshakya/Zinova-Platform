# Google Sheets Integration Setup Guide

This guide explains how to set up and use the NGO and Kitchen registration forms with Google Sheets integration.

## Overview

The Zinova platform now integrates NGO, Restaurant, and general inquiry forms with Google Sheets. All registration data is automatically stored in a Google Spreadsheet in separate sheet tabs:
- **NGO_Registrations**: Stores NGO registration data
- **Kitchen_Registrations**: Stores Kitchen registration data
- **Platform_Inquiries**: Stores hero section and Join Movement form submissions

Both sheets are stored in the same Google Spreadsheet.

## Prerequisites

1. A Google Cloud project with Google Sheets API enabled
2. A service account with credentials JSON file
3. A Google Spreadsheet with two sheets named:
   - `NGO_Registrations`
   - `Kitchen_Registrations`
   - `Platform_Inquiries`

## Step 1: Prepare Your Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet or use an existing one
2. Create two sheets with the exact names:
   - `NGO_Registrations`
   - `Kitchen_Registrations`

3. Add headers to each sheet (optional but recommended for organization):
   
   **NGO_Registrations sheet:**
   ```
   Timestamp | Organization Name | Official Email | Organization Type | Registration Number | Contact Person Name | Phone Number
   ```
   
   **Kitchen_Registrations sheet:**
   ```
   Timestamp | Kitchen/Restaurant Name | Business Email | Business Type | Street Address | City | Phone Number
   ```

4. Note down the **Spreadsheet ID** (visible in the URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`)

## Step 2: Set Up Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Search for "Sheets API" in the API library
   - Click "Enable"
4. Create a **Service Account**:
   - Go to "Credentials" → "Create Credentials" → "Service Account"
   - Fill in the service account details
   - Click "Create and Continue"
5. Create a **JSON Key**:
   - In the Service Account details, go to "Keys" tab
   - Click "Add Key" → "Create new key" → Select "JSON"
   - A JSON file will download automatically
6. Share your Google Spreadsheet with the service account email:
   - The email is in the format: `your-service-account@your-project.iam.gserviceaccount.com`
   - Open your Google Spreadsheet
   - Click "Share" and add the service account email with "Editor" permissions

## Step 3: Configure Backend Environment Variables

### Backend Setup (.env file)

1. Navigate to the `backend/` directory
2. Create or update your `.env` file with:

```bash
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your-actual-spreadsheet-id-here
GOOGLE_SERVICE_ACCOUNT_FILE=../service-account.json
```

3. Place your downloaded service account JSON file in the project root as `service-account.json`

The backend will automatically load these environment variables from the `.env` file.

## Step 4: Frontend Configuration (Optional)

The frontend uses the `VITE_API_URL` and `VITE_API_BASE_URL` environment variables to connect to the backend API:

```bash
# .env file in the project root
VITE_API_URL=/api
VITE_API_BASE_URL=/api
```

This should already be configured in `.env.example`, but you can customize it for your environment.

## Step 5: Run the Application

### Start the Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The backend will start on `http://127.0.0.1:8000`

### Start the Frontend

```bash
npm install
npm run dev
```

If you want to work directly inside the frontend workspace:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (or similar, check terminal output)

## API Endpoints

### NGO Registration

**POST** `/api/register/ngo`

Request body:
```json
{
  "orgName": "Food for All Foundation",
  "email": "contact@org.org",
  "orgType": "Non-profit",
  "regNumber": "REG-123456",
  "contactPerson": "John Doe",
  "phone": "+1 (555) 000-0000"
}
```

Response:
```json
{
  "success": true,
  "message": "NGO registration successful"
}
```

### Kitchen Registration

**POST** `/api/register/kitchen`

Request body:
```json
{
  "businessName": "Green Olive Bistro",
  "email": "manager@restaurant.com",
  "businessType": "Fine Dining",
  "address": "123 Culinary Ave",
  "city": "New York",
  "phone": "+1 (555) 000-0000"
}
```

Response:
```json
{
  "success": true,
  "message": "Kitchen registration successful"
}
```

### Platform Inquiries

**POST** `/api/general-leads`

Request body:
```json
{
   "fullName": "Jane Doe",
   "email": "jane@example.com",
   "organizationName": "Helping Hands",
   "userType": "NGO",
   "messageSource": "Hero Section",
   "notes": "Interested in partnering with Zinova"
}
```

Response:
```json
{
   "success": true,
   "message": "Lead submitted successfully"
}
```

## Frontend Form Fields

### NGO Registration Form

**Step 1 - Organization Details:**
- Organization Name (required)
- Official Email (required)
- Organization Type (required)
- Registration Number (required)

**Step 2 - Contact Person:**
- Contact Person Name (required)
- Phone Number (required)

### Kitchen Registration Form

**Step 1 - Business Info:**
- Kitchen/Restaurant Name (required)
- Business Email (required)
- Business Type (required)

**Step 2 - Location & Contact:**
- Street Address (required)
- City (required)
- Phone Number (required)

## Validation & Error Handling

Both registration endpoints validate:
- All required fields are present and non-empty
- Email format is valid (matches standard email regex)
- Fields are properly trimmed of whitespace

Validation errors return HTTP 400 with descriptive error messages. Example:
```json
{
  "detail": "Organization Name is required"
}
```

## Success & Failure Messages

### Success (Toast Notification)
When a registration is submitted successfully, users see:
- **Title**: "Success!"
- **Message**: Form-specific success message (e.g., "NGO registration submitted successfully...")

### Error (Toast Notification)
When registration fails, users see:
- **Title**: "Error" or "Registration Failed"
- **Description**: The error message from the backend or API error

## Data Storage in Google Sheets

### NGO_Registrations Sheet

Columns (in order):
1. **Timestamp** - ISO format datetime
2. **Organization Name**
3. **Official Email**
4. **Organization Type**
5. **Registration Number**
6. **Contact Person Name**
7. **Phone Number**

### Kitchen_Registrations Sheet

Columns (in order):
1. **Timestamp** - ISO format datetime
2. **Kitchen/Restaurant Name**
3. **Business Email**
4. **Business Type**
5. **Street Address**
6. **City**
7. **Phone Number**

### Platform_Inquiries Sheet

Columns (in order):
1. **Timestamp**
2. **Full_Name**
3. **Email**
4. **Organization_Name**
5. **User_Type**
6. **Message_Source**
7. **Notes**

## Troubleshooting

### "Service account file not found" Error

**Solution:**
- Ensure `service-account.json` is in the project root directory
- Check the `GOOGLE_SERVICE_ACCOUNT_FILE` path in your `.env` file

### "GOOGLE_SPREADSHEET_ID is not configured" Error

**Solution:**
- Verify `GOOGLE_SPREADSHEET_ID` is set in your `.env` file
- Make sure it's the correct spreadsheet ID (not the URL)

### Permissions Denied Error

**Solution:**
- Ensure the service account email has Editor access to your Google Spreadsheet
- Re-share the spreadsheet with the service account email

### Sheet Not Found Error

**Solution:**
- Verify the sheet names are exactly: `NGO_Registrations` and `Kitchen_Registrations`
- Sheet names are case-sensitive
- Create the sheets manually if they don't exist

### API Not Responding

**Solution:**
- Ensure the backend is running (`python main.py`)
- Check that `VITE_API_URL` in the frontend is correctly set to your backend URL
- Check browser console for network errors

## Docker Deployment

When deploying with Docker, ensure:

1. The service account JSON is mounted as a volume or copied into the container
2. Environment variables are passed to the container:

```bash
docker run -e GOOGLE_SPREADSHEET_ID=your-id \
           -e GOOGLE_SERVICE_ACCOUNT_FILE=/app/service-account.json \
           -v /path/to/service-account.json:/app/service-account.json \
           your-image-name
```

## Security Notes

- **Never commit** `service-account.json` to version control
- Use strong environment variable secrets in production
- Consider using a secrets management system (e.g., AWS Secrets Manager, Google Cloud Secret Manager)
- Restrict service account permissions to the specific spreadsheet only

## Files Modified

- `backend/app/routes/form.py` - Added `/api/register/ngo` and `/api/register/kitchen` endpoints
- `src/pages/NgoSignup.tsx` - Connected form to `registerNGO()` API
- `src/pages/KitchenSignup.tsx` - Connected form to `registerKitchen()` API
- `src/services/api.ts` - Added `registerNGO()` and `registerKitchen()` functions
- `backend/.env.example` - Updated with Google Sheets configuration

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review the backend logs: `python main.py` output
3. Check the browser console for frontend errors
4. Verify Google Cloud credentials and API status
