
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { 
  Coins, 
  Info, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Upload, 
  AlertCircle, 
  Loader2,
  WalletCards 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { getWorkingProvider, getLgrTokenContract, getPresaleContract, fetchPresaleMaticPrice, purchaseTokens } from "@/services/presaleContractService";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useOnramp } from "@dynamic-labs/sdk-react-core";
import { OnrampProviders } from '@dynamic-labs/sdk-api-core';
import { motion } from "framer-motion";

interface LGRWalletDisplayProps {
  submissionFee: string;
  currentBalance?: string;
  walletAddress?: string;
  className?: string;
}

export const LGRWalletDisplay = ({ submissionFee, currentBalance, walletAddress, className }: LGRWalletDisplayProps) => {
  const { toast } = useToast();
  const { setShowAuthFlow, primaryWallet } = useDynamicContext();
  const { enabled, open } = useOnramp();
  const [purchaseAmount, setPurchaseAmount] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showBalances, setShowBalances] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [copied, setCopied] = useState(false);
  const [maticBalance, setMaticBalance] = useState<string>("0");
  const [maticPrice, setMaticPrice] = useState<string>("0");
  const [lgrBalance, setLgrBalance] = useState<string>("0");
  const [isCalculatingBalance, setIsCalculatingBalance] = useState(true);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [promotionType, setPromotionType] = useState<'weekly' | 'monthly' | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPromotionPending, setIsPromotionPending] = useState(false);

  const hasInsufficientBalance = currentBalance && 
    Number(ethers.utils.formatEther(submissionFee)) > Number(currentBalance);

  useEffect(() => {
    const fetchBalances = async () => {
      setIsCalculatingBalance(true);
      if (!walletAddress) return;

      try {
        const provider = await getWorkingProvider();
        const [lgrContract, maticBal] = await Promise.all([
          getLgrTokenContract(provider),
          provider.getBalance(walletAddress)
        ]);
        
        const balance = await lgrContract.balanceOf(walletAddress);
        setLgrBalance(ethers.utils.formatUnits(balance, 18));
        setMaticBalance(ethers.utils.formatEther(maticBal));

        const currentMaticPrice = await fetchPresaleMaticPrice();
        setMaticPrice(currentMaticPrice);
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setIsCalculatingBalance(false);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [walletAddress]);

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

  const handleBuyPolygon = async () => {
    if (!primaryWallet?.address) {
      setShowAuthFlow?.(true);
      return;
    }

    if (!enabled) {
      toast({
        title: "Onramp Not Available",
        description: "The onramp service is currently not available",
        variant: "destructive"
      });
      return;
    }

    try {
      await open({
        onrampProvider: OnrampProviders.Banxa,
        token: 'MATIC',
        address: primaryWallet.address,
      });
      
      toast({
        title: "Purchase Initiated",
        description: "Your MATIC purchase has been initiated successfully",
      });
    } catch (error) {
      console.error("Onramp error:", error);
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to initiate purchase",
        variant: "destructive"
      });
    }
  };

  const handleConfirmPurchase = async () => {
    if (!walletAddress || !purchaseAmount) return;

    try {
      const provider = await getWorkingProvider();
      const signer = provider.getSigner(walletAddress);
      
      const result = await purchaseTokens(signer, purchaseAmount);
      
      toast({
        title: "Purchase Successful",
        description: `Successfully purchased ${result.amount} LGR tokens`,
      });
      
      setIsConfirmOpen(false);
      setPurchaseAmount("");
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase tokens",
        variant: "destructive",
      });
    }
  };

  const REQUIRED_LGR = 250;
  const lgrBalanceNum = Number(lgrBalance);
  const tokensNeeded = Math.max(0, REQUIRED_LGR - lgrBalanceNum);
  const hasEnoughLGR = lgrBalanceNum >= REQUIRED_LGR;

  const handlePromotionSelect = (type: 'weekly' | 'monthly') => {
    setPromotionType(type);
    setShowPromotionDialog(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCompletePromotion = () => {
    setIsPromotionPending(true);
    setTimeout(() => {
      setIsPromotionPending(false);
      setShowPromotionDialog(false);
      toast({
        title: "Promotion Scheduled",
        description: "Your promotion has been successfully scheduled",
      });
    }, 2000);
  };

  return (
    <Card className={cn(
      "relative bg-black/80 border-white/10 overflow-hidden p-6 space-y-6 backdrop-blur-xl",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/10 before:via-transparent before:to-yellow-500/10",
      "after:absolute after:inset-0 after:bg-grid-white/[0.02] after:bg-[size:20px_20px]",
      className
    )}>
      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Balances</h4>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBalances(!showBalances)}
            className="text-white/60 hover:text-white transition-colors"
          >
            {showBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </motion.button>
        </div>

        {showBalances && (
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center backdrop-blur-xl">
                  <Coins className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">LGR Token</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-400">
                  {Number(lgrBalance).toFixed(2)}
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center backdrop-blur-xl">
                  <img 
                    src="https://cryptologos.cc/logos/polygon-matic-logo.png"
                    alt="Polygon"
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">POLYGON</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-400">
                  {Number(maticBalance).toFixed(2)}
                </p>
              </div>
            </motion.div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              Submission Requirements
            </h3>
            <p className="text-sm text-white/70">Complete these steps to submit your thesis</p>
          </div>

          <div className="space-y-4">
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 text-white/80"
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                walletAddress ? "bg-green-500/20 text-green-500" : "bg-white/10"
              )}>
                {walletAddress ? "✓" : "1"}
              </div>
              <span>Connect Wallet</span>
            </motion.div>

            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center gap-3"
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center relative",
                hasEnoughLGR ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
              )}>
                {hasEnoughLGR ? "✓" : "2"}
              </div>
              <span className={cn(
                "text-white/80",
                !hasEnoughLGR && "text-red-500"
              )}>
                {hasEnoughLGR ? (
                  "Hold LGR Tokens ✓"
                ) : (
                  `Need ${tokensNeeded.toFixed(2)} more LGR (${REQUIRED_LGR} Required)`
                )}
              </span>
            </motion.div>

            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 text-white/80"
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                "bg-white/10"
              )}>
                3
              </div>
              <span>Submit Proposal</span>
            </motion.div>
          </div>
        </div>

        <div className="space-y-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full h-14 bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium backdrop-blur-xl"
                >
                  <WalletCards className="w-6 h-6 mr-2" />
                  Wallet Options
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-64 bg-black/95 border border-white/10 backdrop-blur-xl"
              align="end"
            >
              <DropdownMenuItem 
                className="text-white hover:bg-white/10 cursor-pointer"
                onClick={() => setShowDeposit(!showDeposit)}
              >
                <Upload className="w-5 h-5 mr-2" /> Deposit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white hover:bg-white/10 cursor-pointer"
                onClick={handleBuyPolygon}
              >
                <img 
                  src="https://cryptologos.cc/logos/polygon-matic-logo.png"
                  alt="Polygon"
                  className="w-5 h-5 mr-2"
                />
                Buy Polygon
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white hover:bg-white/10 cursor-pointer"
                onClick={() => setIsConfirmOpen(true)}
              >
                <Coins className="w-5 h-5 mr-2" /> Buy LGR
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white hover:bg-white/10 cursor-pointer"
                onClick={() => setShowInstructions(true)}
              >
                <Info className="w-5 h-5 mr-2" /> How to Buy
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-medium">Promote Your Brand</h4>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handlePromotionSelect('weekly')}
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              Weekly (5 LGR)
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePromotionSelect('monthly')}
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              Monthly (15 LGR)
            </Button>
          </div>
        </div>
      </div>

      {showDeposit && walletAddress && (
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs text-white/60">Your Wallet Address</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-white/60 hover:text-white"
              onClick={handleCopyAddress}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-sm text-white break-all font-mono">
            {walletAddress}
          </p>
        </div>
      )}

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="bg-black/95 border border-yellow-500/20">
          <DialogHeader>
            <DialogTitle className="text-yellow-500">Buy LGR Tokens</DialogTitle>
            <DialogDescription>
              Enter the amount of POLYGON you want to spend
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Amount in POLYGON</label>
              <Input
                type="number"
                placeholder="Enter POLYGON amount"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="bg-black/50 border border-yellow-500/20 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-400">You will receive approximately:</p>
              <p className="text-lg font-bold text-yellow-500">
                {(Number(purchaseAmount) / Number(maticPrice)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} LGR
              </p>
            </div>

            <div className="text-sm text-gray-400">
              Your POLYGON Balance: {Number(maticBalance).toLocaleString()} POLYGON
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
              disabled={!purchaseAmount || Number(purchaseAmount) <= 0 || Number(purchaseAmount) > Number(maticBalance)}
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="bg-black/95 border border-yellow-500/20">
          <DialogHeader>
            <DialogTitle className="text-yellow-500">How to Buy LGR Tokens</DialogTitle>
            <DialogDescription>
              Follow these steps to purchase LGR tokens
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-white">
            <h3 className="font-semibold text-lg">Quick Start Guide</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Connect your wallet using the button in the top right</li>
              <li>Purchase POLYGON tokens using our onramp service</li>
              <li>Use your POLYGON to buy LGR tokens</li>
              <li>Pay a small gas fee in POLYGON to complete the transaction</li>
            </ol>
            <p className="text-sm text-gray-400 mt-4">
              Note: Make sure to purchase enough POLYGON to cover both your LGR purchase and the gas fees
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowInstructions(false)}
              className="w-full sm:w-auto"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPromotionDialog} onOpenChange={setShowPromotionDialog}>
        <DialogContent className="bg-black/95 border border-white/10 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-white">
              Schedule {promotionType === 'weekly' ? 'Weekly' : 'Monthly'} Promotion
            </DialogTitle>
            <DialogDescription>
              Cost: {promotionType === 'weekly' ? '5' : '15'} LGR
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Select Start Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border border-white/10 bg-black/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Upload Creative</Label>
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-black/50 text-white rounded-lg border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm">
                    {selectedFile ? selectedFile.name : "Select promotion creative"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            </div>

            {selectedFile && (
              <p className="text-sm text-white/60">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPromotionDialog(false)}
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompletePromotion}
              disabled={!selectedDate || !selectedFile || isPromotionPending}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
            >
              {isPromotionPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                `Pay ${promotionType === 'weekly' ? '5' : '15'} LGR`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
