
export interface StoredProposal {
  hash: string;
  ipfsHash: string;
  timestamp: string;
  title: string;
  targetCapital: string;
  status: 'pending' | 'completed' | 'failed';
  isTestMode?: boolean;
}

export interface ProposalMetadata {
  title: string;
  firmCriteria: {
    size: string;
    location: string;
    dealType: string;
    geographicFocus: string;
  };
  paymentTerms: string[];
  strategies: {
    operational: string[];
    growth: string[];
    integration: string[];
  };
  investment: {
    targetCapital: string;
    drivers: string;
    additionalCriteria: string;
  };
  isTestMode?: boolean;
  submissionTimestamp?: number;
  submitter?: string;
}
