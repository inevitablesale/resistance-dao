import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useToast } from "./use-toast";
import {
  NFTClass,
  getPrimaryRole,
  getNFTsForOwner,
} from "@/services/alchemyService";
import {
  createJobListing,
  getJobs,
  Job,
  applyForJob,
  getJobApplicants,
  JobApplicant,
  approveJobApplicant,
  rejectJobApplicant,
  completeJob,
  cancelJob,
} from "@/services/jobService";
import { JobMetadata } from "@/utils/settlementConversion";

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

    if (userRole !== "Settlement Owner") {
      toast({
        title: "Access Denied",
        description: "Only Settlement Owners can create jobs.",
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

      const jobId = await createJobListing(wallet, metadata);

      if (jobId) {
        toast({
          title: "Job Created",
          description: "Your job listing has been created successfully.",
        });

        // Refresh jobs list
        refetchJobs();

        return jobId;
      }

      return null;
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

    if (userRole !== "Settlement Owner") {
      toast({
        title: "Access Denied",
        description: "Only Settlement Owners can approve job applicants.",
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

    if (userRole !== "Settlement Owner") {
      toast({
        title: "Access Denied",
        description: "Only Settlement Owners can reject job applicants.",
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

    if (userRole !== "Settlement Owner") {
      toast({
        title: "Access Denied",
        description: "Only Settlement Owners can complete jobs.",
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

    if (userRole !== "Settlement Owner") {
      toast({
        title: "Access Denied",
        description: "Only Settlement Owners can cancel jobs.",
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
