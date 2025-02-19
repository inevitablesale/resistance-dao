import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/lib/constants";
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
import { 
  HandCoins, 
  Clock, 
  Users, 
  ChevronLeft, 
  Wallet, 
  AlertCircle, 
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  FileSearch,
  Activity,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const getFirmSizeLabel = (size: FirmSize): string => {
  const labels: Record<FirmSize, string> = {
    [FirmSize.BELOW_1M]: "Below $1M",
    [FirmSize.ONE_TO_FIVE_M]: "$1M - $5M",
    [FirmSize.FIVE_TO_TEN_M]: "$5M - $10M",
    [FirmSize.TEN_PLUS]: "$10M+"
  };
  return labels[size] || "Unknown";
};

const getDealTypeLabel = (type: DealType): string => {
  const labels: Record<DealType, string> = {
    [DealType.ACQUISITION]: "Acquisition",
    [DealType.MERGER]: "Merger",
    [DealType.EQUITY_BUYOUT]: "Equity Buyout",
    [DealType.FRANCHISE]: "Franchise",
    [DealType.SUCCESSION]: "Succession"
  };
  return labels[type] || "Unknown";
};

const getGeographicFocusLabel = (focus: GeographicFocus): string => {
  const labels: Record<GeographicFocus, string> = {
    [GeographicFocus.LOCAL]: "Local",
    [GeographicFocus.REGIONAL]: "Regional",
    [GeographicFocus.NATIONAL]: "National",
    [GeographicFocus.REMOTE]: "Remote"
  };
  return labels[focus] || "Unknown";
};

const getPaymentTermLabel = (term: PaymentTerm): string => {
  const labels: Record<PaymentTerm, string> = {
    [PaymentTerm.CASH]: "Cash",
    [PaymentTerm.SELLER_FINANCING]: "Seller Financing",
    [PaymentTerm.EARNOUT]: "Earnout",
    [PaymentTerm.EQUITY_ROLLOVER]: "Equity Rollover",
    [PaymentTerm.BANK_FINANCING]: "Bank Financing"
  };
  return labels[term] || "Unknown";
};

interface ProposalDetails {
  metadata: ProposalMetadata;
  onChainData?: {
    pledgedAmount: ethers.BigNumber;
    votingEndsAt: number;
    backers: string[];
    creator: string;
    blockNumber: number;
    transactionHash: string;
  };
}

const ProposalDetails = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected, connect } = useWalletConnection();
  const [proposalDetails, setProposalDetails] = useState<ProposalDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { getProvider, isSessionRestored } = useWalletProvider();

  const fetchProposalDetails = async (tokenId: string) => {
    setIsLoading(true);
    setLoadingProgress(20);

    try {
      const walletProvider = await getProvider();
      const provider = walletProvider.provider;
      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
      setLoadingProgress(40);

      console.log('Fetching proposal data for token ID:', tokenId);
      const proposal = await factoryContract.proposals(tokenId);
      setLoadingProgress(60);

      console.log('Fetching proposal URI...');
      const proposalURI = proposal.ipfsMetadata;
      setLoadingProgress(80);

      console.log('Fetching metadata from IPFS:', proposalURI);
      const metadata = await getFromIPFS<ProposalMetadata>(proposalURI, "proposal");
      setLoadingProgress(90);

      return { 
        metadata,
        onChainData: {
          pledgedAmount: proposal.targetCapital,
          votingEndsAt: proposal.votingEnds.toNumber(),
          backers: [],
          creator: proposal.creator,
          blockNumber: 0,
          transactionHash: ""
        }
      };
    } catch (error: any) {
      console.error("Error fetching proposal details:", error);
      toast({
        title: "Failed to Load Proposal",
        description: error.message || "Could not retrieve proposal details.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
      setLoadingProgress(100);
    }
  };

  useEffect(() => {
    if (!isSessionRestored) {
      console.log('Waiting for session restoration...');
      return;
    }

    if (!tokenId) {
      toast({
        title: "Invalid Proposal ID",
        description: "Please provide a valid proposal ID.",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      console.log('Wallet not connected, skipping proposal fetch');
      return;
    }

    const loadProposalDetails = async () => {
      const details = await fetchProposalDetails(tokenId);
      if (details) {
        setProposalDetails(details);
      }
    };

    loadProposalDetails();
  }, [tokenId, toast, isConnected, isSessionRestored]);

  if (!isSessionRestored) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 pt-32">
          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-12 h-12 text-yellow-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-white mb-4">Initializing...</h2>
              <p className="text-white/60 mb-6">
                Please wait while we restore your wallet session.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 pt-32">
          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-8 text-center">
              <Wallet className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-white/60 mb-6">
                Please connect your wallet to view proposal details.
              </p>
              <Button onClick={connect} className="bg-yellow-500 hover:bg-yellow-600">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading || !proposalDetails) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 pt-32">
          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                </div>
                <p className="text-center text-white/60">Loading proposal details...</p>
                <Progress value={loadingProgress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
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

          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                {metadata.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Deal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Firm Details</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {getFirmSizeLabel(metadata.firmCriteria.size)}
                        </Badge>
                        <Badge variant="outline">
                          {getDealTypeLabel(metadata.firmCriteria.dealType)}
                        </Badge>
                      </div>
                      <p className="text-white/60">
                        Location: {metadata.firmCriteria.location}
                      </p>
                      <p className="text-white/60">
                        Focus: {getGeographicFocusLabel(metadata.firmCriteria.geographicFocus)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white">Payment Terms</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {metadata.paymentTerms.map((term, index) => (
                        <Badge key={index} variant="outline">
                          {getPaymentTermLabel(term)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Investment Details */}
                <div>
                  <h3 className="text-lg font-semibold text-white">Investment Details</h3>
                  <div className="mt-2 space-y-4">
                    <div>
                      <p className="text-white/60">Target Capital</p>
                      <p className="text-xl font-bold text-white">
                        {metadata.investment.targetCapital && ethers.utils.formatEther(metadata.investment.targetCapital)} LGR
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60">Investment Drivers</p>
                      <p className="text-white">{metadata.investment.drivers}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Additional Criteria</p>
                      <p className="text-white">{metadata.investment.additionalCriteria}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;
