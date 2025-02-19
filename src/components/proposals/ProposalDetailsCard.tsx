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
import { ExternalLink, Users, Target, Coins, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { getTokenBalance } from "@/services/tokenService";
import { format } from "date-fns";

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
}

export const ProposalDetailsCard = ({ tokenId }: ProposalDetailsCardProps) => {
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

      const tx = await factoryContract.vote(tokenId, amount);
      await tx.wait();

      toast({
        title: "Support Pledged",
        description: `Successfully pledged ${pledgeInput} LGR to back this proposal`,
      });

      setPledgedAmount(prev => {
        const currentAmount = ethers.utils.parseEther(prev);
        const newAmount = currentAmount.add(amount);
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
        <CardContent className="p-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-white/60 mb-4">Connect your wallet to view proposal details</p>
            <Button onClick={connect} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
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
        <CardContent className="p-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/60"
          >
            <p>You need at least {MIN_LGR_REQUIRED} LGR to view proposal details</p>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full bg-black/40 border-white/10 backdrop-blur-sm">
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
      <Card className="w-full bg-black/40 border-white/10 backdrop-blur-sm">
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

  const progressPercentage = proposalDetails?.investment?.targetCapital
    ? (Number(pledgedAmount) / Number(proposalDetails.investment.targetCapital)) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="relative bg-gradient-to-br from-purple-500/10 via-transparent to-yellow-500/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="absolute inset-0 bg-black/20 rounded-2xl backdrop-blur-sm" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <Coins className="w-6 h-6 text-yellow-500" />
                Back This Proposal
              </h3>
              <p className="text-white/60 text-sm flex items-center gap-1">
                <Info className="w-4 h-4" />
                Pledge LGR tokens to show your support
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white mb-1">
                {pledgedAmount} LGR
              </p>
              <p className="text-sm text-white/60">
                from {backerCount} backer{backerCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Progress</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-white/5"
            />
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="pledgeAmount" className="text-white/60">
                  Pledge Amount
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
                size="lg"
                className="self-end bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {isPledging ? (
                  "Pledging..."
                ) : (
                  <>
                    <Coins className="w-5 h-5 mr-2" />
                    Pledge Support
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-white/40">
              Current value: {formatUSDAmount(pledgedAmount)}
            </p>
          </div>
        </div>
      </div>

      <Card className="w-full bg-black/40 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white bg-clip-text">
            {proposalDetails?.title}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-white/60 mt-2 flex-wrap">
            {proposalDetails?.submissionTimestamp && (
              <span className="bg-white/5 px-3 py-1 rounded-full">
                Submitted on {format(proposalDetails.submissionTimestamp, 'PPP')}
              </span>
            )}
            {proposalDetails?.investment?.targetCapital && (
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
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
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
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
          {proposalDetails?.investment && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <h3 className="text-lg font-semibold text-white">Investment Details</h3>
              <p className="text-white/80 bg-white/5 p-4 rounded-lg backdrop-blur-sm">
                {proposalDetails.investment.drivers}
              </p>
              <p className="text-white/80 bg-white/5 p-4 rounded-lg backdrop-blur-sm">
                {proposalDetails.investment.additionalCriteria}
              </p>
            </motion.div>
          )}

          {proposalDetails?.firmCriteria && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <h3 className="text-lg font-semibold text-white">Firm Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <strong className="text-purple-400">Firm Size:</strong>{" "}
                  <span className="text-white/80">{getFirmSizeLabel(proposalDetails.firmCriteria.size)}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <strong className="text-purple-400">Deal Type:</strong>{" "}
                  <span className="text-white/80">{getDealTypeLabel(proposalDetails.firmCriteria.dealType)}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <strong className="text-purple-400">Geographic Focus:</strong>{" "}
                  <span className="text-white/80">{getGeographicFocusLabel(proposalDetails.firmCriteria.geographicFocus)}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <strong className="text-purple-400">Payment Terms:</strong>{" "}
                  <span className="text-white/80">
                    {proposalDetails.paymentTerms?.map(term => getPaymentTermLabel(term)).join(", ")}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {proposalDetails?.linkedInURL && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <a 
                href={proposalDetails.linkedInURL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
              >
                View LinkedIn Profile 
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
