# Zinova – AI-Based Food Optimization Platform

Zinova is a full-stack application designed to optimize food resource management using AI. It includes an OTP-based authentication system, a dashboard interface, and Google Sheets integration for lightweight data storage.

## Features

- OTP-based authentication using Brevo SMTP
- Login and verification system
- Dashboard interface
- FastAPI backend
- React (Vite + TypeScript) frontend
- Clean full-stack structure with separate frontend, backend, and docs folders

## Tech Stack

Frontend: React (Vite + TypeScript)
Backend: FastAPI
Email Service: Brevo (SMTP)
Authentication: OTP-based login

## Project Structure

zinova-platform/

frontend/
  src/
  public/
  package.json
  vite.config.ts

backend/
  app/
  main.py
  requirements.txt

docs/
  README.md
  GOOGLE_SHEETS_SETUP.md

## Setup Instructions

### Clone the repository

git clone https://github.com/your-username/zinova.git
cd zinova

### Backend setup

cd backend
pip install -r requirements.txt

Create a `.env` file with:

BREVO_SMTP_SERVER=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_EMAIL=your_smtp_login
BREVO_PASSWORD=your_smtp_key

Run backend:

uvicorn main:app --reload

### Frontend setup

From the repository root:

```bash
npm run dev
```

Or run the frontend directly:

```bash
cd frontend
npm install
npm run dev
```

## How It Works

1. User enters email
2. OTP is sent via Brevo
3. User verifies OTP
4. User gets access to dashboard

## Upcoming Features

- Google Sheets integration
- Data analytics features
- Deployment hardening