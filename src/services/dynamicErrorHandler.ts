
import { DynamicError } from "@dynamic-labs/sdk-react-core";
import { ProposalError, ErrorCategory } from "./errorHandlingService";

interface DynamicErrorMapping {
  category: ErrorCategory;
  message: string;
  recoverySteps: string[];
}

const ERROR_MAPPINGS: Record<string, DynamicErrorMapping> = {
  WALLET_CONNECTION_ERROR: {
    category: 'wallet',
    message: 'Failed to connect wallet',
    recoverySteps: [
      'Check if your wallet is unlocked',
      'Make sure you have a supported wallet installed',
      'Try refreshing the page'
    ]
  },
  TRANSACTION_ERROR: {
    category: 'transaction',
    message: 'Transaction failed',
    recoverySteps: [
      'Check if you have enough funds',
      'Try increasing gas price',
      'Wait a few minutes and try again'
    ]
  },
  NETWORK_ERROR: {
    category: 'network',
    message: 'Network error',
    recoverySteps: [
      'Check your internet connection',
      'Make sure you are on the Polygon network',
      'Try refreshing the page'
    ]
  },
  CONTRACT_ERROR: {
    category: 'contract',
    message: 'Contract interaction failed',
    recoverySteps: [
      'Verify contract is not paused',
      'Check transaction parameters',
      'Try again with higher gas limit'
    ]
  }
};

export const handleDynamicError = (error: unknown): ProposalError => {
  console.error('Dynamic error:', error);

  if (error instanceof DynamicError) {
    const mapping = ERROR_MAPPINGS[error.code] || ERROR_MAPPINGS.TRANSACTION_ERROR;
    return new ProposalError({
      category: mapping.category,
      message: `${mapping.message}: ${error.message}`,
      recoverySteps: mapping.recoverySteps,
      technicalDetails: error.stack
    });
  }

  // Handle regular errors
  return new ProposalError({
    category: 'unknown',
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    recoverySteps: [
      'Try the operation again',
      'Check your wallet connection',
      'Contact support if the issue persists'
    ],
    technicalDetails: error instanceof Error ? error.stack : undefined
  });
};
