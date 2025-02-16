
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, FileText, Wallet } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StoredProposal } from "@/types/proposals";
import { cn } from "@/lib/utils";

const ProposalDetails = () => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<StoredProposal | null>(null);

  useEffect(() => {
    const storedProposals = localStorage.getItem('userProposals');
    if (storedProposals) {
      const proposals: StoredProposal[] = JSON.parse(storedProposals);
      const foundProposal = proposals.find(p => p.hash === hash);
      if (foundProposal) {
        setProposal(foundProposal);
      }
    }
  }, [hash]);

  if (!proposal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/thesis')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Proposals
        </Button>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-500">Proposal not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/thesis')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Proposals
      </Button>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-polygon-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-polygon-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold text-white">{proposal.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted on {format(parseInt(proposal.timestamp), 'PPP')}</span>
                </CardDescription>
              </div>
            </div>
            <div className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              proposal.status === 'pending' && "bg-yellow-500/10 text-yellow-500",
              proposal.status === 'active' && "bg-blue-500/10 text-blue-500",
              proposal.status === 'completed' && "bg-green-500/10 text-green-500"
            )}>
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-2 p-4 rounded-lg bg-white/5 border border-white/10">
            <Wallet className="w-5 h-5 text-polygon-primary" />
            <div>
              <p className="text-sm font-medium text-white">Target Capital</p>
              <p className="text-lg font-semibold text-white">{proposal.targetCapital} USDC</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">IPFS Details</h3>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/60">Proposal Hash</p>
                  <p className="font-mono text-sm text-white break-all">{proposal.hash}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">IPFS Hash</p>
                  <p className="font-mono text-sm text-white break-all">{proposal.ipfsHash}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProposalDetails;
