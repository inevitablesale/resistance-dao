import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction } from "./transactionManager";
import { toast } from "@/hooks/use-toast";
import { createBountyParty, createEthCrowdfund } from "./partyProtocolService";
import { uploadToIPFS, getFromIPFS } from "./ipfsService";

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

// Cache for bounties to avoid excessive blockchain calls
let bountiesCache: Bounty[] = [];
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get bounties from the blockchain
 * @param status Optional status filter
 * @returns Promise with array of bounties
 */
export const getBounties = async (status?: string): Promise<Bounty[]> => {
  console.log("Getting bounties with status filter:", status);
  
  const now = Date.now();
  if (bountiesCache.length > 0 && now - lastCacheUpdate < CACHE_DURATION) {
    console.log("Using cached bounties data");
    let filteredBounties = [...bountiesCache];
    
    if (status) {
      filteredBounties = filteredBounties.filter(b => b.status === status);
    }
    
    return filteredBounties;
  }
  
  try {
    // In a production app, this would:
    // 1. Query an indexer or subgraph for all bounties created through our protocol
    // 2. Fetch metadata from IPFS for each bounty
    // 3. Get on-chain data about each bounty's current state
    
    // For now, we'll use our existing mock data as a placeholder
    // but in a real implementation this would be replaced with blockchain calls
    
    const fetchedBounties: Bounty[] = [];
    
    // The following code simulates what would happen in a real blockchain implementation:
    
    // 1. We'd first query an indexer or subgraph for all bounty party addresses
    // const partyAddresses = await queryBountyPartiesFromSubgraph();
    
    // 2. For each address, we'd fetch the party details and metadata
    // for (const partyAddress of partyAddresses) {
    //   const partyDetails = await getPartyDetails(provider, partyAddress);
    //   const metadataURI = partyDetails.metadataURI;
    //   const metadata = await getFromIPFS(metadataURI.replace('ipfs://', ''), 'proposal');
    //   
    //   // 3. We'd construct the bounty object from the party and metadata
    //   fetchedBounties.push({
    //     id: partyAddress,
    //     name: metadata.name,
    //     description: metadata.description,
    //     ...
    //   });
    // }
    
    // For now, simulate a delay for API/blockchain call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data that we'll soon replace with actual blockchain calls
    fetchedBounties.push(
      {
        id: "b1",
        name: "Referral Program Alpha",
        description: "Bring in new members to earn tokens. Each successful referral will be rewarded.",
        rewardAmount: 5,
        totalBudget: 500,
        usedBudget: 125,
        successCount: 25,
        hunterCount: 8,
        expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days from now
        status: "active",
        partyAddress: "0x1234567890123456789012345678901234567890",
        eligibleNFTs: ["0x123", "0x456"],
        requireVerification: true,
        allowPublicHunters: true,
        maxReferralsPerHunter: 10,
        bountyType: "nft_referral",
        crowdfundAddress: "0x0987654321098765432109876543210987654321",
        metadataURI: "ipfs://QmXyz"
      },
      {
        id: "b2",
        name: "NFT Launch Promotion",
        description: "Help promote our new NFT collection. Rewards for each successful sale through your link.",
        rewardAmount: 10,
        totalBudget: 1000,
        usedBudget: 200,
        successCount: 20,
        hunterCount: 5,
        expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15, // 15 days from now
        status: "active",
        partyAddress: null,
        eligibleNFTs: [],
        requireVerification: false,
        allowPublicHunters: true,
        maxReferralsPerHunter: 5,
        bountyType: "token_referral",
        crowdfundAddress: null,
        metadataURI: null
      },
      {
        id: "b3",
        name: "Community Expansion",
        description: "Grow our Discord community with active members. Rewards for each member that stays active for 7 days.",
        rewardAmount: 2,
        totalBudget: 200,
        usedBudget: 46,
        successCount: 23,
        hunterCount: 12,
        expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 60, // 60 days from now
        status: "active",
        partyAddress: null,
        eligibleNFTs: [],
        requireVerification: true,
        allowPublicHunters: false,
        maxReferralsPerHunter: 20,
        bountyType: "social_media",
        crowdfundAddress: null,
        metadataURI: null
      }
    );
    
    // Update cache
    if (fetchedBounties.length > 0) {
      bountiesCache = fetchedBounties.map(b => calculateRemainingBudget(b));
      lastCacheUpdate = now;
    }
    
    let filteredBounties = [...bountiesCache];
    
    if (status) {
      filteredBounties = filteredBounties.filter(b => b.status === status);
    }
    
    return filteredBounties;
  } catch (error) {
    console.error("Error fetching bounties:", error);
    return [];
  }
};

