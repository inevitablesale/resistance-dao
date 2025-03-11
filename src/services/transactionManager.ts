
import { ethers } from "ethers";
import { ProposalError, handleError } from "./errorHandlingService";
import { EventConfig, waitForProposalCreation } from "./eventListenerService";
import { transactionQueue } from "./transactionQueueService";
import { checkTokenAllowance } from "./tokenService";
import { WalletType } from "@/hooks/useWalletProvider";

export type TransactionType = 
  | 'erc20_approval'
  | 'erc20_transfer'
  | 'erc721_mint'
  | 'erc721_transfer'
  | 'erc1155_transfer'
  | 'proposal'
  | 'contract';

export interface TransactionConfig {
  timeout: number;
  maxRetries: number;
  backoffMs: number;
  eventConfig?: EventConfig;
  description: string;
  type: TransactionType;
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
  timeout: 120000,
  maxRetries: 3,
  backoffMs: 5000
};

export const executeTransaction = async (
  transaction: () => Promise<ethers.ContractTransaction>,
  config: TransactionConfig,
  provider?: ethers.providers.Web3Provider
): Promise<ethers.ContractTransaction> => {
  console.log(`Executing ${config.type} transaction:`, {
    description: config.description,
    tokenConfig: config.tokenConfig,
    nftConfig: config.nftConfig
  });

  // Add specific validation for NFT transactions
  if ((config.type === 'erc721_mint' || config.type === 'erc721_transfer' || config.type === 'erc1155_transfer') 
      && config.nftConfig && provider) {
    console.log('NFT transaction config:', config.nftConfig);
    const network = await provider.getNetwork();
    console.log('NFT transaction on network:', network.name, network.chainId);
  }

  if (config.type === 'erc20_approval' && config.tokenConfig) {
    console.log('Token approval config:', config.tokenConfig);
  }

  if (provider) {
    const network = await provider.getNetwork();
    console.log('Current network:', {
      chainId: network.chainId,
      name: network.name
    });
  }

  if (config.type === 'erc20_transfer' && config.tokenConfig && provider && !config.tokenConfig.isTestMode) {
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

      if (config.eventConfig) {
        try {
          const event = await waitForProposalCreation(config.eventConfig, tx.hash);
          console.log('Proposal creation event received:', event);
        } catch (error) {
          console.warn('Failed to capture proposal event:', error);
        }
      }
      
      return tx;
    } catch (error: any) {
      console.error('Transaction execution failed:', error);
      throw error;
    }
  });

  return result;
};
