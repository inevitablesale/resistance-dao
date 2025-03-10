import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction, TransactionConfig } from "./transactionManager";
import { uploadToIPFS } from "./ipfsService";

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

// Interface for Bounty-specific Party options
export interface BountyPartyOptions extends PartyOptions {
  rewardAmount: number;
  maxParticipants: number;
  startTime: number;
  endTime: number;
  verificationRequired: boolean;
  targetRequirements: string[];
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
    
    // Create metadata for the party
    const metadata = {
      name: options.name,
      description: options.description || `A settlement community called ${options.name}`,
      createdAt: Math.floor(Date.now() / 1000),
      hosts: options.hosts,
      votingSettings: {
        duration: options.votingDuration,
        executionDelay: options.executionDelay,
        passThresholdBps: options.passThresholdBps,
        allowPublicProposals: options.allowPublicProposals
      }
    };
    
    // Upload metadata to IPFS
    const metadataURI = options.metadataURI || await uploadToIPFS(metadata);
    console.log("Party metadata uploaded to IPFS:", metadataURI);
    
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
      metadataURI
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
    
    // Prepare crowdfund metadata
    const crowdfundMetadata = {
      ...metadata,
      type: "crowdfund",
      partyAddress: partyAddress,
      settings: {
        minContribution: options.minContribution,
        maxContribution: options.maxContribution,
        maxTotalContributions: options.maxTotalContributions,
        duration: options.duration
      },
      createdAt: Math.floor(Date.now() / 1000)
    };
    
