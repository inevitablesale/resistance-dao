
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

// Cache mechanism to prevent excessive calls
let cachedProposalStats: ProposalStats | null = null;
let statsCacheTimestamp = 0;
const STATS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProposalStats = (enabled = true) => {
  return useQuery({
    queryKey: ['proposal-stats'],
    queryFn: async (): Promise<ProposalStats> => {
      // Check if we have cached data that's still fresh
      const now = Date.now();
      if (cachedProposalStats && (now - statsCacheTimestamp) < STATS_CACHE_DURATION) {
        console.log("Using cached proposal stats, age:", (now - statsCacheTimestamp) / 1000, "seconds");
        return cachedProposalStats;
      }
      
      try {
        console.log("Cache expired or not available, fetching new proposal stats");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

        // Get latest block for reference
        const latestBlock = await provider.getBlockNumber();
        console.log('Current block for stats:', latestBlock);

        // Get all events from genesis block
        const proposalFilter = contract.filters.ProposalCreated();
        const voteFilter = contract.filters.ProposalVoted();
        const completeFilter = contract.filters.ProposalFullyPledged();

        console.log('Fetching all historical events for stats...');
        
        const [proposalEvents, voteEvents, completeEvents] = await Promise.all([
          contract.queryFilter(proposalFilter, 0, latestBlock),
          contract.queryFilter(voteFilter, 0, latestBlock),
          contract.queryFilter(completeFilter, 0, latestBlock)
        ]);

        console.log('Found events:', {
          proposals: proposalEvents.length,
          votes: voteEvents.length,
          completes: completeEvents.length
        });

        // Get unique addresses (holders) from all events
        const uniqueAddresses = new Set<string>();
        voteEvents.forEach(event => {
          if (event.args) uniqueAddresses.add(event.args.voter);
        });
        proposalEvents.forEach(event => {
          if (event.args) uniqueAddresses.add(event.args.creator);
        });

        // Calculate total locked value from all vote events
        let totalLockedValue = ethers.BigNumber.from(0);
        voteEvents.forEach(event => {
          if (event.args) {
            totalLockedValue = totalLockedValue.add(event.args.pledgeAmount);
          }
        });

        // Get active proposals count
        let activeProposals = 0;
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Safe way to process proposals without causing excessive calls
        try {
          // Only check the first 10 proposals to avoid excessive calls
          const proposalIds = proposalEvents.map(event => 
            event.args ? event.args.proposalId.toString() : '0'
          ).slice(0, 10);
          
          for (const proposalId of proposalIds) {
            try {
              const proposalData = await contract.proposals(proposalId);
              if (proposalData.votingEnds.toNumber() > currentTime) {
                activeProposals++;
              }
            } catch (err) {
              console.log(`Error fetching proposal ${proposalId}, skipping: ${err}`);
              // Continue with the next proposal instead of failing
            }
          }
        } catch (err) {
          console.error("Error checking proposals:", err);
          // Default to the number of proposal events as an estimate
          activeProposals = proposalEvents.length;
        }

        // Get recent activities (last 5 events, sorted by timestamp)
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
        ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5); // Changed from 10 to 5

        // Calculate success rate
        const successRate = completeEvents.length > 0 
          ? (completeEvents.length / proposalEvents.length) * 100 
          : 0;

        // Convert total locked value to USD
        const totalLockedValueUSD = Number(ethers.utils.formatEther(totalLockedValue)) * RD_PRICE_USD;

        console.log('Stats calculated:', {
          holders: uniqueAddresses.size,
          lockedValue: totalLockedValueUSD,
          activeProposals,
          activities: allActivities.length,
          successRate
        });

        const stats = {
          totalHolders: uniqueAddresses.size,
          totalLockedValue: totalLockedValueUSD,
          activeProposals,
          recentActivities: allActivities,
          successRate
        };
        
        // Cache the new results
        cachedProposalStats = stats;
        statsCacheTimestamp = now;
        
        return stats;
      } catch (error) {
        console.error("Error fetching proposal stats:", error);
        
        // Return default values if something goes wrong
        return {
          totalHolders: 0,
          totalLockedValue: 0,
          activeProposals: 0,
          recentActivities: [],
          successRate: 0
        };
      }
    },
    // Set a longer stale time to prevent excessive refetching
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Only refetch every 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled // Add enabled flag to control when the query runs
  });
};
