
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ProposalLoadingState extends LoadingState {
  tier: 'events' | 'onchain' | 'ipfs';
}
