
import { Wallet } from "ethers";
import { uploadToIPFS } from "./ipfsService";
import { ReferralMetadata } from "@/utils/settlementConversion";

// Define export type for Referral status
export type ReferralStatus = 'active' | 'pending' | 'completed' | 'expired';

// Define the Referral type
export interface Referral {
  id: string;
  type: string;
  name: string;
  description: string;
  referrer: string;
  referredUsers: string[];
  rewardPercentage: number;
  rewards: number;
  createdAt: number;
  status: ReferralStatus; // Added status property
}

/**
 * Creates a new referral
 * @param wallet User wallet
 * @param type Referral type
 * @param name Referral name
 * @param description Referral description
 * @param rewardPercentage Reward percentage
 * @returns Referral ID if successful, null otherwise
 */
export const createReferral = async (
  wallet: Wallet,
  type: string,
  name: string,
  description: string,
  rewardPercentage: number
): Promise<string | null> => {
  try {
    console.log(`Creating ${type} referral: ${name}`);
    
    // Create referral metadata
    const metadata: ReferralMetadata = {
      title: name, // Required for ProposalMetadata
      name,
      description,
      type,
      referrer: wallet.address || "",
      rewardPercentage,
      createdAt: Math.floor(Date.now() / 1000),
      votingDuration: 86400 * 3, // 3 days in seconds
      linkedInURL: "" // Required field for ProposalMetadata
    };
    
    // Upload metadata to IPFS
    const ipfsHash = await uploadToIPFS(metadata);
    if (!ipfsHash) {
      throw new Error("Failed to upload referral metadata to IPFS");
    }
    
    // Mock implementation for development
    const referralId = `ref-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log(`Created referral with ID: ${referralId}`);
    
    return referralId;
  } catch (error) {
    console.error("Error creating referral:", error);
    return null;
  }
};

/**
 * Get referrals for a user
 * @param userAddress User address
 * @returns Array of referrals
 */
export const getReferrals = async (userAddress: string): Promise<Referral[]> => {
  try {
    console.log(`Getting referrals for user ${userAddress}`);
    
    // Mock implementation for development
    return [
      {
        id: `ref-${Date.now()}-1`,
        type: "nft-membership",
        name: "Sentinel Referral",
        description: "Earn rewards by referring new Sentinel NFT holders",
        referrer: userAddress,
        referredUsers: [],
        rewardPercentage: 5,
        rewards: 0,
        createdAt: Math.floor(Date.now() / 1000) - 86400,
        status: 'active'
      }
    ];
  } catch (error) {
    console.error("Error getting referrals:", error);
    return [];
  }
};

/**
 * Submits a new referral for a user
 * @param wallet User wallet
 * @param referralId Referral ID
 * @param referredAddress Address of the referred user
 * @returns Success status
 */
export const submitReferral = async (
  wallet: Wallet,
  referralId: string,
  referredAddress: string
): Promise<boolean> => {
  try {
    console.log(`Submitting referral ${referralId} for user ${referredAddress}`);
    
    // Mock implementation for development
    return true;
  } catch (error) {
    console.error("Error submitting referral:", error);
    return false;
  }
};

/**
 * Claims a referral reward
 * @param wallet User wallet
 * @param referralId Referral ID
 * @returns Success status
 */
export const claimReferralReward = async (
  wallet: Wallet,
  referralId: string
): Promise<boolean> => {
  try {
    console.log(`Claiming reward for referral ${referralId}`);
    
    // Mock implementation for development
    return true;
  } catch (error) {
    console.error("Error claiming referral reward:", error);
    return false;
  }
};
