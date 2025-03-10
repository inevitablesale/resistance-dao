
import { Wallet } from "ethers";
import { DynamicContext } from "@dynamic-labs/sdk-react-core";
import { uploadToIPFS } from "./ipfsService";
import { JobMetadata } from "@/utils/settlementConversion";
import { NFTClass } from "./alchemyService";

// Define the JobCategory type
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

// Define the job status type
export type JobStatus = 'open' | 'in-progress' | 'completed' | 'cancelled';

// Define the application status type
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

// Define the referral status type
export type ReferralStatus = 'pending' | 'accepted' | 'rejected';

// Define the JobApplication type
export interface JobApplication {
  id: string;
  jobId: string;
  applicant: string;
  status: ApplicationStatus;
  submittedAt: number;
  // Additional application details
  message?: string;
  experience?: string;
  portfolio?: string;
}

// Define the JobReferral type
export interface JobReferral {
  id: string;
  jobId: string;
  referrer: string;
  applicant: string;
  status: ReferralStatus;
  createdAt: number;
}

// Define the JobListing type
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
  status: JobStatus;
  maxApplicants: number;
  referralReward: string;
  settlementId: string;
  createdAt: number;
  applications?: JobApplication[];
}

/**
 * Creates a job listing
 * @param wallet User wallet
 * @param metadata Job metadata
 * @returns Job ID if successful, null otherwise
 */
export const createJobListing = async (
  wallet: Wallet | DynamicContext['primaryWallet'],
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

/**
 * Submits a job application
 * @param wallet User wallet
 * @param jobId Job ID
 * @param applicationDetails Application details
 * @returns Success status
 */
export const submitJobApplication = async (
  wallet: Wallet | DynamicContext['primaryWallet'],
  jobId: string,
  applicationDetails: {
    message: string;
    experience: string;
    portfolio?: string;
  }
): Promise<boolean> => {
  try {
    console.log(`Submitting application for job ${jobId}`);
    
    // Mock implementation for development
    return true;
  } catch (error) {
    console.error("Error submitting job application:", error);
    return false;
  }
};

/**
 * Submits a job referral
 * @param wallet User wallet
 * @param jobId Job ID
 * @param referredUser Referred user address
 * @returns Success status
 */
export const submitJobReferral = async (
  wallet: Wallet | DynamicContext['primaryWallet'],
  jobId: string,
  referredUser: string
): Promise<boolean> => {
  try {
    console.log(`Submitting referral for job ${jobId}, user ${referredUser}`);
    
    // Mock implementation for development
    return true;
  } catch (error) {
    console.error("Error submitting job referral:", error);
    return false;
  }
};

/**
 * Accepts a job application
 * @param wallet User wallet
 * @param applicationId Application ID
 * @returns Success status
 */
export const acceptJobApplication = async (
  wallet: Wallet | DynamicContext['primaryWallet'],
  applicationId: string
): Promise<boolean> => {
  try {
    console.log(`Accepting application ${applicationId}`);
    
    // Mock implementation for development
    return true;
  } catch (error) {
    console.error("Error accepting job application:", error);
    return false;
  }
};

/**
 * Rejects a job application
 * @param wallet User wallet
 * @param applicationId Application ID
 * @returns Success status
 */
export const rejectJobApplication = async (
  wallet: Wallet | DynamicContext['primaryWallet'],
  applicationId: string
): Promise<boolean> => {
  try {
    console.log(`Rejecting application ${applicationId}`);
    
    // Mock implementation for development
    return true;
  } catch (error) {
    console.error("Error rejecting job application:", error);
    return false;
  }
};

/**
 * Cancels a job listing
 * @param wallet User wallet
 * @param jobId Job ID
 * @returns Success status
 */
export const cancelJobListing = async (
  wallet: Wallet | DynamicContext['primaryWallet'],
  jobId: string
): Promise<boolean> => {
  try {
    console.log(`Cancelling job ${jobId}`);
    
    // Mock implementation for development
    return true;
  } catch (error) {
    console.error("Error cancelling job listing:", error);
    return false;
  }
};
