
import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction } from "./transactionManager";
import { toast } from "@/hooks/use-toast";

// Mock data for development
const BOUNTIES_DATA = [
  {
    id: "b1",
    name: "Referral Program Alpha",
    description: "Bring in new members to earn tokens. Each successful referral will be rewarded.",
    rewardAmount: 5,
    totalBudget: 500,
    usedBudget: 125,
    successCount: 25,
    expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days from now
    status: "active",
    partyAddress: "0x1234567890123456789012345678901234567890"
  },
  {
    id: "b2",
    name: "NFT Launch Promotion",
    description: "Help promote our new NFT collection. Rewards for each successful sale through your link.",
    rewardAmount: 10,
    totalBudget: 1000,
    usedBudget: 200,
    successCount: 20,
    expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15, // 15 days from now
    status: "active",
    partyAddress: null
  },
  {
    id: "b3",
    name: "Community Expansion",
    description: "Grow our Discord community with active members. Rewards for each member that stays active for 7 days.",
    rewardAmount: 2,
    totalBudget: 200,
    usedBudget: 46,
    successCount: 23,
    expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 60, // 60 days from now
    status: "active",
    partyAddress: null
  }
];

export interface Bounty {
  id: string;
  name: string;
  description: string;
  rewardAmount: number;
  totalBudget: number;
  usedBudget: number;
  successCount: number;
  expiresAt: number;
  status: "active" | "paused" | "expired" | "completed";
  partyAddress: string | null;
}

export interface BountyCreationParams {
  name: string;
  description: string;
  rewardType: "fixed" | "percentage";
  rewardAmount: number;
  totalBudget: number;
  duration: number; // days
  maxReferralsPerHunter: number;
  allowPublicHunters: boolean;
  requireVerification: boolean;
  eligibleNFTs: string[];
  successCriteria: string;
  bountyType: "nft_referral" | "token_referral" | "social_media";
}

export const getBounties = async (): Promise<Bounty[]> => {
  // In a real app, this would fetch from an API or blockchain
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...BOUNTIES_DATA]);
    }, 800);
  });
};

export const createBounty = async (
  params: BountyCreationParams,
  wallet: any
): Promise<Bounty> => {
  console.log("Creating bounty with params:", params);
  console.log("Using wallet:", wallet?.address);
  
  if (!wallet) {
    throw new Error("Wallet not connected");
  }
  
  try {
    // In a real implementation, this would interact with the blockchain
    // For now, just create a mock bounty
    const newBounty: Bounty = {
      id: `b${Math.floor(Math.random() * 10000)}`,
      name: params.name,
      description: params.description,
      rewardAmount: params.rewardAmount,
      totalBudget: params.totalBudget,
      usedBudget: 0,
      successCount: 0,
      expiresAt: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * params.duration),
      status: "active",
      partyAddress: null
    };
    
    // Add to our mock data
    BOUNTIES_DATA.push(newBounty);
    
    // Simulate a delay for API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return newBounty;
  } catch (error) {
    console.error("Error creating bounty:", error);
    throw error;
  }
};

export const deployBountyToBlockchain = async (
  bountyId: string,
  wallet: any
): Promise<{ partyAddress: string }> => {
  console.log(`Deploying bounty ${bountyId} to blockchain`);
  
  if (!wallet) {
    throw new ProposalError({
      category: 'initialization',
      message: 'Wallet not connected',
      recoverySteps: ['Please connect your wallet']
    });
  }
  
  try {
    console.log("Using wallet for deployment:", wallet?.address);
    
    // Get the bounty to deploy
    const bounties = await getBounties();
    const bountyToDeploy = bounties.find(b => b.id === bountyId);
    
    if (!bountyToDeploy) {
      throw new Error("Bounty not found");
    }
    
    if (bountyToDeploy.partyAddress) {
      throw new Error("Bounty already deployed");
    }
    
    // Initialize wallet client and provider
    try {
      // Get wallet client directly from wallet object
      console.log("Getting wallet client for deployment");
      const walletClient = await wallet.getWalletClient();
      
      if (!walletClient) {
        throw new Error("Failed to get wallet client");
      }
      
      // Create ethers provider from wallet client
      const provider = new ethers.providers.Web3Provider(walletClient);
      const signer = provider.getSigner();
      
      // Verify we can get signer address
      const signerAddress = await signer.getAddress();
      console.log("Deploying with signer address:", signerAddress);
      
      // Simulate blockchain deployment
      // In a real implementation, this would call a smart contract deployment function
      // For now, just wait and update the mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock address
      const mockPartyAddress = `0x${Math.random().toString(16).substring(2, 42).padStart(40, '0')}`;
      
      // Update the bounty with the new party address
      const bountyIndex = BOUNTIES_DATA.findIndex(b => b.id === bountyId);
      if (bountyIndex !== -1) {
        BOUNTIES_DATA[bountyIndex].partyAddress = mockPartyAddress;
      }
      
      return { partyAddress: mockPartyAddress };
    } catch (error) {
      console.error("Error initializing wallet for deployment:", error);
      throw new ProposalError({
        category: 'initialization',
        message: 'Failed to initialize wallet',
        recoverySteps: [
          'Make sure your wallet is unlocked',
          'Try refreshing the page',
          'Try reconnecting your wallet'
        ]
      });
    }
  } catch (error) {
    console.error("Error deploying bounty:", error);
    
    if (error instanceof ProposalError) {
      throw error;
    }
    
    throw new ProposalError({
      category: 'transaction',
      message: error instanceof Error ? error.message : 'Failed to deploy bounty',
      recoverySteps: [
        'Check your wallet connection',
        'Make sure you have enough funds for gas',
        'Try again later'
      ]
    });
  }
};
