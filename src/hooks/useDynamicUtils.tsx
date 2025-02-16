
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
      console.log('No primary wallet found');
      return {
        isConnected: false,
        isEthereumWallet: false,
        address: undefined,
        chainId: undefined
      };
    }

    const connected = await primaryWallet.isConnected();
    console.log('Wallet connected status:', connected);
    
    // Debug logging for initial state
    console.log('Initial Dynamic SDK Wallet State:', {
      connector: primaryWallet.connector,
      chainId: primaryWallet.connector?.chainId,
      connected,
      address: primaryWallet.address,
      raw: primaryWallet
    });

    // Try getting chainId through connector first
    let chainId = primaryWallet.connector?.chainId;
    console.log('Chain ID from connector:', chainId);

    // If no chainId from connector, try through provider
    if (!chainId) {
      console.log('No chainId from connector, attempting to get from provider...');
      try {
        console.log('Getting wallet client...');
        const walletClient = await primaryWallet.getWalletClient();
        console.log('Wallet client obtained:', walletClient);
        
        console.log('Initializing Web3Provider...');
        const provider = new ethers.providers.Web3Provider(walletClient as any);
        
        console.log('Getting network from provider...');
        const network = await provider.getNetwork();
        chainId = Number(network.chainId); // Ensure chainId is a number
        console.log('Chain ID from provider:', chainId, typeof chainId);
      } catch (error) {
        console.error('Detailed error getting chainId from provider:', {
          error,
          errorMessage: error.message,
          errorStack: error.stack
        });
      }
    } else {
      // Ensure chainId from connector is also a number
      chainId = Number(chainId);
      console.log('Converted connector chainId to number:', chainId, typeof chainId);
    }

    const finalState = {
      isConnected: connected,
      isEthereumWallet: true,
      address: primaryWallet.address,
      chainId: chainId
    };

    console.log('Final wallet state:', finalState);
    return finalState;
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
    console.log('Starting network validation...');
    const state = await getWalletState();
    console.log('Network validation state:', state);
    
    if (!state.isConnected) {
      console.log('Wallet not connected during validation');
      throw new ProposalError({
        category: 'wallet',
        message: 'Wallet not connected',
        recoverySteps: ['Connect your wallet to continue']
      });
    }

    // Simple check if we're on Polygon network
    const targetChainId = 137;
    const currentChainId = Number(state.chainId);
    
    console.log('Chain ID comparison:', {
      current: currentChainId,
      currentType: typeof currentChainId,
      target: targetChainId,
      targetType: typeof targetChainId,
      isEqual: currentChainId === targetChainId
    });

    if (currentChainId !== targetChainId) {
      console.log('Network validation failed. Chain ID mismatch:', {
        expected: targetChainId,
        got: currentChainId,
        typeOf: typeof currentChainId
      });
      throw new ProposalError({
        category: 'network',
        message: 'Please connect to Polygon network',
        recoverySteps: ['Your wallet must be connected to the Polygon network']
      });
    }

    console.log('Network validation successful');
  }, [getWalletState]);

  return {
    getWalletState,
    getProvider,
    connectWallet,
    validateNetwork,
    isInitializing
  };
};
