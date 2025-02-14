
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { getWorkingProvider, getLgrTokenContract, getPresaleContract } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { Coins } from "lucide-react";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useToast } from "@/hooks/use-toast";

export const WalletAssets = () => {
  const { address } = useCustomWallet();
  const [maticBalance, setMaticBalance] = useState<string>("0");
  const [lgrBalance, setLgrBalance] = useState<string>("0");
  const [purchasedTokens, setPurchasedTokens] = useState<string>("0");
  const [maticPrice, setMaticPrice] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMaticPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
        const data = await response.json();
        setMaticPrice(data['matic-network'].usd);
      } catch (error) {
        console.error("Error fetching MATIC price:", error);
      }
    };

    fetchMaticPrice();
    const interval = setInterval(fetchMaticPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;

      try {
        const provider = await getWorkingProvider();
        const [maticBal, lgrContract, presaleContract] = await Promise.all([
          provider.getBalance(address),
          getLgrTokenContract(provider),
          getPresaleContract(provider)
        ]);
        
        const [lgrBal, purchased] = await Promise.all([
          lgrContract.balanceOf(address),
          presaleContract.purchasedTokens(address)
        ]);
        
        setMaticBalance(ethers.utils.formatEther(maticBal));
        setLgrBalance(ethers.utils.formatUnits(lgrBal, 18));
        setPurchasedTokens(ethers.utils.formatUnits(purchased, 18));
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [address]);

  const calculateUsdValue = (maticAmount: string): string => {
    if (!maticPrice) return "0.00";
    return (Number(maticAmount) * maticPrice).toFixed(2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-polygon-primary flex items-center justify-center">
            <img 
              src="https://cryptologos.cc/logos/polygon-matic-logo.png"
              alt="Polygon"
              className="w-6 h-6"
            />
          </div>
          <span className="text-white">Polygon</span>
        </div>
        <div className="text-right">
          <div className="text-white font-medium">${calculateUsdValue(maticBalance)}</div>
          <div className="text-sm text-gray-400">{Number(maticBalance).toFixed(4)} MATIC</div>
        </div>
      </div>

      <div className="flex items-center justify-between py-2 border-t border-white/10">
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
  );
};

export default WalletAssets;

