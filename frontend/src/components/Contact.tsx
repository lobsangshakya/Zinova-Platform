import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Mail, Building, MessageSquare, CheckCircle } from "lucide-react";
import AnimatedButton from "@/components/ui/animated-button";
import { logError, logUserAction } from "@/lib/logger";
import { submitFormToFastApi } from "@/services/formSubmission";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    userType: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeLogUserAction = (action: string, metadata: Record<string, unknown>) => {
    try {
      logUserAction(action, metadata, "ContactForm");
    } catch {
      // Logging should never break form flow.
    }
  };

  const safeLogError = (action: string, metadata: Record<string, unknown>) => {
    try {
      logError(action, metadata, "ContactForm");
    } catch {
      // Logging should never break form flow.
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      organization: formData.organization.trim(),
      userType: formData.userType as "NGO" | "Restaurant",
      message: formData.message.trim(),
      source: "contact" as const,
    };

    if (!payload.name) {
      toast({
        title: "Validation error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    if (!payload.email) {
      toast({
        title: "Validation error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    if (!payload.userType) {
      toast({
        title: "Validation error",
        description: "Please select whether you are registering as an NGO or Restaurant",
        variant: "destructive",
      });
      return;
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
    if (!isEmailValid) {
      safeLogError("VALIDATION_ERROR", {
        form: "contact",
        field: "email",
        message: "Invalid email format",
      });

      toast({
        title: "Validation error",
        description: "Invalid email format",
        variant: "destructive",
      });

      return;
    }

    try {
      setIsSubmitting(true);
      safeLogUserAction("FORM_SUBMIT", { form: "contact" });

      const result = await submitFormToFastApi(payload);

      if (!result.ok) {
        safeLogError("FORM_ERROR", {
          form: "contact",
          error: result.error || result.message,
        });

        toast({
          title: "Submission failed",
          description: result.error || "Failed",
          variant: "destructive",
        });

        return;
      }

      toast({
        title: "Message sent",
        description: "Thank you for your interest. We'll get back to you soon.",
      });

      setIsSubmitted(true);
      setFormData({ name: "", email: "", organization: "", userType: "", message: "" });

      safeLogUserAction("FORM_SUCCESS", { form: "contact" });

      // Reset submission status after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      safeLogError("FORM_ERROR", { form: "contact", error: errorMessage });

      toast({
        title: "Network error",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 px-4 py-20 sm:scroll-mt-28 sm:px-6 lg:scroll-mt-32 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Join the Movement
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          <p className="text-base leading-relaxed text-muted-foreground max-w-xl mx-auto">
            Whether you're a farmer, restaurant, NGO, or just want to help, let's connect.
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Restaurants can donate surplus food. NGOs can receive and distribute food to people in need.
          </p>
        </div>
        
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Left Info Panel */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              {[
                { icon: Mail, title: "Email Us", detail: "hello@zinova.org" },
                { icon: Building, title: "Headquarters", detail: "Mumbai, India" },
                { icon: MessageSquare, title: "Response Time", detail: "Within 24 hours" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{item.title}</h4>
                      <p className="text-muted-foreground text-sm mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6">
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                <span className="text-foreground font-bold">500+</span> organizations trust Zinova to manage their food surplus. Join them and make a measurable impact.
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-3">
            {isSubmitted ? (
              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-12 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground">
                  We've received your message and will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-3xl border border-border/50 bg-card p-8 shadow-xl shadow-primary/5 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                      <Input
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-12 rounded-xl border-border/50 bg-secondary/30 pl-11 text-sm focus:border-primary focus:ring-primary/20 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-12 rounded-xl border-border/50 bg-secondary/30 pl-11 text-sm focus:border-primary focus:ring-primary/20 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">I am registering as</label>
                  <Select
                    value={formData.userType}
                    onValueChange={(value) => setFormData({ ...formData, userType: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-border/50 bg-secondary/30 text-sm focus:border-primary focus:ring-primary/20 transition-colors">
                      <SelectValue placeholder="Select NGO or Restaurant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGO">NGO</SelectItem>
                      <SelectItem value="Restaurant">Restaurant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Organization Name</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      placeholder={formData.userType === "NGO" ? "NGO/Foundation Name" : formData.userType === "Restaurant" ? "Restaurant/Hotel Name" : "Select a type first"}
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="h-12 rounded-xl border-border/50 bg-secondary/30 pl-11 text-sm focus:border-primary focus:ring-primary/20 transition-colors"
                    />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Restaurants can donate surplus food. NGOs can receive and distribute food to people in need.
                </p>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-muted-foreground/50" />
                    <Textarea
                      placeholder="Tell us how you'd like to get involved..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="min-h-32 rounded-xl border-border/50 bg-secondary/30 pl-11 text-sm focus:border-primary focus:ring-primary/20 transition-colors resize-none"
                    />
                  </div>
                </div>
                
                <AnimatedButton type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl text-base font-bold" size="lg" variant="hero" animationType="pulse">
                  Send Message <Send className="ml-2 h-4 w-4" />
                </AnimatedButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
