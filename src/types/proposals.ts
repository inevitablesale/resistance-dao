
import { ethers } from "ethers";

export interface ContractProposal {
  title: string;
  metadataURI: string;
  targetCapital: string;  // Will be formatted from BigNumber
  votingEnds: number;
}

export interface ProposalMetadata {
  title: string;
  investment: {
    targetCapital: string;
    description: string;
  };
  votingDuration: number;
  linkedInURL: string;
  isTestMode?: boolean;
  submissionTimestamp?: number;
  submitter?: string;
}

export interface StoredProposal {
  hash: string;
  ipfsHash: string;
  timestamp: string;
  title: string;
  targetCapital: string;
  status: 'pending' | 'completed' | 'failed';
  isTestMode?: boolean;
}

export interface ProposalConfig {
  targetCapital: ethers.BigNumber;
  votingDuration: number;
  metadataURI: string;
  metadata: ProposalMetadata;
  linkedInURL: string;
}

export interface ProposalInput {
  title: string;
  metadataURI: string;
  targetCapital: ethers.BigNumber;
  votingDuration: number;
}

export interface ProposalContractInput {
  title: string;
  metadataURI: string;
  targetCapital: ethers.BigNumber;
  votingDuration: number;
}

export interface ProposalContractTuple {
  title: string;
  metadataURI: string;
  targetCapital: string;  // uint128 as string
  votingDuration: number;
}
