
import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction, TransactionConfig } from "./transactionManager";
import { createParty, PartyOptions, createEthCrowdfund, CrowdfundOptions } from "./partyProtocolService";
import { toast } from "@/hooks/use-toast";
import { supabase } from "./supabaseClient";

// Bounty Protocol addresses
const BOUNTY_FACTORY_ADDRESS = "0x4a5EA76571F47E7d92B5040E8C7FF12eacd35087"; // Polygon mainnet

// Interface for general bounty options
export interface BountyOptions {
  name: string;
  description: string;
  rewardType: "fixed" | "percentage" | "tiered";
  rewardAmount: number;
  totalBudget: number;
  duration: number;
  maxReferralsPerHunter: number;
  allowPublicHunters: boolean;
  requireVerification: boolean;
  eligibleNFTs: string[];
  successCriteria: string;
  bountyType: "nft_referral" | "talent_acquisition" | "business_development" | "custom";
}

// Interface for Bounty object
export interface Bounty {
  id: string;
  name: string;
  description: string;
  rewardAmount: number;
  totalBudget: number;
  usedBudget: number;
  remainingBudget: number;
  createdAt: number;
  expiresAt: number;
  status: "active" | "paused" | "expired" | "completed";
  successCount: number;
  hunterCount: number;
  partyAddress?: string;
  crowdfundAddress?: string;
  eligibleNFTs?: string[];
}

/**
 * Creates a new bounty using Party Protocol
 * @param options Bounty creation options
 * @returns Promise resolving to the bounty object
 */
export async function createBounty(options: BountyOptions): Promise<Bounty | null> {
  try {
    console.log("Creating bounty with options:", options);
    
    // For now, we'll create a mock bounty
    // In the real implementation, this would create a Party for the bounty
    
    const bountyId = `b-${Date.now().toString(36)}`;
    const now = Math.floor(Date.now() / 1000);
    
    // Create the bounty object
    const bounty: Bounty = {
      id: bountyId,
      name: options.name,
      description: options.description,
      rewardAmount: options.rewardAmount,
      totalBudget: options.totalBudget,
      usedBudget: 0,
      remainingBudget: options.totalBudget,
      createdAt: now,
      expiresAt: now + (options.duration * 24 * 60 * 60),
      status: "active",
      successCount: 0,
      hunterCount: 0
    };
    
    // Store in Supabase
    const { data, error } = await supabase
      .from('bounties')
      .insert([bounty])
      .select()
      .single();
    
    if (error) {
      console.error("Error storing bounty in Supabase:", error);
      throw new Error(error.message);
    }
    
    console.log("Bounty created successfully:", data);
    return data as Bounty;
  } catch (error) {
    console.error("Error creating bounty:", error);
    throw new ProposalError({
      category: 'contract',
      message: 'Failed to create bounty',
      recoverySteps: [
        'Check your wallet connection',
        'Ensure you have enough MATIC for gas fees',
        'Try again with different parameters'
      ]
    });
  }
}

/**
 * Fetch all bounties
 * @param status Optional status filter
 * @returns Array of bounties
 */
export async function getBounties(status?: string): Promise<Bounty[]> {
  try {
    let query = supabase.from('bounties').select('*');
    
    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching bounties:", error);
      return [];
    }
    
    return data as Bounty[];
  } catch (error) {
    console.error("Error fetching bounties:", error);
    return [];
  }
}

/**
 * Get a single bounty by ID
 * @param bountyId ID of the bounty to fetch
 * @returns Bounty object or null if not found
 */
export async function getBounty(bountyId: string): Promise<Bounty | null> {
  try {
    const { data, error } = await supabase
      .from('bounties')
      .select('*')
      .eq('id', bountyId)
      .single();
    
    if (error) {
      console.error("Error fetching bounty:", error);
      return null;
    }
    
    return data as Bounty;
  } catch (error) {
    console.error("Error fetching bounty:", error);
    return null;
  }
}

/**
 * Update bounty status
 * @param bountyId ID of the bounty to update
 * @param status New status
 * @returns Updated bounty or null if failed
 */
export async function updateBountyStatus(bountyId: string, status: "active" | "paused" | "expired" | "completed"): Promise<Bounty | null> {
  try {
    const { data, error } = await supabase
      .from('bounties')
      .update({ status })
      .eq('id', bountyId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating bounty status:", error);
      return null;
    }
    
    return data as Bounty;
  } catch (error) {
    console.error("Error updating bounty status:", error);
    return null;
  }
}

/**
 * Record a successful referral
 * @param bountyId ID of the bounty
 * @param referrerAddress Address of the referrer
 * @param referredAddress Address of the referred user
 * @returns Updated bounty or null if failed
 */
