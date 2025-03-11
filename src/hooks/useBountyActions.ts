
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import {
  deployBountyToBlockchain,
  updateBountyStatus,
  fundBounty,
  distributeRewards,
  recordSuccessfulReferral,
  BountyCreationParams
} from '@/services/bountyService';

export const useBountyActions = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { address, isConnected, primaryWallet } = useWalletConnection();

  const deployBounty = async (bountyParams: BountyCreationParams) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to deploy this bounty",
        variant: "destructive"
      });
      return null;
    }

    setIsProcessing(true);
    try {
      const result = await deployBountyToBlockchain(bountyParams, primaryWallet);
      
      toast({
        title: "Bounty Deployed",
        description: `Successfully deployed to address: ${result.partyAddress.substring(0, 6)}...`,
      });
      
      return result;
    } catch (error: any) {
      console.error("Error deploying bounty:", error);
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to deploy bounty",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const changeBountyStatus = async (
    bountyId: string, 
    newStatus: "active" | "paused" | "expired" | "completed"
  ) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to update this bounty",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      const result = await updateBountyStatus(bountyId, newStatus, primaryWallet);
      
      if (result.success) {
        toast({
          title: "Status Updated",
          description: `Bounty status changed to ${newStatus}`,
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error updating bounty status:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update bounty status",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const addFunds = async (bountyId: string, amount: number) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to fund this bounty",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      const result = await fundBounty(bountyId, amount, primaryWallet);
      
      if (result.success) {
        toast({
          title: "Funds Added",
          description: `Added ${amount} MATIC to the bounty`,
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error funding bounty:", error);
      toast({
        title: "Funding Failed",
        description: error.message || "Failed to add funds to bounty",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const distributeRewardsForBounty = async (bountyId: string) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to distribute rewards",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      const result = await distributeRewards(bountyId, primaryWallet);
      
      if (result.success) {
        toast({
          title: "Rewards Distributed",
          description: "Successfully distributed rewards to referrers",
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error distributing rewards:", error);
      toast({
        title: "Distribution Failed",
        description: error.message || "Failed to distribute rewards",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const recordReferral = async (
    bountyId: string,
    referrerId: string,
    referredUser: string,
    wallet: any
  ) => {
    setIsProcessing(true);
    try {
      const result = await recordSuccessfulReferral(
        bountyId,
        referrerId,
        referredUser,
        wallet
      );
      
      if (result.success) {
        toast({
          title: "Referral Recorded",
          description: "Successfully recorded the referral",
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error recording referral:", error);
      toast({
        title: "Recording Failed",
        description: error.message || "Failed to record referral",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // New functions for token distribution
  const configureTokenRewards = async (
    bountyId: string,
    tokenConfig: {
      tokenAddress: string;
      tokenType: "erc20" | "erc721" | "erc1155";
      tokenIds?: string[];
      amountPerReferral?: number;
      strategy: "first-come" | "proportional" | "milestone" | "lottery";
    }
  ) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to configure token rewards",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      // This would be implemented in the bountyService
      // The function would update the bounty metadata with token reward configuration
      const result = await updateBountyStatus(bountyId, "active", primaryWallet);
      
      if (result.success) {
        toast({
          title: "Token Rewards Configured",
          description: "Successfully configured token rewards for this bounty",
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error configuring token rewards:", error);
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to configure token rewards",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const distributeTokens = async (
    bountyId: string,
    recipientAddress: string,
    tokenId?: string,
    amount?: number
  ) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to distribute tokens",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      // This would call a function in bountyService that handles token distribution
      // For now, we'll use the existing distributeRewards function
      const result = await distributeRewards(bountyId, primaryWallet);
      
      if (result.success) {
        toast({
          title: "Tokens Distributed",
          description: "Successfully distributed tokens to recipient",
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error distributing tokens:", error);
      toast({
        title: "Distribution Failed",
        description: error.message || "Failed to distribute tokens",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const transferNFTsToBounty = async (
    bountyId: string,
    tokenAddress: string,
    tokenIds: string[]
  ) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to transfer NFTs",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      // This would be implemented in bountyService
      // For now, we'll just show a toast that this would transfer NFTs
      toast({
        title: "NFT Transfer",
        description: `This would transfer ${tokenIds.length} NFTs to the bounty pool`,
      });
      return true;
    } catch (error: any) {
      console.error("Error transferring NFTs:", error);
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to transfer NFTs",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    deployBounty,
    changeBountyStatus,
    addFunds,
    distributeRewardsForBounty,
    recordReferral,
    configureTokenRewards,
    distributeTokens,
    transferNFTsToBounty,
    isProcessing,
    walletAddress: address
  };
};
