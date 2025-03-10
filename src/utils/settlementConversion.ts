
import { ProposalEvent } from "@/types/proposals";

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
  status: 'active' | 'completed' | 'failed';
  remainingTime?: string;
}

export const convertProposalToSettlement = (proposal: ProposalEvent): Settlement => {
  return {
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
    remainingTime: "30 days" // Default or placeholder
  };
};

export const convertProposalsToSettlements = (proposals: ProposalEvent[]): Settlement[] => {
  return proposals.map(convertProposalToSettlement);
};
