import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction, TransactionConfig } from "./transactionManager";
import { createParty, PartyOptions, createEthCrowdfund, CrowdfundOptions } from "./partyProtocolService";
import { toast } from "@/hooks/use-toast";

// Bounty Protocol addresses
const BOUNTY_FACTORY_ADDRESS = "0x4a5EA76571F47E7d92B5040E8C7FF12eacd35087"; // Polygon mainnet

// Interface for general bounty options
export interface BountyOptions {
  name: string;
  description: string;
  rewardType: "fixed" | "percentage" | "tiered";
  rewardAmount: number;
  totalBudget: number;
  duration: number;
  maxReferralsPerHunter: number;
  allowPublicHunters: boolean;
  requireVerification: boolean;
  eligibleNFTs: string[];
  successCriteria: string;
  bountyType: "nft_referral" | "talent_acquisition" | "business_development" | "custom";
}

// Interface for Bounty object
export interface Bounty {
  id: string;
  name: string;
  description: string;
  rewardAmount: number;
  totalBudget: number;
  usedBudget: number;
  remainingBudget: number;
  createdAt: number;
  expiresAt: number;
  status: "active" | "paused" | "expired" | "completed";
  successCount: number;
  hunterCount: number;
  partyAddress?: string;
  crowdfundAddress?: string;
  eligibleNFTs?: string[]; // Added this property to fix the TypeScript error
}

/**
 * Creates a new bounty using Party Protocol
 * @param options Bounty creation options
 * @returns Promise resolving to the bounty object
 */
export async function createBounty(options: BountyOptions): Promise<Bounty | null> {
  try {
    console.log("Creating bounty with options:", options);
    
    // For now, we'll create a mock bounty
    // In the real implementation, this would create a Party for the bounty
    
    const bountyId = `b-${Date.now().toString(36)}`;
    const now = Math.floor(Date.now() / 1000);
    
    // Store in local storage for now (would be replaced with backend storage)
    const bounty: Bounty = {
      id: bountyId,
      name: options.name,
      description: options.description,
      rewardAmount: options.rewardAmount,
      totalBudget: options.totalBudget,
      usedBudget: 0,
      remainingBudget: options.totalBudget,
      createdAt: now,
      expiresAt: now + (options.duration * 24 * 60 * 60),
      status: "active",
      successCount: 0,
      hunterCount: 0
    };
    
    // Store in localStorage
    const storedBounties = localStorage.getItem("bounties") || "[]";
    const bounties = JSON.parse(storedBounties);
    bounties.push(bounty);
    localStorage.setItem("bounties", JSON.stringify(bounties));
    
    console.log("Bounty created successfully:", bounty);
    return bounty;
  } catch (error) {
    console.error("Error creating bounty:", error);
    throw new ProposalError({
      category: 'contract',
      message: 'Failed to create bounty',
      recoverySteps: [
        'Check your wallet connection',
        'Ensure you have enough MATIC for gas fees',
        'Try again with different parameters'
      ]
    });
  }
}

/**
 * Fetch all bounties
 * @param status Optional status filter
 * @returns Array of bounties
 */
export async function getBounties(status?: string): Promise<Bounty[]> {
  try {
    // Get bounties from localStorage
    const storedBounties = localStorage.getItem("bounties") || "[]";
    const bounties = JSON.parse(storedBounties);
    
    // Filter by status if provided
    if (status) {
      return bounties.filter((bounty: Bounty) => bounty.status === status);
    }
    
    return bounties;
  } catch (error) {
    console.error("Error fetching bounties:", error);
    return [];
  }
}

/**
 * Get a single bounty by ID
 * @param bountyId ID of the bounty to fetch
 * @returns Bounty object or null if not found
 */
export async function getBounty(bountyId: string): Promise<Bounty | null> {
  try {
    const bounties = await getBounties();
    const bounty = bounties.find(b => b.id === bountyId);
    return bounty || null;
  } catch (error) {
    console.error("Error fetching bounty:", error);
    return null;
  }
}

/**
 * Update bounty status
 * @param bountyId ID of the bounty to update
 * @param status New status
 * @returns Updated bounty or null if failed
 */
export async function updateBountyStatus(bountyId: string, status: "active" | "paused" | "expired" | "completed"): Promise<Bounty | null> {
  try {
    const bounties = await getBounties();
    const bountyIndex = bounties.findIndex((b: Bounty) => b.id === bountyId);
    
    if (bountyIndex === -1) {
      throw new Error("Bounty not found");
    }
    
    bounties[bountyIndex].status = status;
    localStorage.setItem("bounties", JSON.stringify(bounties));
    
    return bounties[bountyIndex];
  } catch (error) {
    console.error("Error updating bounty status:", error);
    return null;
  }
}

/**
 * Record a successful referral
 * @param bountyId ID of the bounty
 * @param referrerAddress Address of the referrer
 * @param referredAddress Address of the referred user
 * @returns Updated bounty or null if failed
 */
export async function recordSuccessfulReferral(
  bountyId: string,
  referrerAddress: string,
  referredAddress: string
): Promise<Bounty | null> {
  try {
    const bounty = await getBounty(bountyId);
    
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    // Check if there's enough budget
    if (bounty.remainingBudget < bounty.rewardAmount) {
      throw new Error("Insufficient bounty budget");
    }
    
    // Update the bounty
    const bounties = await getBounties();
    const bountyIndex = bounties.findIndex((b: Bounty) => b.id === bountyId);
    
    bounties[bountyIndex].usedBudget += bounty.rewardAmount;
    bounties[bountyIndex].remainingBudget -= bounty.rewardAmount;
    bounties[bountyIndex].successCount += 1;
    
    // Save updated bounty
    localStorage.setItem("bounties", JSON.stringify(bounties));
    
    // In a real implementation, this would also:
    // 1. Transfer the reward to the referrer
    // 2. Record the referral in a database
    // 3. Emit events for analytics
    
    return bounties[bountyIndex];
  } catch (error) {
    console.error("Error recording successful referral:", error);
    return null;
  }
}

/**
 * Deploy a real bounty to the blockchain (would be used in production)
 * @param bountyId ID of the bounty to deploy
 * @param wallet Connected wallet
 * @returns Promise resolving to transaction result
 */
export async function deployBountyToBlockchain(bountyId: string, wallet: any): Promise<any> {
  try {
    // This function would interact with the blockchain to deploy the bounty contract
    // For now, it's a placeholder
    
    const bounty = await getBounty(bountyId);
    
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    console.log("Deploying bounty to blockchain:", bounty);
    
    // In a real implementation, this would:
    // 1. Create a Party for the bounty
    // 2. Fund the Party with the total budget
    // 3. Set up the reward distribution rules
    
    return {
      transactionHash: `0x${Math.random().toString(36).substring(2, 15)}`,
      blockNumber: Math.floor(Math.random() * 1000000)
    };
  } catch (error) {
    console.error("Error deploying bounty to blockchain:", error);
    throw new ProposalError({
      category: 'contract',
      message: 'Failed to deploy bounty to blockchain',
      recoverySteps: [
        'Check your wallet connection',
        'Ensure you have enough MATIC for gas fees',
        'Try again later'
      ]
    });
  }
}
