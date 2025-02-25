
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Wallet, Loader2, Shield, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDynamicUtils } from "@/hooks/useDynamicUtils";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useNFTBalance } from "@/hooks/useNFTBalance";
import { useNFTMinting } from "@/hooks/useNFTMinting";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export const AccessCoverOverlay = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { connectWallet, isInitializing } = useDynamicUtils();
  const { address } = useCustomWallet();
  const { data: nftBalance = 0 } = useNFTBalance(address);
  const { setShowOnramp } = useDynamicContext();
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

  const handleBuyUSDC = () => {
    setShowOnramp?.(true);
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
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                    Welcome to Resistance DAO
                  </h1>
                  <div className="flex flex-col gap-6 items-center">
                    <div className="space-y-4">
                      <p className="text-xl text-blue-200/80">
                        Since 2021, our OG members have been at the forefront of DeFi innovation
                      </p>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-medium text-blue-300/60">OG Member? Welcome back</span>
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
                    </div>
                    
                    <div className="w-full max-w-xl pt-8 border-t border-blue-500/20">
                      <p className="text-lg text-blue-200/80 mb-4">
                        New to Resistance? Join our community of DeFi pioneers
                      </p>
                      <p className="text-sm text-blue-300/60 mb-2">
                        Connect your wallet to mint your Member NFT
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                Membership Required
              </h1>
              
              <div className="bg-blue-900/30 rounded-xl p-8 backdrop-blur border border-blue-500/20 max-w-xl mx-auto">
                <div className="flex items-center justify-center mb-6">
                  <Shield className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-blue-300 mb-2">Member NFT</h3>
                <p className="text-blue-200/80 mb-8">
                  Mint a Member NFT to join our community and get exclusive access
                </p>
                <div className="space-y-4">
                  <div className="text-left text-sm text-blue-300/60 space-y-1">
                    <div>Price: {MINT_PRICE} USDC</div>
                    <div>Your balance: {usdcBalance} USDC</div>
                  </div>

                  {Number(usdcBalance) < Number(MINT_PRICE) && (
                    <Button
                      onClick={handleBuyUSDC}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 py-6 text-lg mb-2"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Buy USDC with Card
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleMintClick}
                    disabled={isMinting || isApproving || Number(usdcBalance) < Number(MINT_PRICE)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-6 text-lg"
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
