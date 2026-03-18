import { NAVIGATION_ITEMS } from "@/lib/config";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";

const Navbar = () => {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <img 
            src="/Zinova_logo.PNG" 
            alt="Zinova" 
            className="h-12 w-12 object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-foreground">Zinova</span>
        </div>
        
        <div className="hidden items-center gap-8 md:flex">
          {NAVIGATION_ITEMS.map((item, index) => (
            <a 
              key={index} 
              href={item.href} 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </a>
          ))}
          <ThemeToggle />
        </div>
        
        <MobileMenu />
      </div>
    </nav>
  );
};

export default Navbar;