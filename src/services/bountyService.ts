import { ethers } from "ethers";
import { generateHoldingAddress } from "./tokenService";
import { WalletType } from "@/hooks/useWalletProvider";

// Updated BountyStatus type to include "awaiting_tokens"
export type BountyStatus = "completed" | "active" | "paused" | "expired" | "awaiting_tokens";

export interface Bounty {
  id: string;
  creatorAddress: string;
  title: string;
  description: string;
  rewardAmount: number;
  rewardTokenAddress: string;
  criteria: string;
  createdDate: string;
  expirationDate: string;
  completedDate?: string;
  pausedDate?: string;
  resumedDate?: string;
  tokenVerificationStatus: "pending" | "verified" | "failed" | "awaiting";
  bountyHunterAddress?: string;
  submissionDetails?: string;
  submissionDate?: string;
  feedback?: string;
  rating?: number;
  payoutTransactionHash?: string;
  bountyHunterPayoutAddress?: string;
  holdingContractAddress?: string;
  securityLevel: "basic" | "multisig" | "timelock";
}

export interface BountyCreationParams {
  creatorAddress: string;
  title: string;
  description: string;
  rewardAmount: number;
  rewardTokenAddress: string;
  criteria: string;
  expirationDate: string;
  securityLevel: "basic" | "multisig" | "timelock";
}

/**
 * Get status of a bounty based on its data
 * @param bounty Bounty data object
 * @returns Current status of the bounty
 */
export function getBountyStatus(bounty: Bounty): BountyStatus {
  if (!bounty) return "expired";
  
  const now = Date.now();
  
  if (bounty.completedDate) {
    return "completed";
  }
  
  // Token verification pending
  if (bounty.tokenVerificationStatus === "awaiting") {
    return "awaiting_tokens";
  }
  
  if (bounty.pausedDate && !bounty.resumedDate) {
    return "paused";
  }
  
  if (bounty.expirationDate && new Date(bounty.expirationDate).getTime() < now) {
    return "expired";
  }
  
  return "active";
}

/**
 * Pauses a bounty
 * @param bountyId ID of the bounty to pause
 * @returns Promise resolving to boolean indicating success
 */
export async function pauseBounty(bountyId: string): Promise<boolean> {
  // Placeholder implementation
  console.log(`Pausing bounty with ID: ${bountyId}`);
  return true;
}

/**
 * Resumes a paused bounty
 * @param bountyId ID of the bounty to resume
 * @returns Promise resolving to boolean indicating success
 */
export async function resumeBounty(bountyId: string): Promise<boolean> {
  // Placeholder implementation
  console.log(`Resuming bounty with ID: ${bountyId}`);
  return true;
}

/**
 * Expires a bounty
 * @param bountyId ID of the bounty to expire
 * @returns Promise resolving to boolean indicating success
 */
export async function expireBounty(bountyId: string): Promise<boolean> {
  // Placeholder implementation
  console.log(`Expiring bounty with ID: ${bountyId}`);
  return true;
}

/**
 * Submits a solution to a bounty
 * @param bountyId ID of the bounty
 * @param submissionDetails Details of the submission
 * @param bountyHunterAddress Address of the bounty hunter
 * @returns Promise resolving to boolean indicating success
 */
export async function submitBountySolution(
  bountyId: string,
  submissionDetails: string,
  bountyHunterAddress: string
): Promise<boolean> {
  // Placeholder implementation
  console.log(`Submitting solution for bounty ${bountyId} by ${bountyHunterAddress}`);
  return true;
}

/**
 * Approves a bounty submission
 * @param bountyId ID of the bounty
 * @param feedback Feedback for the submission
 * @param rating Rating for the submission
 * @returns Promise resolving to boolean indicating success
 */
export async function approveBountySubmission(
  bountyId: string,
  feedback: string,
  rating: number
): Promise<boolean> {
  // Placeholder implementation
  console.log(`Approving submission for bounty ${bountyId} with rating ${rating}`);
  return true;
}

/**
 * Rejects a bounty submission
 * @param bountyId ID of the bounty
 * @param feedback Feedback for the submission
 * @returns Promise resolving to boolean indicating success
 */
export async function rejectBountySubmission(
  bountyId: string,
  feedback: string
): Promise<boolean> {
  // Placeholder implementation
  console.log(`Rejecting submission for bounty ${bountyId} with feedback: ${feedback}`);
  return true;
}

/**
 * Pays out the bounty reward to the bounty hunter
 * @param bountyId ID of the bounty
 * @param payoutTransactionHash Transaction hash of the payout
 * @returns Promise resolving to boolean indicating success
 */
