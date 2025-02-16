
import { ethers } from "ethers";
import { ProposalError, handleError } from "./errorHandlingService";
import { EventConfig, waitForProposalCreation, ProposalEvent } from "./eventListenerService";
import { transactionQueue, type TransactionResult } from "./transactionQueueService";

export interface TransactionConfig {
  timeout: number;
  maxRetries: number;
  backoffMs: number;
  eventConfig?: EventConfig;
  description: string;
  type: 'proposal' | 'token' | 'contract';
}

const DEFAULT_CONFIG: Omit<TransactionConfig, 'description' | 'type'> = {
  timeout: 120000, // 2 minutes
  maxRetries: 3,
  backoffMs: 5000
};

export const executeTransaction = async (
  transaction: () => Promise<ethers.ContractTransaction>,
  config: TransactionConfig
): Promise<TransactionResult> => {
  // Add to queue first
  const txId = await transactionQueue.addTransaction({
    type: config.type,
    description: config.description
  });
  
  return await transactionQueue.processTransaction(txId, async () => {
    try {
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
      
      // If event config is provided, wait for the event
      let event: ProposalEvent | undefined;
      if (config.eventConfig) {
        try {
          event = await waitForProposalCreation(config.eventConfig, tx.hash);
          console.log('Proposal creation event received:', event);
        } catch (error) {
          console.warn('Failed to capture proposal event:', error);
        }
      }
      
      return {
        success: true,
        hash: tx.hash,
        receipt,
        event
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
};
