
import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getWorkingProvider } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { ChevronUp, Plus, Send } from "lucide-react";

export const WalletBalance = () => {
  const { primaryWallet } = useDynamicContext();
  const [maticBalance, setMaticBalance] = useState<string>("0");
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const fetchMaticBalance = async () => {
      if (!primaryWallet?.address) return;

      try {
        const provider = await getWorkingProvider();
        const balance = await provider.getBalance(primaryWallet.address);
        setMaticBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Error fetching MATIC balance:", error);
      }
    };

    fetchMaticBalance();
    const interval = setInterval(fetchMaticBalance, 30000);
    return () => clearInterval(interval);
  }, [primaryWallet?.address]);

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

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
              onClick={() => window.open('https://wallet.polygon.technology/polygon/bridge', '_blank')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Deposit
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
              onClick={() => window.open('https://wallet.polygon.technology', '_blank')}
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};
