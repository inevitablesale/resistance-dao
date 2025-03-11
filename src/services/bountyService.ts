import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction } from "./transactionManager";
import { toast } from "@/hooks/use-toast";
import { createBountyParty, createEthCrowdfund } from "./partyProtocolService";
import { uploadToIPFS } from "./ipfsService";

// Mock data for development
const BOUNTIES_DATA = [
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
    status: "active" as const,
    partyAddress: "0x1234567890123456789012345678901234567890",
    eligibleNFTs: ["0x123", "0x456"],
    requireVerification: true,
    allowPublicHunters: true,
    maxReferralsPerHunter: 10,
    bountyType: "nft_referral" as const,
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
    status: "active" as const,
    partyAddress: null,
    eligibleNFTs: [],
    requireVerification: false,
    allowPublicHunters: true,
    maxReferralsPerHunter: 5,
    bountyType: "token_referral" as const,
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
    status: "active" as const,
    partyAddress: null,
    eligibleNFTs: [],
    requireVerification: true,
    allowPublicHunters: false,
    maxReferralsPerHunter: 20,
    bountyType: "social_media" as const,
    crowdfundAddress: null,
    metadataURI: null
  }
];

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

export const getBounties = async (status?: string): Promise<Bounty[]> => {
  // In a real app, this would fetch from an API or blockchain
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredBounties: typeof BOUNTIES_DATA;
      
      if (status) {
        filteredBounties = BOUNTIES_DATA.filter(b => b.status === status);
      } else {
        filteredBounties = [...BOUNTIES_DATA];
      }
      
      // Convert to proper Bounty type with remaining budget
      const bounties: Bounty[] = filteredBounties.map(b => ({
        ...b,
        remainingBudget: b.totalBudget - b.usedBudget
      })) as Bounty[];
      
      resolve(bounties);
    }, 800);
  });
};

export const getBounty = async (bountyId: string): Promise<Bounty | null> => {
  const bounties = await getBounties();
  const bounty = bounties.find(b => b.id === bountyId);
  return bounty || null;
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
    // In a real implementation, this would interact with the blockchain
    // For now, just create a mock bounty
    const newBounty: Bounty = {
      id: `b${Math.floor(Math.random() * 10000)}`,
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
      remainingBudget: params.totalBudget, // Initial remaining budget
      crowdfundAddress: null,
      metadataURI: null
    };
    
    // Add to our mock data
    BOUNTIES_DATA.push(newBounty as any);
    
    // Simulate a delay for API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    const bounties = await getBounties();
    const bountyToDeploy = bounties.find(b => b.id === bountyId);
    
    if (!bountyToDeploy) {
      throw new Error("Bounty not found");
    }
    
    if (bountyToDeploy.partyAddress) {
      throw new Error("Bounty already deployed");
    }
    
    // Prepare Party Protocol options for bounty
    const now = Math.floor(Date.now() / 1000);
    const bountyPartyOptions = {
      name: `Bounty: ${bountyToDeploy.name}`,
      hosts: [await wallet.getWalletClient().getAddress()], // Bounty creator as host
      votingDuration: 60 * 60 * 24 * 3, // 3 days
      executionDelay: 60 * 60 * 24, // 1 day
      passThresholdBps: 5000, // 50%
      allowPublicProposals: false, // Only hosts can make proposals
      description: bountyToDeploy.description,
      
      // Bounty-specific options
      rewardAmount: bountyToDeploy.rewardAmount,
      maxParticipants: 1000, // Arbitrary large number
      startTime: now,
      endTime: bountyToDeploy.expiresAt,
      verificationRequired: bountyToDeploy.requireVerification,
      targetRequirements: bountyToDeploy.eligibleNFTs
    };
    
    // Upload bounty metadata to IPFS
    const bountyMetadata = {
      name: bountyToDeploy.name,
      description: bountyToDeploy.description,
      bountyType: bountyToDeploy.bountyType,
      rewardAmount: bountyToDeploy.rewardAmount,
      totalBudget: bountyToDeploy.totalBudget,
      allowPublicHunters: bountyToDeploy.allowPublicHunters,
      maxReferralsPerHunter: bountyToDeploy.maxReferralsPerHunter,
      requireVerification: bountyToDeploy.requireVerification,
      eligibleNFTs: bountyToDeploy.eligibleNFTs,
      createdAt: now,
      expiresAt: bountyToDeploy.expiresAt
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
    
    const walletClient = await wallet.getWalletClient();
    const userAddress = await walletClient.getAddress();
    
    const crowdfundOptions = {
      initialContributor: userAddress,
      minContribution: "0.01", // Small minimum to allow most users
      maxContribution: bountyToDeploy.totalBudget.toString(), // Full budget amount
      maxTotalContributions: (bountyToDeploy.totalBudget * 2).toString(), // Allow for additional funding
      duration: bountyToDeploy.expiresAt - now // Duration until expiry
    };
    
    const crowdfundAddress = await createEthCrowdfund(
      wallet,
      partyAddress,
      crowdfundOptions,
      bountyMetadata
    );
    
    console.log(`Bounty crowdfund created at address: ${crowdfundAddress}`);
    
    // Update the bounty with the new addresses
    const bountyIndex = BOUNTIES_DATA.findIndex(b => b.id === bountyId);
    if (bountyIndex !== -1) {
      BOUNTIES_DATA[bountyIndex].partyAddress = partyAddress;
      BOUNTIES_DATA[bountyIndex].crowdfundAddress = crowdfundAddress;
      BOUNTIES_DATA[bountyIndex].metadataURI = metadataURI;
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
    
    // In a real app, this would interact with the smart contract
    // For now, update the mock data
    const bountyIndex = BOUNTIES_DATA.findIndex(b => b.id === bountyId);
    if (bountyIndex !== -1) {
      BOUNTIES_DATA[bountyIndex].successCount += 1;
      BOUNTIES_DATA[bountyIndex].usedBudget += BOUNTIES_DATA[bountyIndex].rewardAmount;
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
    
    // In a real implementation, this would create a Party Protocol proposal
    // to distribute rewards to successful referrers
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
    
    // If the bounty is deployed to a Party, we would need to create a proposal
    // to update its status on-chain. For now, just update the mock data.
    const bountyIndex = BOUNTIES_DATA.findIndex(b => b.id === bountyId);
    if (bountyIndex !== -1) {
      BOUNTIES_DATA[bountyIndex].status = newStatus;
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
    
    // If the bounty has a crowdfund address, we would contribute to it
    // For now, just update the mock data
    const bountyIndex = BOUNTIES_DATA.findIndex(b => b.id === bountyId);
    if (bountyIndex !== -1) {
      BOUNTIES_DATA[bountyIndex].totalBudget += additionalFunds;
    } else {
      return { success: false, error: "Bounty not found" };
    }
    
    // If the bounty is deployed, send a real transaction to the crowdfund
    if (bounty.crowdfundAddress) {
      console.log(`Would send ${additionalFunds} to crowdfund at ${bounty.crowdfundAddress}`);
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

