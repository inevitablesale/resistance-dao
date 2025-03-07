
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Radiation, Biohazard, Skull, Zap, Shield } from "lucide-react";

interface DrippingSlimeProps {
  position?: 'top' | 'bottom' | 'both' | 'left' | 'right' | 'all';
  dripsCount?: number;
  className?: string;
  showIcons?: boolean;
  postApocalyptic?: boolean;
  toxicGreen?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  zIndex?: number;
  puddleCount?: number;
}

export function DrippingSlime({ 
  position = 'top', 
  dripsCount = 8,
  className,
  showIcons = false,
  postApocalyptic = false,
  toxicGreen = true,
  intensity = 'medium',
  zIndex = 10,
  puddleCount = 0
}: DrippingSlimeProps) {
  const topDripsRef = useRef<HTMLDivElement>(null);
  const bottomDripsRef = useRef<HTMLDivElement>(null);
  const leftDripsRef = useRef<HTMLDivElement>(null);
  const rightDripsRef = useRef<HTMLDivElement>(null);
  const puddlesRef = useRef<HTMLDivElement>(null);
  
  // Adjust drip count based on intensity
  const getDripCount = () => {
    const baseCount = dripsCount;
    switch(intensity) {
      case 'low': return Math.max(3, Math.floor(baseCount * 0.5));
      case 'high': return Math.floor(baseCount * 1.8);
      default: return baseCount;
    }
  };

  const adjustedDripCount = getDripCount();
  
  useEffect(() => {
    // Create drips based on position
    if ((position === 'top' || position === 'both' || position === 'all') && topDripsRef.current) {
      createDrips(topDripsRef.current, adjustedDripCount);
    }
    
    if ((position === 'bottom' || position === 'both' || position === 'all') && bottomDripsRef.current) {
      createDrips(bottomDripsRef.current, Math.floor(adjustedDripCount * 0.7));
    }

    if ((position === 'left' || position === 'all') && leftDripsRef.current) {
      createSideDrips(leftDripsRef.current, Math.floor(adjustedDripCount * 0.6), 'left');
    }

    if ((position === 'right' || position === 'all') && rightDripsRef.current) {
      createSideDrips(rightDripsRef.current, Math.floor(adjustedDripCount * 0.6), 'right');
    }

    // Create puddles if specified
    if (puddleCount > 0 && puddlesRef.current) {
      createPuddles(puddlesRef.current, puddleCount);
    }
  }, [position, adjustedDripCount, puddleCount, intensity]);
  
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
      const duration = getAnimationDuration(intensity);
      
      drip.style.left = `${left}%`;
      drip.style.animationDelay = `${delay}s`;
      drip.style.animationDuration = `${duration}s`;
      drip.style.width = `${getDripWidth(intensity)}px`;
      
      container.appendChild(drip);
    }
  };

  const createSideDrips = (container: HTMLDivElement, count: number, side: 'left' | 'right') => {
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
      const drip = document.createElement('div');
      
      if (toxicGreen) {
        drip.className = 'side-drip toxic-green';
        drip.style.background = 'rgba(57, 255, 20, 0.7)';
        drip.style.filter = 'drop-shadow(0 0 5px rgba(57, 255, 20, 0.4))';
      } else if (postApocalyptic) {
        drip.className = 'side-drip post-apocalyptic';
      } else {
        drip.className = 'side-drip';
      }
      
      // Randomize drip properties
      const top = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = getAnimationDuration(intensity);
      
      drip.style.top = `${top}%`;
      drip.style.animationDelay = `${delay}s`;
      drip.style.animationDuration = `${duration}s`;
      drip.style.height = `${getDripWidth(intensity)}px`;
      
      container.appendChild(drip);
    }
  };

  const createPuddles = (container: HTMLDivElement, count: number) => {
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
      const puddle = document.createElement('div');
      
      if (toxicGreen) {
        puddle.className = 'toxic-puddle toxic-green';
        puddle.style.background = 'rgba(57, 255, 20, 0.4)';
      } else if (postApocalyptic) {
        puddle.className = 'toxic-puddle post-apocalyptic';
      } else {
        puddle.className = 'toxic-puddle';
      }
      
      // Randomize puddle properties
      const left = Math.random() * 90 + 5; // Keep away from extreme edges
      const width = 20 + Math.random() * 60;
      const delay = Math.random() * 3;
      
      puddle.style.left = `${left}%`;
      puddle.style.width = `${width}px`;
      puddle.style.animationDelay = `${delay}s`;
      
      container.appendChild(puddle);
    }
  };
  
  const getDripWidth = (intensity: 'low' | 'medium' | 'high') => {
    switch(intensity) {
      case 'low': return 3 + Math.random() * 5;
      case 'high': return 7 + Math.random() * 10;
      default: return 5 + Math.random() * 8;
    }
  };
  
  const getAnimationDuration = (intensity: 'low' | 'medium' | 'high') => {
    switch(intensity) {
      case 'low': return 6 + Math.random() * 6;
      case 'high': return 3 + Math.random() * 3;
      default: return 4 + Math.random() * 5;
    }
  };
  
  const iconColor = toxicGreen ? "text-toxic-neon" : (postApocalyptic ? "text-red-400" : "text-toxic-neon");
  const iconGlowClass = toxicGreen ? "toxic-glow" : (postApocalyptic ? "red-glow" : "toxic-glow");
  
  return (
    <div className={cn("dripping-container", className)} style={{ zIndex: zIndex }}>
      {(position === 'top' || position === 'both' || position === 'all') && 
        <div ref={topDripsRef} className={
          toxicGreen ? "toxic-drips-top toxic-green" : 
          (postApocalyptic ? "toxic-drips-top post-apocalyptic" : "toxic-drips-top")
        }></div>}
      
      {(position === 'bottom' || position === 'both' || position === 'all') && 
        <div ref={bottomDripsRef} className={
          toxicGreen ? "toxic-drips-bottom toxic-green" : 
          (postApocalyptic ? "toxic-drips-bottom post-apocalyptic" : "toxic-drips-bottom")
        }></div>}

      {(position === 'left' || position === 'all') && 
        <div ref={leftDripsRef} className={
          toxicGreen ? "toxic-drips-left toxic-green" : 
          (postApocalyptic ? "toxic-drips-left post-apocalyptic" : "toxic-drips-left")
        }></div>}

      {(position === 'right' || position === 'all') && 
        <div ref={rightDripsRef} className={
          toxicGreen ? "toxic-drips-right toxic-green" : 
          (postApocalyptic ? "toxic-drips-right post-apocalyptic" : "toxic-drips-right")
        }></div>}

      {puddleCount > 0 && 
        <div ref={puddlesRef} className="toxic-puddles-container"></div>}
        
      {showIcons && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <Radiation className={`w-8 h-8 ${iconColor} ${iconGlowClass}`} />
          </div>
          <div className="absolute top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2">
            <Biohazard className={`w-6 h-6 ${iconColor} ${iconGlowClass}`} />
          </div>
          <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 translate-y-1/2">
            <Skull className={`w-7 h-7 ${iconColor} ${iconGlowClass}`} />
          </div>
          <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2">
            <Zap className={`w-5 h-5 ${iconColor} ${iconGlowClass}`} />
          </div>
        </div>
      )}
    </div>
  );
}

