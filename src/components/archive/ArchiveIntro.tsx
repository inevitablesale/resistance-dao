
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Radiation, Shield, Database, Radio } from 'lucide-react';
import { ToxicButton } from "@/components/ui/toxic-button";

interface ArchiveIntroProps {
  currentRadiation: number;
  narrativeContext: string;
  onContinue: () => void;
}

export const ArchiveIntro = ({ currentRadiation, narrativeContext, onContinue }: ArchiveIntroProps) => {
  const [showIntro, setShowIntro] = useState(true);
  const [textIndex, setTextIndex] = useState(0);
  
  const introText = [
    "INITIATING CONNECTION TO THE LAST ARCHIVE...",
    "RADIATION INTERFERENCE: CRITICAL",
    `CURRENT RADIATION LEVEL: ${currentRadiation}%`,
    "ARCHIVE STATUS: PARTIALLY ACCESSIBLE",
    "RESISTANCE NETWORK: ONLINE",
    narrativeContext,
    "CONTINUE TO ACCESS AVAILABLE ARCHIVE FUNCTIONS..."
  ];
  
  useEffect(() => {
    if (textIndex < introText.length - 1) {
      const timer = setTimeout(() => {
        setTextIndex(prev => prev + 1);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [textIndex, introText.length]);
  
  const handleContinue = () => {
    setShowIntro(false);
    setTimeout(() => {
      onContinue();
    }, 500);
  };
  
  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 backdrop-blur-sm"
        >
          <div className="terminal-outer-container max-w-3xl w-full">
            <div className="terminal-middle-container">
              <div className="terminal-container max-h-[70vh] overflow-auto">
                <div className="terminal-header flex items-center justify-between mb-4 border-b border-toxic-neon/20 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-toxic-neon" />
                    <span className="text-toxic-neon font-mono text-sm">THE LAST ARCHIVE // SYSTEM BOOT SEQUENCE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radiation className="h-4 w-4 text-apocalypse-red animate-pulse" />
                    <span className="text-apocalypse-red font-mono text-xs">RAD: {currentRadiation}%</span>
                  </div>
                </div>
                
                <div className="terminal-content">
                  {introText.slice(0, textIndex + 1).map((text, i) => (
                    <div key={i} className="terminal-line mb-6">
                      <div className="flex items-start">
                        <span className="text-toxic-neon font-mono text-xs mr-2">[ARCHIVE]&gt;</span>
                        <p className="text-white font-mono text-sm">{text}</p>
                      </div>
                    </div>
                  ))}
                  
                  {textIndex === introText.length - 1 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6"
                    >
                      <ToxicButton 
                        onClick={handleContinue}
                        className="w-full font-mono text-sm"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        ACCESS ARCHIVE
                      </ToxicButton>
                    </motion.div>
                  )}
                </div>
                
                <div className="scanline"></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
