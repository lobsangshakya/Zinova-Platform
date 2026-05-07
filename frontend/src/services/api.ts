const API_BASE_URL = import.meta.env.VITE_API_URL || "";

async function request(path: string, options: RequestInit = {}) {
  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body,
  };

  const endpoint = `${API_BASE_URL}${path}`;
  console.log(`[API] ${config.method} ${endpoint}`);

  const response = await fetch(endpoint, config);
  let data = null;
  
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = (data && data.detail) || `Request failed: ${response.status}`;
    console.error(`[API Error] ${errorMessage}`);
    throw new Error(errorMessage);
  }

  return { ok: true, status: response.status, data };
}

export interface OtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

// ── OTP Authentication Endpoints ─────────────────────────────────────────────

export async function sendOtp(payload: OtpRequest) {
  return request("/api/auth/send-otp", { method: "POST", body: JSON.stringify(payload) });
}

export async function verifyOtp(payload: VerifyOtpRequest) {
  return request("/api/auth/verify-otp", { method: "POST", body: JSON.stringify(payload) });
}

// ── NGO Registration Endpoint ─────────────────────────────────────────────

export interface NGORegistrationPayload {
  orgName: string;
  email: string;
  orgType: string;
  regNumber: string;
  contactPerson: string;
  phone: string;
}

export async function registerNGO(payload: NGORegistrationPayload) {
  return request("/api/register/ngo", { method: "POST", body: JSON.stringify(payload) });
}

// ── Restaurant Registration Endpoint ─────────────────────────────────────────

export interface KitchenRegistrationPayload {
  businessName: string;
  email: string;
  businessType: string;
  address: string;
  city: string;
  phone: string;
}

export async function registerKitchen(payload: KitchenRegistrationPayload) {
  return request("/api/register/kitchen", { method: "POST", body: JSON.stringify(payload) });
}
