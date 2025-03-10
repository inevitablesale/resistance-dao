
import { useState, useEffect } from 'react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from '@/hooks/use-toast';

export const useWalletConnection = () => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [isPendingInitialization, setIsPendingInitialization] = useState(true);
  const { isAuthenticated, primaryWallet, user, setShowAuthFlow, handleLogOut } = useDynamicContext();
  const { toast } = useToast();

  useEffect(() => {
    const initWallet = async () => {
      try {
        if (isAuthenticated && primaryWallet) {
          const walletClient = await primaryWallet.getWalletClient();
          if (walletClient) {
            const addr = await walletClient.getAddress();
            setAddress(addr);
          }
        }
      } catch (error) {
        console.error("Error initializing wallet:", error);
      } finally {
        setIsPendingInitialization(false);
      }
    };

    initWallet();
  }, [isAuthenticated, primaryWallet]);

  const connect = async () => {
    try {
      setShowAuthFlow(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const disconnect = async () => {
    try {
      await handleLogOut();
      setAddress(undefined);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    isConnected: !!address,
    address,
    connect,
    disconnect,
    primaryWallet,
    user,
    isPendingInitialization
  };
};
