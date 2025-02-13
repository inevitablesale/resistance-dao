
import { useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, CreditCard } from "lucide-react";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TokenPurchaseFormProps {
  initialAmount?: string;
}

export const TokenPurchaseForm = ({ initialAmount }: TokenPurchaseFormProps) => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { showBanxaDeposit } = useCustomWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleCreditCardPayment = async () => {
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

  return (
    <Card className="w-full bg-black/20 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Purchase LGR Tokens</CardTitle>
        <CardDescription className="text-gray-400">
          You'll be redirected to our secure payment partner Banxa to complete your purchase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-white/10 p-4 space-y-3">
          <div className="flex items-center gap-2 text-white">
            <CreditCard className="h-5 w-5" />
            <span className="font-medium">Credit/Debit Card</span>
          </div>
          <div className="text-sm text-gray-400 space-y-1">
            <p>• Minimum purchase: $30 USD</p>
            <p>• Major cards accepted</p>
            <p>• Secure payment processing</p>
            <p>• Purchase MATIC which will be used to buy LGR tokens</p>
          </div>
        </div>

        <Button
          onClick={handleCreditCardPayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Continue to Payment
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
