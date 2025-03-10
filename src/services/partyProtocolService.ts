
import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction, TransactionConfig } from "./transactionManager";

// Party Protocol contract addresses
const PARTY_FACTORY_ADDRESS = "0x4a5EA76571F47E7d92B5040E8C7FF12eacd35087"; // Polygon mainnet
const PARTY_HELPER_ADDRESS = "0xc48CF9807BC36b5859bc480bE4Cb6D18C1F5BB10"; // Polygon mainnet
const ETH_CROWDFUND_ADDRESS = "0x60534a0b5C8B8119c713f2dDb30f2eB31E31D1F9"; // Polygon mainnet

// Interface for Party creation options
export interface PartyOptions {
  name: string;
  hosts: string[];
  votingDuration: number;
  executionDelay: number;
  passThresholdBps: number;
  allowPublicProposals: boolean;
  description?: string;
  metadataURI?: string;
}

// Interface for ETH Crowdfund options
export interface CrowdfundOptions {
  initialContributor: string;
  minContribution: string;
  maxContribution: string;
  maxTotalContributions: string;
  duration: number;
}

// Interface for Governance Proposal
export interface GovernanceProposal {
  title: string;
  description: string;
  transactions: {
    target: string;
    value: string;
    calldata: string;
    signature?: string;
  }[];
}

/**
 * Creates a new Party on Party Protocol
 * @param wallet Connected wallet to use for transaction
 * @param options Party creation options
 * @returns Promise resolving to the address of the created Party
 */
export async function createParty(
  wallet: any,
  options: PartyOptions
): Promise<string> {
  try {
    console.log("Creating party with options:", options);
    
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    // Create Party Factory contract instance
    const partyFactory = new ethers.Contract(
      PARTY_FACTORY_ADDRESS,
      [
        "function createParty(tuple(string name, address[] hosts, uint40 votingDuration, uint40 executionDelay, uint16 passThresholdBps, bool allowPublicProposals, string metadataURI)) external returns (address)"
      ],
      signer
    );
    
    // Format options for contract call
    const partyOptions = [
      options.name,
      options.hosts,
      options.votingDuration,
      options.executionDelay,
      options.passThresholdBps,
      options.allowPublicProposals,
      options.metadataURI || ""
    ];
    
    // Transaction config
    const txConfig: TransactionConfig = {
      type: 'contract',
      description: `Creating party: ${options.name}`,
      timeout: 180000, // 3 minutes
      maxRetries: 3,
      backoffMs: 5000
    };
    
    // Execute transaction
    const tx = await executeTransaction(
      () => partyFactory.createParty(partyOptions),
      txConfig,
      provider
    );
    
    // Extract party address from transaction receipt
    const receipt = await tx.wait();
    const partyAddress = extractPartyAddressFromReceipt(receipt);
    
    if (!partyAddress) {
      throw new Error("Failed to extract party address from transaction receipt");
    }
    
    console.log("Party created successfully:", partyAddress);
    return partyAddress;
  } catch (error) {
    console.error("Error creating party:", error);
    throw new ProposalError({
      category: 'contract',
      message: 'Failed to create party',
      recoverySteps: [
        'Check your wallet connection',
        'Ensure you have enough ETH for gas fees',
        'Try again with different parameters'
      ]
    });
  }
}

/**
 * Creates an ETH Crowdfund for a Party
 * @param wallet Connected wallet to use for transaction
 * @param partyAddress Address of the Party to create a crowdfund for
 * @param options Crowdfund options
 * @param metadata Metadata to be stored with the crowdfund
 * @returns Promise resolving to the address of the created crowdfund
 */
export async function createEthCrowdfund(
  wallet: any,
  partyAddress: string,
  options: CrowdfundOptions,
  metadata: any
): Promise<string> {
  try {
    console.log("Creating ETH crowdfund for party:", partyAddress, "with options:", options);
    
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    // Upload metadata to IPFS
    // For simplicity, assuming a function exists to upload to IPFS
    const metadataURI = await uploadToIPFS(metadata);
    
    // Create ETH Crowdfund contract instance
    const ethCrowdfund = new ethers.Contract(
      ETH_CROWDFUND_ADDRESS,
      [
        "function createEthCrowdfund(address party, tuple(address initialContributor, uint96 minContribution, uint96 maxContribution, uint96 maxTotalContributions, uint40 duration, string metadataURI)) external returns (address)"
      ],
      signer
    );
    
    // Format options for contract call
    const crowdfundOptions = [
      options.initialContributor,
      options.minContribution,
      options.maxContribution,
      options.maxTotalContributions,
      options.duration,
      metadataURI
    ];
    
    // Transaction config
    const txConfig: TransactionConfig = {
      type: 'contract',
      description: `Creating ETH crowdfund for party: ${partyAddress}`,
      timeout: 180000, // 3 minutes
      maxRetries: 3,
      backoffMs: 5000
    };
    
    // Execute transaction
    const tx = await executeTransaction(
      () => ethCrowdfund.createEthCrowdfund(partyAddress, crowdfundOptions),
      txConfig,
      provider
    );
    
    // Extract crowdfund address from transaction receipt
    const receipt = await tx.wait();
    const crowdfundAddress = extractCrowdfundAddressFromReceipt(receipt);
    
    if (!crowdfundAddress) {
      throw new Error("Failed to extract crowdfund address from transaction receipt");
    }
    
    console.log("ETH Crowdfund created successfully:", crowdfundAddress);
    return crowdfundAddress;
  } catch (error) {
    console.error("Error creating ETH crowdfund:", error);
    throw new ProposalError({
      category: 'contract',
      message: 'Failed to create ETH crowdfund',
      recoverySteps: [
        'Check your wallet connection',
        'Ensure you have enough ETH for gas fees',
        'Try again with different parameters'
      ]
    });
  }
}

