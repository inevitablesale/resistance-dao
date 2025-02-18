
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { ProposalError } from "@/services/errorHandlingService";
import { useCallback, useEffect, useRef } from "react";

export type WalletType = 'regular' | 'zerodev' | 'unknown';

interface WalletProvider {
  provider: ethers.providers.Web3Provider;
  type: WalletType;
  isSmartWallet: boolean;
  getNetwork: () => Promise<ethers.providers.Network>;
  getSigner: () => ethers.providers.JsonRpcSigner;
}

const MAX_RETRIES = 5; // Increased from 3 to 5
const RETRY_DELAY = 1000; // Reduced from 2000 to 1000ms for faster retries

export const useWalletProvider = () => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const providerRef = useRef<WalletProvider | null>(null);
  const initializingRef = useRef<boolean>(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getWalletType = (): WalletType => {
    if (!primaryWallet) return 'unknown';
    const isZeroDev = primaryWallet.connector?.name?.toLowerCase().includes('zerodev');
    return isZeroDev ? 'zerodev' : 'regular';
  };

  const initializeProvider = useCallback(async (
    walletClient: any, 
    retryCount: number = 0
  ): Promise<ethers.providers.Web3Provider> => {
    try {
      console.log(`Initializing provider attempt ${retryCount + 1}/${MAX_RETRIES}`);
      
      if (!walletClient) {
        throw new Error('WalletClient is undefined');
      }
      
      const provider = new ethers.providers.Web3Provider(walletClient);
      // Verify the provider is working
      await provider.getNetwork();
      return provider;
    } catch (error) {
      console.error('Provider initialization error:', error);
      if (retryCount < MAX_RETRIES - 1) {
        console.log(`Provider initialization failed, retrying in ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY);
        return initializeProvider(walletClient, retryCount + 1);
      }
      throw error;
    }
  }, []);

  const validateWalletClient = useCallback(async (attempts: number = 0): Promise<any> => {
    if (!primaryWallet) {
      throw new ProposalError({
        category: 'initialization',
        message: 'Wallet not initialized',
        recoverySteps: ['Please wait for wallet initialization to complete', 'Try refreshing the page']
      });
    }

    try {
      console.log(`Getting wallet client attempt ${attempts + 1}/${MAX_RETRIES}`);
      const walletClient = await primaryWallet.getWalletClient();
      
      if (!walletClient) {
        if (attempts < MAX_RETRIES - 1) {
          console.log(`Wallet client not available, retrying in ${RETRY_DELAY}ms...`);
          await delay(RETRY_DELAY);
          return validateWalletClient(attempts + 1);
        }
        throw new Error('Failed to get wallet client after multiple attempts');
      }

      return walletClient;
    } catch (error) {
      console.error('Wallet client validation error:', error);
      throw new ProposalError({
        category: 'initialization',
        message: 'Failed to initialize wallet client',
        recoverySteps: [
          'Please wait a few moments',
          'Make sure your wallet is unlocked',
          'Try disconnecting and reconnecting your wallet'
        ]
      });
    }
  }, [primaryWallet]);

  const getProvider = useCallback(async (): Promise<WalletProvider> => {
    if (providerRef.current) {
      return providerRef.current;
    }

    if (initializingRef.current) {
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (!initializingRef.current) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
      });
      if (providerRef.current) {
        return providerRef.current;
      }
    }

    initializingRef.current = true;

    try {
      console.log('Starting provider initialization...');
      const walletClient = await validateWalletClient();
      let currentWalletType = getWalletType();
      
      if (currentWalletType === 'zerodev') {
        console.log('Initializing ZeroDev provider...');
        try {
          const ethersProvider = await initializeProvider(walletClient);
          const provider: WalletProvider = {
            provider: ethersProvider,
            type: 'zerodev',
            isSmartWallet: true,
            getNetwork: () => ethersProvider.getNetwork(),
            getSigner: () => ethersProvider.getSigner()
          };
          providerRef.current = provider;
          return provider;
        } catch (error) {
          console.error('ZeroDev provider initialization failed, falling back to regular wallet');
          toast({
            title: "Smart Wallet Unavailable",
            description: "Falling back to regular wallet mode",
            variant: "default"
          });
          currentWalletType = 'regular';
        }
      }

      console.log('Initializing regular wallet provider...');
      const ethersProvider = await initializeProvider(walletClient);
      const provider: WalletProvider = {
        provider: ethersProvider,
        type: currentWalletType,
        isSmartWallet: false,
        getNetwork: () => ethersProvider.getNetwork(),
        getSigner: () => ethersProvider.getSigner()
      };
      providerRef.current = provider;
      return provider;
    } catch (error) {
      console.error('Provider initialization error:', error);
      throw new ProposalError({
        category: 'initialization',
        message: 'Failed to initialize provider',
        recoverySteps: [
          'Please wait for initialization to complete',
          'Check your wallet connection',
          'Try refreshing the page'
        ]
      });
    } finally {
      initializingRef.current = false;
    }
  }, [primaryWallet, toast, initializeProvider, validateWalletClient]);

  // Reset provider cache when wallet changes
  useEffect(() => {
    providerRef.current = null;
    return () => {
      providerRef.current = null;
    };
  }, [primaryWallet]);

  return {
    getProvider,
    validateNetwork: async (provider: WalletProvider) => {
      console.log('Starting network validation...');
      try {
        const network = await provider.getNetwork();
        console.log('Current chain ID:', network.chainId);
        const targetChainId = 137; // Polygon Mainnet
        
        if (network.chainId !== targetChainId) {
          throw new ProposalError({
            category: 'network',
            message: 'Please connect to Polygon network',
            recoverySteps: ['Switch to Polygon Mainnet in your wallet']
          });
        }
      } catch (error) {
        if (error instanceof ProposalError) throw error;
        
        throw new ProposalError({
          category: 'network',
          message: 'Network validation failed',
          recoverySteps: [
            'Check your internet connection',
            'Make sure you are connected to Polygon network',
            'Try refreshing the page'
          ]
        });
      }
    },
    getWalletType,
    isConnected: !!primaryWallet?.isConnected?.()
  };
};
