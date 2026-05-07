import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NAVIGATION_ITEMS } from "@/lib/config";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";
import logo from "/Zinova_logo.png";
import { logUserAction, logError } from "@/lib/logger";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Heart, Utensils, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";


const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    try {
      logUserAction(
        "NAV_CLICK",
        { target: href.replace("#", "") || "home" },
        "Navbar"
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      try {
        logError("LOGGING_ERROR", { source: "NAV_CLICK", error: errorMessage }, "Navbar");
      } catch {
        // Logging should never break navbar navigation.
      }
    }
  };

  const handleNavigation = (href: string) => {
    handleNavClick(href);

    if (href.startsWith("/")) {
      navigate(href);
    } else {
      const targetId = href.replace("#", "");
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={cn(
      "fixed left-0 right-0 top-0 z-50 transition-all duration-500 flex justify-center px-4",
      isScrolled ? "top-4" : "top-0"
    )}>
      <div className={cn(
        "flex w-full items-center justify-between px-6 transition-all duration-500",
        isScrolled 
          ? "max-w-6xl rounded-full border border-primary/20 bg-background/70 backdrop-blur-xl py-3 shadow-xl shadow-primary/5 ring-1 ring-primary/5" 
          : "max-w-7xl bg-transparent py-6"
      )}
      style={{
        backgroundColor: isScrolled ? 'hsl(var(--background) / 0.7)' : 'transparent'
      }}
      >
        {/* Subtle Green Tint Overlay (only when scrolled) */}
        {isScrolled && (
          <div className="absolute inset-0 rounded-full bg-primary/[0.03] pointer-events-none -z-10" />
        )}
        
        {/* Logo */}
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate("/")}>
          <div className="relative">
            <img 
              src={logo} 
              alt="Zinova" 
              className="h-10 w-10 object-contain transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground">Zinova</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6">
            {NAVIGATION_ITEMS.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.href)}
                className="text-sm font-semibold text-muted-foreground transition-all hover:text-foreground hover:translate-y-[-1px]"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-border/50" />

          <div className="flex items-center gap-3">
            {/* Login Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-semibold text-foreground border border-border/50 px-4 py-2 rounded-full hover:bg-secondary/80 backdrop-blur-sm transition-all outline-none active:scale-95">
                <LogIn className="w-4 h-4" />
                Login
                <ChevronDown className="w-4 h-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl backdrop-blur-xl border-border/50 shadow-2xl">
                <DropdownMenuItem 
                  onClick={() => {
                    handleNavClick("/login/ngo");
                    navigate("/login/ngo");
                  }}
                  className="flex items-center gap-3 cursor-pointer p-4 rounded-xl focus:bg-primary/10 transition-colors"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-semibold">NGO Portal</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    handleNavClick("/login/kitchen");
                    navigate("/login/kitchen");
                  }}
                  className="flex items-center gap-3 cursor-pointer p-4 rounded-xl focus:bg-accent/10 transition-colors"
                >
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Utensils className="w-4 h-4 text-accent" />
                  </div>
                  <span className="font-semibold">Restaurant Portal</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Signup Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-bold text-primary-foreground bg-primary px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 outline-none active:scale-95">
                <UserPlus className="w-4 h-4" />
                Join Zinova
                <ChevronDown className="w-4 h-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl backdrop-blur-xl border-border/50 shadow-2xl">
                <DropdownMenuItem 
                  onClick={() => {
                    handleNavClick("/signup/ngo");
                    navigate("/signup/ngo");
                  }}
                  className="flex items-center gap-3 cursor-pointer p-4 rounded-xl focus:bg-primary/10 transition-colors"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">NGO</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Registration</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    handleNavClick("/signup/kitchen");
                    navigate("/signup/kitchen");
                  }}
                  className="flex items-center gap-3 cursor-pointer p-4 rounded-xl focus:bg-accent/10 transition-colors"
                >
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Utensils className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">Restaurant</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Partnership</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="h-6 w-[1px] bg-border/50" />

          <ThemeToggle />
        </div>

        <MobileMenu />
      </div>
    </nav>
  );
};

export default Navbar;