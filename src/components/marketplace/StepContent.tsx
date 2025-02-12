
import { AnimatePresence, motion } from "framer-motion";
import { ShortTermForm } from "./ShortTermForm";
import { LongTermForm } from "./LongTermForm";
import { ShortTermSkills } from "./ShortTermSkills";
import { LongTermSkills } from "./LongTermSkills";

interface StepContentProps {
  currentStep: number;
  durationType: 'short-term' | 'long-term' | '';
}

export function StepContent({ currentStep, durationType }: StepContentProps) {
  const renderContent = () => {
    if (currentStep === 1) {
      return durationType === 'short-term' ? <ShortTermForm /> : <LongTermForm />;
    }
    if (currentStep === 3) {
      return durationType === 'short-term' ? <ShortTermSkills /> : <LongTermSkills />;
    }
    return null;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
}
