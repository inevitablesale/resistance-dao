import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FACTORY_ADDRESS, FACTORY_ABI, LGR_TOKEN_ADDRESS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { getFromIPFS } from "@/services/ipfsService";
import { ProposalMetadata } from "@/types/proposals";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Users, Target, ThumbsUp, ThumbsDown, Coins } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { getTokenBalance } from "@/services/tokenService";
import { format } from "date-fns";

interface ProposalDetailsCardProps {
  tokenId?: string;
}

const MIN_LGR_REQUIRED = "1";

export const ProposalDetailsCard = ({ tokenId }: ProposalDetailsCardProps) => {
  const { toast } = useToast();
  const { isConnected, connect, address } = useWalletConnection();
  const { getProvider } = useWalletProvider();
  const [proposalDetails, setProposalDetails] = useState<ProposalMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [hasMinimumLGR, setHasMinimumLGR] = useState<boolean | null>(null);
  const [pledgedAmount, setPledgedAmount] = useState<string>("0");
  const [votesUp, setVotesUp] = useState(0);
  const [votesDown, setVotesDown] = useState(0);
  const [pledgeInput, setPledgeInput] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [isPledging, setIsPledging] = useState(false);

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
    const checkLGRBalance = async () => {
      console.log('Checking LGR balance...', { isConnected, address });
      
      if (!isConnected) {
        console.log('Not connected, skipping LGR check');
        setHasMinimumLGR(null);
        return;
      }

      if (!address) {
        console.log('No address available, skipping LGR check');
        setHasMinimumLGR(null);
        return;
      }

      try {
        console.log('Getting wallet provider...');
        const walletProvider = await getProvider();
        console.log('Wallet provider obtained, checking balance...');
        
        const balance = await getTokenBalance(
          walletProvider.provider,
          LGR_TOKEN_ADDRESS,
          address
        );

        console.log('Balance retrieved:', balance);
        
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
          title: "Error Checking Balance",
          description: "Failed to verify your LGR balance. Please try again.",
          variant: "destructive",
        });
        setHasMinimumLGR(null);
      }
    };

    checkLGRBalance();
  }, [isConnected, address, getProvider, toast]);

  useEffect(() => {
    console.log('Proposal details effect running...', {
      tokenId,
      isConnected,
      hasMinimumLGR
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

    if (hasMinimumLGR === false) {
      console.log('Insufficient LGR balance');
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

        console.log(`Getting tokenURI and pledged amount for token #${tokenId}`);
        const [tokenUri, pledged] = await Promise.all([
          factoryContract.tokenURI(tokenId),
          factoryContract.pledgedAmount(tokenId)
        ]);
        setLoadingProgress(60);

        console.log('Token URI:', tokenUri);
        console.log('Pledged amount:', ethers.utils.formatEther(pledged));
        setPledgedAmount(ethers.utils.formatEther(pledged));

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
  }, [tokenId, isConnected, hasMinimumLGR, getProvider, toast]);

  const handleVote = async (isUpvote: boolean) => {
    if (!tokenId || !isConnected) return;
    
    setIsVoting(true);
    try {
      const walletProvider = await getProvider();
      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        walletProvider.provider.getSigner()
      );

      const tx = await factoryContract.vote(tokenId, isUpvote);
      await tx.wait();

      toast({
        title: "Vote Submitted",
        description: `Successfully voted ${isUpvote ? "up" : "down"} on proposal #${tokenId}`,
      });

      if (isUpvote) {
        setVotesUp(prev => prev + 1);
      } else {
        setVotesDown(prev => prev + 1);
      }
    } catch (error: any) {
      console.error("Voting error:", error);
      toast({
        title: "Voting Failed",
        description: error.message || "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  const handlePledge = async () => {
    if (!tokenId || !isConnected || !pledgeInput) return;
    
    setIsPledging(true);
    try {
      const amount = ethers.utils.parseEther(pledgeInput);
      const walletProvider = await getProvider();
      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        walletProvider.provider.getSigner()
      );

      const tx = await factoryContract.pledge(tokenId, amount);
      await tx.wait();

      toast({
        title: "Pledge Submitted",
        description: `Successfully pledged ${pledgeInput} LGR to proposal #${tokenId}`,
      });

      setPledgedAmount(prev => {
        const currentAmount = ethers.utils.parseEther(prev);
        const newAmount = currentAmount.add(amount);
        return ethers.utils.formatEther(newAmount);
      });
      
      setPledgeInput("");
    } catch (error: any) {
      console.error("Pledging error:", error);
      toast({
        title: "Pledging Failed",
        description: error.message || "Failed to submit pledge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPledging(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full bg-black/40 border-white/10">
        <CardContent className="p-6 text-center">
          <p className="text-white/60 mb-4">Connect your wallet to view proposal details</p>
          <Button onClick={connect} className="bg-purple-500 hover:bg-purple-600">
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (hasMinimumLGR === false) {
    return (
      <Card className="w-full bg-black/40 border-white/10">
        <CardContent className="p-6 text-center text-white/60">
          <p>You need at least {MIN_LGR_REQUIRED} LGR to view proposal details</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Loading Proposal Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-[80%] bg-white/5" />
          <Skeleton className="h-4 w-[60%] bg-white/5" />
          <Skeleton className="h-4 w-[40%] bg-white/5" />
          <Progress value={loadingProgress} className="mt-4" />
        </CardContent>
      </Card>
    );
  }

  if (!proposalDetails) {
    return (
      <Card className="w-full bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Proposal Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/60">The requested proposal could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-full bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            {proposalDetails.title}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-white/60 mt-2">
            {proposalDetails.submissionTimestamp && (
              <span>
                Submitted on {format(proposalDetails.submissionTimestamp, 'PPP')}
              </span>
            )}
            {proposalDetails.investment?.targetCapital && (
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>
                  {proposalDetails.investment.targetCapital} LGR Target
                  <span className="text-white/40 ml-1">
                    ({formatUSDAmount(proposalDetails.investment.targetCapital)})
                  </span>
                </span>
              </div>
            )}
            {pledgedAmount && Number(pledgedAmount) > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>
                  {pledgedAmount} LGR Pledged
                  <span className="text-white/40 ml-1">
                    ({formatUSDAmount(pledgedAmount)})
                  </span>
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {proposalDetails.investment && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Investment Details</h3>
              <p className="text-white/80">{proposalDetails.investment.drivers}</p>
              <p className="text-white/80">{proposalDetails.investment.additionalCriteria}</p>
            </div>
          )}

          {proposalDetails.firmCriteria && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Firm Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
                <div>
                  <strong>Firm Size:</strong>{" "}
                  {proposalDetails.firmCriteria.size}
                </div>
                <div>
                  <strong>Deal Type:</strong>{" "}
                  {proposalDetails.firmCriteria.dealType}
                </div>
                <div>
                  <strong>Geographic Focus:</strong>{" "}
                  {proposalDetails.firmCriteria.geographicFocus}
                </div>
                <div>
                  <strong>Payment Terms:</strong>{" "}
                  {proposalDetails.paymentTerms?.join(", ")}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleVote(true)}
                disabled={isVoting}
                className="bg-teal-900/40 border-teal-500/40 hover:bg-teal-500/20 hover:border-teal-500/40"
              >
                <ThumbsUp className="mr-2" />
                Vote Up {votesUp > 0 && `(${votesUp})`}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleVote(false)}
                disabled={isVoting}
                className="bg-red-900/40 border-red-500/40 hover:bg-red-500/20 hover:border-red-500/40"
              >
                <ThumbsDown className="mr-2" />
                Vote Down {votesDown > 0 && `(${votesDown})`}
              </Button>
            </div>

            <div className="bg-black/20 rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Pledge LGR Tokens
              </h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="pledgeAmount" className="text-white/60">
                    Amount to Pledge
                  </Label>
                  <Input
                    id="pledgeAmount"
                    type="number"
                    min="0"
                    step="0.1"
                    value={pledgeInput}
                    onChange={(e) => setPledgeInput(e.target.value)}
                    placeholder="Enter LGR amount"
                    className="bg-black/40 border-white/10 text-white"
                  />
                </div>
                <Button
                  onClick={handlePledge}
                  disabled={isPledging || !pledgeInput}
                  className="self-end bg-purple-500 hover:bg-purple-600"
                >
                  {isPledging ? "Pledging..." : "Pledge LGR"}
                </Button>
              </div>
              <p className="text-sm text-white/40 mt-2">
                Current total pledged: {pledgedAmount} LGR
                ({formatUSDAmount(pledgedAmount)})
              </p>
            </div>
          </div>

          {proposalDetails.linkedInURL && (
            <div className="mt-4">
              <a 
                href={proposalDetails.linkedInURL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 inline-flex items-center"
              >
                View LinkedIn Profile 
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
