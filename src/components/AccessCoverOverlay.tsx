
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export const AccessCoverOverlay = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed right-4 top-4 z-[101] text-white hover:text-white bg-red-500/80 hover:bg-red-600/80 p-8 rounded-full shadow-lg"
        onClick={() => setIsOpen(false)}
      >
        <X className="h-10 w-10" />
      </Button>

      <div className="container max-w-4xl mx-auto px-4 h-full flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300">
              The Resistance is Back<br />Original Holders Welcome Home
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              As one of our original NFT holders, you have exclusive early access to the next evolution of Resistance DAO
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lifetime Access</h3>
              <p className="text-white/60">Free lifetime access to Resistance DAO</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Priority Access</h3>
              <p className="text-white/60">Early access to all proposal pre-sales</p>
            </motion.div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-white/80 text-lg">
                New members can join the revolution by minting an access pass.
              </p>
            </div>

            <p className="text-white/40 text-sm">
              Development mode: Click X to temporarily dismiss this overlay
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
