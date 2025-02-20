
import { ethers } from "ethers";

export enum FirmSize {
  BELOW_1M,
  ONE_TO_FIVE_M,
  FIVE_TO_TEN_M,
  TEN_PLUS
}

export enum DealType {
  ACQUISITION,
  MERGER,
  EQUITY_BUYOUT,
  FRANCHISE,
  SUCCESSION
}

export enum GeographicFocus {
  LOCAL,
  REGIONAL,
  NATIONAL,
  REMOTE
}

export enum PaymentTerm {
  CASH,
  SELLER_FINANCING,
  EARNOUT,
  EQUITY_ROLLOVER,
  BANK_FINANCING
}

export enum OperationalStrategy {
  TECH_MODERNIZATION,
  PROCESS_STANDARDIZATION,
  STAFF_RETENTION
}

export enum GrowthStrategy {
  GEOGRAPHIC_EXPANSION,
  SERVICE_EXPANSION,
  CLIENT_GROWTH
}

export enum IntegrationStrategy {
  MERGING_OPERATIONS,
  CULTURE_INTEGRATION,
  SYSTEMS_CONSOLIDATION
}

export interface ContractProposal {
  title: string;
  ipfsMetadata: string;
  targetCapital: string;  // Will be formatted from BigNumber
  votingEnds: number;
  investmentDrivers: string;
  additionalCriteria: string;
  firmSize: FirmSize;
  location: string;
  dealType: DealType;
  geographicFocus: GeographicFocus;
  paymentTerms: PaymentTerm[];
  operationalStrategies: OperationalStrategy[];
  growthStrategies: GrowthStrategy[];
  integrationStrategies: IntegrationStrategy[];
}

export interface ProposalMetadata {
  title: string;
  firmCriteria: {
    size: FirmSize;
    location: string;
    dealType: DealType;
    geographicFocus: GeographicFocus;
  };
  paymentTerms: PaymentTerm[];
  strategies: {
    operational: OperationalStrategy[];
    growth: GrowthStrategy[];
    integration: IntegrationStrategy[];
  };
  investment: {
    targetCapital: string;
    drivers: string;
    additionalCriteria: string;
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
  ipfsHash: string;
  metadata: ProposalMetadata;
  linkedInURL: string;
}

export interface ProposalInput {
  title: string;
  ipfsMetadata: string;
  targetCapital: ethers.BigNumber;
  votingDuration: number;
  investmentDrivers: string;
  additionalCriteria: string;
  firmSize: FirmSize;
  location: string;
  dealType: DealType;
  geographicFocus: GeographicFocus;
  paymentTerms: PaymentTerm[];
  operationalStrategies: OperationalStrategy[];
  growthStrategies: GrowthStrategy[];
  integrationStrategies: IntegrationStrategy[];
}

export interface ProposalContractInput {
  title: string;
  ipfsMetadata: string;
  targetCapital: ethers.BigNumber;
  votingDuration: number;
  investmentDrivers: string;
  additionalCriteria: string;
  firmSize: FirmSize;
  location: string;
  dealType: DealType;
  geographicFocus: GeographicFocus;
  paymentTerms: PaymentTerm[];
  operationalStrategies: OperationalStrategy[];
  growthStrategies: GrowthStrategy[];
  integrationStrategies: IntegrationStrategy[];
}

// New type that exactly matches contract tuple structure
export interface ProposalContractTuple {
  title: string;
  ipfsMetadata: string;
  targetCapital: string;  // uint128 as string
  votingDuration: number;
  investmentDrivers: string;
  additionalCriteria: string;
  firmSize: number;      // uint8
  location: string;
  dealType: number;      // uint8
  geographicFocus: number; // uint8
  paymentTerms: number[];  // uint8[]
  operationalStrategies: number[]; // uint8[]
  growthStrategies: number[];     // uint8[]
  integrationStrategies: number[]; // uint8[]
}

