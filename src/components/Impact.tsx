import { IMPACT_STATS } from "@/lib/config";
import { Heart, Building, MapPin, Package } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

// Map icon names to actual components
const iconMap: Record<string, React.ComponentType<{className?: string}>> = {
  Heart,
  Building,
  MapPin,
  Package
};

const Impact = () => {
  return (
    <section className="bg-primary px-4 py-20 text-primary-foreground sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold md:text-4xl">
            Our Impact
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Making a real difference in communities across the region.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {IMPACT_STATS.map((stat, index) => {
            const IconComponent = iconMap[stat.icon];
            return (
              <div 
                key={index} 
                className="text-center space-y-2 animate-fade-in bg-primary-foreground/10 p-6 rounded-xl backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center">
                  {IconComponent && <IconComponent className="h-8 w-8 text-accent" />}
                </div>
                <div>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm md:text-base text-primary-foreground/90">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Impact;