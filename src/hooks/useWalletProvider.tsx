
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { ProposalError } from "@/services/errorHandlingService";

export type WalletType = 'regular' | 'zerodev' | 'unknown';

interface WalletProvider {
  provider: ethers.providers.Web3Provider;
  type: WalletType;
  isSmartWallet: boolean;
  getNetwork: () => Promise<ethers.providers.Network>;
  getSigner: () => ethers.providers.JsonRpcSigner;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export const useWalletProvider = () => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getWalletType = (): WalletType => {
    if (!primaryWallet) return 'unknown';
    const isZeroDev = primaryWallet.connector?.name?.toLowerCase().includes('zerodev');
    return isZeroDev ? 'zerodev' : 'regular';
  };

  const initializeProvider = async (
    walletClient: any, 
    retryCount: number = 0
  ): Promise<ethers.providers.Web3Provider> => {
    try {
      console.log(`Initializing provider attempt ${retryCount + 1}/${MAX_RETRIES}`);
      return new ethers.providers.Web3Provider(walletClient);
    } catch (error) {
      if (retryCount < MAX_RETRIES - 1) {
        console.log(`Provider initialization failed, retrying in ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY);
        return initializeProvider(walletClient, retryCount + 1);
      }
      throw error;
    }
  };

  const validateWalletClient = async (attempts: number = 0): Promise<any> => {
    if (!primaryWallet) {
      throw new ProposalError({
        category: 'wallet',
        message: 'No wallet connected',
        recoverySteps: ['Please connect your wallet to continue']
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
        category: 'wallet',
        message: 'Failed to initialize wallet client',
        recoverySteps: [
          'Please refresh the page',
          'Make sure your wallet is unlocked',
          'Try disconnecting and reconnecting your wallet'
        ]
      });
    }
  };

  const getProvider = async (): Promise<WalletProvider> => {
    try {
      console.log('Starting provider initialization...');
      const walletClient = await validateWalletClient();
      const walletType = getWalletType();
      
      if (walletType === 'zerodev') {
        console.log('Initializing ZeroDev provider...');
        try {
          const ethersProvider = await initializeProvider(walletClient);
          return {
            provider: ethersProvider,
            type: 'zerodev',
            isSmartWallet: true,
            getNetwork: () => ethersProvider.getNetwork(),
            getSigner: () => ethersProvider.getSigner()
          };
        } catch (error) {
          console.error('ZeroDev provider initialization failed, falling back to regular wallet');
          toast({
            title: "Smart Wallet Unavailable",
            description: "Falling back to regular wallet mode",
            variant: "default"
          });
          walletType = 'regular';
        }
      }

      console.log('Initializing regular wallet provider...');
      const ethersProvider = await initializeProvider(walletClient);
      return {
        provider: ethersProvider,
        type: 'regular',
        isSmartWallet: false,
        getNetwork: () => ethersProvider.getNetwork(),
        getSigner: () => ethersProvider.getSigner()
      };
    } catch (error) {
      console.error('Provider initialization error:', error);
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

  const validateNetwork = async (provider: WalletProvider) => {
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
  };

  const estimateGas = async (
    provider: WalletProvider,
    transaction: ethers.providers.TransactionRequest,
    walletType: WalletType
  ): Promise<ethers.BigNumber> => {
    try {
      console.log(`Estimating gas for ${walletType} wallet...`);
      const gasEstimate = await provider.provider.estimateGas(transaction);
      
      // Add a 20% buffer for safety
      const gasBuffer = gasEstimate.mul(120).div(100);
      console.log('Gas estimate with buffer:', gasBuffer.toString());
      
      return gasBuffer;
    } catch (error: any) {
      console.error('Gas estimation error:', error);
      
      if (walletType === 'zerodev') {
        if (error.message.includes('execution reverted')) {
          throw new ProposalError({
            category: 'transaction',
            message: 'Transaction simulation failed',
            recoverySteps: [
              'Verify transaction parameters',
              'Check if you have enough MATIC for gas',
              'Try again with a higher gas limit'
            ]
          });
        }
      }
      
      throw error;
    }
  };

  return {
    getProvider,
    validateNetwork,
    estimateGas,
    getWalletType,
    isConnected: !!primaryWallet?.isConnected?.()
  };
};
