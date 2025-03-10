
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useToast } from '@/hooks/use-toast';
import { useNFTRoles } from '@/hooks/useNFTRoles';
import { 
  createJobListing,
  applyForJob,
  submitJobReferral,
  acceptJobApplication,
  rejectJobApplication,
  cancelJobListing,
  JobListing,
  JobApplication,
  JobReferral,
  JobCategory
} from '@/services/jobService';

export const useJobs = () => {
  const { primaryWallet } = useDynamicContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { primaryRole, isLoading: isLoadingRole } = useNFTRoles();
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  
  // Mock data for development - this would be replaced with real data in production
  const mockJobs: JobListing[] = [
    {
      id: 'job-1',
      title: 'Settlement Security Audit',
      description: 'We need a thorough security audit of our settlement perimeter defenses.',
      creator: '0x1234567890123456789012345678901234567890',
      creatorRole: 'Sentinel',
      category: 'security',
      reward: '0.5',
      deadline: Math.floor(Date.now() / 1000) + 604800, // 1 week from now
      partyAddress: '0x1234567890123456789012345678901234567890',
      status: 'open',
      createdAt: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
      requiredRole: 'Bounty Hunter',
      maxApplicants: 5,
      referralReward: '0.05'
    },
    {
      id: 'job-2',
      title: 'Resource Gathering Expedition',
      description: 'Looking for survivors to gather resources in the Eastern Wasteland.',
      creator: '0x2345678901234567890123456789012345678901',
      creatorRole: 'Sentinel',
      category: 'resource-gathering',
      reward: '0.3',
      deadline: Math.floor(Date.now() / 1000) + 432000, // 5 days from now
      partyAddress: '0x2345678901234567890123456789012345678901',
      status: 'open',
      createdAt: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
      requiredRole: 'Survivor',
      maxApplicants: 10
    },
    {
      id: 'job-3',
      title: 'Protocol Development Task',
      description: 'We need a developer to implement a new feature in our settlement management protocol.',
      creator: '0x3456789012345678901234567890123456789012',
      creatorRole: 'Survivor',
      category: 'protocol-development',
      reward: '1.2',
      deadline: Math.floor(Date.now() / 1000) + 1209600, // 2 weeks from now
      partyAddress: '0x3456789012345678901234567890123456789012',
      status: 'open',
      createdAt: Math.floor(Date.now() / 1000) - 259200, // 3 days ago
      requiredRole: 'Survivor',
      maxApplicants: 3,
      referralReward: '0.1',
      settlementId: 'settlement-1'
    }
  ];
  
  const mockApplications: JobApplication[] = [
    {
      id: 'app-1',
      jobId: 'job-1',
      applicant: primaryWallet?.address || '0x4567890123456789012345678901234567890123',
      applicantRole: 'Bounty Hunter',
      proposalId: '1',
      status: 'pending',
      message: 'I have extensive experience in security audits and can help secure your settlement.',
      createdAt: Math.floor(Date.now() / 1000) - 43200 // 12 hours ago
    }
  ];
  
  const mockReferrals: JobReferral[] = [
    {
      id: 'ref-1',
      jobId: 'job-1',
      applicant: '0x5678901234567890123456789012345678901234',
      referrer: primaryWallet?.address || '0x6789012345678901234567890123456789012345',
      referrerRole: 'Bounty Hunter',
      status: 'pending',
      rewardAmount: '0.05',
      proposalId: '2',
      createdAt: Math.floor(Date.now() / 1000) - 21600 // 6 hours ago
    }
  ];
  
  // Query to get all available jobs
  const { 
    data: availableJobs = mockJobs,
    isLoading: isLoadingJobs,
    refetch: refetchJobs
  } = useQuery({
    queryKey: ['jobs', 'available'],
    queryFn: async () => {
      // In production, this would fetch from blockchain or indexed events
      return mockJobs.filter(job => job.status === 'open');
    }
  });
  
  // Query to get jobs created by the current user
  const { 
    data: createdJobs = [],
    isLoading: isLoadingCreatedJobs,
    refetch: refetchCreatedJobs
  } = useQuery({
    queryKey: ['jobs', 'created', primaryWallet?.address],
    queryFn: async () => {
      // In production, this would fetch from blockchain or indexed events
      return mockJobs.filter(job => 
        job.creator === primaryWallet?.address
      );
    },
    enabled: !!primaryWallet?.address
  });
  
  // Query to get job applications by the current user
  const { 
    data: myApplications = [],
    isLoading: isLoadingMyApplications,
    refetch: refetchMyApplications
  } = useQuery({
    queryKey: ['jobs', 'applications', primaryWallet?.address],
    queryFn: async () => {
      // In production, this would fetch from blockchain or indexed events
      return mockApplications.filter(app => 
        app.applicant === primaryWallet?.address
      );
    },
    enabled: !!primaryWallet?.address
  });
  
  // Query to get job referrals by the current user
  const { 
    data: myReferrals = [],
    isLoading: isLoadingMyReferrals,
    refetch: refetchMyReferrals
  } = useQuery({
    queryKey: ['jobs', 'referrals', primaryWallet?.address],
    queryFn: async () => {
      // In production, this would fetch from blockchain or indexed events
      return mockReferrals.filter(ref => 
        ref.referrer === primaryWallet?.address
      );
    },
    enabled: !!primaryWallet?.address
  });
  
  // Query to get applications for a specific job
  const useJobApplications = (jobId: string) => {
    return useQuery({
      queryKey: ['job-applications', jobId],
      queryFn: async () => {
        // In production, this would fetch from blockchain or indexed events
        return mockApplications.filter(app => app.jobId === jobId);
      },
      enabled: !!jobId
    });
  };
  
  // Query to get referrals for a specific job
  const useJobReferrals = (jobId: string) => {
    return useQuery({
      queryKey: ['job-referrals', jobId],
      queryFn: async () => {
        // In production, this would fetch from blockchain or indexed events
        return mockReferrals.filter(ref => ref.jobId === jobId);
      },
      enabled: !!jobId
    });
  };
  
  // Query to get a specific job by ID
  const useJobDetails = (jobId: string) => {
    return useQuery({
      queryKey: ['job', jobId],
      queryFn: async () => {
        // In production, this would fetch from blockchain or indexed events
        const job = mockJobs.find(j => j.id === jobId);
        if (!job) throw new Error("Job not found");
        return job;
      },
      enabled: !!jobId
    });
  };
  
  // Mutation to create a new job listing
  const createJobMutation = useMutation({
    mutationFn: async (jobData: Omit<JobListing, 'id' | 'partyAddress' | 'createdAt' | 'status' | 'creator' | 'creatorRole'>) => {
      if (!primaryWallet) throw new Error("Wallet not connected");
      if (!primaryRole) throw new Error("Role not determined");
      
      // Only Sentinels and Survivors can create jobs
      if (primaryRole !== 'Sentinel' && primaryRole !== 'Survivor') {
        throw new Error(`Only Sentinels and Survivors can create jobs. Your role: ${primaryRole}`);
      }
      
      setIsCreatingJob(true);
      try {
        return await createJobListing(primaryWallet, jobData);
      } finally {
        setIsCreatingJob(false);
      }
    },
    onSuccess: (newJob) => {
      toast({
        title: "Job Created!",
        description: `Your job "${newJob.title}" has been listed`,
      });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create job",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Mutation to apply for a job
  const applyForJobMutation = useMutation({
    mutationFn: async ({
      jobId,
      jobPartyAddress,
      message,
      referrer
    }: {
      jobId: string;
      jobPartyAddress: string;
      message: string;
      referrer?: string;
    }) => {
      if (!primaryWallet) throw new Error("Wallet not connected");
      
      return await applyForJob(
        primaryWallet,
        jobId,
        jobPartyAddress,
        message,
        referrer
      );
    },
    onSuccess: (application) => {
      toast({
        title: "Application Submitted!",
        description: `Your application for job ${application.jobId} has been submitted`,
      });
      queryClient.invalidateQueries({ queryKey: ['jobs', 'applications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to apply for job",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Mutation to submit a job referral
  const submitReferralMutation = useMutation({
    mutationFn: async ({
      jobId,
      jobPartyAddress,
      applicantAddress
    }: {
      jobId: string;
      jobPartyAddress: string;
      applicantAddress: string;
    }) => {
      if (!primaryWallet) throw new Error("Wallet not connected");
      if (primaryRole !== 'Bounty Hunter') {
        throw new Error("Only Bounty Hunters can submit referrals");
      }
      
      return await submitJobReferral(
        primaryWallet,
        jobId,
        jobPartyAddress,
        applicantAddress
      );
    },
    onSuccess: (referral) => {
      toast({
        title: "Referral Submitted!",
        description: `Your referral for ${referral.applicant.substring(0, 6)}... has been submitted`,
      });
      queryClient.invalidateQueries({ queryKey: ['jobs', 'referrals'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit referral",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Mutation to accept a job application
  const acceptApplicationMutation = useMutation({
    mutationFn: async ({
      jobPartyAddress,
      proposalId,
      applicantAddress
    }: {
      jobPartyAddress: string;
      proposalId: string;
      applicantAddress: string;
    }) => {
      if (!primaryWallet) throw new Error("Wallet not connected");
      
      return await acceptJobApplication(
        primaryWallet,
        jobPartyAddress,
        proposalId,
        applicantAddress
      );
    },
    onSuccess: (txHash) => {
      toast({
        title: "Application Accepted!",
        description: `Transaction: ${txHash.substring(0, 10)}...`,
      });
      queryClient.invalidateQueries({ queryKey: ['jobs', 'job-applications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to accept application",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Mutation to reject a job application
  const rejectApplicationMutation = useMutation({
    mutationFn: async ({
      jobPartyAddress,
      proposalId
    }: {
      jobPartyAddress: string;
      proposalId: string;
    }) => {
      if (!primaryWallet) throw new Error("Wallet not connected");
      
      return await rejectJobApplication(
        primaryWallet,
        jobPartyAddress,
        proposalId
      );
    },
    onSuccess: (txHash) => {
      toast({
        title: "Application Rejected",
        description: `Transaction: ${txHash.substring(0, 10)}...`,
      });
      queryClient.invalidateQueries({ queryKey: ['jobs', 'job-applications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to reject application",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Mutation to cancel a job listing
  const cancelJobMutation = useMutation({
    mutationFn: async ({
      jobPartyAddress
    }: {
      jobPartyAddress: string;
    }) => {
      if (!primaryWallet) throw new Error("Wallet not connected");
      
      return await cancelJobListing(
        primaryWallet,
        jobPartyAddress
      );
    },
    onSuccess: (txHash) => {
      toast({
        title: "Job Cancelled",
        description: `Transaction: ${txHash.substring(0, 10)}...`,
      });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to cancel job",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Check if user can create a job based on their role
  const canCreateJob = primaryRole === 'Sentinel' || primaryRole === 'Survivor';
  
  // Check if user can apply for a job
  const canApplyForJob = (job: JobListing) => {
    if (!primaryRole) return false;
    
    // If job requires a specific role
    if (job.requiredRole && job.requiredRole !== primaryRole) {
      return false;
    }
    
    return true;
  };
  
  // Check if user can refer for a job
  const canReferForJob = primaryRole === 'Bounty Hunter';
  
  return {
    // Job listings
    availableJobs,
    isLoadingJobs,
    refetchJobs,
    
    // Created jobs
    createdJobs,
    isLoadingCreatedJobs,
    refetchCreatedJobs,
    
    // Applications
    myApplications,
    isLoadingMyApplications,
    refetchMyApplications,
    
    // Referrals
    myReferrals,
    isLoadingMyReferrals,
    refetchMyReferrals,
    
    // Job details
    useJobDetails,
    useJobApplications,
    useJobReferrals,
    
    // Mutations
    createJob: createJobMutation.mutate,
    isCreatingJob,
    applyForJob: applyForJobMutation.mutate,
    submitReferral: submitReferralMutation.mutate,
    acceptApplication: acceptApplicationMutation.mutate,
    rejectApplication: rejectApplicationMutation.mutate,
    cancelJob: cancelJobMutation.mutate,
    
    // Permissions
    canCreateJob,
    canApplyForJob,
    canReferForJob,
    
    // Role info
    isLoadingRole,
    primaryRole
  };
};
