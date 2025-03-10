
import { ethers } from "ethers";
import { createBountyParty } from "./partyProtocolService";
import { uploadToIPFS } from "./ipfsService";

// Define the Bounty interface
export interface Bounty {
  id: string;
  name: string;
  description: string;
  creatorAddress: string;
  rewardAmount: number;
  totalBudget: number;
  usedBudget: number;
  startDate: number;
  expiresAt: number;
  successCriteria: string;
  status: "draft" | "active" | "paused" | "expired";
  successCount: number;
  partyAddress?: string;
  maxParticipants: number;
  requiresVerification: boolean;
}

// In-memory storage for demo purposes - in production, this would use an actual database
let bounties: Bounty[] = [];

/**
 * Creates a new bounty
 * @param bountyData The bounty data
 * @returns The created bounty
 */
export async function createBounty(bountyData: Omit<Bounty, "id">): Promise<Bounty> {
  const id = `bounty-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  const newBounty: Bounty = {
    id,
    ...bountyData
  };
  
  bounties.push(newBounty);
  console.log("Created bounty:", newBounty);
  
  return newBounty;
}

/**
 * Gets all bounties
 * @returns Array of all bounties
 */
export async function getBounties(): Promise<Bounty[]> {
  return bounties;
}

/**
 * Gets a specific bounty by ID
 * @param id The bounty ID
 * @returns The bounty if found, null otherwise
 */
export async function getBounty(id: string): Promise<Bounty | null> {
  const bounty = bounties.find(b => b.id === id);
  return bounty || null;
}

/**
 * Updates a bounty
 * @param id The bounty ID
 * @param updates Updates to apply
 * @returns The updated bounty
 */
export async function updateBounty(id: string, updates: Partial<Bounty>): Promise<Bounty | null> {
  const index = bounties.findIndex(b => b.id === id);
  
  if (index === -1) {
    return null;
  }
  
  bounties[index] = {
    ...bounties[index],
    ...updates
  };
  
  return bounties[index];
}

/**
 * Deletes a bounty
 * @param id The bounty ID
 * @returns True if successful, false otherwise
 */
export async function deleteBounty(id: string): Promise<boolean> {
  const index = bounties.findIndex(b => b.id === id);
  
  if (index === -1) {
    return false;
  }
  
  bounties.splice(index, 1);
  return true;
}

/**
 * Deploys a bounty to the blockchain
 * @param id The bounty ID
 * @param wallet The wallet to use for deployment
 * @returns The contract deployment details
 */
export async function deployBountyToBlockchain(
  id: string,
  wallet: any
): Promise<{ partyAddress: string; success: boolean }> {
  const bounty = await getBounty(id);
  
  if (!bounty) {
    throw new Error("Bounty not found");
  }
  
  if (bounty.partyAddress) {
    throw new Error("Bounty already deployed");
  }
  
  console.log("Deploying bounty to blockchain:", bounty);
  
  try {
    // Prepare metadata
    const metadata = {
      name: bounty.name,
      description: bounty.description,
      rewardAmount: bounty.rewardAmount,
      totalBudget: bounty.totalBudget,
      expiration: bounty.expiresAt,
      successCriteria: bounty.successCriteria,
      creatorAddress: bounty.creatorAddress,
      createdAt: Math.floor(Date.now() / 1000)
    };
    
    // Upload metadata to IPFS (you'd need to implement this function)
    const metadataURI = await uploadToIPFS(metadata);
    
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    // Calculate start and end times
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = bounty.expiresAt;
    
    // Create the bounty party contract
    const partyAddress = await createBountyParty(wallet, {
      name: bounty.name,
      hosts: [signerAddress],
      votingDuration: 3600 * 24 * 2, // 2 days
      executionDelay: 3600 * 24, // 1 day
      passThresholdBps: 5000, // 50%
      allowPublicProposals: false,
      metadataURI,
      rewardAmount: bounty.rewardAmount,
      maxParticipants: bounty.maxParticipants,
      startTime,
      endTime,
      verificationRequired: bounty.requiresVerification,
      targetRequirements: [bounty.successCriteria]
    });
    
    // Update the bounty with the contract address
    await updateBounty(id, { 
      partyAddress,
      status: "active" 
    });
    
    console.log("Bounty deployed successfully:", partyAddress);
    
    return {
      partyAddress,
      success: true
    };
  } catch (error) {
    console.error("Error deploying bounty:", error);
    throw error;
  }
}

/**
 * Records a successful referral for a bounty
 * @param bountyId The bounty ID
 * @param referrerAddress The address of the referrer
 * @param refereeAddress The address of the referee
 * @returns The updated bounty
 */
export async function recordReferralSuccess(
  bountyId: string,
  referrerAddress: string,
  refereeAddress: string
): Promise<Bounty | null> {
  const bounty = await getBounty(bountyId);
  
  if (!bounty) {
    throw new Error("Bounty not found");
  }
  
  if (bounty.status !== "active") {
    throw new Error("Bounty is not active");
  }
  
  if (bounty.usedBudget + bounty.rewardAmount > bounty.totalBudget) {
    throw new Error("Bounty budget exceeded");
  }
  
  // Update the bounty stats
  const updatedBounty = await updateBounty(bountyId, {
    usedBudget: bounty.usedBudget + bounty.rewardAmount,
    successCount: bounty.successCount + 1
  });
  
  // In a real system, you would also:
  // 1. Record the referral in the database
  // 2. Send a reward to the referrer
  // 3. Emit blockchain events
  
  return updatedBounty;
}

/**
 * Gets referrals for a specific bounty
 * @param bountyId The bounty ID
 * @returns Array of referrals
 */
export async function getBountyReferrals(bountyId: string): Promise<any[]> {
  // In a real system, this would fetch referrals from the database
  // For now, return an empty array
  return [];
}

/**
 * Pauses a bounty
 * @param id The bounty ID
 * @returns The updated bounty
 */
export async function pauseBounty(id: string): Promise<Bounty | null> {
  return updateBounty(id, { status: "paused" });
}

/**
 * Activates a paused bounty
 * @param id The bounty ID
 * @returns The updated bounty
 */
export async function activateBounty(id: string): Promise<Bounty | null> {
  return updateBounty(id, { status: "active" });
}
