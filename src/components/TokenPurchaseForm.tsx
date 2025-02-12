
import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { purchaseTokens, fetchPresaleMaticPrice } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { Loader2 } from "lucide-react";
import { useBalanceMonitor } from "@/hooks/use-balance-monitor";
import { WalletAssets } from "@/components/wallet/WalletAssets";

interface TokenPurchaseFormProps {
  initialAmount?: string;
}

export const TokenPurchaseForm = ({ initialAmount }: TokenPurchaseFormProps) => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const [maticAmount, setMaticAmount] = useState(initialAmount || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [expectedLGR, setExpectedLGR] = useState<string | null>(null);

  // Initialize balance monitoring
  useBalanceMonitor();

  useEffect(() => {
    if (initialAmount) {
      calculateExpectedLGR(initialAmount);
    }
  }, [initialAmount]);

  const calculateExpectedLGR = async (amount: string) => {
    try {
      if (!amount || isNaN(Number(amount))) {
        setExpectedLGR(null);
        return;
      }
      const maticPrice = await fetchPresaleMaticPrice();
      const expectedTokens = Number(amount) / Number(maticPrice);
      setExpectedLGR(expectedTokens.toFixed(2));
    } catch (error) {
      console.error("Error calculating expected LGR:", error);
      setExpectedLGR(null);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaticAmount(value);
    calculateExpectedLGR(value);
  };

  const handlePurchase = () => {
    if (!primaryWallet) {
      setShowAuthFlow?.(true);
      return;
    }

    if (!maticAmount || isNaN(Number(maticAmount)) || Number(maticAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid MATIC amount",
        variant: "destructive",
      });
      return;
    }

    handlePurchaseTransaction();
  };

  const handlePurchaseTransaction = async () => {
    setIsLoading(true);
    try {
      const walletClient = await primaryWallet.getWalletClient();
      const signer = new ethers.providers.Web3Provider(walletClient).getSigner();
      
      const result = await purchaseTokens(signer, maticAmount);
      
      toast({
        title: "Purchase Successful!",
        description: `Successfully purchased ${Number(result.amount).toFixed(2)} LGR tokens`,
      });
      
      setMaticAmount("");
      setExpectedLGR(null);
    } catch (error) {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to purchase tokens",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <WalletAssets />

      <div className="space-y-2">
        <label htmlFor="maticAmount" className="block text-sm font-medium text-gray-200">
          Amount in MATIC
        </label>
        <Input
          id="maticAmount"
          type="number"
          value={maticAmount}
          onChange={handleAmountChange}
          placeholder="Enter MATIC amount"
          min="0"
          step="0.01"
          disabled={isLoading}
          className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
        />
        {expectedLGR && (
          <p className="text-sm text-gray-300">
            Expected LGR: ~{expectedLGR} LGR
          </p>
        )}
      </div>

      <Button
        onClick={handlePurchase}
        disabled={isLoading || !maticAmount}
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Purchase LGR Tokens"
        )}
      </Button>
    </div>
  );
};
