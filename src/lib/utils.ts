import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ethers } from "ethers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRDAmount(amount: string | number | ethers.BigNumber): string {
  if (!amount) return "0 RD";
  
  try {
    // If it's already a string and contains a decimal, assume it's already formatted
    if (typeof amount === 'string' && amount.includes('.')) {
      return `${amount} RD`;
    }
    
    // Handle BigNumber or numeric string
    const formattedAmount = ethers.utils.formatEther(
      typeof amount === 'string' || typeof amount === 'number' 
        ? ethers.utils.parseEther(amount.toString())
        : amount
    );
    
    return `${formattedAmount} RD`;
  } catch (error) {
    console.error('Error formatting RD amount:', error);
    return `${amount} RD`; // Return original amount if formatting fails
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
  
  // Validate address format
  if (!address.startsWith('0x') || address.length !== 42) {
    return address;
  }
  
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
}
