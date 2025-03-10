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

  const referrals = userReferrals;
  const isCreatingReferral = false;
  const canCreateReferral = userRole === 'Bounty Hunter';
  
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
  
  const submitNewReferral = async (
    referralId: string, 
    referredAddress: string,
    metadata: any = {}
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
      
      const success = await submitReferral(
        primaryWallet as unknown as ethers.Wallet,
        referralId,
        "",
        referredAddress
      );
      
      if (success) {
        toast({
          title: "Referral Submitted",
          description: "Your referral has been submitted successfully.",
        });
        
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
    referrals,
    isCreatingReferral,
    canCreateReferral
  };
};
