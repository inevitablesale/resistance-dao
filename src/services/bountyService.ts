
import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction } from "./transactionManager";
import { toast } from "@/hooks/use-toast";
import { createBountyParty, createEthCrowdfund, getPartyDetails, getPartyProposals } from "./partyProtocolService";
import { uploadToIPFS, getFromIPFS } from "./ipfsService";

export interface Bounty {
  id: string;
  name: string;
  description: string;
  rewardAmount: number;
  totalBudget: number;
  usedBudget: number;
  successCount: number;
  hunterCount: number;
  expiresAt: number;
  status: "active" | "paused" | "expired" | "completed";
  partyAddress: string | null;
  eligibleNFTs: string[];
  requireVerification: boolean;
  allowPublicHunters: boolean;
  maxReferralsPerHunter: number;
  bountyType: "nft_referral" | "token_referral" | "social_media";
  remainingBudget?: number;
  crowdfundAddress: string | null;
  metadataURI: string | null;
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

export interface BountyOptions {
  includeExpired?: boolean;
  includeCompleted?: boolean;
}

// Helper function to calculate remaining budget
const calculateRemainingBudget = (bounty: Bounty): Bounty => {
  return {
    ...bounty,
    remainingBudget: bounty.totalBudget - bounty.usedBudget
  };
};

/**
 * Get bounties from the blockchain by querying the subgraph or indexer
 * @param status Optional status filter
 * @returns Promise with array of bounties
 */
export const getBounties = async (status?: string): Promise<Bounty[]> => {
  console.log("Getting bounties with status filter:", status);
  
  try {
    // In a real implementation, we query an indexer or subgraph for all bounty parties
    // This would typically be a GraphQL query to something like The Graph protocol
    
    // This is the actual implementation that would query all bounty parties from a subgraph
    // const subgraphEndpoint = "https://api.thegraph.com/subgraphs/name/partyprotocol/bounties";
    // const query = `
    //   {
    //     bountyParties(where: { type: "bounty" }) {
    //       id
    //       metadataURI
    //       crowdfundAddress
    //       votingEnds
    //       createdAt
    //     }
    //   }
    // `;
    // const response = await fetch(subgraphEndpoint, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ query })
    // });
    // const data = await response.json();
    // const partyAddresses = data.data.bountyParties.map(party => party.id);
    
    // Since we don't have an actual subgraph yet, we'll retrieve a list of parties 
    // from the contract events directly
    
    const fetchedBounties: Bounty[] = [];
    
    // Temporary measure until subgraph is available - get parties from contract events
    // In production, this would use a proper subgraph or indexer
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-rpc.com"
    );
    
    // Get party contract factory
    const partyFactory = new ethers.Contract(
      "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa", // Party Protocol factory on Polygon
      [
        "event PartyCreated(address indexed partyAddress, address indexed creator, string metadata)",
        "function getParties() external view returns (address[])"
      ],
      provider
    );
    
    // Get all parties (this is inefficient but works until we have a subgraph)
    let partyAddresses;
    try {
      partyAddresses = await partyFactory.getParties();
    } catch (error) {
      console.error("Error fetching parties from contract:", error);
      
      // Fallback to empty array if contract doesn't exist yet
      partyAddresses = [];
    }
    
    // For each party, check if it's a bounty party by looking at its metadata
    for (const partyAddress of partyAddresses) {
      try {
        // Get party details
        const partyDetails = await getPartyDetails(provider, partyAddress);
        
        // Skip if not a bounty
        if (!partyDetails.metadataURI) continue;
        
        // Fetch and parse metadata
        const metadata = await getFromIPFS(
          partyDetails.metadataURI.replace('ipfs://', ''),
          'bounty'
        );
        
        // Skip if not a bounty type
        if (!metadata.bountyType) continue;
        
        // Get proposals to calculate success count
        const proposals = await getPartyProposals(provider, partyAddress);
        const successfulProposals = proposals.filter(p => p.status === 'executed');
        
        // Get crowdfund details to calculate used budget
        const crowdfundContract = partyDetails.crowdfundAddress ? 
          new ethers.Contract(
            partyDetails.crowdfundAddress,
            [
              "function totalContributions() external view returns (uint256)",
              "function getTotalParticipants() external view returns (uint256)"
            ],
            provider
          ) : null;
          
        let totalBudget = 0;
        let hunterCount = 0;
        let usedBudget = 0;
        
        if (crowdfundContract) {
          try {
            totalBudget = parseFloat(ethers.utils.formatEther(
              await crowdfundContract.totalContributions()
            ));
            hunterCount = (await crowdfundContract.getTotalParticipants()).toNumber();
          } catch (error) {
            console.error("Error fetching crowdfund details:", error);
          }
        }
        
        // Calculate used budget based on successful proposals
        usedBudget = successfulProposals.reduce((total, proposal) => {
          return total + proposal.totalValue;
        }, 0);
        
        // Determine status
        const now = Math.floor(Date.now() / 1000);
        let bountyStatus: "active" | "paused" | "expired" | "completed" = "active";
        
        if (partyDetails.votingEnds < now) {
          bountyStatus = "expired";
        } else if (usedBudget >= totalBudget) {
          bountyStatus = "completed";
        } else if (metadata.status === "paused") {
          bountyStatus = "paused";
        }
        
        // Skip if doesn't match status filter
        if (status && bountyStatus !== status) continue;
        
        // Create bounty object
        const bounty: Bounty = {
          id: partyAddress,
          name: metadata.name,
          description: metadata.description,
          rewardAmount: metadata.rewardAmount,
          totalBudget,
          usedBudget,
          successCount: successfulProposals.length,
          hunterCount,
          expiresAt: partyDetails.votingEnds,
          status: bountyStatus,
          partyAddress,
          eligibleNFTs: metadata.eligibleNFTs || [],
          requireVerification: metadata.requireVerification,
          allowPublicHunters: metadata.allowPublicHunters,
          maxReferralsPerHunter: metadata.maxReferralsPerHunter,
          bountyType: metadata.bountyType,
          crowdfundAddress: partyDetails.crowdfundAddress,
          metadataURI: partyDetails.metadataURI
        };
        
        fetchedBounties.push(calculateRemainingBudget(bounty));
      } catch (error) {
        console.error(`Error processing party ${partyAddress}:`, error);
        // Continue to next party
      }
    }
    
    return fetchedBounties;
  } catch (error) {
    console.error("Error fetching bounties:", error);
    return [];
  }
};

