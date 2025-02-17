import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

export function ProposalDetails() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const [proposalDetails, setProposalDetails] = useState<any>(null);
  const { getProvider } = useWalletProvider();
  const { toast } = useToast();

  useEffect(() => {
    if (proposalId) {
      loadProposalDetails();
    }
  }, [proposalId]);

  const loadProposalDetails = async () => {
    try {
      const walletProvider = await getProvider();
      // Use the ethers provider directly
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        walletProvider.provider
      );

      const proposal = await contract.proposals(proposalId);
      setProposalDetails({
        id: proposal.id.toString(),
        proposer: proposal.proposer,
        description: proposal.description,
        amount: ethers.utils.formatEther(proposal.amount),
        status: proposal.status,
      });
    } catch (error: any) {
      console.error("Error loading proposal details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load proposal details",
        variant: "destructive",
      });
    }
  };

  if (!proposalDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle>Proposal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>ID:</strong> {proposalDetails.id}
            </p>
            <p>
              <strong>Proposer:</strong> {proposalDetails.proposer}
            </p>
            <p>
              <strong>Description:</strong> {proposalDetails.description}
            </p>
            <p>
              <strong>Amount:</strong> {proposalDetails.amount} LGR
            </p>
            <p>
              <strong>Status:</strong> {proposalDetails.status}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
