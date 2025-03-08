
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Lock, Terminal } from "lucide-react";
import { ToxicButton } from "./toxic-button";

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
  
  // Handle main text typing after initialization
  useEffect(() => {
    if (initializationComplete && !isComplete) {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= textToType.length) {
          setDisplayText(textToType.substring(0, i));
          i++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, typeDelay);
      
      return () => clearInterval(interval);
    }
  }, [textToType, typeDelay, initializationComplete]);
  
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
  
  const getTerminalContent = () => {
    if (!initializationComplete) {
      return (
        <div className="terminal-line flex items-start">
          <span className="block text-toxic-neon">
            {currentLine === 0 && <span className="text-toxic-neon">_&gt; </span>}
            {displayText}
            {cursorVisible && <span className="cursor">_</span>}
          </span>
        </div>
      );
    }
    
    return (
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
        <div className="terminal-line flex items-center h-6 min-h-6">
          <span className="block text-toxic-neon">
            resistance@secure:~$ {displayText}
            {cursorVisible && <span className="cursor">_</span>}
          </span>
        </div>
        <div className="terminal-line mt-2 text-toxic-neon/70 text-sm">
          <span>// Access code is "resistance"</span>
        </div>
      </>
    );
  };
  
  return (
    <div className={cn("terminal-container relative", className)}>
      <div 
        ref={terminalRef} 
        className="terminal-output bg-black text-toxic-neon p-4 font-mono border border-toxic-neon/30 rounded-md relative overflow-hidden"
      >
        <div className="terminal-header flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Terminal className="w-4 h-4 mr-2 text-toxic-neon" />
            <span className="text-toxic-neon text-xs">RESISTANCE_SECURE_SHELL</span>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-apocalypse-red"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          </div>
        </div>
        
        {getTerminalContent()}
        
        {isComplete && !isConnected && (
          <div className="terminal-line mt-4">
            <ToxicButton
              onClick={onConnect}
              variant="outline"
              className="bg-transparent border-toxic-neon/50 hover:bg-toxic-neon/10"
            >
              <Lock className="w-4 h-4 mr-2 text-toxic-neon" />
              <span>SUBMIT ACCESS CODE</span>
            </ToxicButton>
            <div className="mt-2">
              <a 
                href="https://www.linkedin.com/groups/14310213/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-toxic-neon text-sm flex items-center hover:underline"
              >
                <span className="mr-2">📎</span> Join Resistance LinkedIn Group
              </a>
            </div>
          </div>
        )}
        
        {isConnected && (
          <div className="terminal-line mt-4 text-toxic-neon">
            <div className="animate-pulse text-toxic-neon">
              Access granted. Welcome to the Resistance.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
