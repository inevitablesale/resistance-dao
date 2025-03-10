
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import {
  getBounties,
  createBounty,
  recordSuccessfulReferral,
  BountyOptions,
  BountyCreationParams,
  distributeRewards,
  updateBountyStatus,
  fundBounty,
  Bounty
} from '@/services/bountyService';

export const useBountyActions = () => {
  const { toast } = useToast();
  const { address, primaryWallet, isConnected } = useWalletConnection();
  const [isLoading, setIsLoading] = useState(false);

  const fetchBounties = async (options?: BountyOptions) => {
    setIsLoading(true);
    try {
      // We pass status instead of options here since getBounties accepts a status string
      const status = options?.includeExpired ? undefined : 'active';
      const bounties = await getBounties(status);
      return bounties;
    } catch (error) {
      console.error('Error fetching bounties:', error);
      toast({
        title: 'Failed to fetch bounties',
        description: 'There was an error loading bounties. Please try again.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBounty = async (bountyParams: BountyCreationParams) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet to create a bounty',
        variant: 'destructive',
      });
      return null;
    }

    setIsLoading(true);
    try {
      const newBounty = await createBounty(bountyParams, primaryWallet);
      
      toast({
        title: 'Bounty Created!',
        description: `${newBounty.name} has been created successfully.`,
      });
      
      return newBounty;
    } catch (error) {
      console.error('Error creating bounty:', error);
      toast({
        title: 'Failed to Create Bounty',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      return null;
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
          title: 'Referral Recorded',
          description: 'The referral has been recorded successfully.',
        });
        return true;
      } else {
        toast({
          title: 'Failed to Record Referral',
          description: result.error || 'There was an error recording the referral',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error recording referral:', error);
      toast({
        title: 'Error Recording Referral',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDistributeRewards = async (bountyId: string) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet to distribute rewards',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    try {
      const result = await distributeRewards(bountyId, primaryWallet);
      
      if (result.success) {
        toast({
          title: 'Rewards Distributed',
          description: 'The rewards have been distributed successfully.',
        });
        return true;
      } else {
        toast({
          title: 'Failed to Distribute Rewards',
          description: result.error || 'There was an error distributing rewards',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error distributing rewards:', error);
      toast({
        title: 'Error Distributing Rewards',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
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
    if (!isConnected || !primaryWallet) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet to update bounty status',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    try {
      const result = await updateBountyStatus(bountyId, newStatus, primaryWallet);
      
      if (result.success) {
        toast({
          title: 'Status Updated',
          description: `Bounty status has been updated to ${newStatus}.`,
        });
        return true;
      } else {
        toast({
          title: 'Failed to Update Status',
          description: result.error || 'There was an error updating the status',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error updating bounty status:', error);
      toast({
        title: 'Error Updating Status',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFundBounty = async (bountyId: string, additionalFunds: number) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet to fund a bounty',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    try {
      const result = await fundBounty(bountyId, additionalFunds, primaryWallet);
      
      if (result.success) {
        toast({
          title: 'Bounty Funded',
          description: `Successfully added ${additionalFunds} MATIC to the bounty.`,
        });
        return true;
      } else {
        toast({
          title: 'Failed to Fund Bounty',
          description: result.error || 'There was an error funding the bounty',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error funding bounty:', error);
      toast({
        title: 'Error Funding Bounty',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchBounties,
    createBounty: handleCreateBounty,
    recordReferral: handleRecordReferral,
    distributeRewards: handleDistributeRewards,
    updateBountyStatus: handleUpdateBountyStatus,
    fundBounty: handleFundBounty,
  };
};
