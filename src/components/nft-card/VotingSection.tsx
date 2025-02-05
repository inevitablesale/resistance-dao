
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VotingSectionProps {
  tokenId: string;
  owner: string;
}

export const VotingSection = ({ tokenId, owner }: VotingSectionProps) => {
  const { toast } = useToast();

  const handleVote = async (voteType: 'up' | 'down') => {
    try {
      toast({
        title: "Coming Soon",
        description: `Voting ${voteType} will be implemented through smart contracts`,
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error Voting",
        description: "Failed to submit your vote. Please try again.",
        variant: "destructive",
      });
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

      <div className="flex justify-center gap-4 mt-2">
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 bg-black/40 border-white/10 hover:bg-green-500/20 hover:border-green-500/40 transition-all duration-300"
          onClick={() => handleVote('up')}
        >
          <ThumbsUp className="w-5 h-5" />
          Vote Up
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 bg-black/40 border-white/10 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-300"
          onClick={() => handleVote('down')}
        >
          <ThumbsDown className="w-5 h-5" />
          Vote Down
        </Button>
      </div>
    </>
  );
};
