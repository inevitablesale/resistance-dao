
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Radiation, ShieldAlert } from "lucide-react";
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
  textToType = "PRESS [ACTIVATE SURVIVAL BEACON] TO CONTINUE...",
  typeDelay = 70,
  className,
  isConnected = false,
  onConnect,
  marketplaceMode = false
}: TerminalTypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
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

  const getMarketplaceContent = () => (
    <>
      <div className="terminal-line">
        <span className="text-toxic-neon/80">[WASTELAND_EXCHANGE v4.1.2]</span>
        <span className="text-white/70"> INITIALIZING MARKETPLACE PROTOCOLS...</span>
      </div>
      <div className="terminal-line">
        <span className="text-toxic-neon/80">[TRADE_SYSTEM]</span>
        <span className="text-white/70"> ESTABLISHING SECURE TRANSACTION CHANNELS...</span>
      </div>
      <div className="terminal-line h-6">
        <span className="text-apocalypse-red/90">[MARKET_ALERT]</span>
        <span className="text-white/70"> RADIATION LEVELS AFFECTING ASSET VALUES - USE CAUTION</span>
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
        <span className="text-apocalypse-red/90">[WARNING]</span>
        <span className="text-white/70"> WASTELAND RADIATION LEVELS CRITICAL - ENCRYPTION REQUIRED</span>
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
        
        {marketplaceMode ? getMarketplaceContent() : getStandardContent()}
        
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
              {marketplaceMode ? (
                <>
                  <ShieldAlert className="w-4 h-4 mr-2 text-toxic-neon" />
                  <span className="flash-beacon">AUTHENTICATE FOR MARKETPLACE ACCESS</span>
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
          <div className="terminal-line mt-4 text-toxic-neon">
            <span>[CONNECTED]</span> 
            <span className="text-white/70">
              {marketplaceMode ? 
                " MARKETPLACE ACCESS GRANTED - TRADE PROTOCOLS ACTIVE" : 
                " SURVIVAL BEACON ACTIVE - WELCOME TO THE RESISTANCE"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
