
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, ArrowRight, MapPin, Globe, DollarSign, Users, TrendingUp } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";

const MIN_LGR_REQUIRED = "1"; // 1 LGR required to view proposals

// Enum mappings for display
const firmSizeMap = ['Below $1M', '$1M-$5M', '$5M-$10M', '$10M+'];
const dealTypeMap = ['Acquisition', 'Merger', 'Equity Buyout', 'Franchise', 'Succession'];
const geoFocusMap = ['Local', 'Regional', 'National', 'Remote'];

interface EnrichedProposal extends StoredProposal {
  progress: {
    current: string;
    target: string;
    percentage: number;
  };
  firmSize: string;
  dealType: string;
  geographicFocus: string;
  location: string;
  votingEnds: Date;
  strategies: {
    paymentTerms: string[];
    operational: string[];
    growth: string[];
    integration: string[];
  };
}

export const ProposalsHistory = () => {
  const [proposals, setProposals] = useState<EnrichedProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMinimumLGR, setHasMinimumLGR] = useState<boolean | null>(null);
  const { isConnected, connect, address } = useWalletConnection();
  const { getProvider } = useWalletProvider();
  const { toast } = useToast();
  const navigate = useNavigate();

  const transformProposalData = async (
    provider: ethers.providers.Web3Provider,
    contract: ethers.Contract,
    event: any
  ): Promise<EnrichedProposal> => {
    const tokenId = event.args?.tokenId;
    const proposalData = await contract.proposals(tokenId);
    const pledgedAmount = await contract.pledgedAmount(tokenId);

    // Map arrays to readable strings
    const paymentTermsMap = ['Cash', 'Seller Financing', 'Earnout', 'Equity Rollover', 'Bank Financing'];
    const operationalMap = ['Tech Modernization', 'Process Standardization', 'Staff Retention'];
    const growthMap = ['Geographic Expansion', 'Service Expansion', 'Client Growth'];
    const integrationMap = ['Merging Operations', 'Culture Integration', 'Systems Consolidation'];

    const progress = {
      current: ethers.utils.formatEther(pledgedAmount),
      target: ethers.utils.formatEther(proposalData.targetCapital),
      percentage: pledgedAmount.mul(100).div(proposalData.targetCapital).toNumber()
    };

    return {
      hash: tokenId.toString(),
      ipfsHash: proposalData.ipfsMetadata,
      timestamp: event.blockNumber.toString(),
      title: proposalData.title,
      targetCapital: ethers.utils.formatEther(proposalData.targetCapital),
      status: pledgedAmount.gte(proposalData.targetCapital)
        ? 'completed'
        : Date.now() >= proposalData.votingEnds.toNumber() * 1000
          ? 'failed'
          : 'pending',
      isTestMode: false,
      progress,
      firmSize: firmSizeMap[proposalData.firmSize],
      dealType: dealTypeMap[proposalData.dealType],
      geographicFocus: geoFocusMap[proposalData.geographicFocus],
      location: proposalData.location,
      votingEnds: new Date(proposalData.votingEnds.toNumber() * 1000),
      strategies: {
        paymentTerms: proposalData.paymentTerms.map((i: number) => paymentTermsMap[i]),
        operational: proposalData.operationalStrategies.map((i: number) => operationalMap[i]),
        growth: proposalData.growthStrategies.map((i: number) => growthMap[i]),
        integration: proposalData.integrationStrategies.map((i: number) => integrationMap[i])
      }
    };
  };

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

        const proposalPromises = events.map(event => 
          transformProposalData(walletProvider.provider, contract, event)
        );

        const proposalsList = await Promise.all(proposalPromises);
        console.log('Processed proposals:', proposalsList);
        
        // Sort by newest first
        proposalsList.sort((a, b) => 
          parseInt(b.timestamp) - parseInt(a.timestamp)
        );
        
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
            <div className="space-y-4">
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

              {/* Additional Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <MapPin className="w-4 h-4" />
                  <span>{proposal.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Globe className="w-4 h-4" />
                  <span>{proposal.geographicFocus}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <DollarSign className="w-4 h-4" />
                  <span>{proposal.firmSize}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Users className="w-4 h-4" />
                  <span>{proposal.dealType}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Progress</span>
                  <span className="text-white">{proposal.progress.percentage}%</span>
                </div>
                <Progress value={proposal.progress.percentage} className="h-2" />
                <div className="flex justify-between text-sm text-white/60">
                  <span>{proposal.progress.current} LGR</span>
                  <span>{proposal.progress.target} LGR</span>
                </div>
              </div>

              {/* Strategy Tags */}
              <div className="flex flex-wrap gap-2">
                {proposal.strategies.paymentTerms.slice(0, 2).map((term, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-purple-500/10 text-purple-400 rounded">
                    {term}
                  </span>
                ))}
                {proposal.strategies.paymentTerms.length > 2 && (
                  <span className="px-2 py-1 text-xs bg-purple-500/10 text-purple-400 rounded">
                    +{proposal.strategies.paymentTerms.length - 2} more
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

