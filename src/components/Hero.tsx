import { Leaf, Sprout, Apple, ArrowRight } from "lucide-react";
import AnimatedButton from "@/components/ui/animated-button";

const Hero = () => {
  const scrollToCalculator = () => {
    document.getElementById("impact-calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4 py-20 sm:px-6 lg:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background opacity-60" />
      
      <div className="relative z-10 mx-auto max-w-4xl animate-fade-in space-y-8 text-center">
        <div className="flex items-center justify-center gap-4">
          <Leaf className="h-8 w-8 text-green-500" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-7xl">
            Zinova
          </h1>
          <Sprout className="h-8 w-8 text-green-500" />
        </div>
        
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl md:text-2xl">
          Empowering sustainability through technology.
        </p>
        
        <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Connecting farmers, restaurants, and NGOs to fight food waste and hunger with AI-powered solutions.
        </p>
        
        <div className="flex items-center justify-center gap-4 pt-4 sm:flex-row">
          <AnimatedButton 
            size="lg" 
            onClick={scrollToCalculator}
            className="group w-full sm:w-auto"
            variant="hero"
            animationType="lift"
          >
            Calculate Your Impact
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </AnimatedButton>
          <div className="hidden sm:block">
            <Apple className="h-6 w-6 text-red-500" />
          </div>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Join 25+ organizations already making a difference</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;