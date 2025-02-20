
import { ethers } from "ethers";
import { ProposalError, handleError } from "./errorHandlingService";
import { EventConfig, waitForProposalCreation } from "./eventListenerService";
import { transactionQueue } from "./transactionQueueService";
import { checkTokenAllowance } from "./tokenService";
import { WalletType } from "@/hooks/useWalletProvider";

export interface TransactionConfig {
  timeout: number;
  maxRetries: number;
  backoffMs: number;
  eventConfig?: EventConfig;
  description: string;
  type: 'proposal' | 'token' | 'contract' | 'nft' | 'approval';
  tokenConfig?: {
    tokenAddress: string;
    spenderAddress: string;
    amount: string;
    isTestMode?: boolean;
    isApproval?: boolean;
  };
  nftConfig?: {
    tokenAddress: string;
    tokenId?: number;
    amount: number;
    standard: "ERC721" | "ERC1155";
    symbol?: string;
    name?: string;
  };
  walletType?: WalletType;
}

const DEFAULT_CONFIG: Omit<TransactionConfig, 'description' | 'type'> = {
  timeout: 120000, // 2 minutes
  maxRetries: 3,
  backoffMs: 5000
};

export const executeTransaction = async (
  transaction: () => Promise<ethers.ContractTransaction>,
  config: TransactionConfig,
  provider?: ethers.providers.Web3Provider
): Promise<ethers.ContractTransaction> => {
  if (config.type === 'token' && config.tokenConfig) {
    console.log('Token transaction config:', {
      ...config.tokenConfig,
      amount: ethers.utils.formatEther(config.tokenConfig.amount),
    });
  }

  if (config.type === 'nft' && config.nftConfig) {
    console.log('NFT transaction config:', {
      ...config.nftConfig,
      tokenAddress: config.nftConfig.tokenAddress,
      standard: config.nftConfig.standard,
      amount: config.nftConfig.amount,
      symbol: config.nftConfig.symbol || 'Unknown',
      name: config.nftConfig.name || 'Unknown NFT'
    });
  }

  // Log network info
  if (provider) {
    const network = await provider.getNetwork();
    console.log('Current network:', {
      chainId: network.chainId,
      name: network.name
    });
  }

  // Skip allowance check for approval transactions
  if (config.type === 'token' && config.tokenConfig && provider && !config.tokenConfig.isTestMode && !config.tokenConfig.isApproval) {
    console.log('Checking token allowance...');
    const signerAddress = await provider.getSigner().getAddress();
    
    const hasAllowance = await checkTokenAllowance(
      provider,
      config.tokenConfig.tokenAddress,
      signerAddress,
      config.tokenConfig.spenderAddress,
      config.tokenConfig.amount
    );

    if (!hasAllowance) {
      throw new ProposalError({
        category: 'token',
        message: 'Insufficient token allowance',
        recoverySteps: [
          'Approve the token spending',
          'Try the transaction again after approval'
        ]
      });
    }
    console.log('Token allowance check passed');
  }

  // Add to queue first
  const txId = await transactionQueue.addTransaction({
    type: config.type,
    description: config.description
  });
  
  const result = await transactionQueue.processTransaction(txId, async () => {
    try {
      console.log('Executing transaction...');
      const tx = await transaction();
      console.log('Transaction submitted:', tx.hash);
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new ProposalError({
          category: 'transaction',
          message: 'Transaction timeout',
          recoverySteps: ['Check transaction status in your wallet', 'Try again with higher gas price']
        })), config.timeout || DEFAULT_CONFIG.timeout);
      });
      
      const receiptPromise = tx.wait();
      
      const receipt = await Promise.race([receiptPromise, timeoutPromise]);
      console.log('Transaction receipt received:', receipt);

      if (config.type === 'nft') {
        console.log('NFT transaction completed:', {
          type: config.type,
          tokenAddress: config.nftConfig?.tokenAddress,
          amount: config.nftConfig?.amount,
          standard: config.nftConfig?.standard,
          symbol: config.nftConfig?.symbol,
          name: config.nftConfig?.name
        });
      }
      
      if (config.eventConfig) {
        try {
          const event = await waitForProposalCreation(config.eventConfig, tx.hash);
          console.log('Proposal creation event received:', event);
        } catch (error) {
          console.warn('Failed to capture proposal event:', error);
        }
      }
      
      return {
        success: true,
        transaction: tx,
        receipt
      };
    } catch (error: any) {
      console.error('Transaction execution failed:', error);
      const errorDetails = handleError(error);
      
      return {
        success: false,
        error: new ProposalError(errorDetails)
      };
    }
  });

  if (!result.success) {
    throw new ProposalError({
      category: 'transaction',
      message: 'Transaction failed',
      recoverySteps: ['Please try again', 'Check your wallet connection'],
      technicalDetails: 'Transaction execution failed'
    });
  }

  return result.transaction;
};

