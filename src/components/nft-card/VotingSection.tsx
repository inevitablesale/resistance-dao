
import { ThumbsUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VotingSectionProps {
  tokenId: string;
  owner: string;
}

export const VotingSection = ({ tokenId, owner }: VotingSectionProps) => {
  const { toast } = useToast();

  const handleVote = async () => {
    try {
      toast({
        title: "Coming Soon",
        description: `Voting will be implemented through smart contracts`,
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
          className="flex items-center gap-2 bg-teal-900/40 border-teal-500/40 hover:bg-teal-500/20 hover:border-teal-500/40 transition-all duration-300"
          onClick={() => handleVote()}
        >
          <ThumbsUp className="w-5 h-5" />
          Vote Up
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 bg-purple-900/40 border-purple-500/40 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
          onClick={() => window.location.href = `/marketplace/${tokenId}`}
        >
          <ChevronRight className="w-5 h-5" />
          Learn More
        </Button>
      </div>
    </>
  );
};
