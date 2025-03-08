
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Skull, Radiation, Zap, Lock, FileWarning } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreachSequenceProps {
  onComplete: () => void;
  className?: string;
}

export function BreachSequence({ onComplete, className }: BreachSequenceProps) {
  const [stage, setStage] = useState(0);
  const [glitchText, setGlitchText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Breach sequence stages
  const stages = [
    { duration: 600, text: 'SECURITY BREACH DETECTED' },
    { duration: 500, text: 'INITIATING COUNTERMEASURES' },
    { duration: 400, text: 'FIREWALLS COMPROMISED' },
    { duration: 300, text: 'ATTEMPTING SYSTEM LOCKDOWN' },
    { duration: 200, text: 'LOCKDOWN FAILED' },
    { duration: 400, text: 'RESISTANCE PROTOCOLS ENGAGED' },
    { duration: 300, text: 'AUTHENTICATING IDENTITY' },
    { duration: 500, text: 'IDENTITY CONFIRMED' },
    { duration: 400, text: 'ESTABLISHING SECURE CONNECTION' },
    { duration: 600, text: 'ACCESS GRANTED' },
  ];
  
  const glitchCharacters = '!@#$%^&*()_+{}:"<>?|[];,./\\';
  
  // Generate glitch text effect
  useEffect(() => {
    if (stage < stages.length) {
      const targetText = stages[stage].text;
      let glitchInterval: NodeJS.Timeout;
      
      const startGlitching = () => {
        let counter = 0;
        glitchInterval = setInterval(() => {
          let glitched = '';
          
          for (let i = 0; i < targetText.length; i++) {
            // Gradually reveal the correct characters and add glitch effect
            if (i < counter / 3) {
              glitched += targetText[i];
            } else if (Math.random() > 0.5) {
              glitched += glitchCharacters[Math.floor(Math.random() * glitchCharacters.length)];
            } else {
              glitched += ' ';
            }
          }
          
          setGlitchText(glitched);
          counter++;
          
          // When glitch effect is complete, move to the next stage
          if (counter > targetText.length * 3) {
            clearInterval(glitchInterval);
            setTimeout(() => {
              setStage(prev => prev + 1);
            }, 200);
          }
        }, 30);
      };
      
      startGlitching();
      return () => clearInterval(glitchInterval);
    } else {
      // Sequence complete
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [stage, onComplete]);
  
  // Create glitching screen effect with random data bursts
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const createDataBurst = () => {
      if (!containerRef.current) return;
      
      const burst = document.createElement('div');
      burst.className = 'data-burst';
      
      // Randomize position and size
      const size = 2 + Math.random() * 10;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = 0.5 + Math.random() * 2;
      
      burst.style.width = `${size}px`;
      burst.style.height = `${2 + Math.random() * 30}px`;
      burst.style.left = `${left}%`;
      burst.style.top = `${top}%`;
      burst.style.opacity = `${0.3 + Math.random() * 0.7}`;
      burst.style.animationDuration = `${duration}s`;
      
      container.appendChild(burst);
      
      // Remove after animation completes
      setTimeout(() => {
        if (container.contains(burst)) {
          container.removeChild(burst);
        }
      }, duration * 1000);
    };
    
    // Create bursts at random intervals
    const interval = setInterval(() => {
      const burstCount = 3 + Math.floor(Math.random() * 8);
      for (let i = 0; i < burstCount; i++) {
        createDataBurst();
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  const isComplete = stage >= stages.length;
  const currentText = stage < stages.length ? glitchText : 'ACCESS GRANTED';
  
  const getStageIcon = () => {
    const icons = [
      <AlertTriangle className="text-apocalypse-red h-8 w-8" key="alert" />,
      <Shield className="text-toxic-neon h-8 w-8" key="shield" />,
      <FileWarning className="text-apocalypse-red h-8 w-8" key="warning" />,
      <Lock className="text-toxic-neon h-8 w-8" key="lock" />,
      <Radiation className="text-apocalypse-red h-8 w-8" key="radiation" />,
      <Zap className="text-toxic-neon h-8 w-8" key="zap" />,
      <Shield className="text-toxic-neon h-8 w-8" key="shield2" />,
      <Skull className="text-apocalypse-red h-8 w-8" key="skull" />,
      <Radiation className="text-toxic-neon h-8 w-8" key="radiation2" />,
      <Zap className="text-toxic-neon h-8 w-8" key="zap2" />
    ];
    
    return stage < icons.length ? icons[stage] : icons[0];
  };
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "breach-sequence-container w-full h-full absolute inset-0 overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 breach-bg"></div>
      <div className="scanline"></div>
      
      <AnimatePresence>
        <motion.div 
          key={stage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center h-full relative z-10"
        >
          {isComplete ? (
            <motion.div 
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div 
                className="text-toxic-neon text-5xl font-mono mb-8 font-bold text-center breach-success-text"
                animate={{ 
                  textShadow: ["0 0 7px rgba(57, 255, 20, 0.8)", "0 0 20px rgba(57, 255, 20, 0.8)", "0 0 7px rgba(57, 255, 20, 0.8)"]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ACCESS GRANTED
              </motion.div>
              
              <motion.div 
                className="text-white/70 text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                Welcome to the Resistance Network
              </motion.div>
              
              <motion.div 
                className="mt-6 text-toxic-neon/70 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                Initializing secure interface...
              </motion.div>
            </motion.div>
          ) : (
            <>
              <motion.div 
                className="mb-8"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, stage % 2 === 0 ? 5 : -5, 0]
                }}
                transition={{ duration: 0.3 }}
              >
                {getStageIcon()}
              </motion.div>
              
              <div className="breach-message-container relative">
                <motion.div 
                  className={`text-${stage % 2 === 0 ? 'apocalypse-red' : 'toxic-neon'} text-2xl md:text-3xl font-mono text-center breach-text px-8`}
                  animate={{ 
                    x: [0, stage % 2 === 0 ? -3 : 3, 0, stage % 2 === 0 ? 3 : -3, 0],
                  }}
                  transition={{ duration: 0.2, repeat: 3 }}
                >
                  {currentText}
                </motion.div>
                
                {!isComplete && (
                  <motion.div 
                    className="breach-progress-container mt-8 w-full max-w-md mx-auto"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ 
                      duration: stage < stages.length ? stages[stage].duration / 1000 : 0.5
                    }}
                  >
                    <div className={`h-0.5 bg-${stage % 2 === 0 ? 'apocalypse-red' : 'toxic-neon'}/70`}></div>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Binary data streams */}
      <div className="binary-stream-container">
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i} 
            className={`binary-stream stream-${i}`}
            style={{ 
              animationDelay: `${i * 0.2}s`,
              left: `${20 + i * 15}%`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
