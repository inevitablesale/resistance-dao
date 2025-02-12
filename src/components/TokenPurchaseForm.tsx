
import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { purchaseTokens, fetchPresaleMaticPrice } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { Loader2, CreditCard, Wallet, Copy } from "lucide-react";
import { useBalanceMonitor } from "@/hooks/use-balance-monitor";
import { WalletBalance } from "./WalletBalance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface TokenPurchaseFormProps {
  initialAmount?: string;
}

const TOKEN_USD_PRICE = 0.10; // Fixed price of $0.10 per token

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
    const fetchMaticPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
        const data = await response.json();
        setMaticUsdRate(data['matic-network'].usd);
      } catch (error) {
        console.error("Error fetching MATIC price:", error);
      }
    };

    fetchMaticPrice();
    const interval = setInterval(fetchMaticPrice, 60000);
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

  const handleCardPurchase = async () => {
    if (!isConnected || !primaryWallet?.address) {
      setShowAuthFlow?.(true);
      return;
    }

    try {
      // Open Dynamic's Banxa integration directly
      setShowAuthFlow?.(true, {
        view: 'deposit'
      });
      
      toast({
        title: "Purchase Initiated",
        description: "Please complete your purchase through Banxa",
      });
    } catch (error) {
      console.error("Card purchase error:", error);
      toast({
        title: "Purchase Failed",
        description: "Failed to initiate Banxa purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePurchase = () => {
    if (!isConnected || !primaryWallet) {
      setShowAuthFlow?.(true);
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: `Please enter a valid ${purchaseMethod === 'card' ? 'USD' : 'MATIC'} amount`,
        variant: "destructive",
      });
      return;
    }

    if (purchaseMethod === 'card') {
      handleCardPurchase();
    } else {
      handlePurchaseTransaction();
    }
  };

  const handlePurchaseTransaction = async () => {
    if (!primaryWallet) {
      setShowAuthFlow?.(true);
      return;
    }

    setIsLoading(true);
    try {
      const walletClient = await primaryWallet.getWalletClient();
      const signer = new ethers.providers.Web3Provider(walletClient).getSigner();
      
      const result = await purchaseTokens(signer, amount);
      
      toast({
        title: "Purchase Successful!",
        description: `Successfully purchased ${Number(result.amount).toFixed(2)} LGR tokens`,
      });
      
      setAmount("");
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

  const handleCopyAddress = async () => {
    if (primaryWallet?.address) {
      try {
        await navigator.clipboard.writeText(primaryWallet.address);
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
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Your wallet:</span>
                  <span className="text-sm font-medium text-white">
                    {`${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}`}
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
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Purchase Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">
                      {purchaseMethod === 'card' ? '$' : ''}{amount} {purchaseMethod === 'card' ? 'USD' : 'MATIC'}
                    </span>
                  </div>
                  {purchaseMethod === 'card' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Estimated MATIC:</span>
                      <span className="text-white">
                        {(Number(amount) / maticUsdRate).toFixed(4)} MATIC
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm border-t border-white/10 pt-2">
                    <span className="text-gray-400">Expected LGR:</span>
                    <span className="text-white font-medium">{expectedLGR} LGR</span>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handlePurchase}
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
