
import { useState } from "react";
import { ThumbsUp, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { ethers } from "ethers";
import { FACTORY_ADDRESS, FACTORY_ABI, LGR_TOKEN_ADDRESS } from "@/lib/constants";
import { useWalletProvider } from "@/hooks/useWalletProvider";

interface VotingSectionProps {
  tokenId: string;
  owner: string;
}

export const VotingSection = ({ tokenId, owner }: VotingSectionProps) => {
  const { toast } = useToast();
  const { isConnected, connect } = useWalletConnection();
  const { getProvider } = useWalletProvider();
  const [pledgeAmount, setPledgeAmount] = useState("");
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    if (!isConnected) {
      connect();
      return;
    }

    if (!pledgeAmount) {
      toast({
        title: "Enter Pledge Amount",
        description: "Please enter how much LGR you want to pledge",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsVoting(true);
      console.log('Starting vote process...');

      const walletProvider = await getProvider();
      console.log('Got wallet provider');

      const signer = walletProvider.provider.getSigner();
      const lgrToken = new ethers.Contract(
        LGR_TOKEN_ADDRESS,
        ["function approve(address spender, uint256 amount) returns (bool)"],
        signer
      );

      const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
      const votingFee = await factory.VOTING_FEE();
      console.log('Voting fee:', ethers.utils.formatEther(votingFee));

      const pledgeAmountWei = ethers.utils.parseEther(pledgeAmount);
      const totalNeeded = pledgeAmountWei.add(votingFee);
      console.log('Total needed:', ethers.utils.formatEther(totalNeeded));

      console.log('Approving LGR tokens...');
      const approveTx = await lgrToken.approve(FACTORY_ADDRESS, totalNeeded);
      await approveTx.wait();
      console.log('LGR tokens approved');

      console.log('Submitting vote...');
      const voteTx = await factory.vote(tokenId, pledgeAmountWei, {
        gasLimit: 500000 // Explicit gas limit for better handling
      });
      
      const receipt = await voteTx.wait();
      console.log('Vote confirmed in block:', receipt.blockNumber);

      toast({
        title: "Vote Submitted",
        description: `Successfully pledged ${pledgeAmount} LGR to this proposal`,
      });

      setPledgeAmount("");
    } catch (error: any) {
      console.error('Error voting:', error);
      toast({
        title: "Error Voting",
        description: error.message || "Failed to submit your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <>
      <div className="text-sm text-gray-400 space-y-1 bg-black/20 rounded-lg p-3 border border-white/5">
        <div>Token ID: {tokenId}</div>
        <div className="truncate">
          Owner: {owner.slice(0, 6)}...{owner.slice(-4)}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pledgeAmount" className="text-white/60">
            Pledge Amount (LGR)
          </Label>
          <Input
            id="pledgeAmount"
            type="number"
            min="0"
            step="0.1"
            value={pledgeAmount}
            onChange={(e) => setPledgeAmount(e.target.value)}
            placeholder="Enter LGR amount"
            className="bg-black/40 border-white/10 text-white"
          />
          <p className="text-sm text-white/60 flex items-center gap-2">
            <Info className="w-4 h-4" />
            There is a 10 LGR voting fee required to pledge support
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2 bg-teal-900/40 border-teal-500/40 hover:bg-teal-500/20 hover:border-teal-500/40 transition-all duration-300 text-white"
            onClick={handleVote}
            disabled={isVoting}
          >
            <ThumbsUp className="w-5 h-5" />
            {isVoting ? "Pledging..." : "Pledge Support"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2 bg-purple-900/40 border-purple-500/40 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-300 text-white"
            onClick={() => window.location.href = `/marketplace/${tokenId}`}
          >
            <ChevronRight className="w-5 h-5" />
            Learn More
          </Button>
        </div>
      </div>
    </>
  );
};
