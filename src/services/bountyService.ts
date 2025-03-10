
import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction, TransactionConfig } from "./transactionManager";
import { createParty, PartyOptions, createEthCrowdfund, CrowdfundOptions } from "./partyProtocolService";
import { toast } from "@/hooks/use-toast";
import { supabaseClient } from "./supabaseClient";

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
  successCriteria?: string;
  bountyType?: string;
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
      hunterCount: 0,
      successCriteria: options.successCriteria,
      bountyType: options.bountyType
    };

    // Try to store the bounty in Supabase if available
    try {
      if (supabaseClient) {
        const { error } = await supabaseClient
          .from('bounties')
          .insert([{
            ...bounty,
            eligible_nfts: options.eligibleNFTs,
            require_verification: options.requireVerification,
            allow_public_hunters: options.allowPublicHunters,
            max_referrals_per_hunter: options.maxReferralsPerHunter,
            reward_type: options.rewardType
          }]);
        
        if (error) {
          console.error("Error storing bounty in Supabase:", error);
          // Fall back to localStorage if Supabase fails
          storeInLocalStorage(bounty);
        }
      } else {
        // If Supabase is not available, use localStorage
        storeInLocalStorage(bounty);
      }
    } catch (error) {
      console.error("Error with Supabase storage, falling back to localStorage:", error);
      storeInLocalStorage(bounty);
    }
    
    console.log("Bounty created successfully:", bounty);
    return bounty;
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

// Helper function to store bounty in localStorage
function storeInLocalStorage(bounty: Bounty) {
  const storedBounties = localStorage.getItem("bounties") || "[]";
  const bounties = JSON.parse(storedBounties);
  bounties.push(bounty);
  localStorage.setItem("bounties", JSON.stringify(bounties));
}

/**
 * Fetch all bounties
 * @param status Optional status filter
 * @returns Array of bounties
 */
