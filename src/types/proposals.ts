
import { ethers } from "ethers";

export interface ContractStatus {
  submissionFee: string;
  isPaused: boolean;
  isTestMode: boolean;
  treasury: string;
  minTargetCapital: string;
  maxTargetCapital: string;
  minVotingDuration: number;
  maxVotingDuration: number;
  votingFee: string;
  lgrTokenAddress: string;
  owner: string;
}

export interface StoredProposal {
  hash: string;
  ipfsHash: string;
  timestamp: string;
  title: string;
  targetCapital: string;
  status: 'pending' | 'active' | 'completed';
}
