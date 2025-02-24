import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { ethers } from "ethers";
import { FACTORY_ADDRESS, FACTORY_ABI, RD_TOKEN_ADDRESS, RD_PRICE_USD } from "@/lib/constants";
import { getTokenBalance } from "@/services/tokenService";
import { getFromIPFS } from "@/services/ipfsService";
import { ProposalMetadata, ProposalEvent } from "@/types/proposals";
import { useToast } from "@/hooks/use-toast";
import { loadingStates } from "./LoadingStates";
import { ProposalLoadingCard } from "./ProposalLoadingCard";
import { ProposalListItem } from "./ProposalListItem";

const MIN_RD_REQUIRED = "1";

export const ProposalsHistory = () => {
  const [proposalEvents, setProposalEvents] = useState<ProposalEvent[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingStateIndex, setLoadingStateIndex] = useState(0);
  const [hasMinimumRD, setHasMinimumRD] = useState<boolean | null>(null);
  const { isConnected, connect, address } = useWalletConnection();
  const { getProvider } = useWalletProvider();
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatUSDAmount = (rdAmount: string): string => {
    const amount = parseFloat(rdAmount);
    if (isNaN(amount)) return "$0.00";
    const usdAmount = amount * RD_PRICE_USD;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(usdAmount);
  };

  const updateProposalData = (tokenId: string, updates: Partial<ProposalEvent>) => {
    setProposalEvents(current =>
      current.map(event =>
        event.tokenId === tokenId
          ? { ...event, ...updates }
          : event
      )
    );
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isInitialLoading) {
      const cycleLoadingStates = () => {
        setLoadingStateIndex(prev => {
          if (prev < loadingStates.length - 1) {
            timeoutId = setTimeout(cycleLoadingStates, 1000);
            return prev + 1;
          }
          return prev;
        });
      };

      timeoutId = setTimeout(cycleLoadingStates, 1000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isInitialLoading]);

  useEffect(() => {
    const checkRDBalance = async () => {
      if (!isConnected || !address) {
        setHasMinimumRD(null);
        return;
      }

      try {
        const walletProvider = await getProvider();
        const balance = await getTokenBalance(
          walletProvider.provider,
          RD_TOKEN_ADDRESS,
          address
        );

        const hasEnough = ethers.utils.parseEther(balance).gte(
          ethers.utils.parseEther(MIN_RD_REQUIRED)
        );
        
        console.log('RD Balance check:', {
          balance,
          required: MIN_RD_REQUIRED,
          hasEnough
        });
        
        setHasMinimumRD(hasEnough);
      } catch (error) {
        console.error("Error checking RD balance:", error);
        toast({
          title: "Balance Check Failed",
          description: "Failed to verify RD balance. Please try again.",
          variant: "destructive",
        });
      }
    };

    checkRDBalance();
  }, [isConnected, address, getProvider]);

  useEffect(() => {
    const fetchProposalMetadata = async (proposal: ProposalEvent, contract: ethers.Contract) => {
      try {
        console.log(`\n=== Fetching metadata for proposal #${proposal.tokenId} ===`);
        
        updateProposalData(proposal.tokenId, { isLoading: true });

        // Get token URI
        console.log('Getting token URI from contract...');
        const tokenUri = await contract.tokenURI(proposal.tokenId);
        console.log('Token URI:', tokenUri);

        // Get pledged amount from proposals mapping
        console.log('Getting pledged amount...');
        const proposalData = await contract.proposals(proposal.tokenId);
        const pledgedAmount = proposalData.totalPledged;
        console.log('Pledged amount:', ethers.utils.formatEther(pledgedAmount), 'RD');

        if (tokenUri) {
          console.log('Fetching IPFS data...');
          try {
            const metadata = await getFromIPFS<ProposalMetadata>(
              tokenUri.replace('ipfs://', ''),
              'proposal'
            );
            console.log('IPFS metadata retrieved:', metadata);

            updateProposalData(proposal.tokenId, {
              metadata,
              pledgedAmount: ethers.utils.formatEther(pledgedAmount),
              isLoading: false
            });
          } catch (ipfsError) {
            console.error('IPFS fetch error:', ipfsError);
            updateProposalData(proposal.tokenId, {
              isLoading: false,
              error: `IPFS fetch failed: ${ipfsError.message}`
            });
          }
        }
      } catch (error: any) {
        console.error(`Error processing proposal #${proposal.tokenId}:`, error);
        updateProposalData(proposal.tokenId, {
          isLoading: false,
          error: error.message
        });
      }
    };

    const fetchProposalData = async () => {
      if (!isConnected || !hasMinimumRD) return;

      try {
        setIsInitialLoading(true);
        const walletProvider = await getProvider();
        console.log('\n=== Fetching Proposals ===');
        console.log('Using Factory Address:', FACTORY_ADDRESS);
        
        const contract = new ethers.Contract(
          FACTORY_ADDRESS,
          FACTORY_ABI,
          walletProvider.provider
        );

        // Get latest block for reference
        const latestBlock = await walletProvider.provider.getBlockNumber();
        console.log('Current block:', latestBlock);

        // Get event logs from the last 10000 blocks or from block 0 if chain is shorter
        const fromBlock = Math.max(0, latestBlock - 10000);
        console.log('Fetching events from block:', fromBlock);

        const filter = contract.filters.ProposalCreated();
        console.log('Querying ProposalCreated events...');
        const events = await contract.queryFilter(filter, fromBlock, latestBlock);
        console.log('Found events:', events.length);
        
        console.log('Event details:', events.map(e => ({
          blockNumber: e.blockNumber,
          args: e.args ? {
            proposalId: e.args.proposalId?.toString(),
            creator: e.args.creator
          } : 'No args'
        })));

        const initialProposals = events
          .map(event => {
            if (!event.args) {
              console.warn('Event missing args:', event);
              return null;
            }
            
            const proposal: ProposalEvent = {
              tokenId: event.args.proposalId.toString(),
              creator: event.args.creator,
              blockNumber: event.blockNumber,
              transactionHash: event.transactionHash,
              isLoading: true
            };
            
            return proposal;
          })
          .filter((proposal): proposal is ProposalEvent => proposal !== null);

        console.log('Processed proposals:', initialProposals);

        if (initialProposals.length === 0) {
          console.log('No proposals found in events');
          setIsInitialLoading(false);
          return;
        }

        // Sort by block number (newest first)
        initialProposals.sort((a, b) => b.blockNumber - a.blockNumber);
        setProposalEvents(initialProposals);
        setIsInitialLoading(false);

        // Fetch metadata for each proposal with delay to avoid rate limiting
        for (const proposal of initialProposals) {
          try {
            await fetchProposalMetadata(proposal, contract);
            // Add small delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
            console.error(`Error fetching metadata for proposal ${proposal.tokenId}:`, error);
          }
        }

      } catch (error: any) {
        console.error("Error fetching proposals:", error);
        toast({
          title: "Error",
          description: "Failed to load proposals. Please try again.",
          variant: "destructive",
        });
        setIsInitialLoading(false);
      }
    };

    fetchProposalData();
  }, [isConnected, hasMinimumRD, getProvider]);

  if (!isConnected) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6 text-center">
          <p className="text-white/60 mb-4">Connect your wallet to view proposals</p>
          <Button onClick={connect} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (hasMinimumRD === false) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6 text-center text-white/60">
          <p>You need at least {MIN_RD_REQUIRED} RD to view proposals</p>
        </CardContent>
      </Card>
    );
  }

  if (isInitialLoading) {
    return <ProposalLoadingCard loadingState={loadingStates[loadingStateIndex]} />;
  }

  if (proposalEvents.length === 0) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6 text-center text-white/60">
          <p>No proposals found.</p>
          <Button 
            variant="link" 
            onClick={() => navigate('/thesis')}
            className="mt-2 text-blue-400"
          >
            Create your first proposal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {proposalEvents.map((event, index) => (
          <ProposalListItem
            key={event.tokenId}
            index={index}
            tokenId={event.tokenId}
            metadata={event.metadata}
            pledgedAmount={event.pledgedAmount}
            blockNumber={event.blockNumber}
            formatUSDAmount={formatUSDAmount}
            isLoading={event.isLoading}
            error={event.error}
          />
        ))}
      </div>
    </div>
  );
};
