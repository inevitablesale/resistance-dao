
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
