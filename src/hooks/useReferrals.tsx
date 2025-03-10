
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useToast } from '@/hooks/use-toast';
import { useNFTRoles } from '@/hooks/useNFTRoles';
import { 
  createReferral, 
  registerReferralPurchase, 
  claimReferralReward,
  ReferralInfo,
  ReferralReward
} from '@/services/referralService';

export const useReferrals = () => {
  const { primaryWallet } = useDynamicContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { primaryRole, isLoading: isLoadingRole } = useNFTRoles();
  const [isCreatingReferral, setIsCreatingReferral] = useState(false);
  
  // Mock data for development - this would be replaced with real data in production
  const mockReferrals: ReferralInfo[] = [
    {
      referralId: 'ref-123',
      referrer: primaryWallet?.address || '',
      referralCode: 'BH-1234ABCD-XYZ',
      nftType: 'Bounty Hunter',
      createdAt: Math.floor(Date.now() / 1000) - 86400 * 3,
      partyAddress: '0x1234567890123456789012345678901234567890',
      rewardsClaimed: 1,
      totalEarned: 2,
      active: true
    }
  ];
  
  const mockRewards: ReferralReward[] = [
    {
      referralId: 'ref-123',
      purchaser: '0x2345678901234567890123456789012345678901',
      amount: '0.5',
      timestamp: Math.floor(Date.now() / 1000) - 86400,
      claimed: true,
      transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    },
    {
      referralId: 'ref-123',
      purchaser: '0x3456789012345678901234567890123456789012',
      amount: '0.75',
      timestamp: Math.floor(Date.now() / 1000) - 43200,
      claimed: false,
      transactionHash: '0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef'
    }
  ];
  
  // Query to get all referrals for the current wallet
  const { 
    data: referrals = mockReferrals,
    isLoading: isLoadingReferrals,
    refetch: refetchReferrals
  } = useQuery({
    queryKey: ['referrals', primaryWallet?.address],
    queryFn: async () => {
      // In production, this would fetch from blockchain or indexed events
      return mockReferrals;
    },
    enabled: !!primaryWallet?.address
  });
  
  // Query to get rewards for a specific referral
  const useReferralRewards = (referralId: string) => {
    return useQuery({
      queryKey: ['referral-rewards', referralId],
      queryFn: async () => {
        // In production, this would fetch from blockchain or indexed events
        return mockRewards.filter(reward => reward.referralId === referralId);
      },
      enabled: !!referralId
    });
  };
  
  // Mutation to create a new referral
  const createReferralMutation = useMutation({
    mutationFn: async () => {
      if (!primaryWallet) throw new Error("Wallet not connected");
      if (!primaryRole) throw new Error("Role not determined");
      
      setIsCreatingReferral(true);
      try {
        return await createReferral(primaryWallet, primaryRole);
      } finally {
        setIsCreatingReferral(false);
      }
    },
    onSuccess: (newReferral) => {
      toast({
        title: "Referral Created!",
        description: `Your referral code is ${newReferral.referralCode}`,
      });
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create referral",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Mutation to register a purchase with a referral
  const registerPurchaseMutation = useMutation({
    mutationFn: async ({ 
      referralCode, 
      partyAddress, 
      amount 
    }: { 
      referralCode: string; 
      partyAddress: string; 
      amount: string;
    }) => {
      if (!primaryWallet) throw new Error("Wallet not connected");
      
      return await registerReferralPurchase(
        primaryWallet,
        referralCode,
        partyAddress,
        amount
      );
    },
    onSuccess: (reward) => {
      toast({
        title: "Purchase Registered!",
        description: `Referral reward of ${ethers.utils.formatEther(reward.amount)} ETH created`,
      });
      queryClient.invalidateQueries({ queryKey: ['referral-rewards'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to register purchase",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Mutation to claim a referral reward
  const claimRewardMutation = useMutation({
    mutationFn: async ({ 
      partyAddress, 
      proposalId 
    }: { 
      partyAddress: string; 
      proposalId: string;
    }) => {
      if (!primaryWallet) throw new Error("Wallet not connected");
      
      return await claimReferralReward(
        primaryWallet,
        partyAddress,
        proposalId
      );
    },
    onSuccess: (txHash) => {
      toast({
        title: "Reward Claimed!",
        description: `Transaction: ${txHash.substring(0, 10)}...`,
      });
      queryClient.invalidateQueries({ queryKey: ['referral-rewards'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to claim reward",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Generate a shareable referral link
  const generateReferralLink = useCallback((referralCode: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/referral/${referralCode}`;
  }, []);
  
  return {
    referrals,
    isLoadingReferrals,
    isCreatingReferral,
    refetchReferrals,
    useReferralRewards,
    createReferral: createReferralMutation.mutate,
    registerPurchase: registerPurchaseMutation.mutate,
    claimReward: claimRewardMutation.mutate,
    generateReferralLink,
    canCreateReferral: primaryRole === 'Bounty Hunter',
    isLoadingRole
  };
};
