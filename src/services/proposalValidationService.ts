
import { ethers } from "ethers";
import { ContractStatus } from "./proposalContractService";

export interface ValidationConfig {
  maxPaymentTerms: number;
  maxStrategiesPerCategory: number;
  maxSummaryLength: number;
  minTitleLength: number;
  minDriversLength: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export interface FirmCriteria {
  size: string;
  location: string;
  dealType: string;
  geographicFocus: string;
}

export interface Investment {
  targetCapital: string;
  drivers: string;
  additionalCriteria: string;
}

export interface Strategies {
  operational: string[];
  growth: string[];
  integration: string[];
}

export interface ProposalMetadata {
  title: string;
  firmCriteria: FirmCriteria;
  paymentTerms: string[];
  strategies: Strategies;
  investment: Investment;
}

const DEFAULT_CONFIG: ValidationConfig = {
  maxPaymentTerms: 5,
  maxStrategiesPerCategory: 3,
  maxSummaryLength: 500,
  minTitleLength: 10,
  minDriversLength: 50
};

export const validateProposalMetadata = (
  metadata: ProposalMetadata,
  config: ValidationConfig = DEFAULT_CONFIG
): ValidationResult => {
  const errors: Record<string, string[]> = {};

  // Title validation
  if (!metadata.title || metadata.title.trim().length === 0) {
    errors.title = ['Title is required'];
  } else if (metadata.title.trim().length < config.minTitleLength) {
    errors.title = [`Title must be at least ${config.minTitleLength} characters long`];
  }

  // Firm criteria validation
  if (!metadata.firmCriteria.size || !['below-1m', '1m-5m', '5m-10m', '10m-plus'].includes(metadata.firmCriteria.size)) {
    errors['firmCriteria.size'] = ['Invalid firm size selected'];
  }

  if (!metadata.firmCriteria.geographicFocus || 
      !['local', 'regional', 'national', 'remote'].includes(metadata.firmCriteria.geographicFocus)) {
    errors['firmCriteria.geographicFocus'] = ['Invalid geographic focus selected'];
  }

  if (!metadata.firmCriteria.dealType || 
      !['acquisition', 'merger', 'equity-buyout', 'franchise', 'succession'].includes(metadata.firmCriteria.dealType)) {
    errors['firmCriteria.dealType'] = ['Invalid deal type selected'];
  }

  // Payment terms validation
  const validPaymentTerms = ['cash', 'seller-financing', 'earnout', 'equity-rollover', 'bank-financing'];
  if (!Array.isArray(metadata.paymentTerms)) {
    errors.paymentTerms = ['Invalid payment terms format'];
  } else if (metadata.paymentTerms.length === 0) {
    errors.paymentTerms = ['At least one payment term is required'];
  } else if (metadata.paymentTerms.length > config.maxPaymentTerms) {
    errors.paymentTerms = [`Maximum of ${config.maxPaymentTerms} payment terms allowed`];
  } else if (!metadata.paymentTerms.every(term => validPaymentTerms.includes(term))) {
    errors.paymentTerms = ['Invalid payment term selected'];
  }

  // Strategies validation
  const validateStrategyCategory = (
    category: keyof Strategies,
    strategies: string[],
    validOptions: string[]
  ) => {
    if (!Array.isArray(strategies)) {
      errors[`strategies.${category}`] = ['Invalid strategy format'];
    } else if (strategies.length === 0) {
      errors[`strategies.${category}`] = ['At least one strategy is required'];
    } else if (strategies.length > config.maxStrategiesPerCategory) {
      errors[`strategies.${category}`] = [
        `Maximum of ${config.maxStrategiesPerCategory} strategies allowed`
      ];
    } else if (!strategies.every(strategy => validOptions.includes(strategy))) {
      errors[`strategies.${category}`] = ['Invalid strategy selected'];
    }
  };

  validateStrategyCategory('operational', metadata.strategies.operational, 
    ['tech-modernization', 'process-standardization', 'staff-retention']);
  validateStrategyCategory('growth', metadata.strategies.growth,
    ['geographic-expansion', 'service-expansion', 'client-growth']);
  validateStrategyCategory('integration', metadata.strategies.integration,
    ['merging-operations', 'culture-integration', 'systems-consolidation']);

  // Investment drivers validation
  if (!metadata.investment.drivers || metadata.investment.drivers.trim().length === 0) {
    errors['investment.drivers'] = ['Investment drivers are required'];
  } else if (metadata.investment.drivers.trim().length < config.minDriversLength) {
    errors['investment.drivers'] = [`Investment drivers must be at least ${config.minDriversLength} characters long`];
  } else if (metadata.investment.drivers.length > config.maxSummaryLength) {
    errors['investment.drivers'] = [
      `Maximum length of ${config.maxSummaryLength} characters exceeded`
    ];
  }

  if (metadata.investment.additionalCriteria && 
      metadata.investment.additionalCriteria.length > config.maxSummaryLength) {
    errors['investment.additionalCriteria'] = [
      `Maximum length of ${config.maxSummaryLength} characters exceeded`
    ];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateIPFSHash = (hash: string): boolean => {
  // IPFS hash validation (for CIDv0 and CIDv1)
  const cidv0Regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
  const cidv1Regex = /^b[A-Za-z2-7]{58}$/;
  
  return cidv0Regex.test(hash) || cidv1Regex.test(hash);
};

export const validateContractParameters = (
  config: { targetCapital: ethers.BigNumber; votingDuration: number },
  status: ContractStatus
): ValidationResult => {
  const errors: Record<string, string[]> = {};

  // Validate target capital
  if (config.targetCapital.lt(status.minTargetCapital)) {
    errors.targetCapital = [`Target capital must be at least ${ethers.utils.formatEther(status.minTargetCapital)} ETH`];
  }
  if (config.targetCapital.gt(status.maxTargetCapital)) {
    errors.targetCapital = [`Target capital must not exceed ${ethers.utils.formatEther(status.maxTargetCapital)} ETH`];
  }

  // Validate voting duration
  if (config.votingDuration < status.minVotingDuration) {
    errors.votingDuration = [`Voting duration must be at least ${status.minVotingDuration / (24 * 3600)} days`];
  }
  if (config.votingDuration > status.maxVotingDuration) {
    errors.votingDuration = [`Voting duration must not exceed ${status.maxVotingDuration / (24 * 3600)} days`];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
