
import React from "react";
import { AlertTriangle, Radio, X } from "lucide-react";
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
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="text-apocalypse-red w-6 h-6" />
                  <h2 className="text-apocalypse-red text-xl font-mono">NETWORK STATUS: CRITICAL</h2>
                </div>
                
                <div className="border-t border-apocalypse-red/30 pt-4 mb-4">
                  <h3 className="text-white font-mono mb-2">EMERGENCY TRANSMISSION:</h3>
                  <div className="flex items-center gap-2 text-white/70 mb-2 text-sm">
                    <div className="w-3 h-3 bg-apocalypse-red/70 rounded-full animate-pulse"></div>
                    <span>[SIGNAL WEAK]</span>
                  </div>
                  <p className="font-mono text-white/80 mb-4 border-l-2 border-apocalypse-red/40 pl-3">
                    SURVIVORS DETECTED... IF YOU CAN READ THIS, YOU'RE STILL ALIVE. WE'VE BEEN SEARCHING FOR OTHERS SINCE THE COLLAPSE...
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <Button variant="destructive" className="w-full" onClick={onClose}>
                    <Radio className="w-4 h-4 mr-2" />
                    CONNECT TO NETWORK
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