export async function recordSuccessfulReferral(
  bountyId: string,
  referrerAddress: string,
  referredAddress: string
): Promise<Bounty | null> {
  try {
    // Get the current bounty
    const bounty = await getBounty(bountyId);
    
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    // Check if there's enough budget
    if (bounty.remainingBudget < bounty.rewardAmount) {
      throw new Error("Insufficient bounty budget");
    }
    
    // Update the bounty
    const updatedValues = {
      usedBudget: bounty.usedBudget + bounty.rewardAmount,
      remainingBudget: bounty.remainingBudget - bounty.rewardAmount,
      successCount: bounty.successCount + 1
    };
    
    const { data, error } = await supabase
      .from('bounties')
      .update(updatedValues)
      .eq('id', bountyId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating bounty for referral:", error);
      return null;
    }
    
    // Record the referral in the referrals table
    const { error: referralError } = await supabase
      .from('referrals')
      .insert([
        {
          bounty_id: bountyId,
          referrer_address: referrerAddress,
          referred_address: referredAddress,
          reward_amount: bounty.rewardAmount,
          status: 'completed',
          completed_at: new Date().toISOString()
        }
      ]);
    
    if (referralError) {
      console.error("Error recording referral:", referralError);
    }
    
    return data as Bounty;
  } catch (error) {
    console.error("Error recording successful referral:", error);
    return null;
  }
}

/**
 * Deploy a bounty to the blockchain using Party Protocol
 * @param bountyId ID of the bounty to deploy
 * @param wallet Connected wallet
 * @returns Promise resolving to transaction result with Party addresses
 */
export async function deployBountyToBlockchain(
  bountyId: string, 
  wallet: any
): Promise<{ 
  transactionHash: string; 
  partyAddress: string;
  crowdfundAddress: string;
}> {
  try {
    // Fetch the bounty
    const bounty = await getBounty(bountyId);
    
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    console.log("Deploying bounty to blockchain:", bounty);
    
    // Get wallet data
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    // 1. Create a Party for the bounty
    const partyOptions: PartyOptions = {
      name: `Bounty: ${bounty.name}`,
      hosts: [signerAddress],
      votingDuration: 7 * 24 * 60 * 60, // 7 days in seconds
      executionDelay: 24 * 60 * 60, // 1 day in seconds
      passThresholdBps: 5000, // 50%
      allowPublicProposals: false,
      description: bounty.description,
      metadataURI: ""
    };
    
    toast({
      title: "Creating Party for Bounty...",
      description: "Please approve the transaction",
    });
    
    const partyAddress = await createParty(wallet, partyOptions);
    
    // 2. Create a Crowdfund for the bounty
    const crowdfundOptions: CrowdfundOptions = {
      initialContributor: signerAddress,
      minContribution: ethers.utils.parseEther("0.01").toString(), // 0.01 MATIC
      maxContribution: ethers.utils.parseEther(bounty.totalBudget.toString()).toString(),
      maxTotalContributions: ethers.utils.parseEther(bounty.totalBudget.toString()).toString(),
      duration: bounty.expiresAt - Math.floor(Date.now() / 1000)
    };
    
    toast({
      title: "Setting Up Bounty Fund...",
      description: "Please approve the transaction",
    });
    
    const metadata = {
      name: bounty.name,
      description: bounty.description,
      rewardAmount: bounty.rewardAmount,
      rewardType: "fixed",
      bountyType: "nft_referral"
    };
    
    const crowdfundAddress = await createEthCrowdfund(
      wallet, 
      partyAddress, 
      crowdfundOptions,
      metadata
    );
    
    // 3. Update the bounty with the contract addresses
    const { data, error } = await supabase
      .from('bounties')
      .update({
        partyAddress,
        crowdfundAddress
      })
      .eq('id', bountyId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating bounty with contract addresses:", error);
    }
    
    toast({
      title: "Bounty Deployed Successfully",
      description: "Your bounty is now live on the blockchain",
    });
    
    return {
      transactionHash: `0x${Math.random().toString(36).substring(2, 15)}`, // mock tx hash, would be real in production
      partyAddress,
      crowdfundAddress
    };
  } catch (error) {
    console.error("Error deploying bounty to blockchain:", error);
    toast({
      title: "Deployment Failed",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    throw new ProposalError({
      category: 'contract',
      message: 'Failed to deploy bounty to blockchain',
      recoverySteps: [
        'Check your wallet connection',
        'Ensure you have enough MATIC for gas fees',
        'Try again later'
      ]
    });
  }
}
