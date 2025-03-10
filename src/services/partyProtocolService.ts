
import { ethers } from "ethers";
import { PARTY_PROTOCOL, PARTY_FACTORY_ABI, ETH_CROWDFUND_ABI, PARTY_GOVERNANCE_ABI, SURVIVOR_NFT_ADDRESS, SURVIVOR_NFT_ABI } from "@/lib/constants";
import { uploadToIPFS } from "./ipfsService";
import { useToast } from "@/hooks/use-toast";
import { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { ProposalMetadata } from "@/types/proposals";

export interface PartyOptions {
  name: string;
  hosts: string[];
  votingDuration: number;
  executionDelay: number;
  passThresholdBps: number;
  proposers?: string[];
  allowPublicProposals: boolean;
  description: string;
  metadataURI: string;
}

export interface CrowdfundOptions {
  initialContributor: string;
  minContribution: string;
  maxContribution: string;
  maxTotalContributions: string;
  duration: number;
}

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

// Function to verify if a user owns a Survivor NFT
export const verifySurvivorOwnership = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  survivorAddress: string
): Promise<{ hasNFT: boolean, tokenId?: string }> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    // Check if the address owns a Survivor NFT
    const survivorContract = new ethers.Contract(
      survivorAddress,
      SURVIVOR_NFT_ABI,
      provider
    );
    
    const balance = await survivorContract.balanceOf(signerAddress);
    
    if (balance.gt(0)) {
      // Get the first token ID owned by the user
      const tokenId = await survivorContract.tokenOfOwnerByIndex(signerAddress, 0);
      return { hasNFT: true, tokenId: tokenId.toString() };
    }
    
    return { hasNFT: false };
    
  } catch (error) {
    console.error("Error verifying Survivor ownership:", error);
    return { hasNFT: false };
  }
};

// Create a Party through the Party Factory
export const createParty = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  partyOptions: PartyOptions
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    console.log("Creating party with options:", partyOptions);
    
    const partyFactory = new ethers.Contract(
      PARTY_PROTOCOL.FACTORY_ADDRESS,
      PARTY_FACTORY_ABI,
      signer
    );
    
    // Set up proposal engine options
    const proposalEngineOpts = {
      basicProposalEngineType: 0, // Standard proposal type
      targetAddresses: [],
      values: [],
      calldatas: [],
      signatures: []
    };
    
    const proposalConfig = {
      proposalEngineOpts,
      enableAddAuthorityProposal: true,
      allowPublicProposals: partyOptions.allowPublicProposals,
      allowUriChanges: true,
      allowCustomProposals: true
    };
    
    // Create the party transaction
    const tx = await partyFactory.createParty({
      authority: ethers.constants.AddressZero, // No external authority
      name: partyOptions.name,
      hosts: partyOptions.hosts,
      votingDuration: partyOptions.votingDuration,
      executionDelay: partyOptions.executionDelay,
      passThresholdBps: partyOptions.passThresholdBps,
      proposers: partyOptions.proposers || [],
      proposalConfig
    });
    
    console.log("Party creation transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Party creation receipt:", receipt);
    
    // Extract party address from event logs
    const event = receipt.events?.find(e => e.event === "PartyCreated");
    if (!event || !event.args) {
      throw new Error("Party creation event not found in receipt");
    }
    
    const partyAddress = event.args.party;
    console.log("Party created at address:", partyAddress);
    
    return partyAddress;
    
  } catch (error) {
    console.error("Error creating party:", error);
    throw error;
  }
};

// Create an ETH Crowdfund for a party
export const createEthCrowdfund = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  partyAddress: string,
  crowdfundOptions: CrowdfundOptions,
  metadata: ProposalMetadata
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    console.log("Creating ETH crowdfund with options:", crowdfundOptions);
    
    // Upload metadata to IPFS
    const ipfsHash = await uploadToIPFS(metadata);
    console.log("Metadata uploaded to IPFS:", ipfsHash);
    
    const ethCrowdfundFactory = new ethers.Contract(
      PARTY_PROTOCOL.ETH_CROWDFUND_ADDRESS,
      ETH_CROWDFUND_ABI,
      signer
    );
    
    // Create the ETH crowdfund
    const tx = await ethCrowdfundFactory.createEthCrowdfund(
      PARTY_PROTOCOL.PARTY_IMPLEMENTATION, // Renderer base
      metadata.title || "Resistance Settlement", // Name
      "RDPARTY", // Symbol
      ethers.utils.parseEther("0.01"), // Min contribution (0.01 ETH)
      ethers.constants.AddressZero, // No gatekeeper
      "0x", // No gatekeeper ID
      signerAddress, // Initial contributor
      signerAddress, // Initial delegate
      ethers.utils.parseEther(crowdfundOptions.minContribution), // Min contribution
      ethers.utils.parseEther(crowdfundOptions.maxContribution), // Max contribution
      ethers.utils.parseEther(crowdfundOptions.maxTotalContributions), // Max total contributions
      crowdfundOptions.duration, // Duration
      0, // No funding split
      [], // No funding split recipients
      [], // No token gate options
      false, // Allow contributing for existing card
      ethers.constants.AddressZero, // No custom renderer
      `ipfs://${ipfsHash}` // Content hash for metadata
    );
    
    console.log("ETH crowdfund creation transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("ETH crowdfund creation receipt:", receipt);
    
    // Extract crowdfund address from event logs
    const event = receipt.events?.find(e => e.event === "CrowdfundCreated");
    if (!event || !event.args) {
      throw new Error("Crowdfund creation event not found in receipt");
    }
    
    const crowdfundAddress = event.args.crowdfund;
    console.log("Crowdfund created at address:", crowdfundAddress);
    
    return crowdfundAddress;
    
  } catch (error) {
    console.error("Error creating ETH crowdfund:", error);
    throw error;
  }
};