export const getBounty = async (bountyId: string): Promise<Bounty | null> => {
  try {
    if (!bountyId) return null;
    
    // Query the specific bounty directly from the blockchain
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-rpc.com"
    );
    
    // Get party details
    const partyDetails = await getPartyDetails(provider, bountyId);
    
    if (!partyDetails.metadataURI) {
      throw new Error("Invalid bounty: no metadata URI");
    }
    
    // Fetch and parse metadata
    const metadata = await getFromIPFS(
      partyDetails.metadataURI.replace('ipfs://', ''),
      'bounty'
    );
    
    // Get proposals to calculate success count
    const proposals = await getPartyProposals(provider, bountyId);
    const successfulProposals = proposals.filter(p => p.status === 'executed');
    
    // Get crowdfund details
    const crowdfundContract = partyDetails.crowdfundAddress ? 
      new ethers.Contract(
        partyDetails.crowdfundAddress,
        [
          "function totalContributions() external view returns (uint256)",
          "function getTotalParticipants() external view returns (uint256)"
        ],
        provider
      ) : null;
      
    let totalBudget = 0;
    let hunterCount = 0;
    let usedBudget = 0;
    
    if (crowdfundContract) {
      try {
        totalBudget = parseFloat(ethers.utils.formatEther(
          await crowdfundContract.totalContributions()
        ));
        hunterCount = (await crowdfundContract.getTotalParticipants()).toNumber();
      } catch (error) {
        console.error("Error fetching crowdfund details:", error);
      }
    }
    
    // Calculate used budget based on successful proposals
    usedBudget = successfulProposals.reduce((total, proposal) => {
      return total + proposal.totalValue;
    }, 0);
    
    // Determine status
    const now = Math.floor(Date.now() / 1000);
    let bountyStatus: "active" | "paused" | "expired" | "completed" = "active";
    
    if (partyDetails.votingEnds < now) {
      bountyStatus = "expired";
    } else if (usedBudget >= totalBudget) {
      bountyStatus = "completed";
    } else if (metadata.status === "paused") {
      bountyStatus = "paused";
    }
    
    // Create bounty object
    const bounty: Bounty = {
      id: bountyId,
      name: metadata.name,
      description: metadata.description,
      rewardAmount: metadata.rewardAmount,
      totalBudget,
      usedBudget,
      successCount: successfulProposals.length,
      hunterCount,
      expiresAt: partyDetails.votingEnds,
      status: bountyStatus,
      partyAddress: bountyId,
      eligibleNFTs: metadata.eligibleNFTs || [],
      requireVerification: metadata.requireVerification,
      allowPublicHunters: metadata.allowPublicHunters,
      maxReferralsPerHunter: metadata.maxReferralsPerHunter,
      bountyType: metadata.bountyType,
      crowdfundAddress: partyDetails.crowdfundAddress,
      metadataURI: partyDetails.metadataURI
    };
    
    return calculateRemainingBudget(bounty);
  } catch (error) {
    console.error("Error fetching bounty details:", error);
    return null;
  }
};

