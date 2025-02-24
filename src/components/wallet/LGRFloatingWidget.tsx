import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getWorkingProvider, getRdTokenContract, getUsdcContract, purchaseTokens } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { Coins, Info } from "lucide-react";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useOnramp } from "@dynamic-labs/sdk-react-core";
import { OnrampProviders } from '@dynamic-labs/sdk-api-core';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LGRFloatingWidget = () => {
  const { address } = useCustomWallet();
  const { setShowAuthFlow, primaryWallet } = useDynamicContext();
  const { enabled, open } = useOnramp();
  const [rdBalance, setRdBalance] = useState<string>("0");
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [purchaseAmount, setPurchaseAmount] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;

      try {
        const provider = await getWorkingProvider();
        const [rdContract, usdcContract] = await Promise.all([
          getRdTokenContract(provider),
          getUsdcContract(provider)
        ]);
        
        const [rdBal, usdcBal] = await Promise.all([
          rdContract.balanceOf(address),
          usdcContract.balanceOf(address)
        ]);
        
        setRdBalance(ethers.utils.formatUnits(rdBal, 6));
        setUsdcBalance(ethers.utils.formatUnits(usdcBal, 6));
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [address]);

  const handleBuyUsdc = async () => {
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
        token: 'USDC',
        address: primaryWallet.address,
      });
      
      toast({
        title: "Purchase Initiated",
        description: "Your USDC purchase has been initiated successfully",
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
    if (!primaryWallet?.address || !purchaseAmount) return;

    try {
      const walletClient = await primaryWallet.getWalletClient();
      if (!walletClient) {
        throw new Error("No wallet client available");
      }

      const provider = new ethers.providers.Web3Provider(walletClient as any);
      const signer = provider.getSigner();
      
      const result = await purchaseTokens(signer, purchaseAmount);
      
      toast({
        title: "Purchase Successful",
        description: `Successfully purchased ${result.amount} RD tokens`,
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

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <div className="mb-2 px-3 py-1 bg-black/90 rounded-lg backdrop-blur-sm border border-blue-500/10">
        <span className="text-blue-400 text-sm font-medium">Resistance Wallet</span>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-12 h-12 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors flex items-center justify-center">
            <Coins className="w-6 h-6 text-blue-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-black/90 backdrop-blur-lg border border-blue-500/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-white">RD Token</span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">
                  {Number(rdBalance).toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })} RD
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-blue-500/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <img 
                    src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                    alt="USDC"
                    className="w-5 h-5"
                  />
                </div>
                <span className="text-white">USDC Balance</span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">
                  {Number(usdcBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} USDC
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-400">
                Price: $0.10 USD per RD
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Buy RD
                </Button>

                <Button
                  onClick={handleBuyUsdc}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center justify-center gap-2"
                >
                  <img 
                    src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                    alt="USDC"
                    className="w-5 h-5"
                  />
                  Buy USDC
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-white hover:bg-white/10"
                  onClick={() => setShowInstructions(true)}
                >
                  <Info className="w-4 h-4 mr-2" />
                  How to Buy
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="bg-black/95 border border-blue-500/20">
          <DialogHeader>
            <DialogTitle className="text-blue-400">Buy RD Tokens</DialogTitle>
            <DialogDescription>
              Enter the amount of USDC you want to spend
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Amount in USDC</label>
              <Input
                type="number"
                placeholder="Enter USDC amount"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="bg-black/50 border border-blue-500/20 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-400">You will receive approximately:</p>
              <p className="text-lg font-bold text-blue-400">
                {(Number(purchaseAmount)).toFixed(2)} RD
              </p>
            </div>

            <div className="text-sm text-gray-400">
              Your USDC Balance: {Number(usdcBalance)} USDC
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
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              disabled={!purchaseAmount || Number(purchaseAmount) <= 0 || Number(purchaseAmount) > Number(usdcBalance)}
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="bg-black/95 border border-blue-500/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-400">How to Buy RD Tokens</DialogTitle>
            <DialogDescription>
              Follow these steps to purchase RD tokens
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="usdc">Get USDC</TabsTrigger>
              <TabsTrigger value="rd">Buy RD</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="space-y-4 text-white">
                <h3 className="font-semibold text-lg">Quick Start Guide</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Connect your wallet using the button in the top right</li>
                  <li>Purchase USDC tokens using our onramp service</li>
                  <li>Use your USDC to buy RD tokens</li>
                  <li>Pay a small gas fee in MATIC to complete the transaction</li>
                </ol>
                <p className="text-sm text-gray-400 mt-4">
                  Note: Make sure to purchase enough MATIC to cover gas fees (approximately 0.001 MATIC)
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="usdc">
              <div className="space-y-4 text-white">
                <h3 className="font-semibold text-lg">Getting USDC</h3>
                <div className="space-y-2">
                  <p>USDC is a stablecoin pegged to the US dollar. You need it to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Purchase RD tokens</li>
                    <li>Each RD token costs $0.10 USDC</li>
                  </ul>
                  <p className="mt-4">To get USDC:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Click the "Buy USDC" button</li>
                    <li>Enter the amount you wish to purchase</li>
                    <li>Complete the payment through our secure partner</li>
                  </ol>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rd">
              <div className="space-y-4 text-white">
                <h3 className="font-semibold text-lg">Buying RD Tokens</h3>
                <div className="space-y-2">
                  <p>Once you have USDC in your wallet:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Click the "Buy RD" button</li>
                    <li>Enter the amount of USDC you want to spend</li>
                    <li>Review the number of RD tokens you'll receive</li>
                    <li>Confirm the transaction in your wallet</li>
                  </ol>
                  <div className="mt-4 p-4 bg-blue-500/10 rounded-lg">
                    <p className="text-blue-400 font-semibold">Important:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li>Current price: $0.10 USD per RD</li>
                      <li>Minimum purchase: None</li>
                      <li>Transaction fee: ~0.001 MATIC</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

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
    </div>
  );
};

export default LGRFloatingWidget;
