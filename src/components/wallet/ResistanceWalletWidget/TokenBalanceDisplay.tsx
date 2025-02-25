
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TokenBalanceDisplayProps {
  symbol: string;
  balance: string;
  iconUrl?: string;
  className?: string;
}

export const TokenBalanceDisplay = ({ symbol, balance, iconUrl, className = "" }: TokenBalanceDisplayProps) => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();

  const handleCopyAddress = async () => {
    if (!primaryWallet?.address) return;

    try {
      await navigator.clipboard.writeText(primaryWallet.address);
      toast({
        title: "Address Copied",
        description: `${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}`,
      });
    } catch (error) {
      console.error("Failed to copy address:", error);
      toast({
        title: "Copy Failed",
        description: "Could not copy wallet address",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        {iconUrl ? (
          <img src={iconUrl} alt={symbol} className="w-5 h-5" />
        ) : (
          <div className="w-5 h-5 bg-blue-500/20 rounded-full" />
        )}
        <span className="text-sm font-medium text-white">{symbol}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-white">{Number(balance).toFixed(2)}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyAddress}
          className="h-8 w-8 hover:bg-blue-500/20"
          title="Copy wallet address"
        >
          <Copy className="h-4 w-4 text-blue-400" />
        </Button>
      </div>
    </div>
  );
};
