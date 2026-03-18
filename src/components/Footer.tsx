import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-primary-foreground/10 bg-primary px-4 py-8 text-primary-foreground sm:px-6">
      <div className="mx-auto max-w-6xl space-y-2 text-center">
        <div className="flex justify-center">
          <Leaf className="h-6 w-6 text-accent" />
        </div>
        <p className="text-sm text-primary-foreground/80">
          (c) {new Date().getFullYear()} Zinova - Building a sustainable future
        </p>
        <p className="text-xs text-primary-foreground/60">
          Together, we can end food waste and hunger.
        </p>
      </div>
    </footer>
  );
};

export default Footer;