
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Eye, Upload, Coins, Info } from "lucide-react";
import { ethers } from "ethers";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useTokenBalances } from "@dynamic-labs/sdk-react-core";
import { useCustomWallet } from "@/hooks/useCustomWallet";

const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";

interface LGRWalletDisplayProps {
  submissionFee: string;
  currentBalance?: string;
  walletAddress?: string;
  className?: string;
}

export const LGRWalletDisplay = ({ submissionFee, currentBalance, walletAddress, className }: LGRWalletDisplayProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [usdValue, setUsdValue] = useState("0.00");
  const { address } = useCustomWallet();
  const { tokenBalances } = useTokenBalances({
    networkId: 137,
    accountAddress: address,
    tokenAddresses: [LGR_TOKEN_ADDRESS]
  });
  
  // Format token balance from tokenBalances
  const lgrBalance = tokenBalances?.find(token => token.address.toLowerCase() === LGR_TOKEN_ADDRESS.toLowerCase())?.balance?.toString();
  const formattedBalance = lgrBalance ? 
    Number(ethers.utils.formatEther(lgrBalance)).toFixed(0) : 
    "0";

  // Calculate USD value (assuming $0.10 per token as per presale price)
  useEffect(() => {
    if (lgrBalance) {
      const tokenAmount = Number(ethers.utils.formatEther(lgrBalance));
      const usdAmount = (tokenAmount * 0.10).toFixed(2); // $0.10 per token
      setUsdValue(usdAmount);
    }
  }, [lgrBalance]);

  return (
    <div className={className}>
      <div 
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#161920] rounded-md cursor-pointer hover:bg-[#1e2029] transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium">{formattedBalance} LGR</span>
          <span className="text-gray-400 text-xs">${usdValue}</span>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#0A0B0F] border-neutral-800 p-0 gap-0">
          <div className="flex flex-col w-full">
            <button 
              className="flex items-center justify-center gap-2 w-full px-4 py-3 hover:bg-neutral-800/50 transition-colors text-white"
              onClick={() => {/* Handle balances view */}}
            >
              <Eye className="w-5 h-5" />
              <span className="text-base font-normal">Balances</span>
            </button>
            
            <button 
              className="flex items-center justify-center gap-2 w-full px-4 py-3 hover:bg-neutral-800/50 transition-colors text-white"
              onClick={() => {/* Handle deposit */}}
            >
              <Upload className="w-5 h-5" />
              <span className="text-base font-normal">Deposit</span>
            </button>
            
            <button 
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors text-white mt-1"
            >
              <DynamicWidget />
            </button>
            
            <button 
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#F59E0B] hover:bg-[#D97706] transition-colors text-black mt-1"
              onClick={() => {/* Handle buy LGR */}}
            >
              <Coins className="w-5 h-5" />
              <span className="text-base font-medium">Buy LGR</span>
            </button>
            
            <button 
              className="flex items-center justify-center gap-2 w-full px-4 py-3 hover:bg-neutral-800/50 transition-colors text-white mt-1"
              onClick={() => {/* Handle how to buy */}}
            >
              <Info className="w-5 h-5" />
              <span className="text-base font-normal">How to Buy</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
