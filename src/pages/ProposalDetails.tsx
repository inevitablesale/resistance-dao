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
  ProposalMetadata
} from "@/types/proposals";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChevronLeft, 
  Wallet, 
  Loader2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";

const ProposalDetails = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected, connect } = useWalletConnection();
  const [proposalDetails, setProposalDetails] = useState<ProposalMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { getProvider } = useWalletProvider();

  const fetchProposalDetails = async (tokenId: string) => {
    setIsLoading(true);
    setLoadingProgress(20);

    try {
      const provider = await getProvider();
      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
      setLoadingProgress(40);

      const proposal = await factoryContract.proposals(tokenId);
      setLoadingProgress(60);

      const metadata = await getFromIPFS<ProposalMetadata>(proposal.ipfsMetadata);
      setLoadingProgress(90);

      return metadata;
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
    if (!tokenId) {
      toast({
        title: "Invalid Proposal ID",
        description: "Please provide a valid proposal ID.",
        variant: "destructive",
      });
      return;
    }

    const loadProposalDetails = async () => {
      const details = await fetchProposalDetails(tokenId);
      if (details) {
        setProposalDetails(details);
      }
    };

    loadProposalDetails();
  }, [tokenId, toast]);

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

          {isLoading ? (
            <Card className="w-full max-w-3xl mx-auto bg-black/80 text-white border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Loading Proposal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[60%]" />
                <Skeleton className="h-4 w-[40%]" />
                <Progress value={loadingProgress} className="mt-4" />
              </CardContent>
            </Card>
          ) : proposalDetails ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="w-full max-w-3xl mx-auto bg-black/80 text-white border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    {proposalDetails.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Description</h3>
                    <p className="text-white/80">{proposalDetails.description}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <strong>Firm Size:</strong>{" "}
                        {proposalDetails.firmSize}
                      </div>
                      <div>
                        <strong>Deal Type:</strong>{" "}
                        {proposalDetails.dealType}
                      </div>
                      <div>
                        <strong>Geographic Focus:</strong>{" "}
                        {proposalDetails.geographicFocus}
                      </div>
                      <div>
                        <strong>Payment Term:</strong>{" "}
                        {proposalDetails.paymentTerm}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Team</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <strong>Name:</strong> {proposalDetails.team.name}
                      </div>
                      <div>
                        <strong>Email:</strong> {proposalDetails.team.email}
                      </div>
                      <div>
                        <strong>LinkedIn:</strong>{" "}
                        <a 
                          href={proposalDetails.team.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View Profile <ExternalLink className="inline-block w-4 h-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="w-full max-w-3xl mx-auto bg-black/80 text-white border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Proposal Not Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>The requested proposal could not be found.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <LGRFloatingWidget />
    </div>
  );
};

export default ProposalDetails;
