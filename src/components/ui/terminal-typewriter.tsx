
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
  const [bootSequence, setBootSequence] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Boot sequence lines
  const bootLines = [
    "[RESISTANCE_OS v3.2.1] LOADING INTERFACE...",
    "[SURVIVAL_PROTOCOL] ESTABLISHING SECURE TRANSMISSION...",
    "[WARNING] WASTELAND RADIATION LEVELS CRITICAL - ENCRYPTION REQUIRED"
  ];
  
  // Handle boot sequence animation
  useEffect(() => {
    if (bootSequence < bootLines.length) {
      const timer = setTimeout(() => {
        setBootSequence(prev => prev + 1);
      }, 1000); // 1 second delay between boot sequence lines
      
      return () => clearTimeout(timer);
    }
  }, [bootSequence, bootLines.length]);
  
  // Handle message typing animation after boot sequence completes
  useEffect(() => {
    if (bootSequence >= bootLines.length) {
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
  }, [textToType, typeDelay, bootSequence, bootLines.length]);
  
  // Handle cursor blinking
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
        
        {/* Boot sequence lines with increased vertical spacing */}
        <div className="space-y-4">
          {bootLines.slice(0, bootSequence).map((line, index) => (
            <div key={index} className="terminal-line">
              <span className={index === 2 ? "text-apocalypse-red/90" : "text-toxic-neon/80"}>
                {line.split("] ")[0]}]
              </span>
              <span className="text-white/70"> {line.split("] ")[1]}</span>
            </div>
          ))}
          
          {/* Main message typing animation */}
          {bootSequence >= bootLines.length && (
            <div className="terminal-line h-6 mt-4">
              <span className="block">
                {displayText}
                {cursorVisible && <span className="cursor">_</span>}
              </span>
            </div>
          )}
        </div>
        
        {/* Always show the Activate Survivor Beacon button */}
        <div className="terminal-line mt-8">
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
        
        {/* Connected state display */}
        {isConnected && (
          <div className="terminal-line mt-6 text-toxic-neon">
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
