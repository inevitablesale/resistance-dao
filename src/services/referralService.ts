import { Wallet } from "ethers";
import { uploadToIPFS } from "./ipfsService";
import { ReferralMetadata } from "@/utils/settlementConversion";
import { NFTClass } from "./alchemyService";
import { 
  submitJobReferral, 
  calculateReferralReward,
  getBountyHunterTierMultiplier,
  updateBountyHunterReferralStats
} from "./jobService";
import { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { ProposalMetadata, IPFSContent } from "@/types/proposals";

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
  status: ReferralStatus;
  // Party Protocol specific fields
  partyAddress?: string;
  proposalId?: string;
}

// Define a type that accepts either ethers.Wallet or Dynamic SDK wallet
export type WalletLike = Wallet | {
  address?: string;
  isConnected?: () => Promise<boolean> | boolean;
  getWalletClient?: () => Promise<any>;
  disconnect?: () => Promise<void>;
  connector?: {
    name?: string;
    chainId?: number;
    showWallet?: (options: any) => void;
    openWallet?: (options: any) => void;
  };
};

/**
 * Creates a new referral using Party Protocol
 */
export const createReferral = async (
  wallet: WalletLike,
  type: string,
  name: string,
  description: string,
  rewardPercentage: number
): Promise<string | null> => {
  try {
    console.log(`Creating ${type} referral: ${name}`);
    
    // Create referral metadata that matches ProposalMetadata requirements
    const metadata: ReferralMetadata = {
      name,
      description,
      rewardPercentage,
      title: name, // Required for ProposalMetadata
      votingDuration: 86400 * 3, // 3 days in seconds
      linkedInURL: "", // Required field for ProposalMetadata
      type, // Add type property that we added to ReferralMetadata
      referrer: typeof wallet === 'object' && 'address' in wallet ? wallet.address || "" : "",
      createdAt: Math.floor(Date.now() / 1000)
    };
    
    // Cast to ProposalMetadata to fix the type error
    const ipfsHash = await uploadToIPFS(metadata as unknown as ProposalMetadata);
    if (!ipfsHash) {
      throw new Error("Failed to upload referral metadata to IPFS");
    }
    
    // Generate referral ID
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
 * @param userRole User's NFT class/role
 * @returns Array of referrals
 */
export const getReferrals = async (
  userAddress: string,
  userRole: NFTClass = 'Unknown'
): Promise<Referral[]> => {
  try {
    console.log(`Getting referrals for user ${userAddress} with role ${userRole}`);
    
    // Only Bounty Hunters should have active referrals
    if (userRole !== 'Bounty Hunter') {
      return [];
    }
    
    // Mock implementation for development
    // In a real implementation, this would query the user's Bounty Hunter NFT
    // and extract the referrals from bounty_data.referral_system.active_referrals
    
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
      },
      {
        id: `ref-${Date.now()}-2`,
        type: "job-posting",
        name: "Settlement Builder Job",
        description: "Refer qualified candidates for settlement building positions",
        referrer: userAddress,
        referredUsers: [],
        rewardPercentage: 10,
        rewards: 0,
        createdAt: Math.floor(Date.now() / 1000) - 172800,
        status: 'active'
      }
    ];
  } catch (error) {
    console.error("Error getting referrals:", error);
    return [];
  }
};

/**
 * Submits a new job referral using Party Protocol
 * @param wallet User wallet
 * @param jobId Job ID
 * @param partyAddress Party address for the job
 * @param referredAddress Address of the referred user
 * @returns Success status
 */
