
import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";

export interface EventConfig {
  provider: ethers.providers.Web3Provider;
  contractAddress: string;
  abi: string[];
  eventName: string;
}

export interface EventSubscription {
  unsubscribe: () => void;
}

export interface ProposalEvent {
  tokenId: string;
  proposalContract: string;
  creator: string;
  isTest: boolean;
  blockNumber: number;
  transactionHash: string;
}

interface CharacterMetadata {
  name: string;
  description: string;
  image: string;
  animation_url?: string;
  character_model_cid?: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
    max_value?: number;
  }>;
  bounty_data?: any;
  party_data?: any;
}

const activeListeners = new Map<string, EventSubscription>();

export const subscribeToProposalEvents = (
  config: EventConfig,
  onEvent: (event: ProposalEvent) => void,
  onError?: (error: ProposalError) => void
): EventSubscription => {
  try {
    const contract = new ethers.Contract(
      config.contractAddress,
      config.abi,
      config.provider
    );

    const listener = (...args: any[]) => {
      const event = args[args.length - 1];
      const parsedEvent: ProposalEvent = {
        tokenId: event.args[0].toString(),
        proposalContract: event.args[1],
        creator: event.args[2],
        isTest: event.args[3],
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
      };
      
      console.log('Proposal event received:', parsedEvent);
      onEvent(parsedEvent);
    };

    contract.on(config.eventName, listener);
    
    const subscriptionId = `${config.contractAddress}-${config.eventName}-${Date.now()}`;
    const subscription: EventSubscription = {
      unsubscribe: () => {
        contract.off(config.eventName, listener);
        activeListeners.delete(subscriptionId);
      }
    };

    activeListeners.set(subscriptionId, subscription);
    return subscription;

  } catch (error) {
    const proposalError = new ProposalError({
      category: 'contract',
      message: 'Failed to subscribe to contract events',
      technicalDetails: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Event subscription error:', proposalError);
    onError?.(proposalError);

    return {
      unsubscribe: () => {
        // No-op for failed subscriptions
      }
    };
  }
};

export const waitForProposalCreation = async (
  config: EventConfig,
  transactionHash: string,
  timeout: number = 300000 // 5 minutes default
): Promise<ProposalEvent> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      subscription.unsubscribe();
      reject(new ProposalError({
        category: 'transaction',
        message: 'Timeout waiting for proposal creation event',
        recoverySteps: [
          'Check transaction status in block explorer',
          'Verify if the proposal was created',
          'Contact support if needed'
        ]
      }));
    }, timeout);

    const subscription = subscribeToProposalEvents(
      config,
      (event) => {
        if (event.transactionHash === transactionHash) {
          clearTimeout(timeoutId);
          subscription.unsubscribe();
          resolve(event);
        }
      },
      (error) => {
        clearTimeout(timeoutId);
        subscription.unsubscribe();
        reject(error);
      }
    );
  });
};

// Character metadata fetch utility
export const fetchCharacterMetadata = async (
  metadataUri: string
): Promise<CharacterMetadata | null> => {
  try {
    const response = await fetch(metadataUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }
    return await response.json() as CharacterMetadata;
  } catch (error) {
    console.error('Failed to fetch character metadata:', error);
    return null;
  }
};

// Cleanup function to remove all active listeners
export const cleanupEventListeners = () => {
  activeListeners.forEach(subscription => subscription.unsubscribe());
  activeListeners.clear();
};

// Setup cleanup on window unload
if (typeof window !== 'undefined') {
  window.addEventListener('unload', cleanupEventListeners);
}