export const getBounty = async (bountyId: string): Promise<Bounty | null> => {
  try {
    // First check cache
    const cachedBounty = bountiesCache.find(b => b.id === bountyId);
    if (cachedBounty) {
      return cachedBounty;
    }
    
    // If not in cache, fetch all bounties
    const bounties = await getBounties();
    const bounty = bounties.find(b => b.id === bountyId);
    return bounty || null;
    
    // In a real implementation, we'd query the specific bounty by ID:
    // const bountyDetails = await getBountyPartyDetails(provider, bountyId);
    // const metadata = await getFromIPFS(bountyDetails.metadataURI);
    // return { ... };
  } catch (error) {
    console.error("Error fetching bounty details:", error);
    return null;
  }
};

export const createBounty = async (
  params: BountyCreationParams,
  wallet: any
): Promise<Bounty> => {
  console.log("Creating bounty with params:", params);
  console.log("Using wallet:", wallet?.address);
  
  if (!wallet) {
    throw new Error("Wallet not connected");
  }
  
  try {
    // Generate a bounty ID (this would be the Party address in production)
    const bountyId = `b${Math.floor(Math.random() * 10000)}`;
    
    // Create a new bounty object
    const newBounty: Bounty = {
      id: bountyId,
      name: params.name,
      description: params.description,
      rewardAmount: params.rewardAmount,
      totalBudget: params.totalBudget,
      usedBudget: 0,
      successCount: 0,
      hunterCount: 0,
      expiresAt: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * params.duration),
      status: "active",
      partyAddress: null,
      eligibleNFTs: params.eligibleNFTs,
      requireVerification: params.requireVerification,
      allowPublicHunters: params.allowPublicHunters,
      maxReferralsPerHunter: params.maxReferralsPerHunter,
      bountyType: params.bountyType,
      remainingBudget: params.totalBudget,
      crowdfundAddress: null,
      metadataURI: null
    };
    
    // Add to cache
    bountiesCache.push(newBounty);
    
    return newBounty;
  } catch (error) {
    console.error("Error creating bounty:", error);
    throw error;
  }
};

