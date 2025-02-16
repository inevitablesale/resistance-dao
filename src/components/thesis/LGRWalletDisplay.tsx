
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, Check, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";

interface LGRWalletDisplayProps {
  submissionFee: string;
  currentBalance?: string;
  walletAddress?: string;
  className?: string;
}

export const LGRWalletDisplay = ({ submissionFee, currentBalance, walletAddress, className }: LGRWalletDisplayProps) => {
  const [showAddress, setShowAddress] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyAddress = async () => {
    if (!walletAddress) return;
    
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={cn(
      "bg-black/40 border-white/10 overflow-hidden",
      className
    )}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Submission Fee</h3>
              <p className="text-2xl font-bold text-purple-400">
                {ethers.utils.formatEther(submissionFee)} LGR
              </p>
            </div>
          </div>
          
          {currentBalance && (
            <div className="text-right">
              <p className="text-sm text-white/60">Your Balance</p>
              <p className="text-lg font-bold text-white">
                {Number(currentBalance).toFixed(2)} LGR
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className={cn(
              "flex-1 bg-white/5 border-white/10 hover:bg-white/10",
              "text-white font-medium",
              showAddress && "bg-white/10"
            )}
            onClick={() => setShowAddress(!showAddress)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Deposit
          </Button>
          
          {walletAddress && (
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
              onClick={handleCopyAddress}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          )}
        </div>

        <AnimatePresence>
          {showAddress && walletAddress && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-white/60 mb-1">Your Wallet Address</p>
                <p className="text-sm text-white break-all font-mono">
                  {walletAddress}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
