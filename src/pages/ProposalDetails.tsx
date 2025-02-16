
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, FileText, Wallet } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StoredProposal } from "@/types/proposals";
import { cn } from "@/lib/utils";
import { useDynamicUtils } from "@/hooks/useDynamicUtils";
import { ethers } from "ethers";

const PROPOSAL_ABI = [
  "function title() public view returns (string)",
  "function ipfsHash() public view returns (string)",
  "function targetCapital() public view returns (uint256)",
  "function status() public view returns (uint8)", // 0: pending, 1: active, 2: completed
  "function createdAt() public view returns (uint256)",
  "function votesFor() public view returns (uint256)",
  "function votesAgainst() public view returns (uint256)",
  "function votingEndsAt() public view returns (uint256)"
];

interface OnChainProposal {
  title: string;
  ipfsHash: string;
  targetCapital: ethers.BigNumber;
  status: number;
  createdAt: number;
  votesFor: ethers.BigNumber;
  votesAgainst: ethers.BigNumber;
  votingEndsAt: number;
}

const ProposalDetails = () => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<StoredProposal | null>(null);
  const [onChainData, setOnChainData] = useState<OnChainProposal | null>(null);
  const { getProvider } = useDynamicUtils();

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

  useEffect(() => {
    const fetchOnChainData = async () => {
      if (!hash) return;

      try {
        const provider = await getProvider();
        const proposalContract = new ethers.Contract(hash, PROPOSAL_ABI, provider);

        const [
          title,
          ipfsHash,
          targetCapital,
          status,
          createdAt,
          votesFor,
          votesAgainst,
          votingEndsAt
        ] = await Promise.all([
          proposalContract.title(),
          proposalContract.ipfsHash(),
          proposalContract.targetCapital(),
          proposalContract.status(),
          proposalContract.createdAt(),
          proposalContract.votesFor(),
          proposalContract.votesAgainst(),
          proposalContract.votingEndsAt()
        ]);

        setOnChainData({
          title,
          ipfsHash,
          targetCapital,
          status,
          createdAt: Number(createdAt),
          votesFor,
          votesAgainst,
          votingEndsAt: Number(votingEndsAt)
        });
      } catch (error) {
        console.error("Error fetching on-chain data:", error);
      }
    };

    fetchOnChainData();
  }, [hash, getProvider]);

  const getStatusString = (status: number) => {
    switch (status) {
      case 0:
        return 'pending';
      case 1:
        return 'active';
      case 2:
        return 'completed';
      default:
        return 'pending';
    }
  };

  if (!proposal && !onChainData) {
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

  const displayedStatus = onChainData ? getStatusString(onChainData.status) : proposal?.status || 'pending';
  const displayedTitle = onChainData?.title || proposal?.title || '';
  const displayedTargetCapital = onChainData ? 
    ethers.utils.formatUnits(onChainData.targetCapital, 6) : 
    proposal?.targetCapital || '0';
  const displayedTimestamp = onChainData ? 
    onChainData.createdAt * 1000 : 
    proposal ? parseInt(proposal.timestamp) : Date.now();

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
                <CardTitle className="text-2xl font-semibold text-white">{displayedTitle}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted on {format(displayedTimestamp, 'PPP')}</span>
                </CardDescription>
              </div>
            </div>
            <div className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              displayedStatus === 'pending' && "bg-yellow-500/10 text-yellow-500",
              displayedStatus === 'active' && "bg-blue-500/10 text-blue-500",
              displayedStatus === 'completed' && "bg-green-500/10 text-green-500"
            )}>
              {displayedStatus.charAt(0).toUpperCase() + displayedStatus.slice(1)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-2 p-4 rounded-lg bg-white/5 border border-white/10">
            <Wallet className="w-5 h-5 text-polygon-primary" />
            <div>
              <p className="text-sm font-medium text-white">Target Capital</p>
              <p className="text-lg font-semibold text-white">{displayedTargetCapital} USDC</p>
            </div>
          </div>

          {onChainData && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Voting Status</h3>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-white/60">Votes For</p>
                    <p className="text-lg font-semibold text-green-500">{ethers.utils.formatEther(onChainData.votesFor)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Votes Against</p>
                    <p className="text-lg font-semibold text-red-500">{ethers.utils.formatEther(onChainData.votesAgainst)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-white/60">Voting Ends</p>
                  <p className="text-sm text-white">{format(onChainData.votingEndsAt * 1000, 'PPP pp')}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">IPFS Details</h3>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/60">Proposal Hash</p>
                  <p className="font-mono text-sm text-white break-all">{hash}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">IPFS Hash</p>
                  <p className="font-mono text-sm text-white break-all">{onChainData?.ipfsHash || proposal?.ipfsHash}</p>
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

