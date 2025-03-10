
import { ethers } from "ethers";
import { ProposalEvent, ProposalMetadata } from "@/types/proposals";
import { NFTClass } from "@/services/alchemyService";

export interface JobMetadata {
  title: string;
  description: string;
  category: string;
  reward: string;
  deadline?: number;
  maxApplicants?: number;
  referralReward?: string;
  settlementId?: string;
  coverImage?: string;
  votingDuration: number; // Make required to match ProposalMetadata
  linkedInURL: string; // Make required to match ProposalMetadata
  creator?: string; // Add creator property to fix the error in useJobs.tsx
}

export interface ReferralMetadata {
  name: string;
  description: string;
  rewardPercentage: number;
  extraData?: any;
  title: string; // Make required to match ProposalMetadata
  votingDuration: number; // Make required to match ProposalMetadata
  linkedInURL: string; // Make required to match ProposalMetadata
  type?: string; // Add type property to fix error in referralService.ts
  referrer?: string; // Add for referralService.ts
  createdAt?: number; // Add for referralService.ts
}

export interface Settlement {
  id: string;
  name: string;
  description: string;
  creator?: string;
  partyAddress?: string;
  createdAt: string;
  targetCapital: string;
  totalPledged?: string;
  pledgedAmount?: string;
  backers?: number;
  backerCount?: number;
  status: 'active' | 'funding' | 'completed' | 'failed';
  category?: string;
  remainingTime?: string;
  canInvest?: boolean;
  crowdfundAddress?: string; // Add to fix error in useSettlements.tsx
}

export const formatEther = (amount: ethers.BigNumberish | undefined): string => {
  if (!amount) return "0";
  return ethers.utils.formatEther(amount);
};

export const parseEther = (amount: string): ethers.BigNumber => {
  return ethers.utils.parseEther(amount);
};

export const convertProposalsToSettlements = (
  proposals: ProposalEvent[], 
  userRole: NFTClass = 'Unknown'
): Settlement[] => {
  return proposals.map(proposal => {
    // Extract metadata from the proposal
    const metadata = proposal.metadata || {} as ProposalMetadata;
    
    // Calculate status based on proposal data
    let status: Settlement['status'] = 'active';
    if (proposal.error) {
      status = 'failed';
    } else if (metadata.status) {
      status = metadata.status as Settlement['status'];
    }
    
    // Determine if user can invest based on role
    const canInvest = userRole !== 'Unknown';
    
    return {
      id: proposal.tokenId,
      name: metadata.title || 'Untitled Settlement',
      description: metadata.description || 'No description available',
      creator: proposal.creator,
      createdAt: new Date(metadata.submissionTimestamp || Date.now()).toISOString(),
      targetCapital: metadata.investment?.targetCapital || '0',
      totalPledged: proposal.pledgedAmount || '0',
      backerCount: proposal.voteCount || 0,
      status,
      category: metadata.category,
      canInvest
    };
  });
};

export const processSettlementPermissions = (
  settlements: Settlement[],
  userRole: NFTClass = 'Unknown'
): Settlement[] => {
  // Apply permission rules based on user role
  return settlements.map(settlement => ({
    ...settlement,
    canInvest: userRole !== 'Unknown' // Only authenticated users can invest
  }));
};
