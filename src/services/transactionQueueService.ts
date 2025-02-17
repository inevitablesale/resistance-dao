
import { ethers } from "ethers";
import { toast } from "@/hooks/use-toast";
import { ProposalError } from "./errorHandlingService";
import { gasOptimizer } from "./gasOptimizationService";

export interface QueuedTransaction {
  id: string;
  type: 'proposal' | 'token' | 'contract';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  hash?: string;
  description: string;
  createdAt: number;
  error?: string;
  retryCount: number;
}

export interface TransactionSuccess {
  success: true;
  transaction: ethers.ContractTransaction;
  receipt: ethers.ContractReceipt;
}

export interface TransactionFailure {
  success: false;
  error: ProposalError;
}

export type TransactionResult = TransactionSuccess | TransactionFailure;

class TransactionQueueService {
  private queue: Map<string, QueuedTransaction> = new Map();
  private maxRetries = 3;
  private processingDelay = 1000; // 1 second between retries

  public async addTransaction(
    transaction: Omit<QueuedTransaction, 'id' | 'status' | 'createdAt' | 'retryCount'>
  ): Promise<string> {
    const id = crypto.randomUUID();
    const queuedTx: QueuedTransaction = {
      ...transaction,
      id,
      status: 'pending',
      createdAt: Date.now(),
      retryCount: 0
    };

    this.queue.set(id, queuedTx);
    this.notifyUpdate(queuedTx);
    return id;
  }

  public getTransaction(id: string): QueuedTransaction | undefined {
    return this.queue.get(id);
  }

  public getAllTransactions(): QueuedTransaction[] {
    return Array.from(this.queue.values());
  }

  public getPendingTransactions(): QueuedTransaction[] {
    return this.getAllTransactions().filter(tx => tx.status === 'pending');
  }

  public async processTransaction(
    id: string,
    executor: () => Promise<TransactionResult>
  ): Promise<TransactionResult> {
    const tx = this.queue.get(id);
    if (!tx) {
      throw new ProposalError({
        category: 'transaction',
        message: 'Transaction not found',
        recoverySteps: ['Check the transaction ID', 'Try submitting the transaction again']
      });
    }

    tx.status = 'processing';
    this.notifyUpdate(tx);

    try {
      const result = await executor();
      
      if (result.success) {
        // Add gas price to history through optimizer
        if (result.transaction.provider) {
          await gasOptimizer.getOptimizedGasPrice(
            result.transaction.provider,
            tx.type === 'contract' ? 'high' : 'medium'
          );
        }

        tx.status = 'completed';
        tx.hash = result.transaction.hash;
        this.notifyUpdate(tx);
        return result;
      }

      // If we get here, it's a failure result
      tx.status = 'failed';
      tx.error = 'Transaction execution failed';
      this.notifyUpdate(tx);
      return result;
      
    } catch (error: any) {
      console.error(`Transaction ${id} failed:`, error);
      
      if (tx.retryCount < this.maxRetries) {
        tx.retryCount++;
        tx.status = 'pending';
        this.notifyUpdate(tx);
        
        // Wait before retrying with exponential backoff
        const backoffTime = this.processingDelay * Math.pow(2, tx.retryCount - 1);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return this.processTransaction(id, executor);
      }

      tx.status = 'failed';
      tx.error = error.message;
      this.notifyUpdate(tx);
      
      return {
        success: false,
        error: new ProposalError({
          category: 'transaction',
          message: `Transaction failed after ${this.maxRetries} attempts`,
          recoverySteps: [
            'Check your wallet connection',
            'Verify you have enough funds',
            'Try increasing the gas price'
          ],
          technicalDetails: error.message
        })
      };
    }
  }

  private notifyUpdate(transaction: QueuedTransaction) {
    const timingSuggestion = transaction.status === 'pending' 
      ? gasOptimizer.getTransactionTimingSuggestion()
      : null;

    // Update UI via toast notifications
    switch (transaction.status) {
      case 'pending':
        toast({
          title: "Transaction Pending",
          description: `${transaction.description}${timingSuggestion ? `\n${timingSuggestion}` : ''}`,
        });
        break;
      case 'processing':
        toast({
          title: "Processing Transaction",
          description: `${transaction.description} - Attempt ${transaction.retryCount + 1}/${this.maxRetries + 1}`,
        });
        break;
      case 'completed':
        toast({
          title: "Transaction Completed",
          description: transaction.description,
          variant: "default"
        });
        break;
      case 'failed':
        toast({
          title: "Transaction Failed",
          description: transaction.error || "Unknown error occurred",
          variant: "destructive"
        });
        break;
    }
  }
}

// Export singleton instance
export const transactionQueue = new TransactionQueueService();
