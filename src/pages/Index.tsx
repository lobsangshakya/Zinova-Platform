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

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <About />
        <FoodFlow />
        <ValueProposition />
        <div id="features">
          <Features />
        </div>
        <ImpactCalculator />
        <GlobalImpact />
        <CallToAction />
        <div id="contact">
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;