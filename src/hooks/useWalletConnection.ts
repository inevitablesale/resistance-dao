
import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export const useWalletConnection = () => {
  const [address, setAddress] = useState<string | null>(null);
  const { primaryWallet, walletConnector, handleLogOut, setShowAuthFlow, user } = useDynamicContext();

  useEffect(() => {
    if (primaryWallet && primaryWallet.address) {
      setAddress(primaryWallet.address);
    } else {
      setAddress(null);
    }
  }, [primaryWallet]);

  const connect = () => {
    setShowAuthFlow(true);
  };

  const disconnect = () => {
    if (handleLogOut) {
      handleLogOut();
    }
  };

  const isConnected = !!primaryWallet;

  return {
    address,
    primaryWallet,
    walletConnector,
    connect,
    disconnect,
    isConnected,
    user
  };
};
