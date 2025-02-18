import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, Users, Target } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { ethers } from "ethers";
import { FACTORY_ADDRESS, FACTORY_ABI, LGR_TOKEN_ADDRESS } from "@/lib/constants";
import { getTokenBalance } from "@/services/tokenService";
import { useToast } from "@/hooks/use-toast";
import { getFromIPFS } from "@/services/ipfsService";
import { ProposalMetadata } from "@/types/proposals";

const MIN_LGR_REQUIRED = "1"; // 1 LGR required to view proposals

interface ProposalEvent {
  tokenId: string;
  creator: string;
  blockNumber: number;
  transactionHash: string;
  metadata?: ProposalMetadata;
  pledgedAmount?: string;
}

export const ProposalsHistory = () => {
  const [proposalEvents, setProposalEvents] = useState<ProposalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMinimumLGR, setHasMinimumLGR] = useState<boolean | null>(null);
  const { isConnected, connect, address } = useWalletConnection();
  const { getProvider } = useWalletProvider();
  const { toast } = useToast();
  const navigate = useNavigate();

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
        const contract = new ethers.Contract(
          FACTORY_ADDRESS,
          FACTORY_ABI,
          walletProvider.provider
        );

        // Get all ProposalCreated events
        const filter = contract.filters.ProposalCreated();
        const events = await contract.queryFilter(filter);
        console.log('Found proposal events:', events.length);

        // Process events and fetch metadata
        const proposalsWithMetadata = await Promise.all(
          events.map(async (event) => {
            const tokenId = event.args?.tokenId.toString();
            const baseProposal = {
              tokenId,
              creator: event.args?.creator,
              blockNumber: event.blockNumber,
              transactionHash: event.transactionHash
            };

            try {
              // Get token URI (IPFS hash) and pledged amount
              const [tokenURI, pledgedAmount] = await Promise.all([
                contract.tokenURI(tokenId),
                contract.pledgedAmount(tokenId)
              ]);

              console.log(`Fetching metadata for proposal #${tokenId} from IPFS:`, tokenURI);
              const metadata = await getFromIPFS<ProposalMetadata>(tokenURI, 'proposal');

              return {
                ...baseProposal,
                metadata,
                pledgedAmount: ethers.utils.formatEther(pledgedAmount)
              };
            } catch (error) {
              console.error(`Error fetching metadata for proposal #${tokenId}:`, error);
              return baseProposal;
            }
          })
        );

        // Sort by newest first (highest block number)
        proposalsWithMetadata.sort((a, b) => b.blockNumber - a.blockNumber);
        
        console.log('Processed proposals with metadata:', proposalsWithMetadata);
        setProposalEvents(proposalsWithMetadata);
      } catch (error) {
        console.error("Error fetching proposals:", error);
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
          <p>You need at least {MIN_LGR_REQUIRED} LGR to view proposals.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-white/60">Loading proposals...</p>
        </CardContent>
      </Card>
    );
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
          <motion.div
            key={event.tokenId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/proposals/${event.tokenId}`)}
            className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-purple-500/20 transition-colors cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white">
                        {event.metadata?.title || `Proposal #${event.tokenId}`}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(event.blockNumber * 1000), 'PPP')}</span>
                      </div>
                      {event.metadata && (
                        <>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            <span>{ethers.utils.formatEther(event.metadata.investment.targetCapital)} LGR Target</span>
                          </div>
                          {event.pledgedAmount && (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{event.pledgedAmount} LGR Pledged</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
