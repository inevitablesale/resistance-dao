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

export interface Industry {
  focus: string;
  other?: string;
}

export interface FirmCriteria {
  size: string;
  location: string;
  dealType: string;
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
  industry: Industry;
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

  // Industry validation
  if (!metadata.industry.focus || metadata.industry.focus.trim().length === 0) {
    errors['industry.focus'] = ['Industry focus is required'];
  }

  // Firm criteria validation
  if (!metadata.firmCriteria.size || metadata.firmCriteria.size.trim().length === 0) {
    errors['firmCriteria.size'] = ['Firm size is required'];
  }
  if (!metadata.firmCriteria.location || metadata.firmCriteria.location.trim().length === 0) {
    errors['firmCriteria.location'] = ['Location is required'];
  }
  if (!metadata.firmCriteria.dealType || metadata.firmCriteria.dealType.trim().length === 0) {
    errors['firmCriteria.dealType'] = ['Deal type is required'];
  }

  // Payment terms validation
  if (!Array.isArray(metadata.paymentTerms)) {
    errors.paymentTerms = ['Invalid payment terms format'];
  } else if (metadata.paymentTerms.length === 0) {
    errors.paymentTerms = ['At least one payment term is required'];
  } else if (metadata.paymentTerms.length > config.maxPaymentTerms) {
    errors.paymentTerms = [`Maximum of ${config.maxPaymentTerms} payment terms allowed`];
  }

  // Strategies validation
  if (metadata.strategies) {
    Object.entries(metadata.strategies).forEach(([category, strategies]: [string, string[]]) => {
      if (!Array.isArray(strategies)) {
        errors[`strategies.${category}`] = ['Invalid strategy format'];
      } else if (strategies.length === 0) {
        errors[`strategies.${category}`] = ['At least one strategy is required'];
      } else if (strategies.length > config.maxStrategiesPerCategory) {
        errors[`strategies.${category}`] = [
          `Maximum of ${config.maxStrategiesPerCategory} strategies allowed per category`
        ];
      }
    });
  }

  // Investment validation
  if (!metadata.investment.targetCapital) {
    errors['investment.targetCapital'] = ['Target capital is required'];
  } else if (!/^\d+(\.\d{1,2})?$/.test(metadata.investment.targetCapital)) {
    errors['investment.targetCapital'] = ['Target capital must be a valid number with up to 2 decimal places'];
  }

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
