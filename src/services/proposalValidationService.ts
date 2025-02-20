
import { ProposalMetadata } from "@/types/proposals";

export const validateProposalMetadata = (metadata: ProposalMetadata): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};

  // Title validation
  if (!metadata.title?.trim()) {
    errors.title = ['Title is required'];
  } else if (metadata.title.trim().length < 10) {
    errors.title = ['Title must be at least 10 characters'];
  } else if (metadata.title.trim().length > 100) {
    errors.title = ['Title must not exceed 100 characters'];
  }

  // Investment drivers validation
  if (!metadata.investment?.drivers?.trim()) {
    errors['investment.drivers'] = ['Investment drivers are required'];
  } else if (metadata.investment.drivers.trim().length < 50) {
    errors['investment.drivers'] = ['Investment drivers must be at least 50 characters'];
  } else if (metadata.investment.drivers.trim().length > 500) {
    errors['investment.drivers'] = ['Investment drivers must not exceed 500 characters'];
  }

  // Payment terms validation
  if (!metadata.paymentTerms?.length) {
    errors.paymentTerms = ['Select at least one payment term'];
  } else if (metadata.paymentTerms.length > 5) {
    errors.paymentTerms = ['Maximum 5 payment terms allowed'];
  }

  // Strategies validation
  if (!metadata.strategies?.operational?.length) {
    errors['strategies.operational'] = ['Select at least one operational strategy'];
  }
  if (!metadata.strategies?.growth?.length) {
    errors['strategies.growth'] = ['Select at least one growth strategy'];
  }
  if (!metadata.strategies?.integration?.length) {
    errors['strategies.integration'] = ['Select at least one integration strategy'];
  }

  // LinkedIn URL validation
  if (!metadata.linkedInURL) {
    errors.linkedInURL = ['LinkedIn URL is required'];
  } else if (!metadata.linkedInURL.startsWith('https://www.linkedin.com/')) {
    errors.linkedInURL = ['Invalid LinkedIn URL format'];
  }

  return errors;
};

export const validateIPFSHash = (hash: string): boolean => {
  return /^[a-zA-Z0-9]{46}$/.test(hash);
};
