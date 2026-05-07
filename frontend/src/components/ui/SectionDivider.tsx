import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionDividerProps {
  variant?: "wave" | "curve" | "slant";
  color?: string;
  position?: "top" | "bottom";
  className?: string;
  flip?: boolean;
}

const SectionDivider = ({ 
  variant = "curve", 
  color = "fill-background", 
  position = "bottom",
  className,
  flip = false
}: SectionDividerProps) => {
  const isTop = position === "top";

  const getPath = () => {
    switch (variant) {
      case "wave":
        return "M0,64 C150,120 350,0 500,64 C650,128 850,20 1000,64 L1000,128 L0,128 Z";
      case "slant":
        return "M0,128 L1000,0 L1000,128 L0,128 Z";
      default: // curve
        return "M0,128 C300,0 700,0 1000,128 L1000,128 L0,128 Z";
    }
  };

  return (
    <div 
      className={cn(
        "absolute left-0 w-full overflow-hidden leading-[0] pointer-events-none z-10",
        isTop ? "top-0 rotate-180" : "bottom-0",
        flip && "scale-x-[-1]",
        className
      )}
    >
      <svg
        viewBox="0 0 1000 128"
        preserveAspectRatio="none"
        className={cn("relative block w-[calc(100%+1.3px)] h-[80px]", color)}
      >
        <motion.path 
          initial={{ d: getPath() }}
          animate={variant === "wave" ? {
            d: [
              "M0,64 C150,120 350,0 500,64 C650,128 850,20 1000,64 L1000,128 L0,128 Z",
              "M0,64 C150,20 350,128 500,64 C650,0 850,120 1000,64 L1000,128 L0,128 Z",
              "M0,64 C150,120 350,0 500,64 C650,128 850,20 1000,64 L1000,128 L0,128 Z"
            ]
          } : {}}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          d={getPath()}
        />
      </svg>
    </div>
  );
};

export default SectionDivider;
