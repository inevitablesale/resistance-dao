
import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { purchaseTokens, fetchPresaleMaticPrice } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { Loader2, ArrowLeft, Bitcoin, CreditCard, AlertCircle } from "lucide-react";
import { useBalanceMonitor } from "@/hooks/use-balance-monitor";
import { WalletAssets } from "@/components/wallet/WalletAssets";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PurchaseView = 'initial' | 'crypto' | 'creditCard';

interface TokenPurchaseFormProps {
  initialAmount?: string;
}

export const TokenPurchaseForm = ({ initialAmount }: TokenPurchaseFormProps) => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { showBanxaDeposit } = useCustomWallet();
  const [currentView, setCurrentView] = useState<PurchaseView>('initial');
  const [maticAmount, setMaticAmount] = useState(initialAmount || "");
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleCryptoPayment = () => {
    if (!maticAmount || isNaN(Number(maticAmount)) || Number(maticAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid MATIC amount",
        variant: "destructive",
      });
      return;
    }
    setCurrentView('crypto');
  };

  const handleCreditCardPayment = () => {
    if (!maticAmount || isNaN(Number(maticAmount)) || Number(maticAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    setCurrentView('creditCard');
  };

  const handlePurchaseTransaction = async () => {
    if (!primaryWallet) {
      setShowAuthFlow?.(true);
      return;
    }

    setIsProcessing(true);
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
      setCurrentView('initial');
    } catch (error) {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to purchase tokens",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreditCardPurchase = async () => {
    if (Number(maticAmount) < 30) {
      toast({
        title: "Minimum Amount Required",
        description: "Minimum purchase amount is $30 USD",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      console.log("Opening Banxa deposit view with amount:", maticAmount);
      showBanxaDeposit();
    } catch (error) {
      console.error("Credit card purchase error:", error);
      toast({
        title: "Purchase Error",
        description: "Failed to initiate credit card purchase",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderInitialView = () => (
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
          disabled={isProcessing}
          className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
        />
        {expectedLGR && (
          <p className="text-sm text-gray-300">
            Expected LGR: ~{expectedLGR} LGR
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={handleCryptoPayment}
          disabled={isProcessing || !maticAmount}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
        >
          <Bitcoin className="mr-2 h-4 w-4" />
          Pay with Crypto
        </Button>
        <Button
          onClick={handleCreditCardPayment}
          disabled={isProcessing || !maticAmount}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Pay with Card
        </Button>
      </div>
    </div>
  );

  const renderCryptoView = () => (
    <Card className="w-full max-w-md mx-auto bg-black/20 border-white/10">
      <CardHeader>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('initial')}
            className="mr-2 text-white hover:text-white/80 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-white">Confirm Purchase</CardTitle>
            <CardDescription className="text-gray-400">
              Purchase LGR tokens with MATIC
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-white/10 p-4 space-y-3">
          <div className="flex items-center gap-2 text-white">
            <Bitcoin className="h-5 w-5" />
            <span className="font-medium">Purchase Summary</span>
          </div>
          <div className="text-sm text-gray-400 space-y-2">
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="text-white">{maticAmount} MATIC</span>
            </div>
            {expectedLGR && (
              <div className="flex justify-between">
                <span>Expected LGR:</span>
                <span className="text-white">~{expectedLGR} LGR</span>
              </div>
            )}
          </div>
        </div>

        <WalletAssets />
      </CardContent>
      <CardFooter>
        <Button
          onClick={handlePurchaseTransaction}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Confirm Purchase"
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderCreditCardView = () => (
    <Card className="w-full max-w-md mx-auto bg-black/20 border-white/10">
      <CardHeader>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('initial')}
            className="mr-2 text-white hover:text-white/80 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-white">Credit Card Purchase</CardTitle>
            <CardDescription className="text-gray-400">
              Purchase MATIC with your credit or debit card
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-white/10 p-4 space-y-3">
          <div className="flex items-center gap-2 text-white">
            <CreditCard className="h-5 w-5" />
            <span className="font-medium">Purchase Summary</span>
          </div>
          <div className="text-sm text-gray-400 space-y-2">
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="text-white">{maticAmount} MATIC</span>
            </div>
            {expectedLGR && (
              <div className="flex justify-between">
                <span>Expected LGR:</span>
                <span className="text-white">~{expectedLGR} LGR</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-400 space-y-1">
          <p>• Instant processing</p>
          <p>• Major cards accepted</p>
          <p>• Secure payment processing</p>
        </div>

        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
          <div className="flex gap-2 text-yellow-500">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Important</p>
              <p className="text-yellow-500/90 mt-1">
                Minimum deposit amount is $30 USD. Fees will be displayed before confirming your purchase.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleCreditCardPurchase}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Continue to Payment"
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  switch (currentView) {
    case 'crypto':
      return renderCryptoView();
    case 'creditCard':
      return renderCreditCardView();
    default:
      return renderInitialView();
  }
};

