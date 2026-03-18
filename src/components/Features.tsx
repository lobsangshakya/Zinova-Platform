import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FEATURES } from "@/lib/config";
import { 
  Brain, 
  Shield, 
  Map, 
  BarChart3, 
  Wheat, 
  Package, 
  Truck, 
  Users 
} from "lucide-react";

// Map icon names to actual components
const iconMap: Record<string, React.ComponentType<{className?: string}>> = {
  Brain,
  Shield,
  Map,
  BarChart3,
  Wheat,
  Package,
  Truck,
  Users
};

const Features = () => {
  return (
    <section className="bg-background px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Powered by Innovation
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Advanced technology working together to create sustainable impact.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <Card 
                key={index} 
                className="group h-full border-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                    {IconComponent && <IconComponent className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />}
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              All data secured with blockchain technology
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;