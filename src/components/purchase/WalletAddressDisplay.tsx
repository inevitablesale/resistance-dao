
import { Copy, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WalletAddressDisplayProps {
  address: string;
}

export const WalletAddressDisplay = ({ address }: WalletAddressDisplayProps) => {
  const { toast } = useToast();

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Wallet className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Your wallet:</span>
        <span className="text-sm font-medium text-white">
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyAddress}
        className="text-gray-400 hover:text-white"
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );
};
