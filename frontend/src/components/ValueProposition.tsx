import { VALUE_PROPOSITIONS } from "@/lib/config";
import { Leaf, Zap, Shield, Heart } from "lucide-react";

// Map icon names to actual components
const iconMap: Record<string, React.ComponentType<{className?: string}>> = {
  Leaf,
  Zap,
  Shield,
  Heart
};

const ValueProposition = () => {
  return (
    <section className="bg-gradient-to-br from-primary/5 to-accent/5 px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Why Choose Zinova?
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our unique approach combines technology, sustainability, and community impact
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPOSITIONS.map((value, index) => {
            const IconComponent = iconMap[value.icon];
            return (
              <div 
                key={index} 
                className="rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  {IconComponent && <IconComponent className="h-8 w-8 text-primary" />}
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">{value.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;