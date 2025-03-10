
import { ethers } from "ethers";
import { uploadToIPFS } from "./ipfsService";
import { IPFSContent } from "@/types/content";
import { ProposalMetadata } from "@/types/proposals";

// Import the correct types from the job types file
import { JobMetadata, JobStatus, mapJobStatusToProposalStatus } from "@/types/jobs";

export interface ReferralMetadata {
  type: string;
  referralCode: string;
  referrerAddress: string;
  refereeAddress?: string;
  createdAt: number;
  claimedAt?: number;
  reward?: string;
  jobId?: string;
  status: 'active' | 'claimed' | 'expired';
  [key: string]: any;
}

// Mock referrals data
const mockReferrals: ReferralMetadata[] = [
  {
    type: "job",
    referralCode: "JOB1-REF123",
    referrerAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    reward: "0.05 ETH",
    jobId: "job-1",
    status: 'active',
  },
  {
    type: "job",
    referralCode: "JOB2-REF456",
    referrerAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
    reward: "0.03 ETH",
    jobId: "job-2",
    status: 'active',
  }
];

// Get referrals for a user
export const getReferrals = async (address: string): Promise<ReferralMetadata[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockReferrals.filter(ref => ref.referrerAddress === address);
};

// Create a referral code for a job
export const createJobReferral = async (
  wallet: any,
  jobId: string,
  jobReward: string
): Promise<string> => {
  try {
    const address = await wallet.getAddress();
    
    // Calculate referral reward (10% of job reward)
    const referralPercentage = 0.1;
    const referralRewardValue = parseFloat(jobReward) * referralPercentage;
    const referralReward = `${referralRewardValue} ETH`;
    
    // Generate a unique referral code
    const referralCode = `${jobId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Create referral metadata
    const referral: ReferralMetadata = {
      type: "job",
      referralCode,
      referrerAddress: address,
      createdAt: Date.now(),
      reward: referralReward,
      jobId,
      status: 'active',
    };
    
    // Add to mock data
    mockReferrals.push(referral);
    
    return referralCode;
  } catch (error) {
    console.error("Error creating job referral:", error);
    throw error;
  }
};

// Check if a referral code is valid
export const validateReferralCode = async (referralCode: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const referral = mockReferrals.find(ref => ref.referralCode === referralCode);
  return !!referral && referral.status === 'active';
};

// Claim a referral
export const claimReferral = async (
  wallet: any,
  referralCode: string
): Promise<boolean> => {
  try {
    const address = await wallet.getAddress();
    
    const referral = mockReferrals.find(ref => ref.referralCode === referralCode);
    if (!referral || referral.status !== 'active') {
      return false;
    }
    
    // Update referral data
    referral.refereeAddress = address;
    referral.claimedAt = Date.now();
    referral.status = 'claimed';
    
    return true;
  } catch (error) {
    console.error("Error claiming referral:", error);
    return false;
  }
};

// Upload referral data to IPFS
export const uploadReferralToIPFS = async (
  referralMetadata: ReferralMetadata,
  jobMetadata?: JobMetadata
): Promise<string> => {
  try {
    // Calculate referral reward if it's a job referral
    let referralReward = referralMetadata.reward;
    if (jobMetadata && jobMetadata.reward) {
      // Default to 10% if not specified
      const referralPercentage = 0.1;
      const jobRewardValue = parseFloat(jobMetadata.reward);
      const referralRewardValue = jobRewardValue * referralPercentage;
      referralReward = `${referralRewardValue} ETH`;
    }
    
    // Create IPFS content structure
    const content: IPFSContent = {
      contentSchema: "referral-v1",
      contentType: "referral",
      title: `Referral: ${referralMetadata.referralCode}`,
      content: "Referral data",
      metadata: {
        ...referralMetadata,
        reward: referralReward,
      },
    };
    
    // Upload to IPFS
    const ipfsHash = await uploadToIPFS(content);
    return ipfsHash;
  } catch (error) {
    console.error("Error uploading referral to IPFS:", error);
    throw error;
  }
};

// Update useReferrals hook to fix the argument mismatch
export const processReferralCreation = async (
  wallet: any,
  jobId: string,
  jobReward: string,
  jobTitle: string,
  referralPercentage: number
): Promise<string> => {
  try {
    const address = await wallet.getAddress();
    
    // Generate a unique referral code
    const referralCode = `${jobId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Calculate referral reward
    const referralRewardValue = parseFloat(jobReward) * referralPercentage;
    const referralReward = `${referralRewardValue} ETH`;
    
    // Create referral metadata
    const referral: ReferralMetadata = {
      type: "job",
      referralCode,
      referrerAddress: address,
      createdAt: Date.now(),
      reward: referralReward,
      jobId,
      status: 'active',
    };
    
    // Add to mock data
    mockReferrals.push(referral);
    
    return referralCode;
  } catch (error) {
    console.error("Error processing referral creation:", error);
    throw error;
  }
};
