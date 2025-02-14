
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export type WalletView = 'assets' | 'actions' | 'buy' | 'send' | 'history';

export const useCustomWallet = () => {
  const { primaryWallet, setShowAuthFlow, user, setShowOnRamp } = useDynamicContext();
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

  const showBanxaDeposit = (amount?: number) => {
    if (!primaryWallet) {
      console.log("[Deposit] No wallet connected, opening auth flow");
      setShowAuthFlow?.(true);
      return;
    }

    try {
      // Only include defaultFiatAmount if amount is a valid number
      const options = {
        defaultNetwork: {
          chainId: 137
        },
        ...(typeof amount === 'number' && !isNaN(amount) && amount > 0 && { defaultFiatAmount: amount })
      };

      console.log("[Deposit] Opening onramp with options:", options);
      setShowOnRamp?.(true, options);
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
    user
  };
};
