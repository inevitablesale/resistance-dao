
import { ProposalEvent } from "@/types/proposals";
import { NFTClass } from "@/services/alchemyService";

export interface Settlement {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  creator: string;
  imageUrl?: string;
  targetCapital: string;
  pledgedAmount: string;
  backers: number;
  status: 'active' | 'funding' | 'completed' | 'failed';
  remainingTime?: string;
  partyAddress?: string;
  crowdfundAddress?: string;
  totalPledged?: string;
  backerCount?: number;
  category?: string;
  // Role-based permissions
  canInvest?: boolean;
  canPropose?: boolean;
  canVote?: boolean;
}

// Add JobMetadata and ReferralMetadata interfaces
export interface JobMetadata {
  title: string;
  description: string;
  category: string;
  reward: string;
  deadline: number;
  creator: string;
  creatorRole: NFTClass;
  requiredRole: NFTClass;
  maxApplicants: number;
  referralReward: string;
  settlementId: string;
  createdAt: number;
  // Required ProposalMetadata fields
  votingDuration: number;
  linkedInURL: string;
}

export interface ReferralMetadata {
  title: string; // Required for ProposalMetadata
  name: string;
  description: string;
  type: string;
  referrer: string;
  rewardPercentage: number;
  createdAt: number;
  // Required ProposalMetadata fields
  votingDuration: number;
  linkedInURL: string;
}

export const convertProposalToSettlement = (
  proposal: ProposalEvent,
  userRole?: NFTClass
): Settlement => {
  const settlement: Settlement = {
    id: proposal.tokenId,
    name: proposal.metadata?.title || "Untitled Settlement",
    description: proposal.metadata?.description || "No description available",
    createdAt: new Date(proposal.blockNumber * 1000).toISOString(), // Approximate based on block
    creator: proposal.creator,
    imageUrl: proposal.metadata?.image,
    targetCapital: proposal.metadata?.investment?.targetCapital || "0",
    pledgedAmount: proposal.pledgedAmount || "0",
    backers: proposal.voteCount || 0,
    status: 'active',
    remainingTime: "30 days", // Default or placeholder
    partyAddress: "",
    crowdfundAddress: "",
    totalPledged: proposal.pledgedAmount || "0",
    backerCount: proposal.voteCount || 0,
    category: proposal.metadata?.category
  };
  
  // Apply default permissions based on user role if provided
  if (userRole) {
    settlement.canInvest = userRole === 'Sentinel';
    settlement.canPropose = ['Sentinel', 'Survivor'].includes(userRole);
    settlement.canVote = userRole !== 'Unknown';
  }
  
  return settlement;
};

export const convertProposalsToSettlements = (
  proposals: ProposalEvent[],
  userRole?: NFTClass
): Settlement[] => {
  return proposals.map(proposal => convertProposalToSettlement(proposal, userRole));
};
