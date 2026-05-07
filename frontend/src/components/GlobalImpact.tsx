import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, TrendingUp, Users, Leaf, ArrowUpRight } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

const GlobalImpact = () => {
  const globalStats = [
    {
      icon: Leaf,
      title: "Food Waste",
      value: 1050000000,
      unit: " tons",
      description: "wasted annually",
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      icon: Users,
      title: "People Affected",
      value: 733000000,
      unit: " people",
      description: "facing hunger",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: TrendingUp,
      title: "CO₂ Emissions",
      value: 3300000000,
      unit: " tons CO₂e",
      description: "from food waste",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      icon: Globe,
      title: "Water Wasted",
      value: 250000000000,
      unit: " m³",
      description: "in production",
      color: "text-cyan-500",
      bg: "bg-cyan-500/10"
    }
  ];

  const formatShortScale = (value: number) => {
    if (value >= 1000000000) {
      const billions = value / 1000000000;
      return `${billions.toFixed(1)}B`;
    }
    if (value >= 1000000) {
      const millions = value / 1000000;
      return `${millions.toFixed(1)}M`;
    }
    return value.toLocaleString();
  };

  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:py-32">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-secondary/20" />
      <div className="absolute inset-0 -z-10 mesh-gradient opacity-30" />
      
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 space-y-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold uppercase tracking-widest text-primary"
          >
            The Global Challenge
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl md:text-6xl"
          >
            Our Mission is <span className="text-glow text-primary italic">Urgent</span>
          </motion.p>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-24 h-1.5 bg-primary mx-auto rounded-full" 
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {globalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="group glass-card p-8 rounded-[2rem] relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-foreground tracking-tight">{stat.title}</h3>
                </div>
                
                <div className="mb-4">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.unit}
                    duration={2500}
                    formatValue={formatShortScale}
                    className="text-4xl font-black tracking-tighter text-primary block mb-1"
                  />
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.description}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 group-hover:bg-primary transition-colors" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GlobalImpact;