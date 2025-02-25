
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2, Shield, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDynamicUtils } from "@/hooks/useDynamicUtils";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useNFTBalance } from "@/hooks/useNFTBalance";
import { useToast } from "@/hooks/use-toast";

export const AccessCoverOverlay = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { connectWallet, isInitializing } = useDynamicUtils();
  const { address } = useCustomWallet();
  const { data: nftBalance = 0, isLoading: isCheckingNFT } = useNFTBalance(address);
  const { toast } = useToast();

  useEffect(() => {
    if (isCheckingNFT) return;
    
    if (address && nftBalance > 0) {
      console.log("NFT membership detected, closing overlay");
      setIsOpen(false);
    }
  }, [address, nftBalance, isCheckingNFT]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      style={{
        backgroundImage: `url(https://i.postimg.cc/BbGmN3qd/image-6.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
      
      <div className="container max-w-4xl mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8 relative"
        >
          {!address ? (
            <div className="flex flex-col items-center gap-6">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                Welcome to Resistance DAO
              </h1>
              <p className="text-xl text-blue-200/80 max-w-2xl">
                Connect your wallet to access the platform and become an OG member
              </p>
              <div className="flex flex-col items-center gap-2">
                <Button 
                  size="lg"
                  onClick={connectWallet}
                  disabled={isInitializing}
                  className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold px-8 py-6 text-lg relative overflow-hidden group"
                >
                  {isInitializing ? (
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  ) : (
                    <Wallet className="w-6 h-6 mr-3" />
                  )}
                  Connect Wallet
                </Button>
                <p className="text-sm text-blue-200/60">Early supporters get exclusive rewards and benefits</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {isCheckingNFT ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                  <p className="text-blue-200">Checking membership status...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                    Membership Required
                  </h1>
                  
                  <div className="bg-black/50 backdrop-blur rounded-xl p-8 border border-blue-500/20 max-w-xl mx-auto">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4">Member NFT Required</h3>
                    <p className="text-blue-200/80 mb-6">
                      You need to own a Resistance DAO Member NFT to access the platform
                    </p>
                    <Button
                      onClick={() => window.location.href = '/mint-nft'}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-6 text-lg"
                    >
                      Get Member NFT
                    </Button>
                    <p className="text-sm text-blue-200/60 mt-4">Join now to become an OG holder with exclusive benefits</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
