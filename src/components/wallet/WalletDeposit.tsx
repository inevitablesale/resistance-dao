
import { useState } from "react";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, AlertCircle, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const WalletDeposit = () => {
  const { showBanxaDeposit, isConnected } = useCustomWallet();
  const [amount, setAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to deposit",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) < 30) {
      toast({
        title: "Minimum Amount Required",
        description: "Minimum deposit amount is $30 USD",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      console.log("[Deposit] Opening Banxa deposit view with amount:", amount);
      
      // This will either open the deposit view or trigger wallet connection
      showBanxaDeposit();
    } catch (error) {
      console.error("[Deposit] Error:", error);
      toast({
        title: "Deposit Error",
        description: "Failed to initiate deposit",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/20 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Deposit Funds</CardTitle>
        <CardDescription className="text-gray-400">
          Purchase MATIC with your credit or debit card
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium text-gray-200">
            Amount (USD)
          </label>
          <div className="relative">
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
              min="0"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              USD
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 p-4 space-y-3">
          <div className="flex items-center gap-2 text-white">
            <CreditCard className="h-5 w-5" />
            <span className="font-medium">Credit/Debit Card</span>
          </div>
          <div className="text-sm text-gray-400 space-y-1">
            <p>• Instant processing</p>
            <p>• Major cards accepted</p>
            <p>• Secure payment processing</p>
          </div>
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
          onClick={handleDeposit}
          disabled={isProcessing || !amount}
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
};
