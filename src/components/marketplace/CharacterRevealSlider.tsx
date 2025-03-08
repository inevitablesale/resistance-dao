
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

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
  const handleChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EyeOff className="h-4 w-4 text-toxic-neon" />
          <span className="text-sm text-toxic-neon font-mono">REVEAL CHARACTER</span>
        </div>
        <span className="text-sm text-toxic-neon font-mono">{value}%</span>
      </div>
      
      <div className="flex items-center gap-3">
        <EyeOff className="h-5 w-5 text-white/50" />
        <Slider
          value={[value]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleChange}
          className="flex-1"
        />
        <Eye className="h-5 w-5 text-white/50" />
      </div>
      
      <div className="mt-2 text-xs text-toxic-muted text-center">
        {value < 20 ? (
          "Heavy radiation obscuring view"
        ) : value < 50 ? (
          "Partially visible through radiation"
        ) : value < 80 ? (
          "Character features becoming clear"
        ) : (
          "Full character reveal"
        )}
      </div>
    </div>
  );
};
