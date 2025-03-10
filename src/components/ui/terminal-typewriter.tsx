
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Lock, ExternalLink, Terminal } from "lucide-react";
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
  typeDelay = 15, // Even faster typing speed (was 20)
  className,
  isConnected = false,
  onConnect,
  marketplaceMode = false
}: TerminalTypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(marketplaceMode ? true : false);
  const [currentLine, setCurrentLine] = useState(0);
  const [accessCode, setAccessCode] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Even more compact initialization lines
  const initLines = [
    "RESISTANCE_NETWORK v2.31",
    "SECURE CONNECTION ESTABLISHED",
    "AWAITING AUTHENTICATION..."
  ];
  
  // Handle initialization sequence typing - with faster line transition
  useEffect(() => {
    if (marketplaceMode) {
      // Skip initialization for marketplace mode
      return;
    }
    
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
          }, 100); // Even faster transition between lines (was 150)
        }
      }, typeDelay);
      
      return () => clearInterval(interval);
    } else if (currentLine === initLines.length) {
      setInitializationComplete(true);
      setCurrentLine(prev => prev + 1);
    }
  }, [currentLine, typeDelay, marketplaceMode]);
  
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  return (
    <div className={cn("terminal-outer-container relative backdrop-blur-sm", className)}>
      <div className="scanline"></div>
      <div className="terminal-middle-container">
        <div 
          ref={terminalRef} 
          className="terminal-container"
        >
          <div className="terminal-header">
            <div className="flex items-center">
              <Terminal className="w-3.5 h-3.5 mr-1.5 text-toxic-neon" /> {/* Reduced size */}
              <span className="text-toxic-neon text-xs font-mono">RESISTANCE_SECURE_SHELL</span> {/* Reduced text size */}
              <div className="ml-1.5 w-1.5 h-1.5 rounded-full bg-toxic-neon animate-pulse"></div> {/* Reduced size */}
            </div>
            <div className="flex gap-1.5"> {/* Reduced gap */}
              <div className="w-2.5 h-2.5 rounded-full bg-apocalypse-red"></div> {/* Reduced size */}
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div> {/* Reduced size */}
              <div className="w-2.5 h-2.5 rounded-full bg-toxic-neon/70"></div> {/* Reduced size */}
            </div>
          </div>
          
          <div className="terminal-content">
            {!initializationComplete ? (
              <div className="terminal-line">
                <span className="text-toxic-neon font-mono text-sm"> {/* Reduced text size */}
                  {displayText}
                  {cursorVisible && <span className="cursor">_</span>}
                </span>
              </div>
            ) : (
              <>
                {!marketplaceMode && (
                  <>
                    {initLines.map((line, index) => (
                      <div key={index} className="terminal-line">
                        <span className="text-toxic-neon font-mono text-sm"> {/* Reduced text size */}
                          {index === 0 ? (
                            <span className="text-toxic-neon">&gt; {line}</span>
                          ) : (
                            <span className="text-toxic-neon">&gt; {line}</span>
                          )}
                        </span>
                      </div>
                    ))}
                    
                    <div className="terminal-line">
                      <span className="text-toxic-neon font-mono text-sm">
                        resistance@secure:~$
                      </span>
                    </div>
                  </>
                )}
                
                {isConnected ? (
                  <div className="terminal-line mt-2"> {/* Reduced margin */}
                    <div className="animate-pulse text-toxic-neon font-mono text-sm"> {/* Reduced text size */}
                      Access granted. Welcome to the Resistance.
                    </div>
                  </div>
                ) : (
                  <>
                    {!marketplaceMode ? (
                      <>
                        <div className="terminal-input-container mt-3"> {/* Reduced margin */}
                          <div className="access-code-container">
                            <div className="flex items-center w-full relative">
                              <Lock className="access-code-icon absolute left-3 z-10 text-toxic-neon" size={14} /> {/* Reduced size */}
                              <Input
                                type="password"
                                placeholder="Enter access code"
                                className="access-code-input text-sm pl-9 py-2" {/* Reduced text and padding */}
                                value={accessCode}
                                onChange={handleAccessCodeChange}
                                onKeyDown={handleKeyDown}
                              />
                              <button 
                                onClick={handleSubmit}
                                className="submit-button ml-2 text-xs py-2 px-3" {/* Reduced size, margin and padding */}
                              >
                                <span>Submit</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="terminal-hint mt-2"> {/* Reduced margin */}
                          <span className="text-toxic-neon/70 text-xs font-mono">// Access code is "resistance"</span>
                        </div>
                        
                        <div className="terminal-footer mt-3"> {/* Reduced margin */}
                          <a 
                            href="https://www.linkedin.com/groups/14310213/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="linkedin-link text-xs" {/* Reduced text size */}
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> {/* Reduced size and margin */}
                            <span>Join Resistance LinkedIn Group</span>
                          </a>
                        </div>
                      </>
                    ) : (
                      <div className="terminal-line mt-2"> {/* Reduced margin */}
                        <div className="text-toxic-neon font-mono text-sm"> {/* Reduced text size */}
                          {textToType} {cursorVisible && <span className="cursor">_</span>}
                        </div>
                        <div className="mt-2"> {/* Reduced margin */}
                          <button 
                            onClick={handleSubmit}
                            className="submit-button text-xs py-2 px-3" {/* Reduced text size and padding */}
                          >
                            <span>Connect</span>
                          </button>
                        </div>
                      </div>
                    )}
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