export const createBounty = async (
  params: BountyCreationParams,
  wallet: ethers.Signer
): Promise<Bounty> => {
  console.log("Creating bounty with params:", params);
  console.log("Using wallet:", await wallet.getAddress());
  
  if (!wallet) {
    throw new Error("Wallet not connected");
  }
  
  try {
    // First, deploy the bounty to blockchain using Party Protocol
    const { partyAddress, crowdfundAddress, metadataURI } = await deployBountyToBlockchain(
      {
        name: params.name,
        description: params.description,
        rewardAmount: params.rewardAmount,
        totalBudget: params.totalBudget,
        duration: params.duration,
        requireVerification: params.requireVerification,
        allowPublicHunters: params.allowPublicHunters,
        maxReferralsPerHunter: params.maxReferralsPerHunter,
        eligibleNFTs: params.eligibleNFTs,
        bountyType: params.bountyType,
        successCriteria: params.successCriteria
      },
      wallet
    );
    
    // Return the new bounty with blockchain data
    const newBounty: Bounty = {
      id: partyAddress,
      name: params.name,
      description: params.description,
      rewardAmount: params.rewardAmount,
      totalBudget: params.totalBudget,
      usedBudget: 0,
      successCount: 0,
      hunterCount: 0,
      expiresAt: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * params.duration),
      status: "active",
      partyAddress,
      eligibleNFTs: params.eligibleNFTs,
      requireVerification: params.requireVerification,
      allowPublicHunters: params.allowPublicHunters,
      maxReferralsPerHunter: params.maxReferralsPerHunter,
      bountyType: params.bountyType,
      remainingBudget: params.totalBudget,
      crowdfundAddress,
      metadataURI
    };
    
    return newBounty;
  } catch (error) {
    console.error("Error creating bounty:", error);
    throw error;
  }
};

