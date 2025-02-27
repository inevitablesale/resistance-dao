
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2, Shield, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDynamicUtils } from "@/hooks/useDynamicUtils";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useNFTBalance } from "@/hooks/useNFTBalance";
import { useToast } from "@/hooks/use-toast";
import { NFTPurchaseDialog } from "./wallet/NFTPurchaseDialog";

export const AccessCoverOverlay = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const { connectWallet, isInitializing } = useDynamicUtils();
  const { address } = useCustomWallet();
  const { data: nftBalance = 0, isLoading: isCheckingNFT } = useNFTBalance(address);
  const { toast } = useToast();

  useEffect(() => {
    if (isCheckingNFT) return;
    
    if (address && nftBalance > 0) {
      setShowOptions(true);
    }
  }, [address, nftBalance, isCheckingNFT]);

  const handleGetNFT = () => {
    setIsPurchaseOpen(true);
    setIsOpen(false);
  };

  const handleGiftNFT = () => {
    setIsPurchaseOpen(true);
    setIsOpen(false);
    setShowOptions(false);
  };

  const handleContinueToDapp = () => {
    setIsOpen(false);
    setShowOptions(false);
  };

  const handlePurchaseDialogClose = (open: boolean) => {
    setIsPurchaseOpen(open);
    if (!open && nftBalance === 0) {
      setIsOpen(true);
    }
  };

  if (!isOpen) {
    return (
      <NFTPurchaseDialog 
        open={isPurchaseOpen}
        onOpenChange={handlePurchaseDialogClose}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center overflow-hidden pointer-events-auto">
        <div className="container max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - NFT Display */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent pointer-events-none" />
                <img 
                  src="https://gateway.pinata.cloud/ipfs/bafybeifpkqs6hubctlfnk7fv4v27ot4rrr4szmgr7p5alwwiisylfakpbi"
                  alt="Resistance DAO NFT"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </motion.div>

            {/* Right side - Content */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center md:text-left space-y-8 relative"
            >
              {!address ? (
                <div className="flex flex-col items-center md:items-start gap-6">
                  <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                    Welcome to Resistance DAO
                  </h1>
                  <p className="text-xl text-blue-200/80 max-w-2xl">
                    Join 2,500+ members shaping the future
                  </p>
                  <div className="flex flex-col items-center md:items-start gap-2 w-full">
                    <Button 
                      size="lg"
                      onClick={connectWallet}
                      disabled={isInitializing}
                      className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold px-8 py-6 text-lg relative overflow-hidden group w-full md:w-auto"
                    >
                      {isInitializing ? (
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      ) : (
                        <Wallet className="w-6 h-6 mr-3" />
                      )}
                      Enter
                    </Button>
                    <p className="text-sm text-blue-200/60">Early supporters get exclusive rewards and benefits</p>
                  </div>
                </div>
              ) : showOptions ? (
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                    Welcome Back!
                  </h1>
                  
                  <div className="bg-black/50 backdrop-blur rounded-xl p-8 border border-blue-500/20 max-w-xl mx-auto md:mx-0">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4">Member Options</h3>
                    <div className="space-y-4">
                      <Button
                        onClick={handleGiftNFT}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-6 text-lg"
                      >
                        <Gift className="w-6 h-6 mr-3" />
                        Gift Membership NFT to a Friend
                      </Button>
                      <Button
                        onClick={handleContinueToDapp}
                        className="w-full bg-gradient-to-r from-blue-400 to-blue-600 py-6 text-lg"
                      >
                        <Shield className="w-6 h-6 mr-3" />
                        Continue to Dapp
                      </Button>
                    </div>
                  </div>
                </div>
              ) : isCheckingNFT ? (
                <div className="flex flex-col items-center md:items-start gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                  <p className="text-blue-200">Checking membership status...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                    Membership Required
                  </h1>
                  
                  <div className="bg-black/50 backdrop-blur rounded-xl p-8 border border-blue-500/20 max-w-xl mx-auto md:mx-0">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4">Member NFT Required</h3>
                    <p className="text-blue-200/80 mb-6">
                      You need to own a Resistance DAO Member NFT to access the platform
                    </p>
                    <Button
                      onClick={handleGetNFT}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-6 text-lg"
                    >
                      Get Member NFT
                    </Button>
                    <p className="text-sm text-blue-200/60 mt-4">Join now to become an OG holder with exclusive benefits</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

