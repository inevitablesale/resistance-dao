
export interface IPFSContent {
  contentSchema: string;
  contentType: string;
  title: string;
  content: string;
  metadata: {
    author?: string;
    publishedAt?: number;
    version?: number;
    language?: string;
    tags?: string[];
    coverImage?: string;
    attachments?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

// Define Bounty metadata interface for IPFS storage
export interface BountyMetadata extends IPFSContent {
  bountyType: "nft_referral" | "token_referral" | "social_media";
  rewardAmount: number;
  totalBudget: number;
  allowPublicHunters: boolean;
  maxReferralsPerHunter: number;
  requireVerification: boolean;
  eligibleNFTs: string[];
  successCriteria: string;
  createdAt: number;
  expiresAt: number;
  crowdfundAddress?: string;
  status?: "active" | "paused" | "expired" | "completed";
}

// Define common status types for referrals
export type ReferralStatus = 'active' | 'claimed' | 'expired' | 'completed' | 'pending' | 'rejected' | 'paid';

// Define governance proposal status types to match Party Protocol
export type ProposalStatus = 'active' | 'passed' | 'ready' | 'executed' | 'cancelled' | 'defeated' | 'expired';
