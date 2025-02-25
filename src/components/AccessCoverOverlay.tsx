
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Wallet, Loader2, Shield, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDynamicUtils } from "@/hooks/useDynamicUtils";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useNFTBalance } from "@/hooks/useNFTBalance";
import { useNFTMinting } from "@/hooks/useNFTMinting";

export const AccessCoverOverlay = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { connectWallet, isInitializing } = useDynamicUtils();
  const { address } = useCustomWallet();
  const { data: nftBalance = 0 } = useNFTBalance(address);
  const { 
    isApproving,
    isMinting,
    checkUSDCApproval,
    getUSDCBalance,
    approveUSDC,
    mintNFT,
    MINT_PRICE
  } = useNFTMinting();
  
  const [usdcBalance, setUsdcBalance] = useState("0");
  const [hasApproval, setHasApproval] = useState(false);

  useEffect(() => {
    const checkBalances = async () => {
      if (address) {
        const [usdcBal, approval] = await Promise.all([
          getUSDCBalance(address),
          checkUSDCApproval(address)
        ]);
        setUsdcBalance(usdcBal);
        setHasApproval(approval);
      }
    };

    checkBalances();
  }, [address, getUSDCBalance, checkUSDCApproval]);

  // If user has NFT, close the overlay
  useEffect(() => {
    if (nftBalance > 0) {
      setIsOpen(false);
    }
  }, [nftBalance]);

  if (!isOpen) return null;

  const handleMintClick = async () => {
    if (!hasApproval) {
      const approved = await approveUSDC();
      if (approved) {
        setHasApproval(true);
        return;
      }
    }
    
    if (hasApproval) {
      const minted = await mintNFT();
      if (minted) {
        setTimeout(() => setIsOpen(false), 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-black via-blue-950 to-black">
      <div 
        className="absolute inset-0 bg-[url('/lovable-uploads/ca457542-e761-44f2-acbf-1bf9b4255b78.png')] bg-cover bg-center opacity-10"
        style={{
          animation: 'phoenixLook 8s ease-in-out infinite',
          transformOrigin: 'center center'
        }}
      />
      
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
          {!address ? (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Crown className="w-10 h-10 text-amber-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                Welcome to Resistance DAO
              </h1>
              <p className="text-xl text-blue-200/80 max-w-2xl mx-auto mb-8">
                Connect your wallet to verify your membership NFT
              </p>
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
            </>
          ) : (
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                Membership Required
              </h1>
              
              <div className="bg-blue-900/30 rounded-xl p-6 backdrop-blur border border-blue-500/20 max-w-xl mx-auto">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">Member NFT</h3>
                <p className="text-blue-200/80 mb-6">
                  Mint a Member NFT to join our community and get exclusive access
                </p>
                <div className="space-y-4">
                  <div className="text-left text-sm text-blue-300/60">
                    <div>Price: {MINT_PRICE} USDC</div>
                    <div>Your balance: {usdcBalance} USDC</div>
                  </div>
                  <Button
                    onClick={handleMintClick}
                    disabled={isMinting || isApproving || Number(usdcBalance) < Number(MINT_PRICE)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    {isApproving || isMinting ? (
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    ) : null}
                    {isApproving ? "Approving USDC..." :
                     isMinting ? "Minting NFT..." :
                     !hasApproval ? "Approve USDC" : "Mint Member NFT"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <style>
        {`
          @keyframes phoenixLook {
            0%, 100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(-3deg);
            }
            75% {
              transform: rotate(3deg);
            }
          }
        `}
      </style>
    </div>
  );
};
