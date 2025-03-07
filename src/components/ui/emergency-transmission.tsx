
import React from "react";
import { Radio, X } from "lucide-react";
import { Button } from "./button";
import { motion, AnimatePresence } from "framer-motion";

interface EmergencyTransmissionProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyTransmission({ isOpen, onClose }: EmergencyTransmissionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <div className="relative border-2 border-apocalypse-red/60 rounded-md p-4 bg-black/95 shadow-[0_0_30px_rgba(234,56,76,0.2)] backdrop-blur-sm">
              <button 
                onClick={onClose}
                className="absolute top-2 right-2 text-apocalypse-red hover:bg-apocalypse-red/20 p-1 rounded-full"
              >
                <X size={18} />
              </button>
              
              <div className="mb-6">
                <div className="flex justify-center">
                  <Button variant="destructive" className="w-full" onClick={onClose}>
                    <Radio className="w-4 h-4 mr-2" />
                    CONNECT TO RESISTANCE NETWORK
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
