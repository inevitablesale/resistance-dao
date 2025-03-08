
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Lock, ExternalLink, Terminal, AlertTriangle, Radiation, Power, ShieldOff } from "lucide-react";
import { Input } from "./input";
import { motion, AnimatePresence } from "framer-motion";
import { ToxicButton } from "./toxic-button";
import { TerminalState } from "@/hooks/useTerminalState";

interface EnhancedTerminalProps {
  terminalState: TerminalState;
  onPasswordSuccess: () => void;
  onConnect?: () => void;
  className?: string;
  marketplaceMode?: boolean;
  isConnected?: boolean;
}

export function EnhancedTerminal({
  terminalState,
  onPasswordSuccess,
  onConnect,
  className,
  marketplaceMode = false,
  isConnected = false
}: EnhancedTerminalProps) {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [accessCode, setAccessCode] = useState("");
  const [initializationLines, setInitializationLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorShaking, setErrorShaking] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Handle cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);

  // Scroll to bottom when content changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayText, isConnected, terminalState, currentLine, initializationLines]);
  
  // Handle initialization sequence
  useEffect(() => {
    if (terminalState === 'initializing') {
      // Define the initialization sequence lines
      const bootSequence = [
        "RESISTANCE_SECURE_SHELL v3.27",
        "Initializing system...",
        "Loading kernel modules...",
        "Securing transmission channels...",
        "Checking for surveillance...",
        "Establishing encrypted channel...",
        "Accessing resistance network...",
        "System initialized.",
        "Authentication required:"
      ];
      
      setInitializationLines(bootSequence);
      
      // Start typing animation for first line
      let lineIndex = 0;
      let charIndex = 0;
      
      const typeNextChar = () => {
        if (lineIndex < bootSequence.length) {
          const currentBootLine = bootSequence[lineIndex];
          
          if (charIndex <= currentBootLine.length) {
            setDisplayText(currentBootLine.substring(0, charIndex));
            charIndex++;
            setTimeout(typeNextChar, 15); // Fast typing speed
          } else {
            // Line complete, move to next line
            setInitializationLines(prev => {
              const newLines = [...prev];
              newLines[lineIndex] = currentBootLine;
              return newLines;
            });
            
            lineIndex++;
            charIndex = 0;
            setCurrentLine(lineIndex);
            
            if (lineIndex < bootSequence.length) {
              setTimeout(typeNextChar, 100); // Delay between lines
            }
          }
        }
      };
      
      typeNextChar();
    }
  }, [terminalState]);
  
  const handleSubmit = () => {
    // Check for correct password (resistance)
    if (accessCode.toLowerCase() === 'resistance') {
      setErrorMessage("");
      onPasswordSuccess();
    } else {
      setErrorMessage("Access denied. Invalid code.");
      setErrorShaking(true);
      setTimeout(() => setErrorShaking(false), 500);
    }
  };
  
  const handleAccessCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessCode(e.target.value);
    // Clear error message when typing
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  const renderTerminalHeader = () => (
    <div className="terminal-header">
      <div className="flex items-center">
        <Terminal className="w-4 h-4 mr-2 text-toxic-neon" />
        <span className="text-toxic-neon text-sm font-mono">RESISTANCE_SECURE_SHELL</span>
        <div className="ml-2 w-2 h-2 rounded-full bg-toxic-neon animate-pulse"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-apocalypse-red"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-toxic-neon/70"></div>
      </div>
    </div>
  );
  
  const renderInitializationSequence = () => (
    <div className="terminal-content">
      {initializationLines.map((line, index) => (
        <div key={index} className="terminal-line">
          <span className="text-toxic-neon font-mono">
            {index === 0 ? (
              <span className="text-toxic-neon">_&gt; {line}</span>
            ) : (
              line
            )}
          </span>
        </div>
      ))}
      
      {currentLine < initializationLines.length && (
        <div className="terminal-line">
          <span className="text-toxic-neon font-mono">
            {displayText}
            {cursorVisible && <span className="cursor">_</span>}
          </span>
        </div>
      )}
    </div>
  );
  
  const renderAuthenticationOptions = () => (
    <>
      <div className="terminal-line">
        <span className="text-toxic-neon font-mono">
          resistance@secure:~$
        </span>
      </div>
      
      <div className="terminal-input-container mt-4">
        <motion.div 
          className="access-code-container"
          animate={errorShaking ? {
            x: [0, -10, 10, -10, 10, 0],
          } : {}}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center w-full relative">
            <Lock className="access-code-icon absolute left-3 z-10 text-toxic-neon" size={16} />
            <Input
              type="password"
              placeholder="Enter access code"
              className="access-code-input pl-10"
              value={accessCode}
              onChange={handleAccessCodeChange}
              onKeyDown={handleKeyDown}
            />
            <ToxicButton 
              onClick={handleSubmit}
              className="submit-button ml-3 active:transform active:translate-y-0.5 transition-transform"
            >
              <span className="mr-2">Submit</span>
            </ToxicButton>
          </div>
          
          {errorMessage && (
            <motion.div 
              className="error-message text-apocalypse-red text-sm mt-2 font-mono flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {errorMessage}
            </motion.div>
          )}
        </motion.div>
      </div>
      
      <div className="flex flex-col space-y-4 mt-6">
        <div className="terminal-connect-options">
          <ToxicButton 
            variant="outline"
            className="w-full justify-start text-sm"
            onClick={onConnect}
          >
            <Power className="w-4 h-4 mr-2" />
            <span className="mr-2">Connect Resistance Beacon</span>
            <span className="text-xs ml-auto opacity-70">[Wallet]</span>
          </ToxicButton>
        </div>
      </div>
      
      <div className="terminal-hint mt-3">
        <span className="text-toxic-neon/70 text-xs font-mono">// Access code is "resistance"</span>
      </div>
      
      {!marketplaceMode && (
        <div className="terminal-footer mt-4">
          <a 
            href="https://www.linkedin.com/groups/14310213/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="linkedin-link"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            <span>Join Resistance LinkedIn Group</span>
          </a>
        </div>
      )}
    </>
  );
  
  return (
    <div className={cn("terminal-outer-container relative backdrop-blur-sm", className)}>
      <div className="scanline"></div>
      <div className="terminal-middle-container">
        <div 
          ref={terminalRef} 
          className="terminal-container"
        >
          {renderTerminalHeader()}
          
          <div className="terminal-content">
            {terminalState === 'initializing' && renderInitializationSequence()}
            {terminalState === 'auth-required' && (
              <>
                {initializationLines.map((line, index) => (
                  <div key={index} className="terminal-line">
                    <span className="text-toxic-neon font-mono">
                      {index === 0 ? (
                        <span className="text-toxic-neon">_&gt; {line}</span>
                      ) : (
                        line
                      )}
                    </span>
                  </div>
                ))}
                
                {renderAuthenticationOptions()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
