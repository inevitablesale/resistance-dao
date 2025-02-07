
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState } from "react";

export const useWalletConnection = () => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    try {
      setIsConnecting(true);
      setShowAuthFlow?.(true);
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      setIsConnecting(true);
      if (primaryWallet?.disconnect) {
        await primaryWallet.disconnect();
      }
    } catch (error) {
      console.error("Disconnect error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Monitor connection state and close auth flow when connected
  if (primaryWallet?.isConnected?.() && setShowAuthFlow) {
    setShowAuthFlow(false);
  }

  const showWallet = (view: 'send' | 'deposit') => {
    console.log("Attempting to show wallet view:", view);
    console.log("Wallet connector:", primaryWallet?.connector);
    
    if (!primaryWallet?.connector?.showWallet) {
      console.warn("Wallet does not support showWallet functionality");
      return;
    }
    
    primaryWallet.connector.showWallet({ view });
  };

  return {
    isConnected: primaryWallet?.isConnected?.() || false,
    isConnecting,
    connect,
    disconnect,
    address: primaryWallet?.address,
    showWallet
  };
};

