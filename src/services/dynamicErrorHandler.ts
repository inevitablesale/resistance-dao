
import type { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { ProposalError, ErrorCategory } from "./errorHandlingService";

interface DynamicErrorMapping {
  category: ErrorCategory;
  message: string;
  recoverySteps: string[];
}

const ERROR_MAPPINGS: Record<string, DynamicErrorMapping> = {
  INITIALIZATION_ERROR: {
    category: 'initialization',
    message: 'Wallet initialization failed',
    recoverySteps: [
      'Please wait for initialization to complete',
      'Try refreshing the page',
      'Make sure your wallet is unlocked'
    ]
  },
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
  },
  CHRONICLE_ERROR: {
    category: 'chronicle',
    message: 'Chronicle operation failed',
    recoverySteps: [
      'Check your chronicle content',
      'Verify territory requirements',
      'Ensure your character has sufficient reputation'
    ]
  },
  TERRITORY_ERROR: {
    category: 'territory',
    message: 'Territory operation failed',
    recoverySteps: [
      'Verify territory access requirements',
      'Check radiation levels',
      'Ensure your character has sufficient influence'
    ]
  },
  CHARACTER_ERROR: {
    category: 'character',
    message: 'Character operation failed',
    recoverySteps: [
      'Check character requirements',
      'Verify rank progression criteria',
      'Ensure you have the required achievements'
    ]
  }
};

export const handleDynamicError = (error: unknown): ProposalError => {
  console.error('Dynamic error:', error);

  // Handle initialization-specific errors
  if (error instanceof Error && error.message.includes('wallet client')) {
    return new ProposalError({
      category: 'initialization',
      message: 'Wallet initialization in progress',
      recoverySteps: [
        'Please wait for initialization to complete',
        'Try refreshing the page if this persists'
      ]
    });
  }

  // Chronicle-specific errors
  if (error instanceof Error && 
     (error.message.includes('chronicle') || 
      error.message.includes('story') || 
      error.message.includes('wasteland'))) {
    return new ProposalError({
      category: 'chronicle',
      message: 'Chronicle operation failed',
      recoverySteps: [
        'Verify your chronicle content meets requirements',
        'Check if you have permission to submit to this territory',
        'Ensure your character has sufficient reputation'
      ],
      technicalDetails: error.stack
    });
  }

  // Territory-specific errors
  if (error instanceof Error && 
     (error.message.includes('territory') || 
      error.message.includes('region') || 
      error.message.includes('radiation'))) {
    return new ProposalError({
      category: 'territory',
      message: 'Territory operation failed',
      recoverySteps: [
        'Check if the territory is accessible',
        'Verify your radiation protection level',
        'Ensure you have the required influence level'
      ],
      technicalDetails: error.stack
    });
  }

  // Character-specific errors
  if (error instanceof Error && 
     (error.message.includes('character') || 
      error.message.includes('survivor') || 
      error.message.includes('rank'))) {
    return new ProposalError({
      category: 'character',
      message: 'Character operation failed',
      recoverySteps: [
        'Ensure your character meets the requirements',
        'Check your character status and radiation level',
        'Verify your reputation is sufficient'
      ],
      technicalDetails: error.stack
    });
  }

  // Check if it's an error with a code property
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const dynamicError = error as { code: string; message: string; stack?: string };
    const mapping = ERROR_MAPPINGS[dynamicError.code] || ERROR_MAPPINGS.TRANSACTION_ERROR;
    return new ProposalError({
      category: mapping.category,
      message: `${mapping.message}: ${dynamicError.message}`,
      recoverySteps: mapping.recoverySteps,
      technicalDetails: dynamicError.stack
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