export async function payoutBounty(bountyId: string, payoutTransactionHash: string): Promise<boolean> {
  // Placeholder implementation
  console.log(`Paying out bounty ${bountyId} with transaction hash: ${payoutTransactionHash}`);
  return true;
}

/**
 * Creates a bounty with given parameters and stores it in database
 * @param bountyData Bounty creation parameters
 * @param provider Ethereum provider with signer
 * @returns Promise resolving to created bounty ID
 */
export async function createBounty(
  bountyData: BountyCreationParams,
  provider: ethers.providers.Web3Provider // Changed from Provider to Web3Provider
): Promise<string> {
  try {
    // Ensure we have a signer (this is now type-safe with Web3Provider)
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    // Generate a unique bounty ID (placeholder)
    const bountyId = `BOUNTY-${Date.now()}`;
    
    // Generate holding contract address
    const holdingContractAddress = await generateHoldingAddress(provider, signerAddress, bountyId);
    
    // Placeholder logic to store bounty in database
    console.log("Storing bounty in database:", {
      ...bountyData,
      id: bountyId,
      creatorAddress: signerAddress,
      createdDate: new Date().toISOString(),
      tokenVerificationStatus: "pending",
      holdingContractAddress
    });
    
    return bountyId;
  } catch (error) {
    console.error("Error creating bounty:", error);
    throw error;
  }
}

/**
 * Updates bounty information
 * @param bountyId ID of the bounty to update
 * @param updates Object with the updates
 * @returns Promise resolving to boolean indicating success
 */
export async function updateBounty(
  bountyId: string,
  updates: Partial<Bounty>
): Promise<boolean> {
  // Placeholder implementation
  console.log(`Updating bounty with ID: ${bountyId}`, updates);
  return true;
}

/**
 * Gets a bounty by its ID
 * @param bountyId ID of the bounty to retrieve
 * @returns Promise resolving to the bounty object or null if not found
 */
export async function getBounty(bountyId: string): Promise<Bounty | null> {
  // Placeholder implementation
  console.log(`Getting bounty with ID: ${bountyId}`);
  return {
    id: bountyId,
    creatorAddress: "0x...",
    title: "Sample Bounty",
    description: "This is a sample bounty.",
    rewardAmount: 100,
    rewardTokenAddress: "0x...",
    criteria: "Fulfill the requirements.",
    createdDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    tokenVerificationStatus: "verified",
    securityLevel: "basic"
  };
}

/**
 * Lists all bounties
 * @returns Promise resolving to an array of bounty objects
 */
export async function listBounties(): Promise<Bounty[]> {
  // Placeholder implementation
  console.log("Listing all bounties");
  return [
    {
      id: "1",
      creatorAddress: "0x...",
      title: "Sample Bounty 1",
      description: "This is a sample bounty.",
      rewardAmount: 100,
      rewardTokenAddress: "0x...",
      criteria: "Fulfill the requirements.",
      createdDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      tokenVerificationStatus: "verified",
      securityLevel: "basic"
    },
    {
      id: "2",
      creatorAddress: "0x...",
      title: "Sample Bounty 2",
      description: "This is another sample bounty.",
      rewardAmount: 200,
      rewardTokenAddress: "0x...",
      criteria: "Complete the task.",
      createdDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      tokenVerificationStatus: "verified",
      securityLevel: "basic"
    },
  ];
}

/**
 * Verifies and approves token funding for a bounty
 * @param bountyId ID of the bounty to verify funding for
 * @param provider Ethereum provider with signer
 * @returns Promise resolving to verification result
 */
export async function verifyBountyFunding(
  bountyId: string,
  provider: ethers.providers.Web3Provider // Changed from Provider to Web3Provider
): Promise<{
  verified: boolean;
  status: BountyStatus;
  message: string;
}> {
  try {
    // Placeholder logic to verify token transfer
    console.log(`Verifying token transfer for bounty ${bountyId}`);
    
    // Simulate successful verification
    const isTransferVerified = true;
    
    if (isTransferVerified) {
      // Update bounty status to verified
      console.log(`Token transfer verified for bounty ${bountyId}`);
      return {
        verified: true,
        status: "active",
        message: "Token transfer verified successfully"
      };
    } else {
      // Update bounty status to failed
      console.log(`Token transfer verification failed for bounty ${bountyId}`);
      return {
        verified: false,
        status: "awaiting_tokens", // Now valid with updated type
        message: "Token transfer verification failed"
      };
    }
  } catch (error) {
    console.error("Error verifying bounty funding:", error);
    return {
      verified: false,
      status: "awaiting_tokens", // Now valid with updated type
      message: "Failed to verify token transfer"
    };
  }
}
