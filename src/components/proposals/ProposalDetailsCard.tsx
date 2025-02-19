
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FACTORY_ADDRESS, FACTORY_ABI, LGR_TOKEN_ADDRESS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { getFromIPFS } from "@/services/ipfsService";
import { ProposalMetadata } from "@/types/proposals";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { getTokenBalance } from "@/services/tokenService";

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

  // Check LGR balance, exactly like in ProposalsHistory
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
  }, [isConnected, address, getProvider, toast]);

  // Fetch proposal details only after wallet and balance checks
  useEffect(() => {
    if (!tokenId) {
      toast({
        title: "Invalid Proposal ID",
        description: "Please provide a valid proposal ID.",
        variant: "destructive",
      });
      return;
    }

    const fetchProposalDetails = async () => {
      if (!isConnected || hasMinimumLGR === null || !hasMinimumLGR) return;

      setIsLoading(true);
      setLoadingProgress(20);

      try {
        const walletProvider = await getProvider();
        const factoryContract = new ethers.Contract(
          FACTORY_ADDRESS,
          FACTORY_ABI,
          walletProvider.provider
        );
        setLoadingProgress(40);

        const proposal = await factoryContract.proposals(tokenId);
        setLoadingProgress(60);

        const metadata = await getFromIPFS<ProposalMetadata>(proposal.ipfsMetadata, "proposal");
        setLoadingProgress(90);

        setProposalDetails(metadata);
      } catch (error: any) {
        console.error("Error fetching proposal details:", error);
        toast({
          title: "Failed to Load Proposal",
          description: error.message || "Could not retrieve proposal details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setLoadingProgress(100);
      }
    };

    fetchProposalDetails();
  }, [tokenId, isConnected, hasMinimumLGR, getProvider, toast]);

  if (!isConnected) {
    return (
      <Card className="w-full max-w-3xl mx-auto bg-black/80 text-white border-white/10">
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
      <Card className="w-full max-w-3xl mx-auto bg-black/80 text-white border-white/10">
        <CardContent className="p-6 text-center text-white/60">
          <p>You need at least {MIN_LGR_REQUIRED} LGR to view proposal details</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
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
    );
  }

  if (!proposalDetails) {
    return (
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
    );
  }

  return (
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
          {proposalDetails.investment && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Investment Details</h3>
              <p className="text-white/80">{proposalDetails.investment.drivers}</p>
              <p className="text-white/80">{proposalDetails.investment.additionalCriteria}</p>
            </div>
          )}

          {proposalDetails.firmCriteria && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Firm Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {proposalDetails.linkedInURL && (
            <div className="mt-4">
              <a 
                href={proposalDetails.linkedInURL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline inline-flex items-center"
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
