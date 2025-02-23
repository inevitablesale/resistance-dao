
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Wallet, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDynamicUtils } from "@/hooks/useDynamicUtils";

export const AccessCoverOverlay = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { connectWallet, isInitializing } = useDynamicUtils();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-black via-blue-950 to-black">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/ca457542-e761-44f2-acbf-1bf9b4255b78.png')] bg-center bg-no-repeat opacity-10 animate-pulse" />
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed right-4 top-4 z-[101] text-white hover:text-white bg-blue-500/20 hover:bg-blue-600/20 p-8 rounded-full shadow-lg backdrop-blur-sm border border-blue-400/20"
        onClick={() => setIsOpen(false)}
      >
        <X className="h-10 w-10" />
      </Button>

      <div className="container max-w-4xl mx-auto px-4 h-full flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8 relative"
        >
          <div className="mb-12 relative">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
              The Resistance is Back<br />Original Holders Welcome Home
            </h1>
            <p className="text-xl text-blue-200/80 max-w-2xl mx-auto">
              As one of our original NFT holders, you have exclusive early access to the next evolution of Resistance DAO
            </p>
          </div>

          <div className="flex justify-center">
            <Button 
              size="lg"
              onClick={connectWallet}
              disabled={isInitializing}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold px-8 py-6 text-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-blue-400/20 group-hover:animate-pulse" />
              {isInitializing ? (
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              ) : (
                <Wallet className="w-6 h-6 mr-3" />
              )}
              Connect Wallet
            </Button>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-950/30 backdrop-blur border border-blue-400/10 rounded-xl p-6 max-w-2xl mx-auto shadow-lg shadow-blue-500/5">
              <p className="text-blue-200/80 text-lg">
                New members can join the revolution by minting an access pass.
              </p>
            </div>

            <p className="text-blue-200/40 text-sm">
              Development mode: Click X to temporarily dismiss this overlay
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
