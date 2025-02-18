
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/lib/constants";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { getFromIPFS } from "@/services/ipfsService";
import { ProposalMetadata } from "@/types/proposals";
import { ProposalLoadingState } from "@/types/loadingStates";

export interface ProposalData {
  tokenId: string;
  creator: string;
  blockNumber: number;
  transactionHash: string;
  title: string;
  ipfsMetadata: string;
  targetCapital: ethers.BigNumber;
  votingEnds: number;
  metadata?: ProposalMetadata;
  pledgedAmount?: string;
}

interface UseProposalDataReturn {
  proposals: ProposalData[];
  loadingStates: ProposalLoadingState[];
  refresh: () => Promise<void>;
}

export const useProposalData = (): UseProposalDataReturn => {
  const { getProvider } = useWalletProvider();
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [loadingStates, setLoadingStates] = useState<ProposalLoadingState[]>([]);

  const updateLoadingState = (tier: 'events' | 'onchain' | 'ipfs', isLoading: boolean, error: string | null = null) => {
    setLoadingStates(prev => {
      const existing = prev.find(state => state.tier === tier);
      if (existing) {
        return prev.map(state => 
          state.tier === tier ? { ...state, isLoading, error } : state
        );
      }
      return [...prev, { tier, isLoading, error }];
    });
  };

  const fetchData = async () => {
    try {
      // Tier 1: Event Data
      updateLoadingState('events', true);
      const walletProvider = await getProvider();
      const contract = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        walletProvider.provider
      );

      const filter = contract.filters.ProposalCreated();
      const events = await contract.queryFilter(filter);
      console.log('Found proposal events:', events.length);
      updateLoadingState('events', false);

      // Tier 2: On-chain Data
      updateLoadingState('onchain', true);
      const proposalsWithOnChain = await Promise.all(
        events.map(async (event) => {
          const tokenId = event.args?.tokenId.toString();
          try {
            const [proposalData, pledgedAmount] = await Promise.all([
              contract.proposals(tokenId),
              contract.pledgedAmount(tokenId)
            ]);

            return {
              tokenId,
              creator: event.args?.creator,
              blockNumber: event.blockNumber,
              transactionHash: event.transactionHash,
              title: proposalData.title,
              ipfsMetadata: proposalData.ipfsMetadata,
              targetCapital: proposalData.targetCapital,
              votingEnds: proposalData.votingEnds.toNumber(),
              pledgedAmount: ethers.utils.formatEther(pledgedAmount)
            };
          } catch (error) {
            console.error(`Error fetching on-chain data for proposal #${tokenId}:`, error);
            return null;
          }
        })
      );
      updateLoadingState('onchain', false);

      // Tier 3: IPFS Data
      updateLoadingState('ipfs', true);
      const proposalsWithMetadata = await Promise.all(
        proposalsWithOnChain
          .filter((p): p is NonNullable<typeof p> => p !== null)
          .map(async (proposal) => {
            if (proposal.ipfsMetadata) {
              try {
                const metadata = await getFromIPFS<ProposalMetadata>(
                  proposal.ipfsMetadata,
                  'proposal'
                );
                return { ...proposal, metadata };
              } catch (error) {
                console.error(`Error fetching IPFS data for proposal #${proposal.tokenId}:`, error);
                return proposal;
              }
            }
            return proposal;
          })
      );
      updateLoadingState('ipfs', false);

      // Sort by newest first
      proposalsWithMetadata.sort((a, b) => b.blockNumber - a.blockNumber);
      setProposals(proposalsWithMetadata);
    } catch (error) {
      console.error("Error in data fetching:", error);
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      updateLoadingState('events', false, message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    proposals,
    loadingStates,
    refresh: fetchData
  };
};
