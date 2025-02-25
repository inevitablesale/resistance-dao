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
      <DialogContent className="bg-[#0A0B2E] border border-blue-500/20 p-0 max-w-xl w-[95%] overflow-hidden">
        <div className="p-6 space-y-8">
          {/* NFT Image Display */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#111444] border border-blue-400/20">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent" />
            <img
              src="https://gateway.pinata.cloud/ipfs/bafybeifpkqs6hubctlfnk7fv4v27ot4rrr4szmgr7p5alwwiisylfakpbi"
              alt="Member NFT"
              className="w-full h-full object-contain p-4"
            />
          </div>

          {/* NFT Details */}
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-blue-100">Resistance DAO Member</h2>
            <p className="text-blue-200/80 text-lg">
              Guardian of Web3 innovation. Access platform features, vote on proposals, and earn from successful launches.
            </p>
          </div>

          {/* Price and Balance Display */}
          <div className="space-y-2 bg-blue-950/30 rounded-lg p-4">
            <div className="flex justify-between items-center text-blue-100">
              <span>Price:</span>
              <span className="font-semibold">50 USDC</span>
            </div>
            <div className="flex justify-between items-center text-blue-200">
              <span>Your Balance:</span>
              <span>{Number(usdcBalance).toFixed(2)} USDC</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleBuyUsdc}
              className="w-full bg-[#9B87F5] hover:bg-[#7E69AB] text-white py-6 text-lg font-medium rounded-xl flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Buy USDC
            </Button>

            <Button
              onClick={handleOpenWallet}
              className="w-full bg-[#33C3F0] hover:bg-[#0EA5E9] text-white py-6 text-lg font-medium rounded-xl flex items-center justify-center gap-2"
            >
              <Wallet className="w-5 h-5" />
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
                  className="w-full bg-[#1EAEDB] hover:bg-[#0FA0CE] text-white py-6 text-lg font-medium rounded-xl"
                >
                  {isApproving && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                  Approve USDC
                </Button>
              ) : (
                <Button
                  onClick={handleMintNFT}
                  disabled={isMinting}
                  className="w-full bg-gradient-to-r from-[#9B87F5] to-[#33C3F0] hover:from-[#7E69AB] hover:to-[#0EA5E9] text-white py-6 text-lg font-medium rounded-xl"
                >
                  {isMinting && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
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
