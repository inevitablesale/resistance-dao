
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { 
  createBounty,
  recordSuccessfulReferral,
  BountyOptions,
  deployBountyToBlockchain, 
  distributeRewards,
  updateBountyStatus,
  fundBounty
} from "@/services/bountyService";

export const useBountyActions = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { primaryWallet, isConnected, connect } = useWalletConnection();
  
  const handleCreateBounty = async (options: BountyOptions) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a bounty",
        variant: "destructive"
      });
      
      // Prompt to connect wallet
      await connect();
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Call createBounty with wallet parameter
      const bounty = await createBounty(options, primaryWallet);
      
      if (bounty) {
        toast({
          title: "Bounty Created",
          description: `'${bounty.name}' bounty created successfully`
        });
      }
      
      return bounty;
    } catch (error: any) {
      console.error("Error creating bounty:", error);
      toast({
        title: "Bounty Creation Failed",
        description: error.message || "Failed to create bounty",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRecordReferral = async (
    bountyId: string,
    referrerAddress: string,
    referredAddress: string
  ) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to record a referral",
        variant: "destructive"
      });
      return null;
    }
    
    setIsLoading(true);
    
    try {
      const result = await recordSuccessfulReferral(
        bountyId,
        referrerAddress,
        referredAddress,
        primaryWallet
      );
      
      if (result.success) {
        toast({
          title: "Referral Recorded",
          description: "The referral was successfully recorded"
        });
      } else {
        toast({
          title: "Referral Failed",
          description: result.error || "Failed to record referral",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error: any) {
      console.error("Error recording referral:", error);
      toast({
        title: "Referral Failed",
        description: error.message || "Failed to record referral",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deployBounty = async (bountyId: string) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to deploy a bounty",
        variant: "destructive"
      });
      return null;
    }
    
    setIsLoading(true);
    
    try {
      const result = await deployBountyToBlockchain(bountyId, primaryWallet);
      
      toast({
        title: "Bounty Deployed",
        description: "The bounty was successfully deployed to the blockchain"
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
      setIsLoading(false);
    }
  };
  
  const addFunds = async (bountyId: string, amount: number) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to add funds",
        variant: "destructive"
      });
      return null;
    }
    
    setIsLoading(true);
    
    try {
      const result = await fundBounty(bountyId, amount, primaryWallet);
      
      if (result) {
        toast({
          title: "Funding Successful",
          description: `Added ${amount} MATIC to the bounty`
        });
      }
      
      return result;
    } catch (error: any) {
      console.error("Error funding bounty:", error);
      toast({
        title: "Funding Failed",
        description: error.message || "Failed to add funds",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    createBounty: handleCreateBounty,
    recordReferral: handleRecordReferral,
    deployBounty,
    addFunds,
    isLoading
  };
};
