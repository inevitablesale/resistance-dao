import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { MoreVertical } from "lucide-react";

export const WalletInfo = () => {
  const { primaryWallet } = useDynamicContext();
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      if (primaryWallet) {
        const connected = await primaryWallet.isConnected();
        setIsWalletConnected(connected);
      } else {
        setIsWalletConnected(false);
      }
    };

    checkConnection();
  }, [primaryWallet]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (primaryWallet?.address) {
        try {
          const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");
          const balanceWei = await provider.getBalance(primaryWallet.address);
          const balanceEth = ethers.utils.formatEther(balanceWei);
          setBalance(parseFloat(balanceEth).toFixed(4));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
      setIsLoading(false);
    };

    fetchBalance();
  }, [primaryWallet?.address]);

  if (!isWalletConnected) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <div className="rounded-3xl bg-[#1A1F2C]/50 backdrop-blur-lg border border-white/10 p-8">
        {/* Header with Network and Address */}
        <div className="bg-white rounded-2xl p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/6d6172fa-b826-42d8-a4bf-ebc57c12b3ad.png" 
              alt="Polygon" 
              className="w-6 h-6"
            />
            <span className="font-medium">Polygon</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-black/60">
              {primaryWallet?.address
                ? `${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}`
                : "Not connected"}
            </span>
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Wallet Details */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">Wallet Details</h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-lg">Address</span>
              <span className="text-white font-mono text-lg">
                {primaryWallet?.address
                  ? `0x${primaryWallet.address.slice(2, 6)}...${primaryWallet.address.slice(-4)}`
                  : "Not connected"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-lg">Balance</span>
              <div className="flex items-center gap-2">
                <span className="text-white text-lg">
                  {isLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    balance
                  )}
                </span>
                <span className="text-polygon-primary text-lg font-medium">MATIC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Firm Ownership NFTs Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Firm Ownership NFTs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Placeholder for NFTs - Will be populated with firm ownership NFTs */}
            <div className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-white/40">No ownership tokens found</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};