import { DynamicWallet } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { uploadToIPFS } from "./ipfsService";
import { NFTClass } from "./alchemyService";
import { JobMetadata } from "@/utils/settlementConversion";

// Party Protocol contract addresses (these would be defined in constants)
const PARTY_FACTORY_ADDRESS = "0x12345..."; // Placeholder
const PARTY_PROTOCOL_ABI = []; // Placeholder

export enum JobStatus {
  OPEN = "open",
  FILLED = "filled",
  CLOSED = "closed",
  CANCELLED = "cancelled"
}

export enum JobCategory {
  DEVELOPMENT = "development",
  DESIGN = "design",
  MARKETING = "marketing",
  COMMUNITY = "community",
  SECURITY = "security",
  LEGAL = "legal",
  FINANCE = "finance",
  OTHER = "other"
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  reward: string;
  deadline: number;
  creator: string;
  creatorRole: NFTClass;
  requiredRole: NFTClass;
  maxApplicants: number;
  applicantCount: number;
  referralReward: string;
  status: JobStatus;
  settlementId: string;
  createdAt: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicant: string;
  referrer?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
}

// Create a new job using Party Protocol
export const createJob = async (
  wallet: DynamicWallet,
  job: {
    title: string;
    description: string;
    category: JobCategory;
    reward: string;
    deadline: number; // timestamp in seconds
    requiredRole: NFTClass;
    maxApplicants: number;
    referralReward: string;
    settlementId: string;
  }
): Promise<string> => {
  try {
    console.log("Creating job:", job);
    
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    
    const creator = await wallet.address;
    const creatorRole = await wallet.chainId; // This should actually call alchemyService.getPrimaryRole
    
    // Create job metadata
    const jobMetadata: JobMetadata = {
      title: job.title,
      description: job.description,
      category: job.category,
      reward: job.reward,
      deadline: job.deadline,
      creator: creator,
      creatorRole: creatorRole as NFTClass, // This is a mock, in production we'd get the actual role
      requiredRole: job.requiredRole,
      maxApplicants: job.maxApplicants,
      referralReward: job.referralReward,
      settlementId: job.settlementId,
      createdAt: Math.floor(Date.now() / 1000),
      // Required ProposalMetadata fields
      votingDuration: 14 * 24 * 60 * 60, // 14 days default
      linkedInURL: "https://linkedin.com/in/resistance", // Default placeholder
    };
    
    // Upload job metadata to IPFS
    const ipfsHash = await uploadToIPFS(jobMetadata);
    console.log("Job metadata uploaded to IPFS:", ipfsHash);
    
    // In a real implementation, this would:
    // 1. Create a new Party through PartyFactory for the job
    // 2. Configure the party for applications and referrals
    
    // Mock implementation for development
    // Generate a mock job ID - in production this would be the Party address
    const jobId = `job_${Date.now()}`;
    
    return jobId;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

// Apply for a job
export const applyForJob = async (
  wallet: DynamicWallet,
  jobId: string,
  referrer?: string
): Promise<string> => {
  try {
    console.log(`Applying for job: ${jobId}`);
    
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    
    const applicant = await wallet.address;
    
    // Mock implementation for development
    // In production, this would submit a proposal to the Party
    
    // Generate a mock application ID
    const applicationId = `app_${Date.now()}`;
    
    return applicationId;
  } catch (error) {
    console.error("Error applying for job:", error);
    throw error;
  }
};

// Get all jobs
export const getJobs = async (): Promise<Job[]> => {
  try {
    console.log("Getting all jobs");
    
    // Mock implementation for development
    // In production, this would query the blockchain for job Parties
    
    return [
      {
        id: "job_123",
        title: "Smart Contract Developer",
        description: "Develop and audit smart contracts for our settlement",
        category: JobCategory.DEVELOPMENT,
        reward: "5",
        deadline: Math.floor(Date.now() / 1000) + 604800, // 7 days from now
        creator: "0x1234...",
        creatorRole: "Sentinel",
        requiredRole: "Survivor",
        maxApplicants: 5,
        applicantCount: 2,
        referralReward: "0.5",
        status: JobStatus.OPEN,
        settlementId: "settlement_abc",
        createdAt: Math.floor(Date.now() / 1000) - 86400 // 1 day ago
      },
      {
        id: "job_456",
        title: "Community Manager",
        description: "Manage and grow our settlement community",
        category: JobCategory.COMMUNITY,
        reward: "3",
        deadline: Math.floor(Date.now() / 1000) + 1209600, // 14 days from now
        creator: "0x5678...",
        creatorRole: "Sentinel",
        requiredRole: "Bounty Hunter",
        maxApplicants: 3,
        applicantCount: 1,
        referralReward: "0.3",
        status: JobStatus.OPEN,
        settlementId: "settlement_def",
        createdAt: Math.floor(Date.now() / 1000) - 172800 // 2 days ago
      }
    ];
  } catch (error) {
    console.error("Error getting jobs:", error);
    return [];
  }
};

// Get jobs created by a specific user
export const getUserJobs = async (address: string): Promise<Job[]> => {
  try {
    console.log(`Getting jobs created by: ${address}`);
    
    // Mock implementation for development
    // In production, this would query the blockchain for job Parties created by the user
    
    return [
      {
        id: "job_789",
        title: "Security Analyst",
        description: "Perform security analysis for our settlement",
        category: JobCategory.SECURITY,
        reward: "4",
        deadline: Math.floor(Date.now() / 1000) + 604800, // 7 days from now
        creator: address,
        creatorRole: "Sentinel",
        requiredRole: "Survivor",
        maxApplicants: 2,
        applicantCount: 0,
        referralReward: "0.4",
        status: JobStatus.OPEN,
        settlementId: "settlement_ghi",
        createdAt: Math.floor(Date.now() / 1000) - 43200 // 12 hours ago
      }
    ];
  } catch (error) {
    console.error("Error getting user jobs:", error);
    return [];
  }
};

// Get job applications for a job
export const getJobApplications = async (jobId: string): Promise<JobApplication[]> => {
  try {
    console.log(`Getting applications for job: ${jobId}`);
    
    // Mock implementation for development
    // In production, this would query the blockchain for proposals to the job Party
    
    return [
      {
        id: "app_123",
        jobId,
        applicant: "0xabcd...",
        referrer: "0x9876...",
        status: "pending",
        createdAt: Math.floor(Date.now() / 1000) - 21600 // 6 hours ago
      },
      {
        id: "app_456",
        jobId,
        applicant: "0xefgh...",
        status: "accepted",
        createdAt: Math.floor(Date.now() / 1000) - 43200 // 12 hours ago
      }
    ];
  } catch (error) {
    console.error("Error getting job applications:", error);
    return [];
  }
};

// Get applications submitted by a user
export const getUserApplications = async (address: string): Promise<JobApplication[]> => {
  try {
    console.log(`Getting applications submitted by: ${address}`);
    
    // Mock implementation for development
    // In production, this would query the blockchain for proposals submitted by the user
    
    return [
      {
        id: "app_789",
        jobId: "job_123",
        applicant: address,
        status: "pending",
        createdAt: Math.floor(Date.now() / 1000) - 10800 // 3 hours ago
      }
    ];
  } catch (error) {
    console.error("Error getting user applications:", error);
    return [];
  }
};

// Update job status
export const updateJobStatus = async (
  wallet: DynamicWallet,
  jobId: string,
  status: JobStatus
): Promise<boolean> => {
  try {
    console.log(`Updating job ${jobId} status to ${status}`);
    
    // Mock implementation for development
    // In production, this would call a function on the Party
    
    return true;
  } catch (error) {
    console.error("Error updating job status:", error);
    throw error;
  }
};

// Update application status
export const updateApplicationStatus = async (
  wallet: DynamicWallet,
  applicationId: string,
  status: 'accepted' | 'rejected'
): Promise<boolean> => {
  try {
    console.log(`Updating application ${applicationId} status to ${status}`);
    
    // Mock implementation for development
    // In production, this would execute a proposal on the Party
    
    return true;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};
