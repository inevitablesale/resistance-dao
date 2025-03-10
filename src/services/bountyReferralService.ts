
import { ethers } from "ethers";
import { Bounty, getBounty } from "./bountyService";
import { getActiveReferral, updateReferralWithPurchase } from "./referralService";
import { useToast } from "@/hooks/use-toast";

export interface BountyReferral {
  id: string;
  bountyId: string;
  referrerAddress: string;
  referredAddress: string;
  referralDate: number;
  status: "pending" | "completed" | "rejected";
  nftPurchased: boolean;
  purchaseDate?: number;
  paymentProcessed: boolean;
  paymentAmount?: number;
  paymentDate?: number;
  paymentTxHash?: string;
}

/**
 * Create a new bounty referral
 * @param bountyId ID of the bounty
 * @param referrerAddress Address of the referrer
 * @param referredAddress Address of the referred user
 * @returns Promise resolving to the created referral or null if failed
 */
export async function createBountyReferral(
  bountyId: string,
  referrerAddress: string,
  referredAddress: string
): Promise<BountyReferral | null> {
  try {
    // Get the bounty to check eligibility
    const bounty = await getBounty(bountyId);
    
    if (!bounty) {
      console.error("Bounty not found");
      return null;
    }
    
    // Check if bounty is active
    if (bounty.status !== "active") {
      console.error("Bounty is not active");
      return null;
    }
    
    // Check if user is eligible for the bounty (if there are eligibility requirements)
    const isEligible = await checkUserEligibility(referrerAddress, bounty);
    
    if (!isEligible) {
      console.error("Referrer is not eligible for this bounty");
      return null;
    }
    
    // Create the referral
    const referralId = `br-${Date.now().toString(36)}`;
    const now = Math.floor(Date.now() / 1000);
    
    const bountyReferral: BountyReferral = {
      id: referralId,
      bountyId,
      referrerAddress,
      referredAddress,
      referralDate: now,
      status: "pending",
      nftPurchased: false,
      paymentProcessed: false
    };
    
    // Store in localStorage for now (would be replaced with backend storage)
    const storedReferrals = localStorage.getItem("bountyReferrals") || "[]";
    const referrals = JSON.parse(storedReferrals);
    referrals.push(bountyReferral);
    localStorage.setItem("bountyReferrals", JSON.stringify(referrals));
    
    console.log("Bounty referral created:", bountyReferral);
    return bountyReferral;
  } catch (error) {
    console.error("Error creating bounty referral:", error);
    return null;
  }
}

/**
 * Check if a user is eligible to participate in a bounty
 * @param userAddress User's wallet address
 * @param bounty Bounty to check eligibility for
 * @returns True if eligible, false otherwise
 */
export async function checkUserEligibility(
  userAddress: string,
  bounty: Bounty
): Promise<boolean> {
  // If the bounty doesn't require specific NFTs, user is eligible
  if (!bounty.eligibleNFTs || bounty.eligibleNFTs.length === 0) {
    return true;
  }
  
  // TODO: For now, we'll just return true for demo purposes
  // In a real implementation, this would check if the user owns one of the required NFTs
  return true;
}

/**
 * Get all referrals for a specific bounty
 * @param bountyId ID of the bounty
 * @returns Promise resolving to array of referrals
 */
export async function getBountyReferrals(bountyId: string): Promise<BountyReferral[]> {
  try {
    const storedReferrals = localStorage.getItem("bountyReferrals") || "[]";
    const referrals = JSON.parse(storedReferrals);
    
    return referrals.filter((ref: BountyReferral) => ref.bountyId === bountyId);
  } catch (error) {
    console.error("Error fetching bounty referrals:", error);
    return [];
  }
}

/**
 * Get all referrals created by a specific referrer
 * @param referrerAddress Address of the referrer
 * @returns Promise resolving to array of referrals
 */
export async function getReferralsByReferrer(referrerAddress: string): Promise<BountyReferral[]> {
  try {
    const storedReferrals = localStorage.getItem("bountyReferrals") || "[]";
    const referrals = JSON.parse(storedReferrals);
    
    return referrals.filter((ref: BountyReferral) => ref.referrerAddress === referrerAddress);
  } catch (error) {
    console.error("Error fetching referrer's referrals:", error);
    return [];
  }
}

/**
 * Process a successful NFT purchase from a referral
 * @param referredAddress Address of the person who was referred and purchased an NFT
 * @param nftAddress Address of the NFT contract
 * @param tokenId ID of the purchased token
 * @returns True if processed successfully, false otherwise
 */
