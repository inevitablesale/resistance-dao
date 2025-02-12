
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type WalletView = 'assets' | 'buy' | 'send' | 'history';

export const useCustomWallet = () => {
  const { primaryWallet, setShowAuthFlow, user } = useDynamicContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentView, setCurrentView] = useState<WalletView>('assets');
  const { toast } = useToast();

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

  const showBanxaDeposit = () => {
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
        primaryWallet.connector.showWallet({ view: 'deposit' });
      } else {
        setShowAuthFlow?.(true);
      }
    } catch (error) {
      console.error("Error showing deposit view:", error);
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
    isConnected: primaryWallet?.isConnected?.() || false,
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
