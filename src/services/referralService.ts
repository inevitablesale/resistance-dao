
import { ethers } from "ethers";
import { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { PARTY_PROTOCOL, PARTY_GOVERNANCE_ABI, PARTY_FACTORY_ABI } from "@/lib/constants";
import { uploadToIPFS } from "./ipfsService";
import { NFTClass } from "./alchemyService";

export interface ReferralPartyOptions {
  name: string;
  description: string;
  referrer: string;
  rewardPercentage: number;
  hosts: string[];
  duration: number;
}

export interface ReferralInfo {
  referralId: string;
  referrer: string;
  referralCode: string;
  nftType: NFTClass;
  createdAt: number;
  partyAddress?: string;
  rewardsClaimed: number;
  totalEarned: number;
  active: boolean;
}

export interface ReferralReward {
  referralId: string;
  purchaser: string;
  amount: string;
  timestamp: number;
  claimed: boolean;
  transactionHash: string;
}

/**
 * Create a referral party that will distribute rewards to referrers
 */
export const createReferralParty = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  options: ReferralPartyOptions
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    console.log("Creating referral party with options:", options);
    
    // Upload metadata to IPFS
    const metadata = {
      name: options.name,
      description: options.description,
      type: "referral",
      referrer: options.referrer,
      rewardPercentage: options.rewardPercentage,
      createdAt: Math.floor(Date.now() / 1000)
    };
    
    const ipfsHash = await uploadToIPFS(metadata);
    console.log("Referral metadata uploaded to IPFS:", ipfsHash);
    
    const partyFactory = new ethers.Contract(
      PARTY_PROTOCOL.FACTORY_ADDRESS,
      PARTY_FACTORY_ABI,
      signer
    );
    
    // Set up proposal engine options for referral rewards
    const proposalEngineOpts = {
      basicProposalEngineType: 0, // Standard proposal type
      targetAddresses: [],
      values: [],
      calldatas: [],
      signatures: []
    };
    
    const proposalConfig = {
      proposalEngineOpts,
      enableAddAuthorityProposal: true,
      allowPublicProposals: true, // Anyone can submit a referral reward proposal
      allowUriChanges: true,
      allowCustomProposals: true
    };
    
    // Create the party transaction
    const tx = await partyFactory.createParty({
      authority: ethers.constants.AddressZero,
      name: options.name,
      hosts: options.hosts,
      votingDuration: 60 * 60, // 1 hour - rapid approval for referrals
      executionDelay: 0, // No delay for execution
      passThresholdBps: 5000, // 50% pass threshold
      proposers: [], // Anyone can propose (for referrals)
      proposalConfig
    });
    
    console.log("Referral party creation transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Referral party creation receipt:", receipt);
    
    // Extract party address from event logs
    const event = receipt.events?.find(e => e.event === "PartyCreated");
    if (!event || !event.args) {
      throw new Error("Party creation event not found in receipt");
    }
    
    const partyAddress = event.args.party;
    console.log("Referral party created at address:", partyAddress);
    
    return partyAddress;
  } catch (error) {
    console.error("Error creating referral party:", error);
    throw error;
  }
};

/**
 * Generate a unique referral code for a wallet
 */
export const generateReferralCode = (address: string, nftType: NFTClass): string => {
  // Create a prefix based on NFT type
  const prefix = nftType === 'Bounty Hunter' ? 'BH' : 
                 nftType === 'Sentinel' ? 'ST' : 
                 nftType === 'Survivor' ? 'SV' : 'XX';
  
  // Take first 4 and last 4 chars of address
  const shortAddress = `${address.substring(2, 6)}${address.substring(address.length - 4)}`;
  
  // Add random suffix (3 chars)
  const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  
  return `${prefix}-${shortAddress}-${randomSuffix}`;
};

/**
 * Create a new referral for a bounty hunter
 */
