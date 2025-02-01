import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";

export const WalletInfo = () => {
  const { primaryWallet, isAuthenticated } = useDynamicContext();
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-polygon-primary/10 to-polygon-secondary/10 rounded-lg backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4 text-polygon-primary">Wallet Information</h2>
      <div className="space-y-2">
        <p className="text-gray-700">
          <span className="font-semibold">Address:</span>{" "}
          {primaryWallet?.address ? (
            <span className="font-mono">
              {`${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}`}
            </span>
          ) : (
            "Not connected"
          )}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Balance:</span>{" "}
          {isLoading ? (
            <span className="animate-pulse-slow">Loading...</span>
          ) : (
            `${balance} MATIC`
          )}
        </p>
      </div>
    </div>
  );
};