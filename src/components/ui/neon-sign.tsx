
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface NeonSignProps {
  text: string;
  className?: string;
  flickerIntensity?: 'low' | 'medium' | 'high';
}

export const NeonSign = ({ 
  text, 
  className, 
  flickerIntensity = 'medium' 
}: NeonSignProps) => {
  const [flickerState, setFlickerState] = useState<boolean[]>([]);
  
  useEffect(() => {
    // Create initial flicker state for each letter
    setFlickerState(Array(text.length).fill(true));
    
    // Set up the flicker interval
    const intensityMap = {
      low: 1200,
      medium: 800,
      high: 400
    };
    
    const flickerInterval = setInterval(() => {
      setFlickerState(prev => {
        return prev.map(() => Math.random() > 0.2);
      });
    }, intensityMap[flickerIntensity]);
    
    // Random letter flicker for sporadic effect
    const randomFlickerInterval = setInterval(() => {
      setFlickerState(prev => {
        const newState = [...prev];
        const randomIndex = Math.floor(Math.random() * text.length);
        newState[randomIndex] = !newState[randomIndex];
        return newState;
      });
    }, 100);
    
    return () => {
      clearInterval(flickerInterval);
      clearInterval(randomFlickerInterval);
    };
  }, [text, flickerIntensity]);
  
  return (
    <h1 className={cn(
      "font-mono relative text-6xl md:text-8xl tracking-wider py-4",
      className
    )}>
      {/* Dirty neon tube background */}
      <div className="absolute inset-0 bg-black/20 rounded-lg filter blur-sm"></div>
      
      {/* Broken glass effect */}
      <div className="absolute inset-0 rounded-lg broken-glass opacity-10"></div>
      
      {/* Character by character rendering for individual flicker */}
      {text.split('').map((char, index) => (
        <span 
          key={`${char}-${index}`} 
          className={cn(
            "inline-block relative toxic-glow transition-opacity duration-75",
            flickerState[index] 
              ? "text-toxic-neon opacity-100" 
              : "text-toxic-neon/50 opacity-60"
          )}
          style={{
            textShadow: flickerState[index] 
              ? "0 0 5px #39FF14, 0 0 10px #39FF14, 0 0 20px #39FF14" 
              : "0 0 2px #39FF14"
          }}
        >
          {/* Sparks effect on random letters */}
          {Math.random() > 0.96 && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-toxic-neon rounded-full animation-delay-300 animate-ping"></span>
          )}
          {char}
        </span>
      ))}
      
      {/* Additional electrical short circuit effect */}
      <div className="absolute -bottom-2 left-0 right-0 h-0.5 overflow-visible">
        {Array.from({ length: 3 }).map((_, i) => (
          <span 
            key={i}
            className="absolute bottom-0 w-1 h-4 bg-toxic-neon rounded-t opacity-0"
            style={{
              left: `${10 + Math.random() * 80}%`,
              animation: `spark-jump 0.${Math.floor(Math.random() * 8) + 2}s ease-in-out ${Math.random() * 5}s infinite`,
            }}
          ></span>
        ))}
      </div>
    </h1>
  );
};
