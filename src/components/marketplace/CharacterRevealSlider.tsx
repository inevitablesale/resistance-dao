
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
  
  const handleChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };
  
  // Get the description text based on reveal value
  // Reversed logic: Low value = more radiation, high value = less radiation
  const getRevealDescription = (revealValue: number) => {
    if (revealValue < 10) {
      return "Character fully visible, minimal radiation";
    } else if (revealValue < 25) {
      return "Character mostly revealed, slight radiation haze";
    } else if (revealValue < 40) {
      return "Character features clearly visible through radiation";
    } else if (revealValue < 60) {
      return "Character features becoming obscured by radiation";
    } else if (revealValue < 75) {
      return "Radiation increasing, character partially obscured";
    } else if (revealValue < 90) {
      return "Character silhouette barely visible through dense radiation";
    } else {
      return "Fully obscured by toxic radiation cloud";
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
          <span className="text-sm text-toxic-neon font-mono">RADIATION LEVEL</span>
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
          value={[value]}
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
