
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback } from "react";
import { ProposalError } from "@/services/errorHandlingService";

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

  const getWalletState = useCallback(async (): Promise<WalletState> => {
    if (!primaryWallet) {
      return {
        isConnected: false,
        isEthereumWallet: false,
        address: undefined,
        chainId: undefined
      };
    }

    const connected = await primaryWallet.isConnected();
    
    // Debug logging
    console.log('Dynamic SDK Wallet State:', {
      connector: primaryWallet.connector,
      chainId: primaryWallet.connector?.chainId,
      connected,
      address: primaryWallet.address,
      raw: primaryWallet
    });

    // Try getting chainId through connector first, then through provider
    let chainId = primaryWallet.connector?.chainId;
    if (!chainId) {
      try {
        const walletClient = await primaryWallet.getWalletClient();
        const provider = new ethers.providers.Web3Provider(walletClient as any);
        const network = await provider.getNetwork();
        chainId = network.chainId;
        console.log('Chain ID from provider:', chainId);
      } catch (error) {
        console.error('Error getting chainId from provider:', error);
      }
    }

    return {
      isConnected: connected,
      isEthereumWallet: true, // Simplified for now since we're mainly using Ethereum wallets
      address: primaryWallet.address,
      chainId: chainId
    };
  }, [primaryWallet]);

  const getProvider = useCallback(async () => {
    if (!primaryWallet) {
      throw new ProposalError({
        category: 'wallet',
        message: 'No wallet connected',
        recoverySteps: ['Please connect your wallet to continue']
      });
    }

    try {
      const walletClient = await primaryWallet.getWalletClient();
      return new ethers.providers.Web3Provider(walletClient as any);
    } catch (error) {
      console.error('Provider error:', error);
      throw new ProposalError({
        category: 'network',
        message: 'Failed to initialize provider',
        recoverySteps: [
          'Check your wallet connection',
          'Make sure you are on the Polygon network',
          'Try refreshing the page'
        ]
      });
    }
  }, [primaryWallet]);

  const connectWallet = useCallback(async () => {
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
  }, [setShowAuthFlow, toast]);

  const validateNetwork = useCallback(async () => {
    const state = await getWalletState();
    console.log('Validating network state:', state);
    
    if (!state.isConnected) {
      throw new ProposalError({
        category: 'wallet',
        message: 'Wallet not connected',
        recoverySteps: ['Connect your wallet to continue']
      });
    }

    // Simple check if we're on Polygon network
    if (state.chainId !== 137) {
      console.log('Network validation failed. Expected 137, got:', state.chainId);
      throw new ProposalError({
        category: 'network',
        message: 'Please connect to Polygon network',
        recoverySteps: ['Your wallet must be connected to the Polygon network']
      });
    }
  }, [getWalletState]);

  return {
    getWalletState,
    getProvider,
    connectWallet,
    validateNetwork,
    isInitializing
  };
};
