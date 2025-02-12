
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, Calendar, X } from "lucide-react";
import { useState } from "react";
import { StepContent } from "./marketplace/StepContent";

interface CreateClientListingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateClientListingOverlay({ isOpen, onClose }: CreateClientListingOverlayProps) {
  const [durationType, setDurationType] = useState<'short-term' | 'long-term' | ''>('');
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) {
      onClose();
    } else {
      setCurrentStep(currentStep - 1);
      if (currentStep === 1) {
        setDurationType('');
      }
    }
  };

  const renderInitialStep = () => (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-semibold text-white mb-4">
            What type of service arrangement are you looking for?
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setDurationType('short-term');
              handleNext();
            }}
            className={`group relative overflow-hidden rounded-2xl border ${
              durationType === 'short-term' 
                ? 'border-teal-500/50 bg-teal-500/10' 
                : 'border-white/10 hover:border-white/20 bg-white/5'
            } p-8 text-left transition-all duration-200`}
          >
            <div className="relative z-10">
              <div className="mb-6">
                <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4">
                  <Clock className={`h-6 w-6 ${
                    durationType === 'short-term' ? 'text-teal-400' : 'text-white/60'
                  }`} />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Short-Term</h4>
                <p className="text-white/60">
                  Project-based or seasonal work with defined end dates
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setDurationType('long-term');
              handleNext();
            }}
            className={`group relative overflow-hidden rounded-2xl border ${
              durationType === 'long-term' 
                ? 'border-teal-500/50 bg-teal-500/10' 
                : 'border-white/10 hover:border-white/20 bg-white/5'
            } p-8 text-left transition-all duration-200`}
          >
            <div className="relative z-10">
              <div className="mb-6">
                <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4">
                  <Calendar className={`h-6 w-6 ${
                    durationType === 'long-term' ? 'text-teal-400' : 'text-white/60'
                  }`} />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Long-Term</h4>
                <p className="text-white/60">
                  Ongoing service relationship with recurring work
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full bg-[#0a0a0a] border-none p-0 overflow-hidden">
        <DialogTitle className="sr-only">List Service Opportunity</DialogTitle>
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-teal-500/5 via-teal-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-teal-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">List Service Opportunity</h2>
                <p className="text-sm text-white/60">Step {currentStep + 1} of 3</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white/60 hover:text-white"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {currentStep === 0 ? renderInitialStep() : (
          <div className="p-8">
            <StepContent currentStep={currentStep} durationType={durationType} />
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-white/5 p-4 bg-black/50 backdrop-blur-xl">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="text-white/60 hover:text-white"
            >
              Back
            </Button>
            
            {currentStep === 0 ? null : (
              <Button 
                className="min-w-[100px] bg-teal-500 hover:bg-teal-600"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
