
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getWorkingProvider, getLgrTokenContract, getPresaleContract, fetchPresaleMaticPrice } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { Coins, ArrowRight, Wallet } from "lucide-react";
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

  const handleBuyAction = () => {
    if (!address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to buy LGR tokens.",
        variant: "destructive",
      });
      setShowAuthFlow?.(true);
      return;
    }
    setShowOnRamp?.(true);
  };

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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors flex items-center justify-center">
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

            <div className="grid grid-cols-2 gap-2">
              <Button 
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold"
                onClick={handleBuyMatic}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Buy MATIC
              </Button>

              <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
                onClick={handleBuyAction}
              >
                <Coins className="w-4 h-4 mr-2" />
                Buy LGR
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LGRFloatingWidget;
