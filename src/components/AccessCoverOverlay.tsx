
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Shield, Rocket, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export const AccessCoverOverlay = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-3xl -top-48 -left-24 animate-pulse" />
          <div className="absolute w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl -bottom-48 -right-24 animate-pulse" />
        </div>
        
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="container max-w-4xl mx-auto px-4 h-full flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8"
            >
              <div className="mb-12">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6"
                >
                  <Shield className="w-10 h-10 text-yellow-500" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300">
                  The Resistance is Back - Original Holders Welcome Home
                </h1>
                <p className="text-xl text-white/80 max-w-2xl mx-auto">
                  As one of our original NFT holders, you have exclusive early access to the next evolution of Resistance DAO.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
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
                  <p className="text-white/60">Free lifetime access to Resistance DAO 2.0</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-teal-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">LGR Airdrop</h3>
                  <p className="text-white/60">10 LGR tokens airdropped for immediate voting power</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Priority Access</h3>
                  <p className="text-white/60">Early access to all proposal pre-sales</p>
                </motion.div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 max-w-2xl mx-auto">
                  <p className="text-white/80 text-lg">
                    New members can join the revolution by minting an access pass for $50 (includes $50 in LGR voting credits).
                  </p>
                </div>

                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-8"
                >
                  Connect Wallet to Access Platform
                </Button>

                <p className="text-white/40 text-sm">
                  Development mode: Click X to temporarily dismiss this overlay
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

