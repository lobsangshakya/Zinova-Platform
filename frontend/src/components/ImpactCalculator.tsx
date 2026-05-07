import { useState, useEffect } from "react";
import { Leaf, Users, Heart, Package, TrendingUp } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import { logUserAction, logError } from "@/lib/logger";

const ImpactCalculator = () => {
  const [foodWaste, setFoodWaste] = useState(100); // kg per week
  const [timePeriod, setTimePeriod] = useState(12); // months
  const [debouncedFoodWaste, setDebouncedFoodWaste] = useState(foodWaste);
  const [debouncedTimePeriod, setDebouncedTimePeriod] = useState(timePeriod);
  
  const [impactData, setImpactData] = useState({
    mealsSaved: 0,
    co2Saved: 0,
    waterSaved: 0,
    peopleFed: 0
  });

  const scrollToContactSection = () => {
    const contactSection = document.getElementById("contact");

    if (!contactSection) {
      return;
    }

    contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Debounce the input values
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFoodWaste(foodWaste);
      setDebouncedTimePeriod(timePeriod);
      
      // Log the change only after debouncing
      try {
        logUserAction(
          "CALCULATOR_SET",
          { foodWaste, timePeriod },
          "ImpactCalculator"
        );
      } catch (error) {
        // Silently fail logging
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [foodWaste, timePeriod]);

  // Calculate impact based on DEBOUNCED values
  useEffect(() => {
    // Conversion factors (simplified for demonstration)
    const mealsPerKg = 2.5; 
    const co2PerKg = 2.3; 
    const waterPerKg = 1500; 
    const peoplePerMeal = 0.3; 
    
    const weeks = debouncedTimePeriod * 4.33; 
    const totalFoodWastePrevented = debouncedFoodWaste * weeks;
    
    setImpactData({
      mealsSaved: Math.round(totalFoodWastePrevented * mealsPerKg),
      co2Saved: Math.round(totalFoodWastePrevented * co2PerKg),
      waterSaved: Math.round(totalFoodWastePrevented * waterPerKg),
      peopleFed: Math.round(totalFoodWastePrevented * mealsPerKg * peoplePerMeal)
    });
  }, [debouncedFoodWaste, debouncedTimePeriod]);

  const impactItems = [
    {
      icon: Package,
      title: "Meals Saved",
      value: impactData.mealsSaved,
      suffix: "+",
      color: "text-green-500",
      description: "nutritious meals redirected to communities in need"
    },
    {
      icon: Leaf,
      title: "CO2 Saved",
      value: impactData.co2Saved,
      suffix: "kg",
      color: "text-blue-500",
      description: "greenhouse gases prevented from entering the atmosphere"
    },
    {
      icon: TrendingUp,
      title: "Water Saved",
      value: impactData.waterSaved,
      suffix: "L",
      color: "text-cyan-500",
      description: "liters of water preserved through waste prevention"
    },
    {
      icon: Users,
      title: "People Fed",
      value: impactData.peopleFed,
      suffix: "+",
      color: "text-purple-500",
      description: "individuals receiving nutritious meals monthly"
    }
  ];

  return (
    <section id="impact-calculator" className="bg-gradient-to-br from-primary/10 to-accent/10 px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Calculate Your Impact
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how much difference you can make by reducing food waste with Zinova
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Calculator Controls */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-xl shadow-primary/5 dark:bg-[var(--card-bg)] lg:col-span-1">
            <h3 className="mb-8 text-2xl font-black tracking-tighter text-foreground">Personalize Your Impact</h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Food Waste / Week
                  </label>
                  <span className="text-2xl font-black text-primary">
                    {foodWaste} <span className="text-sm font-medium text-muted-foreground uppercase">kg</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="5"
                  value={foodWaste}
                  onChange={(e) => setFoodWaste(Number(e.target.value))}
                  className="premium-slider"
                />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tighter">
                  <span>Minimal</span>
                  <span>High Impact (500kg)</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Time Horizon
                  </label>
                  <span className="text-2xl font-black text-primary">
                    {timePeriod} <span className="text-sm font-medium text-muted-foreground uppercase">mo</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="premium-slider"
                />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tighter">
                  <span>Short Term</span>
                  <span>Long Term (2 Years)</span>
                </div>
              </div>
              
              <div className="pt-6">
                <div className="rounded-2xl bg-primary/5 p-5 border border-primary/10 backdrop-blur-sm">
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    By partnering with Zinova, you'll prevent approximately 
                    <span className="text-foreground font-black mx-1">
                      {Math.round(foodWaste * timePeriod * 4.33).toLocaleString()}kg
                    </span> 
                    of food from reaching landfills over this period.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Impact Results */}
          <div className="lg:col-span-2">
            <div className="grid gap-6 sm:grid-cols-2">
              {impactItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index} 
                    className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-[var(--border-color)] dark:bg-[var(--card-bg)]"
                  >
                    <div className="flex items-start mb-4">
                      <div className={`mr-4 rounded-lg p-3 ${item.color}/10 dark:bg-[var(--bg-secondary)]`}>
                        <Icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{item.title}</h3>
                        <div className="flex items-baseline mt-2">
                          <AnimatedCounter 
                            target={item.value} 
                            suffix={item.suffix} 
                            duration={1500} 
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white shadow-sm dark:from-[var(--bg-secondary)] dark:to-[var(--bg-primary)] dark:text-[var(--text-primary)]">
              <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold">Ready to Make a Difference?</h3>
                    <p className="mt-1 opacity-90">
                      Join thousands of organizations using Zinova to fight food waste
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      logUserAction(
                        "CTA_CLICK",
                        { label: "Get Started Today" },
                        "ImpactCalculator"
                      );
                    } catch {
                      // Logging should never block CTA behavior.
                    }

                    scrollToContactSection();
                  }}
                  className="whitespace-nowrap rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-gray-100 dark:border dark:border-[var(--border-color)] dark:bg-[var(--card-bg)] dark:text-[var(--text-primary)] dark:hover:bg-[var(--bg-secondary)] md:ml-auto"
                >
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactCalculator;