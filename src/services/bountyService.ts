import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction } from "./transactionManager";
import { toast } from "@/hooks/use-toast";
import { uploadToIPFS, getFromIPFS } from "./ipfsService";
import { BountyMetadata } from "@/types/content";
import { 
  PARTY_PROTOCOL, 
  PARTY_FACTORY_ABI, 
  ETH_CROWDFUND_ABI, 
  PARTY_GOVERNANCE_ABI 
} from "@/lib/constants";

export interface Bounty {
  id: string;
  name: string;
  description: string;
  rewardAmount: number;
  totalBudget: number;
  usedBudget: number;
  successCount: number;
  hunterCount: number;
  expiresAt: number;
  status: "active" | "paused" | "expired" | "completed";
  partyAddress: string | null;
  eligibleNFTs: string[];
  requireVerification: boolean;
  allowPublicHunters: boolean;
  maxReferralsPerHunter: number;
  bountyType: "nft_referral" | "token_referral" | "social_media";
  remainingBudget?: number;
  crowdfundAddress: string | null;
  metadataURI: string | null;
}

export interface BountyCreationParams {
  name: string;
  description: string;
  rewardType: "fixed" | "percentage";
  rewardAmount: number;
  totalBudget: number;
  duration: number; // days
  maxReferralsPerHunter: number;
  allowPublicHunters: boolean;
  requireVerification: boolean;
  eligibleNFTs: string[];
  successCriteria: string;
  bountyType: "nft_referral" | "token_referral" | "social_media";
}

export interface BountyOptions {
  includeExpired?: boolean;
  includeCompleted?: boolean;
}

// Helper function to calculate remaining budget
const calculateRemainingBudget = (bounty: Bounty): Bounty => {
  return {
    ...bounty,
    remainingBudget: bounty.totalBudget - bounty.usedBudget
  };
};

/**
 * Maps a Party contract and metadata to a Bounty object
 */
const mapPartyToBounty = async (
  partyAddress: string, 
  metadata: BountyMetadata, 
  provider: ethers.providers.Provider
): Promise<Bounty | null> => {
  try {
    if (!metadata.bountyType) return null;
    
    const party = new ethers.Contract(
      partyAddress,
      PARTY_GOVERNANCE_ABI,
      provider
    );
    
    // Get party details
    const [
      votingEnds,
      governanceValues,
      treasuryBalance,
      proposalCount
    ] = await Promise.all([
      party.votingEnds ? party.votingEnds() : 0,
      party.getGovernanceValues ? party.getGovernanceValues() : null,
      provider.getBalance(partyAddress),
      party.proposalCount ? party.proposalCount() : 0
    ]);

    // Calculate successful proposals (each one is a successful referral)
    let successCount = 0;
    let usedBudget = 0;
    
    for (let i = 0; i < proposalCount; i++) {
      try {
        const proposalId = await party.proposals(i);
        const status = await party.getProposalStatus(proposalId);
        
        // Status 3 is EXECUTED in PartyGovernance
        if (status === 3) {
          successCount++;
          
          // Get proposal details to determine the ETH spent
          const proposal = await party.getProposal(proposalId);
          if (proposal && proposal.proposalData && proposal.proposalData.values) {
            for (const value of proposal.proposalData.values) {
              usedBudget += parseFloat(ethers.utils.formatEther(value));
            }
          }
        }
      } catch (error) {
        console.error(`Error processing proposal ${i}:`, error);
        // Continue to next proposal
      }
    }
    
    // Get participants count
    const hunterCount = await party.getVotersCount ? 
      await party.getVotersCount() : 0;
    
    // Get crowdfund address if any
    let crowdfundAddress = null;
    if (metadata.crowdfundAddress && ethers.utils.isAddress(metadata.crowdfundAddress)) {
      crowdfundAddress = metadata.crowdfundAddress;
    }
    
    // Determine status
    const now = Math.floor(Date.now() / 1000);
    let bountyStatus: "active" | "paused" | "expired" | "completed" = "active";
    
    const totalBudget = parseFloat(ethers.utils.formatEther(treasuryBalance));
    
    if (votingEnds < now) {
      bountyStatus = "expired";
    } else if (usedBudget >= totalBudget) {
      bountyStatus = "completed";
    } else if (metadata.status === "paused") {
      bountyStatus = "paused";
    }
    
    // Create bounty object
    const bounty: Bounty = {
      id: partyAddress,
      name: metadata.title,
      description: metadata.content,
      rewardAmount: metadata.rewardAmount,
      totalBudget,
      usedBudget,
      successCount,
      hunterCount,
      expiresAt: votingEnds,
      status: bountyStatus,
      partyAddress,
      eligibleNFTs: metadata.eligibleNFTs || [],
      requireVerification: metadata.requireVerification,
      allowPublicHunters: metadata.allowPublicHunters,
      maxReferralsPerHunter: metadata.maxReferralsPerHunter,
      bountyType: metadata.bountyType,
      crowdfundAddress,
      metadataURI: metadata.metadataURI
    };
    
    return calculateRemainingBudget(bounty);
  } catch (error) {
    console.error(`Error mapping party ${partyAddress} to bounty:`, error);
    return null;
  }
};

/**
 * Get bounties from the blockchain by querying the Party Protocol contracts
 * @param status Optional status filter
 * @returns Promise with array of bounties
 */
export const getBounties = async (status?: string): Promise<Bounty[]> => {
  console.log("Getting bounties with status filter:", status);
  
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-rpc.com"
    );
    
    // Get party contract factory
    const partyFactory = new ethers.Contract(
      PARTY_PROTOCOL.FACTORY_ADDRESS,
      PARTY_FACTORY_ABI,
      provider
    );
    
    // Get all parties 
    let partyAddresses;
    try {
      partyAddresses = await partyFactory.getParties();
    } catch (error) {
      console.error("Error fetching parties from contract:", error);
      partyAddresses = [];
    }
    
    // Fetch all bounties in parallel
    const bountyPromises = partyAddresses.map(async (partyAddress: string) => {
      try {
        // Get party contract
        const party = new ethers.Contract(
          partyAddress,
          PARTY_GOVERNANCE_ABI,
          provider
        );
        
        // Check if this party has a metadataURI and if it's a bounty
        let metadataURI;
        try {
          metadataURI = await party.metadataURI();
        } catch (error) {
          return null; // Not a party with metadata, skip
        }
        
        if (!metadataURI) return null;
        
        // Fetch and parse metadata
        const metadata = await getFromIPFS<BountyMetadata>(
          metadataURI.replace('ipfs://', ''),
          'bounty'
        );
        
        // Skip if not a bounty type
        if (!metadata.bountyType) return null;
        
        // Map party to bounty
        return await mapPartyToBounty(partyAddress, metadata, provider);
      } catch (error) {
        console.error(`Error processing party ${partyAddress}:`, error);
        return null;
      }
    });
    
    // Wait for all bounties to be processed
    const allBounties = await Promise.all(bountyPromises);
    
    // Filter out null results and apply status filter if provided
    const validBounties = allBounties.filter(bounty => 
      bounty !== null && 
      (!status || bounty.status === status)
    ) as Bounty[];
    
    return validBounties;
  } catch (error) {
    console.error("Error fetching bounties:", error);
    return [];
  }
};

export const getBounty = async (bountyId: string): Promise<Bounty | null> => {
  try {
    if (!bountyId || !ethers.utils.isAddress(bountyId)) return null;
    
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-rpc.com"
    );
    
    // Get party contract
    const party = new ethers.Contract(
      bountyId,
      PARTY_GOVERNANCE_ABI,
      provider
    );
    
    // Get metadata URI
    let metadataURI;
    try {
      metadataURI = await party.metadataURI();
    } catch (error) {
      console.error("Error fetching metadata URI:", error);
      return null; // Not a party with metadata
    }
    
    if (!metadataURI) {
      throw new Error("Invalid bounty: no metadata URI");
    }
    
    // Fetch and parse metadata
    const metadata = await getFromIPFS<BountyMetadata>(
      metadataURI.replace('ipfs://', ''),
      'bounty'
    );
    
    // Map party to bounty
    return await mapPartyToBounty(bountyId, metadata, provider);
  } catch (error) {
    console.error("Error fetching bounty details:", error);
    return null;
  }
};

