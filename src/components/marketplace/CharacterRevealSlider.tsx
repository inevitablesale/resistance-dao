
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface CharacterRevealSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const CharacterRevealSlider: React.FC<CharacterRevealSliderProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isIncreasing, setIsIncreasing] = useState<boolean | null>(null);
  const [animateLabel, setAnimateLabel] = useState(false);
  
  useEffect(() => {
    // Detect direction of change
    if (value !== prevValue) {
      setIsIncreasing(value > prevValue);
      setPrevValue(value);
      
      // Trigger label animation
      setAnimateLabel(true);
      const timer = setTimeout(() => setAnimateLabel(false), 500);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);
  
  // Calculate the character reveal value (inverse of radiation level)
  // Higher radiation = lower reveal, Lower radiation = higher reveal
  const revealValue = 100 - value;
  
  const handleChange = (newValue: number[]) => {
    // Convert slider value (reveal) to radiation level (inverse)
    onChange(100 - newValue[0]);
  };
  
  // Get the description text based on radiation value
  const getRevealDescription = (radiationValue: number) => {
    if (radiationValue > 90) {
      return "Fully obscured by toxic radiation cloud";
    } else if (radiationValue > 75) {
      return "Character silhouette barely visible through radiation";
    } else if (radiationValue > 60) {
      return "Radiation cloud thinning, basic outlines visible";
    } else if (radiationValue > 40) {
      return "Character features becoming distinguishable";
    } else if (radiationValue > 25) {
      return "Radiation dissipating, most features visible";
    } else if (radiationValue > 10) {
      return "Character nearly fully revealed, slight radiation haze";
    } else {
      return "Full character reveal, minimal radiation effects";
    }
  };
  
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {value > 50 ? (
            <EyeOff className="h-4 w-4 text-toxic-neon" />
          ) : (
            <Eye className="h-4 w-4 text-toxic-neon" />
          )}
          <span className="text-sm text-toxic-neon font-mono">RADIATION DISSIPATION</span>
        </div>
        <span className={cn(
          "text-sm font-mono transition-colors duration-300",
          value > 70 ? "text-apocalypse-red" : 
          value > 30 ? "text-yellow-400" : 
          "text-toxic-neon"
        )}>
          {value}%
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <Eye className={cn(
          "h-5 w-5 transition-opacity duration-300",
          value < 30 ? "text-white" : "text-white/50"
        )} />
        <Slider
          value={[revealValue]} // Display the reveal value (inverse of radiation)
          min={0}
          max={100}
          step={1}
          onValueChange={handleChange}
          className={cn(
            "flex-1",
            isIncreasing === true ? "animate-pulse" : "",
            isIncreasing === false ? "animate-pulse" : ""
          )}
        />
        <EyeOff className={cn(
          "h-5 w-5 transition-opacity duration-300",
          value > 70 ? "text-white" : "text-white/50"
        )} />
      </div>
      
      <div className={cn(
        "mt-2 text-xs text-center transition-all duration-300",
        animateLabel ? "scale-105" : "scale-100",
        value > 70 ? "text-apocalypse-red/80" : 
        value > 30 ? "text-yellow-400/80" : 
        "text-toxic-neon/80"
      )}>
        {getRevealDescription(value)}
      </div>
    </div>
  );
};
