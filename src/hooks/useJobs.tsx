import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "./use-toast";
import { NFTClass, getPrimaryRole } from "@/services/alchemyService";
import { 
  JobCategory,
  JobListing,
  JobApplication,
  JobReferral,
  createJobListing,
  submitJobReferral,
  acceptJobApplication,
  rejectJobApplication,
  cancelJobListing
} from "@/services/jobService";
import { JobMetadata } from "@/utils/settlementConversion";

// Hook for job-related functionality
export const useJobs = () => {
  const { toast } = useToast();
  const { primaryWallet } = useDynamicContext();
  const [userRole, setUserRole] = useState<NFTClass>('Unknown');
  
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
  
  // Fetch all jobs
  const { data: jobs = [], isLoading: isLoadingJobs, refetch: refetchJobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      // Mock jobs data
      const mockJobs: JobListing[] = [
        {
          id: 'job-001',
          title: 'Settlement Architect',
          description: 'Design and implement a new settlement structure',
          category: 'settlement-building',
          reward: '500',
          deadline: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
          creator: '0x1234...5678',
          creatorRole: 'Sentinel',
          requiredRole: 'Survivor',
          status: 'open',
          maxApplicants: 5,
          referralReward: '50',
          settlementId: 'settlement-001',
          createdAt: Date.now(),
          applications: [
            {
              id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              jobId: 'job-001',
              applicant: '0xabcd...1234',
              status: 'pending' as const,
              submittedAt: Math.floor(Date.now() / 1000),
              createdAt: Math.floor(Date.now() / 1000),
              message: 'Sample message',
              experience: 'Sample experience',
              portfolio: 'Sample portfolio'
            }
          ]
        }
      ];
      
      return mockJobs;
    }
  });
  
  // Fetch user's job listings
  const { data: userJobs = [], isLoading: isLoadingUserJobs } = useQuery({
    queryKey: ['userJobs', primaryWallet?.address],
    queryFn: async () => {
      if (!primaryWallet) return [];
      
      const address = await primaryWallet.address;
      // Filter jobs created by the user
      return jobs.filter(job => job.creator === address) || [];
    },
    enabled: !!primaryWallet && !!jobs.length
  });
  
  // Fetch user's job applications
  const { data: userApplications = [], isLoading: isLoadingUserApplications } = useQuery({
    queryKey: ['userApplications', primaryWallet?.address],
    queryFn: async () => {
      if (!primaryWallet || !jobs.length) return [];
      
      const address = await primaryWallet.address;
      
      // Gather all applications by the user
      const applications: JobApplication[] = [];
      
      jobs.forEach(job => {
        job.applications?.forEach(app => {
          if (app.applicant === address) {
            applications.push(app);
          }
        });
      });
      
      return applications;
    },
    enabled: !!primaryWallet && !!jobs.length
  });

  // For compatibility with JobsDashboard component
  const myApplications = userApplications;
  const isLoadingMyApplications = isLoadingUserApplications;
  const createdJobs = userJobs;
  const isLoadingCreatedJobs = isLoadingUserJobs;
  const availableJobs = jobs;
  const myReferrals: JobReferral[] = [];
  const isLoadingMyReferrals = false;
  const canCreateJob = userRole === 'Sentinel' || userRole === 'Survivor';
  
  // Create a new job listing
  const createJob = async (metadata: Omit<JobMetadata, 'createdAt' | 'creatorRole' | 'votingDuration' | 'linkedInURL'>) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a job listing.",
        variant: "destructive",
      });
      return null;
    }
    
    if (userRole !== 'Sentinel' && userRole !== 'Survivor') {
      toast({
        title: "Access Denied",
        description: "Only Sentinels and Survivors can create job listings.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      toast({
        title: "Creating Job Listing",
        description: "Please approve the transaction to create your job listing.",
      });
      
      const creatorAddress = await primaryWallet.address;
      
      // Create job metadata
      const fullMetadata: JobMetadata = {
        ...metadata,
        creator: creatorAddress,
        creatorRole: userRole,
        createdAt: Math.floor(Date.now() / 1000),
        votingDuration: 7 * 24 * 60 * 60, // 7 days default
        linkedInURL: "https://linkedin.com/in/resistance" // Default placeholder
      };
      
      const jobId = await createJobListing(primaryWallet, fullMetadata);
      
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
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  };
  
  // Submit a job referral
  const submitReferral = async (jobId: string, referredUser: string) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to submit a referral.",
        variant: "destructive",
      });
      return false;
    }
    
    if (userRole !== 'Bounty Hunter') {
      toast({
        title: "Access Denied",
        description: "Only Bounty Hunters can submit referrals.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      toast({
        title: "Submitting Referral",
        description: "Please approve the transaction to submit your referral.",
      });
      
      const success = await submitJobReferral(primaryWallet, jobId, referredUser);
      
      if (success) {
        toast({
          title: "Referral Submitted",
          description: "Your referral has been submitted successfully.",
        });
        
        // Refresh jobs list
        refetchJobs();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error submitting referral:", error);
      toast({
        title: "Error Submitting Referral",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Accept a job application
  const acceptApplication = async (applicationId: string) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to accept the application.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const success = await acceptJobApplication(primaryWallet, applicationId);
      
      if (success) {
        toast({
          title: "Application Accepted",
          description: "The application has been accepted successfully.",
        });
        
        // Refresh jobs list
        refetchJobs();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error accepting application:", error);
      toast({
        title: "Error Accepting Application",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Reject a job application
  const rejectApplication = async (applicationId: string) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to reject the application.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const success = await rejectJobApplication(primaryWallet, applicationId);
      
      if (success) {
        toast({
          title: "Application Rejected",
          description: "The application has been rejected.",
        });
        
        // Refresh jobs list
        refetchJobs();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Error Rejecting Application",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Cancel a job listing
  const cancelJob = async (jobId: string) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to cancel the job.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const success = await cancelJobListing(primaryWallet, jobId);
      
      if (success) {
        toast({
          title: "Job Cancelled",
          description: "The job listing has been cancelled.",
        });
        
        // Refresh jobs list
        refetchJobs();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error cancelling job:", error);
      toast({
        title: "Error Cancelling Job",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    userRole,
    jobs,
    userJobs,
    userApplications,
    isLoadingJobs,
    isLoadingUserJobs,
    isLoadingUserApplications,
    createJob,
    submitReferral,
    acceptApplication,
    rejectApplication,
    cancelJob,
    refetchJobs,
    // Added for compatibility with JobsDashboard
    myApplications,
    isLoadingMyApplications,
    createdJobs,
    isLoadingCreatedJobs,
    availableJobs,
    myReferrals,
    isLoadingMyReferrals,
    canCreateJob,
    primaryRole: userRole
  };
};