export const deployBountyToBlockchain = async (
  bountyId: string,
  wallet: any
): Promise<{ partyAddress: string; crowdfundAddress?: string }> => {
  console.log(`Deploying bounty ${bountyId} to blockchain`);
  
  if (!wallet) {
    throw new ProposalError({
      category: 'initialization',
      message: 'Wallet not connected',
      recoverySteps: ['Please connect your wallet']
    });
  }
  
  try {
    console.log("Using wallet for deployment:", wallet?.address);
    
    // Get the bounty to deploy
    const bounty = await getBounty(bountyId);
    
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    if (bounty.partyAddress) {
      throw new Error("Bounty already deployed");
    }
    
    // Prepare Party Protocol options for bounty
    const now = Math.floor(Date.now() / 1000);
    const bountyPartyOptions = {
      name: `Bounty: ${bounty.name}`,
      hosts: [await wallet.getAddress()], // Bounty creator as host
      votingDuration: 60 * 60 * 24 * 3, // 3 days
      executionDelay: 60 * 60 * 24, // 1 day
      passThresholdBps: 5000, // 50%
      allowPublicProposals: false, // Only hosts can make proposals
      description: bounty.description,
      
      // Bounty-specific options
      rewardAmount: bounty.rewardAmount,
      maxParticipants: 1000, // Arbitrary large number
      startTime: now,
      endTime: bounty.expiresAt,
      verificationRequired: bounty.requireVerification,
      targetRequirements: bounty.eligibleNFTs
    };
    
    // Upload bounty metadata to IPFS
    const bountyMetadata = {
      name: bounty.name,
      description: bounty.description,
      bountyType: bounty.bountyType,
      rewardAmount: bounty.rewardAmount,
      totalBudget: bounty.totalBudget,
      allowPublicHunters: bounty.allowPublicHunters,
      maxReferralsPerHunter: bounty.maxReferralsPerHunter,
      requireVerification: bounty.requireVerification,
      eligibleNFTs: bounty.eligibleNFTs,
      createdAt: now,
      expiresAt: bounty.expiresAt
    };
    
    const metadataURI = await uploadToIPFS(bountyMetadata);
    console.log("Bounty metadata uploaded to IPFS:", metadataURI);
    
    // Step 1: Create the Bounty Party
    console.log("Creating bounty party on Party Protocol...");
    const partyAddress = await createBountyParty(wallet, {
      ...bountyPartyOptions,
      metadataURI
    });
    
    console.log(`Bounty party created at address: ${partyAddress}`);
    
    // Step 2: Create ETH Crowdfund for the party to manage bounty funds
    console.log("Creating ETH crowdfund for bounty...");
    
    const userAddress = await wallet.getAddress();
    
    const crowdfundOptions = {
      initialContributor: userAddress,
      minContribution: "0.01", // Small minimum to allow most users
      maxContribution: bounty.totalBudget.toString(), // Full budget amount
      maxTotalContributions: (bounty.totalBudget * 2).toString(), // Allow for additional funding
      duration: bounty.expiresAt - now // Duration until expiry
    };
    
    const crowdfundAddress = await createEthCrowdfund(
      wallet,
      partyAddress,
      crowdfundOptions,
      bountyMetadata
    );
    
    console.log(`Bounty crowdfund created at address: ${crowdfundAddress}`);
    
    // Update the bounty in the cache
    const bountyIndex = bountiesCache.findIndex(b => b.id === bountyId);
    if (bountyIndex !== -1) {
      bountiesCache[bountyIndex] = {
        ...bountiesCache[bountyIndex],
        partyAddress,
        crowdfundAddress,
        metadataURI
      };
    }
    
    return { 
      partyAddress, 
      crowdfundAddress 
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
  referredUser: string
): Promise<{ success: boolean, error?: string }> => {
  console.log(`Recording successful referral for bounty ${bountyId} by ${referrerId} for user ${referredUser}`);
  
  try {
    const bounty = await getBounty(bountyId);
    if (!bounty) return { success: false, error: "Bounty not found" };
    
    // In a real implementation, this would:
    // 1. Check the bounty's Party contract to verify it's valid
    // 2. Create a proposal to reward the referrer
    // 3. Execute the proposal if auto-approval is enabled
    
    // For now, update the cache data
    const bountyIndex = bountiesCache.findIndex(b => b.id === bountyId);
    if (bountyIndex !== -1) {
      bountiesCache[bountyIndex] = {
        ...bountiesCache[bountyIndex],
        successCount: bountiesCache[bountyIndex].successCount + 1,
        usedBudget: bountiesCache[bountyIndex].usedBudget + bountiesCache[bountyIndex].rewardAmount,
        remainingBudget: bountiesCache[bountyIndex].totalBudget - (bountiesCache[bountyIndex].usedBudget + bountiesCache[bountyIndex].rewardAmount)
      };
    }
    
    // Simulate a delay for blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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
  wallet: any
): Promise<{ success: boolean, error?: string }> => {
  console.log(`Distributing rewards for bounty ${bountyId}`);
  
  try {
    if (!wallet) {
      return { success: false, error: "Wallet not connected" };
    }
    
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      return { success: false, error: "Bounty not found" };
    }
    
    if (!bounty.partyAddress) {
      return { success: false, error: "Bounty must be deployed to blockchain first" };
    }
    
    // In a real implementation, this would:
    // 1. Create a governance proposal on the Party
    // 2. The proposal would distribute funds to referrers
    // 3. Execute the proposal if enough votes are gathered
    
    // For now, just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
  wallet: any
): Promise<{ success: boolean, error?: string }> => {
  console.log(`Updating bounty ${bountyId} status to ${newStatus}`);
  
  try {
    if (!wallet) {
      return { success: false, error: "Wallet not connected" };
    }
    
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      return { success: false, error: "Bounty not found" };
    }
    
    // In a real implementation:
    // 1. If deployed to blockchain, create a governance proposal to update status
    // 2. Update the metadata on IPFS
    
    // For now, update the cache
    const bountyIndex = bountiesCache.findIndex(b => b.id === bountyId);
    if (bountyIndex !== -1) {
      bountiesCache[bountyIndex] = {
        ...bountiesCache[bountyIndex],
        status: newStatus
      };
    } else {
      return { success: false, error: "Bounty not found" };
    }
    
    // Simulate a delay for blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
  wallet: any
): Promise<{ success: boolean, error?: string }> => {
  console.log(`Adding ${additionalFunds} to bounty ${bountyId}`);
  
  try {
    if (!wallet) {
      return { success: false, error: "Wallet not connected" };
    }
    
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      return { success: false, error: "Bounty not found" };
    }
    
    // Update the cache
    const bountyIndex = bountiesCache.findIndex(b => b.id === bountyId);
    if (bountyIndex !== -1) {
      bountiesCache[bountyIndex] = {
        ...bountiesCache[bountyIndex],
        totalBudget: bountiesCache[bountyIndex].totalBudget + additionalFunds,
        remainingBudget: (bountiesCache[bountyIndex].remainingBudget || 0) + additionalFunds
      };
    } else {
      return { success: false, error: "Bounty not found" };
    }
    
    // If the bounty is deployed, send a real transaction to the crowdfund
    if (bounty.crowdfundAddress) {
      console.log(`Sending ${additionalFunds} to crowdfund at ${bounty.crowdfundAddress}`);
      // In a real implementation, we would call sentinelContributeToParty here
    }
    
    // Simulate a delay for blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return { success: true };
  } catch (error) {
    console.error("Error funding bounty:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error funding bounty"
    };
  }
};

// This function would be added in a real blockchain implementation
// to fetch on-chain bounty details directly from Party Protocol
const getBountyPartyDetails = async (
  provider: ethers.providers.Provider,
  partyAddress: string
) => {
  // Create a contract instance for the Party
  // const partyContract = new ethers.Contract(partyAddress, PARTY_ABI, provider);
  // Return party details including metadata URI, etc.
  
  // For now, return mock data
  return {
    metadataURI: "ipfs://mockHash",
    // Other party details
  };
};

