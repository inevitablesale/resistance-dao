
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "./use-toast";
import {
  getReferrals,
  createJobReferral,
  validateReferralCode,
  claimReferral,
  ReferralMetadata,
  processReferralCreation,
  createNewReferral,
  processReferralClaim,
  generateReferralLink as generateLink
} from "@/services/referralService";
import { useNFTRoles } from "./useNFTRoles";

export const useReferrals = () => {
  const { toast } = useToast();
  const { primaryWallet } = useDynamicContext();
  const { primaryRole } = useNFTRoles();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isCreatingReferral, setIsCreatingReferral] = useState(false);

  // Get wallet address when it changes
  useEffect(() => {
    const getAddress = async () => {
      if (primaryWallet) {
        try {
          const address = await primaryWallet.address;
          setWalletAddress(address);
        } catch (error) {
          console.error("Error getting address:", error);
        }
      } else {
        setWalletAddress(null);
      }
    };

    getAddress();
  }, [primaryWallet]);

  // Fetch user's referrals
  const {
    data: referrals = [],
    isLoading: isLoadingReferrals,
    refetch: refetchReferrals,
  } = useQuery({
    queryKey: ["referrals", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      try {
        return await getReferrals(walletAddress);
      } catch (error) {
        console.error("Error fetching referrals:", error);
        return [];
      }
    },
    enabled: !!walletAddress,
  });

  // Check if user can create referrals
  const canCreateReferral = primaryRole === 'Bounty Hunter';

  // Create a job referral
  const createReferral = async (
    jobId: string,
    jobReward: string
  ) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a referral.",
        variant: "destructive",
      });
      return null;
    }

    try {
      toast({
        title: "Creating Referral",
        description: "Please wait while we create your referral code.",
      });

      const wallet = await primaryWallet.getWalletClient();
      const referralCode = await createJobReferral(wallet, jobId, jobReward);

      if (referralCode) {
        toast({
          title: "Referral Created",
          description: `Your referral code is: ${referralCode}`,
        });

        // Refresh referrals list
        refetchReferrals();

        return referralCode;
      }

      return null;
    } catch (error) {
      console.error("Error creating referral:", error);
      toast({
        title: "Error Creating Referral",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  };

  // Submit a new referral (for the dashboard)
  const submitNewReferral = async (
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
      return false;
    }

    setIsCreatingReferral(true);

    try {
      toast({
        title: "Creating Referral",
        description: "Please wait while we create your referral.",
      });

      const wallet = await primaryWallet.getWalletClient();
      const referral = await createNewReferral(
        wallet,
        type,
        name,
        description,
        rewardPercentage
      );

      if (referral) {
        toast({
          title: "Referral Created",
          description: `Your referral has been created successfully.`,
        });

        // Refresh referrals list
        refetchReferrals();
        setIsCreatingReferral(false);
        return true;
      }

      setIsCreatingReferral(false);
      return false;
    } catch (error) {
      console.error("Error creating referral:", error);
      toast({
        title: "Error Creating Referral",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setIsCreatingReferral(false);
      return false;
    }
  };

  // Validate a referral code
  const validateReferral = async (referralCode: string) => {
    try {
      return await validateReferralCode(referralCode);
    } catch (error) {
      console.error("Error validating referral:", error);
      return false;
    }
  };

  // Claim a referral
  const claimReferralCode = async (referralCode: string) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to claim this referral.",
        variant: "destructive",
      });
      return false;
    }

    try {
      toast({
        title: "Claiming Referral",
        description: "Please wait while we process your referral claim.",
      });

      const wallet = await primaryWallet.getWalletClient();
      const success = await claimReferral(wallet, referralCode);

      if (success) {
        toast({
          title: "Referral Claimed",
          description: "You have successfully claimed this referral.",
        });

        return true;
      }

      toast({
        title: "Referral Claim Failed",
        description: "Unable to claim this referral code.",
        variant: "destructive",
      });

      return false;
    } catch (error) {
      console.error("Error claiming referral:", error);
      toast({
        title: "Error Claiming Referral",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
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
        description: "Please connect your wallet to claim this reward.",
        variant: "destructive",
      });
      return false;
    }

    try {
      toast({
        title: "Claiming Reward",
        description: "Please wait while we process your reward claim.",
      });

      const wallet = await primaryWallet.getWalletClient();
      const success = await processReferralClaim(wallet, referralId);

      if (success) {
        toast({
          title: "Reward Claimed",
          description: "You have successfully claimed this reward.",
        });
        
        refetchReferrals();
        return true;
      }

      toast({
        title: "Reward Claim Failed",
        description: "Unable to claim this reward. It may not be ready yet.",
        variant: "destructive",
      });

      return false;
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast({
        title: "Error Claiming Reward",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Create a referral for a job with detailed information
  const processReferral = async (
    jobId: string,
    jobReward: string,
    jobTitle: string,
    referralPercentage: number = 0.1 // Default 10%
  ) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a referral.",
        variant: "destructive",
      });
      return null;
    }

    try {
      toast({
        title: "Creating Referral",
        description: "Please wait while we create your referral code.",
      });

      const wallet = await primaryWallet.getWalletClient();
      const referralCode = await processReferralCreation(
        wallet, 
        jobId, 
        jobReward, 
        jobTitle, 
        referralPercentage
      );

      if (referralCode) {
        toast({
          title: "Referral Created",
          description: `Your referral code is: ${referralCode}`,
        });

        // Refresh referrals list
        refetchReferrals();

        return referralCode;
      }

      return null;
    } catch (error) {
      console.error("Error creating referral:", error);
      toast({
        title: "Error Creating Referral",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  };

  // Generate a referral link
  const generateReferralLink = (referralId: string) => {
    return generateLink(referralId);
  };

  return {
    referrals,
    isLoadingReferrals,
    isCreatingReferral,
    canCreateReferral,
    userRole: primaryRole,
    createReferral,
    validateReferral,
    claimReferralCode,
    processReferral,
    submitNewReferral,
    claimReward,
    generateReferralLink,
    refetchReferrals,
  };
};
