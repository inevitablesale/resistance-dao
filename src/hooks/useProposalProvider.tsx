
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { ProposalError } from "@/services/errorHandlingService";
import { useCallback, useEffect, useRef } from "react";

interface ProposalProvider {
  provider: ethers.providers.Web3Provider;
  getNetwork: () => Promise<ethers.providers.Network>;
  getSigner: () => ethers.providers.JsonRpcSigner;
}

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;
const INITIALIZATION_TIMEOUT = 10000; // 10 seconds timeout

export const useProposalProvider = () => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const providerRef = useRef<ProposalProvider | null>(null);
  const initializingRef = useRef<boolean>(false);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const clearInitializationTimeout = () => {
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }
  };

  const initializeProvider = useCallback(async (
    walletClient: any, 
    retryCount: number = 0
  ): Promise<ethers.providers.Web3Provider> => {
    try {
      console.log(`[Provider] Initialization attempt ${retryCount + 1}/${MAX_RETRIES}`);
      
      if (!walletClient) {
        console.error('[Provider] WalletClient is undefined');
        throw new Error('WalletClient is undefined');
      }

      // Create provider and immediately test it
      const provider = new ethers.providers.Web3Provider(walletClient);
      const network = await provider.getNetwork();
      console.log('[Provider] Successfully connected to network:', network.chainId);
      
      return provider;
    } catch (error) {
      console.error('[Provider] Initialization error:', error);
      
      if (retryCount < MAX_RETRIES - 1) {
        console.log(`[Provider] Retrying in ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY);
        return initializeProvider(walletClient, retryCount + 1);
      }
      
      throw new ProposalError({
        category: 'initialization',
        message: 'Failed to initialize provider after multiple attempts',
        recoverySteps: [
          'Check your wallet connection',
          'Make sure your wallet is unlocked',
          'Try refreshing the page'
        ]
      });
    }
  }, []);

  const validateWalletClient = useCallback(async (attempts: number = 0): Promise<any> => {
    if (!primaryWallet) {
      console.error('[Wallet] No primary wallet found');
      throw new ProposalError({
        category: 'initialization',
        message: 'Wallet not initialized',
        recoverySteps: ['Please connect your wallet', 'Try refreshing the page']
      });
    }

    try {
      console.log(`[Wallet] Client validation attempt ${attempts + 1}/${MAX_RETRIES}`);
      const walletClient = await primaryWallet.getWalletClient();
      
      if (!walletClient && attempts < MAX_RETRIES - 1) {
        console.log(`[Wallet] Client not available, retrying in ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY);
        return validateWalletClient(attempts + 1);
      }

      if (!walletClient) {
        throw new Error('Wallet client unavailable after multiple attempts');
      }

      console.log('[Wallet] Client validated successfully');
      return walletClient;
    } catch (error) {
      console.error('[Wallet] Client validation error:', error);
      
      if (attempts < MAX_RETRIES - 1) {
        console.log(`[Wallet] Retrying validation in ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY);
        return validateWalletClient(attempts + 1);
      }

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

  const getProvider = useCallback(async (): Promise<ProposalProvider> => {
    if (providerRef.current) {
      return providerRef.current;
    }

    if (initializingRef.current) {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const checkInterval = setInterval(() => {
          attempts++;
          if (!initializingRef.current && providerRef.current) {
            clearInterval(checkInterval);
            resolve(providerRef.current);
          }
          if (attempts > 50) { // 5 seconds max wait
            clearInterval(checkInterval);
            reject(new Error('Initialization timeout'));
          }
        }, 100);
      });
    }

    initializingRef.current = true;
    
    initTimeoutRef.current = setTimeout(() => {
      if (initializingRef.current) {
        initializingRef.current = false;
        console.error('[Provider] Initialization timeout');
        toast({
          title: "Connection Timeout",
          description: "Failed to initialize wallet connection. Please try again.",
          variant: "destructive",
        });
      }
    }, INITIALIZATION_TIMEOUT);

    try {
      console.log('[Provider] Starting initialization...');
      const walletClient = await validateWalletClient();
      const ethersProvider = await initializeProvider(walletClient);
      
      const provider: ProposalProvider = {
        provider: ethersProvider,
        getNetwork: () => ethersProvider.getNetwork(),
        getSigner: () => ethersProvider.getSigner()
      };
      
      providerRef.current = provider;
      return provider;
    } catch (error) {
      console.error('[Provider] Initialization failed:', error);
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
      clearInitializationTimeout();
      initializingRef.current = false;
    }
  }, [primaryWallet, toast, initializeProvider, validateWalletClient]);

  // Reset provider cache when wallet changes
  useEffect(() => {
    providerRef.current = null;
    return () => {
      clearInitializationTimeout();
      providerRef.current = null;
    };
  }, [primaryWallet]);

  return {
    getProvider,
    validateNetwork: async (provider: ProposalProvider) => {
      console.log('[Network] Starting validation...');
      try {
        const network = await provider.getNetwork();
        console.log('[Network] Current chain ID:', network.chainId);
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
    isConnected: !!primaryWallet?.isConnected?.()
  };
};
