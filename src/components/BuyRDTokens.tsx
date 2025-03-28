
import React, { useState } from "react";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { purchaseTokens } from "@/services/presaleContractService";
import { ethers } from "ethers"; // Add direct import

export const BuyRDTokens = () => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isConnected, connect, wallet } = useWalletConnection();

  const handlePurchase = async () => {
    if (!amount || !wallet?.address) return;

    setIsLoading(true);
    try {
      // Use ethereum from window object and create provider
      if (!window.ethereum) {
        throw new Error("No ethereum provider found");
      }
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
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
    <div className="flex flex-col md:flex-row items-center gap-4 my-8 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-mono text-blue-300 flex items-center gap-2 mb-2">
          <Coins className="w-5 h-5" />
          Buy RD Tokens
        </h3>
        <p className="text-white/70 text-sm mb-4">
          Purchase tokens to vote on proposals and support projects
        </p>
        {isConnected ? (
          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="Amount in USDC"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-black/20 border-blue-500/20 text-white placeholder:text-white/40"
            />
            <Button
              onClick={handlePurchase}
              disabled={!amount || isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 min-w-[120px]"
            >
              {isLoading ? "Processing..." : "Buy"}
            </Button>
          </div>
        ) : (
          <Button
            onClick={connect}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
};
