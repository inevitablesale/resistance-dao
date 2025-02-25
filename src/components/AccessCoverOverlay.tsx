import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Wallet, Loader2, Shield, CreditCard, Copy, LogOut, Check, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useDynamicUtils } from "@/hooks/useDynamicUtils";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useNFTBalance } from "@/hooks/useNFTBalance";
import { useNFTMinting } from "@/hooks/useNFTMinting";
import { useDynamicContext, useOnramp } from "@dynamic-labs/sdk-react-core";
import { OnrampProviders } from "@dynamic-labs/sdk-api-core";
import { useToast } from "@/hooks/use-toast";
import { getFromIPFS } from '@/services/ipfsService';
import { NFTMetadata } from '@/types/proposals';

export const AccessCoverOverlay = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showNFTSuccess, setShowNFTSuccess] = useState(false);
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const { connectWallet, isInitializing } = useDynamicUtils();
  const { address } = useCustomWallet();
  const { data: nftBalance = 0 } = useNFTBalance(address);
  const { logout } = useDynamicContext();
  const { enabled: onrampEnabled, open: openOnramp } = useOnramp();
  const { toast } = useToast();
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
  const [isOpeningOnramp, setIsOpeningOnramp] = useState(false);

  const { primaryWallet } = useDynamicContext();

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      if (showNFTSuccess) {
        try {
          const metadata = await getFromIPFS<NFTMetadata>("QmYctf3BzCzqY1K6LiQPzZyWnM6rBwM9qvtonnEZZfb5DQ", "content");
          console.log("Fetched NFT metadata:", metadata);
          setNftMetadata(metadata);
        } catch (error) {
          console.error("Error fetching NFT metadata:", error);
        }
      }
    };

    fetchNFTMetadata();
  }, [showNFTSuccess]);

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

  const handleMintClick = async () => {
    if (!address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to mint.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!hasApproval) {
        const approved = await approveUSDC();
        if (approved) {
          setHasApproval(true);
          toast({
            title: "USDC Approved",
            description: "You can now mint your NFT",
          });
        }
        return;
      }
      
      const minted = await mintNFT();
      if (minted) {
        toast({
          title: "Success!",
          description: "Your NFT has been minted successfully.",
        });
        setShowNFTSuccess(true);
      }
    } catch (error) {
      console.error("Minting error:", error);
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : "Failed to mint NFT",
        variant: "destructive"
      });
    }
  };

  const handleBuyUSDC = async () => {
    if (!onrampEnabled) {
      console.error('Onramp is not enabled');
      toast({
        title: "Onramp Not Available",
        description: "The onramp service is currently not available.",
        variant: "destructive"
      });
      return;
    }

    if (!address) {
      console.error('No wallet address available');
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive"
      });
      return;
    }

    setIsOpeningOnramp(true);
    
    try {
      await openOnramp({
        onrampProvider: OnrampProviders.Banxa,
        address: address
      });
      
      toast({
        title: "Purchase USDC",
        description: "The Banxa window should open shortly.",
      });
    } catch (error) {
      console.error('Failed to open onramp:', error);
      toast({
        title: "Error Opening Onramp",
        description: "Failed to open the purchase window. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOpeningOnramp(false);
    }
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleLogout = async () => {
    try {
      if (primaryWallet?.disconnect) {
        await primaryWallet.disconnect();
        toast({
          title: "Logged Out",
          description: "Successfully disconnected wallet",
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (showNFTSuccess) {
    return (
      <div className="fixed inset-0 z-[100] bg-gradient-to-b from-black via-blue-950 to-black">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container max-w-2xl mx-auto px-4 h-full flex items-center justify-center"
        >
          <div className="bg-blue-900/20 p-8 rounded-2xl border border-blue-500/20 backdrop-blur-xl space-y-6 w-full">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Welcome to Resistance DAO!</h2>
              <p className="text-blue-200/80 text-center">
                Your Member NFT has been successfully minted. You now have access to all DAO features and benefits.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-blue-950/40 border border-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
              <div className="relative p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-semibold text-blue-200">
                    {nftMetadata?.name || "Resistance DAO Member NFT"}
                  </h3>
                </div>
                {nftMetadata?.image && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={nftMetadata.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
                      alt={nftMetadata.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-blue-300/60">
                  {nftMetadata?.description || "This NFT represents your membership and voting power in the DAO"}
                </p>
                <div className="h-[2px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20" />
                <div className="space-y-2">
                  {nftMetadata?.attributes?.map((attr) => (
                    <div key={attr.trait_type} className="flex justify-between text-sm">
                      <span className="text-blue-300/60">{attr.trait_type}</span>
                      <span className="text-blue-200">{attr.value}</span>
                    </div>
                  ))} 
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => setShowNFTSuccess(false)}
              className="text-blue-300 hover:text-blue-200 hover:bg-blue-900/50 w-full"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-black via-blue-950 to-black">
      {address && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-blue-300 hover:text-blue-200 hover:bg-blue-900/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      )}
      
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
                <p className="text-blue-200/80 mb-6">
                  Mint a Member NFT to join our community and get exclusive access
                </p>

                <div className="space-y-4">
                  <div className="text-left text-sm text-blue-300/60 space-y-1">
                    <div>Price: {MINT_PRICE} USDC</div>
                    <div>Your balance: {usdcBalance} USDC</div>
                  </div>

                  <div className="bg-blue-950/50 p-4 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-blue-300 mb-2 text-left">Transfer USDC to this address:</p>
                    <div className="flex items-center justify-between bg-blue-900/30 p-3 rounded-md">
                      <code className="text-xs md:text-sm text-blue-200 break-all text-left">
                        {address}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyAddress}
                        className="ml-2 hover:bg-blue-800/50"
                      >
                        <Copy className="w-4 h-4 text-blue-300" />
                      </Button>
                    </div>
                  </div>

                  {Number(usdcBalance) < Number(MINT_PRICE) && (
                    <Button
                      onClick={handleBuyUSDC}
                      disabled={!onrampEnabled || isOpeningOnramp}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 py-6 text-lg mb-2"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Buy USDC with Card
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleMintClick}
                    disabled={isMinting || isApproving}
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
    </div>
  );
};