export const createBounty = async (
  params: BountyCreationParams,
  wallet: ethers.Signer
): Promise<Bounty> => {
  console.log("Creating bounty with params:", params);
  
  if (!wallet) {
    throw new Error("Wallet not connected");
  }
  
  try {
    // Deploy the bounty to blockchain using Party Protocol
    const { partyAddress, crowdfundAddress, metadataURI } = await deployBountyToBlockchain(
      params,
      wallet
    );
    
    // Create the bounty object
    const newBounty: Bounty = {
      id: partyAddress,
      name: params.name,
      description: params.description,
      rewardAmount: params.rewardAmount,
      totalBudget: params.totalBudget,
      usedBudget: 0,
      successCount: 0,
      hunterCount: 0,
      expiresAt: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * params.duration),
      status: "active",
      partyAddress,
      eligibleNFTs: params.eligibleNFTs,
      requireVerification: params.requireVerification,
      allowPublicHunters: params.allowPublicHunters,
      maxReferralsPerHunter: params.maxReferralsPerHunter,
      bountyType: params.bountyType,
      remainingBudget: params.totalBudget,
      crowdfundAddress,
      metadataURI
    };
    
    return newBounty;
  } catch (error) {
    console.error("Error creating bounty:", error);
    throw error;
  }
};

export const deployBountyToBlockchain = async (
  bountyParams: BountyCreationParams,
  wallet: ethers.Signer
): Promise<{ partyAddress: string; crowdfundAddress: string; metadataURI: string }> => {
  console.log(`Deploying bounty to blockchain`);
  
  if (!wallet) {
    throw new ProposalError({
      category: 'initialization',
      message: 'Wallet not connected',
      recoverySteps: ['Please connect your wallet']
    });
  }
  
  try {
    const userAddress = await wallet.getAddress();
    console.log("Using wallet for deployment:", userAddress);
    
    // Upload bounty metadata to IPFS
    const now = Math.floor(Date.now() / 1000);
    const bountyMetadata: BountyMetadata = {
      contentSchema: "resistanceBounty-v1",
      contentType: "bounty",
      title: bountyParams.name,
      content: bountyParams.description,
      metadata: {
        author: userAddress,
        publishedAt: now,
        version: 1
      },
      bountyType: bountyParams.bountyType,
      rewardAmount: bountyParams.rewardAmount,
      totalBudget: bountyParams.totalBudget,
      allowPublicHunters: bountyParams.allowPublicHunters,
      maxReferralsPerHunter: bountyParams.maxReferralsPerHunter,
      requireVerification: bountyParams.requireVerification,
      eligibleNFTs: bountyParams.eligibleNFTs,
      successCriteria: bountyParams.successCriteria,
      createdAt: now,
      expiresAt: now + (60 * 60 * 24 * bountyParams.duration)
    };
    
    const metadataURI = await uploadToIPFS(bountyMetadata);
    console.log("Bounty metadata uploaded to IPFS:", metadataURI);
    
    // Create Party Factory contract instance
    const partyFactory = new ethers.Contract(
      PARTY_PROTOCOL.FACTORY_ADDRESS,
      PARTY_FACTORY_ABI,
      wallet
    );
    
    // Set up party options
    const partyOptions = {
      name: `Bounty: ${bountyParams.name}`,
      symbol: "BNTY",
      customizationPresetId: 0, // Default preset
      governance: {
        hosts: [userAddress],
        voteDuration: 60 * 60 * 24 * 3, // 3 days
        executionDelay: 60 * 60 * 24, // 1 day
        passThresholdBps: 5000, // 50%
        totalVotingPower: ethers.utils.parseEther(bountyParams.totalBudget.toString()),
        feeBps: 0, // No fees
        feeRecipient: ethers.constants.AddressZero
      },
      proposalEngine: {
        enableAddAuthorityProposal: true,
        enableSetHostsProposal: true,
        allowPublicProposals: bountyParams.allowPublicHunters
      }
    };
    
    // Create empty arrays for precious tokens (not needed for bounties)
    const preciousTokens: string[] = [];
    const preciousTokenIds: number[] = [];
    
    // Deploy the party contract
    console.log("Creating bounty party...");
    const tx = await partyFactory.createPartyWithMetadata(
      PARTY_PROTOCOL.PARTY_IMPLEMENTATION, // Party implementation
      [userAddress], // Authorities (only creator)
      partyOptions,
      preciousTokens,
      preciousTokenIds,
      0, // No ragequit
      ethers.constants.AddressZero, // Default metadata provider
      ethers.utils.defaultAbiCoder.encode(
        ["string"],
        [metadataURI]
      )
    );
    
    console.log("Bounty party creation transaction sent:", tx.hash);
    const receipt = await tx.wait();
    
    // Extract party address from event logs
    let partyAddress = null;
    for (const log of receipt.logs) {
      try {
        const event = partyFactory.interface.parseLog(log);
        if (event.name === "PartyCreated") {
          partyAddress = event.args.party;
          break;
        }
      } catch (error) {
        // Not the event we're looking for
        continue;
      }
    }
    
    if (!partyAddress) {
      throw new Error("Failed to extract party address from transaction receipt");
    }
    
    console.log(`Bounty party created at address: ${partyAddress}`);
    
    // Create a crowdfund for the party
    console.log("Creating ETH crowdfund for bounty...");
    
    const crowdfundFactory = new ethers.Contract(
      PARTY_PROTOCOL.ETH_CROWDFUND_ADDRESS,
      ETH_CROWDFUND_ABI,
      wallet
    );
    
    const crowdfundOptions = {
      initialContributor: userAddress,
      minContribution: ethers.utils.parseEther("0.01"), // Small minimum
      maxContribution: ethers.utils.parseEther(bountyParams.totalBudget.toString()),
      maxTotalContributions: ethers.utils.parseEther((bountyParams.totalBudget * 2).toString()),
      duration: (60 * 60 * 24 * bountyParams.duration),
      exchangeRate: 1, // 1:1 ETH to voting power
      fundingSplitBps: 0, // No funding split
      fundingSplitRecipient: ethers.constants.AddressZero,
      gateKeeper: ethers.constants.AddressZero, // No gatekeeper
      gateKeeperId: ethers.constants.HashZero
    };
    
    const crowdfundTx = await crowdfundFactory.createEthCrowdfund(
      partyAddress,
      crowdfundOptions,
      metadataURI
    );
    
    console.log("Crowdfund creation transaction sent:", crowdfundTx.hash);
    const crowdfundReceipt = await crowdfundTx.wait();
    
    // Extract crowdfund address from event logs
    let crowdfundAddress = null;
    for (const log of crowdfundReceipt.logs) {
      try {
        const event = crowdfundFactory.interface.parseLog(log);
        if (event.name === "CrowdfundCreated") {
          crowdfundAddress = event.args.crowdfund;
          break;
        }
      } catch (error) {
        // Not the event we're looking for
        continue;
      }
    }
    
    if (!crowdfundAddress) {
      throw new Error("Failed to extract crowdfund address from transaction receipt");
    }
    
    console.log(`Bounty crowdfund created at address: ${crowdfundAddress}`);
    
    // Contribute initial funds to the crowdfund
    console.log(`Contributing ${bountyParams.totalBudget} ETH to the crowdfund...`);
    
    const crowdfund = new ethers.Contract(
      crowdfundAddress,
      ETH_CROWDFUND_ABI,
      wallet
    );
    
    const contributeTx = await crowdfund.contribute(
      userAddress, // self-delegation
      { value: ethers.utils.parseEther(bountyParams.totalBudget.toString()) }
    );
    
    console.log("Contribution transaction sent:", contributeTx.hash);
    await contributeTx.wait();
    
    // Update the party metadata to include the crowdfund address
    const updatedMetadata: BountyMetadata = {
      ...bountyMetadata,
      crowdfundAddress
    };
    
    const updatedMetadataURI = await uploadToIPFS(updatedMetadata);
    
    // Return the deployed addresses
    return {
      partyAddress,
      crowdfundAddress,
      metadataURI: updatedMetadataURI
    };
  } catch (error) {
    console.error("Error deploying bounty:", error);
    
    if (error instanceof ProposalError) {
      throw error;
    }
    
    throw new ProposalError({
      category: 'transaction',
      message: error instanceof Error ? error.message : 'Failed to deploy bounty',
      recoverySteps: [
        'Check your wallet connection',
        'Make sure you have enough funds for gas',
        'Try again later'
      ]
    });
  }
};

export const recordSuccessfulReferral = async (
  bountyId: string,
  referrerId: string,
  referredUser: string,
  wallet: ethers.Signer
): Promise<{ success: boolean, error?: string }> => {
  console.log(`Recording successful referral for bounty ${bountyId} by ${referrerId} for user ${referredUser}`);
  
  try {
    if (!wallet) {
      return { success: false, error: "Wallet not connected" };
    }
    
    if (!bountyId || !ethers.utils.isAddress(bountyId)) {
      return { success: false, error: "Valid Bounty ID required" };
    }
    
    // Get bounty details
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      return { success: false, error: "Bounty not found" };
    }
    
    // Check if bounty is still active
    if (bounty.status !== "active") {
      return { success: false, error: `Bounty is ${bounty.status}, not active` };
    }
    
    // Create party contract instance
    const party = new ethers.Contract(
      bountyId,
      PARTY_GOVERNANCE_ABI,
      wallet
    );
    
    // Prepare proposal to transfer ETH to referrer
    const targets = [referrerId];
    const values = [ethers.utils.parseEther(bounty.rewardAmount.toString())];
    const calldatas = ["0x"]; // Empty calldata for simple ETH transfer
    
    // Create proposal data structure
    const proposalData = {
      basicProposalEngineType: 0, // Standard proposal type
      targetAddresses: targets,
      values: values,
      calldatas: calldatas,
      signatures: [""]
    };
    
    const description = `Reward for referring ${referredUser}`;
    
    // Submit proposal
    console.log("Submitting referral reward proposal...");
    const tx = await party.propose(
      proposalData,
      description,
      "0x" // No progress data
    );
    
    console.log("Proposal submitted:", tx.hash);
    
    // Wait for transaction to confirm
    await tx.wait(1);
    
    return { success: true };
  } catch (error) {
    console.error("Error recording referral:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error recording referral"
    };
  }
};

export const distributeRewards = async (
  bountyId: string,
  wallet: ethers.Signer
): Promise<{ success: boolean, error?: string }> => {
  console.log(`Distributing rewards for bounty ${bountyId}`);
  
  try {
    if (!wallet) {
      return { success: false, error: "Wallet not connected" };
    }
    
    if (!bountyId || !ethers.utils.isAddress(bountyId)) {
      return { success: false, error: "Valid Bounty ID required" };
    }
    
    // Get party contract instance
    const party = new ethers.Contract(
      bountyId,
      PARTY_GOVERNANCE_ABI,
      wallet
    );
    
    // Get total proposal count
    const proposalCount = await party.proposalCount();
    
    // Find ready proposals
    const readyProposalIds = [];
    for (let i = 0; i < proposalCount; i++) {
      try {
        const proposalId = await party.proposals(i);
        const status = await party.getProposalStatus(proposalId);
        
        // Status 2 is READY in PartyGovernance
        if (status === 2) {
          readyProposalIds.push(proposalId);
        }
      } catch (error) {
        console.error(`Error checking proposal ${i}:`, error);
        // Continue to next proposal
      }
    }
    
    if (readyProposalIds.length === 0) {
      return { success: false, error: "No proposals ready for execution" };
    }
    
    // Execute each ready proposal
    for (const proposalId of readyProposalIds) {
      try {
        console.log(`Executing proposal ${proposalId}...`);
        
        // Get proposal details
        const proposal = await party.getProposal(proposalId);
        
        // Prepare execution data
        const executionData = {
          targets: proposal.proposalData.targetAddresses,
          values: proposal.proposalData.values,
          calldatas: proposal.proposalData.calldatas,
          signatures: proposal.proposalData.signatures || [""]
        };
        
        // Execute the proposal
        const tx = await party.execute(
          proposalId,
          executionData,
          0, // No flags
          "0x" // No progress data
        );
        
        console.log(`Executing proposal ${proposalId}:`, tx.hash);
        await tx.wait(1);
      } catch (error) {
        console.error(`Error executing proposal ${proposalId}:`, error);
        // Continue with other proposals
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error distributing rewards:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error distributing rewards"
    };
  }
};

export const updateBountyStatus = async (
  bountyId: string,
  newStatus: "active" | "paused" | "expired" | "completed",
  wallet: ethers.Signer
): Promise<{ success: boolean, error?: string }> => {
  console.log(`Updating bounty ${bountyId} status to ${newStatus}`);
  
  try {
    if (!wallet) {
      return { success: false, error: "Wallet not connected" };
    }
    
    if (!bountyId || !ethers.utils.isAddress(bountyId)) {
      return { success: false, error: "Valid Bounty ID required" };
    }
    
    // Get party contract instance
    const party = new ethers.Contract(
      bountyId,
      PARTY_GOVERNANCE_ABI,
      wallet
    );
    
    // Get current metadata URI
    const metadataURI = await party.metadataURI();
    
    if (!metadataURI) {
      return { success: false, error: "Bounty has no metadata URI" };
    }
    
    // Get existing metadata
    const metadata = await getFromIPFS<BountyMetadata>(
      metadataURI.replace('ipfs://', ''),
      'bounty'
    );
    
    // Update the status in metadata
    const updatedMetadata: BountyMetadata = {
      ...metadata,
      status: newStatus
    };
    
    // Upload updated metadata to IPFS
    const newMetadataURI = await uploadToIPFS(updatedMetadata);
    console.log("Updated metadata uploaded to IPFS:", newMetadataURI);
    
    // Update the party's metadata URI
    const tx = await party.updateMetadataURI(newMetadataURI);
    console.log("Updating party metadata:", tx.hash);
    await tx.wait(1);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating bounty status:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error updating status"
    };
  }
};

export const fundBounty = async (
  bountyId: string,
  additionalFunds: number,
  wallet: ethers.Signer
): Promise<{ success: boolean, error?: string }> => {
  console.log(`Adding ${additionalFunds} to bounty ${bountyId}`);
  
  try {
    if (!wallet) {
      return { success: false, error: "Wallet not connected" };
    }
    
    if (!bountyId || !ethers.utils.isAddress(bountyId)) {
      return { success: false, error: "Valid Bounty ID required" };
    }
    
    // Get bounty details
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      return { success: false, error: "Bounty not found" };
    }
    
    // Transfer ETH directly to the party contract
    const tx = await wallet.sendTransaction({
      to: bountyId,
      value: ethers.utils.parseEther(additionalFunds.toString())
    });
    
    console.log(`Contributing ${additionalFunds} ETH to bounty:`, tx.hash);
    await tx.wait(1);
    
    // Update the bounty metadata to reflect new total budget
    const party = new ethers.Contract(
      bountyId,
      PARTY_GOVERNANCE_ABI,
      wallet
    );
    
    // Get current metadata URI
    const metadataURI = await party.metadataURI();
    
    // Get existing metadata
    const metadata = await getFromIPFS<BountyMetadata>(
      metadataURI.replace('ipfs://', ''),
      'bounty'
    );
    
    // Update the total budget in metadata
    const updatedMetadata = {
      ...metadata,
      totalBudget: (metadata.totalBudget || 0) + additionalFunds
    };
    
    // Upload updated metadata to IPFS
    const newMetadataURI = await uploadToIPFS(updatedMetadata);
    
    // Update the party's metadata URI
    const updateTx = await party.updateMetadataURI(newMetadataURI);
    console.log("Updating party metadata with new budget:", updateTx.hash);
    await updateTx.wait(1);
    
    return { success: true };
  } catch (error) {
    console.error("Error funding bounty:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error funding bounty"
    };
  }
};
