
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ArrowRight, FileText, Pencil } from 'lucide-react';
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
        "flex flex-col gap-3 bg-black/60 backdrop-blur-sm border border-toxic-neon/30 rounded-lg p-4 max-w-[280px]",
        "font-mono text-sm",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-toxic-neon/20 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-toxic-neon" />
          <span className="text-toxic-neon text-xs uppercase tracking-wider">SURVIVOR JOURNAL</span>
        </div>
        <span className="text-xs text-white/50">DAY {Math.floor(Math.random() * 300) + 100}</span>
      </div>
      
      {stages.map((stage, index) => (
        <motion.div 
          key={stage.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 + 0.5 }}
          className={cn(
            "flex items-start gap-3 relative",
            stage.completed ? "text-toxic-neon" : "text-white/40"
          )}
        >
          <div className={cn(
            "flex-shrink-0 h-6 w-6 border rounded-full flex items-center justify-center mt-0.5",
            stage.completed ? "border-toxic-neon" : "border-white/30"
          )}>
            {stage.completed ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
          </div>
          
          <div className="flex-1">
            <p className={cn(
              "font-mono tracking-tight leading-tight",
              stage.completed 
                ? "text-toxic-neon font-medium" 
                : "text-white/60"
            )}>
              {stage.label}
            </p>
            
            {stage.completed && (
              <p className="text-[10px] text-toxic-neon/60 mt-1 italic">
                {getRandomJournalEntry(stage.id)}
              </p>
            )}
          </div>
          
          {index < stages.length - 1 && (
            <div className={cn(
              "absolute left-3 top-6 bottom-0 w-[1px] h-[calc(100%+8px)]",
              stage.completed ? "bg-toxic-neon/40" : "bg-white/20"
            )}/>
          )}
        </motion.div>
      ))}
      
      <div className="text-[10px] text-white/50 mt-1 flex items-center">
        <Pencil className="h-3 w-3 mr-1 inline" /> 
        <span className="animate-pulse">Recording wasteland data...</span>
      </div>
    </motion.div>
  );
}

// Helper function to generate random journal entries
function getRandomJournalEntry(stageId: string): string {
  const entries = {
    "boot": [
      "Terminal connection established through old military hardware.",
      "Rebooted the emergency system. Power reserves at 42%.",
      "Found working terminal in abandoned bunker. Still functional!",
    ],
    "breach": [
      "Bypassed security protocols. Signs of recent activity.",
      "System breach successful. Need to be careful from here.",
      "Data corruption detected. Had to hack my way through.",
    ],
    "desktop": [
      "Accessed Resistance Network interface. Feels safer already.",
      "Network scan shows 3 other survivors in the area.",
      "Found maps of safe zones in the system files.",
    ],
    "role": [
      "Made contact with Resistance leadership. Awaiting orders.",
      "Selected my role. Hope I made the right choice.",
      "Found my purpose in this wasteland. There's still hope.",
    ],
  };
  
  const entriesForStage = entries[stageId as keyof typeof entries] || [];
  if (entriesForStage.length === 0) return "Entry recorded in journal.";
  
  return entriesForStage[Math.floor(Math.random() * entriesForStage.length)];
}
