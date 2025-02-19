import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FACTORY_ADDRESS, FACTORY_ABI, LGR_TOKEN_ADDRESS, LGR_PRICE_USD } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { getFromIPFS } from "@/services/ipfsService";
import { 
  StoredProposal, 
  ProposalMetadata, 
  FirmSize, 
  DealType, 
  GeographicFocus, 
  PaymentTerm 
} from "@/types/proposals";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HandCoins, Clock, Users, ChevronLeft, Wallet, AlertCircle, AlertTriangle } from "lucide-react";
import { getTokenBalance } from "@/services/tokenService";
import { Progress } from "@/components/ui/progress";

interface ProposalDetails {
  metadata: ProposalMetadata;
  onChainData?: {
    pledgedAmount: ethers.BigNumber;
    votingEndsAt: number;
    backers: string[];
    creator: string | null;
    blockNumber: number;
    transactionHash: string;
  };
}

const MIN_LGR_REQUIRED = "1"; // 1 LGR required to view proposals

const getFirmSizeLabel = (size: FirmSize): string => {
  const sizeMap: Record<FirmSize, string> = {
    [FirmSize.BELOW_1M]: "Below $1M",
    [FirmSize.ONE_TO_FIVE_M]: "$1M - $5M",
    [FirmSize.FIVE_TO_TEN_M]: "$5M - $10M",
    [FirmSize.TEN_PLUS]: "$10M+"
  };
  return sizeMap[size] || "Unknown";
};

const getDealTypeLabel = (type: DealType): string => {
  const typeMap: Record<DealType, string> = {
    [DealType.ACQUISITION]: "Acquisition",
    [DealType.MERGER]: "Merger",
    [DealType.EQUITY_BUYOUT]: "Equity Buyout",
    [DealType.FRANCHISE]: "Franchise",
    [DealType.SUCCESSION]: "Succession"
  };
  return typeMap[type] || "Unknown";
};

const getGeographicFocusLabel = (focus: GeographicFocus): string => {
  const focusMap: Record<GeographicFocus, string> = {
    [GeographicFocus.LOCAL]: "Local",
    [GeographicFocus.REGIONAL]: "Regional",
    [GeographicFocus.NATIONAL]: "National",
    [GeographicFocus.REMOTE]: "Remote"
  };
  return focusMap[focus] || "Unknown";
};

const getPaymentTermLabel = (term: PaymentTerm): string => {
  const termMap: Record<PaymentTerm, string> = {
    [PaymentTerm.CASH]: "Cash",
    [PaymentTerm.SELLER_FINANCING]: "Seller Financing",
    [PaymentTerm.EARNOUT]: "Earnout",
    [PaymentTerm.EQUITY_ROLLOVER]: "Equity Rollover",
    [PaymentTerm.BANK_FINANCING]: "Bank Financing"
  };
  return termMap[term] || "Unknown";
};

