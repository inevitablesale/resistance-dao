
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface DrippingSlimeProps {
  position?: 'top' | 'bottom' | 'both';
  dripsCount?: number;
  className?: string;
}

export function DrippingSlime({ 
  position = 'top', 
  dripsCount = 8,
  className 
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
      drip.className = 'drip';
      
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
  
  return (
    <div className={cn("dripping-container", className)}>
      {(position === 'top' || position === 'both') && 
        <div ref={topDripsRef} className="toxic-drips-top"></div>}
      
      {(position === 'bottom' || position === 'both') && 
        <div ref={bottomDripsRef} className="toxic-drips-bottom"></div>}
    </div>
  );
}

export function ToxicPuddle({ className }: { className?: string }) {
  const puddleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (puddleRef.current) {
      const width = 30 + Math.random() * 50;
      puddleRef.current.style.width = `${width}px`;
      puddleRef.current.style.left = `${Math.random() * 80}%`;
      puddleRef.current.style.animationDelay = `${Math.random() * 2}s`;
    }
  }, []);
  
  return <div ref={puddleRef} className={cn("toxic-puddle", className)}></div>;
}
