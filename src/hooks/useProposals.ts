import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { PartyProposal } from "@/types/proposals";
import { ProposalStatus } from "@/types/content";
import { PARTY_PROTOCOL, PARTY_GOVERNANCE_ABI } from "@/lib/constants";

export const useProposals = (partyAddress?: string) => {
  return useQuery({
    queryKey: ['proposals', partyAddress],
    queryFn: async (): Promise<PartyProposal[]> => {
      if (!partyAddress) return [];
      
      try {
        console.log("Fetching proposals for party:", partyAddress);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(partyAddress, PARTY_GOVERNANCE_ABI, provider);
        
        // Get the total proposal count from the contract
        const proposalCount = await contract.proposalCount();
        console.log(`Found ${proposalCount.toString()} proposals`);
        
        const proposals: PartyProposal[] = [];
        
        // Fetch each proposal's details
        for (let i = 0; i < proposalCount.toNumber(); i++) {
          try {
            const proposalId = await contract.proposals(i);
            console.log(`Fetching details for proposal ID: ${proposalId.toString()}`);
            
            // Get the proposal details
            const proposal = await contract.getProposal(proposalId);
            const proposalStatus = await contract.getProposalStatus(proposalId);
            const votes = await contract.getProposalVotes(proposalId);
            
            // Get metadata for the proposal
            let title = "Proposal " + proposalId.toString();
            let description = "";
            
            try {
              if (proposal.proposalData && proposal.proposalData.length > 0) {
                // Try to decode the metadata from the proposal data
                const metadataHash = proposal.proposalData.metadataUri || "";
                if (metadataHash && metadataHash.startsWith("ipfs://")) {
                  // In a real implementation, fetch from IPFS
                  console.log("Would fetch metadata from IPFS:", metadataHash);
                  // For now, use placeholder
                  title = "On-chain Proposal " + proposalId.toString();
                  description = "This proposal's details are stored on-chain.";
                }
              }
            } catch (metadataError) {
              console.error("Error fetching proposal metadata:", metadataError);
            }
            
            // Calculate time remaining if the proposal is active
            let timeRemaining = "0 days";
            if (proposal.proposalEndTime) {
              const endTime = proposal.proposalEndTime.toNumber();
              const currentTime = Math.floor(Date.now() / 1000);
              
              if (endTime > currentTime) {
                const remainingSeconds = endTime - currentTime;
                const remainingDays = Math.floor(remainingSeconds / 86400);
                timeRemaining = `${remainingDays} days`;
                if (remainingDays === 0) {
                  const remainingHours = Math.floor(remainingSeconds / 3600);
                  timeRemaining = `${remainingHours} hours`;
                }
              }
            }
            
            // Get transactions associated with the proposal
            const transactions = [];
            
            if (proposal.proposalData && proposal.proposalData.actions) {
              for (const action of proposal.proposalData.actions) {
                transactions.push({
                  target: action.target,
                  value: ethers.utils.formatEther(action.value || 0),
                  calldata: action.data || "0x",
                  signature: action.signature || ""
                });
              }
            }
            
            const parsedProposal: PartyProposal = {
              id: proposalId.toString(),
              title: title,
              description: description,
              proposer: proposal.proposer || "",
              status: mapContractStatusToUIStatus(proposalStatus),
              votesFor: votes.votesFor ? parseInt(ethers.utils.formatUnits(votes.votesFor, 0)) : 0,
              votesAgainst: votes.votesAgainst ? parseInt(ethers.utils.formatUnits(votes.votesAgainst, 0)) : 0,
              createdAt: proposal.proposalTime ? proposal.proposalTime.toNumber() : Math.floor(Date.now() / 1000) - 86400,
              timeRemaining: timeRemaining,
              transactions: transactions.length > 0 ? transactions : [
                {
                  target: partyAddress,
                  value: "0",
                  calldata: "0x",
                  signature: ""
                }
              ]
            };
            
            proposals.push(parsedProposal);
          } catch (proposalError) {
            console.error(`Error fetching proposal ${i}:`, proposalError);
          }
        }
        
        // If no proposals found through contract or there was an error, provide fallback
        if (proposals.length === 0) {
          console.warn("No proposals found or error fetching proposals. Using fallback mechanism.");
          
          // Log that we're in fallback mode but will implement real contract calls soon
          console.info("Fallback mode: This will be replaced with real contract data soon");
          
          // Return mock proposals for now to keep the UI working
          // This will be replaced with real contract data as development continues
          return getFallbackProposals(partyAddress);
        }
        
        return proposals;
      } catch (error) {
        console.error("Error fetching proposals:", error);
        
        // Return mock proposals for now to keep the UI working
        return getFallbackProposals(partyAddress);
      }
    },
    enabled: !!partyAddress,
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};

// Map contract status codes to UI status
function mapContractStatusToUIStatus(statusCode: number): ProposalStatus {
  // These mappings need to be adjusted based on the actual contract status codes
  switch (statusCode) {
    case 0: return "active";
    case 1: return "passed";
    case 2: return "ready";
    case 3: return "executed";
    case 4: return "cancelled";
    case 5: return "defeated";
    case 6: return "expired";
    default: return "active";
  }
}

// Fallback function for development until contract integration is complete
function getFallbackProposals(partyAddress: string): PartyProposal[] {
  console.log("Using fallback proposal data for development");
  
  return [
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
    }
  ];
}
