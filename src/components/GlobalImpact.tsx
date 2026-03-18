import { useState, useEffect } from "react";
import { Globe, TrendingUp, Users, Leaf } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

const GlobalImpact = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Key global statistics
  const globalStats = [
    {
      icon: Leaf,
      title: "Food Waste",
      value: 1300000000, // 1.3 billion tons
      suffix: "",
      description: "wasted annually"
    },
    {
      icon: Users,
      title: "People Affected",
      value: 673000000, // 673 million people
      suffix: "",
      description: "globally"
    },
    {
      icon: TrendingUp,
      title: "CO₂ Emissions",
      value: 3300000000, // 3.3 billion tons
      suffix: "",
      description: "from food waste"
    },
    {
      icon: Globe,
      title: "Water Wasted",
      value: 250000000000, // 250 billion cubic meters
      suffix: "",
      description: "used in food production"
    }
  ];

  const formatShortScale = (value: number) => {
    if (value >= 1000000000) {
      const billions = value / 1000000000;
      const precision = Number.isInteger(billions) ? 0 : 1;
      return `${billions.toFixed(precision)}B`;
    }

    if (value >= 1000000) {
      const millions = value / 1000000;
      const precision = Number.isInteger(millions) ? 0 : 1;
      return `${millions.toFixed(precision)}M`;
    }

    return value.toLocaleString();
  };

  const getUnit = (title: string) => {
    if (title === "Food Waste") return " tons";
    if (title === "People Affected") return " people";
    if (title === "CO₂ Emissions") return " tons";
    if (title === "Water Wasted") return " m³";
    return "";
  };

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-gradient-to-br from-background to-secondary px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            The Global Challenge
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Understanding the scale helps us appreciate the impact of solutions like Zinova
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {globalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className={`
                  rounded-xl border border-border bg-card p-4 shadow-sm
                  transition-all duration-700 ease-out
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 mr-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{stat.title}</h3>
                </div>
                
                <div className="mb-2">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={getUnit(stat.title)}
                    duration={2000}
                    formatValue={formatShortScale}
                    className="text-2xl font-bold text-primary md:text-3xl"
                  />
                </div>
                
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GlobalImpact;