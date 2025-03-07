
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

const emergencyMessages = [
  "SETTLEMENT #12 UNDER ATTACK - BOUNTY HUNTERS REQUESTED",
  "RADIATED ZONE DETECTED NEAR SECTOR 7 - TRAVEL NOT ADVISED",
  "EMERGENCY SUPPLIES NEEDED IN EASTERN QUADRANT",
  "POTENTIAL SYSTEM BREACH DETECTED - SECURITY PROTOCOLS INITIATED",
  "UNIDENTIFIED SIGNALS DETECTED FROM PRE-COLLAPSE SATELLITE",
  "RESISTANCE MEETING SCHEDULED - 22:00 HOURS - ENCRYPTED CHANNEL"
];

export function EmergencyTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);
  
  // Auto-rotate messages
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % emergencyMessages.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isPaused]);
  
  const handleTickerClick = () => {
    setIsPaused(true);
  };
  
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused(false);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
      className="mb-6"
      onClick={handleTickerClick}
    >
      <div 
        ref={tickerRef}
        className={`
          p-2 bg-apocalypse-red/20 border border-apocalypse-red 
          text-white font-mono text-sm overflow-hidden relative cursor-pointer
          ${isPaused ? 'hover:bg-apocalypse-red/30' : ''}
        `}
      >
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-apocalypse-red mr-2 animate-pulse" />
          
          <div className="overflow-hidden flex-1">
            <motion.div
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="whitespace-nowrap"
            >
              {emergencyMessages[currentIndex]}
            </motion.div>
          </div>
          
          {isPaused && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-apocalypse-red hover:bg-apocalypse-red/30 ml-2"
              onClick={handleCloseClick}
            >
              DISMISS
            </Button>
          )}
        </div>
        
        {isPaused && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 text-white/80 text-xs border-t border-apocalypse-red/30 pt-2"
          >
            <p>
              Emergency broadcast from RESISTANCE™ Network command. 
              This message requires immediate attention from all network members.
              Authenticate with terminal to respond.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
