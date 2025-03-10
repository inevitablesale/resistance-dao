
import { ethers } from "ethers";
import { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { PARTY_PROTOCOL, PARTY_GOVERNANCE_ABI, PARTY_FACTORY_ABI } from "@/lib/constants";
import { uploadToIPFS } from "./ipfsService";
import { NFTClass } from "./alchemyService";

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

export type JobStatus = 
  | 'open'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export interface JobListing {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorRole: NFTClass;
  category: JobCategory;
  reward: string;
  deadline: number;
  partyAddress?: string;
  status: JobStatus;
  createdAt: number;
  requiredRole?: NFTClass;
  maxApplicants?: number;
  referralReward?: string;
  settlementId?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicant: string;
  applicantRole: NFTClass;
  proposalId?: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  referrer?: string;
  createdAt: number;
}

export interface JobReferral {
  id: string;
  jobId: string;
  applicant: string;
  referrer: string;
  referrerRole: NFTClass;
  status: 'pending' | 'accepted' | 'rejected';
  rewardAmount?: string;
  proposalId?: string;
  createdAt: number;
}

/**
 * Create a job party that will hold the funds and manage applications
 */
export const createJobParty = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  job: Omit<JobListing, 'id' | 'partyAddress' | 'createdAt' | 'status'>
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    console.log("Creating job party:", job);
    
    // Upload job metadata to IPFS
    const metadata = {
      title: job.title,
      description: job.description,
      category: job.category,
      reward: job.reward,
      deadline: job.deadline,
      creator: job.creator,
      creatorRole: job.creatorRole,
      requiredRole: job.requiredRole,
      maxApplicants: job.maxApplicants,
      referralReward: job.referralReward,
      settlementId: job.settlementId,
      createdAt: Math.floor(Date.now() / 1000)
    };
    
    const ipfsHash = await uploadToIPFS(metadata);
    console.log("Job metadata uploaded to IPFS:", ipfsHash);
    
    const partyFactory = new ethers.Contract(
      PARTY_PROTOCOL.FACTORY_ADDRESS,
      PARTY_FACTORY_ABI,
      signer
    );
    
    // Set up proposal engine options for job applications
    const proposalEngineOpts = {
      basicProposalEngineType: 0, // Standard proposal type
      targetAddresses: [],
      values: [],
      calldatas: [],
      signatures: []
    };
    
    const proposalConfig = {
      proposalEngineOpts,
      enableAddAuthorityProposal: true,
      allowPublicProposals: true, // Anyone can apply for the job
      allowUriChanges: true,
      allowCustomProposals: true
    };
    
    // Create the party transaction
    const tx = await partyFactory.createParty({
      authority: ethers.constants.AddressZero,
      name: `Job: ${job.title}`,
      hosts: [signerAddress], // Job creator is the host
      votingDuration: 3 * 24 * 60 * 60, // 3 days to review applications
      executionDelay: 0, // No delay for execution
      passThresholdBps: 5000, // 50% pass threshold
      proposers: [], // Anyone can propose (apply for job)
      proposalConfig
    }, {
      value: ethers.utils.parseEther(job.reward) // Fund the job with its reward
    });
    
    console.log("Job party creation transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Job party creation receipt:", receipt);
    
    // Extract party address from event logs
    const event = receipt.events?.find(e => e.event === "PartyCreated");
    if (!event || !event.args) {
      throw new Error("Party creation event not found in receipt");
    }
    
    const partyAddress = event.args.party;
    console.log("Job party created at address:", partyAddress);
    
    return partyAddress;
  } catch (error) {
    console.error("Error creating job party:", error);
    throw error;
  }
};

/**
 * Create a new job listing
 */
export const createJobListing = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  jobData: Omit<JobListing, 'id' | 'partyAddress' | 'createdAt' | 'status' | 'creator' | 'creatorRole'>
): Promise<JobListing> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const creatorAddress = await signer.getAddress();
    
    // In a real implementation, you would fetch the creator's role from your NFT service
    // For now, we'll assume the role is passed correctly
    const creatorRole: NFTClass = 'Sentinel'; // This should be dynamically determined
    
    const jobInfo: Omit<JobListing, 'id' | 'partyAddress' | 'createdAt' | 'status'> = {
      ...jobData,
      creator: creatorAddress,
      creatorRole
    };
    
    // Create a party for this job
    const partyAddress = await createJobParty(wallet, jobInfo);
    
    // Create the job listing
    const job: JobListing = {
      id: ethers.utils.id(`${creatorAddress}-${Date.now()}`).slice(0, 42),
      ...jobInfo,
      partyAddress,
      status: 'open',
      createdAt: Math.floor(Date.now() / 1000)
    };
    
    return job;
    
  } catch (error) {
    console.error("Error creating job listing:", error);
    throw error;
  }
};

