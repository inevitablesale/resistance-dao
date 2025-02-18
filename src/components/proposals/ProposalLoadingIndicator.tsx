
import { ProposalLoadingState } from "@/types/loadingStates";
import { Loader2 } from "lucide-react";

interface Props {
  loadingStates: ProposalLoadingState[];
}

export const ProposalLoadingIndicator = ({ loadingStates }: Props) => {
  const getLoadingMessage = (tier: 'events' | 'onchain' | 'ipfs') => {
    switch (tier) {
      case 'events':
        return 'Fetching proposal events...';
      case 'onchain':
        return 'Loading on-chain data...';
      case 'ipfs':
        return 'Retrieving additional metadata...';
    }
  };

  const activeLoadingState = loadingStates.find(state => state.isLoading);
  if (!activeLoadingState) return null;

  return (
    <div className="flex items-center gap-2 text-white/60">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>{getLoadingMessage(activeLoadingState.tier)}</span>
    </div>
  );
};
