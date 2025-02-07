
import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getWorkingProvider, getLgrTokenContract } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { ChevronUp, Plus, Send, Coins } from "lucide-react";

export const WalletBalance = () => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const [maticBalance, setMaticBalance] = useState<string>("0");
  const [lgrBalance, setLgrBalance] = useState<string>("0");
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!primaryWallet?.address) return;

      try {
        const provider = await getWorkingProvider();
        const [maticBal, lgrContract] = await Promise.all([
          provider.getBalance(primaryWallet.address),
          getLgrTokenContract(provider)
        ]);
        
        const lgrBal = await lgrContract.balanceOf(primaryWallet.address);
        
        setMaticBalance(ethers.utils.formatEther(maticBal));
        setLgrBalance(ethers.utils.formatUnits(lgrBal, 18));
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [primaryWallet?.address]);

  const handleDeposit = () => {
    if (!primaryWallet) {
      setShowAuthFlow?.(true);
      return;
    }
    // This will open Dynamic's deposit flow
    primaryWallet?.connector?.showWallet?.({
      view: 'deposit'
    });
  };

  const handleSend = () => {
    if (!primaryWallet) {
      setShowAuthFlow?.(true);
      return;
    }
    // This will open Dynamic's send flow
    primaryWallet?.connector?.showWallet?.({
      view: 'send'
    });
  };

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

            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button 
                variant="outline" 
                className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
                onClick={handleDeposit}
              >
                <Plus className="w-4 h-4 mr-2" />
                Deposit
              </Button>
              <Button 
                variant="outline" 
                className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
                onClick={handleSend}
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