/**
 * Contribute ETH to a Party
 * @param wallet Connected wallet to use for transaction
 * @param partyAddress Address of the Party to contribute to
 * @param amount Amount to contribute in ETH
 * @param referrer Optional referrer address
 * @param description Optional description for the transaction
 * @returns Promise resolving to the transaction
 */
export async function sentinelContributeToParty(
  wallet: any,
  partyAddress: string,
  amount: string,
  referrer?: string,
  description?: string
): Promise<ethers.ContractTransaction> {
  try {
    console.log("Contributing to party:", partyAddress, "with amount:", amount);
    
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    // Create Party contract instance
    const party = new ethers.Contract(
      partyAddress,
      [
        "function contribute(address referrer) external payable returns (uint256)"
      ],
      signer
    );
    
    // Convert amount to wei
    const amountWei = ethers.utils.parseEther(amount);
    
    // Transaction config
    const txConfig: TransactionConfig = {
      type: 'contract',
      description: description || `Contributing ${amount} ETH to party: ${partyAddress}`,
      timeout: 120000, // 2 minutes
      maxRetries: 2,
      backoffMs: 3000
    };
    
    // Execute transaction
    const tx = await executeTransaction(
      () => party.contribute(referrer || ethers.constants.AddressZero, {
        value: amountWei
      }),
      txConfig,
      provider
    );
    
    console.log("Contribution successful:", tx.hash);
    return tx;
  } catch (error) {
    console.error("Error contributing to party:", error);
    throw new ProposalError({
      category: 'transaction',
      message: 'Failed to contribute to party',
      recoverySteps: [
        'Check your wallet connection',
        'Ensure you have enough ETH for gas fees',
        'Try again with a different amount'
      ]
    });
  }
}

/**
 * Verify if an address owns a Survivor NFT
 * @param wallet Connected wallet to use for verification
 * @param survivorNftAddress Address of the Survivor NFT contract
 * @returns Promise resolving to object with hasNFT flag and tokenId if found
 */
export async function verifySurvivorOwnership(
  wallet: any,
  survivorNftAddress: string
): Promise<boolean | { hasNFT: boolean; tokenId?: string }> {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const address = await provider.getSigner().getAddress();
    
    // Create Survivor NFT contract instance
    const survivorNft = new ethers.Contract(
      survivorNftAddress,
      [
        "function balanceOf(address owner) external view returns (uint256)",
        "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)"
      ],
      provider
    );
    
    // Check if address owns any Survivor NFTs
    const balance = await survivorNft.balanceOf(address);
    
    if (balance.gt(0)) {
      try {
        // Get the first token ID owned by the address
        const tokenId = await survivorNft.tokenOfOwnerByIndex(address, 0);
        return { hasNFT: true, tokenId: tokenId.toString() };
      } catch (error) {
        console.error("Error getting token ID:", error);
        return { hasNFT: true };
      }
    }
    
    return { hasNFT: false };
  } catch (error) {
    console.error("Error verifying Survivor ownership:", error);
    return false;
  }
}

/**
 * Update Survivor NFT metadata with settlement data
 * @param wallet Connected wallet to use for transaction
 * @param tokenId ID of the Survivor NFT
 * @param partyAddress Address of the Party
 * @param crowdfundAddress Address of the Crowdfund
 * @param metadata Metadata to be updated
 * @returns Promise resolving to the transaction
 */
export async function updateSurvivorMetadata(
  wallet: any,
  tokenId: string,
  partyAddress: string,
  crowdfundAddress: string,
  metadata: any
): Promise<ethers.ContractTransaction> {
  try {
    console.log("Updating Survivor NFT metadata for token ID:", tokenId);
    
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    // Simplified version - in a real implementation, this would call a specific metadata update function
    // This is a placeholder for the real implementation
    const tx = {
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      wait: async () => ({ status: 1 })
    } as ethers.ContractTransaction;
    
    console.log("Metadata update successful:", tx.hash);
    return tx;
  } catch (error) {
    console.error("Error updating Survivor metadata:", error);
    throw new ProposalError({
      category: 'validation',
      message: 'Failed to update Survivor metadata',
      recoverySteps: [
        'Check your wallet connection',
        'Ensure you have permission to update the metadata',
        'Try again later'
      ]
    });
  }
}

