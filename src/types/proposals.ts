
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
  isTestMode?: boolean;
  submissionTimestamp?: number;
  submitter?: string;
  linkedInURL?: string;
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
