import { TESTIMONIALS } from "@/lib/config";
import { Quote } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="bg-background px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Community Voices
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from those who are making a difference with Zinova
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <div 
              key={index} 
              className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <div className="flex items-start mb-4">
                <Quote className="h-6 w-6 text-accent flex-shrink-0 mr-2" />
                <p className="text-sm italic leading-relaxed text-muted-foreground">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="flex items-center mt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <span className="font-bold text-primary">{testimonial.avatar}</span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;