import { ethers } from "ethers";

export interface JobMetadata {
  title: string;
  description: string;
  category: string;
  reward: string;
  deadline?: number;
  maxApplicants?: number;
  referralReward?: string;
  settlementId?: string;
  coverImage?: string; // Add coverImage property to support IPFS metadata
}

export interface ReferralMetadata {
  name: string;
  description: string;
  rewardPercentage: number;
  extraData?: any;
}

export const formatEther = (amount: ethers.BigNumberish | undefined): string => {
  if (!amount) return "0";
  return ethers.utils.formatEther(amount);
};

export const parseEther = (amount: string): ethers.BigNumber => {
  return ethers.utils.parseEther(amount);
};
