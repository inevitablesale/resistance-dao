
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={cn(
        "flex items-center bg-black/60 backdrop-blur-sm border border-toxic-neon/30 rounded-lg p-2",
        className
      )}
    >
      {stages.map((stage, index) => (
        <React.Fragment key={stage.id}>
          <div className="flex items-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.2 + 0.5 }}
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full border",
                stage.completed 
                  ? "bg-toxic-neon/20 border-toxic-neon text-toxic-neon" 
                  : "bg-black/40 border-white/20 text-white/40"
              )}
            >
              {stage.completed ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </motion.div>
            <span className={cn(
              "ml-1 text-xs font-mono hidden sm:inline",
              stage.completed ? "text-toxic-neon" : "text-white/40"
            )}>
              {stage.label}
            </span>
          </div>
          
          {index < stages.length - 1 && (
            <div className={cn(
              "h-[2px] w-4 mx-1",
              stage.completed ? "bg-toxic-neon" : "bg-white/20"
            )}/>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
}
