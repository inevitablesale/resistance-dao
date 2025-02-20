
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface Step {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'completed';
}

interface TransactionFlowProps {
  steps: Step[];
  activeStep: string;
}

export const TransactionFlow = ({ steps, activeStep }: TransactionFlowProps) => {
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`
              flex items-center gap-2
              ${step.status === 'completed' ? 'text-green-500' : 
                step.status === 'active' ? 'text-yellow-500' : 
                'text-white/40'}
            `}>
              {step.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <div className={`
                  w-5 h-5 rounded-full border-2
                  ${step.status === 'active' ? 'border-yellow-500' : 'border-white/40'}
                `} />
              )}
              <span className="text-sm font-medium">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-5 h-5 mx-4 text-white/20" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
