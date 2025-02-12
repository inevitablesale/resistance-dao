
import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchPresaleMaticPrice } from "@/services/presaleContractService";
import { Loader2, CreditCard, Wallet } from "lucide-react";
import { useBalanceMonitor } from "@/hooks/use-balance-monitor";
import { WalletBalance } from "./WalletBalance";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PurchaseSummary } from "./purchase/PurchaseSummary";
import { WalletAddressDisplay } from "./purchase/WalletAddressDisplay";
import { handleCardPurchase, handleMaticPurchase, fetchMaticPrice } from "@/services/purchaseService";

interface TokenPurchaseFormProps {
  initialAmount?: string;
}

const TOKEN_USD_PRICE = 0.10;

export const TokenPurchaseForm = ({ initialAmount }: TokenPurchaseFormProps) => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const [amount, setAmount] = useState(initialAmount || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [expectedLGR, setExpectedLGR] = useState<string | null>(null);
  const [purchaseMethod, setPurchaseMethod] = useState<'matic' | 'card'>('card');
  const [maticUsdRate, setMaticUsdRate] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);

  useBalanceMonitor();

  useEffect(() => {
    const checkConnection = async () => {
      if (primaryWallet) {
        const connected = await primaryWallet.isConnected();
        setIsConnected(connected);
      } else {
        setIsConnected(false);
      }
    };

    checkConnection();
  }, [primaryWallet]);

  useEffect(() => {
    const updateMaticPrice = async () => {
      try {
        const price = await fetchMaticPrice();
        setMaticUsdRate(price);
      } catch (error) {
        console.error("Error fetching MATIC price:", error);
      }
    };

    updateMaticPrice();
    const interval = setInterval(updateMaticPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (initialAmount) {
      calculateExpectedLGR(initialAmount);
    }
  }, [initialAmount]);

  const calculateExpectedLGR = async (inputAmount: string) => {
    try {
      if (!inputAmount || isNaN(Number(inputAmount))) {
        setExpectedLGR(null);
        return;
      }

      if (purchaseMethod === 'card') {
        const tokenAmount = Number(inputAmount) / TOKEN_USD_PRICE;
        setExpectedLGR(tokenAmount.toFixed(2));
      } else {
        const maticPrice = await fetchPresaleMaticPrice();
        if (maticPrice === "0") {
          console.error("Failed to fetch MATIC price from contract");
          setExpectedLGR(null);
          return;
        }
        const expectedTokens = Number(inputAmount) / Number(maticPrice);
        setExpectedLGR(expectedTokens.toFixed(2));
      }
    } catch (error) {
      console.error("Error calculating expected LGR:", error);
      setExpectedLGR(null);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    calculateExpectedLGR(value);
  };

  const handlePurchaseClick = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: `Please enter a valid ${purchaseMethod === 'card' ? 'USD' : 'MATIC'} amount`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (purchaseMethod === 'card') {
        await handleCardPurchase(setShowAuthFlow);
        toast({
          title: "Purchase Initiated",
          description: "Please complete your purchase through Banxa",
        });
      } else {
        if (!isConnected || !primaryWallet) {
          setShowAuthFlow?.(true);
          return;
        }
        
        const walletClient = await primaryWallet.getWalletClient();
        const result = await handleMaticPurchase(walletClient, amount);
        toast({
          title: "Purchase Successful!",
          description: `Successfully purchased ${Number(result.amount).toFixed(2)} LGR tokens`,
        });
        setAmount("");
        setExpectedLGR(null);
      }
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
      <WalletBalance />

      <Card className="bg-white/5 border-white/10 p-6">
        <Tabs defaultValue="card" className="w-full" onValueChange={(value) => setPurchaseMethod(value as 'matic' | 'card')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Card
            </TabsTrigger>
            <TabsTrigger value="matic" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              MATIC
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4 mt-6">
            {purchaseMethod === 'matic' && primaryWallet?.address && (
              <WalletAddressDisplay address={primaryWallet.address} />
            )}

            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-200">
                Amount in {purchaseMethod === 'card' ? 'USD' : 'MATIC'}
              </label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder={`Enter ${purchaseMethod === 'card' ? 'USD' : 'MATIC'} amount`}
                min="0"
                step="0.01"
                disabled={isLoading}
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>

            {expectedLGR && (
              <PurchaseSummary
                amount={amount}
                purchaseMethod={purchaseMethod}
                expectedLGR={expectedLGR}
                maticUsdRate={maticUsdRate}
              />
            )}

            <Button 
              onClick={handlePurchaseClick}
              disabled={isLoading || !amount}
              className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : !isConnected ? (
                "Connect Wallet"
              ) : (
                <>
                  {purchaseMethod === 'card' ? 'Purchase with Card' : 'Purchase with MATIC'}
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};
