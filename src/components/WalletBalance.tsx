
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { getWorkingProvider, getLgrTokenContract } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { ChevronUp, Coins } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { WalletConnectModal } from "./wallet/WalletConnectModal";
import { WalletActions } from "./wallet/WalletActions";

export const WalletBalance = () => {
  const { address, isConnected } = useWalletConnection();
  const [maticBalance, setMaticBalance] = useState<string>("0");
  const [lgrBalance, setLgrBalance] = useState<string>("0");
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;

      try {
        const provider = await getWorkingProvider();
        const [maticBal, lgrContract] = await Promise.all([
          provider.getBalance(address),
          getLgrTokenContract(provider)
        ]);
        
        const lgrBal = await lgrContract.balanceOf(address);
        
        setMaticBalance(ethers.utils.formatEther(maticBal));
        setLgrBalance(ethers.utils.formatUnits(lgrBal, 18));
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [address]);

  if (!isConnected) {
    return (
      <Card className="bg-[#1A1F2C]/90 border-white/10 p-4">
        <div className="text-center space-y-4">
          <p className="text-gray-400">Connect your wallet to view balances</p>
          <WalletConnectModal />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1A1F2C]/90 border-white/10 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-400">Balance:</span>
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="text-white hover:text-gray-300 transition-colors"
        >
          <ChevronUp className={`w-5 h-5 transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {isExpanded && (
        <>
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
                <div className="text-white font-medium">${(Number(maticBalance) * 1.15).toFixed(2)}</div>
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
              </div>
            </div>

            <WalletActions />
          </div>
        </>
      )}
    </Card>
  );
};