export const deployBountyToBlockchain = async (
  bountyParams: {
    name: string;
    description: string;
    rewardAmount: number;
    totalBudget: number;
    duration: number;
    requireVerification: boolean;
    allowPublicHunters: boolean;
    maxReferralsPerHunter: number;
    eligibleNFTs: string[];
    bountyType: "nft_referral" | "token_referral" | "social_media";
    successCriteria: string;
  },
  wallet: ethers.Signer
): Promise<{ partyAddress: string; crowdfundAddress: string; metadataURI: string }> => {
  console.log(`Deploying bounty to blockchain`);
  
  if (!wallet) {
    throw new ProposalError({
      category: 'initialization',
      message: 'Wallet not connected',
      recoverySteps: ['Please connect your wallet']
    });
  }
  
  try {
    console.log("Using wallet for deployment:", await wallet.getAddress());
    
    // Prepare Party Protocol options for bounty
    const now = Math.floor(Date.now() / 1000);
    const bountyPartyOptions = {
      name: `Bounty: ${bountyParams.name}`,
      hosts: [await wallet.getAddress()], // Bounty creator as host
      votingDuration: 60 * 60 * 24 * 3, // 3 days
      executionDelay: 60 * 60 * 24, // 1 day
      passThresholdBps: 5000, // 50%
      allowPublicProposals: false, // Only hosts can make proposals
      description: bountyParams.description,
      
      // Bounty-specific options
      rewardAmount: bountyParams.rewardAmount,
      maxParticipants: 1000, // Arbitrary large number
      startTime: now,
      endTime: now + (60 * 60 * 24 * bountyParams.duration),
      verificationRequired: bountyParams.requireVerification,
      targetRequirements: bountyParams.eligibleNFTs
    };
    
    // Upload bounty metadata to IPFS
    const bountyMetadata = {
      name: bountyParams.name,
      description: bountyParams.description,
      bountyType: bountyParams.bountyType,
      rewardAmount: bountyParams.rewardAmount,
      totalBudget: bountyParams.totalBudget,
      allowPublicHunters: bountyParams.allowPublicHunters,
      maxReferralsPerHunter: bountyParams.maxReferralsPerHunter,
      requireVerification: bountyParams.requireVerification,
      eligibleNFTs: bountyParams.eligibleNFTs,
      successCriteria: bountyParams.successCriteria,
      createdAt: now,
      expiresAt: now + (60 * 60 * 24 * bountyParams.duration)
    };
    
    const metadataURI = await uploadToIPFS(bountyMetadata);
    console.log("Bounty metadata uploaded to IPFS:", metadataURI);
    
    // Step 1: Create the Bounty Party
    console.log("Creating bounty party on Party Protocol...");
    const partyAddress = await createBountyParty(wallet, {
      ...bountyPartyOptions,
      metadataURI
    });
    
    console.log(`Bounty party created at address: ${partyAddress}`);
    
    // Step 2: Create ETH Crowdfund for the party to manage bounty funds
    console.log("Creating ETH crowdfund for bounty...");
    
    const userAddress = await wallet.getAddress();
    
    const crowdfundOptions = {
      initialContributor: userAddress,
      minContribution: ethers.utils.parseEther("0.01"), // Small minimum to allow most users
      maxContribution: ethers.utils.parseEther(bountyParams.totalBudget.toString()), // Full budget amount
      maxTotalContributions: ethers.utils.parseEther((bountyParams.totalBudget * 2).toString()), // Allow for additional funding
      duration: (60 * 60 * 24 * bountyParams.duration) // Duration until expiry
    };
    
    const crowdfundAddress = await createEthCrowdfund(
      wallet,
      partyAddress,
      crowdfundOptions,
      bountyMetadata
    );
    
    console.log(`Bounty crowdfund created at address: ${crowdfundAddress}`);
    
    return { 
      partyAddress, 
      crowdfundAddress,
      metadataURI
    };
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

export const recordSuccessfulReferral = async (
  bountyId: string,
  referrerId: string,
  referredUser: string,
  wallet: ethers.Signer
): Promise<{ success: boolean, error?: string }> => {
  console.log(`Recording successful referral for bounty ${bountyId} by ${referrerId} for user ${referredUser}`);
  
  try {
    if (!wallet) {
      return { success: false, error: "Wallet not connected" };
    }
    
    if (!bountyId) {
      return { success: false, error: "Bounty ID required" };
    }
    
    // Create a proposal to reward the referrer
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      return { success: false, error: "Bounty not found" };
    }
    
    // Check if bounty is still active
    if (bounty.status !== "active") {
      return { success: false, error: `Bounty is ${bounty.status}, not active` };
    }
    
    // Create a proposal on the party to send reward to referrer
    const partyContract = new ethers.Contract(
      bountyId,
      [
        "function propose(address[] targets, uint256[] values, bytes[] calldatas, string description) external returns (uint256)"
      ],
      wallet
    );
    
    // Prepare proposal to transfer ETH to referrer
    const targets = [referrerId];
    const values = [ethers.utils.parseEther(bounty.rewardAmount.toString())];
    const calldatas = ["0x"]; // Empty calldata for simple ETH transfer
    const description = `Reward for referring ${referredUser}`;
    
    // Submit proposal
    const tx = await partyContract.propose(
      targets,
      values,
      calldatas,
      description
    );
    
    console.log("Proposal submitted:", tx.hash);
    
    // Wait for transaction to confirm
    await tx.wait(1);
    
    return { success: true };
  } catch (error) {
    console.error("Error recording referral:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error recording referral"
    };
  }
};

export const distributeRewards = async (
  bountyId: string,
  wallet: ethers.Signer
): Promise<{ success: boolean, error?: string }> => {
  console.log(`Distributing rewards for bounty ${bountyId}`);
  
  try {
    if (!wallet) {
      return { success: false, error: "Wallet not connected" };
    }
    
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      return { success: false, error: "Bounty not found" };
    }
    
    if (!bounty.partyAddress) {
      return { success: false, error: "Bounty must be deployed to blockchain first" };
    }
    
    // Get pending proposals
    const proposals = await getPartyProposals(wallet.provider, bountyId);
    const pendingProposals = proposals.filter(p => 
      p.status === 'active' || p.status === 'ready'
    );
    
    if (pendingProposals.length === 0) {
      return { success: false, error: "No pending proposals to execute" };
    }
    
    // Execute ready proposals
    const partyContract = new ethers.Contract(
      bountyId,
      [
        "function execute(uint256 proposalId) external"
      ],
      wallet
    );
    
    const readyProposals = pendingProposals.filter(p => p.status === 'ready');
    
    if (readyProposals.length === 0) {
      return { success: false, error: "No proposals ready for execution" };
    }
    
    // Execute each ready proposal
    for (const proposal of readyProposals) {
      const tx = await partyContract.execute(proposal.id);
      console.log(`Executing proposal ${proposal.id}:`, tx.hash);
      await tx.wait(1);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error distributing rewards:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error distributing rewards"
    };
  }
};

