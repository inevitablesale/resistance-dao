
import { ethers } from "ethers";
import { ContractStatus } from "./proposalContractService";

export interface ValidationConfig {
  maxPaymentTerms: number;
  maxStrategiesPerCategory: number;
  maxSummaryLength: number;
  minTitleLength: number;
  minDriversLength: number;
  targetCapitalMin: ethers.BigNumber;
  targetCapitalMax: ethers.BigNumber;
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
  minDriversLength: 50,
  targetCapitalMin: ethers.utils.parseEther("1000"),
  targetCapitalMax: ethers.utils.parseEther("25000000")
};

export const validateProposalMetadata = (
  metadata: ProposalMetadata,
  config: ValidationConfig = DEFAULT_CONFIG
): ValidationResult => {
  const errors: Record<string, string[]> = {};

  // Basic Info validation
  if (!metadata.title) {
    errors.title = ['Title is required'];
  } else if (metadata.title.trim().length < config.minTitleLength) {
    errors.title = [`Title must be at least ${config.minTitleLength} characters`];
  }

  // Target Capital validation
  if (!metadata.investment.targetCapital) {
    errors['investment.targetCapital'] = ['Target capital amount is required'];
  } else {
    try {
      const targetCapitalWei = ethers.utils.parseEther(metadata.investment.targetCapital);
      if (targetCapitalWei.lt(config.targetCapitalMin)) {
        errors['investment.targetCapital'] = [`Minimum target capital is ${ethers.utils.formatEther(config.targetCapitalMin)} ETH`];
      }
      if (targetCapitalWei.gt(config.targetCapitalMax)) {
        errors['investment.targetCapital'] = [`Maximum target capital is ${ethers.utils.formatEther(config.targetCapitalMax)} ETH`];
      }
    } catch (error) {
      errors['investment.targetCapital'] = ['Invalid target capital amount'];
    }
  }

  // Investment Drivers validation
  if (!metadata.investment.drivers) {
    errors['investment.drivers'] = ['Investment drivers are required'];
  } else if (metadata.investment.drivers.trim().length < config.minDriversLength) {
    errors['investment.drivers'] = [`Please provide at least ${config.minDriversLength} characters explaining the investment drivers`];
  } else if (metadata.investment.drivers.length > config.maxSummaryLength) {
    errors['investment.drivers'] = [`Maximum length is ${config.maxSummaryLength} characters`];
  }

  // Firm Criteria validation
  if (!metadata.firmCriteria.size) {
    errors['firmCriteria.size'] = ['Please select a firm size'];
  } else if (!['below-1m', '1m-5m', '5m-10m', '10m-plus'].includes(metadata.firmCriteria.size)) {
    errors['firmCriteria.size'] = ['Invalid firm size selected'];
  }

  // Location is optional, but if provided must be valid
  if (metadata.firmCriteria.location && 
      !US_STATES.includes(metadata.firmCriteria.location.toUpperCase())) {
    errors['firmCriteria.location'] = ['Please select a valid state'];
  }

  if (!metadata.firmCriteria.geographicFocus) {
    errors['firmCriteria.geographicFocus'] = ['Please select a geographic focus'];
  } else if (!['local', 'regional', 'national', 'remote'].includes(metadata.firmCriteria.geographicFocus)) {
    errors['firmCriteria.geographicFocus'] = ['Invalid geographic focus selected'];
  }

  if (!metadata.firmCriteria.dealType) {
    errors['firmCriteria.dealType'] = ['Please select a deal type'];
  } else if (!['acquisition', 'merger', 'equity-buyout', 'franchise', 'succession'].includes(metadata.firmCriteria.dealType)) {
    errors['firmCriteria.dealType'] = ['Invalid deal type selected'];
  }

  // Payment Terms validation
  const validPaymentTerms = ['cash', 'seller-financing', 'earnout', 'equity-rollover', 'bank-financing'];
  if (!Array.isArray(metadata.paymentTerms) || metadata.paymentTerms.length === 0) {
    errors.paymentTerms = ['Please select at least one payment term'];
  } else if (metadata.paymentTerms.length > config.maxPaymentTerms) {
    errors.paymentTerms = [`Maximum ${config.maxPaymentTerms} payment terms allowed`];
  } else if (!metadata.paymentTerms.every(term => validPaymentTerms.includes(term))) {
    errors.paymentTerms = ['Invalid payment term selected'];
  }

  // Strategies validation
  const validateStrategyCategory = (
    category: keyof Strategies,
    strategies: string[],
    validOptions: string[]
  ) => {
    if (!Array.isArray(strategies) || strategies.length === 0) {
      errors[`strategies.${category}`] = [`Please select at least one ${category} strategy`];
    } else if (strategies.length > config.maxStrategiesPerCategory) {
      errors[`strategies.${category}`] = [
        `Maximum ${config.maxStrategiesPerCategory} strategies allowed`
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

  // Additional Criteria validation (optional but with length limit if provided)
  if (metadata.investment.additionalCriteria && 
      metadata.investment.additionalCriteria.length > config.maxSummaryLength) {
    errors['investment.additionalCriteria'] = [
      `Maximum length is ${config.maxSummaryLength} characters`
    ];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Helper constants
const US_STATES = [
  "ALABAMA", "ALASKA", "ARIZONA", "ARKANSAS", "CALIFORNIA", "COLORADO", "CONNECTICUT", 
  "DELAWARE", "FLORIDA", "GEORGIA", "HAWAII", "IDAHO", "ILLINOIS", "INDIANA", "IOWA", 
  "KANSAS", "KENTUCKY", "LOUISIANA", "MAINE", "MARYLAND", "MASSACHUSETTS", "MICHIGAN", 
  "MINNESOTA", "MISSISSIPPI", "MISSOURI", "MONTANA", "NEBRASKA", "NEVADA", "NEW HAMPSHIRE", 
  "NEW JERSEY", "NEW MEXICO", "NEW YORK", "NORTH CAROLINA", "NORTH DAKOTA", "OHIO", 
  "OKLAHOMA", "OREGON", "PENNSYLVANIA", "RHODE ISLAND", "SOUTH CAROLINA", "SOUTH DAKOTA", 
  "TENNESSEE", "TEXAS", "UTAH", "VERMONT", "VIRGINIA", "WASHINGTON", "WEST VIRGINIA", 
  "WISCONSIN", "WYOMING"
];

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

  if (!config.targetCapital) {
    errors.targetCapital = ['Target capital is required'];
  } else {
    if (config.targetCapital.lt(status.minTargetCapital)) {
      errors.targetCapital = [`Target capital must be at least ${ethers.utils.formatEther(status.minTargetCapital)} ETH`];
    }
    if (config.targetCapital.gt(status.maxTargetCapital)) {
      errors.targetCapital = [`Target capital must not exceed ${ethers.utils.formatEther(status.maxTargetCapital)} ETH`];
    }
  }

  if (!config.votingDuration) {
    errors.votingDuration = ['Voting duration is required'];
  } else {
    if (config.votingDuration < status.minVotingDuration) {
      errors.votingDuration = [`Voting duration must be at least ${status.minVotingDuration / (24 * 3600)} days`];
    }
    if (config.votingDuration > status.maxVotingDuration) {
      errors.votingDuration = [`Voting duration must not exceed ${status.maxVotingDuration / (24 * 3600)} days`];
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
