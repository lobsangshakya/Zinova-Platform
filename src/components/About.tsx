import { Leaf, Zap, Heart } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="bg-card px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            How Zinova Works
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
        </div>
        
        <div className="prose prose-lg mx-auto text-muted-foreground leading-relaxed space-y-4">
          <p className="text-center max-w-3xl mx-auto">
            Zinova is an innovative platform that tackles food waste and hunger using cutting-edge technology. 
            We create a seamless connection between those with surplus food and communities in need.
          </p>
          
          <p className="text-center max-w-3xl mx-auto">
            By leveraging AI-driven matching algorithms, blockchain transparency, and real-time logistics optimization, 
            we ensure that no edible food goes to waste while helping feed those who need it most.
          </p>
        </div>
        
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-background p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Identify</h3>
            <p className="text-muted-foreground text-sm">
              We identify surplus food from restaurants, farms, and grocery stores
            </p>
          </div>
          
          <div className="rounded-xl border border-border bg-background p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Match</h3>
            <p className="text-muted-foreground text-sm">
              Our AI matches surplus food with communities in need instantly
            </p>
          </div>
          
          <div className="rounded-xl border border-border bg-background p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Deliver</h3>
            <p className="text-muted-foreground text-sm">
              Optimized logistics ensure fresh food reaches those who need it
            </p>
          </div>
        </div>
        
        <div className="flex justify-center pt-4">
          <Leaf className="h-12 w-12 text-green-500" />
        </div>
      </div>
    </section>
  );
};

export default About;