// Update Survivor NFT metadata with party data
export const updateSurvivorMetadata = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  survivorTokenId: string,
  partyAddress: string,
  crowdfundAddress: string,
  metadata: ProposalMetadata
): Promise<boolean> => {
  try {
    // Upload updated metadata to IPFS
    const survivorMetadata = {
      ...metadata,
      settlement: {
        partyAddress,
        crowdfundAddress,
        createdAt: Math.floor(Date.now() / 1000)
      }
    };
    
    const ipfsHash = await uploadToIPFS(survivorMetadata);
    console.log("Updated Survivor metadata uploaded to IPFS:", ipfsHash);
    
    // In a real implementation, this would call a backend API that updates the IPFS metadata
    // and then updates the token URI on the NFT contract
    
    return true;
    
  } catch (error) {
    console.error("Error updating Survivor metadata:", error);
    throw error;
  }
};

// Sentinel contribution to a party
export const sentinelContributeToParty = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  crowdfundAddress: string,
  amount: string,
  delegateAddress?: string,
  memo?: string
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    // If no delegate specified, use self
    const delegate = delegateAddress || signerAddress;
    
    const crowdfundContract = new ethers.Contract(
      crowdfundAddress,
      ETH_CROWDFUND_ABI,
      signer
    );
    
    // Convert amount to wei
    const amountWei = ethers.utils.parseEther(amount);
    
    // Contribute to the crowdfund
    const tx = await crowdfundContract.contribute(
      delegate,
      memo || "",
      "0x", // No gatekeeper data
      { value: amountWei }
    );
    
    console.log("Contribution transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Contribution receipt:", receipt);
    
    return tx.hash;
    
  } catch (error) {
    console.error("Error contributing to party:", error);
    throw error;
  }
};

// Create a governance proposal
export const createGovernanceProposal = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  partyAddress: string,
  proposal: GovernanceProposal
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    console.log("Creating governance proposal:", proposal);
    
    const governanceContract = new ethers.Contract(
      partyAddress,
      PARTY_GOVERNANCE_ABI,
      signer
    );
    
    // Format the proposal data
    const proposalData = {
      basicProposalEngineType: 0, // Standard proposal type
      targetAddresses: proposal.transactions.map(tx => tx.target),
      values: proposal.transactions.map(tx => ethers.utils.parseEther(tx.value || "0")),
      calldatas: proposal.transactions.map(tx => tx.calldata),
      signatures: proposal.transactions.map(tx => tx.signature || "")
    };
    
    // Submit the proposal
    const tx = await governanceContract.propose(
      proposalData,
      `${proposal.title}\n\n${proposal.description}`,
      "0x" // No progress data
    );
    
    console.log("Proposal transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Proposal receipt:", receipt);
    
    // Extract proposal ID from event logs
    const event = receipt.events?.find(e => e.event === "ProposalCreated");
    if (!event || !event.args) {
      throw new Error("Proposal creation event not found in receipt");
    }
    
    const proposalId = event.args.proposalId;
    console.log("Proposal created with ID:", proposalId);
    
    return proposalId.toString();
    
  } catch (error) {
    console.error("Error creating governance proposal:", error);
    throw error;
  }
};

// Vote on a governance proposal
export const voteOnGovernanceProposal = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  partyAddress: string,
  proposalId: string,
  support: boolean
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    console.log("Voting on proposal:", proposalId, "Support:", support);
    
    const governanceContract = new ethers.Contract(
      partyAddress,
      PARTY_GOVERNANCE_ABI,
      signer
    );
    
    // Vote on the proposal
    const tx = await governanceContract.vote(
      proposalId,
      support,
      "0x" // No progress data
    );
    
    console.log("Vote transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Vote receipt:", receipt);
    
    return tx.hash;
    
  } catch (error) {
    console.error("Error voting on proposal:", error);
    throw error;
  }
};

// Execute a governance proposal
export const executeGovernanceProposal = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  partyAddress: string,
  proposalId: string,
  proposal: GovernanceProposal
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    console.log("Executing proposal:", proposalId);
    
    const governanceContract = new ethers.Contract(
      partyAddress,
      PARTY_GOVERNANCE_ABI,
      signer
    );
    
    // Format the proposal data for execution
    const executionData = {
      targets: proposal.transactions.map(tx => tx.target),
      values: proposal.transactions.map(tx => ethers.utils.parseEther(tx.value || "0")),
      calldatas: proposal.transactions.map(tx => tx.calldata),
      signatures: proposal.transactions.map(tx => tx.signature || "")
    };
    
    // Execute the proposal
    const tx = await governanceContract.execute(
      proposalId,
      executionData,
      0, // No flags
      "0x" // No progress data
    );
    
    console.log("Execution transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Execution receipt:", receipt);
    
    return tx.hash;
    
  } catch (error) {
    console.error("Error executing proposal:", error);
    throw error;
  }
};

// Get party details
export const getPartyDetails = async (
  provider: ethers.providers.Web3Provider,
  partyAddress: string
): Promise<any> => {
  try {
    const governanceContract = new ethers.Contract(
      partyAddress,
      PARTY_GOVERNANCE_ABI,
      provider
    );
    
    // Get basic party info
    const [name, symbol, tokenSupply, proposalCount] = await Promise.all([
      governanceContract.name(),
      governanceContract.symbol(),
      governanceContract.totalSupply(),
      governanceContract.proposalCount()
    ]);
    
    return {
      name,
      symbol,
      tokenSupply: tokenSupply.toString(),
      proposalCount: proposalCount.toString(),
      address: partyAddress
    };
    
  } catch (error) {
    console.error("Error getting party details:", error);
    throw error;
  }
};