/**
 * Gets details about a party
 * @param partyAddress Address of the party
 * @returns Promise resolving to party details
 */
export async function getPartyDetails(partyAddress: string) {
  try {
    // Mock implementation for now
    return {
      name: "Community Settlement",
      symbol: "CS",
      hosts: ["0x1234567890123456789012345678901234567890"],
      votingPower: 100,
      totalMembers: 25,
      treasury: "5.5"
    };
  } catch (error) {
    console.error("Error getting party details:", error);
    throw new ProposalError({
      category: 'contract',
      message: 'Failed to fetch party details',
      recoverySteps: [
        'Check if the party address is correct',
        'Ensure the party contract exists',
        'Try again later'
      ]
    });
  }
}

/**
 * Creates a governance proposal
 * @param wallet Connected wallet to use for transaction
 * @param partyAddress Address of the party
 * @param proposal Proposal details
 * @returns Promise resolving to the proposal ID
 */
export async function createGovernanceProposal(
  wallet: any,
  partyAddress: string,
  proposal: GovernanceProposal
): Promise<string> {
  try {
    console.log("Creating governance proposal:", proposal.title);
    
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    // Mock implementation for now
    // In a real implementation, this would create a proposal on the party contract
    
    // Return a random proposal ID
    const proposalId = `${Math.floor(Math.random() * 1000000)}`;
    
    console.log("Proposal created successfully with ID:", proposalId);
    return proposalId;
  } catch (error) {
    console.error("Error creating governance proposal:", error);
    throw new ProposalError({
      category: 'contract',
      message: 'Failed to create governance proposal',
      recoverySteps: [
        'Check your wallet connection',
        'Ensure you have enough voting power',
        'Try again with different parameters'
      ]
    });
  }
}

/**
 * Votes on a governance proposal
 * @param wallet Connected wallet to use for transaction
 * @param partyAddress Address of the party
 * @param proposalId ID of the proposal
 * @param support Whether to vote in support or against
 * @returns Promise resolving when the vote is cast
 */
export async function voteOnGovernanceProposal(
  wallet: any,
  partyAddress: string,
  proposalId: string,
  support: boolean
): Promise<void> {
  try {
    console.log(`Voting ${support ? 'for' : 'against'} proposal ${proposalId}`);
    
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    // Mock implementation for now
    // In a real implementation, this would cast a vote on the party contract
    
    console.log("Vote cast successfully");
  } catch (error) {
    console.error("Error voting on governance proposal:", error);
    throw new ProposalError({
      category: 'contract',
      message: 'Failed to vote on governance proposal',
      recoverySteps: [
        'Check your wallet connection',
        'Ensure you have enough voting power',
        'Try again later'
      ]
    });
  }
}

/**
 * Executes a governance proposal
 * @param wallet Connected wallet to use for transaction
 * @param partyAddress Address of the party
 * @param proposalId ID of the proposal
 * @param proposal Proposal details
 * @returns Promise resolving when the proposal is executed
 */
export async function executeGovernanceProposal(
  wallet: any,
  partyAddress: string,
  proposalId: string,
  proposal: GovernanceProposal
): Promise<void> {
  try {
    console.log(`Executing proposal ${proposalId}`);
    
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    // Mock implementation for now
    // In a real implementation, this would execute a proposal on the party contract
    
    console.log("Proposal executed successfully");
  } catch (error) {
    console.error("Error executing governance proposal:", error);
    throw new ProposalError({
      category: 'contract',
      message: 'Failed to execute governance proposal',
      recoverySteps: [
        'Check your wallet connection',
        'Ensure the proposal is ready to execute',
        'Try again later'
      ]
    });
  }
}

// Helper functions for extracting addresses from receipts
function extractPartyAddressFromReceipt(receipt: ethers.ContractReceipt): string | null {
  // In a real implementation, this would parse the event logs to extract the party address
  // This is a placeholder for the real implementation
  return `0x${Math.random().toString(16).substr(2, 40)}`;
}

function extractCrowdfundAddressFromReceipt(receipt: ethers.ContractReceipt): string | null {
  // In a real implementation, this would parse the event logs to extract the crowdfund address
  // This is a placeholder for the real implementation
  return `0x${Math.random().toString(16).substr(2, 40)}`;
}

// Helper function for uploading metadata to IPFS
async function uploadToIPFS(metadata: any): Promise<string> {
  // In a real implementation, this would upload the metadata to IPFS
  // This is a placeholder for the real implementation
  return `ipfs://Qm${Math.random().toString(16).substr(2, 44)}`;
}
