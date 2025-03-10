
import { IPFSContent } from "./content";

export type JobStatus = 'open' | 'filled' | 'completed' | 'cancelled';

// Mapping job statuses to proposal statuses
export const mapJobStatusToProposalStatus = (
  status: JobStatus
): 'active' | 'completed' | 'funded' | 'failed' => {
  switch (status) {
    case 'open':
      return 'active';
    case 'filled':
      return 'funded';
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'failed';
    default:
      return 'active';
  }
};

export interface JobMetadata {
  title: string;
  description: string;
  category: string;
  reward: string;
  deadline?: number;
  maxApplicants?: number;
  referralReward?: string;
  votingDuration: number;
  linkedInURL: string;
  creator?: string;
  status?: JobStatus;
  applicants?: string[];
  [key: string]: any;
}

export interface JobApplication {
  applicant: string;
  jobId: string;
  appliedAt: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Job {
  id: string;
  metadata: JobMetadata;
  applications: JobApplication[];
}
