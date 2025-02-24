import { ethers } from "ethers";

export enum FirmSize {
  BELOW_1M = 0,
  ONE_TO_FIVE_M = 1,
  FIVE_TO_TEN_M = 2,
  TEN_PLUS = 3
}

export enum DealType {
  EQUITY_BUYOUT = 0,
  FRANCHISE = 1,
  SUCCESSION = 2,
  ACQUISITION = 3,
  MERGER = 4,
  PARTNERSHIP = 5
}

export enum GeographicFocus {
  LOCAL = 0,
  REGIONAL = 1,
  NATIONAL = 2,
  INTERNATIONAL = 3,
  REMOTE = 4
}

export enum PaymentTerm {
  CASH = 0,
  SELLER_FINANCING = 1,
  EARNOUT = 2,
  EQUITY_ROLLOVER = 3,
  BANK_FINANCING = 4
}

export enum OperationalStrategy {
  TECH_MODERNIZATION = 0,
  PROCESS_STANDARDIZATION = 1,
  STAFF_RETENTION = 2
}

export enum GrowthStrategy {
  GEOGRAPHIC_EXPANSION = 0,
  SERVICE_EXPANSION = 1,
  CLIENT_GROWTH = 2
}

export enum IntegrationStrategy {
  MERGING_OPERATIONS = 0,
  CULTURE_INTEGRATION = 1,
  SYSTEMS_CONSOLIDATION = 2
}

export interface TeamMember {
  name?: string;
  role?: string;
  linkedin?: string;
  github?: string;
}

export interface RoadmapMilestone {
  milestone: string;
  expectedDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface FundingBreakdown {
  category: string;
  amount: string;
}

export interface BackerIncentives {
  utility?: string;
  governance?: string;
  NFTRewards?: string;
  tokenAllocation?: string;
}

export interface ProposalSocials {
  twitter?: string;
  discord?: string;
  telegram?: string;
}

export interface FirmCriteria {
  size: FirmSize;
  location: string;
  dealType: DealType;
  geographicFocus: GeographicFocus;
}

export interface Strategies {
  operational: OperationalStrategy[];
  growth: GrowthStrategy[];
  integration: IntegrationStrategy[];
}

export interface ContractProposal {
  title: string;
  metadataURI: string;
  targetCapital: string;  // Will be formatted from BigNumber
  votingEnds: number;
}

export interface ProposalMetadata {
  title: string;
  description?: string;
  category?: string;
  investment: {
    targetCapital: string;
    description: string;
    drivers?: string[];
    additionalCriteria?: string;
  };
  votingDuration: number;
  linkedInURL: string;
  blockchain?: string[];
  fundingBreakdown?: FundingBreakdown[];
  investmentDrivers?: string[];
  backerIncentives?: BackerIncentives;
  team?: TeamMember[];
  roadmap?: RoadmapMilestone[];
  socials?: ProposalSocials;
  firmCriteria?: FirmCriteria;
  paymentTerms?: PaymentTerm[];
  strategies?: Strategies;
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
  ipfsHash?: string;
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
  targetCapital: string;
  votingDuration: number;
}

export interface ProposalEvent {
  tokenId: string;
  creator: string;
  blockNumber: number;
  transactionHash: string;
  isLoading: boolean;
  metadata?: ProposalMetadata;
  nftMetadata?: NFTMetadata;
  pledgedAmount?: string;
  error?: string;
}
