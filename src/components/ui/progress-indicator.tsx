
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressStage {
  id: string;
  label: string;
  completed: boolean;
}

interface ProgressIndicatorProps {
  stages: ProgressStage[];
  className?: string;
}

export function ProgressIndicator({ stages, className }: ProgressIndicatorProps) {
  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <div className="flex flex-col items-center justify-center">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  stage.completed 
                    ? "bg-toxic-neon border-toxic-neon text-black" 
                    : "bg-black border-toxic-neon/40 text-toxic-neon/40"
                )}
              >
                {stage.completed ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <span 
                className={cn(
                  "text-xs mt-1 font-mono transition-colors duration-300",
                  stage.completed ? "text-toxic-neon" : "text-toxic-neon/40"
                )}
              >
                {stage.label}
              </span>
            </div>
            
            {index < stages.length - 1 && (
              <div 
                className={cn(
                  "h-0.5 flex-1 mx-2 transition-all duration-500",
                  stages[index + 1].completed 
                    ? "bg-toxic-neon" 
                    : stage.completed 
                      ? "bg-gradient-to-r from-toxic-neon to-toxic-neon/10" 
                      : "bg-toxic-neon/20"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
