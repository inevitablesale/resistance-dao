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
import { ProposalMetadata, FirmSize, DealType, GeographicFocus, PaymentTerm } from "@/types/proposals";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Users, Target, Coins, Info, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { getTokenBalance } from "@/services/tokenService";
import { format, formatDistanceToNow, isPast } from "date-fns";

const MIN_LGR_REQUIRED = "1";

const getFirmSizeLabel = (size: FirmSize): string => {
  switch (size) {
    case FirmSize.BELOW_1M:
      return "Below $1M";
    case FirmSize.ONE_TO_FIVE_M:
      return "$1M-$5M";
    case FirmSize.FIVE_TO_TEN_M:
      return "$5M-$10M";
    case FirmSize.TEN_PLUS:
      return "$10M+";
    default:
      return "Unknown";
  }
};

const getDealTypeLabel = (type: DealType): string => {
  switch (type) {
    case DealType.ACQUISITION:
      return "Acquisition";
    case DealType.MERGER:
      return "Merger";
    case DealType.EQUITY_BUYOUT:
      return "Equity Buyout";
    case DealType.FRANCHISE:
      return "Franchise";
    case DealType.SUCCESSION:
      return "Succession";
    default:
      return "Unknown";
  }
};

const getGeographicFocusLabel = (focus: GeographicFocus): string => {
  switch (focus) {
    case GeographicFocus.LOCAL:
      return "Local";
    case GeographicFocus.REGIONAL:
      return "Regional";
    case GeographicFocus.NATIONAL:
      return "National";
    case GeographicFocus.REMOTE:
      return "Remote";
    default:
      return "Unknown";
  }
};

