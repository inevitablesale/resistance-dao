
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers"; 
import { useToast } from "./use-toast";
import { NFTClass, getPrimaryRole } from "@/services/alchemyService";
import { 
  createReferralPool, 
  submitReferral, 
  claimReferralReward,
  getReferrals,
  getReferralStatus,
  ReferralStatus,
  Referral
} from "@/services/referralService";
import { ReferralMetadata } from "@/utils/settlementConversion";

export const useReferrals = () => {
  const { toast } = useToast();
  const { primaryWallet } = useDynamicContext();
  const [userRole, setUserRole] = useState<NFTClass>('Unknown');
  
  // Check user role on mount
  useEffect(() => {
    const checkRole = async () => {
      if (primaryWallet) {
        try {
          const address = await primaryWallet.address;
          const role = await getPrimaryRole(address);
          setUserRole(role);
        } catch (error) {
          console.error("Error checking user role:", error);
        }
      }
    };
    
    checkRole();
  }, [primaryWallet]);
  
  // Fetch referrals the user has created
  const { data: userReferrals = [], isLoading: isLoadingReferrals, refetch: refetchReferrals } = useQuery({
    queryKey: ['userReferrals', primaryWallet?.address],
    queryFn: async () => {
      if (!primaryWallet) return [];
      
      try {
        const address = await primaryWallet.address;
        return await getReferrals(address);
      } catch (error) {
        console.error("Error fetching referrals:", error);
        return [];
      }
    },
    enabled: !!primaryWallet,
  });

  // For compatibility with ReferralDashboard component
  const referrals = userReferrals;
  const isCreatingReferral = false;
  const canCreateReferral = userRole === 'Bounty Hunter';
  
  // Create a new referral pool
  const createReferral = async (
    type: string,
    name: string,
    description: string,
    rewardPercentage: number
  ) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a referral.",
        variant: "destructive",
      });
      return null;
    }
    
    if (userRole !== 'Bounty Hunter') {
      toast({
        title: "Access Denied",
        description: "Only Bounty Hunters can create referrals.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      toast({
        title: "Creating Referral",
        description: "Please approve the transaction to create your referral pool.",
      });
      
      const referrerAddress = await primaryWallet.address;
      
      // Create referral metadata
      const referralMetadata: ReferralMetadata = {
        title: name, // Use name as title to satisfy ProposalMetadata requirements
        name,
        description,
        type,
        referrer: referrerAddress,
        rewardPercentage,
        createdAt: Math.floor(Date.now() / 1000),
        // Required ProposalMetadata fields
        votingDuration: 7 * 24 * 60 * 60, // 7 days default
        linkedInURL: "https://linkedin.com/in/resistance", // Default placeholder
      };
      
      const referralId = await createReferralPool(primaryWallet, referralMetadata);
      
      if (referralId) {
        toast({
          title: "Referral Created",
          description: "Your referral pool has been created successfully.",
        });
        
        // Refresh referrals list
        refetchReferrals();
        
        return referralId;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating referral:", error);
      toast({
        title: "Error Creating Referral",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  };
  
  // Submit a referral
  const submitNewReferral = async (referralId: string, referredAddress: string) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to submit a referral.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      toast({
        title: "Submitting Referral",
        description: "Please approve the transaction to submit your referral.",
      });
      
      const success = await submitReferral(primaryWallet, referralId, referredAddress);
      
      if (success) {
        toast({
          title: "Referral Submitted",
          description: "Your referral has been submitted successfully.",
        });
        
        // Refresh referrals list
        refetchReferrals();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error submitting referral:", error);
      toast({
        title: "Error Submitting Referral",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Claim a referral reward
  const claimReward = async (referralId: string) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to claim your reward.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      toast({
        title: "Claiming Reward",
        description: "Please approve the transaction to claim your referral reward.",
      });
      
      const success = await claimReferralReward(primaryWallet, referralId);
      
      if (success) {
        toast({
          title: "Reward Claimed",
          description: "Your referral reward has been claimed successfully.",
        });
        
        // Refresh referrals list
        refetchReferrals();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast({
        title: "Error Claiming Reward",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Generate referral link
  const generateReferralLink = (referralId: string) => {
    return `${window.location.origin}/referrals/${referralId}`;
  };
  
  return {
    userRole,
    userReferrals,
    isLoadingReferrals,
    createReferral,
    submitNewReferral,
    claimReward,
    generateReferralLink,
    refetchReferrals,
    // Added for compatibility with ReferralDashboard
    referrals,
    isCreatingReferral,
    canCreateReferral
  };
};
