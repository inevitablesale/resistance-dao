
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Radiation, Lock, Unlock } from 'lucide-react';

export const SystemBreachTransition = () => {
  const [stage, setStage] = useState<'initial' | 'breach' | 'expand' | 'complete'>('initial');
  const [glitchText, setGlitchText] = useState('SYSTEM BREACH');
  const [securityLines, setSecurityLines] = useState<string[]>([]);

  useEffect(() => {
    // Stage transition timings
    const stageTimings = {
      initial: 200,
      breach: 800,
      expand: 1000
    };
    
    // Security message lines to display during the breach
    const securityMessages = [
      'SECURITY PROTOCOLS BYPASSED',
      'FIREWALL DISABLED',
      'SYSTEM ACCESS ELEVATED',
      'ADMIN PRIVILEGES ACQUIRED',
      'EXPANDING INTERFACE...',
      'RESISTANCE OS LOADING...'
    ];
    
    // Start breach sequence
    setTimeout(() => setStage('breach'), stageTimings.initial);
    
    // Display security messages
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < securityMessages.length) {
        setSecurityLines(prev => [...prev, securityMessages[messageIndex]]);
        messageIndex++;
      } else {
        clearInterval(messageInterval);
      }
    }, 300);
    
    // Glitch text effect
    const glitchInterval = setInterval(() => {
      const glitchOptions = [
        'SYST3M BR3ACH',
        'S¥STEM BRE^CH',
        'SYST&M BR#ACH',
        'SY$TEM BRE@CH',
        'SYSTEM BREACH'
      ];
      setGlitchText(glitchOptions[Math.floor(Math.random() * glitchOptions.length)]);
    }, 100);
    
    // Move to expand stage
    setTimeout(() => {
      setStage('expand');
      clearInterval(glitchInterval);
      setGlitchText('SYSTEM BREACH COMPLETE');
    }, stageTimings.breach);
    
    // Complete the transition
    setTimeout(() => {
      setStage('complete');
    }, stageTimings.breach + stageTimings.expand);
    
    return () => {
      clearInterval(messageInterval);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
      
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ 
          scale: stage === 'expand' ? [1, 1.5, 2] : 1,
          opacity: stage === 'complete' ? 0 : 1 
        }}
        transition={{ 
          duration: stage === 'expand' ? 1 : 0.3,
          ease: "easeInOut"
        }}
        className="relative max-w-2xl w-full p-8 bg-black/70 border border-apocalypse-red rounded-lg overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-30 glitch-lines"></div>
          {[...Array(20)].map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: Math.random() > 0.5 ? -100 : 100 }}
              animate={{ 
                opacity: [0, 0.7, 0],
                x: Math.random() > 0.5 ? [-100, 800] : [100, -800]
              }}
              transition={{ 
                duration: 0.5 + Math.random() * 1,
                delay: Math.random() * 1,
                repeat: Infinity,
                repeatDelay: Math.random() * 3
              }}
              className="absolute h-px bg-apocalypse-red/70"
              style={{ 
                top: `${Math.random() * 100}%`,
                width: `${50 + Math.random() * 100}px`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-apocalypse-red">
              <AlertTriangle className="w-6 h-6 mr-2 animate-pulse" />
              <h2 className="text-xl font-mono font-bold">CRITICAL ALERT</h2>
            </div>
            
            <div className="flex items-center space-x-2">
              {stage === 'initial' ? (
                <Lock className="w-5 h-5 text-apocalypse-red" />
              ) : (
                <Unlock className="w-5 h-5 text-toxic-neon animate-pulse" />
              )}
            </div>
          </div>
          
          <motion.div
            animate={{ 
              x: stage === 'breach' ? [0, -10, 10, -5, 5, 0] : 0 
            }}
            transition={{ duration: 0.5 }}
            className="text-center py-6"
          >
            <h1 className={`text-4xl md:text-5xl font-bold font-mono text-apocalypse-red mb-4 glitch-text ${stage === 'breach' ? 'animate-pulse' : ''}`}>
              {glitchText}
            </h1>
            
            <div className="h-1 w-full bg-black overflow-hidden rounded mb-6">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: stage === 'initial' ? "0%" : "100%" }}
                transition={{ duration: 0.8 }}
                className="h-full bg-apocalypse-red"
              />
            </div>
            
            <div className="text-left font-mono text-sm space-y-1 mb-4 max-h-40 overflow-hidden">
              {securityLines.map((line, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start"
                >
                  <span className="text-toxic-neon mr-2">&gt;</span>
                  <span className="text-white">{line}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <div className="absolute bottom-0 left-0 w-full h-1/3 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ y: stage === 'expand' ? [100, 0] : 100 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-toxic-neon/30 to-transparent"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
