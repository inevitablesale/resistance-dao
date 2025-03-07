
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Radiation, Target, Shield } from "lucide-react";
import { ToxicButton } from "./toxic-button";

interface TerminalTypewriterProps {
  textToType?: string;
  typeDelay?: number;
  className?: string;
  isConnected?: boolean;
  onConnect?: () => void;
  onRoleSelect?: (role: "bounty-hunter" | "survivor") => void;
  selectedRole?: "bounty-hunter" | "survivor" | null;
}

export function TerminalTypewriter({
  textToType = "SURVIVORS DETECTED... IF YOU CAN READ THIS, YOU'RE STILL ALIVE. THE CRYPTO NUCLEAR WINTER KILLED 90% OF PROTOCOLS. THOSE WHO REMAIN HAVE ADAPTED TO THE HARSH NEW REALITY. RESILIENT COMMUNITIES HAVE ESTABLISHED NEW ECONOMIES FROM THE ASHES. OUR TRADERS REPORT THAT TOKEN EXCHANGE NETWORKS ARE FUNCTIONING AGAIN. WE ARE REBUILDING THE FINANCIAL SYSTEM. JOIN US.",
  typeDelay = 70,
  className,
  isConnected = false,
  onConnect,
  onRoleSelect,
  selectedRole
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
  
  return (
    <div className={cn("terminal-container relative", className)}>
      <div 
        ref={terminalRef} 
        className="terminal-output bg-black/80 text-toxic-neon p-4 font-mono border border-toxic-neon/30 rounded-md relative overflow-hidden"
      >
        <div className="scanline absolute inset-0 pointer-events-none"></div>
        <div className="terminal-line">
          <span className="text-toxic-neon/80">[RESISTANCE_OS v3.2.1]</span>
          <span className="text-white/70"> LOADING INTERFACE...</span>
        </div>
        <div className="terminal-line">
          <span className="text-toxic-neon/80">[ECONOMY_PROTOCOL]</span>
          <span className="text-white/70"> ESTABLISHING SECURE TRANSMISSION...</span>
        </div>
        <div className="terminal-line h-6">
          <span className="text-apocalypse-red/90">[WARNING]</span>
          <span className="text-white/70"> WASTELAND MARKETS UNSTABLE - PRESALE ACCESS REQUIRED</span>
        </div>
        <div className="terminal-line flex items-center h-6 min-h-6">
          <span className="block">
            {displayText}
            {cursorVisible && <span className="cursor">_</span>}
          </span>
        </div>
        
        {isComplete && !isConnected && (
          <div className="terminal-line mt-4">
            <div className="text-white/70 mb-4">SELECT YOUR ROLE IN THE NEW ECONOMY TO ACCESS THE RESISTANCE NETWORK:</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div 
                className={`p-4 border rounded-md cursor-pointer transition-all ${
                  selectedRole === "bounty-hunter" 
                    ? "border-apocalypse-red bg-black/60 text-apocalypse-red" 
                    : "border-white/20 bg-black/40 text-white/60 hover:border-white/40 hover:text-white/80"
                }`}
                onClick={() => onRoleSelect?.("bounty-hunter")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5" />
                  <span className="font-bold">BOUNTY HUNTER</span>
                </div>
                <p className="text-sm">
                  Track down toxic asset holders and capture their digital signatures for rewards. 
                  Earn RD tokens by helping purge the wasteland of dangerous protocols.
                </p>
              </div>
              
              <div 
                className={`p-4 border rounded-md cursor-pointer transition-all ${
                  selectedRole === "survivor" 
                    ? "border-toxic-neon bg-black/60 text-toxic-neon" 
                    : "border-white/20 bg-black/40 text-white/60 hover:border-white/40 hover:text-white/80"
                }`}
                onClick={() => onRoleSelect?.("survivor")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-bold">SURVIVOR</span>
                </div>
                <p className="text-sm">
                  Join settlement trade networks and contribute to economic rebuilding.
                  Participate in the new token economy through resource allocation governance.
                </p>
              </div>
            </div>
            
            {selectedRole && (
              <ToxicButton
                onClick={onConnect}
                className="w-full mt-2 bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
              >
                <Radiation className="w-4 h-4 mr-2 text-toxic-neon" />
                <span className="flash-beacon">ACTIVATE {selectedRole.toUpperCase()} PROTOCOL</span>
              </ToxicButton>
            )}
          </div>
        )}
        
        {isConnected && (
          <div className="terminal-line mt-4 text-toxic-neon">
            <span>[CONNECTED]</span> <span className="text-white/70">ECONOMY ACCESS GRANTED - WELCOME TO THE NEW FINANCIAL SYSTEM</span>
            {selectedRole && (
              <div className="mt-2 text-white/70">
                ROLE VERIFIED: <span className="text-toxic-neon">{selectedRole === "bounty-hunter" ? "BOUNTY HUNTER" : "SURVIVOR"}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
