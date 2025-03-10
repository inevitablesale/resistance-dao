
import { ethers } from "ethers";
import { PARTY_PROTOCOL, PARTY_FACTORY_ABI, ETH_CROWDFUND_ABI, PARTY_GOVERNANCE_ABI } from "@/lib/constants";
import { uploadToIPFS } from "./ipfsService";
import { useToast } from "@/hooks/use-toast";
import { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { ProposalMetadata } from "@/types/proposals";

export interface PartyOptions {
  name: string;
  hosts: string[];
  votingDuration: number;
  executionDelay: number;
  passThresholdBps: number;
  proposers?: string[];
  allowPublicProposals: boolean;
  description: string;
  metadataURI: string;
}

export interface CrowdfundOptions {
  initialContributor: string;
  minContribution: string;
  maxContribution: string;
  maxTotalContributions: string;
  duration: number;
}

// Function to verify if a user owns a Survivor NFT
export const verifySurvivorOwnership = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  survivorAddress: string
): Promise<boolean> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    // Check if the address owns a Survivor NFT
    const survivorContract = new ethers.Contract(
      survivorAddress,
      ["function balanceOf(address) view returns (uint256)"],
      provider
    );
    
    const balance = await survivorContract.balanceOf(signerAddress);
    return balance.gt(0);
    
  } catch (error) {
    console.error("Error verifying Survivor ownership:", error);
    return false;
  }
};

// Create a Party through the Party Factory
export const createParty = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  partyOptions: PartyOptions
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    console.log("Creating party with options:", partyOptions);
    
    const partyFactory = new ethers.Contract(
      PARTY_PROTOCOL.FACTORY_ADDRESS,
      PARTY_FACTORY_ABI,
      signer
    );
    
    // Set up proposal engine options
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
      allowPublicProposals: partyOptions.allowPublicProposals,
      allowUriChanges: true,
      allowCustomProposals: true
    };
    
    // Create the party transaction
    const tx = await partyFactory.createParty({
      authority: ethers.constants.AddressZero, // No external authority
      name: partyOptions.name,
      hosts: partyOptions.hosts,
      votingDuration: partyOptions.votingDuration,
      executionDelay: partyOptions.executionDelay,
      passThresholdBps: partyOptions.passThresholdBps,
      proposers: partyOptions.proposers || [],
      proposalConfig
    });
    
    console.log("Party creation transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Party creation receipt:", receipt);
    
    // Extract party address from event logs
    const partyAddress = "0x..."; // Need to parse from logs
    
    return partyAddress;
    
  } catch (error) {
    console.error("Error creating party:", error);
    throw error;
  }
};

// Create an ETH Crowdfund for a party
export const createEthCrowdfund = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  partyAddress: string,
  crowdfundOptions: CrowdfundOptions,
  metadata: ProposalMetadata
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    
    console.log("Creating ETH crowdfund with options:", crowdfundOptions);
    
    // Upload metadata to IPFS
    const ipfsHash = await uploadToIPFS(metadata);
    console.log("Metadata uploaded to IPFS:", ipfsHash);
    
    const ethCrowdfundFactory = new ethers.Contract(
      PARTY_PROTOCOL.ETH_CROWDFUND_ADDRESS,
      ETH_CROWDFUND_ABI,
      signer
    );
    
    // Create the ETH crowdfund
    const tx = await ethCrowdfundFactory.initialize(
      PARTY_PROTOCOL.FACTORY_ADDRESS, // PartyDAO address
      partyAddress, // Token provider (the party)
      ethers.constants.AddressZero, // No split recipient
      0 // No split percentage
    );
    
    console.log("ETH crowdfund creation transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("ETH crowdfund creation receipt:", receipt);
    
    // Extract crowdfund address from event logs
    const crowdfundAddress = "0x..."; // Need to parse from logs
    
    return crowdfundAddress;
    
  } catch (error) {
    console.error("Error creating ETH crowdfund:", error);
    throw error;
  }
};

// Update Survivor NFT metadata with party data
export const updateSurvivorMetadata = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  survivorTokenId: string,
  partyAddress: string,
  crowdfundAddress: string,
  metadata: ProposalMetadata
) => {
  try {
    // This would typically be handled by a backend service that has permission to update the NFT metadata
    // For now, we'll log what would be updated
    
    console.log("Would update Survivor NFT metadata with:", {
      tokenId: survivorTokenId,
      partyAddress,
      crowdfundAddress,
      metadata
    });
    
    // In a real implementation, this would call a backend API that updates the IPFS metadata
    // and then updates the token URI on the NFT contract
    
    return true;
    
  } catch (error) {
    console.error("Error updating Survivor metadata:", error);
    throw error;
  }
};

// Sentinel contribution to a party
export const sentinelContributeToParty = async (
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  crowdfundAddress: string,
  amount: string,
  delegateAddress?: string,
  memo?: string
): Promise<string> => {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    // If no delegate specified, use self
    const delegate = delegateAddress || signerAddress;
    
    const crowdfundContract = new ethers.Contract(
      crowdfundAddress,
      ETH_CROWDFUND_ABI,
      signer
    );
    
    // Convert amount to wei
    const amountWei = ethers.utils.parseEther(amount);
    
    // Contribute to the crowdfund
    const tx = await crowdfundContract.contribute(
      delegate,
      memo || "",
      "0x", // No gatekeeper data
      { value: amountWei }
    );
    
    console.log("Contribution transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Contribution receipt:", receipt);
    
    return tx.hash;
    
  } catch (error) {
    console.error("Error contributing to party:", error);
    throw error;
  }
};
