
import { FirmSize, DealType, GeographicFocus, PaymentTerm, OperationalStrategy, GrowthStrategy, IntegrationStrategy } from "@/lib/proposal-enums";

export interface StoredProposal {
  hash: string;
  ipfsHash: string;
  timestamp: string;
  title: string;
  targetCapital: string;
  status: 'pending' | 'completed' | 'failed';
  isTestMode?: boolean;
}

export interface ProposalInput {
  title: string;
  ipfsMetadata: string;
  targetCapital: string; // Will be converted to uint128
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

export interface ProposalMetadata extends Omit<ProposalInput, 'ipfsMetadata'> {
  isTestMode?: boolean;
  submissionTimestamp?: number;
  submitter?: string;
}

export interface ProposalData {
  creator: string;
  creatorLinkedIn: string;
  title: string;
  ipfsMetadata: string;
  targetCapital: string;
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
  totalVotes: number;
}
