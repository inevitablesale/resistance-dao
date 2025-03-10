
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { PartyProposal } from "@/types/proposals";
import { PARTY_PROTOCOL, PARTY_GOVERNANCE_ABI } from "@/lib/constants";

export const useProposals = (partyAddress?: string) => {
  return useQuery({
    queryKey: ['proposals', partyAddress],
    queryFn: async (): Promise<PartyProposal[]> => {
      if (!partyAddress) return [];
      
      try {
        // This is a mock implementation for now
        // In a real implementation, you would query the Party contract for proposals
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(partyAddress, PARTY_GOVERNANCE_ABI, provider);
        
        // Example: Query proposal count and retrieve each proposal
        // const proposalCount = await contract.proposalCount();
        
        // For now, return mock data
        const mockProposals: PartyProposal[] = [
          {
            id: '1',
            title: 'Fund Distribution to Contributors',
            description: 'This proposal will allocate 5 ETH to the development team for their work on establishing the settlement infrastructure.',
            proposer: '0x1234567890123456789012345678901234567890',
            status: 'active',
            votesFor: 15,
            votesAgainst: 5,
            createdAt: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
            timeRemaining: '6 days',
            transactions: [
              {
                target: '0x2345678901234567890123456789012345678901',
                value: '5',
                calldata: '0x',
                signature: 'transfer(address,uint256)'
              }
            ]
          },
          {
            id: '2',
            title: 'Update Settlement Rules',
            description: 'Modify the settlement governance rules to require 60% majority for all future proposals.',
            proposer: '0x1234567890123456789012345678901234567890',
            status: 'passed',
            votesFor: 25,
            votesAgainst: 3,
            createdAt: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
            timeRemaining: '0 days',
            transactions: [
              {
                target: partyAddress,
                value: '0',
                calldata: '0x',
                signature: 'updateVotingSettings(uint256)'
              }
            ]
          },
          {
            id: '3',
            title: 'Resource Allocation for Defense',
            description: 'Allocate 2 ETH for securing the settlement perimeter with enhanced protection mechanisms.',
            proposer: '0x3456789012345678901234567890123456789012',
            status: 'executed',
            votesFor: 30,
            votesAgainst: 1,
            createdAt: Math.floor(Date.now() / 1000) - 345600, // 4 days ago
            timeRemaining: '0 days',
            transactions: [
              {
                target: '0x4567890123456789012345678901234567890123',
                value: '2',
                calldata: '0x',
                signature: 'fundSecurity()'
              }
            ]
          },
        ];
        
        return mockProposals;
      } catch (error) {
        console.error("Error fetching proposals:", error);
        return [];
      }
    },
    enabled: !!partyAddress,
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};