export async function getBounties(status?: string): Promise<Bounty[]> {
  try {
    // Try to fetch bounties from Supabase first
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('bounties').select('*');
        
        if (status) {
          query = query.eq('status', status);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching bounties from Supabase:", error);
        } else if (data && data.length > 0) {
          // Format data from Supabase to match Bounty interface
          return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            rewardAmount: item.reward_amount || item.rewardAmount,
            totalBudget: item.total_budget || item.totalBudget,
            usedBudget: item.used_budget || item.usedBudget,
            remainingBudget: item.remaining_budget || item.remainingBudget,
            createdAt: item.created_at || item.createdAt,
            expiresAt: item.expires_at || item.expiresAt,
            status: item.status,
            successCount: item.success_count || item.successCount,
            hunterCount: item.hunter_count || item.hunterCount,
            partyAddress: item.party_address,
            crowdfundAddress: item.crowdfund_address,
            eligibleNFTs: item.eligible_nfts,
            successCriteria: item.success_criteria || item.successCriteria,
            bountyType: item.bounty_type || item.bountyType
          }));
        }
      } catch (dbError) {
        console.error("Error with Supabase, falling back to localStorage:", dbError);
      }
    }
    
    // Fall back to localStorage if Supabase fails or is not available
    const storedBounties = localStorage.getItem("bounties") || "[]";
    const bounties = JSON.parse(storedBounties);
    
    // Filter by status if provided
    if (status) {
      return bounties.filter((bounty: Bounty) => bounty.status === status);
    }
    
    return bounties;
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
    // Try to fetch from Supabase first
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('bounties')
          .select('*')
          .eq('id', bountyId)
          .single();
        
        if (error) {
          console.error("Error fetching bounty from Supabase:", error);
        } else if (data) {
          // Format data from Supabase to match Bounty interface
          return {
            id: data.id,
            name: data.name,
            description: data.description,
            rewardAmount: data.reward_amount || data.rewardAmount,
            totalBudget: data.total_budget || data.totalBudget,
            usedBudget: data.used_budget || data.usedBudget,
            remainingBudget: data.remaining_budget || data.remainingBudget,
            createdAt: data.created_at || data.createdAt,
            expiresAt: data.expires_at || data.expiresAt,
            status: data.status,
            successCount: data.success_count || data.successCount,
            hunterCount: data.hunter_count || data.hunterCount,
            partyAddress: data.party_address,
            crowdfundAddress: data.crowdfund_address,
            eligibleNFTs: data.eligible_nfts,
            successCriteria: data.success_criteria || data.successCriteria,
            bountyType: data.bounty_type || data.bountyType
          };
        }
      } catch (dbError) {
        console.error("Error with Supabase, falling back to localStorage:", dbError);
      }
    }
    
    // Fall back to localStorage
    const bounties = await getBounties();
    return bounties.find(b => b.id === bountyId) || null;
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
    // Try to update in Supabase first
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('bounties')
          .update({ status })
          .eq('id', bountyId)
          .select()
          .single();
        
        if (error) {
          console.error("Error updating bounty in Supabase:", error);
        } else if (data) {
          // Return the updated bounty
          return await getBounty(bountyId);
        }
      } catch (dbError) {
        console.error("Error with Supabase, falling back to localStorage:", dbError);
      }
    }
    
    // Fall back to localStorage
    const bounties = await getBounties();
    const bountyIndex = bounties.findIndex((b: Bounty) => b.id === bountyId);
    
    if (bountyIndex === -1) {
      throw new Error("Bounty not found");
    }
    
    bounties[bountyIndex].status = status;
    localStorage.setItem("bounties", JSON.stringify(bounties));
    
    return bounties[bountyIndex];
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
    const bounty = await getBounty(bountyId);
    
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    // Check if there's enough budget
    if (bounty.remainingBudget < bounty.rewardAmount) {
      throw new Error("Insufficient bounty budget");
    }
    
    // First, record the referral in the database
    try {
      if (supabaseClient) {
        const { error } = await supabaseClient
          .from('referrals')
          .insert([{
            referrer_address: referrerAddress,
            referred_address: referredAddress,
            bounty_id: bountyId,
            reward_amount: bounty.rewardAmount,
            status: "verified",
            payment_processed: false
          }]);
        
        if (error) {
          console.error("Error recording referral in Supabase:", error);
        }
      }
    } catch (dbError) {
      console.error("Error recording referral in database:", dbError);
    }
    
    // Update the bounty in Supabase if available
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('bounties')
          .update({
            used_budget: bounty.usedBudget + bounty.rewardAmount,
            remaining_budget: bounty.remainingBudget - bounty.rewardAmount,
            success_count: bounty.successCount + 1
          })
          .eq('id', bountyId);
        
        if (error) {
          console.error("Error updating bounty in Supabase:", error);
        } else {
          // Return the updated bounty
          return await getBounty(bountyId);
        }
      } catch (dbError) {
        console.error("Error with Supabase, falling back to localStorage:", dbError);
      }
    }
    
    // Fall back to localStorage
    const bounties = await getBounties();
    const bountyIndex = bounties.findIndex((b: Bounty) => b.id === bountyId);
    
    bounties[bountyIndex].usedBudget += bounty.rewardAmount;
    bounties[bountyIndex].remainingBudget -= bounty.rewardAmount;
    bounties[bountyIndex].successCount += 1;
    
    // Save updated bounty
    localStorage.setItem("bounties", JSON.stringify(bounties));
    
    return bounties[bountyIndex];
  } catch (error) {
    console.error("Error recording successful referral:", error);
    return null;
  }
}

/**
 * Deploy a real bounty to the blockchain using Party Protocol
 * @param bountyId ID of the bounty to deploy
 * @param wallet Connected wallet
 * @returns Promise resolving to deployment result with party and crowdfund addresses
 */
