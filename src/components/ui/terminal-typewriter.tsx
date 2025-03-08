
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Shield, Target } from 'lucide-react';
import { ToxicButton } from './toxic-button';

interface TerminalTypewriterProps {
  showBootSequence?: boolean;
  showQuestionnaire?: boolean;
  onTypingComplete?: () => void;
  onRoleSelect?: (role: "bounty-hunter" | "survivor") => void;
  selectedRole?: "bounty-hunter" | "survivor" | null;
}

export function TerminalTypewriter({
  showBootSequence = false,
  showQuestionnaire = false,
  onTypingComplete,
  onRoleSelect,
  selectedRole
}: TerminalTypewriterProps) {
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [textComplete, setTextComplete] = useState(false);
  const [isReadyForRole, setIsReadyForRole] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);

  // Simplified boot sequence text
  const bootSequenceText = [
    ">> Initializing resistance network...",
    ">> Scanning for threats...",
    ">> Connecting to secure node...",
    ">> System ready."
  ];

  // Simplified questionnaire text
  const questionnaireText = [
    ">> Role selection required.",
    ">> Choose your path in the wasteland:"
  ];

  // Scroll terminal to bottom when new text is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedText]);

  // Type out text character by character with a delay
  useEffect(() => {
    let textArray: string[] = [];
    if (showBootSequence) {
      textArray = bootSequenceText;
    } else if (showQuestionnaire) {
      textArray = questionnaireText;
    }

    if (currentLine < textArray.length) {
      setIsTyping(true);
      const line = textArray[currentLine];
      let currentText = '';
      let charIndex = 0;

      const typingInterval = setInterval(() => {
        if (charIndex < line.length) {
          currentText += line[charIndex];
          setDisplayedText(prev => [...prev.slice(0, -1), currentText]);
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setTimeout(() => {
            setCurrentLine(prevLine => prevLine + 1);
            if (currentLine === textArray.length - 1) {
              setDisplayedText(prev => [...prev, '']);
            } else {
              setDisplayedText(prev => [...prev, '']);
            }
          }, 500);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    } else if (textArray.length > 0 && currentLine >= textArray.length && !textComplete) {
      setTextComplete(true);
      if (showBootSequence && onTypingComplete) {
        onTypingComplete();
      }
      if (showQuestionnaire) {
        setIsReadyForRole(true);
      }
    }
  }, [currentLine, showBootSequence, showQuestionnaire, onTypingComplete, textComplete]);

  const handleRoleSelect = (role: "bounty-hunter" | "survivor") => {
    if (onRoleSelect) {
      onRoleSelect(role);
    }
  };

  return (
    <div className="terminal-typewriter h-full flex flex-col">
      <div 
        ref={terminalRef}
        className="font-mono text-toxic-neon bg-black p-2 overflow-y-auto flex-grow"
      >
        {displayedText.map((text, index) => (
          <div key={index} className="mb-2">
            {text}
            {isTyping && index === displayedText.length - 1 && (
              <span className="inline-block w-2 h-4 bg-toxic-neon ml-1 animate-blink"></span>
            )}
          </div>
        ))}
      </div>

      {isReadyForRole && showQuestionnaire && !selectedRole && (
        <div className="mt-4 p-4 grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`
              p-4 border rounded-md cursor-pointer
              ${selectedRole === 'bounty-hunter' 
                ? 'border-apocalypse-red/60 bg-black/60' 
                : 'border-toxic-neon/30 bg-black/40 hover:border-toxic-neon/60'}
            `}
            onClick={() => handleRoleSelect('bounty-hunter')}
          >
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 text-apocalypse-red mr-2" />
              <h3 className="text-toxic-neon font-mono">Bounty Hunter</h3>
            </div>
            <p className="text-white/70 text-sm">
              Track down crypto criminals and claim rewards.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`
              p-4 border rounded-md cursor-pointer
              ${selectedRole === 'survivor' 
                ? 'border-toxic-neon/60 bg-black/60' 
                : 'border-toxic-neon/30 bg-black/40 hover:border-toxic-neon/60'}
            `}
            onClick={() => handleRoleSelect('survivor')}
          >
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 text-toxic-neon mr-2" />
              <h3 className="text-toxic-neon font-mono">Survivor</h3>
            </div>
            <p className="text-white/70 text-sm">
              Build communities and establish settlements.
            </p>
          </motion.div>
        </div>
      )}

      {selectedRole && showQuestionnaire && (
        <div className="mt-4 p-4">
          <div className="border border-toxic-neon/40 rounded-md p-4 bg-black/50">
            <div className="text-toxic-neon mb-2">
              {selectedRole === 'bounty-hunter' ? 'Bounty Hunter' : 'Survivor'} role selected.
            </div>
            <ToxicButton 
              onClick={() => onTypingComplete && onTypingComplete()}
              className="mt-2 w-full justify-center"
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </ToxicButton>
          </div>
        </div>
      )}
      
      <style>
        {`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        `}
      </style>
    </div>
  );
}
