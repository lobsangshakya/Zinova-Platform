import { motion } from "framer-motion";

interface PortalBackgroundProps {
  variant?: "primary" | "accent";
}

const PortalBackground = ({ variant = "primary" }: PortalBackgroundProps) => {
  const isPrimary = variant === "primary";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Mesh Gradient Base */}
      <div className={`absolute inset-0 opacity-40 mesh-gradient ${isPrimary ? "opacity-50" : "opacity-30"}`} />
      
      {/* Animated Blobs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className={`absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] ${
          isPrimary ? "bg-primary/20" : "bg-accent/20"
        }`}
      />
      
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className={`absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[120px] ${
          isPrimary ? "bg-primary/10" : "bg-accent/30"
        }`}
      />

      {/* Floating Shapes */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0 
            }}
            animate={{ 
              y: [null, "-20px", "20px"],
              opacity: [0, 0.2, 0],
              rotate: [0, 45, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
            }}
            className={`absolute w-32 h-32 border border-white/5 rounded-3xl backdrop-blur-[2px]`}
            style={{ 
              transform: `rotate(${i * 15}deg)`,
            }}
          />
        ))}
      </div>

      {/* Noise Texture Overaly */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default PortalBackground;
