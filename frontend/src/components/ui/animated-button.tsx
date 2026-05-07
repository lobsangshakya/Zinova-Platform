import { Button, ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

export interface AnimatedButtonProps extends ButtonProps {
  animateOnHover?: boolean;
  animationType?: "scale" | "lift" | "pulse";
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    animateOnHover = true, 
    animationType = "scale",
    className,
    ...props 
  }, ref) => {
    const getAnimationClasses = () => {
      if (!animateOnHover) return "";
      
      switch (animationType) {
        case "lift":
          return "hover:-translate-y-1 transition-transform duration-200";
        case "pulse":
          return "hover:scale-105 active:scale-95 transition-transform duration-200";
        default: // scale
          return "hover:scale-105 active:scale-95 transition-transform duration-200";
      }
    };

    return (
      <Button 
        ref={ref}
        className={`${getAnimationClasses()} ${className}`}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export default AnimatedButton;