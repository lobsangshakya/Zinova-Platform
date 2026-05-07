import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { FormCard } from "@/components/forms/FormCard";
import { FormInput } from "@/components/forms/FormInput";
import { SubmitButton } from "@/components/forms/SubmitButton";

const API = import.meta.env.VITE_API_URL || "https://zinova-backend.onrender.com";

type Step = "details" | "otp" | "done";

const Signup = () => {
  const [step, setStep]       = useState<Step>("details");
  const [email, setEmail]     = useState("");
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otp, setOtp]         = useState("");

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name) return setError("Please enter your name.");
    if (!email) return setError("Please enter your email.");
    
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to send OTP.");
      setStep("otp");
      setSuccess("OTP sent! Check your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!otp) return setError("Please enter the OTP.");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid OTP.");
      setStep("done");
      setSuccess("OTP verified! Welcome to Zinova.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <FormCard>
          <div className="w-full space-y-6">

            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                {step === "otp" ? "Enter OTP" : step === "done" ? "Verified!" : "Create an account"}
              </h1>
              <p className="text-sm text-slate-600">
                {step === "otp"
                  ? "Check your inbox for a 6-digit code"
                  : step === "done"
                  ? "Your account has been created"
                  : "Join us to empower sustainability"}
              </p>
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {success}
              </div>
            )}

            {step === "details" && (
              <form className="space-y-4" onSubmit={handleSendOtp} noValidate>
                <FormInput
                  id="name" name="name" type="text" label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  required disabled={loading}
                />
                <FormInput
                  id="email" name="email" type="email" label="Email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  autoComplete="email" required disabled={loading}
                />
                <SubmitButton type="submit" loading={loading} disabled={loading} className="w-full">
                  Create Account
                </SubmitButton>
                <div className="text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-primary hover:underline">
                    Log in
                  </Link>
                </div>
              </form>
            )}

            {step === "otp" && (
              <form className="space-y-4" onSubmit={handleVerifyOtp} noValidate>
                <FormInput
                  id="otp" name="otp" type="text" label="OTP Code"
                  value={otp}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                  autoComplete="one-time-code" required disabled={loading}
                />
                <SubmitButton type="submit" loading={loading} disabled={loading} className="w-full">
                  Verify OTP
                </SubmitButton>
                <button
                  type="button"
                  onClick={() => { setStep("details"); setError(null); setSuccess(null); setOtp(""); }}
                  className="w-full text-sm text-slate-500 hover:underline"
                >
                  ← Back
                </button>
              </form>
            )}

            {step === "done" && (
              <div className="space-y-4 text-center">
                 <Link to="/dashboard">
                  <SubmitButton className="w-full">
                    Go to Dashboard
                  </SubmitButton>
                </Link>
              </div>
            )}

          </div>
        </FormCard>
      </div>
    </div>
  );
};

export default Signup;