// Application configuration and constants
export const APP_CONFIG = {
  TITLE: "Zinova - Empowering Sustainability Through Technology",
  DESCRIPTION: "Zinova tackles food waste and hunger using AI, blockchain, and data-driven insights to connect farmers, restaurants, and NGOs in real time.",
  THEME: {
    PRIMARY: "green",
    SECONDARY: "blue",
    ACCENT: "emerald"
  },
  SOCIAL: {
    TWITTER: "@zinova",
    LINKEDIN: "zinova-platform"
  }
};

// Navigation items
export const NAVIGATION_ITEMS = [
  { name: "About", href: "#about" },
  { name: "Features", href: "#features" },
  { name: "Contact", href: "#contact" }
];

// Feature items
export const FEATURES = [
  {
    icon: "Brain",
    title: "AI Matching",
    description: "Smart algorithms connect surplus food with communities in need instantly and efficiently."
  },
  {
    icon: "Shield",
    title: "Blockchain Transparency",
    description: "Complete traceability and trust through immutable records of every transaction."
  },
  {
    icon: "Truck",
    title: "Smart Logistics",
    description: "Optimized logistics and routing to ensure fast, efficient food distribution."
  },
  {
    icon: "BarChart3",
    title: "Impact Analytics",
    description: "Real-time analytics and insights to measure impact and optimize operations."
  },
  {
    icon: "Wheat",
    title: "Food Waste Tracking",
    description: "Track and measure food waste reduction across the entire supply chain."
  },
  {
    icon: "Users",
    title: "Community Network",
    description: "Connect with a growing network of farmers, restaurants, and NGOs."
  },
  {
    icon: "Package",
    title: "Quality Assurance",
    description: "Ensure food safety and quality throughout the redistribution process."
  },
  {
    icon: "Map",
    title: "Real-time Tracking",
    description: "Live tracking of food donations from source to recipient."
  }
];

// Impact statistics
export const IMPACT_STATS = [
  { 
    value: 50000, 
    label: "Meals Saved",
    icon: "Heart",
    suffix: "+"
  },
  { 
    value: 25, 
    label: "Partner Organizations",
    icon: "Building",
    suffix: "+"
  },
  { 
    value: 15, 
    label: "Cities Covered",
    icon: "MapPin",
    suffix: ""
  },
  { 
    value: 100, 
    label: "Food Redistributed",
    icon: "Package",
    suffix: "T"
  }
];

// Testimonials
export const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Restaurant Owner",
    content: "Zinova helped us reduce food waste by 60% while making a positive impact in our community. Their platform is incredibly easy to use!",
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    role: "NGO Director",
    content: "The real-time tracking and transparency features have transformed how we distribute food to those in need. Truly innovative!",
    avatar: "MC"
  },
  {
    name: "Emma Rodriguez",
    role: "Local Farmer",
    content: "I love knowing that my surplus produce goes to good use instead of the landfill. Zinova connects me with organizations that care.",
    avatar: "ER"
  }
];

// Value propositions
export const VALUE_PROPOSITIONS = [
  {
    icon: "Leaf",
    title: "Sustainability First",
    description: "We're committed to creating a world with zero food waste through innovative technology solutions."
  },
  {
    icon: "Zap",
    title: "Real-time Impact",
    description: "See the immediate difference your contributions make with our live tracking and analytics."
  },
  {
    icon: "Shield",
    title: "Complete Transparency",
    description: "Blockchain technology ensures every transaction is traceable, secure, and trustworthy."
  },
  {
    icon: "Heart",
    title: "Community Focused",
    description: "Building connections between food providers and communities in need for lasting change."
  }
];

// Food flow steps
export const FOOD_FLOW_STEPS = [
  { icon: "Wheat", label: "Farm", color: "text-green-500" },
  { icon: "Apple", label: "Restaurant", color: "text-red-500" },
  { icon: "Truck", label: "Transport", color: "text-blue-500" },
  { icon: "Users", label: "Community", color: "text-purple-500" },
  { icon: "Heart", label: "Impact", color: "text-pink-500" }
];