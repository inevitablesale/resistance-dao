
import { useDynamicContext, useOnramp } from "@dynamic-labs/sdk-react-core";
import { OnrampProviders } from "@dynamic-labs/sdk-api-core";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export type WalletView = 'assets' | 'actions' | 'buy' | 'send' | 'history';

export const useCustomWallet = () => {
  const { primaryWallet, setShowAuthFlow, user, isAuthenticated } = useDynamicContext();
  const { open: openOnramp, enabled: onrampEnabled } = useOnramp();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentView, setCurrentView] = useState<WalletView>('assets');
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      if (primaryWallet?.isConnected) {
        try {
          const connected = await primaryWallet.isConnected();
          setIsWalletConnected(connected);
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          setIsWalletConnected(false);
        }
      } else {
        setIsWalletConnected(false);
      }
    };

    checkConnection();
  }, [primaryWallet]);

  const connect = async () => {
    try {
      setIsConnecting(true);
      setShowAuthFlow?.(true);
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      setIsConnecting(true);
      if (primaryWallet?.disconnect) {
        await primaryWallet.disconnect();
        setIsWalletConnected(false);
      }
    } catch (error) {
      console.error("Disconnect error:", error);
      toast({
        title: "Disconnect Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const showBanxaDeposit = async (amount?: number) => {
    if (!isAuthenticated || !primaryWallet) {
      console.log("[Deposit] No wallet connected, opening auth flow");
      setShowAuthFlow?.(true);
      return;
    }

    try {
      if (onrampEnabled) {
        console.log("[Deposit] Opening Banxa onramp with amount:", amount);
        await openOnramp({
          provider: 'banxa',
          defaultFiatAmount: amount || 100,
          defaultNetwork: {
            chainId: 137 // Polygon
          }
        });
      } else {
        console.log("[Deposit] Fallback: Opening wallet buy view");
        toast({
          title: "Onramp Not Available",
          description: "The onramp service is currently not available",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("[Deposit] Error showing deposit view:", error);
      toast({
        title: "Error",
        description: "Failed to open deposit interface",
        variant: "destructive",
      });
    }
  };

  const sendTransaction = () => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      if (primaryWallet.connector?.showWallet) {
        primaryWallet.connector.showWallet({ view: 'send' });
      } else {
        setShowAuthFlow?.(true);
      }
    } catch (error) {
      console.error("Error showing send view:", error);
      toast({
        title: "Error",
        description: "Failed to open send interface",
        variant: "destructive",
      });
    }
  };

  return {
    isConnected: isWalletConnected,
    isConnecting,
    currentView,
    setCurrentView,
    connect,
    disconnect,
    showBanxaDeposit,
    sendTransaction,
    address: primaryWallet?.address,
    user,
    isAuthenticated
  };
};
