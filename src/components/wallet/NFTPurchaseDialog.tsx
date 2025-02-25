import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { Loader2, Check, AlertCircle, Copy, ExternalLink, Wallet } from "lucide-react";
import { executeTransaction } from "@/services/transactionManager";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const USDC_CONTRACT = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const NFT_CONTRACT = "0xd3F9cA9d44728611dA7128ec71E40D0314FCE89C";
const NFT_PRICE = ethers.utils.parseUnits("50", 6); // 50 USDC (6 decimals)

const USDCInterface = new ethers.utils.Interface([
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
]);

const NFTInterface = new ethers.utils.Interface([
  "function mint(string memory tokenURI) external returns (uint256)"
]);

interface NFTPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NFTPurchaseDialog = ({ open, onOpenChange }: NFTPurchaseDialogProps) => {
  const { toast } = useToast();
  const { getProvider } = useWalletProvider();
  const { primaryWallet, setShowOnRamp } = useDynamicContext();
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [usdcAllowance, setUsdcAllowance] = useState<string>("0");
  const [isApproving, setIsApproving] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const checkBalances = async () => {
      try {
        const walletProvider = await getProvider();
        const signer = walletProvider.provider.getSigner();
        const address = await signer.getAddress();
        
        const usdcContract = new ethers.Contract(USDC_CONTRACT, USDCInterface, walletProvider.provider);
        
        const balance = await usdcContract.balanceOf(address);
        const allowance = await usdcContract.allowance(address, NFT_CONTRACT);
        
        setUsdcBalance(ethers.utils.formatUnits(balance, 6));
        setUsdcAllowance(ethers.utils.formatUnits(allowance, 6));
      } catch (error) {
        console.error("Error checking balances:", error);
        toast({
          title: "Error",
          description: "Failed to fetch token balances",
          variant: "destructive",
        });
      }
    };

    if (open) {
      checkBalances();
    }
  }, [open, getProvider, toast]);

  const handleApproveUSDC = async () => {
    try {
      setIsApproving(true);
      const walletProvider = await getProvider();
      
      await executeTransaction(
        async () => {
          const signer = walletProvider.provider.getSigner();
          const usdcContract = new ethers.Contract(USDC_CONTRACT, USDCInterface, signer);
          return usdcContract.approve(NFT_CONTRACT, NFT_PRICE);
        },
        {
          type: "approval",
          description: "Approve USDC spending",
          timeout: 60000,
          maxRetries: 2,
          backoffMs: 5000,
          tokenConfig: {
            tokenAddress: USDC_CONTRACT,
            spenderAddress: NFT_CONTRACT,
            amount: NFT_PRICE.toString(),
            isApproval: true
          }
        }
      );

      const signer = walletProvider.provider.getSigner();
      const address = await signer.getAddress();
      const usdcContract = new ethers.Contract(USDC_CONTRACT, USDCInterface, walletProvider.provider);
      const newAllowance = await usdcContract.allowance(address, NFT_CONTRACT);
      setUsdcAllowance(ethers.utils.formatUnits(newAllowance, 6));

      toast({
        title: "Success",
        description: "USDC approved successfully",
      });
    } catch (error) {
      console.error("Approval error:", error);
      toast({
        title: "Error",
        description: "Failed to approve USDC",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleMintNFT = async () => {
    try {
      setIsMinting(true);
      const walletProvider = await getProvider();
      
      await executeTransaction(
        async () => {
          const signer = walletProvider.provider.getSigner();
          const nftContract = new ethers.Contract(NFT_CONTRACT, NFTInterface, signer);
          return nftContract.mint("bafkreib4ypwdplftehhyusbd4eltyubsgl6kwadlrdxw4j7g4o4wg6d6py");
        },
        {
          type: "nft",
          description: "Mint Member NFT",
          timeout: 120000,
          maxRetries: 2,
          backoffMs: 5000,
          nftConfig: {
            tokenAddress: NFT_CONTRACT,
            amount: 1,
            standard: "ERC721",
            symbol: "MEMBER",
            name: "Resistance DAO Member"
          }
        }
      );

      setIsSuccess(true);
      toast({
        title: "Success",
        description: "NFT minted successfully! Welcome to Resistance DAO",
      });

      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error("Minting error:", error);
      toast({
        title: "Error",
        description: "Failed to mint NFT",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  const handleCopyAddress = async () => {
    if (!primaryWallet?.address) return;
    
    try {
      await navigator.clipboard.writeText(primaryWallet.address);
      setIsCopied(true);
      toast({
        title: "Success",
        description: "Address copied to clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy address",
        variant: "destructive",
      });
    }
  };

  const handleBuyUsdc = () => {
    setShowOnRamp?.(true);
  };

  const handleOpenWallet = () => {
    primaryWallet?.connector?.showWallet?.({ view: 'send' });
  };

  const needsApproval = Number(usdcAllowance) < 50;
  const hasEnoughUSDC = Number(usdcBalance) >= 50;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border border-blue-500/20">
        <DialogHeader>
          <DialogTitle className="text-blue-400">Get Member NFT</DialogTitle>
          <DialogDescription>
            Join Resistance DAO by minting your Member NFT
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {primaryWallet?.address && (
            <div className="bg-blue-950/30 rounded-lg p-4 flex items-center justify-between">
              <div className="text-sm text-white/70">
                {`${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}`}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyAddress}
                className="text-blue-400 hover:text-blue-300"
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}

          <div className="relative aspect-square rounded-xl overflow-hidden border border-blue-500/20">
            <img
              src="https://gateway.pinata.cloud/ipfs/bafybeifpkqs6hubctlfnk7fv4v27ot4rrr4szmgr7p5alwwiisylfakpbi"
              alt="Member NFT"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="space-y-2">
            <p className="text-white/70">Price: 50 USDC</p>
            <p className="text-white/70">Your Balance: {Number(usdcBalance).toFixed(2)} USDC</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleBuyUsdc}
              className="w-full bg-purple-600 hover:bg-purple-700"
              variant="secondary"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Buy USDC
            </Button>

            <Button
              onClick={handleOpenWallet}
              className="w-full bg-blue-600 hover:bg-blue-700"
              variant="secondary"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Transfer
            </Button>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center gap-4 py-4"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-green-400 text-lg font-semibold">Welcome to Resistance DAO!</p>
                </motion.div>
              ) : !hasEnoughUSDC ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center gap-4"
                >
                  <AlertCircle className="w-8 h-8 text-yellow-500" />
                  <p className="text-yellow-500">Insufficient USDC balance</p>
                </motion.div>
              ) : needsApproval ? (
                <Button
                  onClick={handleApproveUSDC}
                  disabled={isApproving}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {isApproving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Approve USDC
                </Button>
              ) : (
                <Button
                  onClick={handleMintNFT}
                  disabled={isMinting}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {isMinting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isMinting ? "Minting..." : "Buy Member NFT"}
                </Button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
