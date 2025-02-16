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
  return <div className="space-y-4">
      {steps.map((step, index) => {
      const isCurrent = step.id === currentStepId;
      return;
    })}
    </div>;
};