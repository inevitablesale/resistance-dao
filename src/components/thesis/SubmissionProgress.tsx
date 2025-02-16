
import { cn } from "@/lib/utils";
import { Check, Loader2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export interface SubmissionStep {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
}

interface SubmissionProgressProps {
  steps: SubmissionStep[];
  currentStepId: string;
}

export const SubmissionProgress = ({ steps, currentStepId }: SubmissionProgressProps) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isCurrent = step.id === currentStepId;
        
        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-4 rounded-lg border transition-colors",
              isCurrent ? "border-polygon-primary bg-polygon-primary/5" : 
              step.status === 'completed' ? "border-green-500/20 bg-green-500/5" :
              step.status === 'failed' ? "border-red-500/20 bg-red-500/5" :
              "border-white/10 bg-white/5"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                isCurrent ? "bg-polygon-primary text-white" :
                step.status === 'completed' ? "bg-green-500 text-white" :
                step.status === 'failed' ? "bg-red-500 text-white" :
                "bg-white/10 text-white/60"
              )}>
                {step.status === 'processing' && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {step.status === 'completed' && (
                  <Check className="w-4 h-4" />
                )}
                {step.status === 'failed' && (
                  <AlertTriangle className="w-4 h-4" />
                )}
                {step.status === 'pending' && (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className={cn(
                  "text-sm font-medium",
                  isCurrent ? "text-polygon-primary" :
                  step.status === 'completed' ? "text-green-500" :
                  step.status === 'failed' ? "text-red-500" :
                  "text-white/60"
                )}>
                  {step.title}
                </h3>
                <p className="text-sm text-white/60">{step.description}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