export const updateBountyStatus = async (
  bountyId: string,
  newStatus: "active" | "paused" | "expired" | "completed",
  wallet: ethers.Signer
): Promise<{ success: boolean, error?: string }> => {
  console.log(`Updating bounty ${bountyId} status to ${newStatus}`);
  
  try {
    if (!wallet) {
      return { success: false, error: "Wallet not connected" };
    }
    
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      return { success: false, error: "Bounty not found" };
    }
    
    if (!bounty.partyAddress) {
      return { success: false, error: "Bounty must be deployed to blockchain first" };
    }
    
    // Get existing metadata
    const metadata = await getFromIPFS(
      bounty.metadataURI?.replace('ipfs://', '') || '',
      'bounty'
    );
    
    // Update the status in metadata
    const updatedMetadata = {
      ...metadata,
      status: newStatus
    };
    
    // Upload updated metadata to IPFS
    const newMetadataURI = await uploadToIPFS(updatedMetadata);
    console.log("Updated metadata uploaded to IPFS:", newMetadataURI);
    
    // Update the party's metadata URI
    const partyContract = new ethers.Contract(
      bountyId,
      [
        "function updatePartyMetadata(string memory newMetadataURI) external"
      ],
      wallet
    );
    
    const tx = await partyContract.updatePartyMetadata(newMetadataURI);
    console.log("Updating party metadata:", tx.hash);
    await tx.wait(1);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating bounty status:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error updating status"
    };
  }
};

export const fundBounty = async (
  bountyId: string,
  additionalFunds: number,
  wallet: ethers.Signer
): Promise<{ success: boolean, error?: string }> => {
  console.log(`Adding ${additionalFunds} to bounty ${bountyId}`);
  
  try {
    if (!wallet) {
      return { success: false, error: "Wallet not connected" };
    }
    
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      return { success: false, error: "Bounty not found" };
    }
    
    if (!bounty.crowdfundAddress) {
      return { success: false, error: "Bounty doesn't have an associated crowdfund" };
    }
    
    // Contribute to the crowdfund
    const crowdfundContract = new ethers.Contract(
      bounty.crowdfundAddress,
      [
        "function contribute() external payable"
      ],
      wallet
    );
    
    // Convert amount to wei
    const fundAmount = ethers.utils.parseEther(additionalFunds.toString());
    
    // Send transaction
    const tx = await crowdfundContract.contribute({
      value: fundAmount
    });
    
    console.log(`Contributing ${additionalFunds} ETH to crowdfund:`, tx.hash);
    await tx.wait(1);
    
    return { success: true };
  } catch (error) {
    console.error("Error funding bounty:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error funding bounty"
    };
  }
};

