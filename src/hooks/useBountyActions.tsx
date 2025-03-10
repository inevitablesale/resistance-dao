
import { useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { 
  createBounty, 
  getBounties, 
  getBounty, 
  updateBountyStatus,
  recordSuccessfulReferral,
  deployBountyToBlockchain,
  Bounty,
  BountyOptions
} from "@/services/bountyService";

export const useBountyActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { primaryWallet } = useDynamicContext();
  const { getProvider } = useWalletProvider();
  const { toast } = useToast();
  
  /**
   * Create a new bounty
   */
  const createNewBounty = async (options: BountyOptions): Promise<Bounty | null> => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a bounty",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      setIsLoading(true);
      toast({
        title: "Creating Bounty...",
        description: "Please approve the transaction in your wallet",
      });
      
      const bounty = await createBounty(options);
      
      if (bounty) {
        toast({
          title: "Bounty Created",
          description: "Your bounty program has been created successfully",
        });
        return bounty;
      }
      
      throw new Error("Failed to create bounty");
    } catch (error: any) {
      console.error("Error creating bounty:", error);
      toast({
        title: "Bounty Creation Failed",
        description: error.message || "There was an error creating your bounty",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * List all bounties
   */
  const listBounties = async (status?: string): Promise<Bounty[]> => {
    try {
      setIsLoading(true);
      return await getBounties(status);
    } catch (error) {
      console.error("Error listing bounties:", error);
      toast({
        title: "Error Loading Bounties",
        description: "Failed to load bounty programs",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get a single bounty by ID
   */
  const getBountyDetails = async (bountyId: string): Promise<Bounty | null> => {
    try {
      setIsLoading(true);
      return await getBounty(bountyId);
    } catch (error) {
      console.error("Error getting bounty details:", error);
      toast({
        title: "Error Loading Bounty",
        description: "Failed to load bounty details",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update a bounty's status
   */
  const changeBountyStatus = async (
    bountyId: string, 
    status: "active" | "paused" | "expired" | "completed"
  ): Promise<Bounty | null> => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to update a bounty",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      setIsLoading(true);
      
      const bounty = await updateBountyStatus(bountyId, status);
      
      if (bounty) {
        toast({
          title: "Bounty Updated",
          description: `Bounty status changed to ${status}`,
        });
        return bounty;
      }
      
      throw new Error("Failed to update bounty status");
    } catch (error: any) {
      console.error("Error updating bounty status:", error);
      toast({
        title: "Status Update Failed",
        description: error.message || "There was an error updating the bounty status",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Record a successful referral
   */
  const recordReferralSuccess = async (
    bountyId: string,
    referrerAddress: string,
    referredAddress: string
  ): Promise<Bounty | null> => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to record a referral",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      setIsLoading(true);
      
      const bounty = await recordSuccessfulReferral(bountyId, referrerAddress, referredAddress);
      
      if (bounty) {
        toast({
          title: "Referral Recorded",
          description: "The successful referral has been recorded and the reward will be processed",
        });
        return bounty;
      }
      
      throw new Error("Failed to record successful referral");
    } catch (error: any) {
      console.error("Error recording referral:", error);
      toast({
        title: "Recording Failed",
        description: error.message || "There was an error recording the referral",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Deploy a bounty to the blockchain
   */
  const deployBounty = async (bountyId: string): Promise<any> => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to deploy a bounty",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      setIsLoading(true);
      toast({
        title: "Deploying Bounty...",
        description: "Please approve the transaction in your wallet",
      });
      
      const result = await deployBountyToBlockchain(bountyId, primaryWallet);
      
      if (result) {
        toast({
          title: "Bounty Deployed",
          description: "Your bounty has been successfully deployed to the blockchain",
        });
        return result;
      }
      
      throw new Error("Failed to deploy bounty");
    } catch (error: any) {
      console.error("Error deploying bounty:", error);
      toast({
        title: "Deployment Failed",
        description: error.message || "There was an error deploying the bounty",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    createNewBounty,
    listBounties,
    getBountyDetails,
    changeBountyStatus,
    recordReferralSuccess,
    deployBounty,
    isLoading
  };
};
