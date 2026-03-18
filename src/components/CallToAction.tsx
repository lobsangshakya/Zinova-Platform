import { useState } from "react";
import { Leaf, Zap, Heart, Users } from "lucide-react";
import AnimatedButton from "@/components/ui/animated-button";

const CallToAction = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would connect to your backend
      console.log("Email submitted:", email);
      setIsSubmitted(true);
      setEmail("");
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };

  const benefits = [
    {
      icon: Leaf,
      title: "Reduce Waste",
      description: "Cut food waste by up to 70% with our smart platform"
    },
    {
      icon: Heart,
      title: "Feed Communities",
      description: "Directly impact families in need with surplus food"
    },
    {
      icon: Zap,
      title: "Save Resources",
      description: "Preserve water, energy, and reduce carbon emissions"
    },
    {
      icon: Users,
      title: "Join Movement",
      description: "Connect with a network of like-minded organizations"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-primary to-primary/90 px-4 py-20 text-primary-foreground sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Column - Benefits */}
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
                    <div className="rounded-lg bg-primary-foreground/10 p-2">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-foreground">{benefit.title}</h3>
                      <p className="text-sm text-primary-foreground/80 mt-1">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <AnimatedButton 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
                animationType="lift"
              >
                Schedule Demo
              </AnimatedButton>
              <AnimatedButton 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                animationType="lift"
              >
                View Case Studies
              </AnimatedButton>
            </div>
          </div>
          
          {/* Right Column - Email Signup */}
          <div className="rounded-2xl border border-primary-foreground/20 bg-card/10 p-8 backdrop-blur-sm">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-primary-foreground mb-2">
                Ready to Get Started?
              </h3>
              <p className="text-primary-foreground/80">
                Join thousands of organizations fighting food waste
              </p>
            </div>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <Heart className="h-8 w-8 text-green-400" />
                </div>
                <h4 className="text-xl font-bold text-primary-foreground mb-2">
                  Thank You!
                </h4>
                <p className="text-primary-foreground/80">
                  We've received your information and will contact you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-primary-foreground/80">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-primary-foreground/20 bg-white/10 px-4 py-3 text-white placeholder-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-primary-foreground/80">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-lg border border-primary-foreground/20 bg-white/10 px-4 py-3 text-white placeholder-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div>
                  <label htmlFor="organization" className="mb-2 block text-sm font-medium text-primary-foreground/80">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    placeholder="Restaurant, NGO, Farm, etc."
                    className="w-full rounded-lg border border-primary-foreground/20 bg-white/10 px-4 py-3 text-white placeholder-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div className="pt-2">
                  <AnimatedButton 
                    type="submit"
                    size="lg" 
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    animationType="pulse"
                  >
                    Join the Movement
                  </AnimatedButton>
                </div>
                
                <p className="text-xs text-center text-primary-foreground/60 mt-4">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;