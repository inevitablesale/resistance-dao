
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useToast } from "@/hooks/use-toast";
import { 
  getReferrals, 
  getReferralStats, 
  createReferral, 
  processPendingReferralPayments, 
  Referral, 
  ReferralStats 
} from "@/services/referralService";

export const useReferrals = () => {
  const { toast } = useToast();
  const { address, isConnected } = useCustomWallet();
  const queryClient = useQueryClient();

  // Get referrals for the connected wallet
  const {
    data: referralsData,
    isLoading: isLoadingReferrals,
    error: referralsError,
    refetch: refetchReferrals
  } = useQuery({
    queryKey: ["referrals", address],
    queryFn: async () => {
      if (!address) return { referrals: [] };
      return await getReferrals(address);
    },
    enabled: !!address && isConnected
  });

  // Get referral stats for the connected wallet
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ["referralStats", address],
    queryFn: async () => {
      if (!address) return { stats: {
        totalReferrals: 0,
        pendingReferrals: 0,
        completedReferrals: 0,
        earnings: 0,
        pendingPayouts: 0
      } };
      return await getReferralStats(address);
    },
    enabled: !!address && isConnected
  });

  // Mutation for creating a new referral
  const createReferralMutation = useMutation({
    mutationFn: async ({ referredAddress }: { referredAddress: string }) => {
      if (!address) throw new Error("Wallet not connected");
      return await createReferral(address, referredAddress);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Referral Created",
          description: "Your referral has been successfully recorded.",
        });
        queryClient.invalidateQueries({ queryKey: ["referrals", address] });
        queryClient.invalidateQueries({ queryKey: ["referralStats", address] });
      } else {
        toast({
          title: "Referral Failed",
          description: data.error || "Failed to create referral",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred while creating the referral",
        variant: "destructive",
      });
    }
  });

  // Mutation for processing pending payments
  const processPaymentsMutation = useMutation({
    mutationFn: processPendingReferralPayments,
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Payments Processed",
          description: `${data.processed} referral payments have been processed.`,
        });
        queryClient.invalidateQueries({ queryKey: ["referrals", address] });
        queryClient.invalidateQueries({ queryKey: ["referralStats", address] });
      } else {
        toast({
          title: "Processing Failed",
          description: data.error || "Failed to process payments",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred while processing payments",
        variant: "destructive",
      });
    }
  });

  // Generate a referral link using the wallet address
  const referralLink = isConnected && address
    ? `${window.location.origin}/r/${address}`
    : "";

  // Copy the referral link to clipboard
  const copyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      toast({
        title: "Link Copied!",
        description: "Referral link copied to clipboard",
      });
    }
  };

  // Share the referral link
  const shareReferralLink = () => {
    if (referralLink && navigator.share) {
      navigator.share({
        title: "Join the Wasteland Resistance",
        text: "Join me in rebuilding civilization in the wasteland!",
        url: referralLink,
      }).catch(error => {
        console.error("Error sharing:", error);
        copyReferralLink();
      });
    } else {
      copyReferralLink();
    }
  };

  return {
    referrals: referralsData?.referrals || [],
    stats: statsData?.stats || {
      totalReferrals: 0,
      pendingReferrals: 0,
      completedReferrals: 0,
      earnings: 0,
      pendingPayouts: 0
    },
    isLoadingReferrals,
    isLoadingStats,
    referralsError,
    statsError,
    refetchReferrals,
    refetchStats,
    createReferral: createReferralMutation.mutate,
    isCreatingReferral: createReferralMutation.isPending,
    processPayments: processPaymentsMutation.mutate,
    isProcessingPayments: processPaymentsMutation.isPending,
    referralLink,
    copyReferralLink,
    shareReferralLink
  };
};
