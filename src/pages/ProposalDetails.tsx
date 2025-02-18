import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { getFromIPFS } from "@/services/ipfsService";
import { StoredProposal, ProposalMetadata } from "@/types/proposals";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HandCoins, Clock, Users, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProposalDetails {
  metadata: ProposalMetadata;
  onChainData: {
    pledgedAmount: ethers.BigNumber;
    votingEndsAt: number;
    backers: string[];
  };
}

const ProposalDetails = () => {
  const { hash } = useParams<{ hash: string }>();
  const [proposalDetails, setProposalDetails] = useState<ProposalDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getProvider } = useWalletProvider();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (hash) {
      loadProposalDetails();
    }
  }, [hash]);

  const loadProposalDetails = async () => {
    try {
      setIsLoading(true);
      
      // First, get the stored proposal data
      const storedProposals: StoredProposal[] = JSON.parse(localStorage.getItem('userProposals') || '[]');
      const storedProposal = storedProposals.find(p => p.hash === hash);
      
      if (!storedProposal) {
        throw new Error('Proposal not found');
      }

      // Get IPFS metadata with the correct type
      console.log('Fetching IPFS metadata from:', storedProposal.ipfsHash);
      const metadata = await getFromIPFS<ProposalMetadata>(storedProposal.ipfsHash, 'proposal');

      // Get on-chain data
      const walletProvider = await getProvider();
      const contract = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        walletProvider.provider
      );

      const [pledgedAmount, backers] = await Promise.all([
        contract.pledgedAmount(storedProposal.hash),
        contract.getProposalBackers(storedProposal.hash)
      ]);

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
      console.error("Error loading proposal details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load proposal details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                            {ethers.utils.formatEther(metadata.investment.targetCapital)} LGR
                          </p>
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
                          <p className="text-xl font-bold text-white">
                            {onChainData.backers.length}
                          </p>
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
                          <p className="text-xl font-bold text-white">
                            {new Date(onChainData.votingEndsAt * 1000).toLocaleDateString()}
                          </p>
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
