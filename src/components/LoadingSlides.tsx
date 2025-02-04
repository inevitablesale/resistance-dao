import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Vote, Shield, Award, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSlide {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const slides: LoadingSlide[] = [
  {
    icon: <Shield className="w-12 h-12 text-polygon-primary" />,
    title: "Analyzing Professional Experience",
    description: "Evaluating your LinkedIn profile to determine governance power."
  },
  {
    icon: <Award className="w-12 h-12 text-polygon-primary" />,
    title: "Calculating Governance Power",
    description: "Your experience translates to voting weight in the DAO. Receive +1 PCRED"
  },
  {
    icon: <Coins className="w-12 h-12 text-polygon-primary" />,
    title: "LGR Token Utility",
    description: "Access professional network features and participate in firm operations."
  },
  {
    icon: <Wallet className="w-12 h-12 text-polygon-primary" />,
    title: "Support the Project",
    description: "Purchase LGR tokens (limited supply) to support the project's growth."
  },
  {
    icon: <Vote className="w-12 h-12 text-polygon-primary" />,
    title: "Governance Participation",
    description: "Vote on operational decisions and shape the future of accounting."
  }
];

export const LoadingSlides = ({ isAnalyzing }: { isAnalyzing: boolean }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  return (
    <div className="w-full py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {slides[currentSlide].icon}
          </motion.div>
          <h3 className="text-xl font-semibold text-white">
            {slides[currentSlide].title}
          </h3>
          <p className="text-gray-400 text-center max-w-md">
            {slides[currentSlide].description}
          </p>
          <div className="flex space-x-2 mt-4">
            {slides.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-300",
                  currentSlide === index ? "bg-polygon-primary" : "bg-gray-600"
                )}
              />
            ))}
          </div>
          {currentSlide === 3 && (
            <p className="text-sm text-polygon-primary mt-2">
              Transaction fees sponsored by Ledger Fund
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoadingSlides;