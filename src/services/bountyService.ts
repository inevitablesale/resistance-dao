import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { executeTransaction, verifyPoolTokenTransfer } from "./transactionManager";
import { uploadToIPFS, getFromIPFS } from "./ipfsService";
import { BountyMetadata, TokenDistributionConfig } from "@/types/content";
import { 
  PARTY_PROTOCOL, 
  PARTY_FACTORY_ABI, 
  ETH_CROWDFUND_ABI, 
  PARTY_GOVERNANCE_ABI 
} from "@/lib/constants";
import { TokenTransferStatus } from "@/lib/utils";

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
  status: "active" | "paused" | "expired" | "completed" | "awaiting_tokens";
  partyAddress: string | null;
  eligibleNFTs: string[];
  requireVerification: boolean;
  allowPublicHunters: boolean;
  maxReferralsPerHunter: number;
  bountyType: "nft_referral" | "token_referral" | "social_media" | "token_distribution";
  remainingBudget?: number;
  crowdfundAddress: string | null;
  metadataURI: string | null;
  holdingAddress?: string;
  tokenTransferStatus?: TokenTransferStatus;
  tokenRewards?: {
    tokenAddress: string;
    tokenType: "erc20" | "erc721" | "erc1155";
    tokenIds?: string[];
    amountPerReferral?: number;
    totalTokens?: number;
    remainingTokens?: number;
    distributionStrategy?: "first-come" | "proportional" | "milestone" | "lottery";
  };
  projectInfo?: {
    name: string;
    website?: string;
    logoUrl?: string;
    socialLinks?: {
      twitter?: string;
      discord?: string;
      telegram?: string;
      [key: string]: string | undefined;
    };
  };
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
  bountyType: "nft_referral" | "token_referral" | "social_media" | "token_distribution";
  tokenRewards?: {
    tokenAddress: string;
    tokenType: "erc20" | "erc721" | "erc1155";
    tokenIds?: string[];
    amountPerReferral?: number;
    totalTokens?: number;
    distributionStrategy?: "first-come" | "proportional" | "milestone" | "lottery";
  };
  projectInfo?: {
    name: string;
    website?: string;
    logoUrl?: string;
    socialLinks?: {
      twitter?: string;
      discord?: string;
      telegram?: string;
      [key: string]: string | undefined;
    };
  };
  tokenHoldingAddress?: string;
}

export interface BountyOptions {
  includeExpired?: boolean;
  includeCompleted?: boolean;
}

const calculateRemainingBudget = (bounty: Bounty): Bounty => {
  return {
    ...bounty,
    remainingBudget: bounty.totalBudget - bounty.usedBudget
  };
};

const mapPartyToBounty = async (
  partyAddress: string, 
  metadata: BountyMetadata, 
  provider: ethers.providers.Provider
): Promise<Bounty | null> => {
  try {
    if (!metadata.bountyType) return null;
    
    const party = new ethers.Contract(
      partyAddress,
      PARTY_GOVERNANCE_ABI,
      provider
    );
    
    const [
      votingEnds,
      governanceValues,
      treasuryBalance,
      proposalCount
    ] = await Promise.all([
      party.votingEnds ? party.votingEnds() : 0,
      party.getGovernanceValues ? party.getGovernanceValues() : null,
      provider.getBalance(partyAddress),
      party.proposalCount ? party.proposalCount() : 0
    ]);

    let successCount = 0;
    let usedBudget = 0;
    
    for (let i = 0; i < proposalCount; i++) {
      try {
        const proposalId = await party.proposals(i);
        const status = await party.getProposalStatus(proposalId);
        
        if (status === 3) {
          successCount++;
          
          const proposal = await party.getProposal(proposalId);
          if (proposal && proposal.proposalData && proposal.proposalData.values) {
            for (const value of proposal.proposalData.values) {
              usedBudget += parseFloat(ethers.utils.formatEther(value));
            }
          }
        }
      } catch (error) {
        console.error(`Error processing proposal ${i}:`, error);
        continue;
      }
    }
    
    const hunterCount = await party.getVotersCount ? 
      await party.getVotersCount() : 0;
    
    let crowdfundAddress = null;
    if (metadata.crowdfundAddress && ethers.utils.isAddress(metadata.crowdfundAddress)) {
      crowdfundAddress = metadata.crowdfundAddress;
    }
    
    const now = Math.floor(Date.now() / 1000);
    let bountyStatus: "active" | "paused" | "expired" | "completed" | "awaiting_tokens" = "active";
    
    const totalBudget = parseFloat(ethers.utils.formatEther(treasuryBalance));
    
    if (votingEnds < now) {
      bountyStatus = "expired";
    } else if (usedBudget >= totalBudget) {
      bountyStatus = "completed";
    } else if (metadata.status === "paused") {
      bountyStatus = "paused";
    }
    
    const bounty: Bounty = {
      id: partyAddress,
      name: metadata.title,
      description: metadata.content,
      rewardAmount: metadata.rewardAmount,
      totalBudget,
      usedBudget,
      successCount,
      hunterCount,
      expiresAt: votingEnds,
      status: bountyStatus,
      partyAddress,
      eligibleNFTs: metadata.eligibleNFTs || [],
      requireVerification: metadata.requireVerification,
      allowPublicHunters: metadata.allowPublicHunters,
      maxReferralsPerHunter: metadata.maxReferralsPerHunter,
      bountyType: metadata.bountyType,
      crowdfundAddress,
      metadataURI: metadata.metadataURI
    };
    
    if (metadata.tokenRewards) {
      bounty.tokenRewards = metadata.tokenRewards;
    }
    
    if (metadata.projectInfo) {
      bounty.projectInfo = metadata.projectInfo;
    }
    
    return calculateRemainingBudget(bounty);
  } catch (error) {
    console.error(`Error mapping party ${partyAddress} to bounty:`, error);
    return null;
  }
};

export const getBounties = async (status?: string): Promise<Bounty[]> => {
  console.log("Getting bounties with status filter:", status);
  
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-rpc.com"
    );
    
    const partyFactory = new ethers.Contract(
      PARTY_PROTOCOL.FACTORY_ADDRESS,
      PARTY_FACTORY_ABI,
      provider
    );
    
    let partyAddresses;
    try {
      partyAddresses = await partyFactory.getParties();
    } catch (error) {
      console.error("Error fetching parties from contract:", error);
      partyAddresses = [];
    }
    
    const bountyPromises = partyAddresses.map(async (partyAddress: string) => {
      try {
        const party = new ethers.Contract(
          partyAddress,
          PARTY_GOVERNANCE_ABI,
          provider
        );
        
        let metadataURI;
        try {
          metadataURI = await party.metadataURI();
        } catch (error) {
          return null;
        }
        
        if (!metadataURI) return null;
        
        const metadata = await getFromIPFS<BountyMetadata>(
          metadataURI.replace('ipfs://', ''),
          'bounty'
        );
        
        if (!metadata.bountyType) return null;
        
        return await mapPartyToBounty(partyAddress, metadata, provider);
      } catch (error) {
        console.error(`Error processing party ${partyAddress}:`, error);
        return null;
      }
    });
    
    const allBounties = await Promise.all(bountyPromises);
    
    const validBounties = allBounties.filter(bounty => 
      bounty !== null && 
      (!status || bounty.status === status)
    ) as Bounty[];
    
    return validBounties;
  } catch (error) {
    console.error("Error fetching bounties:", error);
    return [];
  }
};

export const getBounty = async (bountyId: string): Promise<Bounty | null> => {
  try {
    if (!bountyId || !ethers.utils.isAddress(bountyId)) return null;
    
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-rpc.com"
    );
    
    const party = new ethers.Contract(
      bountyId,
      PARTY_GOVERNANCE_ABI,
      provider
    );
    
    let metadataURI;
    try {
      metadataURI = await party.metadataURI();
    } catch (error) {
      console.error("Error fetching metadata URI:", error);
      return null;
    }
    
    if (!metadataURI) {
      throw new Error("Invalid bounty: no metadata URI");
    }
    
    const metadata = await getFromIPFS<BountyMetadata>(
      metadataURI.replace('ipfs://', ''),
      'bounty'
    );
    
    return await mapPartyToBounty(bountyId, metadata, provider);
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
  
  if (!wallet) {
    throw new Error("Wallet not connected");
  }
  
  try {
    let holdingAddress = null;
    if (params.bountyType === "token_distribution" && params.tokenRewards) {
      const provider = wallet.provider;
      const creatorAddress = await wallet.getAddress();
      
      holdingAddress = await generateHoldingAddress(
        provider,
        creatorAddress,
        `bounty-${Date.now()}`
      );
      
      console.log("Generated holding address for token distribution:", holdingAddress);
    }
    
    const { partyAddress, crowdfundAddress, metadataURI } = await deployBountyToBlockchain(
      params,
      wallet,
      holdingAddress
    );
    
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
      status: holdingAddress ? "awaiting_tokens" : "active",
      partyAddress,
      eligibleNFTs: params.eligibleNFTs,
      requireVerification: params.requireVerification,
      allowPublicHunters: params.allowPublicHunters,
      maxReferralsPerHunter: params.maxReferralsPerHunter,
      bountyType: params.bountyType,
      remainingBudget: params.totalBudget,
      crowdfundAddress,
      metadataURI,
      holdingAddress
    };
    
    if (params.tokenRewards) {
      newBounty.tokenRewards = params.tokenRewards;
    }
    
    if (params.projectInfo) {
      newBounty.projectInfo = params.projectInfo;
    }
    
    return newBounty;
  } catch (error) {
    console.error("Error creating bounty:", error);
    throw error;
  }
};

export const deployBountyToBlockchain = async (
  bountyParams: BountyCreationParams,
  wallet: ethers.Signer,
  holdingAddress?: string
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
    const userAddress = await wallet.getAddress();
    console.log("Using wallet for deployment:", userAddress);
    
    const now = Math.floor(Date.now() / 1000);
    const bountyMetadata: BountyMetadata = {
      contentSchema: "resistanceBounty-v1",
      contentType: "bounty",
      title: bountyParams.name,
      content: bountyParams.description,
      metadata: {
        author: userAddress,
        publishedAt: now,
        version: 1
      },
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
    
    if (bountyParams.tokenRewards) {
      bountyMetadata.tokenRewards = {
        ...bountyParams.tokenRewards,
        remainingTokens: bountyParams.tokenRewards.totalTokens
      };
    }
    
    const finalHoldingAddress = holdingAddress || bountyParams.tokenHoldingAddress;
    
    if (finalHoldingAddress && bountyParams.bountyType === "token_distribution") {
      bountyMetadata.holdingAddress = finalHoldingAddress;
      bountyMetadata.tokenTransferStatus = "awaiting_tokens";
      bountyMetadata.status = "awaiting_tokens";
    }
    
    if (bountyParams.projectInfo) {
      bountyMetadata.projectInfo = bountyParams.projectInfo;
    }
    
    const metadataURI = await uploadToIPFS(bountyMetadata);
    console.log("Bounty metadata uploaded to IPFS:", metadataURI);
    
    const partyFactory = new ethers.Contract(
      PARTY_PROTOCOL.FACTORY_ADDRESS,
      PARTY_FACTORY_ABI,
      wallet
    );
    
    const partyOptions = {
      name: `Bounty: ${bountyParams.name}`,
      symbol: "BNTY",
      customizationPresetId: 0,
      governance: {
        hosts: [userAddress],
        voteDuration: 60 * 60 * 24 * 3,
        executionDelay: 60 * 60 * 24,
        passThresholdBps: 5000,
        totalVotingPower: ethers.utils.parseEther(bountyParams.totalBudget.toString()),
        feeBps: 0,
        feeRecipient: ethers.constants.AddressZero
      },
      proposalEngine: {
        enableAddAuthorityProposal: true,
        enableSetHostsProposal: true,
        allowPublicProposals: bountyParams.allowPublicHunters
      }
    };
    
    const preciousTokens: string[] = [];
    const preciousTokenIds: number[] = [];
    
    console.log("Creating bounty party...");
    const tx = await partyFactory.createPartyWithMetadata(
      PARTY_PROTOCOL.PARTY_IMPLEMENTATION,
      [userAddress],
      partyOptions,
      preciousTokens,
      preciousTokenIds,
      0,
      ethers.constants.AddressZero,
      ethers.utils.defaultAbiCoder.encode(["string"], [metadataURI])
    );
    
    console.log("Bounty party creation transaction sent:", tx.hash);
    const receipt = await tx.wait();
    
    let partyAddress = null;
    for (const log of receipt.logs) {
      try {
        const event = partyFactory.interface.parseLog(log);
        if (event.name === "PartyCreated") {
          partyAddress = event.args.party;
          break;
        }
      } catch (error) {
        continue;
      }
    }
    
    if (!partyAddress) {
      throw new Error("Failed to extract party address from transaction receipt");
    }
    
    console.log(`Bounty party created at address: ${partyAddress}`);
    
    console.log("Creating ETH crowdfund for bounty...");
    
    const crowdfundFactory = new ethers.Contract(
      PARTY_PROTOCOL.ETH_CROWDFUND_ADDRESS,
      ETH_CROWDFUND_ABI,
      wallet
    );
    
    const crowdfundOptions = {
      initialContributor: userAddress,
      minContribution: ethers.utils.parseEther("0.01"),
      maxContribution: ethers.utils.parseEther(bountyParams.totalBudget.toString()),
      maxTotalContributions: ethers.utils.parseEther((bountyParams.totalBudget * 2).toString()),
      duration: (60 * 60 * 24 * bountyParams.duration),
      exchangeRate: 1,
      fundingSplitBps: 0,
      fundingSplitRecipient: ethers.constants.AddressZero,
      gateKeeper: ethers.constants.AddressZero,
      gateKeeperId: ethers.constants.HashZero
    };
    
    const crowdfundTx = await crowdfundFactory.createEthCrowdfund(
      partyAddress,
      crowdfundOptions,
      metadataURI
    );
    
    console.log("Crowdfund creation transaction sent:", crowdfundTx.hash);
    const crowdfundReceipt = await crowdfundTx.wait();
    
    let crowdfundAddress = null;
    for (const log of crowdfundReceipt.logs) {
      try {
        const event = crowdfundFactory.interface.parseLog(log);
        if (event.name === "CrowdfundCreated") {
          crowdfundAddress = event.args.crowdfund;
          break;
        }
      } catch (error) {
        continue;
      }
    }
    
    if (!crowdfundAddress) {
      throw new Error("Failed to extract crowdfund address from transaction receipt");
    }
    
    console.log(`Bounty crowdfund created at address: ${crowdfundAddress}`);
    
    console.log(`Contributing ${bountyParams.totalBudget} ETH to the crowdfund...`);
    
    const crowdfund = new ethers.Contract(
      crowdfundAddress,
      ETH_CROWDFUND_ABI,
      wallet
    );
    
    const contributeTx = await crowdfund.contribute(
      userAddress,
      { value: ethers.utils.parseEther(bountyParams.totalBudget.toString()) }
    );
    
    console.log("Contribution transaction sent:", contributeTx.hash);
    await contributeTx.wait();
    
    const updatedMetadata: BountyMetadata = {
      ...bountyMetadata,
      crowdfundAddress
    };
    
    const updatedMetadataURI = await uploadToIPFS(updatedMetadata);
    
    return {
      partyAddress,
      crowdfundAddress,
      metadataURI: updatedMetadataURI
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
    
    if (!bountyId || !ethers.utils.isAddress(bountyId)) {
      return { success: false, error: "Valid Bounty ID required" };
    }
    
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      return { success: false, error: "Bounty not found" };
    }
    
    if (bounty.status !== "active") {
      return { success: false, error: `Bounty is ${bounty.status}, not active` };
    }
    
    const metadataURI = bounty.metadataURI;
    
    if (!metadataURI) {
      return { success: false, error: "Bounty has no metadata URI" };
    }
    
    const metadata = await getFromIPFS<BountyMetadata>(
      metadataURI.replace('ipfs://', ''),
      'bounty'
    );
    
    let rewardAmount = bounty.rewardAmount;
    let multiplier = 1.0;
    
    if (metadata.hunterTiers?.enabled && metadata.hunterPerformance) {
      const { calculateRewardMultiplier } = await import('./hunterPerformanceService');
      multiplier = calculateRewardMultiplier(metadata, referrerId);
      rewardAmount = rewardAmount * multiplier;
    }
    
    const party = new ethers.Contract(
      bountyId,
      PARTY_GOVERNANCE_ABI,
      wallet
    );
    
    const targets = [referrerId];
    const values = [ethers.utils.parseEther(rewardAmount.toString())];
    const calldatas = ["0x"];
    
    const proposalData = {
      basicProposalEngineType: 0,
      targetAddresses: targets,
      values: values,
      calldatas: calldatas,
      signatures: [""]
    };
    
    const description = `Reward for referring ${referredUser} (Multiplier: ${multiplier.toFixed(2)})`;
    
    console.log("Submitting referral reward proposal...");
    const tx = await party.propose(
      proposalData,
      description,
      "0x"
    );
    
    console.log("Proposal submitted:", tx.hash);
    
    await tx.wait(1);
    
    const { updateHunterPerformance } = await import('./hunterPerformanceService');
    const updatedMetadata = updateHunterPerformance(
      metadata,
      referrerId,
      true,
      undefined,
      rewardAmount
    );
    
    const newMetadataURI = await uploadToIPFS(updatedMetadata);
    console.log("Updated metadata uploaded to IPFS:", newMetadataURI);
    
    await party.updateMetadataURI(newMetadataURI);
    
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
    
    if (!bountyId || !ethers.utils.isAddress(bountyId)) {
      return { success: false, error: "Valid Bounty ID required" };
    }
    
    const party = new ethers.Contract(
      bountyId,
      PARTY_GOVERNANCE_ABI,
      wallet
    );
    
    const proposalCount = await party.proposalCount();
    
    const readyProposalIds = [];
    for (let i = 0; i < proposalCount; i++) {
      try {
        const proposalId = await party.proposals(i);
        const status = await party.getProposalStatus(proposalId);
        
        if (status === 2) {
          readyProposalIds.push(proposalId);
        }
      } catch (error) {
        console.error(`Error checking proposal ${i}:`, error);
        continue;
      }
    }
    
    if (readyProposalIds.length === 0) {
      return { success: false, error: "No proposals ready for execution" };
    }
    
    for (const proposalId of readyProposalIds) {
      try {
        console.log(`Executing proposal ${proposalId}...`);
        
        const proposal = await party.getProposal(proposalId);
        
        const executionData = {
          targets: proposal.proposalData.targetAddresses,
          values: proposal.proposalData.values,
          calldatas: proposal.proposalData.calldatas,
          signatures: proposal.proposalData.signatures || [""]
        };
        
        const tx = await party.execute(
          proposalId,
          executionData,
          0,
          "0x"
        );
        
        console.log(`Executing proposal ${proposalId}:`, tx.hash);
        await tx.wait(1);
      } catch (error) {
        console.error(`Error executing proposal ${proposalId}:`, error);
        continue;
      }
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
  newStatus: "active" | "paused" | "expired" | "completed" | "awaiting_tokens",
  wallet: ethers.Signer
): Promise<{ success: boolean, error?: string }> => {
  console.log(`Updating bounty ${bountyId} status to ${newStatus}`);
  
  try {
    if (!wallet) {
      return { success: false, error: "Wallet not connected" };
    }
    
    if (!bountyId || !ethers.utils.isAddress(bountyId)) {
      return { success: false, error: "Valid Bounty ID required" };
    }
    
    const party = new ethers.Contract(
      bountyId,
      PARTY_GOVERNANCE_ABI,
      wallet
    );
    
    const metadataURI = await party.metadataURI();
    
    if (!metadataURI) {
      return { success: false, error: "Bounty has no metadata URI" };
    }
    
    const metadata = await getFromIPFS<BountyMetadata>(
      metadataURI.replace('ipfs://', ''),
      'bounty'
    );
    
    const updatedMetadata: BountyMetadata = {
      ...metadata,
      status: newStatus
    };
    
    const newMetadataURI = await uploadToIPFS(updatedMetadata);
    console.log("Updated metadata uploaded to IPFS:", newMetadataURI);
    
    const tx = await party.updateMetadataURI(newMetadataURI);
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
    
    if (!bountyId || !ethers.utils.isAddress(bountyId)) {
      return { success: false, error: "Valid Bounty ID required" };
    }
    
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      return { success: false, error: "Bounty not found" };
    }
    
    const tx = await wallet.sendTransaction({
      to: bountyId,
      value: ethers.utils.parseEther(additionalFunds.toString())
    });
    
    console.log(`Contributing ${additionalFunds} ETH to bounty:`, tx.hash);
    await tx.wait(1);
    
    const party = new ethers.Contract(
      bountyId,
      PARTY_GOVERNANCE_ABI,
      wallet
    );
    
    const metadataURI = await party.metadataURI();
    
    const metadata = await getFromIPFS<BountyMetadata>(
      metadataURI.replace('ipfs://', ''),
      'bounty'
    );
    
    const updatedMetadata = {
      ...metadata,
      totalBudget: (metadata.totalBudget || 0) + additionalFunds
    };
    
    const newMetadataURI = await uploadToIPFS(updatedMetadata);
    
    const updateTx = await party.updateMetadataURI(newMetadataURI);
    console.log("Updating party metadata with new budget:", updateTx.hash);
    await updateTx.wait(1);
    
    return { success: true };
  } catch (error) {
    console.error("Error funding bounty:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error funding bounty"
    };
  }
};

export const updateBountyHunterTiers = async (
  bountyId: string,
  hunterTiers: BountyMetadata['hunterTiers'],
  performanceMultipliers: BountyMetadata['performanceMultipliers'],
  wallet: ethers.Signer
): Promise<{ success: boolean, error?: string }> => {
  console.log(`Updating hunter tiers for bounty ${bountyId}`);
  
  try {
    if (!wallet) {
      return { success: false, error: "Wallet not connected" };
    }
    
    if (!bountyId || !ethers.utils.isAddress(bountyId)) {
      return { success: false, error: "Valid Bounty ID required" };
    }
    
    const party = new ethers.Contract(
      bountyId,
      PARTY_GOVERNANCE_ABI,
      wallet
    );
    
    const metadataURI = await party.metadataURI();
    
    if (!metadataURI) {
      return { success: false, error: "Bounty has no metadata URI" };
    }
    
    const metadata = await getFromIPFS<BountyMetadata>(
      metadataURI.replace('ipfs://', ''),
      'bounty'
    );
    
    const updatedMetadata: BountyMetadata = {
      ...metadata,
      hunterTiers,
      performanceMultipliers
    };
    
    const newMetadataURI = await uploadToIPFS(updatedMetadata);
    console.log("Updated metadata uploaded to IPFS:", newMetadataURI);
    
    const tx = await party.updateMetadataURI(newMetadataURI);
    console.log("Updating party metadata:", tx.hash);
    await tx.wait(1);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating hunter tiers:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error updating hunter tiers"
    };
  }
};

export const getHunterPerformance = async (
  bountyId: string,
  hunterAddress: string
): Promise<any> => {
  try {
    if (!bountyId || !ethers.utils.isAddress(bountyId)) {
      throw new Error("Valid Bounty ID required");
    }
    
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    const metadataURI = bounty.metadataURI;
    
    if (!metadataURI) {
      throw new Error("Bounty has no metadata URI");
    }
    
    const metadata = await getFromIPFS<BountyMetadata>(
      metadataURI.replace('ipfs://', ''),
      'bounty'
    );
    
    if (!metadata.hunterTiers?.enabled) {
      return { 
        enabled: false,
        message: "Performance tiers not enabled for this bounty"
      };
    }
    
    const { getHunterTierInfo } = await import('./hunterPerformanceService');
    const tierInfo = getHunterTierInfo(metadata, hunterAddress);
    
    return {
      enabled: true,
      ...tierInfo
    };
  } catch (error) {
    console.error("Error getting hunter performance:", error);
    throw error;
  }
};

export const verifyBountyTokenTransfer = async (
  bountyId: string,
  provider: ethers.providers.Provider
): Promise<{
  status: TokenTransferStatus;
  currentAmount: string;
  targetAmount: string;
  missingTokens?: string[];
}> => {
  try {
    console.log(`Verifying token transfer for bounty ${bountyId}`);
    
    const bounty = await getBounty(bountyId);
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    
    if (
      bounty.bountyType !== "token_distribution" || 
      !bounty.holdingAddress || 
      !bounty.tokenRewards
    ) {
      throw new Error("This bounty doesn't use the token holding pattern");
    }
    
    const result = await verifyPoolTokenTransfer(
      provider,
      {
        poolId: bountyId,
        holdingAddress: bounty.holdingAddress,
        tokenType: bounty.tokenRewards.tokenType,
        tokenAddress: bounty.tokenRewards.tokenAddress,
        tokenIds: bounty.tokenRewards.tokenIds,
        amount: bounty.tokenRewards.amountPerReferral?.toString()
      }
    );
    
    if (bounty.metadataURI) {
      const metadata = await getFromIPFS<BountyMetadata>(
        bounty.metadataURI.replace('ipfs://', ''),
        'bounty'
      );
      
      const updatedMetadata: BountyMetadata = {
        ...metadata,
        tokenTransferStatus: result.status
      };
      
      if (result.status === "completed") {
        updatedMetadata.status = "active";
      }
      
      const newMetadataURI = await uploadToIPFS(updatedMetadata);
      
      if (provider.getSigner) {
        const signer = provider.getSigner();
        const party = new ethers.Contract(
          bountyId,
          PARTY_GOVERNANCE_ABI,
          signer
        );
        
        const tx = await party.updateMetadataURI(newMetadataURI);
        await tx.wait();
      }
    }
    
    return result;
  } catch (error) {
    console.error("Error verifying bounty token transfer:", error);
    return {
      status: "failed",
      currentAmount: "0",
      targetAmount: "0",
      missingTokens: []
    };
  }
};

export const generateHoldingAddress = async (
  provider: ethers.providers.Provider,
  creatorAddress: string,
  prefix: string
): Promise<string> => {
  const hash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["string", "address"],
      [prefix, creatorAddress]
    )
  );
  return ethers.utils.getAddress(hash);
};
