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
import { ProposalMetadata } from "@/types/proposals";
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

interface ProposalEvent {
  tokenId: string;
  creator: string;
  blockNumber: number;
  transactionHash: string;
  metadata?: ProposalMetadata;
  nftMetadata?: NFTMetadata;
  pledgedAmount?: string;
}

export const ProposalsHistory = () => {
  const [proposalEvents, setProposalEvents] = useState<ProposalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
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
  }, [isLoading]);

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
    const fetchProposalData = async () => {
      if (!isConnected || !hasMinimumLGR) return;

      try {
        setIsLoading(true);
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

        const proposalsWithMetadata = await Promise.all(
          events.map(async (event) => {
            const tokenId = event.args?.tokenId.toString();
            console.log(`\n--- Processing token #${tokenId} ---`);
            console.log(`Fetching proposal data for token #${tokenId}`);

            try {
              console.log(`Getting tokenURI and pledged amount for #${tokenId}...`);
              const [tokenUri, pledgedAmount] = await Promise.all([
                contract.tokenURI(tokenId),
                contract.pledgedAmount(tokenId)
              ]);

              console.log(`NFT metadata URI for token #${tokenId}:`, tokenUri);
              console.log(`Pledged amount for token #${tokenId}:`, ethers.utils.formatEther(pledgedAmount));

              let metadata: ProposalMetadata | undefined;
              if (tokenUri) {
                try {
                  console.log(`Starting IPFS fetch for token #${tokenId}`);
                  const ipfsHash = tokenUri.replace('ipfs://', '');
                  console.log(`IPFS hash for token #${tokenId}:`, ipfsHash);
                  
                  metadata = await getFromIPFS<ProposalMetadata>(
                    ipfsHash,
                    'proposal'
                  );
                  console.log(`Successfully fetched IPFS data for token #${tokenId}:`, metadata);
                } catch (ipfsError: any) {
                  console.error(`Error fetching IPFS metadata for proposal #${tokenId}:`, {
                    error: ipfsError,
                    message: ipfsError.message,
                    stack: ipfsError.stack
                  });
                }
              } else {
                console.warn(`No tokenURI found for token #${tokenId}`);
              }

              const proposalEvent: ProposalEvent = {
                tokenId,
                creator: event.args?.creator,
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                metadata,
                pledgedAmount: ethers.utils.formatEther(pledgedAmount)
              };

              console.log(`Completed processing token #${tokenId}:`, proposalEvent);
              return proposalEvent;
            } catch (error: any) {
              console.error(`Error processing token #${tokenId}:`, {
                error,
                message: error.message,
                stack: error.stack
              });
              return {
                tokenId,
                creator: event.args?.creator,
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash
              };
            }
          })
        );

        console.log('All proposals processed. Final result:', proposalsWithMetadata);
        proposalsWithMetadata.sort((a, b) => b.blockNumber - a.blockNumber);
        setProposalEvents(proposalsWithMetadata);
      } catch (error: any) {
        console.error("Error fetching proposals:", {
          error,
          message: error.message,
          stack: error.stack
        });
        toast({
          title: "Error",
          description: "Failed to load proposals. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposalData();
  }, [isConnected, hasMinimumLGR, getProvider]);

  if (!isConnected) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6 text-center">
          <p className="text-white/60 mb-4">Connect your wallet to view proposals</p>
          <Button onClick={connect} className="bg-purple-500 hover:bg-purple-600">
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

  if (isLoading) {
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
            className="mt-2 text-purple-400"
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
          />
        ))}
      </div>
    </div>
  );
};
