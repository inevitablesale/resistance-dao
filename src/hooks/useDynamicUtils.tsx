
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ProposalError } from "@/services/errorHandlingService";
import { useWalletProvider } from "./useWalletProvider";

export interface WalletState {
  isConnected: boolean;
  isEthereumWallet: boolean;
  address: string | undefined;
  chainId: number | undefined;
}

export const useDynamicUtils = () => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);
  const { getProvider, validateNetwork } = useWalletProvider();

  useEffect(() => {
    const checkInitialization = async () => {
      if (!primaryWallet) {
        setIsInitializing(false);
        return;
      }

      try {
        const isConnected = await primaryWallet.isConnected();
        if (!isConnected) {
          setIsInitializing(false);
          return;
        }

        const walletClient = await primaryWallet.getWalletClient();
        if (!walletClient) {
          console.log("Wallet client not available yet");
          return;
        }

        setIsInitializing(false);
      } catch (error) {
        console.error("Initialization check failed:", error);
        setIsInitializing(false);
      }
    };

    checkInitialization();
  }, [primaryWallet]);

  const getChainId = async (): Promise<number> => {
    if (!primaryWallet) {
      throw new ProposalError({
        category: 'wallet',
        message: 'No wallet connected',
        recoverySteps: ['Please connect your wallet to continue']
      });
    }

    const { provider } = await getProvider();
    const network = await provider.getNetwork();
    return network.chainId;
  };

  const getWalletState = async (): Promise<WalletState> => {
    if (!primaryWallet) {
      return {
        isConnected: false,
        isEthereumWallet: false,
        address: undefined,
        chainId: undefined
      };
    }

    const connected = await primaryWallet.isConnected();
    const chainId = await getChainId();
    
    return {
      isConnected: connected,
      isEthereumWallet: true,
      address: primaryWallet.address,
      chainId
    };
  };

  const connectWallet = async () => {
    try {
      setIsInitializing(true);
      setShowAuthFlow?.(true);
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return {
    getWalletState,
    getProvider,
    connectWallet,
    validateNetwork,
    isInitializing,
    getChainId
  };
};
