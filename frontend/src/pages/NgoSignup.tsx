import { ChangeEvent, FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormCard } from "@/components/forms/FormCard";
import { FormInput } from "@/components/forms/FormInput";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Heart, ArrowLeft, CheckCircle2, Building2, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PortalBackground from "@/components/PortalBackground";
import { useToast } from "@/hooks/use-toast";
import { registerNGO } from "@/services/api";

type Step = 1 | 2 | 3;

const NgoSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    orgName: "",
    email: "",
    orgType: "",
    regNumber: "",
    contactPerson: "",
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
      const response = await registerNGO(formData);
      
      if (response.data?.success) {
        toast({
          title: "Success!",
          description: "NGO registration submitted successfully. We'll review your details and contact you within 24-48 hours.",
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
      <PortalBackground variant="primary" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Register your NGO</h1>
          <p className="text-muted-foreground mt-2">Join Zinova to start receiving food donations</p>
          
          {/* Progress Bar */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </div>

        <FormCard className="backdrop-blur-xl bg-card/80 border-border/50 shadow-2xl relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Organization Details</h2>
                </div>
                
                <form onSubmit={handleNext} className="space-y-4">
                  <FormInput
                    id="orgName" name="orgName" label="Organization Name"
                    placeholder="e.g. Food for All Foundation"
                    value={formData.orgName} onChange={handleChange} required
                  />
                  <FormInput
                    id="email" name="email" type="email" label="Official Email"
                    placeholder="contact@org.org"
                    value={formData.email} onChange={handleChange} required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      id="orgType" name="orgType" label="Organization Type"
                      placeholder="e.g. Non-profit"
                      value={formData.orgType} onChange={handleChange} required
                    />
                    <FormInput
                      id="regNumber" name="regNumber" label="Registration No."
                      placeholder="Reg-123456"
                      value={formData.regNumber} onChange={handleChange} required
                    />
                  </div>
                  <SubmitButton className="w-full h-11 text-base font-medium mt-4">
                    Continue to Contact Info
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
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Contact Person</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormInput
                    id="contactPerson" name="contactPerson" label="Full Name"
                    placeholder="John Doe"
                    value={formData.contactPerson} onChange={handleChange} required
                  />
                  <FormInput
                    id="phone" name="phone" label="Phone Number"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone} onChange={handleChange} required
                  />
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 h-11 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <SubmitButton loading={loading} className="flex-[2] h-11 text-base font-medium">
                      Complete Registration
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
                className="text-center py-10 space-y-6"
              >
                <div className="flex justify-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="p-4 bg-primary/20 rounded-full"
                  >
                    <CheckCircle2 className="w-16 h-16 text-primary" />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Application Received!</h2>
                  <p className="text-muted-foreground">
                    Thank you for joining Zinova. Our team will verify your NGO details and get back to you within 24-48 hours.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-primary/20 transition-all"
                >
                  Return to Homepage
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </FormCard>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login/ngo" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default NgoSignup;
