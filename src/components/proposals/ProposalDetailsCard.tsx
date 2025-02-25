import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { isPast, formatDistanceToNow } from 'date-fns';
import { useProposal } from '@/hooks/useProposal';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from "framer-motion";
import { 
  Coins, Clock, ChevronDown, Info, PieChart, Users, ExternalLink, 
  BrainCircuit, Twitter, Github, Calendar, Gift, Target, ArrowUpRight, User
} from "lucide-react";
import { ProposalLoadingCard } from './ProposalLoadingCard';
import { formatRDAmount } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useWalletProvider } from '@/hooks/useWalletProvider';
import { ProposalMetadata } from '@/types/proposals';
import { getTokenBalance } from '@/services/tokenService';
import { 
  FACTORY_ADDRESS, 
  FACTORY_ABI, 
  RD_TOKEN_ADDRESS,
  MIN_LGR_REQUIRED 
} from '@/lib/constants';
import { getFromIPFS } from '@/services/ipfsService';
import { loadingStates } from './ProposalLoadingCard';

interface ProposalDetailsCardProps {
  tokenId?: string;
  view?: 'overview' | 'details' | 'investment';
}

export const ProposalDetailsCard = ({ tokenId, view = 'overview' }: ProposalDetailsCardProps) => {
  const { toast } = useToast();
  const { isConnected, connect, address } = useWalletConnection();
  const { getProvider } = useWalletProvider();
  const [proposalDetails, setProposalDetails] = useState<ProposalMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [pledgedAmount, setPledgedAmount] = useState<string>("0");
  const [backerCount, setBackerCount] = useState(0);
  const [pledgeInput, setPledgeInput] = useState("");
  const [isPledging, setIsPledging] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isVotingEnded, setIsVotingEnded] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const VOTING_FEE = ethers.utils.parseEther("10");

  const formatUSDAmount = (lgrAmount: string): string => {
    const amount = parseFloat(lgrAmount);
    if (isNaN(amount)) return "$0.00";
    const LGR_PRICE_USD = 0.10;
    const usdAmount = amount * LGR_PRICE_USD;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(usdAmount);
  };

  useEffect(() => {
    console.log('Proposal details effect running...', {
      tokenId,
      isConnected
    });

    if (!tokenId) {
      console.log('No token ID provided');
      toast({
        title: "Invalid Proposal ID",
        description: "Please provide a valid proposal ID.",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      console.log('Wallet not connected');
      return;
    }

    const fetchProposalDetails = async () => {
      setIsLoading(true);
      setLoadingProgress(20);

      try {
        console.log('Getting wallet provider...');
        const walletProvider = await getProvider();
        console.log('Initializing contract...');
        
        const factoryContract = new ethers.Contract(
          FACTORY_ADDRESS,
          FACTORY_ABI,
          walletProvider.provider
        );
        setLoadingProgress(40);

        console.log(`Getting tokenURI, pledged amount, and vote events for token #${tokenId}`);
        
        // Get proposal details from the proposals mapping
        const proposalData = await factoryContract.proposals(tokenId);
        const tokenUri = await factoryContract.tokenURI(tokenId);
        setLoadingProgress(50);

        console.log('Querying ProposalVoted events...');
        const filter = factoryContract.filters.ProposalVoted(tokenId, null);
        const events = await factoryContract.queryFilter(filter);
        
        console.log('Token URI:', tokenUri);
        console.log('Pledged amount:', ethers.utils.formatEther(proposalData.totalPledged));
        console.log('Vote events count:', events.length);
        
        setPledgedAmount(ethers.utils.formatEther(proposalData.totalPledged));
        setBackerCount(events.length);
        setLoadingProgress(60);

        if (tokenUri) {
          console.log('Starting IPFS fetch for metadata');
          const ipfsHash = tokenUri.replace('ipfs://', '');
          console.log('IPFS hash:', ipfsHash);
          
          const metadata = await getFromIPFS<ProposalMetadata>(
            ipfsHash,
            'proposal'
          );
          console.log('Successfully fetched IPFS data:', metadata);
          setProposalDetails(metadata);
        } else {
          console.warn('No tokenURI found for this proposal');
          throw new Error('No metadata found for this proposal');
        }
        
        setLoadingProgress(100);
      } catch (error: any) {
        console.error("Error fetching proposal details:", error);
        toast({
          title: "Failed to Load Proposal",
          description: error.message || "Could not retrieve proposal details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposalDetails();
  }, [tokenId, isConnected, getProvider, toast]);

  useEffect(() => {
    if (proposalDetails?.submissionTimestamp && proposalDetails?.votingDuration) {
      const updateTimeRemaining = () => {
        const endTimestamp = proposalDetails.submissionTimestamp + (proposalDetails.votingDuration * 1000);
        const endDate = new Date(endTimestamp);
        
        if (isPast(endDate)) {
          setIsVotingEnded(true);
          setTimeRemaining("Voting ended");
        } else {
          setIsVotingEnded(false);
          setTimeRemaining(`ends in ${formatDistanceToNow(endDate)}`);
        }
      };

      updateTimeRemaining();
      const timer = setInterval(updateTimeRemaining, 1000);
      return () => clearInterval(timer);
    }
  }, [proposalDetails]);

  const handlePledge = async () => {
    if (!tokenId || !isConnected || !pledgeInput) return;
    
    setIsPledging(true);
    try {
      const walletProvider = await getProvider();
      const signer = walletProvider.provider.getSigner();

      console.log('Checking balance for voting fee');
      const balance = await getTokenBalance(
        walletProvider.provider,
        RD_TOKEN_ADDRESS,
        address!
      );
      const userBalance = ethers.utils.parseEther(balance);
      
      if (userBalance.lt(VOTING_FEE)) {
        throw new Error("Insufficient RD balance. You need 10 RD to cover the voting fee.");
      }

      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        walletProvider.provider.getSigner()
      );

      const rdToken = new ethers.Contract(
        RD_TOKEN_ADDRESS,
        ["function approve(address spender, uint256 amount) returns (bool)"],
        signer
      );
      
      console.log('Approving voting fee:', ethers.utils.formatEther(VOTING_FEE));
      const approveTx = await rdToken.approve(FACTORY_ADDRESS, VOTING_FEE);
      await approveTx.wait();

      const pledgeAmountBN = ethers.utils.parseEther(pledgeInput);
      const tx = await factoryContract.vote(tokenId, pledgeAmountBN);
      await tx.wait();

      toast({
        title: "Support Pledged Successfully",
        description: `Your commitment of ${pledgeInput} RD has been recorded. The 10 RD voting fee has been processed.`,
      });

      setPledgedAmount(prev => {
        const currentAmount = ethers.utils.parseEther(prev);
        const newAmount = currentAmount.add(pledgeAmountBN);
        return ethers.utils.formatEther(newAmount);
      });
      
      setBackerCount(prev => prev + 1);
      setPledgeInput("");
    } catch (error: any) {
      console.error("Pledging error:", error);
      let errorMessage = error.message || "Failed to submit pledge. Please try again.";
      if (error.message.includes("Voting fee transfer failed")) {
        errorMessage = "Failed to transfer voting fee. Please ensure you have 10 RD available.";
      }
      toast({
        title: "Pledging Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsPledging(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-zinc-400 text-lg">Connect your wallet to view proposal details</p>
            <Button 
              onClick={connect} 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg"
            >
              Connect Wallet
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <ProposalLoadingCard 
          loadingState={loadingStates[Math.floor((loadingProgress / 100) * loadingStates.length)]} 
        />
      </motion.div>
    );
  }

  if (!proposalDetails) {
    return (
      <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <p className="text-zinc-400 text-lg">The requested proposal could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  if (view === 'overview') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
          <CardHeader>
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center space-x-2 bg-blue-900/20 rounded-full px-4 py-2">
                  <BrainCircuit className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400">{proposalDetails.category}</span>
                </div>
                {proposalDetails.blockchain?.map((chain) => (
                  <span key={chain} className="px-3 py-1 text-xs font-medium bg-blue-900/20 text-blue-400 rounded-full">
                    {chain}
                  </span>
                ))}
              </div>
              
              <div>
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                  {proposalDetails.title}
                </h1>
                <p className="text-lg text-zinc-400">{proposalDetails.description}</p>
              </div>

              {(proposalDetails.team && proposalDetails.team.length > 0) && (
                <div className="pt-4">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-400" />
                    Team
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {proposalDetails.team.map((member, index) => (
                      <div key={index} className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-white font-medium">{member.name}</p>
                            <p className="text-zinc-400 text-sm">{member.role}</p>
                          </div>
                          <div className="flex gap-2">
                            {member.linkedin && (
                              <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                                className="p-2 rounded-full bg-blue-900/20 hover:bg-blue-900/40 transition-colors">
                                <ExternalLink className="w-4 h-4 text-blue-400" />
                              </a>
                            )}
                            {member.github && (
                              <a href={member.github} target="_blank" rel="noopener noreferrer"
                                className="p-2 rounded-full bg-blue-900/20 hover:bg-blue-900/40 transition-colors">
                                <Github className="w-4 h-4 text-blue-400" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(proposalDetails.roadmap && proposalDetails.roadmap.length > 0) && (
                <div className="pt-4">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-400" />
                    Roadmap
                  </h3>
                  <div className="space-y-4">
                    {proposalDetails.roadmap.map((milestone, index) => (
                      <div key={index} className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-white font-medium">{milestone.milestone}</p>
                            <p className="text-zinc-400 text-sm">Expected: {milestone.expectedDate}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            milestone.status === 'Completed' ? 'bg-green-900/20 text-green-400' :
                            milestone.status === 'In Progress' ? 'bg-blue-900/20 text-blue-400' :
                            'bg-zinc-800 text-zinc-400'
                          }`}>
                            {milestone.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {proposalDetails.backerIncentives && (
                <div className="pt-4">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Gift className="w-6 h-6 text-blue-400" />
                    Backer Incentives
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {proposalDetails.backerIncentives.utility && (
                      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
                        <p className="text-zinc-400 text-sm">Utility</p>
                        <p className="text-white">{proposalDetails.backerIncentives.utility}</p>
                      </div>
                    )}
                    {proposalDetails.backerIncentives.governance && (
                      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
                        <p className="text-zinc-400 text-sm">Governance</p>
                        <p className="text-white">{proposalDetails.backerIncentives.governance}</p>
                      </div>
                    )}
                    {proposalDetails.backerIncentives.NFTRewards && (
                      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
                        <p className="text-zinc-400 text-sm">NFT Rewards</p>
                        <p className="text-white">{proposalDetails.backerIncentives.NFTRewards}</p>
                      </div>
                    )}
                    {proposalDetails.backerIncentives.tokenAllocation && (
                      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
                        <p className="text-zinc-400 text-sm">Token Allocation</p>
                        <p className="text-white">{proposalDetails.backerIncentives.tokenAllocation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {proposalDetails.socials && (
                <div className="flex flex-wrap gap-3">
                  {proposalDetails.socials.twitter && (
                    <a href={proposalDetails.socials.twitter} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900/20 hover:bg-blue-900/40 transition-colors text-blue-400">
                      <Twitter className="w-4 h-4" />
                      <span className="text-sm">Twitter</span>
                    </a>
                  )}
                  {proposalDetails.socials.discord && (
                    <a href={proposalDetails.socials.discord} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900/20 hover:bg-blue-900/40 transition-colors text-blue-400">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm">Discord</span>
                    </a>
                  )}
                  {proposalDetails.socials.telegram && (
                    <a href={proposalDetails.socials.telegram} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900/20 hover:bg-blue-900/40 transition-colors text-blue-400">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm">Telegram</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Coins className="w-6 h-6 text-blue-400" />
                      Support This Proposal
                    </h3>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/20 border border-blue-900/40">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className={`text-lg font-medium ${isVotingEnded ? 'text-red-400' : 'text-blue-400'}`}>
                        {timeRemaining}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-zinc-400">
                    Submitted {new Date(proposalDetails.submissionTimestamp * 1000).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/20 backdrop-blur-sm">
                    <p className="text-2xl font-bold text-white">
                      {formatRDAmount(pledgedAmount)}
                    </p>
                    <span className="text-sm text-zinc-400 border-l border-zinc-700 pl-2">
                      {backerCount} supporter{backerCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-sm text-zinc-400 mb-2">
                  <span>Progress Towards Target Capital</span>
                  <span>
                    {proposalDetails?.investment?.targetCapital 
                      ? ((Number(pledgedAmount) / Number(proposalDetails.investment.targetCapital)) * 100).toFixed(1) 
                      : 0}%
                  </span>
                </div>
                <Progress 
                  value={proposalDetails?.investment?.targetCapital 
                    ? (Number(pledgedAmount) / Number(proposalDetails.investment.targetCapital)) * 100 
                    : 0}
                  className="h-3 bg-zinc-800"
                />
                <p className="text-sm text-zinc-400 mt-2">
                  Target: {formatRDAmount(proposalDetails.investment.targetCapital)}
                </p>
              </div>

              {proposalDetails.fundingBreakdown && (
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 mb-6">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                    <PieChart className="w-5 h-5 text-blue-400" />
                    Funding Breakdown
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {proposalDetails.fundingBreakdown.map((item, index) => (
                      <div key={index} className="bg-zinc-800/50 rounded-lg p-4">
                        <p className="text-zinc-400 text-sm">{item.category}</p>
                        <p className="text-white font-medium">{formatRDAmount(item.amount)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 space-y-4 mb-6">
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  Investment Purpose
                </h4>
                <p className="text-zinc-300 leading-relaxed">
                  {proposalDetails.investment.description}
                </p>
              </div>

              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between text-white">
                      <h4 className="font-medium flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-400" />
                        About Supporting Proposals
                      </h4>
                      <ChevronDown className="w-5 h-5 text-zinc-400" />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-lg mt-2">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Express your interest by making a soft commitment. This is not an actual investment - 
                    only a 10 RD voting fee will be charged to record your support. Your pledged amount shows how much 
                    you're potentially interested in investing later.
                  </p>
                </CollapsibleContent>
              </Collapsible>
              
              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <div className="flex-1">
                  <Label htmlFor="pledgeAmount" className="text-zinc-400 mb-2 block">
                    Commitment Amount (RD)
                  </Label>
                  <Input
                    id="pledgeAmount"
                    type="number"
                    min="0"
                    step="0.1"
                    value={pledgeInput}
                    onChange={(e) => setPledgeInput(e.target.value)}
                    placeholder="Enter RD amount you want to commit"
                    className="bg-zinc-900/50 border-zinc-800/50 text-white h-12"
                  />
                  <p className="text-sm text-zinc-400 mt-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Only a 10 RD voting fee is required
                  </p>
                </div>
                <Button
                  onClick={handlePledge}
                  disabled={isPledging || !pledgeInput}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold h-12 mt-8 md:mt-0"
                >
                  {isPledging ? (
                    "Recording..."
                  ) : (
                    <>
                      <Coins className="w-5 h-5 mr-2" />
                      Record Support
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (view === 'details') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              {proposalDetails?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm space-y-4">
              <h3 className="text-xl font-semibold text-white">Investment Strategy</h3>
              <p className="text-white/80 leading-relaxed">
                {proposalDetails.investment.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (view === 'investment') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
          <CardContent className="p-8 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Investment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/60 text-sm">Target Capital</p>
                  <p className="text-white text-lg font-medium">
                    {formatRDAmount(proposalDetails.investment.targetCapital)}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/60 text-sm">Total Pledged</p>
                  <p className="text-white text-lg font-medium">
                    {formatRDAmount(pledgedAmount)}
                  </p>
                </div>
              </div>
            </div>

            {proposalDetails?.linkedInURL && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <a 
                  href={proposalDetails.linkedInURL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors text-lg"
                >
                  View LinkedIn Profile 
                  <ExternalLink className="w-5 h-5 ml-2" />
                </a>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return null;
};

export default ProposalDetailsCard;
