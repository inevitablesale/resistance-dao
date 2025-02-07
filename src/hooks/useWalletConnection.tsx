
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useWalletConnection = () => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

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
    console.log("Wallet type:", primaryWallet?.connector?.name);
    
    if (!primaryWallet?.connector) {
      console.warn("No wallet connector available");
      toast({
        title: "Wallet Error",
        description: "Wallet functionality not available",
        variant: "destructive"
      });
      return;
    }

    // Handle different wallet types
    if (primaryWallet.connector.name?.toLowerCase().includes('zerodev')) {
      // ZeroDev wallet handling
      if (primaryWallet.connector.openWallet) {
        primaryWallet.connector.openWallet({ view });
      } else {
        console.warn("ZeroDev wallet does not support openWallet");
        toast({
          title: "Wallet Error",
          description: "This wallet doesn't support the requested action",
          variant: "destructive"
        });
      }
    } else {
      // Dynamic embedded wallet handling
      if (primaryWallet.connector.showWallet) {
        primaryWallet.connector.showWallet({ view });
      } else {
        console.warn("Dynamic wallet does not support showWallet");
        toast({
          title: "Wallet Error",
          description: "This wallet doesn't support the requested action",
          variant: "destructive"
        });
      }
    }
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
