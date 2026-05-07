import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import FoodFlow from "@/components/FoodFlow";
import ValueProposition from "@/components/ValueProposition";
import ImpactCalculator from "@/components/ImpactCalculator";
import GlobalImpact from "@/components/GlobalImpact";
import CallToAction from "@/components/CallToAction";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/ui/SectionDivider";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className="relative">
          <Hero />
          <SectionDivider variant="wave" color="fill-secondary/20" />
        </div>

        {/* About Section */}
        <div className="relative bg-secondary/20 pt-20">
          <About />
          <SectionDivider variant="slant" color="fill-background" flip />
        </div>

        {/* Food Flow Section */}
        <div className="relative pt-20">
          <FoodFlow />
          <SectionDivider variant="curve" color="fill-secondary/10" />
        </div>

        {/* Value Proposition Section */}
        <div className="relative bg-secondary/10 pt-20">
          <ValueProposition />
          <SectionDivider variant="wave" color="fill-background" />
        </div>

        {/* Features Section */}
        <div id="features" className="relative pt-20">
          <Features />
          <SectionDivider variant="curve" color="fill-secondary/5" flip />
        </div>

        {/* Impact Calculator Section */}
        <div className="relative bg-secondary/5 pt-20">
          <ImpactCalculator />
          <SectionDivider variant="slant" color="fill-background" />
        </div>

        {/* Global Impact Section */}
        <div className="relative pt-20">
          <GlobalImpact />
          <SectionDivider variant="wave" color="fill-primary/5" />
        </div>

        {/* Call To Action Section */}
        <div className="relative bg-primary/5 pt-24 pb-40">
          <CallToAction />
        </div>

        {/* Contact Section - Curved Overlap */}
        <div id="contact" className="relative -mt-24 z-20">
          <div className="bg-background rounded-t-[60px] md:rounded-t-[100px] border-t border-border/50 shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.05)] pt-20">
            <Contact />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;