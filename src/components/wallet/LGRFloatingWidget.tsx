
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getWorkingProvider, getLgrTokenContract, getPresaleContract, fetchPresaleMaticPrice, purchaseTokens } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { Coins, Wallet } from "lucide-react";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export const LGRFloatingWidget = () => {
  const { address } = useCustomWallet();
  const [lgrBalance, setLgrBalance] = useState<string>("0");
  const [purchasedTokens, setPurchasedTokens] = useState<string>("0");
  const [maticBalance, setMaticBalance] = useState<string>("0");
  const [maticPrice, setMaticPrice] = useState<string>("0");
  const [purchaseAmount, setPurchaseAmount] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { toast } = useToast();
  const { setShowOnRamp, setShowAuthFlow } = useDynamicContext();
  const { showWallet } = useWalletConnection();

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

        // Fetch current MATIC price
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

  const handleBuyMatic = () => {
    if (!address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      setShowAuthFlow?.(true);
      return;
    }
    showWallet('deposit');
  };

  if (!address) return null;

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
                <span className="text-white">MATIC Balance</span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">
                  {Number(maticBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4
                  })} MATIC
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-400">
                Current Price: {Number(maticPrice)} MATIC per LGR
              </div>

              <Button 
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold"
                onClick={handleBuyMatic}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Buy MATIC
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LGRFloatingWidget;
