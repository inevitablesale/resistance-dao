
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

    return {
      isConnected: connected,
      isEthereumWallet: true, // Simplified for now since we're mainly using Ethereum wallets
      address: primaryWallet.address,
      chainId: primaryWallet.connector?.chainId
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
    if (!state.isConnected) {
      throw new ProposalError({
        category: 'wallet',
        message: 'Wallet not connected',
        recoverySteps: ['Connect your wallet to continue']
      });
    }

    // Check if we're on Polygon network
    if (state.chainId !== 137) {
      try {
        // Try to switch to Polygon network
        await primaryWallet?.connector?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }], // 137 in hex
        });
        
        // Verify the switch was successful
        const newState = await getWalletState();
        if (newState.chainId !== 137) {
          throw new ProposalError({
            category: 'network',
            message: 'Failed to switch to Polygon network',
            recoverySteps: ['Please manually switch to the Polygon network in your wallet']
          });
        }
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await primaryWallet?.connector?.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
              }]
            });
          } catch (addError) {
            console.error('Add network error:', addError);
            throw new ProposalError({
              category: 'network',
              message: 'Failed to add Polygon network',
              recoverySteps: [
                'Please add the Polygon network to your wallet manually',
                'Then try again'
              ]
            });
          }
        } else {
          console.error('Network switch error:', switchError);
          throw new ProposalError({
            category: 'network',
            message: 'Failed to switch network',
            recoverySteps: ['Please switch to the Polygon network manually']
          });
        }
      }
    }
  }, [getWalletState, primaryWallet]);

  return {
    getWalletState,
    getProvider,
    connectWallet,
    validateNetwork,
    isInitializing
  };
};
