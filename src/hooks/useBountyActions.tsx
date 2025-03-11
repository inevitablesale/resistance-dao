
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import {
  getBounties,
  createBounty,
  getBounty,
  recordSuccessfulReferral,
  distributeRewards,
  updateBountyStatus,
  fundBounty,
  BountyCreationParams,
  Bounty
} from '@/services/bountyService';

export const useBountyActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { address, primaryWallet } = useCustomWallet();

  const handleCreateBounty = async (params: BountyCreationParams) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a bounty.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const newBounty = await createBounty(params, primaryWallet);
      
      toast({
        title: "Bounty Created",
        description: `Your bounty "${params.name}" has been created successfully.`,
      });
      
      return newBounty;
    } catch (error) {
      console.error("Error creating bounty:", error);
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create bounty",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBounties = async (status?: string) => {
    setIsLoading(true);
    try {
      const bounties = await getBounties(status);
      return bounties;
    } catch (error) {
      console.error("Error fetching bounties:", error);
      toast({
        title: "Fetch Failed",
        description: "Could not load bounties",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordReferral = async (bountyId: string, referrerId: string, referredUser: string) => {
    setIsLoading(true);
    try {
      const result = await recordSuccessfulReferral(bountyId, referrerId, referredUser);
      
      if (result.success) {
        toast({
          title: "Referral Recorded",
          description: "The referral has been successfully recorded.",
        });
      } else {
        toast({
          title: "Recording Failed",
          description: result.error || "Failed to record the referral",
          variant: "destructive",
        });
      }
      
      return result.success;
    } catch (error) {
      console.error("Error recording referral:", error);
      toast({
        title: "Recording Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDistributeRewards = async (bountyId: string) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to distribute rewards",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const result = await distributeRewards(bountyId, primaryWallet);
      
      if (result.success) {
        toast({
          title: "Rewards Distributed",
          description: "The rewards have been distributed successfully.",
        });
        return true;
      } else {
        toast({
          title: "Failed to Distribute Rewards",
          description: result.error || "There was an error distributing rewards",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error distributing rewards:", error);
      toast({
        title: "Error Distributing Rewards",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBountyStatus = async (
    bountyId: string,
    newStatus: "active" | "paused" | "expired" | "completed"
  ) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to update bounty status",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const result = await updateBountyStatus(bountyId, newStatus, primaryWallet);
      
      if (result.success) {
        toast({
          title: "Status Updated",
          description: `Bounty status has been updated to ${newStatus}.`,
        });
        return true;
      } else {
        toast({
          title: "Failed to Update Status",
          description: result.error || "There was an error updating the status",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error updating bounty status:", error);
      toast({
        title: "Error Updating Status",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFundBounty = async (bountyId: string, additionalFunds: number) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to fund a bounty",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const result = await fundBounty(bountyId, additionalFunds, primaryWallet);
      
      if (result.success) {
        toast({
          title: "Bounty Funded",
          description: `Successfully added ${additionalFunds} MATIC to the bounty.`,
        });
        return true;
      } else {
        toast({
          title: "Failed to Fund Bounty",
          description: result.error || "There was an error funding the bounty",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error funding bounty:", error);
      toast({
        title: "Error Funding Bounty",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleCreateBounty,
    fetchBounties,
    handleRecordReferral,
    handleDistributeRewards,
    handleUpdateBountyStatus,
    handleFundBounty,
  };
};
