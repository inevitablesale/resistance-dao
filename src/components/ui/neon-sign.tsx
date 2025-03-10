
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
  // We'll track flicker state for each line separately
  const [firstLineFlicker, setFirstLineFlicker] = useState<Array<0 | 0.5 | 1>>([]);
  const [secondLineFlicker, setSecondLineFlicker] = useState<Array<0 | 0.5 | 1>>([]);
  
  useEffect(() => {
    // Create initial flicker states for each line (fully lit)
    setFirstLineFlicker(Array(firstLine.length).fill(1));
    setSecondLineFlicker(Array(secondLine.length).fill(1));
    
    // Set up the flicker interval with slower timing
    const intensityMap = {
      low: 2000,     // Slower flicker for more realistic broken neon
      medium: 1500,
      high: 1000
    };
    
    // Main flicker interval - occasionally dim random letters
    const flickerInterval = setInterval(() => {
      setFirstLineFlicker(prev => {
        // Most letters stay on, only a few change
        return prev.map(state => Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : 0.5) : state);
      });
      
      setSecondLineFlicker(prev => {
        // Most letters stay on, only a few change
        return prev.map(state => Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : 0.5) : state);
      });
    }, intensityMap[flickerIntensity]);
    
    // Special effect interval - one letter completely out, one at half brightness in each line
    const specialEffectInterval = setInterval(() => {
      // First line special effect
      if (firstLine.length > 1) {
        setFirstLineFlicker(prev => {
          const newState = [...prev];
          // Pick a random letter to turn completely off
          const offIndex = Math.floor(Math.random() * firstLine.length);
          // Pick another random letter for half brightness
          let halfIndex;
          do {
            halfIndex = Math.floor(Math.random() * firstLine.length);
          } while (halfIndex === offIndex); // Ensure they're not the same letter
          
          // Set the states
          newState[offIndex] = 0;     // Completely off
          newState[halfIndex] = 0.5;  // Half brightness
          
          return newState;
        });
      }
      
      // Second line special effect
      if (secondLine.length > 1) {
        setSecondLineFlicker(prev => {
          const newState = [...prev];
          // Pick a random letter to turn completely off
          const offIndex = Math.floor(Math.random() * secondLine.length);
          // Pick another random letter for half brightness
          let halfIndex;
          do {
            halfIndex = Math.floor(Math.random() * secondLine.length);
          } while (halfIndex === offIndex); // Ensure they're not the same letter
          
          // Set the states
          newState[offIndex] = 0;     // Completely off
          newState[halfIndex] = 0.5;  // Half brightness
          
          return newState;
        });
      }
    }, 2500); // Slower interval for the special effect
    
    return () => {
      clearInterval(flickerInterval);
      clearInterval(specialEffectInterval);
    };
  }, [firstLine, secondLine, flickerIntensity]);
  
  const getStyleForState = (state: 0 | 0.5 | 1) => {
    switch(state) {
      case 0:   // Completely off
        return {
          opacity: "0.3",
          textShadow: "none",
          color: "#222" // Darker color for unlit tubes
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
  
  const renderNeonText = (line: string, flickerStates: Array<0 | 0.5 | 1>) => {
    return line.split('').map((char, index) => {
      const state = flickerStates[index] || 1;
      const style = getStyleForState(state);
      
      return (
        <span 
          key={`${char}-${index}`} 
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
      {/* Dirty neon tube background and wire backing */}
      <div className="absolute inset-0 bg-black/30 rounded-lg filter blur-sm"></div>
      
      {/* Wire backing effect - one above first line, one between lines, one below second line */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
          <div className="h-0.5 w-4/5 bg-gray-500 mb-3 rounded-full"></div>
          <div className="h-0.5 w-4/5 bg-gray-500 my-6 rounded-full"></div>
          <div className="h-0.5 w-4/5 bg-gray-500 mt-3 rounded-full"></div>
        </div>
      </div>
      
      {/* Broken glass effect */}
      <div className="absolute inset-0 rounded-lg broken-glass opacity-10"></div>
      
      {text ? (
        // Single text prop handling
        <h1 className="text-6xl md:text-8xl tracking-wider relative z-10">
          {renderNeonText(text, [...firstLineFlicker, ...secondLineFlicker])}
        </h1>
      ) : (
        // Two-line display with increased vertical spacing
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl tracking-wider mb-6 leading-tight">
            {renderNeonText(firstLine, firstLineFlicker)}
          </h1>
          <h1 className="text-5xl md:text-7xl tracking-wider leading-tight">
            {renderNeonText(secondLine, secondLineFlicker)}
          </h1>
        </div>
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
