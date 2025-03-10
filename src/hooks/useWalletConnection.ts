
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useState, useCallback, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export type WalletConnectionResult = {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getProvider: () => Promise<ethers.providers.Web3Provider | null>;
  getSigner: () => Promise<ethers.providers.JsonRpcSigner | null>;
  isConnected: boolean;
  address: string | null;
  isPendingInitialization: boolean;
  primaryWallet: any;
  setShowAuthFlow: (show: boolean) => void;
};

export const useWalletConnection = (): WalletConnectionResult => {
  const { primaryWallet, user, setShowAuthFlow, hideDynamicUserProfile } = useDynamicContext();
  const [isPendingInitialization, setIsPendingInitialization] = useState(true);
  
  // Check if we have both wallet and user data
  const isConnected = !!primaryWallet?.address && !!user;
  
  useEffect(() => {
    if (isPendingInitialization) {
      // Set initializing to false after a short delay
      const timer = setTimeout(() => {
        setIsPendingInitialization(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    // Debug logging
    console.log("[useWalletConnection] Wallet state:", {
      hasWallet: !!primaryWallet?.address,
      hasUser: !!user,
      isFullyConnected: isConnected,
      walletAddress: primaryWallet?.address
    });
  }, [user, primaryWallet, isPendingInitialization, isConnected]);

  const connect = useCallback(async () => {
    setShowAuthFlow(true);
  }, [setShowAuthFlow]);

  const disconnect = useCallback(async () => {
    if (hideDynamicUserProfile) {
      await hideDynamicUserProfile();
    }
  }, [hideDynamicUserProfile]);

  /**
   * Get ethers provider
   */
  const getProvider = useCallback(async (): Promise<ethers.providers.Web3Provider | null> => {
    if (!primaryWallet) {
      console.error("[Wallet] No primary wallet found");
      return null;
    }

    try {
      console.log("[Wallet] Getting wallet client");
      const walletClient = await primaryWallet.getWalletClient();
      
      if (!walletClient) {
        console.error("[Wallet] Wallet client not available");
        throw new Error("Wallet client not available");
      }
      
      console.log("[Wallet] Creating provider");
      const provider = new ethers.providers.Web3Provider(walletClient);
      
      // Test provider to ensure it's working
      try {
        const network = await provider.getNetwork();
        console.log("[Wallet] Connected to network:", network.chainId);
      } catch (networkError) {
        console.error("[Wallet] Failed to get network", networkError);
        throw new Error("Failed to connect to network");
      }
      
      return provider;
    } catch (error) {
      console.error("[Wallet] Error getting provider:", error);
      toast({
        title: "Wallet Error",
        description: "Failed to connect to your wallet. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }, [primaryWallet]);

  /**
   * Get signer object
   */
  const getSigner = useCallback(async (): Promise<ethers.providers.JsonRpcSigner | null> => {
    try {
      const provider = await getProvider();
      if (!provider) return null;
      
      const signer = provider.getSigner();
      
      // Validate signer by getting address
      try {
        const address = await signer.getAddress();
        console.log("[Wallet] Signer address:", address);
      } catch (signerError) {
        console.error("[Wallet] Signer validation failed:", signerError);
        throw new Error("Failed to get signer address");
      }
      
      return signer;
    } catch (error) {
      console.error("[Wallet] Error getting signer:", error);
      toast({
        title: "Wallet Error",
        description: "Failed to get wallet signer. Please reconnect your wallet.",
        variant: "destructive"
      });
      return null;
    }
  }, [getProvider]);

  return {
    connect,
    disconnect,
    getProvider,
    getSigner,
    isConnected,
    address: primaryWallet?.address || null,
    isPendingInitialization,
    primaryWallet,
    setShowAuthFlow
  };
};
