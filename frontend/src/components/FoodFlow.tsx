import { useState, useEffect } from "react";
import { FOOD_FLOW_STEPS } from "@/lib/config";
import { Apple, Wheat, Truck, Users, Heart } from "lucide-react";

// Map icon names to actual components
const iconMap: Record<string, React.ComponentType<{className?: string}>> = {
  Apple,
  Wheat,
  Truck,
  Users,
  Heart
};

const FoodFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = FOOD_FLOW_STEPS;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="bg-gradient-to-r from-green-50 to-blue-50 px-4 py-16 dark:from-[var(--bg-primary)] dark:to-[var(--bg-secondary)] sm:px-6 lg:py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          The Zinova Food Flow
        </h2>
        
        <div className="relative">
          {/* Flow line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 transform -translate-y-1/2 rounded-full"></div>
          
          {/* Flow steps */}
          <div className="relative flex justify-between gap-2 sm:gap-4">
            {steps.map((step, index) => {
              const IconComponent = iconMap[step.icon];
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              
              return (
                <div key={index} className="flex flex-col items-center z-10">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-500
                    ${isActive ? 'bg-white shadow-lg scale-110 ring-4 ring-accent dark:border dark:border-[var(--border-color)] dark:bg-[var(--card-bg)]' : ''}
                    ${isCompleted ? 'bg-white shadow-md dark:border dark:border-[var(--border-color)] dark:bg-[var(--card-bg)]' : 'bg-white/80 dark:border dark:border-[var(--border-color)] dark:bg-[var(--card-bg)]/80'}
                  `}>
                    {IconComponent && <IconComponent className={`w-8 h-8 ${step.color} ${isActive ? 'animate-pulse' : ''}`} />}
                  </div>
                  <span className={`
                    rounded-full px-2 py-1 text-center text-sm font-medium
                    ${isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}
                  `}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Watch how surplus food transforms from farm to table to community impact through our innovative platform
          </p>
        </div>
      </div>
    </section>
  );
};

export default FoodFlow;