const getPaymentTermLabel = (term: PaymentTerm): string => {
  switch (term) {
    case PaymentTerm.CASH:
      return "Cash";
    case PaymentTerm.SELLER_FINANCING:
      return "Seller Financing";
    case PaymentTerm.EARNOUT:
      return "Earnout";
    case PaymentTerm.EQUITY_ROLLOVER:
      return "Equity Rollover";
    case PaymentTerm.BANK_FINANCING:
      return "Bank Financing";
    default:
      return "Unknown";
  }
};

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
  const [hasMinimumLGR, setHasMinimumLGR] = useState<boolean | null>(null);
  const [pledgedAmount, setPledgedAmount] = useState<string>("0");
  const [backerCount, setBackerCount] = useState(0);
  const [pledgeInput, setPledgeInput] = useState("");
  const [isPledging, setIsPledging] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isVotingEnded, setIsVotingEnded] = useState(false);
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

        console.log(`Getting tokenURI, pledged amount, and vote events for token #${tokenId}`);
        
        const [tokenUri, pledged] = await Promise.all([
          factoryContract.tokenURI(tokenId),
          factoryContract.pledgedAmount(tokenId)
        ]);
        setLoadingProgress(50);

        console.log('Querying ProposalVoted events...');
        const filter = factoryContract.filters.ProposalVoted(tokenId, null);
        const events = await factoryContract.queryFilter(filter);
        
        console.log('Token URI:', tokenUri);
        console.log('Pledged amount:', ethers.utils.formatEther(pledged));
        console.log('Vote events count:', events.length);
        
        setPledgedAmount(ethers.utils.formatEther(pledged));
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
  }, [tokenId, isConnected, hasMinimumLGR, getProvider, toast]);

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
          const timeLeft = formatDistanceToNow(endDate);
          setTimeRemaining(`Proposal ends in ${timeLeft}`);
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
        LGR_TOKEN_ADDRESS,
        address!
      );
      const userBalance = ethers.utils.parseEther(balance);
      
      if (userBalance.lt(VOTING_FEE)) {
        throw new Error("Insufficient LGR balance. You need 10 LGR to cover the voting fee.");
      }

      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        walletProvider.provider.getSigner()
      );

      const lgrToken = new ethers.Contract(
        LGR_TOKEN_ADDRESS,
        ["function approve(address spender, uint256 amount) returns (bool)"],
        signer
      );
      
      console.log('Approving voting fee:', ethers.utils.formatEther(VOTING_FEE));
      const approveTx = await lgrToken.approve(FACTORY_ADDRESS, VOTING_FEE);
      await approveTx.wait();

      const pledgeAmountBN = ethers.utils.parseEther(pledgeInput);
      const tx = await factoryContract.vote(tokenId, pledgeAmountBN);
      await tx.wait();

      toast({
        title: "Support Pledged Successfully",
        description: `Your commitment of ${pledgeInput} LGR has been recorded. The 10 LGR voting fee has been processed.`,
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
      <Card className="w-full bg-black/40 border-white/10 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-white/60 text-lg">Connect your wallet to view proposal details</p>
            <Button 
              onClick={connect} 
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
            >
              Connect Wallet
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  if (hasMinimumLGR === false) {
    return (
      <Card className="w-full bg-black/40 border-white/10 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-white/60 text-lg">
              You need at least {MIN_LGR_REQUIRED} LGR to view proposal details
            </p>
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
      <Card className="w-full bg-black/40 border-white/10 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <p className="text-white/60 text-lg">The requested proposal could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = proposalDetails?.investment?.targetCapital
    ? (Number(pledgedAmount) / Number(proposalDetails.investment.targetCapital)) * 100
    : 0;

  if (view === 'overview') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        <div className="relative bg-gradient-to-br from-yellow-500/10 via-transparent to-teal-500/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="absolute inset-0 bg-black/20 rounded-2xl backdrop-blur-sm" />
          
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                    <Coins className="w-6 h-6 text-yellow-500" />
                    Support This Proposal
                  </h3>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span className={`text-lg font-medium ${isVotingEnded ? 'text-red-400' : 'text-yellow-500'}`}>
                      {timeRemaining}
                    </span>
                  </div>
                </div>
                <p className="text-white/60 text-sm flex items-center gap-1">
                  <Info className="w-4 h-4" />
                  Make a soft commitment to show your interest
                </p>
              </div>
              <div className="text-center md:text-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-white">
                    {pledgedAmount} LGR
                  </p>
                  <span className="text-sm text-white/60 border-l border-white/10 pl-2">
                    {backerCount} supporter{backerCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Total Commitments Progress</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-3 bg-white/5"
              />
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
                <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-yellow-500" />
                  About Supporting Proposals
                </h4>
                <p className="text-sm text-white/80 leading-relaxed">
                  Express your interest by making a soft commitment. This is not an actual investment - 
                  only a 10 LGR voting fee will be charged to record your support. Your pledged amount shows how much 
                  you're potentially interested in investing later.
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="pledgeAmount" className="text-white/60 mb-2 block">
                    Commitment Amount
                  </Label>
                  <Input
                    id="pledgeAmount"
                    type="number"
                    min="0"
                    step="0.1"
                    value={pledgeInput}
                    onChange={(e) => setPledgeInput(e.target.value)}
                    placeholder="Enter amount you're interested in"
                    className="bg-black/40 border-white/10 text-white h-12"
                  />
                  <p className="text-sm text-white/60 mt-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Only a 10 LGR voting fee is required in your wallet
                  </p>
                </div>
                <Button
                  onClick={handlePledge}
                  disabled={isPledging || !pledgeInput}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold transition-all duration-300 transform hover:scale-105 h-12 mt-8 md:mt-0"
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
              <div className="space-y-1">
                <p className="text-sm text-white/40">
                  Total commitments so far: {pledgedAmount} LGR ({formatUSDAmount(pledgedAmount)})
                </p>
                {pledgeInput && (
                  <div className="space-y-1">
                    <p className="text-sm text-yellow-500/80">
                      Required in wallet: 10 LGR ({formatUSDAmount("10")}) voting fee
                    </p>
                    <p className="text-xs text-white/40">
                      Your commitment of {pledgeInput} LGR ({formatUSDAmount(pledgeInput)}) will be recorded without transfer
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 p-6 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors group border border-teal-500/10"
              >
                <strong className="text-teal-400 block mb-2">Firm Size</strong>
                <span className="text-white/80 text-lg">
                  {getFirmSizeLabel(proposalDetails.firmCriteria.size)}
                </span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 p-6 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors group border border-yellow-500/10"
              >
                <strong className="text-yellow-400 block mb-2">Deal Type</strong>
                <span className="text-white/80 text-lg">
                  {getDealTypeLabel(proposalDetails.firmCriteria.dealType)}
                </span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 p-6 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors group border border-teal-500/10"
              >
                <strong className="text-teal-400 block mb-2">Geographic Focus</strong>
                <span className="text-white/80 text-lg">
                  {getGeographicFocusLabel(proposalDetails.firmCriteria.geographicFocus)}
                </span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 p-6 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors group border border-yellow-500/10"
              >
                <strong className="text-yellow-400 block mb-2">Payment Terms</strong>
                <span className="text-white/80 text-lg">
                  {proposalDetails.paymentTerms?.map(term => getPaymentTermLabel(term)).join(", ")}
                </span>
              </motion.div>
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
            {proposalDetails?.investment && (
              <>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Investment Drivers</h3>
                  <p className="text-white/80 bg-white/5 p-6 rounded-xl backdrop-blur-sm leading-relaxed border border-yellow-500/10">
                    {proposalDetails.investment.drivers}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Additional Criteria</h3>
                  <p className="text-white/80 bg-white/5 p-6 rounded-xl backdrop-blur-sm leading-relaxed border border-teal-500/10">
                    {proposalDetails.investment.additionalCriteria}
                  </p>
                </div>
              </>
            )}

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
