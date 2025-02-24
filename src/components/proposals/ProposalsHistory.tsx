import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { ethers } from "ethers";
import { FACTORY_ADDRESS, FACTORY_ABI, LGR_TOKEN_ADDRESS, LGR_PRICE_USD } from "@/lib/constants";
import { getTokenBalance } from "@/services/tokenService";
import { getFromIPFS } from "@/services/ipfsService";
import { ProposalMetadata, ProposalEvent } from "@/types/proposals";
import { useToast } from "@/hooks/use-toast";
import { IPFSContent } from "@/types/content";
import { loadingStates } from "./LoadingStates";
import { ProposalLoadingCard } from "./ProposalLoadingCard";
import { ProposalListItem } from "./ProposalListItem";

const MIN_LGR_REQUIRED = "1";

interface NFTMetadata extends IPFSContent {
  name: string;
  description: string;
  image?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export const ProposalsHistory = () => {
  const [proposalEvents, setProposalEvents] = useState<ProposalEvent[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingStateIndex, setLoadingStateIndex] = useState(0);
  const [hasMinimumLGR, setHasMinimumLGR] = useState<boolean | null>(null);
  const { isConnected, connect, address } = useWalletConnection();
  const { getProvider } = useWalletProvider();
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatUSDAmount = (lgrAmount: string): string => {
    const amount = parseFloat(lgrAmount);
    if (isNaN(amount)) return "$0.00";
    const usdAmount = amount * LGR_PRICE_USD;
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
    const checkLGRBalance = async () => {
      if (!isConnected || !address) {
        setHasMinimumLGR(null);
        return;
      }

      try {
        const walletProvider = await getProvider();
        const balance = await getTokenBalance(
          walletProvider.provider,
          LGR_TOKEN_ADDRESS,
          address
        );

        const hasEnough = ethers.utils.parseEther(balance).gte(
          ethers.utils.parseEther(MIN_LGR_REQUIRED)
        );
        
        console.log('LGR Balance check:', {
          balance,
          required: MIN_LGR_REQUIRED,
          hasEnough
        });
        
        setHasMinimumLGR(hasEnough);
      } catch (error) {
        console.error("Error checking LGR balance:", error);
        toast({
          title: "Balance Check Failed",
          description: "Failed to verify LGR balance. Please try again.",
          variant: "destructive",
        });
      }
    };

    checkLGRBalance();
  }, [isConnected, address, getProvider]);

  useEffect(() => {
    const fetchProposalMetadata = async (proposal: ProposalEvent, contract: ethers.Contract) => {
      try {
        console.log(`\n=== Processing Proposal #${proposal.tokenId} ===`);
        console.log('Proposal initial data:', proposal);
        
        updateProposalData(proposal.tokenId, { isLoading: true });

        if (!proposal.tokenId) {
          throw new Error("Invalid token ID");
        }

        console.log(`Fetching token URI for #${proposal.tokenId}...`);
        const [tokenUri, pledgedAmount] = await Promise.all([
          contract.tokenURI(proposal.tokenId),
          contract.pledgedAmount(proposal.tokenId).catch(() => ethers.BigNumber.from(0))
        ]);

        console.log(`Token URI for #${proposal.tokenId}:`, tokenUri);
        console.log(`Pledged amount for #${proposal.tokenId}:`, ethers.utils.formatEther(pledgedAmount));

        let metadata: ProposalMetadata | undefined;
        if (tokenUri) {
          console.log(`\nFetching IPFS data for token #${proposal.tokenId}`);
          console.log('Token URI:', tokenUri);
          
          const ipfsHash = tokenUri.replace('ipfs://', '');
          console.log('IPFS Hash:', ipfsHash);
          
          try {
            metadata = await getFromIPFS<ProposalMetadata>(ipfsHash, 'proposal');
            console.log(`\nSuccessfully fetched IPFS data for token #${proposal.tokenId}:`, metadata);
          } catch (ipfsError) {
            console.error(`IPFS fetch error for token #${proposal.tokenId}:`, ipfsError);
            throw new Error(`IPFS fetch failed: ${ipfsError.message}`);
          }
        }

        updateProposalData(proposal.tokenId, {
          metadata,
          pledgedAmount: ethers.utils.formatEther(pledgedAmount),
          isLoading: false
        });

      } catch (error: any) {
        console.error(`\nError processing token #${proposal.tokenId}:`, error);
        updateProposalData(proposal.tokenId, {
          isLoading: false,
          error: error.message
        });
      }
    };

    const fetchProposalData = async () => {
      if (!isConnected || !hasMinimumLGR) return;

      try {
        setIsInitialLoading(true);
        const walletProvider = await getProvider();
        console.log('Initializing contract to fetch proposals...');
        
        const contract = new ethers.Contract(
          FACTORY_ADDRESS,
          FACTORY_ABI,
          walletProvider.provider
        );

        const filter = contract.filters.ProposalCreated();
        const events = await contract.queryFilter(filter);
        console.log('Found proposal events:', events.length);

        const initialProposals = events
          .map(event => {
            if (!event.args) {
              console.warn('Event missing args:', event);
              return null;
            }
            
            const proposal: ProposalEvent = {
              tokenId: event.args.tokenId.toString(),
              creator: event.args.creator,
              blockNumber: event.blockNumber,
              transactionHash: event.transactionHash,
              isLoading: true
            };
            
            return proposal;
          })
          .filter((proposal): proposal is ProposalEvent => proposal !== null);

        initialProposals.sort((a, b) => b.blockNumber - a.blockNumber);
        setProposalEvents(initialProposals);
        setIsInitialLoading(false);

        for (const proposal of initialProposals) {
          await fetchProposalMetadata(proposal, contract);
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
  }, [isConnected, hasMinimumLGR, getProvider]);

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

  if (hasMinimumLGR === false) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6 text-center text-white/60">
          <p>You need at least {MIN_LGR_REQUIRED} LGR to view proposals</p>
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
