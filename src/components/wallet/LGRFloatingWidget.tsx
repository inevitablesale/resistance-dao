
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getWorkingProvider, getLgrTokenContract, getPresaleContract } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { Coins } from "lucide-react";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useToast } from "@/hooks/use-toast";

export const LGRFloatingWidget = () => {
  const { address } = useCustomWallet();
  const [lgrBalance, setLgrBalance] = useState<string>("0");
  const [purchasedTokens, setPurchasedTokens] = useState<string>("0");
  const { toast } = useToast();

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;

      try {
        const provider = await getWorkingProvider();
        const [lgrContract, presaleContract] = await Promise.all([
          getLgrTokenContract(provider),
          getPresaleContract(provider)
        ]);
        
        const [lgrBal, purchased] = await Promise.all([
          lgrContract.balanceOf(address),
          presaleContract.purchasedTokens(address)
        ]);
        
        setLgrBalance(ethers.utils.formatUnits(lgrBal, 18));
        setPurchasedTokens(ethers.utils.formatUnits(purchased, 18));
      } catch (error) {
        console.error("Error fetching LGR balances:", error);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [address]);

  if (!address) return null;

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
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LGRFloatingWidget;
