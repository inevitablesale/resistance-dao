
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { FACTORY_ADDRESS, FACTORY_ABI, RD_PRICE_USD } from "@/lib/constants";

interface ProposalStats {
  totalProjects: number;
  totalLockedValue: number;
  activeProposals: number;
}

export const useProposalStats = () => {
  return useQuery({
    queryKey: ['proposal-stats'],
    queryFn: async (): Promise<ProposalStats> => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

        // Get latest block for reference
        const latestBlock = await provider.getBlockNumber();
        const fromBlock = Math.max(0, latestBlock - 50000);

        // Get all proposal creation events
        const filter = contract.filters.ProposalCreated();
        const events = await contract.queryFilter(filter, fromBlock, latestBlock);

        // Calculate total locked value and active proposals
        let totalLockedValue = ethers.BigNumber.from(0);
        let activeProposals = 0;
        const currentTime = Math.floor(Date.now() / 1000);

        // Process each proposal
        for (const event of events) {
          if (!event.args) continue;
          const proposalId = event.args.proposalId.toString();
          const proposalData = await contract.proposals(proposalId);
          
          // Add to total locked value
          totalLockedValue = totalLockedValue.add(proposalData.totalPledged);

          // Check if proposal is active
          if (proposalData.votingEnds.toNumber() > currentTime) {
            activeProposals++;
          }
        }

        // Convert total locked value to USD (RD price is now $1)
        const totalLockedValueUSD = Number(ethers.utils.formatEther(totalLockedValue)) * RD_PRICE_USD;

        return {
          totalProjects: events.length,
          totalLockedValue: totalLockedValueUSD,
          activeProposals
        };
      } catch (error) {
        console.error("Error fetching proposal stats:", error);
        return {
          totalProjects: 0,
          totalLockedValue: 0,
          activeProposals: 0
        };
      }
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });
};