const ProposalDetails = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [proposalDetails, setProposalDetails] = useState<ProposalDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingChainData, setIsLoadingChainData] = useState(false);
  const [hasMinimumLGR, setHasMinimumLGR] = useState<boolean | null>(null);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { getProvider } = useWalletProvider();
  const { isConnected, connect, address } = useWalletConnection();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCheckingBalance) {
      setLoadingStage("Checking LGR Balance...");
      setLoadingProgress(25);
    } else if (isLoading) {
      setLoadingStage("Loading proposal metadata...");
      setLoadingProgress(50);
    } else if (isLoadingChainData) {
      setLoadingStage("Fetching on-chain data...");
      setLoadingProgress(75);
    } else if (proposalDetails) {
      setLoadingStage("Complete");
      setLoadingProgress(100);
    }
  }, [isCheckingBalance, isLoading, isLoadingChainData, proposalDetails]);

  useEffect(() => {
    const checkLGRBalance = async () => {
      if (!isConnected || !address) {
        setHasMinimumLGR(null);
        return;
      }

      try {
        setIsCheckingBalance(true);
        console.log('Starting LGR balance check for address:', address);
        
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
        
        if (!hasEnough) {
          toast({
            title: "Insufficient LGR Balance",
            description: `You need at least ${MIN_LGR_REQUIRED} LGR to view proposal details`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error checking LGR balance:", error);
        toast({
          title: "Balance Check Failed",
          description: "Failed to verify LGR balance. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsCheckingBalance(false);
      }
    };

    checkLGRBalance();
  }, [isConnected, address, getProvider]);

  useEffect(() => {
    console.log('Proposal Details Dependencies:', {
      tokenId,
      isConnected,
      hasMinimumLGR,
      isConnectedType: typeof isConnected,
      hasMinimumLGRType: typeof hasMinimumLGR
    });

    if (tokenId && isConnected && hasMinimumLGR === true) {
      console.log('Starting IPFS data load for token:', tokenId);
      loadIPFSData();
    } else {
      console.log('IPFS load conditions not met:', {
        hasTokenId: !!tokenId,
        isConnected,
        hasMinimumLGR
      });
    }
  }, [tokenId, isConnected, hasMinimumLGR]);

  useEffect(() => {
    if (isConnected && hasMinimumLGR && proposalDetails && !proposalDetails.onChainData) {
      loadChainData();
    }
  }, [isConnected, hasMinimumLGR, proposalDetails]);

  const loadIPFSData = async () => {
    try {
      setIsLoading(true);
      
      const walletProvider = await getProvider();
      console.log('Getting contract for token:', tokenId);
      
      const contract = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        walletProvider.provider
      );

      const tokenUri = await contract.tokenURI(tokenId);
      console.log('NFT metadata URI:', tokenUri);

      if (!tokenUri) {
        throw new Error('No token URI returned from contract');
      }

      console.log('Fetching IPFS metadata from:', tokenUri);
      const rawMetadata = await getFromIPFS<ProposalMetadata>(tokenUri, 'proposal');
      
      const metadata: ProposalMetadata = {
        ...rawMetadata,
        firmCriteria: {
          ...rawMetadata.firmCriteria,
          size: rawMetadata.firmCriteria.size as FirmSize,
          dealType: rawMetadata.firmCriteria.dealType as DealType,
          geographicFocus: rawMetadata.firmCriteria.geographicFocus as GeographicFocus
        }
      };
      
      console.log('Processed IPFS metadata:', metadata);
      setProposalDetails({
        metadata,
        onChainData: undefined
      });
    } catch (error: any) {
      console.error("Error loading IPFS data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load proposal details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadChainData = async () => {
    try {
      console.log('Starting to load chain data...');
      setIsLoadingChainData(true);
      const walletProvider = await getProvider();
      console.log('Provider obtained, initializing contract...');
      
      const contract = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        walletProvider.provider
      );

      console.log('Getting creation event for token:', tokenId);
      const filter = contract.filters.ProposalCreated(tokenId);
      const events = await contract.queryFilter(filter);
      
      if (events.length === 0) {
        console.error('No creation event found for token:', tokenId);
        toast({
          title: "Proposal Not Found",
          description: "This proposal does not exist or has been removed.",
          variant: "destructive",
        });
        return;
      }

      const event = events[0];
      console.log('Found creation event:', event);

      console.log('Fetching current state for token:', tokenId);
      let pledgedAmount = ethers.BigNumber.from(0);
      let backers: string[] = [];

      try {
        pledgedAmount = await contract.pledgedAmount(tokenId);
        console.log('Pledged amount retrieved:', ethers.utils.formatEther(pledgedAmount));
      } catch (error) {
        console.warn('Failed to fetch pledged amount:', error);
      }

      try {
        backers = await contract.proposalVoters(tokenId);
        console.log('Backers retrieved:', backers.length);
      } catch (error) {
        console.warn('Failed to fetch backers:', error);
      }

      if (proposalDetails) {
        const votingEndsAt = proposalDetails.metadata.submissionTimestamp / 1000 + proposalDetails.metadata.votingDuration;
        console.log('Calculated voting end time:', new Date(votingEndsAt * 1000).toLocaleString());
        
        const onChainData = {
          pledgedAmount,
          votingEndsAt,
          backers,
          creator: event.args?.creator,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash
        };

        console.log('Final combined data:', {
          pledgedAmount: ethers.utils.formatEther(pledgedAmount),
          votingEndsAt: new Date(votingEndsAt * 1000).toLocaleString(),
          backersCount: backers.length,
          creator: event.args?.creator,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash
        });

        setProposalDetails({
          ...proposalDetails,
          onChainData
        });
      }
    } catch (error: any) {
      console.error("Error loading chain data:", error);
      toast({
        title: "Chain Data Load Warning",
        description: "Some proposal details couldn't be loaded. You can still view the basic information.",
        variant: "default",
      });
    } finally {
      setIsLoadingChainData(false);
    }
  };

  const calculateProgress = () => {
    if (!proposalDetails?.onChainData?.pledgedAmount || !proposalDetails.metadata.investment.targetCapital) {
      return 0;
    }
    
    const pledged = Number(ethers.utils.formatEther(proposalDetails.onChainData.pledgedAmount));
    const target = Number(ethers.utils.formatEther(proposalDetails.metadata.investment.targetCapital));
    return Math.min((pledged / target) * 100, 100);
  };

  const formatUSDValue = (lgrAmount: ethers.BigNumber | string) => {
    let amount: number;
    
    if (typeof lgrAmount === 'string') {
      amount = Number(ethers.utils.formatEther(lgrAmount));
    } else {
      amount = Number(ethers.utils.formatEther(lgrAmount));
    }
    
    const usdValue = amount * LGR_PRICE_USD;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(usdValue);
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 pt-32">
        <Card className="bg-black/40 border-white/10">
          <CardContent className="p-8 text-center">
            <Wallet className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-white/60 mb-6">
              Please connect your wallet to view proposal details. You need at least {MIN_LGR_REQUIRED} LGR token to access this content.
            </p>
            <Button onClick={connect} className="bg-yellow-500 hover:bg-yellow-600">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCheckingBalance || isLoading || isLoadingChainData) {
    return (
      <div className="container mx-auto px-4 pt-32">
        <Card className="bg-black/40 border-white/10">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="animate-spin w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-4">{loadingStage}</h2>
              <Progress value={loadingProgress} className="w-full bg-white/10" />
              <p className="text-white/60 text-center">
                Please wait while we load the proposal details...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasMinimumLGR === false) {
    return (
      <div className="container mx-auto px-4 pt-32">
        <Card className="bg-black/40 border-white/10">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Insufficient LGR Balance</h2>
            <p className="text-white/60 mb-6">
              You need at least {MIN_LGR_REQUIRED} LGR token to view proposal details. Please acquire more LGR and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!proposalDetails) {
    return (
      <div className="container mx-auto px-4 pt-32 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Proposal Not Found</h2>
        <Button onClick={() => navigate('/proposals')}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Proposals
        </Button>
      </div>
    );
  }

  const { metadata, onChainData } = proposalDetails;

  const renderChainData = () => {
    if (isLoadingChainData) {
      return <Skeleton className="h-4 w-24" />;
    }

    if (!proposalDetails?.onChainData) {
      return (
        <div className="flex items-center gap-2 text-yellow-500">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Chain data unavailable</span>
        </div>
      );
    }

    return (
      <>
        <p className="text-xl font-bold text-white">
          {proposalDetails.onChainData.backers.length}
        </p>
        <div className="mt-1 text-sm text-white/60">
          Total Backers
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-purple-500/10 to-pink-500/10 animate-gradient" />
        
        <div className="container mx-auto px-4 pt-32 pb-20">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/proposals')}
            className="mb-8 text-white/60 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Proposals
          </Button>

          <div className="grid gap-8">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold text-white mb-2">
                      {metadata.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                        {getDealTypeLabel(metadata.firmCriteria.dealType)}
                      </Badge>
                      <Badge variant="outline" className="text-teal-500 border-teal-500">
                        {getFirmSizeLabel(metadata.firmCriteria.size)}
                      </Badge>
                    </div>
                  </div>
                  {metadata.isTestMode && (
                    <Badge className="bg-blue-500/20 text-blue-400">
                      Test Mode
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <HandCoins className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Target Capital</p>
                          <div className="space-y-1">
                            <p className="text-xl font-bold text-white">
                              {ethers.utils.formatEther(metadata.investment.targetCapital)} LGR
                            </p>
                            <p className="text-sm text-yellow-500">
                              ≈ {formatUSDValue(metadata.investment.targetCapital)}
                            </p>
                          </div>
                        </div>
                      </div>
                      {onChainData && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-white/60 mb-2">
                            <span>Progress</span>
                            <span>{calculateProgress().toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={calculateProgress()} 
                            className="h-2 bg-white/10"
                          />
                          <div className="mt-2 text-sm text-white/60">
                            <span>Pledged: </span>
                            <span className="text-white">{ethers.utils.formatEther(onChainData.pledgedAmount)} LGR</span>
                            <span className="text-yellow-500 ml-2">
                              ≈ {formatUSDValue(onChainData.pledgedAmount)}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Backers</p>
                          {renderChainData()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Voting Ends</p>
                          {isLoadingChainData ? (
                            <Skeleton className="h-4 w-24" />
                          ) : (
                            <p className="text-xl font-bold text-white">
                              {onChainData ? new Date(onChainData.votingEndsAt * 1000).toLocaleDateString() : 'Connect Wallet'}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Investment Drivers</h3>
                    <p className="text-white/80">{metadata.investment.drivers}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Additional Criteria</h3>
                    <p className="text-white/80">{metadata.investment.additionalCriteria}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Location & Geographic Focus</h3>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-white/80">
                        {metadata.firmCriteria.location}
                      </Badge>
                      <Badge variant="outline" className="text-white/80">
                        {getGeographicFocusLabel(metadata.firmCriteria.geographicFocus)}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Payment Terms</h3>
                    <div className="flex flex-wrap gap-2">
                      {metadata.paymentTerms.map((term, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="text-purple-400 border-purple-400"
                        >
                          {getPaymentTermLabel(term)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;
