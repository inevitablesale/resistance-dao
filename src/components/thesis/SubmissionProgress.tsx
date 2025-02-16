
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

export const SubmissionProgress = ({
  steps,
  currentStepId
}: SubmissionProgressProps) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isCurrent = step.id === currentStepId;
        
        return (
          <div key={step.id} className={cn(
            "flex items-center gap-4 p-4 rounded-lg",
            isCurrent ? "bg-white/5" : "opacity-60"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              step.status === 'completed' ? "bg-green-500/20" : 
              step.status === 'processing' ? "bg-blue-500/20" :
              step.status === 'failed' ? "bg-red-500/20" :
              "bg-white/10"
            )}>
              {step.status === 'completed' && (
                <Check className="w-5 h-5 text-green-400" />
              )}
              {step.status === 'processing' && (
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              )}
              {step.status === 'failed' && (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              )}
              {step.status === 'pending' && (
                <span className="text-white/60">{index + 1}</span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">
                {step.title}
              </h3>
              <p className="text-sm text-white/60">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
