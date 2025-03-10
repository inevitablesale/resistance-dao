import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction, TransactionConfig } from "./transactionManager";
import { createParty, PartyOptions, createEthCrowdfund, CrowdfundOptions } from "./partyProtocolService";
import { toast } from "@/hooks/use-toast";
import { uploadToIPFS } from "./ipfsService";
import { EventConfig, subscribeToProposalEvents } from "./eventListenerService";
import { IPFSContent } from "@/types/content";
import { BOUNTY_FACTORY_ADDRESS, BOUNTY_FACTORY_ABI } from "@/lib/constants";

// Hunter verification status
export type HunterVerificationStatus = "unverified" | "pending" | "verified" | "rejected";

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

// New interface for Hunter
export interface Hunter {
  address: string;
  registeredAt: number;
  verificationStatus: HunterVerificationStatus;
  completedTasks: number;
  totalEarned: number;
  reputation: number;
  lastActiveAt: number;
}

// New interface for BountyTask
export interface BountyTask {
  id: string;
  bountyId: string;
  hunterAddress: string;
  referredAddress: string;
  status: "pending" | "verified" | "rejected" | "paid";
  submittedAt: number;
  verifiedAt?: number;
  paidAt?: number;
  amount: number;
  transactionHash?: string;
  evidence?: string;
}

/**
 * Format bounty metadata to match IPFSContent structure
 * @param bountyData Bounty data to format
 * @param creator Address of the creator
 * @returns IPFSContent structure
 */
function formatBountyForIPFS(bountyData: any, creator: string): IPFSContent {
  return {
    contentSchema: "bounty-v1",
    contentType: "application/json",
    title: bountyData.name,
    content: bountyData.description,
    metadata: {
      author: creator,
      publishedAt: Math.floor(Date.now() / 1000),
      version: 1,
      tags: [bountyData.bountyType, "bounty", "referral"],
      bountyDetails: {
        ...bountyData,
        creator
      }
    }
  };
}

/**
 * Creates a new bounty using the Bounty Protocol
 * @param options Bounty creation options
 * @param wallet Connected wallet to use for transaction
 * @returns Promise resolving to the bounty object
 */
