
import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { ChronicleStatus, TerritoryStatus, WastelandRank } from "../types/proposals";

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

export interface ChronicleEvent {
  tokenId: string;
  entryId: string;
  author: string;
  territory: string;
  status: ChronicleStatus;
  timestamp: number;
  blockNumber: number;
  transactionHash: string;
}

export interface TerritoryEvent {
  territoryId: string;
  name: string;
  status: TerritoryStatus;
  controlLevel: number;
  radiationLevel: number;
  activeStories: number;
  blockNumber: number;
  transactionHash: string;
}

export interface CharacterEvent {
  tokenId: string;
  owner: string;
  rank: WastelandRank;
  reputation: number;
  influence: number;
  radiationLevel: number;
  blockNumber: number;
  transactionHash: string;
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

export const subscribeToChronicleEvents = (
  config: EventConfig,
  onEvent: (event: ChronicleEvent) => void,
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
      const parsedEvent: ChronicleEvent = {
        tokenId: event.args[0].toString(),
        entryId: event.args[1].toString(),
        author: event.args[2],
        territory: event.args[3],
        status: event.args[4],
        timestamp: event.args[5].toNumber(),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
      };
      
      console.log('Chronicle event received:', parsedEvent);
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
      category: 'chronicle',
      message: 'Failed to subscribe to chronicle events',
      technicalDetails: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Chronicle event subscription error:', proposalError);
    onError?.(proposalError);

    return {
      unsubscribe: () => {
        // No-op for failed subscriptions
      }
    };
  }
};

export const subscribeToTerritoryEvents = (
  config: EventConfig,
  onEvent: (event: TerritoryEvent) => void,
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
      const parsedEvent: TerritoryEvent = {
        territoryId: event.args[0].toString(),
        name: event.args[1],
        status: event.args[2],
        controlLevel: event.args[3].toNumber(),
        radiationLevel: event.args[4].toNumber(),
        activeStories: event.args[5].toNumber(),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
      };
      
      console.log('Territory event received:', parsedEvent);
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
      category: 'territory',
      message: 'Failed to subscribe to territory events',
      technicalDetails: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Territory event subscription error:', proposalError);
    onError?.(proposalError);

    return {
      unsubscribe: () => {
        // No-op for failed subscriptions
      }
    };
  }
};

export const subscribeToCharacterEvents = (
  config: EventConfig,
  onEvent: (event: CharacterEvent) => void,
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
      const parsedEvent: CharacterEvent = {
        tokenId: event.args[0].toString(),
        owner: event.args[1],
        rank: event.args[2],
        reputation: event.args[3].toNumber(),
        influence: event.args[4].toNumber(),
        radiationLevel: event.args[5].toNumber(),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
      };
      
      console.log('Character event received:', parsedEvent);
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
      category: 'character',
      message: 'Failed to subscribe to character events',
      technicalDetails: error instanceof Error ? error.message : 'Unknown error'
    });

    console.error('Character event subscription error:', proposalError);
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

export const waitForChronicleCreation = async (
  config: EventConfig,
  transactionHash: string,
  timeout: number = 300000 // 5 minutes default
): Promise<ChronicleEvent> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      subscription.unsubscribe();
      reject(new ProposalError({
        category: 'chronicle',
        message: 'Timeout waiting for chronicle creation event',
        recoverySteps: [
          'Check transaction status in block explorer',
          'Verify if the chronicle was created',
          'Contact support if needed'
        ]
      }));
    }, timeout);

    const subscription = subscribeToChronicleEvents(
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

// Cleanup function to remove all active listeners
export const cleanupEventListeners = () => {
  activeListeners.forEach(subscription => subscription.unsubscribe());
  activeListeners.clear();
};

// Setup cleanup on window unload
if (typeof window !== 'undefined') {
  window.addEventListener('unload', cleanupEventListeners);
}