/**
 * Apply for a job
 */
export const applyForJob = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  jobId: string,
  jobPartyAddress: string,
  message: string,
  referrer?: string
): Promise<JobApplication> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const applicantAddress = await signer.getAddress();
    
    // In a real implementation, you would fetch the applicant's role from your NFT service
    // For now, we'll assume a generic role
    const applicantRole: NFTClass = 'Survivor'; // This should be dynamically determined
    
    console.log("Applying for job:", {
      jobId,
      jobPartyAddress,
      applicant: applicantAddress,
      referrer
    });
    
    const partyContract = new ethers.Contract(
      jobPartyAddress,
      PARTY_GOVERNANCE_ABI,
      signer
    );
    
    // Create a proposal for job application
    const proposalData = {
      basicProposalEngineType: 0, // Standard proposal type
      targetAddresses: [jobPartyAddress],
      values: [0],
      calldatas: ["0x"],
      signatures: [""]
    };
    
    // Submit the application as a proposal
    const tx = await partyContract.propose(
      proposalData,
      `Job Application | Applicant: ${applicantAddress} | Message: ${message} ${referrer ? `| Referrer: ${referrer}` : ''}`,
      "0x" // No progress data
    );
    
    console.log("Job application transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Job application receipt:", receipt);
    
    // Extract proposal ID from event logs
    const event = receipt.events?.find(e => e.event === "ProposalCreated");
    if (!event || !event.args) {
      throw new Error("Proposal creation event not found in receipt");
    }
    
    const proposalId = event.args.proposalId.toString();
    
    // Create the job application record
    const application: JobApplication = {
      id: ethers.utils.id(`${jobId}-${applicantAddress}-${Date.now()}`).slice(0, 42),
      jobId,
      applicant: applicantAddress,
      applicantRole,
      proposalId,
      status: 'pending',
      message,
      referrer,
      createdAt: Math.floor(Date.now() / 1000)
    };
    
    // If there's a referrer, create a referral record
    if (referrer) {
      const referralId = ethers.utils.id(`${jobId}-${applicantAddress}-${referrer}-${Date.now()}`).slice(0, 42);
      // This would be stored in your backend or event system
      console.log("Job referral created:", {
        id: referralId,
        jobId,
        applicant: applicantAddress,
        referrer,
        status: 'pending',
        createdAt: Math.floor(Date.now() / 1000)
      });
    }
    
    return application;
    
  } catch (error) {
    console.error("Error applying for job:", error);
    throw error;
  }
};

/**
 * Submit a referral for a job
 */
export const submitJobReferral = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  jobId: string,
  jobPartyAddress: string,
  applicantAddress: string
): Promise<JobReferral> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const referrerAddress = await signer.getAddress();
    
    // In a real implementation, you would fetch the referrer's role from your NFT service
    // For now, we'll assume the role is bounty hunter
    const referrerRole: NFTClass = 'Bounty Hunter'; // This should be dynamically determined
    
    console.log("Submitting job referral:", {
      jobId,
      jobPartyAddress,
      applicant: applicantAddress,
      referrer: referrerAddress
    });
    
    const partyContract = new ethers.Contract(
      jobPartyAddress,
      PARTY_GOVERNANCE_ABI,
      signer
    );
    
    // Create a proposal for job referral
    const proposalData = {
      basicProposalEngineType: 0, // Standard proposal type
      targetAddresses: [jobPartyAddress],
      values: [0],
      calldatas: ["0x"],
      signatures: [""]
    };
    
    // Submit the referral as a proposal
    const tx = await partyContract.propose(
      proposalData,
      `Job Referral | Referrer: ${referrerAddress} | Applicant: ${applicantAddress}`,
      "0x" // No progress data
    );
    
    console.log("Job referral transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Job referral receipt:", receipt);
    
    // Extract proposal ID from event logs
    const event = receipt.events?.find(e => e.event === "ProposalCreated");
    if (!event || !event.args) {
      throw new Error("Proposal creation event not found in receipt");
    }
    
    const proposalId = event.args.proposalId.toString();
    
    // Create the job referral record
    const referral: JobReferral = {
      id: ethers.utils.id(`${jobId}-${applicantAddress}-${referrerAddress}-${Date.now()}`).slice(0, 42),
      jobId,
      applicant: applicantAddress,
      referrer: referrerAddress,
      referrerRole,
      status: 'pending',
      proposalId,
      createdAt: Math.floor(Date.now() / 1000)
    };
    
    return referral;
    
  } catch (error) {
    console.error("Error submitting job referral:", error);
    throw error;
  }
};

