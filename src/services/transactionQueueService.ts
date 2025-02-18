
import { ethers } from "ethers";
import { nanoid } from 'nanoid';
import { ProposalError } from "./errorHandlingService";

export interface QueuedTransaction {
  id: string;
  type: 'contract' | 'proposal' | 'approval';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
  hash?: string;
  error?: string;
  retryCount: number;
  maxRetries?: number;
  timestamp: number;
}

interface TransactionOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

class TransactionQueue {
  private transactions: Map<string, QueuedTransaction> = new Map();
  private readonly DEFAULT_MAX_RETRIES = 3;
  private readonly DEFAULT_RETRY_DELAY = 2000;
  private readonly DEFAULT_TIMEOUT = 30000;

  constructor() {
    // Initialize with empty queue
    this.transactions = new Map();
  }

  async addTransaction(
    transaction: Pick<QueuedTransaction, 'type' | 'description'>
  ): Promise<string> {
    const id = nanoid();
    const newTransaction: QueuedTransaction = {
      id,
      type: transaction.type,
      status: 'pending',
      description: transaction.description,
      retryCount: 0,
      timestamp: Date.now()
    };
    
    this.transactions.set(id, newTransaction);
    return id;
  }

  getTransaction(id: string): QueuedTransaction | undefined {
    return this.transactions.get(id);
  }

  private async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async executeWithTimeout<T>(
    promise: Promise<T>,
    timeout: number
  ): Promise<T> {
    let timeoutId: NodeJS.Timeout;
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Transaction timeout'));
      }, timeout);
    });

    try {
      const result = await Promise.race([promise, timeoutPromise]);
      clearTimeout(timeoutId!);
      return result;
    } catch (error) {
      clearTimeout(timeoutId!);
      throw error;
    }
  }

  async processTransaction<T>(
    id: string,
    operation: () => Promise<T>,
    options: TransactionOptions = {}
  ): Promise<T> {
    const transaction = this.transactions.get(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const maxRetries = options.maxRetries ?? this.DEFAULT_MAX_RETRIES;
    const retryDelay = options.retryDelay ?? this.DEFAULT_RETRY_DELAY;
    const timeout = options.timeout ?? this.DEFAULT_TIMEOUT;

    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        transaction.status = 'processing';
        transaction.retryCount = attempt;
        this.transactions.set(id, transaction);

        const result = await this.executeWithTimeout(operation(), timeout);

        transaction.status = 'completed';
        if (result && typeof result === 'object' && 'hash' in result) {
          transaction.hash = (result as any).hash;
        }
        this.transactions.set(id, transaction);

        return result;
      } catch (error: any) {
        console.error(`Transaction attempt ${attempt + 1} failed:`, error);
        lastError = error;

        if (this.shouldRetry(error) && attempt < maxRetries) {
          await this.wait(retryDelay * Math.pow(2, attempt)); // Exponential backoff
          continue;
        }

        break;
      }
    }

    transaction.status = 'failed';
    transaction.error = lastError?.message || 'Transaction failed';
    this.transactions.set(id, transaction);

    throw new ProposalError({
      category: 'transaction',
      message: lastError?.message || 'Transaction failed after multiple attempts',
      recoverySteps: [
        'Check your wallet connection',
        'Verify you have enough balance',
        'Try again in a few minutes'
      ]
    });
  }

  private shouldRetry(error: any): boolean {
    const retryableErrors = [
      'nonce too low',
      'replacement transaction underpriced',
      'transaction underpriced',
      'insufficient funds',
      'network error',
      'timeout',
      'failed to fetch',
      'execution reverted'
    ];

    const errorMessage = error?.message?.toLowerCase() || '';
    return retryableErrors.some(msg => errorMessage.includes(msg));
  }

  clearTransaction(id: string): void {
    this.transactions.delete(id);
  }

  clearAllTransactions(): void {
    this.transactions.clear();
  }
}

export const transactionQueue = new TransactionQueue();
