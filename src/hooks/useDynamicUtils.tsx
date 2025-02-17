
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
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
  const [isInitializing, setIsInitializing] = useState(false);
  const { getProvider, validateNetwork } = useWalletProvider();

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
