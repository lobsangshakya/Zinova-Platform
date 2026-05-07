import { ChangeEvent, FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormCard } from "@/components/forms/FormCard";
import { FormInput } from "@/components/forms/FormInput";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { ChefHat, ArrowLeft, ShieldCheck, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import PortalBackground from "@/components/PortalBackground";

const API = import.meta.env.VITE_API_URL || "https://zinova-backend.onrender.com";

type Step = "details" | "otp" | "done";

const KitchenLogin = () => {
  const [step, setStep] = useState<Step>("details");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otp, setOtp] = useState("");

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
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
      setSuccess("OTP verified! Welcome back.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
      <PortalBackground variant="accent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center space-y-2">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-accent transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-accent/10 rounded-2xl relative">
              <Utensils className="w-8 h-8 text-accent" />
              <div className="absolute -top-1 -right-1 p-1 bg-white dark:bg-slate-900 rounded-full border border-accent/20">
                 <ChefHat className="w-4 h-4 text-accent" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Restaurant Portal</h1>
          <p className="text-muted-foreground">Manage your surplus and reach those in need</p>
        </div>

        <FormCard className="backdrop-blur-xl bg-card/80 border-border/50 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Stripe */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent/50" />
          
          <AnimatePresence mode="wait">
            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6 pt-4"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Restaurant Access</h2>
                  <p className="text-sm text-muted-foreground">Log in to your restaurant dashboard using your registered email.</p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <FormInput
                    id="email"
                    name="email"
                    type="email"
                    label="Business Email"
                    placeholder="restaurant@restaurant.com"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <SubmitButton loading={loading} className="w-full h-11 text-base font-medium bg-accent hover:bg-accent/90 text-accent-foreground shadow-accent/20">
                    Get Access Code
                  </SubmitButton>
                </form>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 pt-4"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Verify Access</h2>
                  <p className="text-sm text-muted-foreground">A verification code has been dispatched to <span className="font-medium text-foreground">{email}</span></p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <FormInput
                    id="otp"
                    name="otp"
                    type="text"
                    label="Access Code"
                    placeholder="000000"
                    value={otp}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                    required
                    disabled={loading}
                    autoFocus
                  />
                  <SubmitButton loading={loading} className="w-full h-11 text-base font-medium bg-accent hover:bg-accent/90 text-accent-foreground">
                    Confirm & Enter
                  </SubmitButton>
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back to email entry
                  </button>
                </form>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6 pt-4"
              >
                <div className="flex justify-center">
                  <div className="p-4 bg-accent/20 rounded-full">
                    <ShieldCheck className="w-12 h-12 text-accent" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold italic">Access Granted</h2>
                  <p className="text-muted-foreground text-sm">Entering your restaurant management portal...</p>
                </div>
                <Link to="/dashboard" className="inline-block w-full py-3 bg-accent text-accent-foreground rounded-lg font-medium shadow-lg hover:shadow-accent/20 transition-all">
                  Proceed to Dashboard
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </FormCard>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Partner with Zinova? <Link to="/signup/kitchen" className="text-accent font-medium hover:underline">Start donating food</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default KitchenLogin;