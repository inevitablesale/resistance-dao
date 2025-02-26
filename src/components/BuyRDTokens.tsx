
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { purchaseTokens } from "@/services/presaleContractService";
import { Coins } from "lucide-react";

export const BuyRDTokens = () => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isConnected, connect, wallet } = useWalletConnection();

  const handlePurchase = async () => {
    if (!amount || !wallet) return;

    setIsLoading(true);
    try {
      const signer = await wallet.getEthersProvider?.()?.getSigner();
      if (!signer) {
        throw new Error("No signer available");
      }

      const tx = await purchaseTokens(signer, amount);
      
      toast({
        title: "Purchase Successful",
        description: `Successfully purchased ${tx.amount} RD tokens.`,
      });
      
      setAmount("");
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/40 border-white/10">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Buy RD Tokens
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isConnected ? (
            <div className="text-center">
              <p className="text-white/60 mb-4">Connect your wallet to buy RD tokens</p>
              <Button 
                onClick={connect}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              >
                Connect Wallet
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm text-white/60">
                  Amount in USDC
                </label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount in USDC"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-black/20 border-white/10"
                />
                <p className="text-xs text-white/40">
                  You will receive RD tokens at a fixed rate
                </p>
              </div>
              <Button
                onClick={handlePurchase}
                disabled={!amount || isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              >
                {isLoading ? "Processing..." : "Buy RD Tokens"}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
