
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Radiation, ShieldAlert, Shield, Wifi } from "lucide-react";
import { ToxicButton } from "./toxic-button";

interface TerminalTypewriterProps {
  textToType?: string;
  typeDelay?: number;
  className?: string;
  isConnected?: boolean;
  onConnect?: () => void;
  marketplaceMode?: boolean;
  storyMode?: boolean;
}

export function TerminalTypewriter({
  textToType = "PRESS [ACTIVATE SURVIVAL BEACON] TO CONTINUE...",
  typeDelay = 70,
  className,
  isConnected = false,
  onConnect,
  marketplaceMode = false,
  storyMode = false
}: TerminalTypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Reset and restart typing when text changes
  useEffect(() => {
    setDisplayText("");
    setIsComplete(false);
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
  }, [textToType, typeDelay]);
  
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
  }, [displayText, isConnected, isComplete]);

  const getStoryContent = () => (
    <>
      <div className="terminal-line">
        <span className="text-toxic-neon/80">[RESISTANCE_OS v3.2.1]</span>
        <span className="text-white/70"> TRANSMISSION INITIALIZED...</span>
      </div>
      <div className="terminal-line">
        <span className="text-toxic-neon/80">[WORLD_STATUS]</span>
        <span className="text-white/70"> The old financial systems collapsed. Power centralized. Innovation stifled.</span>
      </div>
      <div className="terminal-line">
        <span className="text-toxic-neon/80">[RESISTANCE_MISSION]</span>
        <span className="text-white/70"> Building a new paradigm for project funding. Community-driven. Decentralized.</span>
      </div>
      <div className="terminal-line">
        <span className="text-toxic-neon/80">[CURRENT_OPERATIONS]</span>
        <span className="text-white/70"> Soft capital commitments. Project validation. Resource allocation.</span>
      </div>
      <div className="terminal-line h-6">
        <span className="text-apocalypse-red/90">[COMING_SOON]</span>
        <span className="text-white/70"> JOB LISTINGS | PARTNER MATCHING | ROLE SEEKING</span>
      </div>
    </>
  );
  
  const getMarketplaceContent = () => (
    <>
      <div className="terminal-line">
        <span className="text-toxic-neon/80">[RESISTANCE_OS v3.2.1]</span>
        <span className="text-white/70"> SCANNING FOR PROJECT OPPORTUNITIES...</span>
      </div>
      <div className="terminal-line">
        <span className="text-toxic-neon/80">[CAPITAL_PROTOCOL]</span>
        <span className="text-white/70"> ESTABLISHING SECURE COMMITMENT CHANNELS...</span>
      </div>
      <div className="terminal-line h-6">
        <span className="text-apocalypse-red/90">[COMING_SOON]</span>
        <span className="text-white/70"> JOB LISTINGS | PARTNER MATCHING | ROLE SEEKING</span>
      </div>
    </>
  );
  
  const getStandardContent = () => (
    <>
      <div className="terminal-line">
        <span className="text-toxic-neon/80">[RESISTANCE_OS v3.2.1]</span>
        <span className="text-white/70"> LOADING INTERFACE...</span>
      </div>
      <div className="terminal-line">
        <span className="text-toxic-neon/80">[SURVIVAL_PROTOCOL]</span>
        <span className="text-white/70"> ESTABLISHING SECURE TRANSMISSION...</span>
      </div>
      <div className="terminal-line h-6">
        <span className="text-apocalypse-red/90">[COMING_SOON]</span>
        <span className="text-white/70"> JOB LISTINGS | PARTNER MATCHING | ROLE SEEKING</span>
      </div>
    </>
  );
  
  return (
    <div className={cn("terminal-container relative", className)}>
      <div 
        ref={terminalRef} 
        className="terminal-output bg-black/80 text-toxic-neon p-4 font-mono border border-toxic-neon/30 rounded-md relative overflow-hidden"
      >
        <div className="scanline absolute inset-0 pointer-events-none"></div>
        
        {storyMode ? getStoryContent() : 
         marketplaceMode ? getMarketplaceContent() : 
         getStandardContent()}
        
        <div className="terminal-line flex items-center h-6 min-h-6">
          <span className="block">
            {displayText}
            {cursorVisible && <span className="cursor">_</span>}
          </span>
        </div>
        
        {isComplete && !isConnected && (
          <div className="terminal-line mt-4">
            <ToxicButton
              onClick={onConnect}
              variant="marketplace"
              className="bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
            >
              {marketplaceMode || storyMode ? (
                <>
                  <ShieldAlert className="w-4 h-4 mr-2 text-toxic-neon" />
                  <span className="flash-beacon">ACTIVATE SURVIVAL BEACON</span>
                </>
              ) : (
                <>
                  <Radiation className="w-4 h-4 mr-2 text-toxic-neon" />
                  <span className="flash-beacon">ACTIVATE SURVIVAL BEACON</span>
                </>
              )}
            </ToxicButton>
          </div>
        )}
        
        {isConnected && (
          <div className="terminal-line mt-4">
            <ToxicButton
              onClick={onConnect}
              variant="outline"
              className="border-toxic-neon/30 bg-toxic-neon/10 hover:bg-toxic-neon/20"
            >
              <Wifi className="w-4 h-4 mr-2 text-toxic-neon" />
              <span className="text-toxic-neon">
                {marketplaceMode ? "ACCESS FUNDING TERMINAL" : "ACCESS COMMAND TERMINAL"}
              </span>
            </ToxicButton>
            <div className="mt-2 text-toxic-neon flex items-center gap-2">
              <Shield className="w-4 h-4 text-toxic-neon" />
              <span className="text-white/70">
                {marketplaceMode ? 
                  "CAPITAL COMMITMENT PROTOCOLS ACTIVE" : 
                  "SURVIVAL BEACON ACTIVE - WELCOME TO THE RESISTANCE"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
