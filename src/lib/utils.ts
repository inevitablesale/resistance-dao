import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ethers } from "ethers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRDAmount(amount: string | number | ethers.BigNumber): string {
  if (!amount) return "0 RD";
  
  try {
    if (typeof amount === 'string' && amount.includes('.')) {
      return `${amount} RD`;
    }
    
    const formattedAmount = ethers.utils.formatEther(
      typeof amount === 'string' || typeof amount === 'number' 
        ? ethers.utils.parseEther(amount.toString())
        : amount
    );
    
    return `${formattedAmount} RD`;
  } catch (error) {
    console.error('Error formatting RD amount:', error);
    return `${amount} RD`;
  }
}

/**
 * Truncates an Ethereum address to a more readable format
 * @param address The full Ethereum address
 * @param startChars Number of characters to show at the start (default: 6)
 * @param endChars Number of characters to show at the end (default: 4)
 * @returns The truncated address string
 */
export function truncateAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Shortens an Ethereum address for display purposes
 * @param address The full Ethereum address to shorten
 * @param chars Number of characters to keep at each end (default: 4)
 * @returns Shortened address in the format 0x1234...5678
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  
  if (!address.startsWith('0x') || address.length !== 42) {
    return address;
  }
  
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
}

/**
 * Generates a verification status message based on token transfer status
 * @param status The current status of token transfer
 * @returns A user-friendly status message
 */
export function getTokenTransferStatusMessage(status: TokenTransferStatus): string {
  switch(status) {
    case 'awaiting_tokens':
      return 'Waiting for token transfer...';
    case 'verifying':
      return 'Verifying token transfer...';
    case 'completed':
      return 'Token transfer verified!';
    case 'failed':
      return 'Token transfer failed. Please try again.';
    case 'not_started':
    default:
      return 'Ready to receive tokens';
  }
}

/**
 * Calculates the percentage of tokens transferred compared to expected
 * @param currentAmount Current amount of tokens transferred
 * @param targetAmount Target amount of tokens to transfer
 * @returns Percentage as a number between 0-100
 */
export function getTokenTransferProgress(currentAmount: number, targetAmount: number): number {
  if (targetAmount <= 0) return 0;
  const percentage = (currentAmount / targetAmount) * 100;
  return Math.min(Math.max(percentage, 0), 100);
}

// Token transfer status types
export type TokenTransferStatus = 'not_started' | 'awaiting_tokens' | 'verifying' | 'completed' | 'failed';

/**
 * Get security level description for holding contract
 * @param securityLevel The security level of the holding contract
 * @returns A user-friendly description of the security features
 */
export function getSecurityLevelDescription(securityLevel: "basic" | "multisig" | "timelock"): string {
  switch(securityLevel) {
    case 'basic':
      return 'Basic security with single-signature control';
    case 'multisig':
      return 'Multi-signature security requiring multiple approvals for withdrawals';
    case 'timelock':
      return 'Time-locked security with delays on withdrawals for extra protection';
    default:
      return 'Standard security features';
  }
}

/**
 * Format contract creation timestamp
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date string
 */
export function formatContractCreationTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

/**
 * Check if an address is a valid contract
 * @param provider Ethereum provider
 * @param address Contract address to check
 * @returns Promise resolving to boolean indicating if the address is a contract
 */
export async function isContract(provider: ethers.providers.Provider, address: string): Promise<boolean> {
  try {
    const code = await provider.getCode(address);
    return code !== '0x';
  } catch (error) {
    console.error("Error checking if address is a contract:", error);
    return false;
  }
}