export const createReferral = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  nftType: NFTClass
): Promise<ReferralInfo> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const referrerAddress = await signer.getAddress();
    
    // Generate a unique referral code
    const referralCode = generateReferralCode(referrerAddress, nftType);
    
    // Create a referral party
    const partyOptions: ReferralPartyOptions = {
      name: `${nftType} Referral - ${referralCode}`,
      description: `Referral pool for ${nftType} referrals from ${referrerAddress}`,
      referrer: referrerAddress,
      rewardPercentage: 5, // 5% reward
      hosts: [referrerAddress],
      duration: 30 * 24 * 60 * 60 // 30 days
    };
    
    const partyAddress = await createReferralParty(wallet, partyOptions);
    
    // Create the referral info
    const referralInfo: ReferralInfo = {
      referralId: ethers.utils.id(`${referrerAddress}-${Date.now()}`).slice(0, 42),
      referrer: referrerAddress,
      referralCode,
      nftType,
      createdAt: Math.floor(Date.now() / 1000),
      partyAddress,
      rewardsClaimed: 0,
      totalEarned: 0,
      active: true
    };
    
    return referralInfo;
    
  } catch (error) {
    console.error("Error creating referral:", error);
    throw error;
  }
};

/**
 * Register an NFT purchase with a referral code
 */
export const registerReferralPurchase = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  referralCode: string,
  referralPartyAddress: string,
  purchaseAmount: string
): Promise<ReferralReward> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const purchaserAddress = await signer.getAddress();
    
    console.log("Registering referral purchase:", {
      referralCode,
      referralPartyAddress,
      purchaseAmount,
      purchaser: purchaserAddress
    });
    
    const partyContract = new ethers.Contract(
      referralPartyAddress,
      PARTY_GOVERNANCE_ABI,
      signer
    );
    
    // Calculate reward amount (5% of purchase)
    const purchaseAmountWei = ethers.utils.parseEther(purchaseAmount);
    const rewardAmountWei = purchaseAmountWei.mul(5).div(100); // 5% reward
    
    // Create a proposal for referral reward
    const proposalData = {
      basicProposalEngineType: 0, // Standard proposal type
      targetAddresses: [referralPartyAddress],
      values: [rewardAmountWei],
      calldatas: ["0x"],
      signatures: [""]
    };
    
    // Submit the proposal with the purchase info
    const tx = await partyContract.propose(
      proposalData,
      `Referral Reward | Code: ${referralCode} | Purchaser: ${purchaserAddress} | Amount: ${purchaseAmount} ETH`,
      "0x", // No progress data
      { value: rewardAmountWei } // Send ETH with the proposal
    );
    
    console.log("Referral reward proposal transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Referral reward proposal receipt:", receipt);
    
    // Extract proposal ID from event logs
    const event = receipt.events?.find(e => e.event === "ProposalCreated");
    if (!event || !event.args) {
      throw new Error("Proposal creation event not found in receipt");
    }
    
    const proposalId = event.args.proposalId.toString();
    
    // Create the referral reward record
    const referralReward: ReferralReward = {
      referralId: ethers.utils.id(`${referralCode}-${Date.now()}`).slice(0, 42),
      purchaser: purchaserAddress,
      amount: rewardAmountWei.toString(),
      timestamp: Math.floor(Date.now() / 1000),
      claimed: false,
      transactionHash: tx.hash
    };
    
    return referralReward;
    
  } catch (error) {
    console.error("Error registering referral purchase:", error);
    throw error;
  }
};

/**
 * Claim a referral reward
 */
export const claimReferralReward = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  referralPartyAddress: string,
  proposalId: string
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    const partyContract = new ethers.Contract(
      referralPartyAddress,
      PARTY_GOVERNANCE_ABI,
      signer
    );
    
    // Execute the proposal to claim reward
    const tx = await partyContract.execute(
      proposalId,
      {
        targets: [await signer.getAddress()],
        values: [0],
        calldatas: ["0x"],
        signatures: [""]
      },
      0, // No flags
      "0x" // No progress data
    );
    
    console.log("Claim reward transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Claim reward receipt:", receipt);
    
    return tx.hash;
    
  } catch (error) {
    console.error("Error claiming referral reward:", error);
    throw error;
  }
};
