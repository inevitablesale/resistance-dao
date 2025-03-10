
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  checkBountyHunterOwnership, 
  startNFTPurchasePolling, 
  NFTClass 
} from "@/services/alchemyNFTService";

export interface Referral {
  id: string;
  referrer_address: string;
  referred_address: string;
  referral_date: string;
  nft_purchased: boolean;
  purchase_date: string | null;
  payment_processed: boolean;
  payment_date: string | null;
  payment_amount: number | null;
  payment_tx_hash: string | null;
}

export interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  earnings: number;
  pendingPayouts: number;
}

// Singleton for NFT purchase polling
let nftPollingService: {
  stop: () => void;
  addTrackedAddress: (referredAddress: string, referrerAddress: string) => void;
  removeTrackedAddress: (referredAddress: string) => void;
} | null = null;

// Initialize NFT polling service
export const initNFTPolling = () => {
  if (nftPollingService) return nftPollingService;
  
  nftPollingService = startNFTPurchasePolling(async (referredAddress, referrerAddress, tokenId, nftClass) => {
    console.log(`NFT Purchase detected: ${referredAddress} bought a ${nftClass} (Token ID: ${tokenId})`);
    await markNftPurchased(referredAddress, tokenId);
  });
  
  return nftPollingService;
};

// Stop NFT polling service
export const stopNFTPolling = () => {
  if (nftPollingService) {
    nftPollingService.stop();
    nftPollingService = null;
  }
};

// Create a new referral between referrer and referred addresses
export const createReferral = async (
  referrerAddress: string,
  referredAddress: string
): Promise<{ success: boolean; error?: string; referralId?: string }> => {
  try {
    // First, verify the referrer owns a Bounty Hunter NFT
    const isVerifiedReferrer = await checkBountyHunterOwnership(referrerAddress);
    
    if (!isVerifiedReferrer) {
      return { 
        success: false, 
        error: "Referrer does not own a Bounty Hunter NFT" 
      };
    }
    
    // Prevent self-referrals
    if (referrerAddress.toLowerCase() === referredAddress.toLowerCase()) {
      return { success: false, error: "Cannot refer yourself" };
    }

    // Check if this referral already exists
    const { data: existingReferrals, error: checkError } = await supabase
      .from("referrals")
      .select("id")
      .eq("referrer_address", referrerAddress)
      .eq("referred_address", referredAddress);

    if (checkError) throw checkError;

    if (existingReferrals && existingReferrals.length > 0) {
      return { 
        success: false, 
        error: "This referral already exists",
        referralId: existingReferrals[0].id
      };
    }

    // Create the referral
    const { data, error } = await supabase
      .from("referrals")
      .insert([
        {
          referrer_address: referrerAddress,
          referred_address: referredAddress,
          referral_date: new Date().toISOString(),
          nft_purchased: false,
          payment_processed: false,
        },
      ])
      .select();

    if (error) throw error;
    
    // Start tracking this referred address for NFT purchases
    if (nftPollingService) {
      nftPollingService.addTrackedAddress(referredAddress, referrerAddress);
    } else {
      const service = initNFTPolling();
      service.addTrackedAddress(referredAddress, referrerAddress);
    }

    return { 
      success: true, 
      referralId: data?.[0]?.id
    };
  } catch (error: any) {
    console.error("Error creating referral:", error);
    return { success: false, error: error.message || "Failed to create referral" };
  }
};

// Get all referrals for a given referrer address
export const getReferrals = async (
  referrerAddress: string
): Promise<{ referrals: Referral[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from("referrals")
      .select("*")
      .eq("referrer_address", referrerAddress)
      .order("referral_date", { ascending: false });

    if (error) throw error;
    
    // Make sure we're tracking all referred addresses
    if (data && nftPollingService) {
      data.forEach(referral => {
        if (!referral.nft_purchased) {
          nftPollingService!.addTrackedAddress(referral.referred_address, referral.referrer_address);
        }
      });
    }

    return { referrals: data || [] };
  } catch (error: any) {
    console.error("Error fetching referrals:", error);
    return { referrals: [], error: error.message || "Failed to fetch referrals" };
  }
};

// Get referral stats for a given referrer address
export const getReferralStats = async (
  referrerAddress: string
): Promise<{ stats: ReferralStats; error?: string }> => {
  try {
    const { referrals, error } = await getReferrals(referrerAddress);
    
    if (error) throw new Error(error);

    const pending = referrals.filter(r => !r.nft_purchased).length;
    const completed = referrals.filter(r => r.nft_purchased).length;
    const totalEarnings = referrals
      .filter(r => r.nft_purchased && r.payment_processed)
      .reduce((sum, r) => sum + (r.payment_amount || 0), 0);
    const pendingPayouts = referrals
      .filter(r => r.nft_purchased && !r.payment_processed)
      .length * 25; // $25 per successful referral

    const stats: ReferralStats = {
      totalReferrals: referrals.length,
      pendingReferrals: pending,
      completedReferrals: completed,
      earnings: totalEarnings,
      pendingPayouts: pendingPayouts
    };

    return { stats };
  } catch (error: any) {
    console.error("Error calculating referral stats:", error);
    return { 
      stats: {
        totalReferrals: 0,
        pendingReferrals: 0,
        completedReferrals: 0,
        earnings: 0,
        pendingPayouts: 0
      }, 
      error: error.message || "Failed to calculate referral stats" 
    };
  }
};

// Mark a referral as having purchased an NFT
export const markNftPurchased = async (
  referredAddress: string,
  nftTokenId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if this address is in our referrals
    const { data, error } = await supabase
      .from("referrals")
      .select("*")
      .eq("referred_address", referredAddress)
      .eq("nft_purchased", false)
      .limit(1);
      
    if (error) throw error;
    
    // If no matching referral found, just return
    if (!data || data.length === 0) {
      return { success: true };
    }
    
    // Update the referral to mark as purchased
    const { error: updateError } = await supabase
      .from("referrals")
      .update({
        nft_purchased: true,
        purchase_date: new Date().toISOString()
      })
      .eq("id", data[0].id);

    if (updateError) throw updateError;
    
    // Stop tracking this address since they've made a purchase
    if (nftPollingService) {
      nftPollingService.removeTrackedAddress(referredAddress);
    }

    // Trigger the edge function to process payments
    await processPendingReferralPayments();

    return { success: true };
  } catch (error: any) {
    console.error("Error marking NFT purchased:", error);
    return { success: false, error: error.message || "Failed to update referral" };
  }
};

// Process pending referral payments
export const processPendingReferralPayments = async (): Promise<{ success: boolean; processed?: number; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke("process-referral-payments");
    
    if (error) throw error;
    
    return { 
      success: true, 
      processed: data.processed || 0 
    };
  } catch (error: any) {
    console.error("Error processing referral payments:", error);
    return { success: false, error: error.message || "Failed to process payments" };
  }
};

// Check if a user was referred (useful for the NFT purchase page)
export const checkIfReferred = async (
  referredAddress: string
): Promise<{ wasReferred: boolean; referrerAddress?: string; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from("referrals")
      .select("referrer_address")
      .eq("referred_address", referredAddress)
      .limit(1);

    if (error) throw error;

    const wasReferred = data && data.length > 0;
    return { 
      wasReferred, 
      referrerAddress: wasReferred ? data[0].referrer_address : undefined 
    };
  } catch (error: any) {
    console.error("Error checking if referred:", error);
    return { wasReferred: false, error: error.message || "Failed to check referral status" };
  }
};
