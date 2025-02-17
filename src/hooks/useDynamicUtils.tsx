
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
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

  const getChainId = async (): Promise<number> => {
    if (!primaryWallet) {
      throw new ProposalError({
        category: 'wallet',
        message: 'No wallet connected',
        recoverySteps: ['Please connect your wallet to continue']
      });
    }

    const walletClient = await primaryWallet.getWalletClient();
    const provider = new ethers.providers.Web3Provider(walletClient as any);
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

  const getProvider = async () => {
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
  };

  const validateNetwork = async () => {
    console.log('Starting network validation...');
    const chainId = await getChainId();
    console.log('Current chain ID:', chainId);
    const targetChainId = 137; // Polygon Mainnet
    
    if (chainId !== targetChainId) {
      throw new ProposalError({
        category: 'network',
        message: 'Please connect to Polygon network',
        recoverySteps: ['Switch to Polygon Mainnet in your wallet']
      });
    }
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

