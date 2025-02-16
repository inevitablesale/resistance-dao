import { ethers } from "ethers";
import { toast } from "@/hooks/use-toast";
import type { WalletClient } from "viem";

// Constants for the contract
const GOVERNOR_CONTRACT_ADDRESS = "0x123..."; // Replace with actual address
const GOVERNOR_ABI = [/* Add ABI here */];

export const checkNFTOwnership = async (walletClient: WalletClient, address: string): Promise<boolean> => {
  try {
    // Implementation
    return false;
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return false;
  }
};

export const createProposal = async (
  walletClient: WalletClient,
  title: string,
  description: string,
  options: string[]
) => {
  try {
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(GOVERNOR_CONTRACT_ADDRESS, GOVERNOR_ABI, signer);

    const tx = await contract.createProposal(title, description, options);
    await tx.wait();

    toast({
      title: "Success",
      description: "Proposal created successfully",
    });

    return tx.hash;
  } catch (error) {
    console.error("Error creating proposal:", error);
    toast({
      title: "Error",
      description: "Failed to create proposal",
      variant: "destructive",
    });
    throw error;
  }
};

export const castVote = async (
  walletClient: WalletClient,
  proposalId: string,
  optionIndex: number
) => {
  try {
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(GOVERNOR_CONTRACT_ADDRESS, GOVERNOR_ABI, signer);

    const tx = await contract.castVote(proposalId, optionIndex);
    await tx.wait();

    toast({
      title: "Success",
      description: "Vote cast successfully",
    });

    return tx.hash;
  } catch (error) {
    console.error("Error casting vote:", error);
    toast({
      title: "Error",
      description: "Failed to cast vote",
      variant: "destructive",
    });
    throw error;
  }
};

export const getProposals = async (walletClient: WalletClient) => {
  try {
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const contract = new ethers.Contract(GOVERNOR_CONTRACT_ADDRESS, GOVERNOR_ABI, provider);

    const proposals = await contract.getProposals();
    return proposals;
  } catch (error) {
    console.error("Error fetching proposals:", error);
    toast({
      title: "Error",
      description: "Failed to fetch proposals",
      variant: "destructive",
    });
    throw error;
  }
};

export const getProposalDetails = async (walletClient: WalletClient, proposalId: string) => {
  try {
    const provider = new ethers.providers.Web3Provider(walletClient as any);
    const contract = new ethers.Contract(GOVERNOR_CONTRACT_ADDRESS, GOVERNOR_ABI, provider);

    const details = await contract.getProposalDetails(proposalId);
    return details;
  } catch (error) {
    console.error("Error fetching proposal details:", error);
    toast({
      title: "Error",
      description: "Failed to fetch proposal details",
      variant: "destructive",
    });
    throw error;
  }
};
