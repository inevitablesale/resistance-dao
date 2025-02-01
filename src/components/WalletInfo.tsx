import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";

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
    <div className="mt-6 space-y-4">
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Wallet Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Address</span>
            <span className="text-white font-mono">
              {primaryWallet?.address
                ? `${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}`
                : "Not connected"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Balance</span>
            <span className="text-white">
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                <span className="flex items-center gap-2">
                  {balance} <span className="text-polygon-primary">MATIC</span>
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};