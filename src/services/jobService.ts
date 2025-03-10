
import { ethers } from "ethers";
import { ProposalMetadata } from "@/types/proposals";
import { IPFSContent } from "@/types/content";
import { JobMetadata, JobApplication, JobStatus, mapJobStatusToProposalStatus } from "@/types/jobs";
import { uploadToIPFS } from "./ipfsService";

// Mock job data
const mockJobs = [
  {
    id: "job-1",
    metadata: {
      title: "Harvest Resources from Abandoned Factory",
      description: "We need skilled resource gatherers to extract valuable materials from a recently discovered abandoned factory.",
      category: "resource-gathering",
      reward: "0.5 ETH",
      deadline: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days from now
      maxApplicants: 3,
      referralReward: "0.05 ETH",
      votingDuration: 604800,
      linkedInURL: "",
      creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      status: "open" as JobStatus,
      applicants: []
    },
    applications: []
  },
  {
    id: "job-2", 
    metadata: {
      title: "Settlement Security Patrol",
      description: "Looking for experienced guards to patrol the settlement perimeter.",
      category: "security",
      reward: "0.3 ETH",
      deadline: Date.now() + 1000 * 60 * 60 * 24 * 14, // 14 days from now
      maxApplicants: 5,
      referralReward: "0.03 ETH",
      votingDuration: 604800,
      linkedInURL: "",
      creator: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      status: "open" as JobStatus,
      applicants: []
    },
    applications: []
  }
];

// Mock job applications
const mockApplications: Record<string, JobApplication[]> = {
  "job-1": [],
  "job-2": []
};

// Mock function to get jobs
export const getJobs = async (): Promise<{id: string, metadata: JobMetadata}[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockJobs.map(job => ({
    id: job.id,
    metadata: job.metadata
  }));
};

// Mock function to apply for a job
export const applyForJob = async (wallet: any, jobId: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const job = mockJobs.find(j => j.id === jobId);
  if (!job) return false;
  
  const address = await wallet.getAddress();
  
  // Check if already applied
  if (job.metadata.applicants?.includes(address)) {
    return false;
  }
  
  // Add to applicants
  if (!job.metadata.applicants) {
    job.metadata.applicants = [];
  }
  job.metadata.applicants.push(address);
  
  // Create application
  const application: JobApplication = {
    applicant: address,
    jobId,
    appliedAt: Date.now(),
    status: 'pending'
  };
  
  if (!mockApplications[jobId]) {
    mockApplications[jobId] = [];
  }
  
  mockApplications[jobId].push(application);
  
  return true;
};

// Mock function to get job applications
export const getJobApplicants = async (jobId: string): Promise<JobApplication[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockApplications[jobId] || [];
};

// Mock function to approve job application
export const approveJobApplicant = async (wallet: any, jobId: string, applicantAddress: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const applications = mockApplications[jobId];
  if (!applications) return false;
  
  const application = applications.find(a => a.applicant === applicantAddress);
  if (!application) return false;
  
  application.status = 'approved';
  
  // Update job status
  const job = mockJobs.find(j => j.id === jobId);
  if (job) {
    job.metadata.status = 'filled';
  }
  
  return true;
};

// Mock function to reject job application
export const rejectJobApplication = async (wallet: any, jobId: string, applicantAddress: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const applications = mockApplications[jobId];
  if (!applications) return false;
  
  const application = applications.find(a => a.applicant === applicantAddress);
  if (!application) return false;
  
  application.status = 'rejected';
  return true;
};

// Mock function to complete job
export const completeJob = async (wallet: any, jobId: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const job = mockJobs.find(j => j.id === jobId);
  if (!job) return false;
  
  job.metadata.status = 'completed';
  return true;
};

// Mock function to cancel job
export const cancelJob = async (wallet: any, jobId: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const job = mockJobs.find(j => j.id === jobId);
  if (!job) return false;
  
  job.metadata.status = 'cancelled';
  return true;
};

// Create a job listing on IPFS
export const createJobListing = async (
  jobMetadata: JobMetadata
): Promise<string> => {
  try {
    // Convert JobMetadata to ProposalMetadata for IPFS storage
    const proposalMetadata: ProposalMetadata = {
      title: jobMetadata.title,
      description: jobMetadata.description,
      category: jobMetadata.category,
      votingDuration: jobMetadata.votingDuration,
      linkedInURL: jobMetadata.linkedInURL,
      submissionTimestamp: Date.now(),
      submitter: jobMetadata.creator,
      status: mapJobStatusToProposalStatus(jobMetadata.status || 'open'),
      investment: {
        targetCapital: jobMetadata.reward,
        description: jobMetadata.description,
      },
      image: '',
      // Additional fields needed for ProposalMetadata
      // but not present in JobMetadata can be added here
    };

    // Create IPFS content structure
    const content: IPFSContent = {
      contentSchema: "job-listing-v1",
      contentType: "job-listing",
      title: jobMetadata.title,
      content: jobMetadata.description,
      metadata: {
        ...proposalMetadata,
        jobMetadata, // Include the original job metadata for completeness
      },
    };

    // Upload to IPFS
    const ipfsHash = await uploadToIPFS(content);
    return ipfsHash;
  } catch (error) {
    console.error("Error creating job listing:", error);
    throw error;
  }
};
