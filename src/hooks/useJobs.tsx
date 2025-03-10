import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useToast } from "./use-toast";
import {
  NFTClass,
  getPrimaryRole
} from "@/services/alchemyService";
import { JobMetadata } from "@/utils/settlementConversion";
import { JobCategory } from "@/components/jobs/JobCategoryIcon";

// Update the mock job data to match real-world bounties
const mockJobs: (JobMetadata & { id: string })[] = [
  {
    id: "job-1",
    title: "Senior Solidity Developer for DAO Treasury System",
    description: "We're looking for an experienced Solidity developer to help build our DAO treasury management system. The ideal candidate has experience with multi-signature wallets, token vesting, and governance systems.",
    category: "protocol-development",
    reward: "5,000 USDC",
    deadline: Date.now() + 1000 * 60 * 60 * 24 * 14, // 14 days from now
    maxApplicants: 3,
    referralReward: "1,000 USDC",
    votingDuration: 604800,
    linkedInURL: "",
    creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    status: "open",
    applicants: []
  },
  {
    id: "job-2",
    title: "Community Manager for Discord",
    description: "Looking for an experienced community manager to help grow and moderate our Discord server. The ideal candidate has experience with Web3 communities and can help create engagement strategies.",
    category: "community-growth",
    reward: "2,000 USDC/month",
    deadline: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days from now
    maxApplicants: 5,
    referralReward: "400 USDC",
    votingDuration: 604800,
    linkedInURL: "",
    creator: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    status: "open",
    applicants: []
  },
  {
    id: "job-3",
    title: "Senior React Frontend Developer",
    description: "We need a skilled React developer to help build our web application. Experience with TypeScript, React Query, and Web3 technologies is required. This is a full-time position.",
    category: "talent-acquisition",
    reward: "8,000-12,000 USDC/month",
    deadline: Date.now() + 1000 * 60 * 60 * 24 * 10, // 10 days from now
    maxApplicants: 2,
    referralReward: "2,000 USDC",
    votingDuration: 604800,
    linkedInURL: "",
    creator: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    status: "open",
    applicants: []
  },
  {
    id: "job-4",
    title: "Educational Content Series on DAO Governance",
    description: "Create a series of educational content (articles or videos) explaining DAO governance, voting mechanisms, and treasury management in simple terms for newcomers.",
    category: "content-creation",
    reward: "3,000 USDC",
    deadline: Date.now() + 1000 * 60 * 60 * 24 * 21, // 21 days from now
    maxApplicants: 3,
    referralReward: "500 USDC",
    votingDuration: 604800,
    linkedInURL: "",
    creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    status: "open",
    applicants: []
  },
  {
    id: "job-5",
    title: "Business Development Lead for Partnerships",
    description: "Find and secure strategic partnerships with other DeFi/DAO protocols. Commission-based role with potential for full-time position.",
    category: "business-development",
    reward: "10% of deal value",
    deadline: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days from now
    maxApplicants: 2,
    referralReward: "2% of deal value",
    votingDuration: 604800,
    linkedInURL: "",
    creator: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    status: "open",
    applicants: []
  }
];

export interface JobApplicant {
  address: string;
  appliedAt: number;
  status: 'pending' | 'approved' | 'rejected';
}

// Mock function to get jobs
const getJobs = async (): Promise<(JobMetadata & { id: string })[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockJobs;
};

// Mock function to apply for a job
const applyForJob = async (wallet: any, jobId: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};

// Mock function to get job applicants
const getJobApplicants = async (jobId: string): Promise<JobApplicant[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [];
};

// Mock function to approve job applicant
const approveJobApplicant = async (wallet: any, jobId: string, applicantAddress: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};

// Mock function to reject job applicant
const rejectJobApplicant = async (wallet: any, jobId: string, applicantAddress: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};

// Mock function to complete job
const completeJob = async (wallet: any, jobId: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};

// Mock function to cancel job
const cancelJob = async (wallet: any, jobId: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};