export async function processSuccessfulNFTPurchase(
  referredAddress: string,
  nftAddress: string,
  tokenId: string
): Promise<boolean> {
  try {
    // Get all bounty referrals
    const storedReferrals = localStorage.getItem("bountyReferrals") || "[]";
    const referrals: BountyReferral[] = JSON.parse(storedReferrals);
    
    // Find referrals for this user
    const userReferrals = referrals.filter(
      ref => ref.referredAddress === referredAddress && ref.status === "pending"
    );
    
    if (userReferrals.length === 0) {
      console.log("No pending referrals found for user:", referredAddress);
      return false;
    }
    
    let processed = false;
    
    // Process each pending referral
    for (const referral of userReferrals) {
      // Get the associated bounty
      const bounty = await getBounty(referral.bountyId);
      
      if (!bounty) {
        console.error("Bounty not found for referral:", referral.id);
        continue;
      }
      
      // Check if this NFT is eligible for the bounty
      const isEligibleNFT = !bounty.eligibleNFTs || 
                           bounty.eligibleNFTs.length === 0 || 
                           bounty.eligibleNFTs.includes(nftAddress);
      
      if (!isEligibleNFT) {
        console.log("NFT not eligible for this bounty:", nftAddress);
        continue;
      }
      
      // Update the referral with purchase information
      const now = Math.floor(Date.now() / 1000);
      referral.nftPurchased = true;
      referral.purchaseDate = now;
      referral.status = "completed";
      
      // Process payment to referrer
      const paymentResult = await processReferralPayment(referral, bounty);
      
      if (paymentResult) {
        processed = true;
      }
    }
    
    // Save updated referrals
    localStorage.setItem("bountyReferrals", JSON.stringify(referrals));
    
    return processed;
  } catch (error) {
    console.error("Error processing NFT purchase:", error);
    return false;
  }
}

/**
 * Process payment to referrer for successful referral
 * @param referral The successful referral
 * @param bounty The associated bounty
 * @returns True if payment processed successfully, false otherwise
 */
async function processReferralPayment(
  referral: BountyReferral,
  bounty: Bounty
): Promise<boolean> {
  try {
    // Check if bounty has enough budget
    if (bounty.remainingBudget < bounty.rewardAmount) {
      console.error("Insufficient bounty budget for payment");
      return false;
    }
    
    // Mock payment processing - in production this would interact with blockchain
    const now = Math.floor(Date.now() / 1000);
    const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Update referral with payment info
    referral.paymentProcessed = true;
    referral.paymentDate = now;
    referral.paymentAmount = bounty.rewardAmount;
    referral.paymentTxHash = mockTxHash;
    
    // Update bounty budget
    const storedBounties = localStorage.getItem("bounties") || "[]";
    const bounties = JSON.parse(storedBounties);
    const bountyIndex = bounties.findIndex((b: Bounty) => b.id === bounty.id);
    
    if (bountyIndex !== -1) {
      bounties[bountyIndex].usedBudget += bounty.rewardAmount;
      bounties[bountyIndex].remainingBudget -= bounty.rewardAmount;
      bounties[bountyIndex].successCount += 1;
      localStorage.setItem("bounties", JSON.stringify(bounties));
    }
    
    console.log("Processed payment for referral:", {
      referralId: referral.id,
      amount: bounty.rewardAmount,
      txHash: mockTxHash
    });
    
    return true;
  } catch (error) {
    console.error("Error processing referral payment:", error);
    return false;
  }
}

/**
 * Generate a referral link for a hunter to share
 * @param bountyId ID of the bounty
 * @param referrerAddress Address of the referrer
 * @returns Referral link
 */
export function generateReferralLink(bountyId: string, referrerAddress: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/r/${bountyId}/${referrerAddress}`;
}

/**
 * Parse a referral link to extract bounty ID and referrer address
 * @param referralLink The full referral link
 * @returns Object with bountyId and referrerAddress, or null if invalid
 */
export function parseReferralLink(referralLink: string): { bountyId: string; referrerAddress: string } | null {
  try {
    const url = new URL(referralLink);
    const pathParts = url.pathname.split('/');
    
    if (pathParts.length < 4 || pathParts[1] !== 'r') {
      return null;
    }
    
    return {
      bountyId: pathParts[2],
      referrerAddress: pathParts[3]
    };
  } catch (error) {
    console.error("Error parsing referral link:", error);
    return null;
  }
}
