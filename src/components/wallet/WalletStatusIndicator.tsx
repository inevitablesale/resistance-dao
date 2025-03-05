
import React from 'react';
import { Button } from "@/components/ui/button";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Wallet, UserRound, ExternalLink } from "lucide-react";

interface WalletStatusIndicatorProps {
  className?: string;
}

export const WalletStatusIndicator: React.FC<WalletStatusIndicatorProps> = ({ className = "" }) => {
  const { isConnected, address, user, isSmartWallet } = useCustomWallet();
  const { setShowAuthFlow } = useDynamicContext();
  
  const shortAddress = address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';
  
  // Fix subdomain access - look for it in the user object structure
  // Try to get it from the custom fields in verifications, or use a fallback
  const subdomain = user?.verifications?.customFields?.["LinkedIn Profile URL"] || 
                    user?.metadata?.["LinkedIn Profile URL"] || 
                    user?.alias || 
                    'No subdomain';

  const handleClick = () => {
    setShowAuthFlow(true);
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className={`bg-black/40 border border-blue-500/30 hover:border-blue-500/50 text-white flex items-center gap-2 ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20">
          <Wallet className="w-3 h-3 text-green-400" />
        </div>
        <span className="text-sm">{shortAddress}</span>
      </div>
      
      {user && (
        <div className="flex items-center gap-2 border-l border-blue-500/20 pl-2 ml-1">
          <UserRound className="w-3 h-3 text-blue-400" />
          <span className="text-sm text-blue-300">{subdomain}</span>
          <ExternalLink className="w-3 h-3 text-white/50" />
        </div>
      )}
      
      {isSmartWallet && (
        <div className="text-xs bg-blue-900/30 px-2 py-0.5 rounded text-blue-300">
          Smart Wallet
        </div>
      )}
    </Button>
  );
};

export default WalletStatusIndicator;
