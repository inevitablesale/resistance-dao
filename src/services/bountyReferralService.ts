
import { recordSuccessfulReferral, getBounty } from './bountyService';
import { getActiveReferral, ReferralInfo } from './referralService';
import { ethers } from 'ethers';

interface BountyReferralParams {
  bountyId: string;
  referrerAddress: string;
  referredAddress: string;
  nftContractAddress: string;
  tokenId: string;
  transactionHash: string;
}

/**
 * Process a referral reward for an NFT purchase if it meets bounty criteria
 * @param params Parameters for the bounty referral
 * @returns Success status and updated bounty if successful
 */
export async function processBountyReferral(params: BountyReferralParams): Promise<{
  success: boolean;
  bounty?: any;
  error?: string;
}> {
  try {
    console.log("Processing bounty referral:", params);
    
    // Check if bounty exists and is active
    const bounty = await getBounty(params.bountyId);
    
    if (!bounty) {
      return { success: false, error: "Bounty not found" };
    }
    
    if (bounty.status !== "active") {
      return { success: false, error: `Bounty is ${bounty.status}, not active` };
    }
    
    // Check if there's enough budget remaining
    if (bounty.remainingBudget < bounty.rewardAmount) {
      return { success: false, error: "Insufficient bounty budget" };
    }
    
    // Check if NFT contract is eligible for this bounty
    const isEligibleNFT = bounty.eligibleNFTs?.some((addr: string) => 
      addr.toLowerCase() === params.nftContractAddress.toLowerCase()
    );
    
    if (!isEligibleNFT) {
      return { success: false, error: "NFT contract not eligible for this bounty" };
    }
    
    // Record the successful referral
    const updatedBounty = await recordSuccessfulReferral(
      params.bountyId,
      params.referrerAddress,
      params.referredAddress
    );
    
    if (!updatedBounty) {
      return { success: false, error: "Failed to record successful referral" };
    }
    
    console.log("Bounty referral processed successfully");
    return { success: true, bounty: updatedBounty };
  } catch (error: any) {
    console.error("Error processing bounty referral:", error);
    return { success: false, error: error.message || "Unknown error processing referral" };
  }
}

/**
 * Connect NFT purchase events to bounty referrals
 * @param purchaseEvent NFT purchase event from the chain
 * @returns Processing result
 */
export async function connectNFTPurchaseToBounty(purchaseEvent: {
  buyer: string;
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
}): Promise<{
  success: boolean;
  bountyId?: string;
  referrerAddress?: string;
  error?: string;
}> {
  try {
    // Check if buyer has an active referral
    const referral = await getActiveReferral(purchaseEvent.buyer);
    
    if (!referral) {
      return { success: false, error: "No active referral found for buyer" };
    }
    
    // For now, just use a mock bounty ID
    // In a real implementation, the bounty ID would be part of the referral data
    const bountyId = localStorage.getItem('active_bounty_id') || '';
    
    if (!bountyId) {
      return { success: false, error: "No active bounty ID found" };
    }
    
    // Process the referral reward
    const result = await processBountyReferral({
      bountyId,
      referrerAddress: referral.referrerAddress,
      referredAddress: purchaseEvent.buyer,
      nftContractAddress: purchaseEvent.contractAddress,
      tokenId: purchaseEvent.tokenId,
      transactionHash: purchaseEvent.transactionHash
    });
    
    if (result.success) {
      return { 
        success: true, 
        bountyId, 
        referrerAddress: referral.referrerAddress 
      };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error: any) {
    console.error("Error connecting NFT purchase to bounty:", error);
    return { success: false, error: error.message || "Unknown error connecting purchase to bounty" };
  }
}

/**
 * Check if a referrer is eligible for bounty rewards
 * @param referrerAddress Address of the potential referrer
 * @returns Eligibility status and active bounties
 */
export async function checkReferrerEligibility(referrerAddress: string): Promise<{
  isEligible: boolean;
  activeBounties: any[];
  error?: string;
}> {
  try {
    // This would check if the referrer is registered for any active bounties
    // For now, we'll just return a mock response
    
    return {
      isEligible: true,
      activeBounties: [{
        id: 'mock-bounty-1',
        name: 'NFT Referral Program',
        rewardAmount: 20
      }]
    };
  } catch (error: any) {
    console.error("Error checking referrer eligibility:", error);
    return { 
      isEligible: false, 
      activeBounties: [],
      error: error.message || "Unknown error checking eligibility" 
    };
  }
}
