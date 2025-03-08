
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Shield, Radiation, Zap, Bug, AlertTriangle } from 'lucide-react';

interface BreachSequenceProps {
  onComplete: () => void;
}

export const BreachSequence: React.FC<BreachSequenceProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [showGlitch, setShowGlitch] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [progress, setProgress] = useState(0);

  const stageMessages = [
    [
      "INITIATING BREACH PROTOCOL",
      "BYPASSING SECURITY MEASURES",
      "ACCESSING ENCRYPTED CHANNELS",
      "NETWORK INTRUSION DETECTED"
    ],
    [
      "SECURITY OVERRIDE INITIATED",
      "DISABLING COUNTERMEASURES",
      "ESTABLISHING SECURE CONNECTION",
      "RADIATION SHIELDS ENGAGED"
    ],
    [
      "DOWNLOADING SECURE DATA PACKETS",
      "DECRYPTING RESISTANCE PROTOCOLS",
      "REBUILDING NEURAL NETWORK",
      "SURVIVOR DATABASE CONNECTED"
    ],
    [
      "SYSTEM SUCCESSFULLY BREACHED",
      "WASTELAND ACCESS GRANTED",
      "RESISTANCE NETWORK ONLINE",
      "WELCOME TO THE APOCALYPSE"
    ]
  ];

  useEffect(() => {
    setShowGlitch(true);
    setTimeout(() => setShowGlitch(false), 800);

    const sequence = async () => {
      for (let i = 0; i < stageMessages.length; i++) {
        setStage(i);
        setMessages([]);
        setProgress((i / stageMessages.length) * 100);
        
        // Show warning flash randomly
        if (Math.random() > 0.5) {
          await new Promise(r => setTimeout(r, 300));
          setShowWarning(true);
          await new Promise(r => setTimeout(r, 200));
          setShowWarning(false);
        }
        
        // Add messages sequentially with delay
        for (let j = 0; j < stageMessages[i].length; j++) {
          await new Promise(r => setTimeout(r, 400));
          setMessages(prev => [...prev, stageMessages[i][j]]);
        }
        
        // Wait before next stage
        await new Promise(r => setTimeout(r, 1000));
        
        // Flash glitch effect between stages
        setShowGlitch(true);
        await new Promise(r => setTimeout(r, 300));
        setShowGlitch(false);
      }
      
      // Final progress and animations
      setProgress(100);
      
      // Complete the sequence
      setTimeout(() => {
        onComplete();
      }, 1500);
    };
    
    sequence();
  }, []);

  const renderIcon = () => {
    const icons = [
      <Radiation key="radiation" className="h-10 w-10 text-toxic-neon" />,
      <Shield key="shield" className="h-10 w-10 text-toxic-neon" />,
      <Bug key="bug" className="h-10 w-10 text-toxic-neon" />,
      <Zap key="zap" className="h-10 w-10 text-toxic-neon" />
    ];
    
    return icons[stage];
  };

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
      
      {/* Warning flash */}
      <AnimatePresence>
        {showWarning && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="bg-apocalypse-red/30 p-10 rounded-lg border border-apocalypse-red flex items-center gap-4">
              <AlertTriangle className="h-10 w-10 text-apocalypse-red" />
              <span className="text-apocalypse-red font-mono text-2xl">WARNING: UNAUTHORIZED ACCESS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Scan lines */}
      <div className="scanline absolute inset-0 pointer-events-none"></div>
      
      {/* Background visual effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="grid grid-cols-10 h-full">
          {Array.from({ length: 100 }).map((_, i) => (
            <div 
              key={i} 
              className="border border-toxic-neon/5"
              style={{ 
                opacity: Math.random() * 0.5 + 0.1
              }}
            />
          ))}
        </div>
      </div>

      {/* Data streams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-px bg-toxic-neon/50"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 100 + 100}%`,
              top: `-${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animation: `dataStream ${Math.random() * 3 + 2}s linear infinite`
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-xl w-full mx-4">
        <motion.div 
          className="bg-black/80 border border-toxic-neon/30 p-8 rounded-lg relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Progress bar */}
          <div className="h-1 w-full bg-white/10 mb-6 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-toxic-neon"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <motion.div 
              className="w-16 h-16 rounded-full bg-toxic-neon/20 flex items-center justify-center"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {renderIcon()}
            </motion.div>
          </div>
          
          <h2 className="text-2xl text-center font-mono text-toxic-neon mb-6">
            RESISTANCE NETWORK BREACH
          </h2>
          
          <div className="terminal-output bg-black/90 p-4 rounded font-mono text-sm text-toxic-neon mb-6 min-h-[200px] flex flex-col justify-start">
            <AnimatePresence>
              {messages.map((message, i) => (
                <motion.div 
                  key={`${stage}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-2 terminal-line"
                >
                  <span className="text-apocalypse-red mr-2">&gt;</span> {message}
                </motion.div>
              ))}
            </AnimatePresence>
            
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-toxic-neon"
            >
              <span className="text-apocalypse-red mr-2">&gt;</span> _
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
