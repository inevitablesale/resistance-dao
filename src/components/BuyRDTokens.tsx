
import React, { useState } from "react";
import { Coins, Target, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { purchaseTokens } from "@/services/presaleContractService";
import { ethers } from "ethers";

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
    <div className="flex flex-col md:flex-row items-center gap-4 my-8 p-4 bg-apocalypse-charcoal/80 rounded-xl border border-apocalypse-red/30">
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-mono text-apocalypse-red flex items-center gap-2 mb-2">
          <Coins className="w-5 h-5" />
          Convert Old World Paper Money
        </h3>
        <p className="text-white/70 text-sm mb-4">
          Support the war effort and acquire tokens to fund bounty hunters tracking mutant protocol criminals
        </p>
        {isConnected ? (
          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="Amount in USDC"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-black/20 border-apocalypse-red/20 text-white placeholder:text-white/40"
            />
            <Button
              onClick={handlePurchase}
              disabled={!amount || isLoading}
              className="bg-gradient-to-r from-apocalypse-red to-apocalypse-rust hover:from-apocalypse-red/90 hover:to-apocalypse-rust/90 min-w-[120px] flex items-center gap-2"
            >
              {isLoading ? "Processing..." : 
                <>
                  <Target className="h-4 w-4" /> Convert
                </>
              }
            </Button>
          </div>
        ) : (
          <Button
            onClick={connect}
            className="bg-gradient-to-r from-apocalypse-red to-apocalypse-rust hover:from-apocalypse-red/90 hover:to-apocalypse-rust/90 flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Connect Survival Beacon
          </Button>
        )}
      </div>
    </div>
  );
};
