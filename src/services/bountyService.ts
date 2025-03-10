
import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction, TransactionConfig } from "./transactionManager";
import { createParty, PartyOptions, createEthCrowdfund, CrowdfundOptions } from "./partyProtocolService";
import { toast } from "@/hooks/use-toast";
import * as supabaseClient from "./supabaseClient"; // Import all functions from supabaseClient

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
  eligibleNFTs?: string[];
}

/**
 * Creates a new bounty using Party Protocol
 * @param options Bounty creation options
 * @returns Promise resolving to the bounty object
 */
export async function createBounty(options: BountyOptions): Promise<Bounty | null> {
  try {
    console.log("Creating bounty with options:", options);
    
    // Create the bounty object
    const bountyId = `b-${Date.now().toString(36)}`;
    const now = Math.floor(Date.now() / 1000);
    
    // Create the bounty object
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
    
    // Store in supabase or localStorage fallback
    const createdBounty = await supabaseClient.createBounty(bounty);
    
    if (!createdBounty) {
      throw new Error("Failed to create bounty");
    }
    
    console.log("Bounty created successfully:", createdBounty);
    return createdBounty as Bounty;
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
    return await supabaseClient.getBounties(status);
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
    return await supabaseClient.getBounty(bountyId);
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
    // Get current bounty
    const bounty = await supabaseClient.getBounty(bountyId);
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    // Update status
    const updatedBounty = {
      ...bounty,
      status
    };
    
    // Save updated bounty
    await supabaseClient.createBounty(updatedBounty);
    
    return updatedBounty;
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
    // Get the current bounty
    const bounty = await supabaseClient.getBounty(bountyId);
    
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    // Check if there's enough budget
    if (bounty.remainingBudget < bounty.rewardAmount) {
      throw new Error("Insufficient bounty budget");
    }
    
    // Update the bounty
    const updatedBounty = {
      ...bounty,
      usedBudget: bounty.usedBudget + bounty.rewardAmount,
      remainingBudget: bounty.remainingBudget - bounty.rewardAmount,
      successCount: bounty.successCount + 1
    };
    
    // Save the updated bounty
    await supabaseClient.createBounty(updatedBounty);
    
    // Create the referral
    const referralDate = new Date().toISOString();
    await supabaseClient.createReferral({
      bounty_id: bountyId,
      referrer_address: referrerAddress,
      referred_address: referredAddress,
      referral_date: referralDate,
      status: 'pending',
      reward_amount: bounty.rewardAmount
    });
    
    return updatedBounty;
  } catch (error) {
    console.error("Error recording successful referral:", error);
    return null;
  }
}
