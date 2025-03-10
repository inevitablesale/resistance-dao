
import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction, TransactionConfig } from "./transactionManager";
import { createParty, PartyOptions, createEthCrowdfund, CrowdfundOptions } from "./partyProtocolService";
import { toast } from "@/hooks/use-toast";

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
  eligibleNFTs?: string[]; // Added this property to fix the TypeScript error
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
    
    // Store in local storage for now (would be replaced with backend storage)
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
    
    // Store in localStorage
    const storedBounties = localStorage.getItem("bounties") || "[]";
    const bounties = JSON.parse(storedBounties);
    bounties.push(bounty);
    localStorage.setItem("bounties", JSON.stringify(bounties));
    
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

/**
 * Fetch all bounties
 * @param status Optional status filter
 * @returns Array of bounties
 */
export async function getBounties(status?: string): Promise<Bounty[]> {
  try {
    // Get bounties from localStorage
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
    const bounties = await getBounties();
    const bounty = bounties.find(b => b.id === bountyId);
    return bounty || null;
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
    
    // Update the bounty
    const bounties = await getBounties();
    const bountyIndex = bounties.findIndex((b: Bounty) => b.id === bountyId);
    
    bounties[bountyIndex].usedBudget += bounty.rewardAmount;
    bounties[bountyIndex].remainingBudget -= bounty.rewardAmount;
    bounties[bountyIndex].successCount += 1;
    
    // Save updated bounty
    localStorage.setItem("bounties", JSON.stringify(bounties));
    
    // In a real implementation, this would also:
    // 1. Transfer the reward to the referrer
    // 2. Record the referral in a database
    // 3. Emit events for analytics
    
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
 * @returns Promise resolving to deployed bounty details
 */
export async function deployBountyToBlockchain(bountyId: string, wallet: any): Promise<{
  partyAddress: string;
  crowdfundAddress: string;
  transactionHash: string;
}> {
  try {
    console.log("Deploying bounty to blockchain:", bountyId);
    
    const bounty = await getBounty(bountyId);
    
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    // Get the wallet address
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    // Set up a Party for the bounty
    const partyOptions: PartyOptions = {
      name: `Bounty: ${bounty.name}`,
      hosts: [signerAddress], // The bounty creator is the host
      votingDuration: 3 * 24 * 60 * 60, // 3 days in seconds
      executionDelay: 1 * 24 * 60 * 60, // 1 day in seconds
      passThresholdBps: 5000, // 50%
      allowPublicProposals: true,
      description: bounty.description,
      metadataURI: ""  // Will be set after IPFS upload
    };
    
    toast({
      title: "Creating Bounty Party",
      description: "Setting up a Party contract for your bounty..."
    });
    
    // Create a Party for the bounty
    const partyAddress = await createParty(wallet, partyOptions);
    
    // Set up a Crowdfund for the bounty
    const crowdfundOptions: CrowdfundOptions = {
      initialContributor: signerAddress,
      minContribution: ethers.utils.parseEther("0.01").toString(), // 0.01 ETH min
      maxContribution: ethers.utils.parseEther(bounty.totalBudget.toString()).toString(),
      maxTotalContributions: ethers.utils.parseEther(bounty.totalBudget.toString()).toString(),
      duration: 30 * 24 * 60 * 60 // 30 days in seconds
    };
    
    const bountyMetadata = {
      name: bounty.name,
      description: bounty.description,
      rewardAmount: bounty.rewardAmount,
      rewardType: "fixed", // Default to fixed rewards
      bountyType: "nft_referral", // Default type
      successCriteria: "Successful referral of a new user",
      createdBy: signerAddress,
      createdAt: Math.floor(Date.now() / 1000)
    };
    
    toast({
      title: "Creating Bounty Funding",
      description: "Setting up funding for your bounty..."
    });
    
    // Create a Crowdfund for the bounty
    const crowdfundAddress = await createEthCrowdfund(
      wallet,
      partyAddress,
      crowdfundOptions,
      bountyMetadata
    );
    
    // Update the bounty in localStorage with blockchain details
    const bounties = await getBounties();
    const bountyIndex = bounties.findIndex((b: Bounty) => b.id === bountyId);
    
    if (bountyIndex !== -1) {
      bounties[bountyIndex].partyAddress = partyAddress;
      bounties[bountyIndex].crowdfundAddress = crowdfundAddress;
      localStorage.setItem("bounties", JSON.stringify(bounties));
    }
    
    toast({
      title: "Bounty Deployed",
      description: "Your bounty has been successfully deployed to the blockchain!"
    });
    
    // Return the addresses and a mock transaction hash
    return {
      partyAddress,
      crowdfundAddress,
      transactionHash: `0x${Math.random().toString(36).substring(2, 15)}`
    };
  } catch (error) {
    console.error("Error deploying bounty to blockchain:", error);
    toast({
      title: "Deployment Failed",
      description: error instanceof Error ? error.message : "Failed to deploy bounty",
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
 * Distribute rewards to successful referrers
 * @param bountyId ID of the bounty
 * @param referrerAddress Address of the referrer to reward
 * @param amount Amount to reward
 * @param wallet Connected wallet
 * @returns Promise resolving to transaction result
 */
export async function distributeRewards(
  bountyId: string,
  referrerAddress: string,
  amount: number,
  wallet: any
): Promise<ethers.ContractTransaction | null> {
  try {
    console.log("Distributing rewards for bounty:", bountyId);
    
    const bounty = await getBounty(bountyId);
    
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    if (!bounty.partyAddress) {
      throw new Error("Bounty not deployed to blockchain");
    }
    
    // Get wallet provider and signer
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    // Create a transaction config
    const txConfig: TransactionConfig = {
      type: 'contract',
      description: `Distributing ${amount} MATIC to ${referrerAddress}`,
      timeout: 180000, // 3 minutes
      maxRetries: 3,
      backoffMs: 5000
    };
    
    // In a real implementation, we would use the Party's distribution mechanism
    // For now, we'll directly transfer MATIC to the referrer
    const amountWei = ethers.utils.parseEther(amount.toString());
    
    // Execute transaction to transfer MATIC
    const tx = await executeTransaction(
      () => signer.sendTransaction({
        to: referrerAddress,
        value: amountWei
      }),
      txConfig,
      provider
    );
    
    // Update the bounty stats
    const bounties = await getBounties();
    const bountyIndex = bounties.findIndex((b: Bounty) => b.id === bountyId);
    
    if (bountyIndex !== -1) {
      bounties[bountyIndex].usedBudget += amount;
      bounties[bountyIndex].remainingBudget -= amount;
      bounties[bountyIndex].successCount += 1;
      localStorage.setItem("bounties", JSON.stringify(bounties));
    }
    
    toast({
      title: "Reward Sent",
      description: `Successfully sent ${amount} MATIC to ${referrerAddress.substring(0, 6)}...${referrerAddress.substring(38)}`
    });
    
    return tx;
  } catch (error) {
    console.error("Error distributing rewards:", error);
    toast({
      title: "Reward Failed",
      description: error instanceof Error ? error.message : "Failed to distribute reward",
      variant: "destructive"
    });
    return null;
  }
}

/**
 * Fund an existing bounty with additional budget
 * @param bountyId ID of the bounty to fund
 * @param amount Amount to add to the budget
 * @param wallet Connected wallet
 * @returns Promise resolving to updated bounty
 */
export async function fundBounty(
  bountyId: string,
  amount: number,
  wallet: any
): Promise<Bounty | null> {
  try {
    console.log("Funding bounty:", bountyId, "with amount:", amount);
    
    const bounty = await getBounty(bountyId);
    
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    // If bounty is deployed on blockchain, use crowdfund contract
    if (bounty.partyAddress && bounty.crowdfundAddress) {
      // Get wallet provider and signer
      const walletClient = await wallet.getWalletClient();
      if (!walletClient) {
        throw new Error("Wallet client not available");
      }
      
      const provider = new ethers.providers.Web3Provider(walletClient as any);
      const signer = provider.getSigner();
      
      // Create a transaction config
      const txConfig: TransactionConfig = {
        type: 'contract',
        description: `Adding ${amount} MATIC to bounty: ${bounty.name}`,
        timeout: 180000, // 3 minutes
        maxRetries: 3,
        backoffMs: 5000
      };
      
      // Convert amount to wei
      const amountWei = ethers.utils.parseEther(amount.toString());
      
      // Execute transaction to transfer MATIC to crowdfund
      await executeTransaction(
        () => signer.sendTransaction({
          to: bounty.crowdfundAddress,
          value: amountWei
        }),
        txConfig,
        provider
      );
    }
    
    // Update the bounty stats in localStorage
    const bounties = await getBounties();
    const bountyIndex = bounties.findIndex((b: Bounty) => b.id === bountyId);
    
    if (bountyIndex !== -1) {
      bounties[bountyIndex].totalBudget += amount;
      bounties[bountyIndex].remainingBudget += amount;
      localStorage.setItem("bounties", JSON.stringify(bounties));
      
      toast({
        title: "Bounty Funded",
        description: `Successfully added ${amount} MATIC to the bounty budget`
      });
      
      return bounties[bountyIndex];
    }
    
    return null;
  } catch (error) {
    console.error("Error funding bounty:", error);
    toast({
      title: "Funding Failed",
      description: error instanceof Error ? error.message : "Failed to fund bounty",
      variant: "destructive"
    });
    return null;
  }
}
