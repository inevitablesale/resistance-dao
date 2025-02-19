
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

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;
const INITIALIZATION_TIMEOUT = 10000;

export const useWalletProvider = () => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const providerRef = useRef<WalletProvider | null>(null);
  const initializingRef = useRef<boolean>(false);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getWalletType = (): WalletType => {
    if (!primaryWallet) return 'unknown';
    const isZeroDev = primaryWallet.connector?.name?.toLowerCase().includes('zerodev');
    return isZeroDev ? 'zerodev' : 'regular';
  };

  const clearInitializationTimeout = () => {
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }
  };

  const validateTransactionSupport = async (provider: ethers.providers.Web3Provider) => {
    try {
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      // Check if the provider supports transactions
      const code = await provider.getCode(address);
      console.log('[Transaction Support] Wallet code check completed');
      
      // Verify the signer can perform transactions
      const network = await provider.getNetwork();
      console.log('[Transaction Support] Network verification completed:', network.name);
      
      // Validate the signer's capabilities
      const signerNetwork = await signer.provider?.getNetwork();
      if (!signerNetwork) {
        throw new Error('Signer network validation failed');
      }
      
      console.log('[Transaction Support] Signer validation completed');
      return true;
    } catch (error) {
      console.error('[Transaction Support] Validation failed:', error);
      return false;
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

      // Create provider and test it
      const provider = new ethers.providers.Web3Provider(walletClient, "any");
      
      // Validate transaction support
      const hasTransactionSupport = await validateTransactionSupport(provider);
      if (!hasTransactionSupport) {
        throw new Error('Wallet does not support transactions');
      }

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
      
      if (!walletClient) {
        if (attempts < MAX_RETRIES - 1) {
          console.log(`[Wallet] Client not available, retrying in ${RETRY_DELAY}ms...`);
          await delay(RETRY_DELAY);
          return validateWalletClient(attempts + 1);
        }
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

  const getProvider = useCallback(async (): Promise<WalletProvider> => {
    if (providerRef.current) {
      // Validate the existing provider
      try {
        await validateTransactionSupport(providerRef.current.provider);
        return providerRef.current;
      } catch (error) {
        console.log('[Provider] Existing provider validation failed, reinitializing...');
        providerRef.current = null;
      }
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
          if (attempts > 50) {
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
      let currentWalletType = getWalletType();
      
      if (currentWalletType === 'zerodev') {
        console.log('[Provider] Initializing ZeroDev provider...');
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
          console.error('[Provider] ZeroDev initialization failed, falling back to regular wallet');
          toast({
            title: "Smart Wallet Unavailable",
            description: "Falling back to regular wallet mode",
            variant: "default"
          });
          currentWalletType = 'regular';
        }
      }

      console.log('[Provider] Initializing regular wallet provider...');
      const ethersProvider = await initializeProvider(walletClient);
      const provider: WalletProvider = {
        provider: ethersProvider,
        type: currentWalletType,
        isSmartWallet: false,
        getNetwork: () => ethersProvider.getNetwork(),
        getSigner: () => ethersProvider.getSigner()
      };
      providerRef.current = provider;
      
      // Add success toast
      toast({
        title: "Wallet Connected",
        description: "Your wallet is ready for transactions",
        variant: "default"
      });
      
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
  }, [primaryWallet, toast, initializeProvider]);

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
    validateNetwork: async (provider: WalletProvider) => {
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
    getWalletType,
    isConnected: !!primaryWallet?.isConnected?.()
  };
};
