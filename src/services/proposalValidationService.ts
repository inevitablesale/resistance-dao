
import { ethers } from "ethers";
import { ContractStatus } from "./proposalContractService";
import { ProposalInput, ProposalMetadata } from "@/types/proposals";
import {
  FirmSize,
  DealType,
  GeographicFocus,
  PaymentTerm,
  OperationalStrategy,
  GrowthStrategy,
  IntegrationStrategy
} from "@/lib/proposal-enums";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export const validateProposalMetadata = (
  metadata: ProposalMetadata,
  config: ContractStatus
): ValidationResult => {
  const errors: Record<string, string[]> = {};

  // Title validation (10-100 characters)
  if (!metadata.title || metadata.title.trim().length < 10 || metadata.title.trim().length > 100) {
    errors.title = ['Title must be between 10 and 100 characters'];
  }

  // Target Capital validation
  if (!metadata.targetCapital) {
    errors['targetCapital'] = ['Target capital is required'];
  } else {
    try {
      const targetCapitalWei = ethers.utils.parseUnits(metadata.targetCapital, 18);
      if (targetCapitalWei.lt(config.minTargetCapital)) {
        errors['targetCapital'] = [`Minimum target capital is ${ethers.utils.formatUnits(config.minTargetCapital, 18)} LGR`];
      }
      if (targetCapitalWei.gt(config.maxTargetCapital)) {
        errors['targetCapital'] = [`Maximum target capital is ${ethers.utils.formatUnits(config.maxTargetCapital, 18)} LGR`];
      }
    } catch (error) {
      errors['targetCapital'] = ['Invalid target capital amount'];
    }
  }

  // Investment Drivers validation (50-500 characters)
  if (!metadata.investmentDrivers || 
      metadata.investmentDrivers.trim().length < 50 || 
      metadata.investmentDrivers.trim().length > 500) {
    errors['investmentDrivers'] = ['Investment drivers must be between 50 and 500 characters'];
  }

  // Additional Criteria validation (max 500 characters)
  if (metadata.additionalCriteria && metadata.additionalCriteria.trim().length > 500) {
    errors['additionalCriteria'] = ['Additional criteria must not exceed 500 characters'];
  }

  // Firm Size validation
  if (!Object.values(FirmSize).includes(metadata.firmSize)) {
    errors['firmSize'] = ['Invalid firm size selected'];
  }

  // Location validation
  if (!metadata.location || metadata.location.trim().length === 0) {
    errors['location'] = ['Location is required'];
  }

  // Deal Type validation
  if (!Object.values(DealType).includes(metadata.dealType)) {
    errors['dealType'] = ['Invalid deal type selected'];
  }

  // Geographic Focus validation
  if (!Object.values(GeographicFocus).includes(metadata.geographicFocus)) {
    errors['geographicFocus'] = ['Invalid geographic focus selected'];
  }

  // Payment Terms validation
  if (!Array.isArray(metadata.paymentTerms) || metadata.paymentTerms.length === 0) {
    errors['paymentTerms'] = ['At least one payment term is required'];
  } else {
    const invalidTerms = metadata.paymentTerms.filter(term => !Object.values(PaymentTerm).includes(term));
    if (invalidTerms.length > 0) {
      errors['paymentTerms'] = ['Invalid payment terms selected'];
    }
  }

  // Strategy validations
  const validateStrategies = (
    strategies: any[],
    validEnum: any,
    fieldName: string
  ) => {
    if (!Array.isArray(strategies) || strategies.length === 0) {
      errors[fieldName] = ['At least one strategy is required'];
    } else {
      const invalidStrategies = strategies.filter(
        strategy => !Object.values(validEnum).includes(strategy)
      );
      if (invalidStrategies.length > 0) {
        errors[fieldName] = ['Invalid strategies selected'];
      }
    }
  };

  validateStrategies(
    metadata.operationalStrategies,
    OperationalStrategy,
    'operationalStrategies'
  );
  validateStrategies(
    metadata.growthStrategies,
    GrowthStrategy,
    'growthStrategies'
  );
  validateStrategies(
    metadata.integrationStrategies,
    IntegrationStrategy,
    'integrationStrategies'
  );

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
