
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { FACTORY_ADDRESS, FACTORY_ABI, RD_PRICE_USD } from "@/lib/constants";

interface ProposalStats {
  totalHolders: number;
  totalLockedValue: number;
  activeProposals: number;
  recentActivities: Array<{
    type: 'vote' | 'create' | 'complete';
    amount: string;
    timestamp: number;
    proposalId: string;
  }>;
  successRate: number;
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
        const fromBlock = Math.max(0, latestBlock - 50000); // Last ~7 days

        // Get all proposal events
        const proposalFilter = contract.filters.ProposalCreated();
        const voteFilter = contract.filters.ProposalVoted();
        const completeFilter = contract.filters.ProposalFullyPledged();

        const [proposalEvents, voteEvents, completeEvents] = await Promise.all([
          contract.queryFilter(proposalFilter, fromBlock, latestBlock),
          contract.queryFilter(voteFilter, fromBlock, latestBlock),
          contract.queryFilter(completeFilter, fromBlock, latestBlock)
        ]);

        // Get unique addresses (holders) from all events
        const uniqueAddresses = new Set<string>();
        voteEvents.forEach(event => {
          if (event.args) uniqueAddresses.add(event.args.voter);
        });
        proposalEvents.forEach(event => {
          if (event.args) uniqueAddresses.add(event.args.creator);
        });

        // Calculate total locked value and active proposals
        let totalLockedValue = ethers.BigNumber.from(0);
        let activeProposals = 0;
        const currentTime = Math.floor(Date.now() / 1000);

        // Process each proposal
        for (const event of proposalEvents) {
          if (!event.args) continue;
          const proposalId = event.args.proposalId.toString();
          const proposalData = await contract.proposals(proposalId);
          
          totalLockedValue = totalLockedValue.add(proposalData.totalPledged);

          if (proposalData.votingEnds.toNumber() > currentTime) {
            activeProposals++;
          }
        }

        // Get recent activities (last 10 events, sorted by timestamp)
        const allActivities = [
          ...voteEvents.map(event => ({
            type: 'vote' as const,
            amount: event.args ? ethers.utils.formatEther(event.args.pledgeAmount) : '0',
            timestamp: event.args ? event.args.timestamp.toNumber() : 0,
            proposalId: event.args ? event.args.proposalId.toString() : '0'
          })),
          ...proposalEvents.map(event => ({
            type: 'create' as const,
            amount: '0',
            timestamp: event.blockNumber,
            proposalId: event.args ? event.args.proposalId.toString() : '0'
          })),
          ...completeEvents.map(event => ({
            type: 'complete' as const,
            amount: event.args ? ethers.utils.formatEther(event.args.totalPledged) : '0',
            timestamp: event.args ? event.args.timestamp.toNumber() : 0,
            proposalId: event.args ? event.args.proposalId.toString() : '0'
          }))
        ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

        // Calculate success rate
        const successRate = completeEvents.length > 0 
          ? (completeEvents.length / proposalEvents.length) * 100 
          : 0;

        // Convert total locked value to USD
        const totalLockedValueUSD = Number(ethers.utils.formatEther(totalLockedValue)) * RD_PRICE_USD;

        return {
          totalHolders: uniqueAddresses.size,
          totalLockedValue: totalLockedValueUSD,
          activeProposals,
          recentActivities: allActivities,
          successRate
        };
      } catch (error) {
        console.error("Error fetching proposal stats:", error);
        return {
          totalHolders: 0,
          totalLockedValue: 0,
          activeProposals: 0,
          recentActivities: [],
          successRate: 0
        };
      }
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });
};
