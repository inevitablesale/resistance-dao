
import { Wallet } from "ethers";
import { DynamicContext } from "@dynamic-labs/sdk-react-core";
import { uploadToIPFS } from "./ipfsService";
import { JobMetadata } from "@/utils/settlementConversion";
import { NFTClass } from "./alchemyService";

// Properly define JobCategory as an enum or string literal type
export type JobCategory = 
  | 'settlement-building' 
  | 'resource-gathering' 
  | 'security' 
  | 'technology' 
  | 'governance' 
  | 'scouting' 
  | 'trading'
  | 'protocol-development' 
  | 'waste-management'
  | 'other';

// Define necessary interfaces
export interface JobListing {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  reward: string;
  deadline: number;
  creator: string;
  creatorRole: NFTClass;
  requiredRole: NFTClass;
  status: 'open' | 'filled' | 'closed' | 'expired';
  maxApplicants: number;
  referralReward: string;
  settlementId: string;
  createdAt: number;
  applications?: JobApplication[];
}

export interface JobApplication {
  id: string;
  jobId: string; 
  applicant: string;
  applicantRole: NFTClass;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: number;
}

export interface JobReferral {
  id: string;
  jobId: string;
  referrer: string;
  referredUser: string;
  status: 'pending' | 'accepted' | 'rejected';
  referralReward: string;
  createdAt: number;
}

// Create job listing
export const createJobListing = async (
  primaryWallet: Wallet | DynamicContext['primaryWallet'],
  metadata: JobMetadata
): Promise<string | null> => {
  try {
    console.log("Creating job listing with metadata:", metadata);
    
    // Upload metadata to IPFS
    const ipfsHash = await uploadToIPFS(metadata);
    if (!ipfsHash) {
      throw new Error("Failed to upload job metadata to IPFS");
    }
    
    // Mock implementation for development
    const jobId = `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log(`Created job with ID: ${jobId}`);
    
    return jobId;
  } catch (error) {
    console.error("Error creating job listing:", error);
    return null;
  }
};

// Submit application for a job
export const submitJobReferral = async (
  wallet: Wallet | DynamicContext['primaryWallet'],
  jobId: string,
  referredUser: string
): Promise<boolean> => {
  try {
    console.log(`Submitting referral for job ${jobId}, referred user: ${referredUser}`);
    
    // Mock implementation for development
    return true;
  } catch (error) {
    console.error("Error submitting job referral:", error);
    return false;
  }
};

// Accept job application
export const acceptJobApplication = async (
  wallet: Wallet | DynamicContext['primaryWallet'],
  applicationId: string
): Promise<boolean> => {
  try {
    console.log(`Accepting job application: ${applicationId}`);
    
    // Mock implementation for development
    return true;
  } catch (error) {
    console.error("Error accepting job application:", error);
    return false;
  }
};

// Reject job application
export const rejectJobApplication = async (
  wallet: Wallet | DynamicContext['primaryWallet'],
  applicationId: string
): Promise<boolean> => {
  try {
    console.log(`Rejecting job application: ${applicationId}`);
    
    // Mock implementation for development
    return true;
  } catch (error) {
    console.error("Error rejecting job application:", error);
    return false;
  }
};

// Cancel job listing
export const cancelJobListing = async (
  wallet: Wallet | DynamicContext['primaryWallet'],
  jobId: string
): Promise<boolean> => {
  try {
    console.log(`Cancelling job listing: ${jobId}`);
    
    // Mock implementation for development
    return true;
  } catch (error) {
    console.error("Error cancelling job listing:", error);
    return false;
  }
};
