
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
    console.log("Wallet connector details:", primaryWallet?.connector);
    
    if (!primaryWallet) {
      console.warn("No wallet available");
      toast({
        title: "Wallet Error",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    try {
      // Try using showWallet first, then openWallet as fallback
      if (primaryWallet.connector?.showWallet) {
        primaryWallet.connector.showWallet({ view });
      } else if (primaryWallet.connector?.openWallet) {
        primaryWallet.connector.openWallet({ view });
      } else {
        // Fallback to showing auth flow if direct navigation isn't available
        console.warn("Direct wallet navigation not available, falling back to auth flow");
        setShowAuthFlow?.(true);
      }
    } catch (error) {
      console.error("Error showing wallet:", error);
      toast({
        title: "Wallet Error",
        description: "Unable to open wallet interface",
        variant: "destructive"
      });
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

