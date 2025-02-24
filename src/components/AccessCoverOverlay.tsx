
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Wallet, Loader2, Shield, ArrowRight } from "lucide-react";
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
          <div className="mb-12">
            {!address ? (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                  Join Resistance DAO<br />Become a Member
                </h1>
                <p className="text-xl text-blue-200/80 max-w-2xl mx-auto">
                  Connect your wallet to mint a Member NFT and join our community
                </p>
              </>
            ) : nftBalance > 0 ? (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-green-400" />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-green-300">
                  Welcome Back!
                </h1>
                <p className="text-xl text-green-200/80 mb-8">
                  You're a verified Resistance DAO member
                </p>
                <Button
                  size="lg"
                  onClick={() => setIsOpen(false)}
                  className="bg-gradient-to-r from-green-600 to-green-500"
                >
                  Enter DAO <ArrowRight className="ml-2" />
                </Button>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                  Mint Your Member NFT
                </h1>
                <p className="text-xl text-blue-200/80 max-w-2xl mx-auto mb-8">
                  Join Resistance DAO by minting your Member NFT for {MINT_PRICE} USDC
                </p>
                <div className="bg-blue-950/40 backdrop-blur border border-blue-400/20 rounded-xl p-6 mb-8 inline-block">
                  <div className="text-left space-y-4">
                    <div>
                      <p className="text-blue-300/60 text-sm">Your USDC Balance</p>
                      <p className="text-2xl font-mono text-white">{usdcBalance} USDC</p>
                    </div>
                    <div>
                      <p className="text-blue-300/60 text-sm">Mint Price</p>
                      <p className="text-2xl font-mono text-white">{MINT_PRICE} USDC</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center">
            {!address ? (
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
            ) : !nftBalance && (
              <Button
                size="lg"
                onClick={handleMintClick}
                disabled={isMinting || isApproving || Number(usdcBalance) < Number(MINT_PRICE)}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                {isApproving || isMinting ? (
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                ) : null}
                {isApproving ? "Approving USDC..." :
                 isMinting ? "Minting NFT..." :
                 !hasApproval ? "Approve USDC" : "Mint Member NFT"}
              </Button>
            )}
          </div>

          {address && !nftBalance && Number(usdcBalance) < Number(MINT_PRICE) && (
            <p className="text-red-400 text-sm mt-4">
              Insufficient USDC balance. You need {MINT_PRICE} USDC to mint.
            </p>
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

