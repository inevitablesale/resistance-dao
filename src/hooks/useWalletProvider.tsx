
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { ProposalError } from "@/services/errorHandlingService";

export type WalletType = 'regular' | 'zerodev' | 'unknown';

interface WalletProvider {
  provider: ethers.providers.Web3Provider;
  type: WalletType;
  isSmartWallet: boolean;
}

export const useWalletProvider = () => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();

  const getWalletType = (): WalletType => {
    if (!primaryWallet) return 'unknown';
    return primaryWallet.connector?.key === 'zerodev' ? 'zerodev' : 'regular';
  };

  const getProvider = async (): Promise<WalletProvider> => {
    if (!primaryWallet) {
      throw new ProposalError({
        category: 'wallet',
        message: 'No wallet connected',
        recoverySteps: ['Please connect your wallet to continue']
      });
    }

    try {
      const walletType = getWalletType();
      const walletClient = await primaryWallet.getWalletClient();
      
      if (!walletClient) {
        throw new ProposalError({
          category: 'wallet',
          message: 'Failed to initialize wallet client',
          recoverySteps: ['Please refresh and try again', 'Check wallet connection']
        });
      }

      // For ZeroDev wallets, we need to use their bundler RPC
      if (walletType === 'zerodev') {
        console.log('Initializing ZeroDev provider...');
        const provider = new ethers.providers.Web3Provider(walletClient as any);
        return {
          provider,
          type: 'zerodev',
          isSmartWallet: true
        };
      }

      // For regular wallets, use their native provider
      console.log('Initializing regular wallet provider...');
      const provider = new ethers.providers.Web3Provider(walletClient as any);
      return {
        provider,
        type: 'regular',
        isSmartWallet: false
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

  const validateNetwork = async (provider: ethers.providers.Web3Provider) => {
    console.log('Starting network validation...');
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
  };

  const estimateGas = async (
    provider: ethers.providers.Web3Provider,
    transaction: ethers.providers.TransactionRequest,
    walletType: WalletType
  ): Promise<ethers.BigNumber> => {
    try {
      console.log(`Estimating gas for ${walletType} wallet...`);
      const gasEstimate = await provider.estimateGas(transaction);
      
      // Add a 20% buffer for safety
      const gasBuffer = gasEstimate.mul(120).div(100);
      console.log('Gas estimate with buffer:', gasBuffer.toString());
      
      return gasBuffer;
    } catch (error: any) {
      console.error('Gas estimation error:', error);
      
      if (walletType === 'zerodev') {
        // For ZeroDev, we need to handle bundler-specific errors
        if (error.message.includes('execution reverted')) {
          throw new ProposalError({
            category: 'gas',
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
