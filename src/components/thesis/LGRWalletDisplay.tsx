
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Eye, Upload, Coins, Info } from "lucide-react";
import { ethers } from "ethers";
import { useOnramp } from "@dynamic-labs/sdk-react-core";
import { OnrampProviders } from '@dynamic-labs/sdk-api-core';

interface LGRWalletDisplayProps {
  submissionFee: string;
  currentBalance?: string;
  walletAddress?: string;
  className?: string;
}

export const LGRWalletDisplay = ({ submissionFee, currentBalance, walletAddress, className }: LGRWalletDisplayProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { openOnramp } = useOnramp();
  
  const formattedBalance = currentBalance ? 
    Number(ethers.utils.formatEther(currentBalance)).toFixed(0) : 
    "0";

  const handleBuyPolygon = () => {
    openOnramp({
      providerId: OnrampProviders.Transak
    });
  };

  return (
    <div className={className}>
      <div 
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#161920] rounded-md cursor-pointer hover:bg-[#1e2029] transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-white text-sm font-medium">{formattedBalance} LGR</span>
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
              onClick={handleBuyPolygon}
            >
              <img src="/lovable-uploads/5f7ffc1b-d71d-49ec-bcde-00544abe7041.png" alt="Polygon" className="w-5 h-5" />
              <span className="text-base font-normal">Buy Polygon</span>
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
