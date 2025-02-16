
import { ethers } from "ethers";

export interface TransactionConfig {
  timeout: number;
  maxRetries: number;
  backoffMs: number;
}

export interface TransactionResult {
  status: 'success' | 'failed' | 'timeout';
  hash?: string;
  error?: Error;
  receipt?: ethers.ContractReceipt;
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
        setTimeout(() => reject(new Error('Transaction timeout')), config.timeout);
      });
      
      const receiptPromise = tx.wait();
      
      const receipt = await Promise.race([receiptPromise, timeoutPromise]) as ethers.ContractReceipt;
      
      return {
        status: 'success',
        hash: tx.hash,
        receipt
      };
    } catch (error: any) {
      console.error(`Transaction attempt ${attempt + 1} failed:`, error);
      
      if (error.message === 'Transaction timeout' || 
          error.code === 'NETWORK_ERROR' || 
          error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        attempt++;
        if (attempt < config.maxRetries) {
          await wait(config.backoffMs * attempt);
          continue;
        }
      }
      
      return {
        status: 'failed',
        error: error
      };
    }
  }
  
  return {
    status: 'failed',
    error: new Error(`Failed after ${config.maxRetries} attempts`)
  };
};