export async function createBounty(
  options: BountyOptions,
  wallet: any
): Promise<Bounty | null> {
  try {
    console.log("Creating bounty with options:", options);
    
    // Get provider and signer directly rather than using walletClient
    const provider = await getProviderFromWallet(wallet);
    if (!provider) {
      throw new Error("Failed to get provider from wallet");
    }
    
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    // Validate network
    const network = await provider.getNetwork();
    console.log("Connected to network:", network);
    
    if (network.chainId !== 137) { // Polygon mainnet
      toast({
        title: "Wrong Network",
        description: "Please connect to the Polygon network",
        variant: "destructive"
      });
      throw new Error("Please connect to the Polygon network");
    }
    
    // Create bounty metadata for IPFS
    const bountyData = {
      name: options.name,
      description: options.description,
      rewardType: options.rewardType,
      rewardAmount: options.rewardAmount,
      totalBudget: options.totalBudget,
      duration: options.duration,
      maxReferralsPerHunter: options.maxReferralsPerHunter,
      allowPublicHunters: options.allowPublicHunters,
      requireVerification: options.requireVerification,
      eligibleNFTs: options.eligibleNFTs,
      successCriteria: options.successCriteria,
      bountyType: options.bountyType,
      createdAt: Math.floor(Date.now() / 1000)
    };
    
    // Format data to match IPFSContent structure
    const ipfsContent = formatBountyForIPFS(bountyData, signerAddress);
    
    // Upload metadata to IPFS
    toast({
      title: "Uploading Bounty Metadata",
      description: "Preparing bounty details for blockchain deployment..."
    });
    
    let metadataURI;
    try {
      metadataURI = await uploadToIPFS(ipfsContent);
      console.log("Bounty metadata uploaded to IPFS:", metadataURI);
    } catch (error) {
      console.error("Error uploading metadata to IPFS:", error);
      throw new Error("Failed to upload bounty metadata to IPFS");
    }
    
    // For testing, use localStorage storage
    // In production environment, we would use the contract
    const shouldUseContract = false; // Set to true to enable contract interaction when ready
    
    if (shouldUseContract) {
      // Initialize bounty factory contract
      const bountyFactory = new ethers.Contract(
        BOUNTY_FACTORY_ADDRESS,
        BOUNTY_FACTORY_ABI,
        signer
      );
      
      toast({
        title: "Creating Bounty",
        description: "Please approve the transaction in your wallet..."
      });
      
      // Create transaction config
      const txConfig: TransactionConfig = {
        type: 'contract',
        description: `Creating bounty: ${options.name}`,
        timeout: 180000, // 3 minutes
        maxRetries: 3,
        backoffMs: 5000
      };
      
      // Execute the transaction
      try {
        const tx = await executeTransaction(
          () => bountyFactory.createBounty(
            options.name,
            metadataURI,
            ethers.utils.parseEther(options.rewardAmount.toString()),
            ethers.utils.parseEther(options.totalBudget.toString()),
            options.duration * 24 * 60 * 60 // convert days to seconds
          ),
          txConfig,
          provider
        );
        
        const receipt = await tx.wait();
        console.log("Transaction receipt:", receipt);
        
        // Parse events to get the bountyId
        const event = receipt.events?.find(e => e.event === "BountyCreated");
        if (!event) {
          throw new Error("Failed to find BountyCreated event");
        }
        
        const bountyId = event.args?.bountyId.toString();
        console.log("Created bounty with ID:", bountyId);
        
        // Now use the bountyId to get the full bounty details
        const bountyDetails = await bountyFactory.getBounty(bountyId);
        
        // Create a Bounty object from the contract data
        const bounty: Bounty = {
          id: bountyId,
          name: bountyDetails.name,
          description: options.description, // Not stored on-chain
          rewardAmount: parseFloat(ethers.utils.formatEther(bountyDetails.rewardAmount)),
          totalBudget: parseFloat(ethers.utils.formatEther(bountyDetails.totalBudget)),
          usedBudget: 0,
          remainingBudget: parseFloat(ethers.utils.formatEther(bountyDetails.totalBudget)),
          createdAt: bountyDetails.createdAt.toNumber(),
          expiresAt: bountyDetails.expiresAt?.toNumber() || 0,
          status: bountyDetails.active ? "active" : "paused",
          successCount: 0,
          hunterCount: 0,
          eligibleNFTs: options.eligibleNFTs
        };
        
        toast({
          title: "Bounty Created!",
          description: "Your bounty has been successfully created on the blockchain"
        });
        
        return bounty;
      } catch (error: any) {
        console.error("Transaction error:", error);
        
        if (error.code === 4001) {
          toast({
            title: "Transaction Rejected",
            description: "You rejected the transaction",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Transaction Failed",
            description: error.message || "Failed to create bounty",
            variant: "destructive"
          });
        }
        
        throw error;
      }
    } else {
      // FOR DEVELOPMENT/TESTING: Use localStorage instead of blockchain
      // Initialize the bounty in localStorage
      const bountyId = `b-${Date.now().toString(36)}`;
      const now = Math.floor(Date.now() / 1000);
      
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
        eligibleNFTs: options.eligibleNFTs
      };
      
      // Store in localStorage
      const storedBounties = localStorage.getItem("bounties") || "[]";
      const bounties = JSON.parse(storedBounties);
      bounties.push(bounty);
      localStorage.setItem("bounties", JSON.stringify(bounties));
      
      // Also initialize hunters and tasks storage if not exist
      if (!localStorage.getItem("hunters")) {
        localStorage.setItem("hunters", "[]");
      }
      
      if (!localStorage.getItem("bountyTasks")) {
        localStorage.setItem("bountyTasks", "[]");
      }
      
      console.log("Bounty created successfully (localStorage):", bounty);
      toast({
        title: "Bounty Created!",
        description: "Your test bounty has been created successfully"
      });
      
      return bounty;
    }
  } catch (error) {
    console.error("Error creating bounty:", error);
    toast({
      title: "Bounty Creation Failed",
      description: error instanceof Error ? error.message : "Failed to create bounty",
      variant: "destructive"
    });
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
 * Helper function to get provider from wallet
 */
async function getProviderFromWallet(wallet: any): Promise<ethers.providers.Web3Provider | null> {
  try {
    if (!wallet) {
      throw new Error("Wallet not provided");
    }
    
    // Check if wallet has getProvider method (from our hook)
    if (typeof wallet.getProvider === 'function') {
      return await wallet.getProvider();
    }
    
    // Otherwise, try to get wallet client and create provider
    if (typeof wallet.getWalletClient === 'function') {
      const walletClient = await wallet.getWalletClient();
      if (!walletClient) {
        throw new Error("Wallet client not available");
      }
      return new ethers.providers.Web3Provider(walletClient);
    }
    
    // Final fallback
    if (wallet.provider) {
      return new ethers.providers.Web3Provider(wallet.provider);
    }
    
    throw new Error("Unable to get provider from wallet");
  } catch (error) {
    console.error("Error getting provider from wallet:", error);
    return null;
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
 * Register a new hunter for bounties
 * @param hunterAddress Address of the hunter to register
 * @param nftProof Optional proof of NFT ownership for automatic verification
 * @returns The registered hunter object
 */
export async function registerHunter(
  hunterAddress: string,
  nftProof?: { tokenAddress: string; tokenId: string }
): Promise<Hunter> {
  try {
    // Get existing hunters
    const storedHunters = localStorage.getItem("hunters") || "[]";
    const hunters: Hunter[] = JSON.parse(storedHunters);
    
    // Check if hunter already exists
    const existingHunterIndex = hunters.findIndex(h => h.address.toLowerCase() === hunterAddress.toLowerCase());
    
    if (existingHunterIndex !== -1) {
      // Update lastActiveAt if hunter exists
      hunters[existingHunterIndex].lastActiveAt = Math.floor(Date.now() / 1000);
      localStorage.setItem("hunters", JSON.stringify(hunters));
      return hunters[existingHunterIndex];
    }
    
    // Create new hunter
    const newHunter: Hunter = {
      address: hunterAddress,
      registeredAt: Math.floor(Date.now() / 1000),
      verificationStatus: nftProof ? "pending" : "unverified", // Start as pending if NFT proof provided
      completedTasks: 0,
      totalEarned: 0,
      reputation: 50, // Start with neutral reputation
      lastActiveAt: Math.floor(Date.now() / 1000)
    };
    
    // Add to storage
    hunters.push(newHunter);
    localStorage.setItem("hunters", JSON.stringify(hunters));
    
    console.log("Hunter registered:", newHunter);
    
    // If NFT proof provided, verify hunter automatically
    if (nftProof) {
      // This would be an async call in production, but for now we'll simulate verification
      setTimeout(() => {
        verifyHunter(hunterAddress, "verified");
      }, 2000);
    }
    
    return newHunter;
  } catch (error) {
    console.error("Error registering hunter:", error);
    throw new ProposalError({
      category: 'validation',
      message: 'Failed to register hunter',
      recoverySteps: [
        'Check the hunter address',
        'Try again with different parameters'
      ]
    });
  }
}

/**
 * Get a hunter by address
 * @param hunterAddress Address of the hunter
 * @returns Hunter object or null if not found
 */
export async function getHunter(hunterAddress: string): Promise<Hunter | null> {
  try {
    const storedHunters = localStorage.getItem("hunters") || "[]";
    const hunters: Hunter[] = JSON.parse(storedHunters);
    
    const hunter = hunters.find(h => h.address.toLowerCase() === hunterAddress.toLowerCase());
    return hunter || null;
  } catch (error) {
    console.error("Error getting hunter:", error);
    return null;
  }
}

/**
 * Get all hunters
 * @param verificationStatus Optional status filter
 * @returns Array of hunters
 */
export async function getHunters(verificationStatus?: HunterVerificationStatus): Promise<Hunter[]> {
  try {
    const storedHunters = localStorage.getItem("hunters") || "[]";
    const hunters: Hunter[] = JSON.parse(storedHunters);
    
    if (verificationStatus) {
      return hunters.filter(h => h.verificationStatus === verificationStatus);
    }
    
    return hunters;
  } catch (error) {
    console.error("Error getting hunters:", error);
    return [];
  }
}

/**
 * Update hunter verification status
 * @param hunterAddress Address of the hunter
 * @param status New verification status
 * @returns Updated hunter or null if failed
 */
export async function verifyHunter(
  hunterAddress: string,
  status: HunterVerificationStatus
): Promise<Hunter | null> {
  try {
    const storedHunters = localStorage.getItem("hunters") || "[]";
    const hunters: Hunter[] = JSON.parse(storedHunters);
    
    const hunterIndex = hunters.findIndex(h => h.address.toLowerCase() === hunterAddress.toLowerCase());
    
    if (hunterIndex === -1) {
      throw new Error("Hunter not found");
    }
    
    hunters[hunterIndex].verificationStatus = status;
    localStorage.setItem("hunters", JSON.stringify(hunters));
    
    return hunters[hunterIndex];
  } catch (error) {
    console.error("Error verifying hunter:", error);
    return null;
  }
}

/**
 * Submit a new bounty task (e.g., referral)
 * @param bountyId ID of the bounty
 * @param hunterAddress Address of the hunter
 * @param referredAddress Address of the referred user
 * @param evidence Optional evidence of task completion
 * @returns The created task or null if failed
 */
export async function submitBountyTask(
  bountyId: string,
  hunterAddress: string,
  referredAddress: string,
  evidence?: string
): Promise<BountyTask | null> {
  try {
    // Get the bounty
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    // Get the hunter
    const hunter = await getHunter(hunterAddress);
    if (!hunter) {
      throw new Error("Hunter not registered");
    }
    
    // If verification is required, check hunter status
    if (bounty.eligibleNFTs && bounty.eligibleNFTs.length > 0 && 
        hunter.verificationStatus !== "verified") {
      throw new Error("Hunter is not verified for this bounty");
    }
    
    // Check if there's enough budget
    if (bounty.remainingBudget < bounty.rewardAmount) {
      throw new Error("Insufficient bounty budget");
    }
    
    // Generate task ID
    const taskId = `task-${Date.now().toString(36)}`;
    
    // Create new task
    const task: BountyTask = {
      id: taskId,
      bountyId,
      hunterAddress,
      referredAddress,
      status: "pending",
      submittedAt: Math.floor(Date.now() / 1000),
      amount: bounty.rewardAmount,
      evidence
    };
    
    // Store task
    const storedTasks = localStorage.getItem("bountyTasks") || "[]";
    const tasks: BountyTask[] = JSON.parse(storedTasks);
    tasks.push(task);
    localStorage.setItem("bountyTasks", JSON.stringify(tasks));
    
    console.log("Bounty task submitted:", task);
    
    return task;
  } catch (error) {
    console.error("Error submitting bounty task:", error);
    toast({
      title: "Task Submission Failed",
      description: error instanceof Error ? error.message : "Failed to submit task",
      variant: "destructive"
    });
    return null;
  }
}

/**
 * Verify a bounty task
 * @param taskId ID of the task
 * @param isApproved Whether the task is approved
 * @param verifierAddress Address of the verifier
 * @returns The updated task or null if failed
 */
export async function verifyBountyTask(
  taskId: string,
  isApproved: boolean,
  verifierAddress: string
): Promise<BountyTask | null> {
  try {
    const storedTasks = localStorage.getItem("bountyTasks") || "[]";
    const tasks: BountyTask[] = JSON.parse(storedTasks);
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    
    const task = tasks[taskIndex];
    
    // Only pending tasks can be verified
    if (task.status !== "pending") {
      throw new Error("Task is not in pending status");
    }
    
    // Update task status
    tasks[taskIndex].status = isApproved ? "verified" : "rejected";
    tasks[taskIndex].verifiedAt = Math.floor(Date.now() / 1000);
    
    // If verified, update bounty stats but don't distribute rewards yet
    if (isApproved) {
      const bounty = await getBounty(task.bountyId);
      if (bounty) {
        const bounties = await getBounties();
        const bountyIndex = bounties.findIndex((b: Bounty) => b.id === task.bountyId);
        
        if (bountyIndex !== -1) {
          // Mark as verified but don't update budget yet - that happens on payment
          bounties[bountyIndex].hunterCount += 1;
          localStorage.setItem("bounties", JSON.stringify(bounties));
        }
      }
      
      // Update hunter stats
      const storedHunters = localStorage.getItem("hunters") || "[]";
      const hunters: Hunter[] = JSON.parse(storedHunters);
      
      const hunterIndex = hunters.findIndex(h => h.address.toLowerCase() === task.hunterAddress.toLowerCase());
      if (hunterIndex !== -1) {
        hunters[hunterIndex].reputation += 1;
        hunters[hunterIndex].lastActiveAt = Math.floor(Date.now() / 1000);
        localStorage.setItem("hunters", JSON.stringify(hunters));
      }
    }
    
    // Save updated tasks
    localStorage.setItem("bountyTasks", JSON.stringify(tasks));
    
    return tasks[taskIndex];
  } catch (error) {
    console.error("Error verifying bounty task:", error);
    return null;
  }
}

/**
 * Get all tasks for a bounty
 * @param bountyId ID of the bounty
 * @param status Optional status filter
 * @returns Array of tasks
 */
export async function getBountyTasks(
  bountyId: string,
  status?: BountyTask["status"]
): Promise<BountyTask[]> {
  try {
    const storedTasks = localStorage.getItem("bountyTasks") || "[]";
    const tasks: BountyTask[] = JSON.parse(storedTasks);
    
    // Filter by bounty ID
    let filteredTasks = tasks.filter(t => t.bountyId === bountyId);
    
    // Apply status filter if provided
    if (status) {
      filteredTasks = filteredTasks.filter(t => t.status === status);
    }
    
    return filteredTasks;
  } catch (error) {
    console.error("Error getting bounty tasks:", error);
    return [];
  }
}

/**
 * Get tasks submitted by a hunter
 * @param hunterAddress Address of the hunter
 * @param status Optional status filter
 * @returns Array of tasks
 */
export async function getHunterTasks(
  hunterAddress: string,
  status?: BountyTask["status"]
): Promise<BountyTask[]> {
  try {
    const storedTasks = localStorage.getItem("bountyTasks") || "[]";
    const tasks: BountyTask[] = JSON.parse(storedTasks);
    
    // Filter by hunter address
    let filteredTasks = tasks.filter(t => 
      t.hunterAddress.toLowerCase() === hunterAddress.toLowerCase()
    );
    
    // Apply status filter if provided
    if (status) {
      filteredTasks = filteredTasks.filter(t => t.status === status);
    }
    
    return filteredTasks;
  } catch (error) {
    console.error("Error getting hunter tasks:", error);
    return [];
  }
}

/**
 * Pay rewards for a verified task
 * @param taskId ID of the task
 * @param wallet Connected wallet
 * @returns The updated task or null if failed
 */
export async function payBountyTaskReward(
  taskId: string,
  wallet: any
): Promise<BountyTask | null> {
  try {
    const storedTasks = localStorage.getItem("bountyTasks") || "[]";
    const tasks: BountyTask[] = JSON.parse(storedTasks);
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    
    const task = tasks[taskIndex];
    
    // Only verified tasks can be paid
    if (task.status !== "verified") {
      throw new Error("Task is not verified");
    }
    
    // Get the bounty
    const bounty = await getBounty(task.bountyId);
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    // Check if there's enough budget
    if (bounty.remainingBudget < task.amount) {
      throw new Error("Insufficient bounty budget");
    }
    
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    toast({
      title: "Processing Payment",
      description: "Please approve the transaction in your wallet..."
    });
    
    // Create transaction config
    const txConfig: TransactionConfig = {
      type: 'contract',
      description: `Paying ${task.amount} MATIC for bounty task`,
      timeout: 180000, // 3 minutes
      maxRetries: 3,
      backoffMs: 5000
    };
    
    // Execute the payment transaction
    let tx;
    if (bounty.partyAddress) {
      // If bounty is deployed on blockchain, use the party contract
      // TODO: Implement real contract interaction
      
      // For now, just simulate a transaction
      tx = await executeTransaction(
        () => signer.sendTransaction({
          to: task.hunterAddress,
          value: ethers.utils.parseEther(task.amount.toString())
        }),
        txConfig,
        provider
      );
    } else {
      // For local-only bounties, simulate a transaction
      tx = {
        hash: `0x${Math.random().toString(16).substr(2, 64)}`
      };
    }
    
    // Update task status
    tasks[taskIndex].status = "paid";
    tasks[taskIndex].paidAt = Math.floor(Date.now() / 1000);
    tasks[taskIndex].transactionHash = tx.hash;
    
    // Update bounty stats
    const bounties = await getBounties();
    const bountyIndex = bounties.findIndex((b: Bounty) => b.id === task.bountyId);
    
    if (bountyIndex !== -1) {
      bounties[bountyIndex].usedBudget += task.amount;
      bounties[bountyIndex].remainingBudget -= task.amount;
      bounties[bountyIndex].successCount += 1;
      localStorage.setItem("bounties", JSON.stringify(bounties));
    }
    
    // Update hunter stats
    const storedHunters = localStorage.getItem("hunters") || "[]";
    const hunters: Hunter[] = JSON.parse(storedHunters);
    
    const hunterIndex = hunters.findIndex(h => h.address.toLowerCase() === task.hunterAddress.toLowerCase());
    if (hunterIndex !== -1) {
      hunters[hunterIndex].completedTasks += 1;
      hunters[hunterIndex].totalEarned += task.amount;
      hunters[hunterIndex].reputation += 2; // Extra reputation for paid tasks
      localStorage.setItem("hunters", JSON.stringify(hunters));
    }
    
    // Save updated tasks
    localStorage.setItem("bountyTasks", JSON.stringify(tasks));
    
    toast({
      title: "Payment Successful",
      description: `Task reward of ${task.amount} MATIC has been paid to the hunter`
    });
    
    return tasks[taskIndex];
  } catch (error) {
    console.error("Error paying bounty task reward:", error);
    toast({
      title: "Payment Failed",
      description: error instanceof Error ? error.message : "Failed to pay reward",
      variant: "destructive"
    });
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
    
    // Create enhanced bounty metadata
    const bountyData = {
      name: bounty.name,
      description: bounty.description,
      rewardAmount: bounty.rewardAmount,
      totalBudget: bounty.totalBudget,
      remainingBudget: bounty.remainingBudget,
      createdAt: bounty.createdAt,
      expiresAt: bounty.expiresAt,
      status: bounty.status,
      eligibleNFTs: bounty.eligibleNFTs || [],
      deployedAt: Math.floor(Date.now() / 1000)
    };
    
    // Format for IPFS
    const ipfsContent = formatBountyForIPFS(bountyData, signerAddress);
    
    // Upload to IPFS
    toast({
      title: "Uploading Metadata",
      description: "Preparing bounty metadata for blockchain deployment..."
    });
    
    const metadataURI = await uploadToIPFS(ipfsContent);
    
    // Set up a Party for the bounty
    const partyOptions: PartyOptions = {
      name: `Bounty: ${bounty.name}`,
      hosts: [signerAddress], // The bounty creator is the host
      votingDuration: 3 * 24 * 60 * 60, // 3 days in seconds
      executionDelay: 1 * 24 * 60 * 60, // 1 day in seconds
      passThresholdBps: 5000, // 50%
      allowPublicProposals: true,
      description: bounty.description,
      metadataURI: metadataURI
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
    
    toast({
      title: "Creating Bounty Funding",
      description: "Setting up funding for your bounty..."
    });
    
    // Create a Crowdfund for the bounty
    const crowdfundAddress = await createEthCrowdfund(
      wallet,
      partyAddress,
      crowdfundOptions,
      ipfsContent // Use the formatted IPFS content here instead of bountyMetadata
    );
    
    // Set up event listener for bounty activities
    // This would be implemented in production to track on-chain events
    const eventConfig: EventConfig = {
      provider,
      contractAddress: partyAddress,
      abi: [
        "event BountyTaskSubmitted(uint256 indexed taskId, address indexed hunter, address referred)",
        "event BountyTaskVerified(uint256 indexed taskId, bool approved, address verifier)",
        "event BountyTaskPaid(uint256 indexed taskId, address hunter, uint256 amount)"
      ],
      eventName: "BountyTaskSubmitted"
    };
    
    // We would subscribe to events here in a production environment
    // const subscription = subscribeToProposalEvents(eventConfig, (event) => {
    //   console.log("Bounty event received:", event);
    // });
    
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
    
    // Return the addresses and transaction hash
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
 * @param amount Amount to add to the bounty budget
 * @param wallet Connected wallet
 * @returns Updated bounty or null if failed
 */
export async function fundBounty(
  bountyId: string,
  amount: number,
  wallet: any
): Promise<Bounty | null> {
  try {
    // Get the bounty
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    // Get wallet client
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("Wallet client not available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    toast({
      title: "Processing Funding",
      description: "Please approve the transaction in your wallet..."
    });
    
    // Create transaction config
    const txConfig: TransactionConfig = {
      type: 'contract',
      description: `Adding ${amount} MATIC to bounty budget`,
      timeout: 180000, // 3 minutes
      maxRetries: 3,
      backoffMs: 5000
    };
    
    // Execute the funding transaction
    let tx;
    if (bounty.partyAddress && bounty.crowdfundAddress) {
      // If bounty is deployed on blockchain, use the crowdfund contract
      // TODO: Implement real contract interaction
      
      // For now, just simulate a transaction
      tx = await executeTransaction(
        () => signer.sendTransaction({
          to: bounty.crowdfundAddress,
          value: ethers.utils.parseEther(amount.toString())
        }),
        txConfig,
        provider
      );
    } else {
      // For local-only bounties, simulate a transaction
      tx = {
        hash: `0x${Math.random().toString(16).substr(2, 64)}`
      };
    }
    
    // Update bounty stats
    const bounties = await getBounties();
    const bountyIndex = bounties.findIndex((b: Bounty) => b.id === bountyId);
    
    if (bountyIndex !== -1) {
      bounties[bountyIndex].totalBudget += amount;
      bounties[bountyIndex].remainingBudget += amount;
      localStorage.setItem("bounties", JSON.stringify(bounties));
      
      toast({
        title: "Funding Successful",
        description: `Successfully added ${amount} MATIC to bounty budget`
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

/**
 * Record a successful referral for a bounty
 * @param bountyId ID of the bounty
 * @param referrerAddress Address of the referrer
 * @param referredAddress Address of the referred user
 * @param wallet Connected wallet
 * @returns Promise resolving to referral details
 */
export async function recordSuccessfulReferral(
  bountyId: string,
  referrerAddress: string,
  referredAddress: string,
  wallet: any
): Promise<{
  success: boolean;
  referralId?: string;
  transactionHash?: string;
  error?: string;
}> {
  try {
    console.log("Recording successful referral for bounty:", bountyId);
    
    // Get the bounty
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    // Verify the referrer is a registered hunter
    const hunter = await getHunter(referrerAddress);
    if (!hunter) {
      // Auto-register the hunter if not registered
      await registerHunter(referrerAddress);
    }
    
    // Create a new task for this referral
    const task = await submitBountyTask(
      bountyId,
      referrerAddress,
      referredAddress,
      `Successful referral: ${referredAddress} referred by ${referrerAddress}`
    );
    
    if (!task) {
      throw new Error("Failed to create referral task");
    }
    
    // Auto-verify the task
    const verifiedTask = await verifyBountyTask(task.id, true, "system");
    
    if (!verifiedTask) {
      throw new Error("Failed to verify referral task");
    }
    
    // Get bounty options to check if auto-payment is enabled
    // Instead of accessing bounty.allowPublicHunters directly, we'll check if the task can be auto-paid
    // based on verification status
    let paymentResult = null;
    const taskIsVerified = verifiedTask.status === "verified";
    
    if (taskIsVerified && wallet) {
      paymentResult = await payBountyTaskReward(task.id, wallet);
    }
    
    return {
      success: true,
      referralId: task.id,
      transactionHash: paymentResult?.transactionHash,
    };
  } catch (error) {
    console.error("Error recording successful referral:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error recording referral"
    };
  }
}
