
import { ethers } from "ethers";
import { ContractStatus } from "./proposalContractService";

export interface ValidationConfig {
  maxPaymentTerms: number;
  maxStrategiesPerCategory: number;
  maxSummaryLength: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

const DEFAULT_CONFIG: ValidationConfig = {
  maxPaymentTerms: 5,
  maxStrategiesPerCategory: 3,
  maxSummaryLength: 500
};

export const validateProposalMetadata = (
  metadata: any,
  config: ValidationConfig = DEFAULT_CONFIG
): ValidationResult => {
  const errors: Record<string, string[]> = {};

  // Title validation
  if (!metadata.title || metadata.title.trim().length === 0) {
    errors.title = ['Title is required'];
  }

  // Payment terms validation
  if (metadata.paymentTerms && metadata.paymentTerms.length > config.maxPaymentTerms) {
    errors.paymentTerms = [`Maximum of ${config.maxPaymentTerms} payment terms allowed`];
  }

  // Strategies validation
  if (metadata.strategies) {
    Object.entries(metadata.strategies).forEach(([category, strategies]: [string, any]) => {
      if (Array.isArray(strategies) && strategies.length > config.maxStrategiesPerCategory) {
        errors[`strategies.${category}`] = [
          `Maximum of ${config.maxStrategiesPerCategory} strategies allowed per category`
        ];
      }
    });
  }

  // Investment validation
  if (metadata.investment) {
    if (!metadata.investment.targetCapital) {
      errors['investment.targetCapital'] = ['Target capital is required'];
    }
    if (metadata.investment.drivers && 
        metadata.investment.drivers.length > config.maxSummaryLength) {
      errors['investment.drivers'] = [
        `Maximum length of ${config.maxSummaryLength} characters exceeded`
      ];
    }
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
