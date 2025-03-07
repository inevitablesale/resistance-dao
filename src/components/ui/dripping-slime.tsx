
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Radiation, Biohazard, Skull, Zap, Shield } from "lucide-react";

interface DrippingSlimeProps {
  position?: 'top' | 'bottom' | 'both';
  dripsCount?: number;
  className?: string;
  showIcons?: boolean;
  postApocalyptic?: boolean;
}

export function DrippingSlime({ 
  position = 'top', 
  dripsCount = 8,
  className,
  showIcons = false,
  postApocalyptic = false
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
      drip.className = postApocalyptic ? 'drip post-apocalyptic' : 'drip';
      
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
  
  const iconColor = postApocalyptic ? "text-yellow-300" : "text-toxic-neon";
  const iconGlowClass = postApocalyptic ? "yellow-glow" : "toxic-glow";
  
  return (
    <div className={cn("dripping-container", className)}>
      {(position === 'top' || position === 'both') && 
        <div ref={topDripsRef} className={postApocalyptic ? "toxic-drips-top post-apocalyptic" : "toxic-drips-top"}></div>}
      
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
            left: '30%', 
            animationDelay: '2.5s',
            top: position === 'bottom' ? 'auto' : '40%',
            bottom: position === 'bottom' ? '50%' : 'auto'
          }}>
            <Skull className={`h-6 w-6 ${iconColor} animate-pulse ${iconGlowClass}`} />
          </div>
          <div className="toxic-symbol" style={{ 
            left: '55%', 
            animationDelay: '1.5s',
            top: position === 'bottom' ? 'auto' : '15%',
            bottom: position === 'bottom' ? '30%' : 'auto'
          }}>
            <Zap className={`h-7 w-7 ${iconColor} animate-pulse ${iconGlowClass}`} />
          </div>
          <div className="toxic-symbol" style={{ 
            left: '75%', 
            animationDelay: '3.5s',
            top: position === 'bottom' ? 'auto' : '35%',
            bottom: position === 'bottom' ? '10%' : 'auto'
          }}>
            <Shield className={`h-8 w-8 ${iconColor} animate-pulse ${iconGlowClass}`} />
          </div>
        </div>
      )}
      
      {(position === 'bottom' || position === 'both') && 
        <div ref={bottomDripsRef} className={postApocalyptic ? "toxic-drips-bottom post-apocalyptic" : "toxic-drips-bottom"}></div>}
    </div>
  );
}

export function ToxicPuddle({ className, postApocalyptic = false }: { className?: string, postApocalyptic?: boolean }) {
  const puddleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (puddleRef.current) {
      const width = 30 + Math.random() * 50;
      puddleRef.current.style.width = `${width}px`;
      puddleRef.current.style.left = `${Math.random() * 80}%`;
      puddleRef.current.style.animationDelay = `${Math.random() * 2}s`;
    }
  }, []);
  
  const puddleClass = postApocalyptic ? "toxic-puddle post-apocalyptic" : "toxic-puddle";
  
  return <div ref={puddleRef} className={cn(puddleClass, className)}></div>;
}
