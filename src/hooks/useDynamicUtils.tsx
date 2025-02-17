
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback, useEffect } from "react";
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
  const [cachedChainId, setCachedChainId] = useState<number | undefined>();

  const getChainId = useCallback(async (): Promise<number> => {
    if (cachedChainId) {
      return cachedChainId;
    }

    try {
      // Try to get wallet client first as it's the most direct method
      const walletClient = await primaryWallet?.getWalletClient();
      if (walletClient?.chain?.id) {
        const chainId = Number(walletClient.chain.id);
        setCachedChainId(chainId);
        return chainId;
      }

      // Fallback to provider if needed
      const provider = new ethers.providers.Web3Provider(walletClient as any);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      setCachedChainId(chainId);
      return chainId;
    } catch (error) {
      console.error('Error getting chain ID:', error);
      throw new ProposalError({
        category: 'network',
        message: 'Failed to get network chain ID',
        recoverySteps: ['Check wallet connection', 'Try refreshing the page']
      });
    }
  }, [primaryWallet, cachedChainId]);

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
    const chainId = await getChainId();
    
    return {
      isConnected: connected,
      isEthereumWallet: true,
      address: primaryWallet.address,
      chainId
    };
  }, [primaryWallet, getChainId]);

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

  const validateNetwork = useCallback(async () => {
    const chainId = await getChainId();
    const targetChainId = 137; // Polygon Mainnet
    
    if (chainId !== targetChainId) {
      throw new ProposalError({
        category: 'network',
        message: 'Please connect to Polygon network',
        recoverySteps: ['Switch to Polygon Mainnet in your wallet']
      });
    }
  }, [getChainId]);

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

  // Clear cached chainId when wallet changes
  useEffect(() => {
    if (!primaryWallet?.address) {
      setCachedChainId(undefined);
    }
  }, [primaryWallet?.address]);

  return {
    getWalletState,
    getProvider,
    connectWallet,
    validateNetwork,
    isInitializing,
    getChainId
  };
};