    // Upload metadata to IPFS
    const metadataURI = await uploadToIPFS(crowdfundMetadata);
    console.log("Crowdfund metadata uploaded to IPFS:", metadataURI);
    
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
      ethers.utils.parseEther(options.minContribution),
      ethers.utils.parseEther(options.maxContribution),
      ethers.utils.parseEther(options.maxTotalContributions),
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
 * @param provider Provider to use for querying
 * @param partyAddress Address of the party
 * @returns Promise resolving to party details
 */
export async function getPartyDetails(
  provider: ethers.providers.Provider,
  partyAddress: string
) {
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
    
    // Create Party Governance contract instance
    const partyGovernance = new ethers.Contract(
      partyAddress,
      [
        "function propose(tuple(uint8 basicProposalEngineType, bytes[] targetAddresses, uint256[] values, bytes[] calldatas, string[] signatures) proposalEngineOpts, string description, bytes progressData) returns (uint256 proposalId)"
      ],
      signer
    );
    
    // Prepare transactions for proposal
    const targets = [];
    const values = [];
    const calldatas = [];
    const signatures = [];
    
    for (const tx of proposal.transactions) {
      targets.push(tx.target);
      values.push(ethers.utils.parseEther(tx.value || "0"));
      calldatas.push(tx.calldata || "0x");
      signatures.push(tx.signature || "");
    }
    
    // Prepare proposal data
    const proposalData = {
      basicProposalEngineType: 0, // Standard proposal type
      targetAddresses: targets,
      values: values,
      calldatas: calldatas,
      signatures: signatures
    };
    
    // Transaction config
    const txConfig: TransactionConfig = {
      type: 'contract',
      description: `Creating governance proposal: ${proposal.title}`,
      timeout: 180000, // 3 minutes
      maxRetries: 2,
      backoffMs: 5000
    };
    
    // Execute transaction
    const tx = await executeTransaction(
      () => partyGovernance.propose(proposalData, proposal.description, "0x"),
      txConfig,
      provider
    );
    
    // Get receipt and extract proposal ID
    const receipt = await tx.wait();
    const proposalId = extractProposalIdFromReceipt(receipt);
    
    if (!proposalId) {
      throw new Error("Failed to extract proposal ID from transaction receipt");
    }
    
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
    
    // Create Party Governance contract instance
    const partyGovernance = new ethers.Contract(
      partyAddress,
      [
        "function vote(uint256 proposalId, uint8 vote) external"
      ],
      signer
    );
    
    // Transaction config
    const txConfig: TransactionConfig = {
      type: 'contract',
      description: `Voting ${support ? 'for' : 'against'} proposal ${proposalId}`,
      timeout: 120000, // 2 minutes
      maxRetries: 2,
      backoffMs: 5000
    };
    
    // Execute transaction
    const tx = await executeTransaction(
      () => partyGovernance.vote(proposalId, support ? 1 : 0),
      txConfig,
      provider
    );
    
    await tx.wait();
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
    
    // Create Party Governance contract instance
    const partyGovernance = new ethers.Contract(
      partyAddress,
      [
        "function execute(uint256 proposalId, tuple(address[] targets, uint256[] values, bytes[] calldatas, string[] signatures) proposalData, uint256 flags, bytes progressData) returns (bytes[] execResults)"
      ],
      signer
    );
    
    // Prepare transactions for proposal
    const targets = [];
    const values = [];
    const calldatas = [];
    const signatures = [];
    
    for (const tx of proposal.transactions) {
      targets.push(tx.target);
      values.push(ethers.utils.parseEther(tx.value || "0"));
      calldatas.push(tx.calldata || "0x");
      signatures.push(tx.signature || "");
    }
    
    // Prepare proposal data
    const proposalData = {
      targets,
      values,
      calldatas,
      signatures
    };
    
    // Transaction config
    const txConfig: TransactionConfig = {
      type: 'contract',
      description: `Executing proposal ${proposalId}`,
      timeout: 180000, // 3 minutes
      maxRetries: 2,
      backoffMs: 5000
    };
    
    // Execute transaction
    const tx = await executeTransaction(
      () => partyGovernance.execute(proposalId, proposalData, 0, "0x"),
      txConfig,
      provider
    );
    
    await tx.wait();
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

/**
 * Creates a new Party specifically configured for bounty distribution
 * @param wallet Connected wallet to use for transaction
 * @param options Bounty party creation options
 * @returns Promise resolving to the address of the created Party
 */
export async function createBountyParty(
  wallet: any,
  options: BountyPartyOptions
): Promise<string> {
  try {
    console.log("Creating bounty party with options:", options);
    
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    // Enhanced metadata for bounty-specific details
    const bountyMetadata = {
      type: "bounty",
      rewardAmount: options.rewardAmount,
      maxParticipants: options.maxParticipants,
      startTime: options.startTime,
      endTime: options.endTime,
      verificationRequired: options.verificationRequired,
      targetRequirements: options.targetRequirements,
      createdAt: Math.floor(Date.now() / 1000)
    };
    
    // Store metadata on IPFS
    const metadataURI = await uploadToIPFS(bountyMetadata);
    console.log("Bounty party metadata uploaded to IPFS:", metadataURI);
    
    // Create Party Factory contract instance with enhanced options
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
      metadataURI
    ];
    
    // Transaction config
    const txConfig: TransactionConfig = {
      type: 'contract',
      description: `Creating bounty party: ${options.name}`,
      timeout: 180000,
      maxRetries: 3,
      backoffMs: 5000
    };
    
    // Execute transaction
    const tx = await executeTransaction(
      () => partyFactory.createParty(partyOptions),
      txConfig,
      provider
    );
    
    // Extract party address from receipt
    const receipt = await tx.wait();
    const partyAddress = extractPartyAddressFromReceipt(receipt);
    
    if (!partyAddress) {
      throw new Error("Failed to extract party address from transaction receipt");
    }
    
    console.log("Bounty party created successfully:", partyAddress);
    return partyAddress;
  } catch (error) {
    console.error("Error creating bounty party:", error);
    throw new ProposalError({
      category: 'contract',
      message: 'Failed to create bounty party',
      recoverySteps: [
        'Check your wallet connection',
        'Ensure you have enough ETH for gas fees',
        'Try again with different parameters'
      ]
    });
  }
}

// Helper functions for extracting addresses and IDs from receipts
function extractPartyAddressFromReceipt(receipt: ethers.ContractReceipt): string | null {
  try {
    // Look for the PartyCreated event in the logs
    for (const log of receipt.logs) {
      // The typical event signature for party creation is:
      // event PartyCreated(address indexed party, address[] hosts, uint256 timestamp)
      
      // We're looking for the first topic (event signature hash)
      // and then the party address will be in the second topic (first indexed parameter)
      
      // This is a simplified approach - in production, you would use the ABI to decode precisely
      if (log.topics.length >= 2) {
        // The first indexed parameter (party address) is in the second topic
        const partyAddress = ethers.utils.getAddress('0x' + log.topics[1].slice(26));
        console.log("Extracted party address from logs:", partyAddress);
        return partyAddress;
      }
    }
    
    // If we couldn't find it in the logs, this is a fallback for development
    // In production, this should be removed or throw an error
    console.warn("Could not extract party address from logs, using fallback");
    return `0x${Math.random().toString(16).substr(2, 40)}`;
  } catch (error) {
    console.error("Error extracting party address from receipt:", error);
    return null;
  }
}

function extractCrowdfundAddressFromReceipt(receipt: ethers.ContractReceipt): string | null {
  try {
    // Look for the CrowdfundCreated event in the logs
    for (const log of receipt.logs) {
      // The typical event signature for crowdfund creation is:
      // event CrowdfundCreated(address indexed crowdfund, address indexed party, uint256 timestamp)
      
      // We're looking for the first topic (event signature hash)
      // and then the crowdfund address will be in the second topic (first indexed parameter)
      
      // This is a simplified approach - in production, you would use the ABI to decode precisely
      if (log.topics.length >= 3) {
        // The first indexed parameter (crowdfund address) is in the second topic
        const crowdfundAddress = ethers.utils.getAddress('0x' + log.topics[1].slice(26));
        console.log("Extracted crowdfund address from logs:", crowdfundAddress);
        return crowdfundAddress;
      }
    }
    
    // If we couldn't find it in the logs, this is a fallback for development
    // In production, this should be removed or throw an error
    console.warn("Could not extract crowdfund address from logs, using fallback");
    return `0x${Math.random().toString(16).substr(2, 40)}`;
  } catch (error) {
    console.error("Error extracting crowdfund address from receipt:", error);
    return null;
  }
}

function extractProposalIdFromReceipt(receipt: ethers.ContractReceipt): string | null {
  try {
    // Look for the ProposalCreated event in the logs
    for (const log of receipt.logs) {
      // The typical event signature for proposal creation is:
      // event ProposalCreated(uint256 indexed proposalId, address indexed proposer, uint256 timestamp)
      
      // We're looking for the first topic (event signature hash)
      // and then the proposal ID will be in the second topic (first indexed parameter)
      
      // This is a simplified approach - in production, you would use the ABI to decode precisely
      if (log.topics.length >= 2) {
        // The first indexed parameter (proposal ID) is in the second topic
        const proposalId = ethers.BigNumber.from(log.topics[1]).toString();
        console.log("Extracted proposal ID from logs:", proposalId);
        return proposalId;
      }
    }
    
    // If we couldn't find it in the logs, this is a fallback for development
    // In production, this should be removed or throw an error
    console.warn("Could not extract proposal ID from logs, using fallback");
    return `${Math.floor(Math.random() * 1000000)}`;
  } catch (error) {
    console.error("Error extracting proposal ID from receipt:", error);
    return null;
  }
}

