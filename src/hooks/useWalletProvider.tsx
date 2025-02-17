
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { ProposalError } from "@/services/errorHandlingService";

export type WalletType = 'regular' | 'unknown';

interface WalletProvider {
  provider: ethers.providers.Web3Provider;
  type: WalletType;
  isSmartWallet: boolean;
  getNetwork: () => Promise<ethers.providers.Network>;
  getSigner: () => ethers.providers.JsonRpcSigner;
}

export const useWalletProvider = () => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();

  const getWalletType = (): WalletType => {
    if (!primaryWallet) return 'unknown';
    return 'regular';
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
      console.log('Initializing wallet provider...');
      const walletClient = await primaryWallet.getWalletClient();
      
      if (!walletClient) {
        throw new ProposalError({
          category: 'wallet',
          message: 'Failed to initialize wallet client',
          recoverySteps: ['Please refresh and try again', 'Check wallet connection']
        });
      }

      const ethersProvider = new ethers.providers.Web3Provider(walletClient as any);
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
    provider: WalletProvider,
    transaction: ethers.providers.TransactionRequest
  ): Promise<ethers.BigNumber> => {
    try {
      console.log('Estimating gas...');
      const gasEstimate = await provider.provider.estimateGas(transaction);
      
      // Add a 20% buffer for safety
      const gasBuffer = gasEstimate.mul(120).div(100);
      console.log('Gas estimate with buffer:', gasBuffer.toString());
      
      return gasBuffer;
    } catch (error: any) {
      console.error('Gas estimation error:', error);
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