/**
 * Accept a job application
 */
export const acceptJobApplication = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  jobPartyAddress: string,
  proposalId: string,
  applicantAddress: string
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    console.log("Accepting job application:", {
      jobPartyAddress,
      proposalId,
      applicant: applicantAddress
    });
    
    const partyContract = new ethers.Contract(
      jobPartyAddress,
      PARTY_GOVERNANCE_ABI,
      signer
    );
    
    // Vote to accept the application
    const tx = await partyContract.vote(
      proposalId,
      true, // Support the proposal
      "0x" // No progress data
    );
    
    console.log("Accept application vote transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Accept application vote receipt:", receipt);
    
    // Execute the proposal to send funds to the accepted applicant
    const executeTx = await partyContract.execute(
      proposalId,
      {
        targets: [applicantAddress],
        values: [await partyContract.tokenCount()], // Send all funds to the applicant
        calldatas: ["0x"],
        signatures: [""]
      },
      0, // No flags
      "0x" // No progress data
    );
    
    console.log("Execute accepted application transaction sent:", executeTx.hash);
    
    const executeReceipt = await executeTx.wait();
    console.log("Execute accepted application receipt:", executeReceipt);
    
    return executeTx.hash;
    
  } catch (error) {
    console.error("Error accepting job application:", error);
    throw error;
  }
};

/**
 * Reject a job application
 */
export const rejectJobApplication = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  jobPartyAddress: string,
  proposalId: string
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    console.log("Rejecting job application:", {
      jobPartyAddress,
      proposalId
    });
    
    const partyContract = new ethers.Contract(
      jobPartyAddress,
      PARTY_GOVERNANCE_ABI,
      signer
    );
    
    // Vote to reject the application
    const tx = await partyContract.vote(
      proposalId,
      false, // Do not support the proposal
      "0x" // No progress data
    );
    
    console.log("Reject application vote transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Reject application vote receipt:", receipt);
    
    return tx.hash;
    
  } catch (error) {
    console.error("Error rejecting job application:", error);
    throw error;
  }
};

/**
 * Cancel a job listing
 */
export const cancelJobListing = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  jobPartyAddress: string
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    console.log("Cancelling job listing:", {
      jobPartyAddress
    });
    
    const partyContract = new ethers.Contract(
      jobPartyAddress,
      PARTY_GOVERNANCE_ABI,
      signer
    );
    
    // Create a proposal to refund the job creator
    const proposalData = {
      basicProposalEngineType: 0, // Standard proposal type
      targetAddresses: [signerAddress],
      values: [await partyContract.tokenCount()], // Refund all funds to the job creator
      calldatas: ["0x"],
      signatures: [""]
    };
    
    // Submit the cancellation as a proposal
    const tx = await partyContract.propose(
      proposalData,
      `Job Cancellation | Refund to creator: ${signerAddress}`,
      "0x" // No progress data
    );
    
    console.log("Job cancellation transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Job cancellation receipt:", receipt);
    
    // Extract proposal ID from event logs
    const event = receipt.events?.find(e => e.event === "ProposalCreated");
    if (!event || !event.args) {
      throw new Error("Proposal creation event not found in receipt");
    }
    
    const proposalId = event.args.proposalId.toString();
    
    // Vote to accept the cancellation
    const voteTx = await partyContract.vote(
      proposalId,
      true, // Support the proposal
      "0x" // No progress data
    );
    
    await voteTx.wait();
    
    // Execute the proposal to refund the job creator
    const executeTx = await partyContract.execute(
      proposalId,
      proposalData,
      0, // No flags
      "0x" // No progress data
    );
    
    console.log("Execute job cancellation transaction sent:", executeTx.hash);
    
    const executeReceipt = await executeTx.wait();
    console.log("Execute job cancellation receipt:", executeReceipt);
    
    return executeTx.hash;
    
  } catch (error) {
    console.error("Error cancelling job listing:", error);
    throw error;
  }
};
