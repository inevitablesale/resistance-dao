
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export const useWalletConnection = () => {
  const { primaryWallet, setShowAuthFlow, setShowOnRamp } = useDynamicContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setShowAuthFlow?.(true);
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  }, [setShowAuthFlow, toast]);

  const disconnect = useCallback(async () => {
    try {
      setIsConnecting(true);
      if (primaryWallet?.disconnect) {
        await primaryWallet.disconnect();
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected successfully."
        });
      }
    } catch (error) {
      console.error("Disconnect error:", error);
      toast({
        title: "Disconnect Error",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  }, [primaryWallet, toast]);

  const showWallet = useCallback((view: 'send' | 'deposit') => {
    if (!primaryWallet) {
      console.warn("No wallet available");
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      setShowAuthFlow?.(true);
      return;
    }

    try {
      if (view === 'deposit') {
        setShowOnRamp?.(true, {
          defaultFiatAmount: 100,
          defaultNetwork: { chainId: 137 }
        });
        return;
      }

      // For send view or other actions, try using native wallet methods
      if (primaryWallet.connector?.showWallet) {
        primaryWallet.connector.showWallet({ view });
      } else if (primaryWallet.connector?.openWallet) {
        primaryWallet.connector.openWallet({ view });
      } else {
        console.warn("Direct wallet navigation not available");
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
  }, [primaryWallet, setShowAuthFlow, setShowOnRamp, toast]);

  return {
    isConnected: primaryWallet?.isConnected?.() || false,
    isConnecting,
    connect,
    disconnect,
    address: primaryWallet?.address,
    showWallet
  };
};
