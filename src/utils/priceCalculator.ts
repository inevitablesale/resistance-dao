
/**
 * Price Calculator Utility for Party Protocol integration
 * Handles calculations for NFT sales with Party DAO fees and referral rewards
 */

export interface PriceBreakdown {
  grossPrice: number;      // Total price buyer pays (in ETH)
  partyDaoFee: number;     // Fee taken by Party DAO (in ETH)
  netAmount: number;       // Amount after DAO fee (in ETH)
  referralAmount: number;  // Referral payment (in ETH)
  finalRevenue: number;    // Final revenue after all fees (in ETH)
}

/**
 * Constants for fee calculations
 */
export const PARTY_DAO_FEE_PERCENT = 0.025; // 2.5%
export const DEFAULT_REFERRAL_AMOUNT = 0.01; // 0.01 ETH (approximately $25)

/**
 * Calculates price breakdown for NFT sales including Party DAO fees and referral rewards
 * 
 * @param desiredRevenue The amount you want to receive after all fees
 * @param referralAmount Fixed referral amount (default: 0.01 ETH)
 * @param partyDaoFeePercent Party DAO fee percentage (default: 0.025 or 2.5%)
 * @returns Complete price breakdown
 */
export function calculatePriceStructure(
  desiredRevenue: number,
  referralAmount: number = DEFAULT_REFERRAL_AMOUNT,
  partyDaoFeePercent: number = PARTY_DAO_FEE_PERCENT
): PriceBreakdown {
  // Calculate gross price needed to achieve desired revenue after fees
  // Formula: (desiredRevenue + referralAmount) / (1 - partyDaoFeePercent)
  const grossPrice = (desiredRevenue + referralAmount) / (1 - partyDaoFeePercent);
  
  // Calculate Party DAO fee
  const partyDaoFee = grossPrice * partyDaoFeePercent;
  
  // Net amount after Party DAO fee
  const netAmount = grossPrice - partyDaoFee;
  
  // Final revenue after referral payment
  const finalRevenue = netAmount - referralAmount;
  
  return {
    grossPrice,
    partyDaoFee,
    netAmount,
    referralAmount,
    finalRevenue
  };
}

/**
 * Format ETH amount with appropriate precision
 * 
 * @param amount Amount in ETH
 * @param decimals Number of decimal places (default: 4)
 * @returns Formatted ETH amount as string
 */
export function formatEthAmount(amount: number, decimals: number = 4): string {
  return amount.toFixed(decimals);
}

/**
 * Calculate contribution breakdown for Party Protocol
 * Shows how a contribution is divided between party shares and protocol fees
 * 
 * @param contributionAmount Raw amount being contributed in ETH
 * @returns Detailed breakdown of contribution
 */
export function calculateContributionBreakdown(contributionAmount: number): {
  contributionAmount: number;
  partyDaoFee: number;
  partySharesAmount: number;
  estimatedVotingPower: number;
} {
  const partyDaoFee = contributionAmount * PARTY_DAO_FEE_PERCENT;
  const partySharesAmount = contributionAmount - partyDaoFee;
  
  // Simple estimation of voting power (1 ETH = 100 voting power)
  // This is a simplified model, actual voting power calculation depends on Party implementation
  const estimatedVotingPower = partySharesAmount * 100;
  
  return {
    contributionAmount,
    partyDaoFee,
    partySharesAmount,
    estimatedVotingPower
  };
}

/**
 * Calculate governance voting threshold based on total contributions
 * 
 * @param totalContributions Total ETH contributed to party
 * @param thresholdPercent Percentage of total needed for proposal to pass (default: 51%)
 * @returns Voting threshold in ETH
 */
export function calculateGovernanceThreshold(
  totalContributions: number,
  thresholdPercent: number = 51
): number {
  return totalContributions * (thresholdPercent / 100);
}

/**
 * Example usage:
 * 
 * const price = calculatePriceStructure(0.08);
 * console.log(`Gross Price: ${formatEthAmount(price.grossPrice)} ETH`);
 * console.log(`Party DAO Fee: ${formatEthAmount(price.partyDaoFee)} ETH`);
 * console.log(`Net Amount: ${formatEthAmount(price.netAmount)} ETH`);
 * console.log(`Referral Amount: ${formatEthAmount(price.referralAmount)} ETH`);
 * console.log(`Final Revenue: ${formatEthAmount(price.finalRevenue)} ETH`);
 */
