
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
  bountyType: "nft_referral" | "token_referral" | "social_media" | "token_distribution";
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
  
  // New fields for token distribution
  tokenRewards?: {
    tokenAddress: string;
    tokenType: "erc20" | "erc721" | "erc1155";
    tokenIds?: string[];     // For NFTs
    amountPerReferral?: number; // For fungible tokens
    totalTokens?: number;    // Total tokens allocated to the bounty
    decimals?: number;       // For ERC20 tokens
    remainingTokens?: number;
    distributionStrategy?: "first-come" | "proportional" | "milestone" | "lottery";
  };
  
  // Project-specific fields
  projectInfo?: {
    name: string;
    website?: string;
    logoUrl?: string;
    socialLinks?: {
      twitter?: string;
      discord?: string;
      telegram?: string;
      [key: string]: string | undefined;
    };
    launchDate?: number;
    tokenomics?: string;
    whitepaper?: string;
  };
  
  // Tracking and analytics
  analytics?: {
    clicks?: number;
    conversions?: number;
    conversionRate?: number;
    topReferrers?: string[];
    referralsByRegion?: {[region: string]: number};
    [key: string]: any;
  };
}

// Define common status types for referrals
export type ReferralStatus = 'active' | 'claimed' | 'expired' | 'completed' | 'pending' | 'rejected' | 'paid';

// Define governance proposal status types to match Party Protocol
export type ProposalStatus = 'active' | 'passed' | 'ready' | 'executed' | 'cancelled' | 'defeated' | 'expired';

// Token Distribution Types
export interface TokenDistributionConfig {
  tokenAddress: string;
  tokenType: "erc20" | "erc721" | "erc1155";
  tokenIds?: string[];
  amountPerReferral?: number;
  strategy: "first-come" | "proportional" | "milestone" | "lottery";
  requireVerification: boolean;
  verificationMethod?: "manual" | "automatic" | "social" | "onchain";
}

export interface ReferralToken {
  id: string;
  bountyId: string;
  tokenAddress: string;
  tokenId?: string;
  tokenType: "erc20" | "erc721" | "erc1155";
  amount?: number;
  status: "available" | "reserved" | "claimed";
  claimedBy?: string;
  claimedAt?: number;
  transactionHash?: string;
}
