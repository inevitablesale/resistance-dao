
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
  textToType = "SURVIVORS DETECTED... IF YOU CAN READ THIS, YOU'RE STILL ALIVE. WE'VE BEEN SEARCHING FOR OTHERS SINCE THE COLLAPSE. THE CRYPTO NUCLEAR WINTER KILLED 90% OF PROTOCOLS. THOSE WHO REMAIN HAVE ADAPTED TO THE HARSH NEW REALITY. WE'VE BUILT SHELTERS FROM THE FALLOUT, PRESERVING WHAT'S LEFT OF DECENTRALIZED TECHNOLOGY. OUR COMMUNITY HAS GOOD NEWS TO REPORT. WE ARE WINNING THE WAR.",
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
          <span className="text-toxic-neon/80">[SURVIVAL_PROTOCOL]</span>
          <span className="text-white/70"> ESTABLISHING SECURE TRANSMISSION...</span>
        </div>
        <div className="terminal-line h-6">
          <span className="text-apocalypse-red/90">[WARNING]</span>
          <span className="text-white/70"> WASTELAND RADIATION LEVELS CRITICAL - ENCRYPTION REQUIRED</span>
        </div>
        <div className="terminal-line flex items-center h-6 min-h-6">
          <span className="block">
            {displayText}
            {cursorVisible && <span className="cursor">_</span>}
          </span>
        </div>
        
        {isComplete && !isConnected && (
          <div className="terminal-line mt-4">
            {selectedRole ? (
              <div>
                <div className="mb-3 text-white/70">
                  {selectedRole === "bounty-hunter" ? (
                    <span>BOUNTY HUNTER STATUS: <span className="text-toxic-neon">UNVERIFIED</span></span>
                  ) : (
                    <span>SURVIVOR STATUS: <span className="text-toxic-neon">UNVERIFIED</span></span>
                  )}
                </div>
                <ToxicButton
                  onClick={onConnect}
                  className="bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
                >
                  <Radiation className="w-4 h-4 mr-2 text-toxic-neon" />
                  <span className="flash-beacon">ACTIVATE SURVIVAL BEACON</span>
                </ToxicButton>
              </div>
            ) : (
              <div>
                <div className="text-white/70 mb-3">WITHOUT IDENTIFICATION, YOU'RE JUST ANOTHER TARGET IN THE WASTELAND...</div>
                <ToxicButton
                  onClick={onConnect}
                  className="bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
                >
                  <Radiation className="w-4 h-4 mr-2 text-toxic-neon" />
                  <span className="flash-beacon">ACTIVATE SURVIVAL BEACON</span>
                </ToxicButton>
              </div>
            )}
          </div>
        )}
        
        {isConnected && (
          <div className="terminal-line mt-4 text-toxic-neon">
            <span>[CONNECTED]</span> <span className="text-white/70">SURVIVAL BEACON ACTIVE - WELCOME TO THE RESISTANCE</span>
            {selectedRole && (
              <div className="mt-2 text-white/70">
                ROLE IDENTIFIED: <span className="text-toxic-neon">{selectedRole === "bounty-hunter" ? "BOUNTY HUNTER" : "SURVIVOR"}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
