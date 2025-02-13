
import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { purchaseTokens, fetchPresaleMaticPrice } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { Loader2, ArrowLeft, CreditCard, CheckCircle2, ArrowRight } from "lucide-react";
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

type PurchaseView = 'payment-select' | 'polygon-amount' | 'card-amount';

interface TokenPurchaseFormProps {
  initialAmount?: string;
}

export const TokenPurchaseForm = ({ initialAmount }: TokenPurchaseFormProps) => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { showBanxaDeposit } = useCustomWallet();
  const [currentView, setCurrentView] = useState<PurchaseView>('payment-select');
  const [maticAmount, setMaticAmount] = useState(initialAmount || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [expectedLGR, setExpectedLGR] = useState<string | null>(null);

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

  const handleCreditCardPayment = async () => {
    if (!maticAmount || isNaN(Number(maticAmount)) || Number(maticAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

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
      if (!primaryWallet) {
        setShowAuthFlow?.(true);
        return;
      }
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
      setCurrentView('payment-select');
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

  const renderPaymentSelect = () => (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Payment Method</h2>
        <p className="text-gray-400">Select how you'd like to purchase LGR tokens</p>
      </div>

      <button
        onClick={() => setCurrentView('polygon-amount')}
        className="w-full p-6 rounded-lg bg-black/30 border border-white/10 hover:bg-black/40 transition-colors mb-4 group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-polygon-primary/20 flex items-center justify-center p-2">
              <img 
                src="https://cryptologos.cc/logos/polygon-matic-logo.png"
                alt="Polygon"
                className="w-full h-full"
              />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white">Pay with Polygon</h3>
              <p className="text-sm text-gray-400">Use MATIC to purchase directly</p>
            </div>
          </div>
          <CheckCircle2 className="text-white/20 group-hover:text-white/40 transition-colors" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Direct token purchase</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Instant processing</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Lower fees</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>No KYC required</span>
          </div>
        </div>
      </button>

      <button
        onClick={() => setCurrentView('card-amount')}
        className="w-full p-6 rounded-lg bg-black/30 border border-white/10 hover:bg-black/40 transition-colors group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white">Pay with Card</h3>
              <p className="text-sm text-gray-400">Use credit/debit card</p>
            </div>
          </div>
          <CheckCircle2 className="text-white/20 group-hover:text-white/40 transition-colors" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Easy onboarding</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Major cards accepted</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Secure processing</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>24/7 support</span>
          </div>
        </div>
      </button>
    </div>
  );

  const renderPolygonAmount = () => (
    <Card className="w-full max-w-md mx-auto bg-black/20 border-white/10">
      <CardHeader>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('payment-select')}
            className="mr-2 text-white hover:text-white/80 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <img 
              src="https://cryptologos.cc/logos/polygon-matic-logo.png"
              alt="Polygon"
              className="h-6 w-6"
            />
            <div>
              <CardTitle className="text-white">Pay with Polygon</CardTitle>
              <CardDescription className="text-gray-400">
                Enter the amount in MATIC
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <WalletAssets />

        <Button
          onClick={handlePurchaseTransaction}
          disabled={isProcessing || !maticAmount}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Continue to Purchase"
          )}
        </Button>
      </CardContent>
    </Card>
  );

  const renderCardAmount = () => {
    const [usdAmount, setUsdAmount] = useState("");
    const [conversionRates, setConversionRates] = useState({
      usdToMatic: 1.25, // Example rate, should be fetched from an API
      maticToLgr: 0.24  // Example rate, calculated from contract
    });

    const calculateConversions = (usdValue: string) => {
      const usd = Number(usdValue);
      if (isNaN(usd)) return null;

      const maticAmount = usd / conversionRates.usdToMatic;
      const lgrAmount = maticAmount / conversionRates.maticToLgr;

      return {
        matic: maticAmount.toFixed(2),
        lgr: lgrAmount.toFixed(2)
      };
    };

    const conversions = calculateConversions(usdAmount);

    return (
      <Card className="w-full max-w-md mx-auto bg-black/20 border-white/10">
        <CardHeader>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView('payment-select')}
              className="mr-2 text-white hover:text-white/80 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <CreditCard className="w-3 h-3 text-yellow-500" />
              </div>
              <div>
                <CardTitle className="text-white">Card Payment</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter purchase amount in USD
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="usdAmount" className="block text-sm font-medium text-gray-200">
              Amount in USD
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <Input
                id="usdAmount"
                type="number"
                value={usdAmount}
                onChange={(e) => setUsdAmount(e.target.value)}
                placeholder="Enter USD amount"
                min="30"
                step="1"
                disabled={isProcessing}
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 pl-7"
              />
            </div>
            <p className="text-sm text-gray-400">
              Minimum purchase amount: $30 USD
            </p>
          </div>

          {conversions && (
            <div className="space-y-4 bg-black/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-200 mb-3">Conversion Path</h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-2 rounded bg-black/20">
                    <span className="text-yellow-500">${usdAmount} USD</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 p-2 rounded bg-black/20">
                    <span className="text-purple-500">~{conversions.matic} MATIC</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 text-center">
                  Current rate: ${conversionRates.usdToMatic}/MATIC
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 p-2 rounded bg-black/20">
                    <span className="text-purple-500">~{conversions.matic} MATIC</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 p-2 rounded bg-black/20">
                    <span className="text-green-500">~{conversions.lgr} LGR</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 text-center">
                  Current rate: {conversionRates.maticToLgr} MATIC/LGR
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <h4 className="text-sm font-medium text-gray-200 mb-2">Summary</h4>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li className="flex justify-between">
                    <span>You will receive:</span>
                    <span className="text-green-500">~{conversions.lgr} LGR</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Rate:</span>
                    <span>${(Number(usdAmount) / Number(conversions.lgr)).toFixed(2)}/LGR</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Network:</span>
                    <span>Polygon</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <Button
            onClick={handleCreditCardPayment}
            disabled={isProcessing || !usdAmount || Number(usdAmount) < 30}
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
        </CardContent>
      </Card>
    );
  };

  switch (currentView) {
    case 'polygon-amount':
      return renderPolygonAmount();
    case 'card-amount':
      return renderCardAmount();
    default:
      return renderPaymentSelect();
  }
};
