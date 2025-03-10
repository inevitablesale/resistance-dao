import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers"; 
import { useToast } from "./use-toast";
import { NFTClass, getPrimaryRole } from "@/services/alchemyService";
import { 
  createReferral, 
  submitReferral, 
  claimReferralReward,
  getReferrals,
  Referral,
  ReferralStatus
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
  
  // Create a new referral
  const createNewReferral = async (
    type: string,
    name: string,
    description: string,
    rewardPercentage: number,
    extraData: any = {}
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
      
      // Create referral with all required arguments - removing the extraData as the 6th argument
      const referralId = await createReferral(
        primaryWallet as unknown as ethers.Wallet, 
        type, 
        name, 
        description, 
        rewardPercentage
      );
      
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
  const submitNewReferral = async (
    referralId: string, 
    referredAddress: string,
    metadata: any = {},
    referrerTier: string = "Initiate"
  ) => {
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
      
      // Submit referral with the correct number of arguments
      const success = await submitReferral(
        primaryWallet as unknown as ethers.Wallet,
        referralId,
        referredAddress,
        metadata
      );
      
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
      
      const success = await claimReferralReward(
        primaryWallet as unknown as ethers.Wallet,
        referralId
      );
      
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
    createReferral: createNewReferral,
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
