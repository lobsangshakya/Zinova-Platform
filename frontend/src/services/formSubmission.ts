export interface SubmitPayload {
  name: string;
  email: string;
  organization: string;
  userType: "NGO" | "Restaurant";
  message: string;
  source: "landing" | "contact";
}

export interface SubmitResult {
  ok: boolean;
  message: string;
  error?: string;
  data?: unknown;
}

const API_BASE = import.meta.env.VITE_API_URL || "";
const SUBMIT_URL = `${API_BASE}/api/general-leads`;

export async function submitFormToFastApi(payload: SubmitPayload): Promise<SubmitResult> {
  console.log("Sending data:", payload);

  try {
    const response = await fetch(SUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: payload.name,
        email: payload.email,
        organizationName: payload.organization,
        userType: payload.userType,
        messageSource: payload.source === "contact" ? "Join Movement" : "Hero Section",
        notes: payload.message,
      }),
    });

    let result: unknown = null;
    try {
      result = await response.json();
    } catch {
      result = null;
    }

    console.log("Response:", { status: response.status, ok: response.ok, result });

    const responseSuccessFlag =
      typeof result === "object" && result !== null && "success" in result
        ? Boolean((result as { success?: unknown }).success)
        : false;

    if (!response.ok || !responseSuccessFlag) {
      const errorMessage =
        typeof result === "object" && result !== null && "error" in result
          ? String((result as { error?: unknown }).error)
          : typeof result === "object" && result !== null && "detail" in result
            ? String((result as { detail?: unknown }).detail)
            : "Failed";

      return {
        ok: false,
        message: "Failed",
        error: errorMessage,
        data: result,
      };
    }

    const successMessage =
      typeof result === "object" && result !== null && "message" in result
        ? String((result as { message?: unknown }).message)
        : "Success";

    return {
      ok: true,
      message: successMessage,
      data: result,
    };
  } catch (error) {
    console.error("Network error:", error);
    return {
      ok: false,
      message: "Network error",
      error: "Network error",
    };
  }
}