export async function deployBountyToBlockchain(
  bountyId: string, 
  wallet: any
): Promise<{ partyAddress: string; crowdfundAddress: string } | null> {
  try {
    const bounty = await getBounty(bountyId);
    
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    console.log("Deploying bounty to blockchain:", bounty);
    
    // Get the wallet address
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    // Create Party options
    const partyOptions: PartyOptions = {
      name: `Bounty: ${bounty.name}`,
      hosts: [signerAddress], // The bounty creator is the host
      votingDuration: 7 * 24 * 60 * 60, // 7 days for voting on proposals
      executionDelay: 24 * 60 * 60, // 1 day delay before execution
      passThresholdBps: 5000, // 50% threshold to pass proposals
      allowPublicProposals: false, // Only hosts can create proposals
      description: bounty.description,
      metadataURI: "" // Will be populated after IPFS upload
    };
    
    // Create the Party
    toast({
      title: "Creating Party for Bounty",
      description: "Please approve the transaction"
    });
    
    const partyAddress = await createParty(wallet, partyOptions);
    
    // Calculate end time for crowdfund
    const now = Math.floor(Date.now() / 1000);
    const duration = bounty.expiresAt - now;
    
    // Create Crowdfund options
    const crowdfundOptions: CrowdfundOptions = {
      initialContributor: signerAddress,
      minContribution: ethers.utils.parseEther("0.01").toString(), // Minimum contribution
      maxContribution: ethers.utils.parseEther(bounty.totalBudget.toString()).toString(), // Maximum contribution
      maxTotalContributions: ethers.utils.parseEther(bounty.totalBudget.toString()).toString(), // Total budget
      duration: duration > 0 ? duration : 30 * 24 * 60 * 60 // Use remaining time or default to 30 days
    };
    
    // Create the metadata for the crowdfund
    const metadata = {
      name: bounty.name,
      description: bounty.description,
      rewardAmount: bounty.rewardAmount,
      rewardType: bounty.bountyType,
      successCriteria: bounty.successCriteria,
      eligibleNFTs: bounty.eligibleNFTs || []
    };
    
    // Create the ETH Crowdfund
    toast({
      title: "Creating Crowdfund",
      description: "Please approve the transaction to fund the bounty"
    });
    
    const crowdfundAddress = await createEthCrowdfund(wallet, partyAddress, crowdfundOptions, metadata);
    
    // Update the bounty with the blockchain addresses
    if (supabaseClient) {
      try {
        await supabaseClient
          .from('bounties')
          .update({
            party_address: partyAddress,
            crowdfund_address: crowdfundAddress,
            blockchain_deployed: true
          })
          .eq('id', bountyId);
      } catch (error) {
        console.error("Error updating bounty in Supabase:", error);
      }
    } else {
      // Update in localStorage
      const bounties = await getBounties();
      const bountyIndex = bounties.findIndex((b: Bounty) => b.id === bountyId);
      
      if (bountyIndex !== -1) {
        bounties[bountyIndex].partyAddress = partyAddress;
        bounties[bountyIndex].crowdfundAddress = crowdfundAddress;
        localStorage.setItem("bounties", JSON.stringify(bounties));
      }
    }
    
    toast({
      title: "Bounty Deployed",
      description: "Bounty has been successfully deployed to the blockchain"
    });
    
    return { partyAddress, crowdfundAddress };
  } catch (error) {
    console.error("Error deploying bounty to blockchain:", error);
    toast({
      title: "Deployment Failed",
      description: "Failed to deploy bounty to blockchain",
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

/**
 * Get all referrals for a bounty
 * @param bountyId ID of the bounty
 * @returns Array of referrals
 */
export async function getBountyReferrals(bountyId: string): Promise<any[]> {
  try {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('referrals')
        .select('*')
        .eq('bounty_id', bountyId);
      
      if (error) {
        console.error("Error fetching referrals from Supabase:", error);
        return [];
      }
      
      return data || [];
    }
    
    // Mock referrals if Supabase is not available
    return [
      {
        id: `ref-${Date.now()}-1`,
        referrer_address: "0x1234...5678",
        referred_address: "0x8765...4321",
        bounty_id: bountyId,
        reward_amount: 50,
        status: "verified",
        created_at: new Date().toISOString(),
        payment_processed: true
      },
      {
        id: `ref-${Date.now()}-2`,
        referrer_address: "0x1234...5678",
        referred_address: "0x9876...5432",
        bounty_id: bountyId,
        reward_amount: 50,
        status: "pending",
        created_at: new Date().toISOString(),
        payment_processed: false
      }
    ];
  } catch (error) {
    console.error("Error fetching bounty referrals:", error);
    return [];
  }
}

/**
 * Get user's active referrals
 * @param walletAddress User's wallet address
 * @returns Array of referrals
 */
export async function getUserReferrals(walletAddress: string): Promise<any[]> {
  try {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('referrals')
        .select('*, bounties(*)')
        .eq('referrer_address', walletAddress);
      
      if (error) {
        console.error("Error fetching user referrals from Supabase:", error);
        return [];
      }
      
      return data || [];
    }
    
    // Mock referrals if Supabase is not available
    return [
      {
        id: `ref-${Date.now()}-1`,
        referrer_address: walletAddress,
        referred_address: "0x8765...4321",
        bounty_id: "b-123456",
        reward_amount: 50,
        status: "verified",
        created_at: new Date().toISOString(),
        payment_processed: true,
        bounties: {
          name: "Sample NFT Referral Bounty"
        }
      },
      {
        id: `ref-${Date.now()}-2`,
        referrer_address: walletAddress,
        referred_address: "0x9876...5432",
        bounty_id: "b-123457",
        reward_amount: 50,
        status: "pending",
        created_at: new Date().toISOString(),
        payment_processed: false,
        bounties: {
          name: "Sample Talent Acquisition Bounty"
        }
      }
    ];
  } catch (error) {
    console.error("Error fetching user referrals:", error);
    return [];
  }
}

/**
 * Claim rewards for verified referrals
 * @param wallet Connected wallet
 * @param referralIds Array of referral IDs to claim
 * @returns Promise resolving to transaction result
 */
export async function claimReferralRewards(
  wallet: any,
  referralIds: string[]
): Promise<any> {
  try {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    
    // Get referrals to claim
    let referrals: any[] = [];
    
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('referrals')
        .select('*, bounties(*)')
        .in('id', referralIds)
        .eq('payment_processed', false);
      
      if (error) {
        console.error("Error fetching referrals to claim:", error);
        throw new Error("Failed to fetch referrals");
      }
      
      referrals = data || [];
    } else {
      // Mock referrals for demo
      referrals = referralIds.map(id => ({
        id,
        bounty_id: "b-123456",
        reward_amount: 50,
        bounties: {
          party_address: `0x${Math.random().toString(16).substring(2, 42)}`,
          crowdfund_address: `0x${Math.random().toString(16).substring(2, 42)}`
        }
      }));
    }
    
    if (referrals.length === 0) {
      throw new Error("No valid referrals to claim");
    }
    
    // Group referrals by bounty to batch claims
    const bountyGroups: Record<string, any[]> = {};
    
    referrals.forEach(referral => {
      if (!bountyGroups[referral.bounty_id]) {
        bountyGroups[referral.bounty_id] = [];
      }
      bountyGroups[referral.bounty_id].push(referral);
    });
    
    // Process each bounty group
    const results = [];
    
    for (const bountyId of Object.keys(bountyGroups)) {
      const bountyReferrals = bountyGroups[bountyId];
      const firstReferral = bountyReferrals[0];
      
      if (!firstReferral.bounties?.party_address) {
        console.error("Bounty not deployed to blockchain:", bountyId);
        continue;
      }
      
      // For now, we'll return a mock transaction result
      // In a real implementation, this would interact with the Party Protocol contracts
      const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      
      // Update referrals as claimed
      if (supabaseClient) {
        const referralIds = bountyReferrals.map(r => r.id);
        
        const { error } = await supabaseClient
          .from('referrals')
          .update({
            payment_processed: true,
            payment_date: new Date().toISOString(),
            payment_tx_hash: mockTxHash
          })
          .in('id', referralIds);
        
        if (error) {
          console.error("Error updating referrals as claimed:", error);
        }
      }
      
      results.push({
        bountyId,
        transactionHash: mockTxHash,
        referralsProcessed: bountyReferrals.length
      });
    }
    
    return {
      success: true,
      results
    };
  } catch (error) {
    console.error("Error claiming referral rewards:", error);
    throw new ProposalError({
      category: 'transaction',
      message: 'Failed to claim referral rewards',
      recoverySteps: [
        'Check your wallet connection',
        'Ensure the bounty has sufficient funds',
        'Try again later'
      ]
    });
  }
}
