
import { ethers } from "ethers";
import { ProposalError, handleError } from "./errorHandlingService";
import { EventConfig, waitForProposalCreation, ProposalEvent } from "./eventListenerService";

export interface TransactionConfig {
  timeout: number;
  maxRetries: number;
  backoffMs: number;
  eventConfig?: EventConfig;
}

export interface TransactionResult {
  status: 'success' | 'failed' | 'timeout';
  hash?: string;
  error?: Error;
  receipt?: ethers.ContractReceipt;
  event?: ProposalEvent;
}

const DEFAULT_CONFIG: TransactionConfig = {
  timeout: 120000, // 2 minutes
  maxRetries: 3,
  backoffMs: 5000
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const executeTransaction = async (
  transaction: () => Promise<ethers.ContractTransaction>,
  config: TransactionConfig = DEFAULT_CONFIG
): Promise<TransactionResult> => {
  let attempt = 0;
  
  while (attempt < config.maxRetries) {
    try {
      const tx = await transaction();
      console.log('Transaction submitted:', tx.hash);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new ProposalError({
          category: 'transaction',
          message: 'Transaction timeout',
          recoverySteps: ['Check transaction status in your wallet', 'Try again with higher gas price']
        })), config.timeout);
      });
      
      const receiptPromise = tx.wait();
      
      const receipt = await Promise.race([receiptPromise, timeoutPromise]) as ethers.ContractReceipt;
      
      // If event config is provided, wait for the event
      let event: ProposalEvent | undefined;
      if (config.eventConfig) {
        try {
          event = await waitForProposalCreation(config.eventConfig, tx.hash);
          console.log('Proposal creation event received:', event);
        } catch (error) {
          console.warn('Failed to capture proposal event:', error);
          // Don't fail the transaction if event capture fails
        }
      }
      
      return {
        status: 'success',
        hash: tx.hash,
        receipt,
        event
      };
    } catch (error: any) {
      console.error(`Transaction attempt ${attempt + 1} failed:`, error);
      
      const errorDetails = handleError(error);
      
      if (errorDetails.category === 'network' || 
          errorDetails.category === 'transaction' ||
          error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        attempt++;
        if (attempt < config.maxRetries) {
          await wait(config.backoffMs * attempt);
          continue;
        }
      }
      
      return {
        status: 'failed',
        error: new ProposalError(errorDetails)
      };
    }
  }
  
  return {
    status: 'failed',
    error: new ProposalError({
      category: 'transaction',
      message: `Failed after ${config.maxRetries} attempts`,
      recoverySteps: ['Try again with higher gas price', 'Check network status']
    })
  };
};
