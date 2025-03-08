
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';

interface BreachSequenceProps {
  onComplete: () => void;
}

export const BreachSequence: React.FC<BreachSequenceProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);

  useEffect(() => {
    // Show initial glitch effect
    setShowGlitch(true);
    setTimeout(() => setShowGlitch(false), 300);
    
    // Quick progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 100); // Update every 100ms to reach 100% in ~1 second
    
    // Complete after 2 seconds total
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      onComplete();
    }, 2000);
    
    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* Glitch overlay */}
      <AnimatePresence>
        {showGlitch && (
          <motion.div 
            className="absolute inset-0 bg-toxic-neon/10 mix-blend-screen z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </AnimatePresence>
      
      {/* Scan lines */}
      <div className="scanline absolute inset-0 pointer-events-none"></div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-xl w-full mx-4">
        <motion.div 
          className="bg-black/80 border border-toxic-neon/30 p-6 rounded-lg relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Progress bar */}
          <div className="h-2 w-full bg-white/10 mb-4 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-toxic-neon"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-toxic-neon/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-toxic-neon animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-xl text-center font-mono text-toxic-neon mb-1">
            ACCESSING RESISTANCE NETWORK
          </h2>
          
          <div className="text-center font-mono text-sm text-toxic-neon/70">
            <span className="inline-block mr-1 text-apocalypse-red">&gt;</span> 
            AUTHENTICATION SUCCESSFUL
          </div>
        </motion.div>
      </div>
    </div>
  );
};
