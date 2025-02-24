
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ethers } from "ethers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRDAmount(amount: string | number): string {
  if (!amount) return "0 RD";
  const formattedAmount = typeof amount === 'string' ? amount : amount.toString();
  return `${ethers.utils.formatEther(formattedAmount)} RD`;
}
