import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { StoredProposal } from "@/types/proposals";
import { Card, CardContent } from "@/components/ui/card";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { ethers } from "ethers";
import { FACTORY_ADDRESS, FACTORY_ABI, LGR_TOKEN_ADDRESS } from "@/lib/constants";
import { getTokenBalance } from "@/services/tokenService";
import { useToast } from "@/hooks/use-toast";

const MIN_LGR_REQUIRED = "1"; // 1 LGR required to view proposals

export const ProposalsHistory = () => {
  const [proposals, setProposals] = useState<StoredProposal[]>([]);
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
    const fetchProposals = async () => {
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

        const proposalPromises = events.map(async (event) => {
          const tokenId = event.args?.[0];
          const creator = event.args?.[1];
          
          console.log('Fetching proposal data for tokenId:', tokenId.toString());
          const proposalData = await contract.proposals(tokenId);
          const pledgedAmount = await contract.pledgedAmount(tokenId);
          
          console.log('Proposal data received:', {
            title: proposalData.title,
            ipfsHash: proposalData.ipfsMetadata,
            pledged: ethers.utils.formatEther(pledgedAmount)
          });

          // Explicitly type the status as one of the allowed values
          const status: StoredProposal['status'] = pledgedAmount.gte(proposalData.targetCapital) 
            ? 'completed' 
            : Date.now() >= proposalData.votingEnds.toNumber() * 1000 
              ? 'failed' 
              : 'pending';

          const proposal: StoredProposal = {
            hash: tokenId.toString(),
            ipfsHash: proposalData.ipfsMetadata,
            timestamp: event.blockNumber.toString(),
            title: proposalData.title,
            targetCapital: ethers.utils.formatEther(proposalData.targetCapital),
            status,
            isTestMode: false
          };

          return proposal;
        });

        const proposalsList = await Promise.all(proposalPromises);
        console.log('Processed proposals:', proposalsList);
        setProposals(proposalsList);
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

    fetchProposals();
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

  if (proposals.length === 0) {
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
        {proposals.map((proposal, index) => (
          <motion.div
            key={proposal.hash}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/proposals/${proposal.hash}`)}
            className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-purple-500/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{proposal.title}</h3>
                    {proposal.isTestMode && (
                      <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-500 rounded">
                        Test
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(parseInt(proposal.timestamp) * 1000), 'PPP')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  proposal.status === 'pending' && "bg-yellow-500/10 text-yellow-500",
                  proposal.status === 'completed' && "bg-green-500/10 text-green-500",
                  proposal.status === 'failed' && "bg-red-500/10 text-red-500"
                )}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </div>
                <ArrowRight className="w-4 h-4 text-white/60" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
