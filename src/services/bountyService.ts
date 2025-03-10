
import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction } from "./transactionManager";
import { toast } from "@/hooks/use-toast";

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
    status: "active",
    partyAddress: "0x1234567890123456789012345678901234567890",
    eligibleNFTs: ["0x123", "0x456"],
    requireVerification: true,
    allowPublicHunters: true,
    maxReferralsPerHunter: 10,
    bountyType: "nft_referral"
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
    bountyType: "token_referral"
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
    bountyType: "social_media"
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
  // Add a getter for remainingBudget
  remainingBudget?: number;
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
      let bounties: Bounty[];
      
      if (status) {
        bounties = BOUNTIES_DATA.filter(b => b.status === status) as Bounty[];
      } else {
        bounties = BOUNTIES_DATA as Bounty[];
      }
      
      // Add remaining budget to each bounty
      bounties = bounties.map(calculateRemainingBudget);
      
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
      remainingBudget: params.totalBudget // Initial remaining budget
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
): Promise<{ partyAddress: string }> => {
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
    
    // Initialize wallet client and provider
    try {
      // Get wallet client directly from wallet object
      console.log("Getting wallet client for deployment");
      const walletClient = await wallet.getWalletClient();
      
      if (!walletClient) {
        throw new Error("Failed to get wallet client");
      }
      
      // Create ethers provider from wallet client
      const provider = new ethers.providers.Web3Provider(walletClient);
      const signer = provider.getSigner();
      
      // Verify we can get signer address
      const signerAddress = await signer.getAddress();
      console.log("Deploying with signer address:", signerAddress);
      
      // Simulate blockchain deployment
      // In a real implementation, this would call a smart contract deployment function
      // For now, just wait and update the mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock address
      const mockPartyAddress = `0x${Math.random().toString(16).substring(2, 42).padStart(40, '0')}`;
      
      // Update the bounty with the new party address
      const bountyIndex = BOUNTIES_DATA.findIndex(b => b.id === bountyId);
      if (bountyIndex !== -1) {
        BOUNTIES_DATA[bountyIndex].partyAddress = mockPartyAddress;
      }
      
      return { partyAddress: mockPartyAddress };
    } catch (error) {
      console.error("Error initializing wallet for deployment:", error);
      throw new ProposalError({
        category: 'initialization',
        message: 'Failed to initialize wallet',
        recoverySteps: [
          'Make sure your wallet is unlocked',
          'Try refreshing the page',
          'Try reconnecting your wallet'
        ]
      });
    }
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

// Functions needed by other components
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
    
    // Simulate a delay for blockchain transaction
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
    
    const bountyIndex = BOUNTIES_DATA.findIndex(b => b.id === bountyId);
    if (bountyIndex !== -1) {
      BOUNTIES_DATA[bountyIndex].totalBudget += additionalFunds;
    } else {
      return { success: false, error: "Bounty not found" };
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