export function ToxicPuddle({ 
  className, 
  postApocalyptic = false,
  toxicGreen = true,
  size = 'medium',
  pulsate = true
}: { 
  className?: string, 
  postApocalyptic?: boolean,
  toxicGreen?: boolean,
  size?: 'small' | 'medium' | 'large',
  pulsate?: boolean
}) {
  const puddleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (puddleRef.current) {
      // Determine size based on the size prop
      let width;
      switch(size) {
        case 'small': width = 15 + Math.random() * 20; break;
        case 'large': width = 50 + Math.random() * 70; break;
        default: width = 30 + Math.random() * 50;
      }
      
      puddleRef.current.style.width = `${width}px`;
      puddleRef.current.style.left = `${Math.random() * 80}%`;
      puddleRef.current.style.animationDelay = `${Math.random() * 2}s`;
      
      if (toxicGreen) {
        puddleRef.current.style.background = 'rgba(57, 255, 20, 0.4)';
      }
      
      // Disable animation if pulsate is false
      if (!pulsate) {
        puddleRef.current.style.animation = 'none';
      }
    }
  }, [size, pulsate]);
  
  let puddleClass = "toxic-puddle";
  if (toxicGreen) {
    puddleClass = "toxic-puddle toxic-green";
  } else if (postApocalyptic) {
    puddleClass = "toxic-puddle post-apocalyptic";
  }
  
  if (!pulsate) {
    puddleClass += " no-pulse";
  }
  
  return <div ref={puddleRef} className={cn(puddleClass, className)}></div>;
}
