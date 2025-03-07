
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Radiation, Biohazard, Skull, Zap, Shield } from "lucide-react";

interface DrippingSlimeProps {
  position?: 'top' | 'bottom' | 'both';
  dripsCount?: number;
  className?: string;
  showIcons?: boolean;
  postApocalyptic?: boolean;
  toxicGreen?: boolean;
}

export function DrippingSlime({ 
  position = 'top', 
  dripsCount = 8,
  className,
  showIcons = false,
  postApocalyptic = false,
  toxicGreen = true // Default to true for toxic green
}: DrippingSlimeProps) {
  const topDripsRef = useRef<HTMLDivElement>(null);
  const bottomDripsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create top drips
    if ((position === 'top' || position === 'both') && topDripsRef.current) {
      createDrips(topDripsRef.current, dripsCount);
    }
    
    // Create bottom drips
    if ((position === 'bottom' || position === 'both') && bottomDripsRef.current) {
      createDrips(bottomDripsRef.current, Math.floor(dripsCount * 0.7));
    }
  }, [position, dripsCount]);
  
  const createDrips = (container: HTMLDivElement, count: number) => {
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
      const drip = document.createElement('div');
      
      if (toxicGreen) {
        drip.className = 'drip toxic-green';
        drip.style.background = 'rgba(57, 255, 20, 0.7)';
        drip.style.filter = 'drop-shadow(0 0 5px rgba(57, 255, 20, 0.4))';
      } else if (postApocalyptic) {
        drip.className = 'drip post-apocalyptic';
      } else {
        drip.className = 'drip';
      }
      
      // Randomize drip properties
      const left = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = 4 + Math.random() * 5;
      
      drip.style.left = `${left}%`;
      drip.style.animationDelay = `${delay}s`;
      drip.style.animationDuration = `${duration}s`;
      drip.style.width = `${5 + Math.random() * 8}px`;
      
      container.appendChild(drip);
    }
  };
  
  const iconColor = toxicGreen ? "text-toxic-neon" : (postApocalyptic ? "text-red-400" : "text-toxic-neon");
  const iconGlowClass = toxicGreen ? "toxic-glow" : (postApocalyptic ? "red-glow" : "toxic-glow");
  
  return (
    <div className={cn("dripping-container", className)}>
      {(position === 'top' || position === 'both') && 
        <div ref={topDripsRef} className={
          toxicGreen ? "toxic-drips-top toxic-green" : 
          (postApocalyptic ? "toxic-drips-top post-apocalyptic" : "toxic-drips-top")
        }></div>}
      
      {showIcons && (
        <div className="toxic-symbols">
          <div className="toxic-symbol" style={{ 
            left: '10%', 
            animationDelay: '0.5s',
            top: position === 'bottom' ? 'auto' : '20%',
            bottom: position === 'bottom' ? '20%' : 'auto'
          }}>
            <Radiation className={`h-8 w-8 ${iconColor} animate-pulse ${iconGlowClass}`} />
          </div>
          <div className="toxic-symbol" style={{ 
            left: '25%', 
            animationDelay: '2.5s',
            top: position === 'bottom' ? 'auto' : '40%',
            bottom: position === 'bottom' ? '50%' : 'auto'
          }}>
            <Biohazard className={`h-8 w-8 ${iconColor} animate-pulse ${iconGlowClass}`} />
          </div>
          <div className="toxic-symbol" style={{ 
            left: '40%', 
            animationDelay: '1.5s',
            top: position === 'bottom' ? 'auto' : '15%',
            bottom: position === 'bottom' ? '30%' : 'auto'
          }}>
            <Radiation className={`h-7 w-7 ${iconColor} animate-pulse ${iconGlowClass}`} />
          </div>
          <div className="toxic-symbol" style={{ 
            left: '55%', 
            animationDelay: '1.0s',
            top: position === 'bottom' ? 'auto' : '35%',
            bottom: position === 'bottom' ? '15%' : 'auto'
          }}>
            <Biohazard className={`h-8 w-8 ${iconColor} animate-radiation ${iconGlowClass}`} />
          </div>
          <div className="toxic-symbol" style={{ 
            left: '70%', 
            animationDelay: '3.5s',
            top: position === 'bottom' ? 'auto' : '25%',
            bottom: position === 'bottom' ? '40%' : 'auto'
          }}>
            <Radiation className={`h-8 w-8 ${iconColor} animate-radiation ${iconGlowClass}`} />
          </div>
          <div className="toxic-symbol" style={{ 
            left: '85%', 
            animationDelay: '2.0s',
            top: position === 'bottom' ? 'auto' : '30%',
            bottom: position === 'bottom' ? '10%' : 'auto'
          }}>
            <Biohazard className={`h-7 w-7 ${iconColor} animate-pulse ${iconGlowClass}`} />
          </div>
        </div>
      )}
      
      {(position === 'bottom' || position === 'both') && 
        <div ref={bottomDripsRef} className={
          toxicGreen ? "toxic-drips-bottom toxic-green" : 
          (postApocalyptic ? "toxic-drips-bottom post-apocalyptic" : "toxic-drips-bottom")
        }></div>}
    </div>
  );
}

export function ToxicPuddle({ 
  className, 
  postApocalyptic = false,
  toxicGreen = true 
}: { 
  className?: string, 
  postApocalyptic?: boolean,
  toxicGreen?: boolean 
}) {
  const puddleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (puddleRef.current) {
      const width = 30 + Math.random() * 50;
      puddleRef.current.style.width = `${width}px`;
      puddleRef.current.style.left = `${Math.random() * 80}%`;
      puddleRef.current.style.animationDelay = `${Math.random() * 2}s`;
      
      if (toxicGreen) {
        puddleRef.current.style.background = 'rgba(57, 255, 20, 0.4)';
      }
    }
  }, []);
  
  let puddleClass = "toxic-puddle";
  if (toxicGreen) {
    puddleClass = "toxic-puddle toxic-green";
  } else if (postApocalyptic) {
    puddleClass = "toxic-puddle post-apocalyptic";
  }
  
  return <div ref={puddleRef} className={cn(puddleClass, className)}></div>;
}
