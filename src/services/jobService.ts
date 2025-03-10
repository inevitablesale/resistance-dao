import { Wallet } from "ethers";
import { uploadToIPFS } from "./ipfsService";
import { JobMetadata } from "@/utils/settlementConversion";
import { NFTClass } from "./alchemyService";
import { ethers } from "ethers";
import { 
  createParty, 
  createEthCrowdfund, 
  createGovernanceProposal,
  voteOnGovernanceProposal,
  executeGovernanceProposal,
  GovernanceProposal 
} from "./partyProtocolService";
import { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { executeTransaction } from "./transactionManager";
import { useToast } from "@/hooks/use-toast";
import { IPFSContent } from "@/types/content";

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
  createdAt: number;
  message?: string;
  experience?: string;
  portfolio?: string;
  referrer?: string;
}

// Define the JobReferral type
export interface JobReferral {
  id: string;
  jobId: string;
  referrer: string;
  applicant: string;
  status: ReferralStatus;
  createdAt: number;
  reward?: string;
  referrerTier?: string;
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
  partyAddress?: string;
  crowdfundAddress?: string;
}

// Define the PartyJobConfig type for Party Protocol job creation
export interface PartyJobConfig {
  name: string;
  description: string;
  votingDuration: number;
  executionDelay: number;
  passThresholdBps: number;
  allowPublicProposals: boolean;
  linkedInURL: string;
  referralRewardPercentage: number;
  minContribution: string;
  maxContribution: string;
  maxTotalContributions: string;
  duration: number;
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

// Helper function to get wallet address
const getWalletAddress = async (wallet: WalletLike): Promise<string> => {
  if ('address' in wallet && wallet.address) {
    return wallet.address;
  } 
  
  if ('getWalletClient' in wallet && wallet.getWalletClient) {
    const walletClient = await wallet.getWalletClient();
    if (walletClient && walletClient.getAddress) {
      return await walletClient.getAddress();
    }
  }
  
  if (wallet instanceof Wallet) {
    return wallet.address;
  }
  
  throw new Error("Unable to get wallet address");
};

/**
 * Creates a job listing using Party Protocol
 * @param wallet User wallet
 * @param jobMetadata Job metadata
 * @param votingDuration Voting duration in seconds
 * @param linkedInURL LinkedIn URL for verification
 * @returns Job ID if successful, null otherwise
 */
export const createJobListing = async (
  wallet: any,
  jobMetadata: JobMetadata
): Promise<string | null> => {
  try {
    console.log("Creating job listing with metadata:", jobMetadata);
    
    if (!('getWalletClient' in wallet)) {
      throw new Error("Wallet must be a Dynamic SDK wallet to create a Party Protocol job");
    }
    
    // Convert JobMetadata to ProposalMetadata for IPFS upload
    const proposalMetadata: ProposalMetadata = {
      title: jobMetadata.title,
      description: jobMetadata.description,
      category: jobMetadata.category,
      votingDuration: jobMetadata.votingDuration,
      linkedInURL: jobMetadata.linkedInURL,
      investment: {
        targetCapital: jobMetadata.reward,
        description: jobMetadata.description,
      },
      submissionTimestamp: Date.now(),
      submitter: jobMetadata.creator
    };
    
    // Upload metadata to IPFS
    const ipfsHash = await uploadToIPFS(proposalMetadata);
    if (!ipfsHash) {
      throw new Error("Failed to upload job metadata to IPFS");
    }
    
    // Create party configuration
    const partyOptions = {
      name: `Job: ${jobMetadata.title}`,
      hosts: [await getWalletAddress(wallet)],
      votingDuration: jobMetadata.votingDuration,
      executionDelay: 1 * 24 * 60 * 60, // 1 day in seconds
      passThresholdBps: 5000, // 50%
      proposers: [], // Anyone can propose (apply for the job)
      allowPublicProposals: true,
      description: jobMetadata.description,
      metadataURI: `ipfs://${ipfsHash}`
    };
    
    // Create Party for job listing
    const partyAddress = await createParty(
      wallet as NonNullable<DynamicContextType['primaryWallet']>,
      partyOptions
    );
    
    // Create Crowdfund for job reward pool if needed
    const crowdfundOptions = {
      initialContributor: await getWalletAddress(wallet),
      minContribution: ethers.utils.parseEther("0.01").toString(), // 0.01 ETH
      maxContribution: ethers.utils.parseEther("10").toString(), // 10 ETH
      maxTotalContributions: ethers.utils.parseEther(jobMetadata.reward).toString(),
      duration: 30 * 24 * 60 * 60 // 30 days
    };
    
    const crowdfundAddress = await createEthCrowdfund(
      wallet as NonNullable<DynamicContextType['primaryWallet']>,
      partyAddress,
      crowdfundOptions,
      jobMetadata
    );
    
    // Create a unique job ID
    const jobId = `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    console.log(`Created job with ID: ${jobId}, Party: ${partyAddress}, Crowdfund: ${crowdfundAddress}`);
    
    // In a production environment, you'd store this mapping in a database
    // For this development version, we return the job ID and rely on client-side storage
    
    return jobId;
  } catch (error) {
    console.error("Error creating job listing:", error);
    return null;
  }
};

/**
 * Submits a job application using Party Protocol proposals
 * @param wallet User wallet
 * @param jobId Job ID
 * @param partyAddress Party address for the job
 * @param applicationDetails Application details
 * @returns Success status
 */
export const submitJobApplication = async (
  wallet: WalletLike,
  jobId: string,
  partyAddress: string,
  applicationDetails: {
    message: string;
    experience: string;
    portfolio?: string;
    referrer?: string; // Optional referrer address
  }
): Promise<boolean> => {
  try {
    console.log(`Submitting application for job ${jobId} at party ${partyAddress}`);
    
    if (!('getWalletClient' in wallet)) {
      throw new Error("Wallet must be a Dynamic SDK wallet to submit a Party Protocol application");
    }
    
    // Create the application metadata
    const applicationIpfsContent: IPFSContent = {
      contentSchema: "job-application-v1",
      contentType: "job-application",
      title: `Application for Job: ${jobId}`,
      content: applicationDetails.message,
      metadata: {
        author: await getWalletAddress(wallet),
        publishedAt: Math.floor(Date.now() / 1000),
        version: 1,
        language: "en",
        tags: ["job-application", jobId],
        attachments: [applicationDetails.portfolio || ""]
      }
    };
    
    // Add custom fields to metadata
    const customMetadata = {
      ...applicationIpfsContent,
      jobId,
      experience: applicationDetails.experience,
      referrer: applicationDetails.referrer || "",
    };
    
    // Upload application metadata to IPFS
    const ipfsHash = await uploadToIPFS(applicationIpfsContent);
    if (!ipfsHash) {
      throw new Error("Failed to upload application metadata to IPFS");
    }
    
    // Create the proposal for the application
    const proposal: GovernanceProposal = {
      title: `Job Application: ${jobId}`,
      description: `Application from ${await getWalletAddress(wallet)} with ${applicationDetails.experience} experience. ${applicationDetails.message}`,
      transactions: [
        {
          // This transaction would handle the application acceptance logic
          // For now it's a placeholder that simply records the application in the party's storage
          target: partyAddress, 
          value: "0",
          calldata: `0x`, // The actual call data would depend on your specific contract implementation
          signature: "recordApplication(string,address,string)"
        }
      ]
    };
    
    // Submit the proposal to the party
    const proposalId = await createGovernanceProposal(
      wallet as NonNullable<DynamicContextType['primaryWallet']>,
      partyAddress,
      proposal
    );
    
    console.log(`Created application proposal with ID: ${proposalId}`);
    
    return !!proposalId;
  } catch (error) {
    console.error("Error submitting job application:", error);
    return false;
  }
};

/**
 * Submits a job referral using Party Protocol
 * @param wallet User wallet
 * @param jobId Job ID
 * @param partyAddress Party address for the job
 * @param referredUser Referred user address
 * @returns Success status
 */
export const submitJobReferral = async (
  wallet: WalletLike,
  jobId: string,
  partyAddress: string,
  referredUser: string
): Promise<boolean> => {
  try {
    console.log(`Submitting referral for job ${jobId}, user ${referredUser}`);
    
    if (!('getWalletClient' in wallet)) {
      throw new Error("Wallet must be a Dynamic SDK wallet to submit a Party Protocol referral");
    }
    
    // Create the referral metadata as IPFSContent
    const referralIpfsContent: IPFSContent = {
      contentSchema: "job-referral-v1",
      contentType: "job-referral",
      title: `Referral for Job: ${jobId}`,
      content: `Referral for ${referredUser} from ${await getWalletAddress(wallet)}`,
      metadata: {
        author: await getWalletAddress(wallet),
        publishedAt: Math.floor(Date.now() / 1000),
        version: 1,
        language: "en",
        tags: ["job-referral", jobId],
      }
    };
    
    // Upload referral metadata to IPFS
    const ipfsHash = await uploadToIPFS(referralIpfsContent);
    if (!ipfsHash) {
      throw new Error("Failed to upload referral metadata to IPFS");
    }
    
    // Create the proposal for the referral
    const proposal: GovernanceProposal = {
      title: `Job Referral: ${jobId}`,
      description: `Referral for ${referredUser} from ${await getWalletAddress(wallet)}`,
      transactions: [
        {
          // This transaction would handle the referral tracking logic
          target: partyAddress, 
          value: "0",
          calldata: `0x`, // The actual call data would depend on your specific contract implementation
          signature: "recordReferral(string,address,address)"
        }
      ]
    };
    
    // Submit the proposal to the party
    const proposalId = await createGovernanceProposal(
      wallet as NonNullable<DynamicContextType['primaryWallet']>,
      partyAddress,
      proposal
    );
    
    console.log(`Created referral proposal with ID: ${proposalId}`);
    
    return !!proposalId;
  } catch (error) {
    console.error("Error submitting job referral:", error);
    return false;
  }
};

/**
 * Accepts a job application using Party Protocol governance
 * @param wallet User wallet
 * @param partyAddress Party address for the job
 * @param proposalId Proposal ID of the application
 * @param applicationId Application ID
 * @returns Success status
 */
export const acceptJobApplication = async (
  wallet: WalletLike,
  partyAddress: string,
  proposalId: string,
  applicationId: string
): Promise<boolean> => {
  try {
    console.log(`Accepting application ${applicationId} via proposal ${proposalId}`);
    
    if (!('getWalletClient' in wallet)) {
      throw new Error("Wallet must be a Dynamic SDK wallet to accept a Party Protocol application");
    }
    
    // First, vote in favor of the proposal
    const voteResult = await voteOnGovernanceProposal(
      wallet as NonNullable<DynamicContextType['primaryWallet']>,
      partyAddress,
      proposalId,
      true // Support the proposal
    );
    
    if (!voteResult) {
      throw new Error("Failed to vote on application proposal");
    }
    
    // In a real implementation, you would need to wait for the voting period to end
    // and for the proposal to be ready for execution
    
    // Execute the proposal to accept the application
    const proposal: GovernanceProposal = {
      title: "", // Not needed for execution
      description: "", // Not needed for execution
      transactions: [
        {
          // This transaction would handle the application acceptance logic
          target: partyAddress, 
          value: "0",
          calldata: `0x`, // The actual call data would depend on your specific contract implementation
          signature: "acceptApplication(string)"
        }
      ]
    };
    
    const executeResult = await executeGovernanceProposal(
      wallet as NonNullable<DynamicContextType['primaryWallet']>,
      partyAddress,
      proposalId,
      proposal
    );
    
    console.log(`Executed application acceptance with result: ${executeResult}`);
    
    return !!executeResult;
  } catch (error) {
    console.error("Error accepting job application:", error);
    return false;
  }
};

/**
 * Rejects a job application using Party Protocol governance
 * @param wallet User wallet
 * @param partyAddress Party address for the job
 * @param proposalId Proposal ID of the application
 * @param applicationId Application ID
 * @returns Success status
 */
export const rejectJobApplication = async (
  wallet: WalletLike,
  partyAddress: string,
  proposalId: string,
  applicationId: string
): Promise<boolean> => {
  try {
    console.log(`Rejecting application ${applicationId} via proposal ${proposalId}`);
    
    if (!('getWalletClient' in wallet)) {
      throw new Error("Wallet must be a Dynamic SDK wallet to reject a Party Protocol application");
    }
    
    // Vote against the proposal to reject it
    const voteResult = await voteOnGovernanceProposal(
      wallet as NonNullable<DynamicContextType['primaryWallet']>,
      partyAddress,
      proposalId,
      false // Do not support the proposal
    );
    
    console.log(`Rejected application with vote result: ${voteResult}`);
    
    return !!voteResult;
  } catch (error) {
    console.error("Error rejecting job application:", error);
    return false;
  }
};

/**
 * Cancels a job listing by closing the Party
 * @param wallet User wallet
 * @param partyAddress Party address for the job
 * @param jobId Job ID
 * @returns Success status
 */
export const cancelJobListing = async (
  wallet: WalletLike,
  partyAddress: string,
  jobId: string
): Promise<boolean> => {
  try {
    console.log(`Cancelling job ${jobId} at party ${partyAddress}`);
    
    if (!('getWalletClient' in wallet)) {
      throw new Error("Wallet must be a Dynamic SDK wallet to cancel a Party Protocol job");
    }
    
    // Create a proposal to cancel the job
    const proposal: GovernanceProposal = {
      title: `Cancel Job: ${jobId}`,
      description: `Cancellation of job ${jobId} by the job creator`,
      transactions: [
        {
          // This transaction would handle the job cancellation logic
          target: partyAddress, 
          value: "0",
          calldata: `0x`, // The actual call data would depend on your specific contract implementation
          signature: "cancelJob(string)"
        }
      ]
    };
    
    // Submit the proposal to the party
    const proposalId = await createGovernanceProposal(
      wallet as NonNullable<DynamicContextType['primaryWallet']>,
      partyAddress,
      proposal
    );
    
    if (!proposalId) {
      throw new Error("Failed to create job cancellation proposal");
    }
    
    // Vote in favor of the cancellation
    const voteResult = await voteOnGovernanceProposal(
      wallet as NonNullable<DynamicContextType['primaryWallet']>,
      partyAddress,
      proposalId,
      true // Support the cancellation
    );
    
    if (!voteResult) {
      throw new Error("Failed to vote on job cancellation proposal");
    }
    
    // Execute the proposal to cancel the job
    const executeResult = await executeGovernanceProposal(
      wallet as NonNullable<DynamicContextType['primaryWallet']>,
      partyAddress,
      proposalId,
      proposal
    );
    
    console.log(`Executed job cancellation with result: ${executeResult}`);
    
    return !!executeResult;
  } catch (error) {
    console.error("Error cancelling job listing:", error);
    return false;
  }
};

/**
 * Get the tier multiplier for a Bounty Hunter
 * @param bountyHunterAddress Address of the Bounty Hunter NFT holder
 * @returns Tier multiplier value (1.0 = 100%, 1.5 = 150%, etc.)
 */
export const getBountyHunterTierMultiplier = async (
  bountyHunterAddress: string
): Promise<number> => {
  try {
    // This would normally query the Bounty Hunter NFT metadata
    // For now we'll return a mock value
    return 1.0; // Base multiplier (100%)
  } catch (error) {
    console.error("Error getting Bounty Hunter tier:", error);
    return 1.0; // Default multiplier
  }
};

/**
 * Calculate referral reward based on job reward and referrer's tier
 * @param jobReward The base job reward (string amount)
 * @param referrerTierMultiplier The tier multiplier for the referrer
 * @param referralRewardPercentage The percentage of the job reward to be given as referral (0-100)
 * @returns The calculated referral reward
 */
export const calculateReferralReward = (
  jobReward: string,
  referrerTierMultiplier: number = 1.0,
  referralRewardPercentage: number = 10
): string => {
  try {
    const baseReward = ethers.utils.parseEther(jobReward);
    const referralPercent = referralRewardPercentage / 100;
    const referralAmount = baseReward.mul(Math.floor(referralPercent * 100)).div(100);
    const multipliedAmount = referralAmount.mul(Math.floor(referrerTierMultiplier * 100)).div(100);
    
    return ethers.utils.formatEther(multipliedAmount);
  } catch (error) {
    console.error("Error calculating referral reward:", error);
    return "0"; // Default to 0 on error
  }
};

/**
 * Updates Bounty Hunter's referral stats in the NFT metadata
 * @param bountyHunterAddress Address of the Bounty Hunter
 * @param referralData The referral data to update
 * @returns Success status
 */
export const updateBountyHunterReferralStats = async (
  bountyHunterAddress: string,
  referralData: {
    referralId: string;
    jobId: string;
    applicantAddress: string;
    applicantClass: NFTClass;
    rewardAmount: string;
  }
): Promise<boolean> => {
  try {
    // This would normally update the Bounty Hunter NFT metadata
    // For now we'll just log it
    console.log(`Updating Bounty Hunter ${bountyHunterAddress} referral stats:`, referralData);
    
    // Increment the appropriate referral counter based on applicant class
    let sentinelReferrals = 0;
    let survivorReferrals = 0;
    let hunterReferrals = 0;
    
    switch (referralData.applicantClass) {
      case 'Sentinel':
        sentinelReferrals++;
        break;
      case 'Survivor':
        survivorReferrals++;
        break;
      case 'Unknown': // Default to survivor
        survivorReferrals++;
        break;
    }
    
    // In a real implementation, this would update the NFT metadata
    // bounty_data.referral_system.referral_stats
    
    return true;
  } catch (error) {
    console.error("Error updating Bounty Hunter referral stats:", error);
    return false;
  }
};

/**
 * Updates Sentinel's bounty stats in the NFT metadata
 * @param sentinelAddress Address of the Sentinel
 * @param jobData The job data to update
 * @returns Success status
 */
export const updateSentinelBountyStats = async (
  sentinelAddress: string,
  jobData: {
    jobId: string;
    partyAddress: string;
    rewardAmount: string;
    applicantAddress?: string;
    referrerAddress?: string;
  }
): Promise<boolean> => {
  try {
    // This would normally update the Sentinel NFT metadata
    // For now we'll just log it
    console.log(`Updating Sentinel ${sentinelAddress} bounty stats:`, jobData);
    
    // In a real implementation, this would update the NFT metadata
    // party_data.bounty_interactions
    
    return true;
  } catch (error) {
    console.error("Error updating Sentinel bounty stats:", error);
    return false;
  }
};
