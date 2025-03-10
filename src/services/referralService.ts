
import { Wallet } from "ethers";
import { DynamicContext } from "@dynamic-labs/sdk-react-core";
import { uploadToIPFS } from "./ipfsService";
import { ReferralMetadata } from "@/utils/settlementConversion";

export type ReferralStatus = 'pending' | 'active' | 'completed' | 'expired' | 'claimed';

export interface Referral {
  id: string;
  name: string;
  description: string;
  type: string;
  referrer: string;
  rewardPercentage: number;
  referredAddress?: string;
  status: ReferralStatus;
  reward?: string;
  createdAt: number;
}

/**
 * Creates a referral pool
 * @param wallet User wallet
 * @param metadata Referral metadata
 * @returns Referral ID if successful, null otherwise
 */
export const createReferralPool = async (
  wallet: Wallet | DynamicContext['primaryWallet'],
  metadata: ReferralMetadata
): Promise<string | null> => {
  try {
    console.log("Creating referral pool with metadata:", metadata);
    
    // Upload metadata to IPFS
    const ipfsHash = await uploadToIPFS(metadata);
    if (!ipfsHash) {
      throw new Error("Failed to upload referral metadata to IPFS");
    }
    
    // Mock implementation for development
    const referralId = `referral-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log(`Created referral pool with ID: ${referralId}`);
    
    return referralId;
  } catch (error) {
    console.error("Error creating referral pool:", error);
    return null;
  }
};

/**
 * Submits a referral
 * @param wallet User wallet
 * @param referralId Referral ID
 * @param referredAddress Referred address
 * @returns Success status
 */
export const submitReferral = async (
  wallet: Wallet | DynamicContext['primaryWallet'],
  referralId: string,
  referredAddress: string
): Promise<boolean> => {
  try {
    console.log(`Submitting referral ${referralId} for address ${referredAddress}`);
    
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
  wallet: Wallet | DynamicContext['primaryWallet'],
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

/**
 * Gets referrals for a user
 * @param address User address
 * @returns Array of referrals
 */
export const getReferrals = async (address: string): Promise<Referral[]> => {
  try {
    console.log(`Getting referrals for address ${address}`);
    
    // Mock implementation for development
    const mockReferrals: Referral[] = [
      {
        id: "ref-001",
        name: "NFT Membership Referral",
        description: "Earn rewards for referring new members to purchase NFTs",
        type: "nft-membership",
        referrer: address,
        rewardPercentage: 10,
        status: 'active',
        createdAt: Date.now()
      }
    ];
    
    return mockReferrals;
  } catch (error) {
    console.error("Error getting referrals:", error);
    return [];
  }
};

/**
 * Gets referral status
 * @param referralId Referral ID
 * @returns Referral status
 */
export const getReferralStatus = async (referralId: string): Promise<ReferralStatus> => {
  try {
    console.log(`Getting status for referral ${referralId}`);
    
    // Mock implementation for development
    return 'active';
  } catch (error) {
    console.error("Error getting referral status:", error);
    return 'expired';
  }
};
