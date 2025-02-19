
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { motion } from "framer-motion";
import { Wallet, ArrowRight, Coins } from "lucide-react";
import { ethers } from "ethers";

interface WalletConnectionOverlayProps {
  requiredAmount: ethers.BigNumberish;
}

export const WalletConnectionOverlay = ({ requiredAmount }: WalletConnectionOverlayProps) => {
  const { connect } = useWalletConnection();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full bg-black/60 border border-white/10 rounded-lg p-8 backdrop-blur-sm"
        >
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-yellow-500/20 to-teal-500/20 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-yellow-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
              <p className="text-gray-400">
                Connect your wallet to submit an investment thesis proposal
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-yellow-500">
                <Coins className="w-5 h-5" />
                <span className="font-medium">Submission Fee</span>
              </div>
              <p className="text-sm text-white/60">
                A fee of {ethers.utils.formatEther(requiredAmount)} LGR tokens is required to submit a proposal. This helps ensure quality submissions and community engagement.
              </p>
            </div>

            <Button
              onClick={connect}
              className="w-full h-12 bg-gradient-to-r from-yellow-500 to-teal-500 hover:from-yellow-600 hover:to-teal-600 text-white font-medium transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <span>Connect Wallet</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
