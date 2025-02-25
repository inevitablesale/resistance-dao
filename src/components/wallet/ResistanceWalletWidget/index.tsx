
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Coins } from "lucide-react";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { getWorkingProvider, getRdTokenContract, getUsdcContract } from "@/services/presaleContractService";
import { TokenBalanceDisplay } from "./TokenBalanceDisplay";
import { NFTDisplay } from "./NFTDisplay";
import { useNFTBalance } from "@/hooks/useNFTBalance";
import { Button } from "@/components/ui/button";
import { NFTPurchaseDialog } from "../NFTPurchaseDialog";

export const ResistanceWalletWidget = () => {
  const { address } = useCustomWallet();
  const { primaryWallet } = useDynamicContext();
  const [rdBalance, setRdBalance] = useState<string>("0");
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const { data: nftBalance = 0 } = useNFTBalance(address);
  const [isNftDialogOpen, setIsNftDialogOpen] = useState(false);

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

  const handleTransfer = () => {
    primaryWallet?.connector?.showWallet?.({ view: 'send' });
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

            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={handleTransfer}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              >
                Transfer From Wallet
              </Button>
              <Button
                onClick={() => setIsNftDialogOpen(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
              >
                Buy NFT
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <NFTPurchaseDialog 
        open={isNftDialogOpen}
        onOpenChange={setIsNftDialogOpen}
      />
    </div>
  );
};

export default ResistanceWalletWidget;
