
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface NeonSignProps {
  text?: string;
  firstLine?: string;
  secondLine?: string;
  className?: string;
  flickerIntensity?: 'low' | 'medium' | 'high';
}

export const NeonSign = ({ 
  text,
  firstLine = "THE",
  secondLine = "RESISTANCE", 
  className, 
  flickerIntensity = 'medium' 
}: NeonSignProps) => {
  const [flickerState, setFlickerState] = useState<Array<0 | 0.5 | 1>>([]);
  const combinedText = text || (firstLine + secondLine);
  
  useEffect(() => {
    // Create initial flicker state for each letter (fully lit)
    setFlickerState(Array(combinedText.length).fill(1));
    
    // Set up the flicker interval with slower timing
    const intensityMap = {
      low: 2000,     // Slower flicker for more realistic broken neon
      medium: 1500,
      high: 1000
    };
    
    // Main flicker interval - occasionally dim random letters
    const flickerInterval = setInterval(() => {
      setFlickerState(prev => {
        // Most letters stay on, only a few change
        return prev.map(state => Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : 0.5) : state);
      });
    }, intensityMap[flickerIntensity]);
    
    // Special effect interval - one letter completely out, one at half brightness
    const specialEffectInterval = setInterval(() => {
      setFlickerState(prev => {
        const newState = [...prev];
        // Pick a random letter to turn completely off
        const offIndex = Math.floor(Math.random() * combinedText.length);
        // Pick another random letter for half brightness
        let halfIndex;
        do {
          halfIndex = Math.floor(Math.random() * combinedText.length);
        } while (halfIndex === offIndex); // Ensure they're not the same letter
        
        // Set the states
        newState[offIndex] = 0;     // Completely off
        newState[halfIndex] = 0.5;  // Half brightness
        
        return newState;
      });
    }, 2500); // Slower interval for the special effect
    
    return () => {
      clearInterval(flickerInterval);
      clearInterval(specialEffectInterval);
    };
  }, [combinedText, flickerIntensity]);
  
  const getStyleForState = (state: 0 | 0.5 | 1) => {
    switch(state) {
      case 0:   // Completely off
        return {
          opacity: "0.3",
          textShadow: "none"
        };
      case 0.5: // Half lit
        return {
          opacity: "0.7", 
          textShadow: "0 0 3px #39FF14, 0 0 5px #39FF14"
        };
      case 1:   // Fully lit
      default:
        return {
          opacity: "1", 
          textShadow: "0 0 5px #39FF14, 0 0 10px #39FF14, 0 0 20px #39FF14"
        };
    }
  };
  
  const renderNeonText = (line: string, offset: number = 0) => {
    return line.split('').map((char, index) => {
      const absoluteIndex = index + offset;
      const state = flickerState[absoluteIndex] || 1;
      const style = getStyleForState(state);
      
      return (
        <span 
          key={`${char}-${absoluteIndex}`} 
          className={cn(
            "inline-block relative toxic-glow transition-opacity duration-300",
            "text-toxic-neon"
          )}
          style={{
            ...style,
            transition: "text-shadow 0.4s ease-out, opacity 0.3s ease-out"
          }}
        >
          {/* Sparks effect only on fully lit letters occasionally */}
          {state === 1 && Math.random() > 0.95 && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-toxic-neon rounded-full animation-delay-300 animate-ping"></span>
          )}
          {char}
        </span>
      );
    });
  };
  
  return (
    <div className={cn(
      "font-mono relative text-center py-4",
      className
    )}>
      {/* Dirty neon tube background */}
      <div className="absolute inset-0 bg-black/20 rounded-lg filter blur-sm"></div>
      
      {/* Broken glass effect */}
      <div className="absolute inset-0 rounded-lg broken-glass opacity-10"></div>
      
      {text ? (
        // Single text prop handling
        <h1 className="text-6xl md:text-8xl tracking-wider">
          {renderNeonText(text)}
        </h1>
      ) : (
        // Two-line display
        <>
          <h1 className="text-5xl md:text-7xl tracking-wider mb-0 md:mb-1 leading-tight">
            {renderNeonText(firstLine)}
          </h1>
          <h1 className="text-5xl md:text-7xl tracking-wider leading-tight">
            {renderNeonText(secondLine, firstLine.length)}
          </h1>
        </>
      )}
      
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
    </div>
  );
};
