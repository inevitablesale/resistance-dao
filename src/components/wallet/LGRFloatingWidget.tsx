
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getWorkingProvider, getLgrTokenContract, getPresaleContract, fetchPresaleMaticPrice, purchaseTokens } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { Coins } from "lucide-react";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useOnramp } from "@dynamic-labs/sdk-react-core";
import { OnrampProviders } from '@dynamic-labs/sdk-api-core';

export const LGRFloatingWidget = () => {
  const { address } = useCustomWallet();
  const { setShowAuthFlow, primaryWallet } = useDynamicContext();
  const { enabled, open } = useOnramp();
  const [lgrBalance, setLgrBalance] = useState<string>("0");
  const [purchasedTokens, setPurchasedTokens] = useState<string>("0");
  const [maticBalance, setMaticBalance] = useState<string>("0");
  const [maticPrice, setMaticPrice] = useState<string>("0");
  const [purchaseAmount, setPurchaseAmount] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;

      try {
        const provider = await getWorkingProvider();
        const [lgrContract, presaleContract, maticBal] = await Promise.all([
          getLgrTokenContract(provider),
          getPresaleContract(provider),
          provider.getBalance(address)
        ]);
        
        const [lgrBal, purchased] = await Promise.all([
          lgrContract.balanceOf(address),
          presaleContract.purchasedTokens(address)
        ]);
        
        setLgrBalance(ethers.utils.formatUnits(lgrBal, 18));
        setPurchasedTokens(ethers.utils.formatUnits(purchased, 18));
        setMaticBalance(ethers.utils.formatEther(maticBal));

        const currentMaticPrice = await fetchPresaleMaticPrice();
        setMaticPrice(currentMaticPrice);
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [address]);

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
    if (!address || !purchaseAmount) return;

    try {
      const provider = await getWorkingProvider();
      const signer = provider.getSigner(address);
      
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

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <div className="mb-2 px-3 py-1 bg-black/90 rounded-lg backdrop-blur-sm border border-white/10">
        <span className="text-yellow-500 text-sm font-medium">LGR Wallet</span>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-12 h-12 rounded-full bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors flex items-center justify-center">
            <Coins className="w-6 h-6 text-yellow-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-black/90 backdrop-blur-lg border border-white/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-yellow-500" />
                </div>
                <span className="text-white">LGR Token</span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">
                  {Number(lgrBalance).toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })} LGR
                </div>
                <div className="text-sm text-gray-400">
                  Purchased: {Number(purchasedTokens).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} LGR
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <img 
                    src="https://cryptologos.cc/logos/polygon-matic-logo.png"
                    alt="Polygon"
                    className="w-5 h-5"
                  />
                </div>
                <span className="text-white">POLYGON Balance</span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">
                  {Number(maticBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4
                  })} POLYGON
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-400">
                Price: $0.10 USD per LGR
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
                  onClick={() => setIsConfirmOpen(true)}
                  disabled={!address}
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Buy LGR
                </Button>

                <Button
                  onClick={handleBuyPolygon}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold flex items-center justify-center gap-2"
                >
                  <img 
                    src="https://cryptologos.cc/logos/polygon-matic-logo.png"
                    alt="Polygon"
                    className="w-5 h-5"
                  />
                  Buy Polygon
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="bg-black/95 border border-yellow-500/20">
          <DialogHeader>
            <DialogTitle className="text-yellow-500">Confirm LGR Purchase</DialogTitle>
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
    </div>
  );
};

export default LGRFloatingWidget;
