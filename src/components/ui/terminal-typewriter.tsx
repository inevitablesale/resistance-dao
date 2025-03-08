
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Lock, ExternalLink, Terminal } from "lucide-react";
import { ToxicButton } from "./toxic-button";
import { Input } from "./input";

interface TerminalTypewriterProps {
  textToType?: string;
  typeDelay?: number;
  className?: string;
  isConnected?: boolean;
  onConnect?: () => void;
  marketplaceMode?: boolean;
}

export function TerminalTypewriter({
  textToType = "Enter access code",
  typeDelay = 70,
  className,
  isConnected = false,
  onConnect,
  marketplaceMode = false
}: TerminalTypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [accessCode, setAccessCode] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const initLines = [
    "RESISTANCE_SECURE_SHELL",
    "Initializing secure terminal...",
    "Establishing encrypted connection...",
    "[WARNING]: Connection masking enabled",
    "Routing through decentralized nodes...",
    "RESISTANCE NETWORK TERMINAL v3.27",
    "Authentication required:",
    "resistance@secure:~$"
  ];
  
  // Handle initialization sequence typing
  useEffect(() => {
    if (currentLine < initLines.length) {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= initLines[currentLine].length) {
          setDisplayText(prev => initLines[currentLine].substring(0, i));
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentLine(prev => prev + 1);
          }, 300); // Wait before moving to next line
        }
      }, typeDelay);
      
      return () => clearInterval(interval);
    } else if (currentLine === initLines.length) {
      setInitializationComplete(true);
      setCurrentLine(prev => prev + 1);
    }
  }, [currentLine, typeDelay]);
  
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
  }, [displayText, isConnected, isComplete, currentLine]);
  
  const handleSubmit = () => {
    if (onConnect) {
      onConnect();
    }
  };
  
  const handleAccessCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessCode(e.target.value);
  };
  
  return (
    <div className={cn("terminal-outer-container", className)}>
      <div className="terminal-middle-container">
        <div 
          ref={terminalRef} 
          className="terminal-container"
        >
          <div className="terminal-header">
            <div className="flex items-center">
              <span className="text-toxic-neon text-sm">_&gt; RESISTANCE_SECURE_SHELL</span>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-apocalypse-red"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            </div>
          </div>
          
          <div className="terminal-content">
            {!initializationComplete ? (
              <div className="terminal-line">
                <span className="text-toxic-neon">
                  {currentLine === 0 && <span className="text-toxic-neon">_&gt; </span>}
                  {displayText}
                  {cursorVisible && <span className="cursor">_</span>}
                </span>
              </div>
            ) : (
              <>
                <div className="terminal-line">
                  <span className="text-toxic-neon">_&gt; RESISTANCE_SECURE_SHELL</span>
                </div>
                <div className="terminal-line">
                  <span className="text-toxic-neon">Initializing secure terminal...</span>
                </div>
                <div className="terminal-line">
                  <span className="text-toxic-neon">Establishing encrypted connection...</span>
                </div>
                <div className="terminal-line">
                  <span className="text-toxic-neon">[WARNING]: Connection masking enabled</span>
                </div>
                <div className="terminal-line">
                  <span className="text-toxic-neon">Routing through decentralized nodes...</span>
                </div>
                <div className="terminal-line">
                  <span className="text-toxic-neon">RESISTANCE NETWORK TERMINAL v3.27</span>
                </div>
                <div className="terminal-line">
                  <span className="text-toxic-neon">Authentication required:</span>
                </div>
                <div className="terminal-line">
                  <span className="text-toxic-neon">resistance@secure:~$</span>
                </div>
                
                {isConnected ? (
                  <div className="terminal-line mt-4">
                    <div className="animate-pulse text-toxic-neon">
                      Access granted. Welcome to the Resistance.
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="terminal-input-container mt-5">
                      <div className="access-code-container">
                        <div className="flex items-center w-full relative">
                          <Lock className="access-code-icon absolute left-3 z-10 text-toxic-neon" size={16} />
                          <Input
                            type="password"
                            placeholder="Enter access code"
                            className="access-code-input pl-10"
                            value={accessCode}
                            onChange={handleAccessCodeChange}
                          />
                          <button 
                            onClick={handleSubmit}
                            className="submit-button"
                          >
                            <span className="mr-2">Submit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="terminal-hint mt-4">
                      <span className="text-toxic-neon/70 text-sm">// Access code is "resistance"</span>
                    </div>
                    
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
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
