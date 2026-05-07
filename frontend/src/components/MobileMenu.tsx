import { useState } from "react";
import { Menu, X, Leaf, Heart, Utensils, UserPlus } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/lib/config";
import ThemeToggle from "@/components/ThemeToggle";
import AnimatedButton from "@/components/ui/animated-button";


const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <AnimatedButton
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        className="rounded-full"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </AnimatedButton>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg z-50">
          <div className="px-6 py-4 space-y-6">
            <div className="space-y-4">
              {NAVIGATION_ITEMS.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
            
            <div className="pt-4 border-t border-border space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Portals</p>
                <div className="grid grid-cols-1 gap-3">
                  <a 
                    href="/login/ngo" 
                    className="flex items-center gap-3 py-2 text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm">NGO Portal</span>
                  </a>
                  <a 
                    href="/login/kitchen" 
                    className="flex items-center gap-3 py-2 text-foreground hover:text-accent transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Utensils className="h-4 w-4 text-accent" />
                    </div>
                    <span className="font-medium text-sm">Restaurant Portal</span>
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Join Us</p>
                <div className="grid grid-cols-1 gap-3">
                  <a 
                    href="/signup/ngo" 
                    className="flex items-center gap-3 py-3 px-4 bg-primary/5 rounded-xl text-primary hover:bg-primary/10 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Heart className="h-4 w-4" />
                    <span className="font-semibold text-sm">NGO Registration</span>
                  </a>
                  <a 
                    href="/signup/kitchen" 
                    className="flex items-center gap-3 py-3 px-4 bg-accent/5 rounded-xl text-accent hover:bg-accent/10 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Utensils className="h-4 w-4" />
                    <span className="font-semibold text-sm">Restaurant Partnership</span>
                  </a>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Zinova</span>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;