export const useJobs = () => {
  const { toast } = useToast();
  const { primaryWallet } = useDynamicContext();
  const [userRole, setUserRole] = useState<NFTClass>("Unknown");

  // Check user role on mount
  useEffect(() => {
    const checkRole = async () => {
      if (primaryWallet) {
        try {
          const address = await primaryWallet.address;
          const role = await getPrimaryRole(address);
          setUserRole(role);
        } catch (error) {
          console.error("Error checking user role:", error);
        }
      }
    };

    checkRole();
  }, [primaryWallet]);

  // Fetch jobs
  const {
    data: jobs = [],
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      try {
        return await getJobs();
      } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
      }
    },
  });

  // Create a new job
  const createJob = async (jobData: Omit<JobMetadata, 'votingDuration' | 'linkedInURL'>) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a job.",
        variant: "destructive",
      });
      return null;
    }

    if (userRole !== "Sentinel") {
      toast({
        title: "Access Denied",
        description: "Only Sentinels can create jobs.",
        variant: "destructive",
      });
      return null;
    }

    try {
      toast({
        title: "Creating Job",
        description:
          "Please approve the transaction to create your job listing.",
      });

      const wallet = await primaryWallet.getWalletClient();
      const address = await wallet.getAddress();

      // Create job metadata with required fields
      const metadata: JobMetadata = {
        ...jobData,
        votingDuration: 604800, // Default 7 days
        linkedInURL: "", // Empty default
        creator: address, // This is now allowed in JobMetadata
      };

      // For now, simply add to the mock data
      const jobId = `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      toast({
        title: "Job Created",
        description: "Your job listing has been created successfully.",
      });

      // Refresh jobs list
      refetchJobs();

      return jobId;
    } catch (error) {
      console.error("Error creating job:", error);
      toast({
        title: "Error Creating Job",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  };

  // Apply for a job
  const applyToJob = async (jobId: string) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to apply for this job.",
        variant: "destructive",
      });
      return false;
    }

    if (userRole !== "Bounty Hunter") {
      toast({
        title: "Access Denied",
        description: "Only Bounty Hunters can apply for jobs.",
        variant: "destructive",
      });
      return false;
    }

    try {
      toast({
        title: "Applying for Job",
        description: "Please approve the transaction to apply for this job.",
      });

      const wallet = await primaryWallet.getWalletClient();
      const success = await applyForJob(wallet, jobId);

      if (success) {
        toast({
          title: "Application Submitted",
          description: "Your application has been submitted successfully.",
        });

        // Refresh jobs list
        refetchJobs();

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error applying for job:", error);
      toast({
        title: "Error Applying for Job",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get job applicants
  const getApplicants = async (jobId: string): Promise<JobApplicant[]> => {
    try {
      return await getJobApplicants(jobId);
    } catch (error) {
      console.error("Error fetching job applicants:", error);
      return [];
    }
  };

  // Approve a job applicant
  const approveApplicant = async (jobId: string, applicantAddress: string) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to approve this applicant.",
        variant: "destructive",
      });
      return false;
    }

    if (userRole !== "Sentinel") {
      toast({
        title: "Access Denied",
        description: "Only Sentinels can approve job applicants.",
        variant: "destructive",
      });
      return false;
    }

    try {
      toast({
        title: "Approving Applicant",
        description:
          "Please approve the transaction to approve this job applicant.",
      });

      const wallet = await primaryWallet.getWalletClient();
      const success = await approveJobApplicant(wallet, jobId, applicantAddress);

      if (success) {
        toast({
          title: "Applicant Approved",
          description: "You have successfully approved the job applicant.",
        });

        // Refresh jobs list
        refetchJobs();

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error approving applicant:", error);
      toast({
        title: "Error Approving Applicant",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Reject a job applicant
  const rejectApplicant = async (jobId: string, applicantAddress: string) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to reject this applicant.",
        variant: "destructive",
      });
      return false;
    }

    if (userRole !== "Sentinel") {
      toast({
        title: "Access Denied",
        description: "Only Sentinels can reject job applicants.",
        variant: "destructive",
      });
      return false;
    }

    try {
      toast({
        title: "Rejecting Applicant",
        description:
          "Please approve the transaction to reject this job applicant.",
      });

      const wallet = await primaryWallet.getWalletClient();
      const success = await rejectJobApplicant(wallet, jobId, applicantAddress);

      if (success) {
        toast({
          title: "Applicant Rejected",
          description: "You have successfully rejected the job applicant.",
        });

        // Refresh jobs list
        refetchJobs();

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      toast({
        title: "Error Rejecting Applicant",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Complete a job
  const completeExistingJob = async (jobId: string) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to complete this job.",
        variant: "destructive",
      });
      return false;
    }

    if (userRole !== "Sentinel") {
      toast({
        title: "Access Denied",
        description: "Only Sentinels can complete jobs.",
        variant: "destructive",
      });
      return false;
    }

    try {
      toast({
        title: "Completing Job",
        description: "Please approve the transaction to complete this job.",
      });

      const wallet = await primaryWallet.getWalletClient();
      const success = await completeJob(wallet, jobId);

      if (success) {
        toast({
          title: "Job Completed",
          description: "You have successfully completed the job.",
        });

        // Refresh jobs list
        refetchJobs();

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error completing job:", error);
      toast({
        title: "Error Completing Job",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Cancel a job
  const cancelExistingJob = async (jobId: string) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to cancel this job.",
        variant: "destructive",
      });
      return false;
    }

    if (userRole !== "Sentinel") {
      toast({
        title: "Access Denied",
        description: "Only Sentinels can cancel jobs.",
        variant: "destructive",
      });
      return false;
    }

    try {
      toast({
        title: "Canceling Job",
        description: "Please approve the transaction to cancel this job.",
      });

      const wallet = await primaryWallet.getWalletClient();
      const success = await cancelJob(wallet, jobId);

      if (success) {
        toast({
          title: "Job Canceled",
          description: "You have successfully canceled the job.",
        });

        // Refresh jobs list
        refetchJobs();

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error canceling job:", error);
      toast({
        title: "Error Canceling Job",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    userRole,
    jobs,
    isLoadingJobs,
    createJob,
    applyToJob,
    getApplicants,
    approveApplicant,
    rejectApplicant,
    completeJob: completeExistingJob,
    cancelJob: cancelExistingJob,
    refetchJobs,
  };
};
