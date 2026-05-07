import { ChangeEvent, FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormCard } from "@/components/forms/FormCard";
import { FormInput } from "@/components/forms/FormInput";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { ChefHat, ArrowLeft, CheckCircle2, Utensils, MapPin, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PortalBackground from "@/components/PortalBackground";
import { useToast } from "@/hooks/use-toast";
import { registerKitchen } from "@/services/api";

type Step = 1 | 2 | 3;

const KitchenSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    businessType: "",
    address: "",
    city: "",
    phone: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await registerKitchen(formData);
      
      if (response.data?.success) {
        toast({
          title: "Success!",
          description: "Restaurant registration submitted successfully. We'll review your details and contact you shortly to complete the onboarding.",
          variant: "default",
        });
        setStep(3);
      } else {
        const errorMsg = response.data?.error || "Registration failed. Please try again.";
        setError(errorMsg);
        toast({
          title: "Registration Failed",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred during registration";
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
      <PortalBackground variant="accent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-accent transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-accent/10 rounded-2xl">
              <Utensils className="w-8 h-8 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Partner your Restaurant</h1>
          <p className="text-muted-foreground mt-2">Start donating surplus food and reducing waste</p>
          
          {/* Progress Bar */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 1 ? 'bg-accent' : 'bg-muted'}`} />
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 2 ? 'bg-accent' : 'bg-muted'}`} />
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 3 ? 'bg-accent' : 'bg-muted'}`} />
          </div>
        </div>

        <FormCard className="backdrop-blur-xl bg-card/80 border-border/50 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent/50" />
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6 pt-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Store className="w-5 h-5 text-accent" />
                  <h2 className="text-xl font-semibold">Business Info</h2>
                </div>
                
                <form onSubmit={handleNext} className="space-y-4">
                  <FormInput
                    id="businessName" name="businessName" label="Restaurant Name"
                    placeholder="e.g. Green Olive Bistro"
                    value={formData.businessName} onChange={handleChange} required
                  />
                  <FormInput
                    id="email" name="email" type="email" label="Business Email"
                    placeholder="manager@restaurant.com"
                    value={formData.email} onChange={handleChange} required
                  />
                  <FormInput
                    id="businessType" name="businessType" label="Business Type"
                    placeholder="e.g. Fine Dining, Catering, Hotel"
                    value={formData.businessType} onChange={handleChange} required
                  />
                  <SubmitButton className="w-full h-11 text-base font-medium mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                    Next Step
                  </SubmitButton>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 pt-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <h2 className="text-xl font-semibold">Location & Contact</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormInput
                    id="address" name="address" label="Street Address"
                    placeholder="123 Culinary Ave"
                    value={formData.address} onChange={handleChange} required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      id="city" name="city" label="City"
                      placeholder="New York"
                      value={formData.city} onChange={handleChange} required
                    />
                    <FormInput
                      id="phone" name="phone" label="Phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone} onChange={handleChange} required
                    />
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 h-11 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <SubmitButton loading={loading} className="flex-[2] h-11 text-base font-medium bg-accent hover:bg-accent/90 text-accent-foreground">
                      Register Restaurant
                    </SubmitButton>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6 pt-4"
              >
                <div className="flex justify-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="p-4 bg-accent/20 rounded-full"
                  >
                    <CheckCircle2 className="w-16 h-16 text-accent" />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight text-accent">Welcome Aboard!</h2>
                  <p className="text-muted-foreground">
                    Your restaurant partnership request has been submitted. We'll review your application and contact you shortly to complete the onboarding.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-medium shadow-lg hover:shadow-accent/20 transition-all"
                >
                  Return to Homepage
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </FormCard>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already a partner? <Link to="/login/kitchen" className="text-accent font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default KitchenSignup;