export const submitReferral = async (
  wallet: WalletLike,
  jobId: string,
  partyAddress: string,
  referredAddress: string
): Promise<boolean> => {
  try {
    console.log(`Submitting referral ${jobId} for user ${referredAddress}`);
    
    if (!('getWalletClient' in wallet)) {
      throw new Error("Wallet must be a Dynamic SDK wallet to submit a Party Protocol referral");
    }
    
    // Get the referrer's address
    let referrerAddress = "";
    if (typeof wallet === 'object' && 'address' in wallet) {
      referrerAddress = wallet.address || "";
    } else if ('getWalletClient' in wallet) {
      const walletClient = await wallet.getWalletClient();
      if (walletClient && walletClient.getAddress) {
        referrerAddress = await walletClient.getAddress();
      }
    }
    
    if (!referrerAddress) {
      throw new Error("Could not determine referrer address");
    }
    
    // Get the referrer's tier multiplier (based on Bounty Hunter NFT metadata)
    const tierMultiplier = await getBountyHunterTierMultiplier(referrerAddress);
    
    // Calculate the referral reward
    const referralReward = calculateReferralReward(
      jobReward,
      tierMultiplier,
      referralPercentage
    );
    
    console.log(`Calculated referral reward: ${referralReward} ETH (${tierMultiplier}x multiplier)`);
    
    // Submit the referral through the job service
    const result = await submitJobReferral(
      wallet,
      jobId,
      partyAddress,
      referredAddress
    );
    
    if (result) {
      // Update the Bounty Hunter's referral stats
      // This would normally be handled by the smart contract, but we're doing it here
      // for the mock implementation
      await updateBountyHunterReferralStats(
        referrerAddress,
        {
          referralId: `ref-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          jobId,
          applicantAddress: referredAddress,
          applicantClass: 'Unknown', // Would need to query the applicant's NFT
          rewardAmount: referralReward
        }
      );
    }
    
    return result;
  } catch (error) {
    console.error("Error submitting referral:", error);
    return false;
  }
};

/**
 * Claims a referral reward using Party Protocol
 * @param wallet User wallet
 * @param referralId Referral ID
 * @param partyAddress Party address
 * @param proposalId Proposal ID for the accepted referral
 * @returns Success status
 */
export const claimReferralReward = async (
  wallet: WalletLike,
  referralId: string,
  partyAddress: string,
  proposalId: string
): Promise<boolean> => {
  try {
    console.log(`Claiming reward for referral ${referralId}`);
    
    if (!('getWalletClient' in wallet)) {
      throw new Error("Wallet must be a Dynamic SDK wallet to claim a Party Protocol referral reward");
    }
    
    // In a real implementation, this would create a proposal to distribute
    // the referral reward from the party to the referrer
    // For now, we'll just return success
    
    return true;
  } catch (error) {
    console.error("Error claiming referral reward:", error);
    return false;
  }
};

/**
 * Gets the tier information for a Bounty Hunter
 * @param bountyHunterAddress Address of the Bounty Hunter NFT holder
 * @returns Tier information
 */
export const getBountyHunterTier = async (
  bountyHunterAddress: string
): Promise<{
  currentTier: string;
  totalReferrals: number;
  tierMultiplier: number;
  nextTierThreshold: number;
}> => {
  try {
    // This would normally query the Bounty Hunter NFT metadata
    // For now we'll return mock data
    return {
      currentTier: "Initiate",
      totalReferrals: 0,
      tierMultiplier: 1.0,
      nextTierThreshold: 5
    };
  } catch (error) {
    console.error("Error getting Bounty Hunter tier:", error);
    return {
      currentTier: "Unknown",
      totalReferrals: 0,
      tierMultiplier: 1.0,
      nextTierThreshold: 999
    };
  }
};

/**
 * Gets the referral statistics for a Bounty Hunter
 * @param bountyHunterAddress Address of the Bounty Hunter NFT holder
 * @returns Referral statistics
 */
export const getReferralStats = async (
  bountyHunterAddress: string
): Promise<{
  sentinelReferrals: number;
  survivorReferrals: number;
  hunterReferrals: number;
  totalEarnings: number;
}> => {
  try {
    // This would normally query the Bounty Hunter NFT metadata
    // For now we'll return mock data
    return {
      sentinelReferrals: 0,
      survivorReferrals: 0,
      hunterReferrals: 0,
      totalEarnings: 0
    };
  } catch (error) {
    console.error("Error getting referral stats:", error);
    return {
      sentinelReferrals: 0,
      survivorReferrals: 0,
      hunterReferrals: 0,
      totalEarnings: 0
    };
  }
};
