
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";

// Referral storage interface
interface ReferralData {
  address: string;
  timestamp: number;
  expiresAt: number;
}

// 60 days in milliseconds
const REFERRAL_EXPIRY_DAYS = 60;
const REFERRAL_EXPIRY_MS = REFERRAL_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export const useCustomWallet = () => {
  const { primaryWallet, user } = useDynamicContext();
  
  // Only consider connected if we have both wallet and user data
  const isFullyConnected = !!primaryWallet?.address && !!user;
  
  // Effect to handle logging of user data for debugging
  useEffect(() => {
    if (user) {
      // Basic debug logging of user object
      console.log("[useCustomWallet] User connected:", {
        hasWallet: !!primaryWallet?.address,
        hasUser: !!user,
        walletAddress: primaryWallet?.address
      });
    }
  }, [user, primaryWallet]);

  // Get stored referrer from localStorage if available
  const getReferrer = (): string | null => {
    const referralDataStr = localStorage.getItem("referrer_data");
    
    // No referral data stored
    if (!referralDataStr) {
      // Check for legacy format (just the address)
      const legacyReferrer = localStorage.getItem("referrer_address");
      if (legacyReferrer) {
        // Migrate legacy format to new format
        const now = Date.now();
        const referralData: ReferralData = {
          address: legacyReferrer,
          timestamp: now,
          expiresAt: now + REFERRAL_EXPIRY_MS
        };
        localStorage.setItem("referrer_data", JSON.stringify(referralData));
        localStorage.removeItem("referrer_address");
        return legacyReferrer;
      }
      return null;
    }
    
    try {
      const referralData: ReferralData = JSON.parse(referralDataStr);
      
      // Check if referral has expired
      if (Date.now() > referralData.expiresAt) {
        console.log("[useCustomWallet] Referral expired, removing:", referralData);
        localStorage.removeItem("referrer_data");
        return null;
      }
      
      return referralData.address;
    } catch (error) {
      console.error("[useCustomWallet] Error parsing referral data:", error);
      return null;
    }
  };

  // Set referrer with proper expiration
  const setReferrer = (address: string): void => {
    if (!address) return;
    
    const now = Date.now();
    const referralData: ReferralData = {
      address,
      timestamp: now,
      expiresAt: now + REFERRAL_EXPIRY_MS
    };
    
    localStorage.setItem("referrer_data", JSON.stringify(referralData));
    console.log("[useCustomWallet] Referrer set:", referralData);
  };

  // Get referral time remaining in days
  const getReferralTimeRemaining = (): number | null => {
    const referralDataStr = localStorage.getItem("referrer_data");
    if (!referralDataStr) return null;
    
    try {
      const referralData: ReferralData = JSON.parse(referralDataStr);
      const remainingMs = Math.max(0, referralData.expiresAt - Date.now());
      return Math.ceil(remainingMs / (24 * 60 * 60 * 1000)); // Convert to days
    } catch (error) {
      return null;
    }
  };

  return {
    isConnected: isFullyConnected,
    isPendingUser: !!primaryWallet?.address && !user,
    address: primaryWallet?.address,
    user,
    isSmartWallet: primaryWallet?.connector?.name?.toLowerCase().includes('zerodev'),
    getReferrer,
    setReferrer,
    getReferralTimeRemaining
  };
};
