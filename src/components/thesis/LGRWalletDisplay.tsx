
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Coins, Info, Eye, EyeOff, Copy, Check, Upload, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { getWorkingProvider, getLgrTokenContract, getPresaleContract, fetchPresaleMaticPrice, purchaseTokens } from "@/services/presaleContractService";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
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
  
  // Format the balance to match the design
  const formattedBalance = currentBalance ? 
    Number(ethers.utils.formatEther(currentBalance)).toFixed(0) : 
    "0";

  return (
    <div className={className}>
      <div 
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#161920] rounded-md cursor-pointer hover:bg-[#1e2029] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-white text-sm font-medium">{formattedBalance} LGR</span>
      </div>
    </div>
  );
};
