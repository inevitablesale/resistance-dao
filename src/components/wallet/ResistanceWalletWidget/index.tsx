
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Coins, Info } from "lucide-react";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useOnramp } from "@dynamic-labs/sdk-react-core";
import { OnrampProviders } from '@dynamic-labs/sdk-api-core';
import { getWorkingProvider, getRdTokenContract, getUsdcContract, purchaseTokens } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { TokenBalanceDisplay } from "./TokenBalanceDisplay";
import { BuyTokenSection } from "./BuyTokenSection";
import { NFTDisplay } from "./NFTDisplay";
import { useNFTBalance } from "@/hooks/useNFTBalance";

export const ResistanceWalletWidget = () => {
  const { address } = useCustomWallet();
  const { setShowAuthFlow, primaryWallet } = useDynamicContext();
  const { enabled, open } = useOnramp();
  const [rdBalance, setRdBalance] = useState<string>("0");
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const { toast } = useToast();
  const { data: nftBalance = 0 } = useNFTBalance(address);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;

      try {
        const provider = await getWorkingProvider();
        const [rdContract, usdcContract] = await Promise.all([
          getRdTokenContract(provider),
          getUsdcContract(provider)
        ]);
        
        const [rdBal, usdcBal] = await Promise.all([
          rdContract.balanceOf(address),
          usdcContract.balanceOf(address)
        ]);
        
        setRdBalance(ethers.utils.formatUnits(rdBal, 18));
        setUsdcBalance(ethers.utils.formatUnits(usdcBal, 6));
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [address]);

  const handleBuyUsdc = async () => {
    if (!primaryWallet?.address) {
      setShowAuthFlow?.(true);
      return;
    }

    if (!enabled) {
      console.log("Onramp not enabled, current state:", { enabled, primaryWallet });
      toast({
        title: "Onramp Not Available",
        description: "The onramp service is currently not available",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("Opening Banxa onramp with config:", {
        provider: OnrampProviders.Banxa,
        token: 'USDC',
        address: primaryWallet.address,
      });

      await open({
        onrampProvider: OnrampProviders.Banxa,
        token: 'USDC',
        address: primaryWallet.address,
      });
      
      toast({
        title: "Purchase Initiated",
        description: "Your USDC purchase has been initiated successfully",
      });
    } catch (error) {
      console.error("Onramp error:", error);
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to initiate purchase",
        variant: "destructive"
      });
    }
  };

  const handleBuyRd = async (purchaseAmount: string) => {
    if (!primaryWallet?.address || !purchaseAmount) return;

    try {
      const walletClient = await primaryWallet.getWalletClient();
      if (!walletClient) {
        throw new Error("No wallet client available");
      }

      const provider = new ethers.providers.Web3Provider(walletClient as any);
      const signer = provider.getSigner();
      
      const result = await purchaseTokens(signer, purchaseAmount);
      
      toast({
        title: "Purchase Successful",
        description: `Successfully purchased ${result.amount} RD tokens`,
      });
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase tokens",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <div className="mb-2 px-3 py-1 bg-black/90 rounded-lg backdrop-blur-sm border border-blue-500/10">
        <span className="text-blue-400 text-sm font-medium">Resistance Wallet</span>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-12 h-12 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors flex items-center justify-center">
            <Coins className="w-6 h-6 text-blue-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-black/90 backdrop-blur-lg border border-blue-500/10">
          <div className="space-y-4">
            <NFTDisplay 
              balance={nftBalance} 
              className="mb-2"
            />

            <TokenBalanceDisplay
              symbol="RD"
              balance={rdBalance}
              className="mb-2"
            />

            <TokenBalanceDisplay
              symbol="USDC"
              balance={usdcBalance}
              iconUrl="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
              className="py-2 border-t border-blue-500/10"
            />

            <BuyTokenSection
              usdcBalance={usdcBalance}
              onBuyUsdc={handleBuyUsdc}
              onBuyRd={handleBuyRd}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ResistanceWalletWidget;
