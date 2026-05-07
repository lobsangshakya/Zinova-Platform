import { useState } from "react";
import { Leaf, Zap, Heart, Users } from "lucide-react";
import AnimatedButton from "@/components/ui/animated-button";
import { logError, logUserAction } from "@/lib/logger";
import { submitFormToFastApi } from "@/services/formSubmission";
import ScrollReveal from "./ScrollReveal";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CallToAction = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    userType: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const safeLogUserAction = (action: string, metadata: Record<string, unknown>) => {
    try {
      logUserAction(action, metadata, "CallToAction");
    } catch {
      // Logging should never break CTA flow.
    }
  };

  const safeLogError = (action: string, metadata: Record<string, unknown>) => {
    try {
      logError(action, metadata, "CallToAction");
    } catch {
      // Logging should never break CTA flow.
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      organization: formData.organization.trim(),
      userType: formData.userType as "NGO" | "Restaurant",
      message: "",
      source: "landing" as const,
    };

    if (!payload.name) {
      setSubmitError("Name is required");
      safeLogError("VALIDATION_ERROR", { form: "landing", field: "name", message: "Name is required" });
      return;
    }

    if (!payload.email) {
      setSubmitError("Email is required");
      safeLogError("VALIDATION_ERROR", { form: "landing", field: "email", message: "Email is required" });
      return;
    }

    if (!payload.userType) {
      setSubmitError("Please select whether you are registering as an NGO or Restaurant");
      safeLogError("VALIDATION_ERROR", { form: "landing", field: "userType", message: "User type is required" });
      return;
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
    if (!isEmailValid) {
      setSubmitError("Invalid email format");
      safeLogError("VALIDATION_ERROR", { form: "landing", field: "email", message: "Invalid email format" });
      return;
    }

    try {
      setIsSubmitting(true);
      safeLogUserAction("FORM_SUBMIT", { form: "landing" });

      const result = await submitFormToFastApi(payload);
      if (!result.ok) {
        safeLogError("FORM_ERROR", { form: "landing", error: result.error || result.message });
        setSubmitError(result.error || "Failed");
        toast({
          title: "Submission failed",
          description: result.error || "Please try again.",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", organization: "", userType: "" });
      safeLogUserAction("FORM_SUCCESS", { form: "landing" });

      toast({
        title: "Success",
        description: "Your details have been submitted. We'll reach out shortly.",
      });

      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      safeLogError("FORM_ERROR", { form: "landing", error: errorMessage });
      setSubmitError("Network error");
      toast({
        title: "Network error",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { icon: Leaf,  title: "Reduce Waste",    description: "Cut food waste by up to 70% with our smart platform" },
    { icon: Heart, title: "Feed Communities", description: "Directly impact families in need with surplus food" },
    { icon: Zap,   title: "Save Resources",   description: "Preserve water, energy, and reduce carbon emissions" },
    { icon: Users, title: "Join Movement",    description: "Connect with a network of like-minded organizations" },
  ];

  return (
    <section className="bg-gradient-to-br from-primary to-primary/90 px-4 py-20 text-primary-foreground sm:px-6 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Left Column - Benefits */}
          <ScrollReveal variant="slide-right">
            <div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Transform Waste Into Worth
              </h2>
              <p className="mb-8 max-w-xl text-base leading-relaxed text-primary-foreground/90 md:text-lg">
                Join the growing community of restaurants, farms, and NGOs making a real impact on food waste and hunger.
              </p>

              <div className="mb-8 grid gap-6 sm:grid-cols-2">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary-foreground/10 p-2 dark:bg-[var(--bg-secondary)]">
                        <Icon className="h-5 w-5 text-accent dark:text-[var(--text-secondary)]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-primary-foreground">{benefit.title}</h3>
                        <p className="text-sm text-primary-foreground/80 mt-1">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-4">
                <AnimatedButton
                  size="lg"
                  variant="secondary"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 dark:bg-accent dark:text-accent-foreground"
                  animationType="lift"
                  onClick={() => safeLogUserAction("CTA_CLICK", { label: "Schedule Demo" })}
                >
                  Schedule Demo
                </AnimatedButton>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column - Form */}
          <ScrollReveal variant="slide-left">
            <div className="rounded-2xl border border-primary-foreground/20 bg-card/10 p-8 backdrop-blur-sm dark:border-[var(--border-color)] dark:bg-[var(--card-bg)]/70">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-primary-foreground mb-2">Ready to Get Started?</h3>
                <p className="text-primary-foreground/80">Join thousands of organizations fighting food waste</p>
                <p className="mt-2 text-sm text-primary-foreground/70">
                  Restaurants can donate surplus food. NGOs can receive and distribute food to people in need.
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                    <Heart className="h-8 w-8 text-green-400" />
                  </div>
                  <h4 className="text-xl font-bold text-primary-foreground mb-2">Thank You!</h4>
                  <p className="text-primary-foreground/80">We've received your information and will contact you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="cta-user-type" className="mb-2 block text-sm font-medium text-primary-foreground/80">
                      I am registering as
                    </label>
                    <Select
                      value={formData.userType}
                      onValueChange={(value) => setFormData({ ...formData, userType: value })}
                    >
                      <SelectTrigger id="cta-user-type" className="h-12 rounded-lg border border-primary-foreground/20 bg-white/10 text-white placeholder-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent dark:border-[var(--border-color)] dark:bg-[#0f2a23] dark:text-[var(--text-primary)]">
                        <SelectValue placeholder="Select NGO or Restaurant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGO">NGO</SelectItem>
                        <SelectItem value="Restaurant">Restaurant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="cta-name" className="mb-2 block text-sm font-medium text-primary-foreground/80">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="cta-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full rounded-lg border border-primary-foreground/20 bg-white/10 px-4 py-3 text-white placeholder-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent dark:border-[var(--border-color)] dark:bg-[#0f2a23] dark:text-[var(--text-primary)] dark:placeholder:text-[var(--text-secondary)]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cta-email" className="mb-2 block text-sm font-medium text-primary-foreground/80">
                      Work Email
                    </label>
                    <input
                      type="email"
                      id="cta-email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                      className="w-full rounded-lg border border-primary-foreground/20 bg-white/10 px-4 py-3 text-white placeholder-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent dark:border-[var(--border-color)] dark:bg-[#0f2a23] dark:text-[var(--text-primary)] dark:placeholder:text-[var(--text-secondary)]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cta-organization" className="mb-2 block text-sm font-medium text-primary-foreground/80">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      id="cta-organization"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder={formData.userType === "NGO" ? "NGO/Foundation Name" : formData.userType === "Restaurant" ? "Restaurant/Hotel Name" : "Select a type first"}
                      className="w-full rounded-lg border border-primary-foreground/20 bg-white/10 px-4 py-3 text-white placeholder-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent dark:border-[var(--border-color)] dark:bg-[#0f2a23] dark:text-[var(--text-primary)] dark:placeholder:text-[var(--text-secondary)]"
                    />
                  </div>

                  <p className="text-xs text-primary-foreground/70">
                    Restaurants can donate surplus food. NGOs can receive and distribute food to people in need.
                  </p>
                  
                  {submitError && <p className="text-sm text-red-200">{submitError}</p>}

                  <div className="pt-2">
                    <AnimatedButton
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      animationType="pulse"
                      onClick={() => safeLogUserAction("CTA_CLICK", { label: "Join Movement" })}
                    >
                      {isSubmitting ? "Submitting..." : "Join the Movement"}
                    </AnimatedButton>
                  </div>

                  <p className="text-xs text-center text-primary-foreground/60 mt-4">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              )}
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

export default CallToAction;
