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
import { StoredProposal, ProposalMetadata } from "@/types/proposals";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HandCoins, Clock, Users, ChevronLeft, Wallet, AlertCircle } from "lucide-react";
import { getTokenBalance } from "@/services/tokenService";

interface ProposalDetails {
  metadata: ProposalMetadata;
  onChainData?: {
    pledgedAmount: ethers.BigNumber;
    votingEndsAt: number;
    backers: string[];
  };
}

const MIN_LGR_REQUIRED = "1"; // 1 LGR required to view proposals

const ProposalDetails = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [proposalDetails, setProposalDetails] = useState<ProposalDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingChainData, setIsLoadingChainData] = useState(false);
  const [hasMinimumLGR, setHasMinimumLGR] = useState<boolean | null>(null);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const { getProvider } = useWalletProvider();
  const { isConnected, connect, address } = useWalletConnection();
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatUSDAmount = (lgrAmount: string | ethers.BigNumber): string => {
    const amount = typeof lgrAmount === 'string' 
      ? parseFloat(lgrAmount)
      : parseFloat(ethers.utils.formatEther(lgrAmount));
    if (isNaN(amount)) return "$0.00";
    const usdAmount = amount * LGR_PRICE_USD;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(usdAmount);
  };

  useEffect(() => {
    const checkLGRBalance = async () => {
      if (!isConnected || !address) {
        setHasMinimumLGR(null);
        return;
      }

      try {
        setIsCheckingBalance(true);
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
    if (tokenId && isConnected && hasMinimumLGR === true) {
      loadIPFSData();
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

      const [tokenUri, pledgedAmount, backers] = await Promise.all([
        contract.tokenURI(tokenId),
        contract.pledgedAmount(tokenId),
        contract.getProposalBackers(tokenId)
      ]);

      console.log('Contract data fetched:', {
        tokenUri,
        pledgedAmount: ethers.utils.formatEther(pledgedAmount),
        backersCount: backers.length
      });

      if (!tokenUri) {
        throw new Error('Invalid token URI format');
      }

      const ipfsHash = tokenUri.replace('ipfs://', '');
      console.log('Fetching IPFS metadata from hash:', ipfsHash);
      
      const metadata = await getFromIPFS<ProposalMetadata>(ipfsHash, 'proposal');
      console.log('Processed IPFS metadata:', metadata);

      const votingEndsAt = metadata.submissionTimestamp / 1000 + metadata.votingDuration;
      
      setProposalDetails({
        metadata,
        onChainData: {
          pledgedAmount,
          votingEndsAt,
          backers
        }
      });
    } catch (error: any) {
      console.error("Error loading proposal data:", error);
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

      console.log('Contract initialized, fetching on-chain data for token:', tokenId);
      const [pledgedAmount, backers] = await Promise.all([
        contract.pledgedAmount(tokenId),
        contract.getProposalBackers(tokenId)
      ]);

      console.log('On-chain data received:', {
        pledgedAmount: ethers.utils.formatEther(pledgedAmount),
        backers,
        tokenId
      });

      if (proposalDetails) {
        const votingEndsAt = proposalDetails.metadata.submissionTimestamp / 1000 + proposalDetails.metadata.votingDuration;
        console.log('Calculated voting end time:', new Date(votingEndsAt * 1000).toLocaleString());
        
        const onChainData = {
          pledgedAmount,
          votingEndsAt,
          backers
        };

        console.log('Final on-chain data:', {
          pledgedAmount: ethers.utils.formatEther(pledgedAmount),
          votingEndsAt: new Date(votingEndsAt * 1000).toLocaleString(),
          backersCount: backers.length,
          backers
        });

        setProposalDetails({
          ...proposalDetails,
          onChainData
        });
      }
    } catch (error: any) {
      console.error("Error loading chain data:", error);
      toast({
        title: "Error",
        description: "Failed to load on-chain data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingChainData(false);
    }
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

  if (isCheckingBalance) {
    return (
      <div className="container mx-auto px-4 pt-32">
        <Card className="bg-black/40 border-white/10">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Checking LGR Balance</h2>
            <p className="text-white/60">
              Verifying your LGR token balance...
            </p>
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-32">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
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
                        {metadata.firmCriteria.dealType}
                      </Badge>
                      <Badge variant="outline" className="text-teal-500 border-teal-500">
                        {metadata.firmCriteria.size}
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
                          <p className="text-xl font-bold text-white">
                            {metadata.investment.targetCapital} LGR
                            <span className="text-white/40 text-sm ml-1">
                              ({formatUSDAmount(metadata.investment.targetCapital)})
                            </span>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                          <HandCoins className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Pledged Amount</p>
                          {isLoadingChainData ? (
                            <Skeleton className="h-4 w-24" />
                          ) : (
                            <p className="text-xl font-bold text-white">
                              {onChainData ? ethers.utils.formatEther(onChainData.pledgedAmount) : '0'} LGR
                              <span className="text-white/40 text-sm ml-1">
                                ({formatUSDAmount(onChainData?.pledgedAmount || '0')})
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
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
                          {isLoadingChainData ? (
                            <Skeleton className="h-4 w-16" />
                          ) : (
                            <p className="text-xl font-bold text-white">
                              {onChainData?.backers.length ?? 0}
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
                        {metadata.firmCriteria.geographicFocus}
                      </Badge>
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
