
import { useState, useEffect } from 'react';

// Define our referral types
export interface Referral {
  id: string;
  referrer_address: string;
  referred_address: string;
  referral_date: string;
  nft_purchased: boolean;
  payment_processed: boolean;
}

export interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  earnings: number;
  pendingPayouts: number;
}

// Mock storage using localStorage
const REFERRALS_STORAGE_KEY = 'referrals_data';

// Load referrals from localStorage
export const loadReferrals = (): Referral[] => {
  try {
    const data = localStorage.getItem(REFERRALS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading referrals from localStorage:', error);
    return [];
  }
};

// Save referrals to localStorage
export const saveReferrals = (referrals: Referral[]): void => {
  try {
    localStorage.setItem(REFERRALS_STORAGE_KEY, JSON.stringify(referrals));
  } catch (error) {
    console.error('Error saving referrals to localStorage:', error);
  }
};

// Create a new referral
export const createReferral = async (referrerAddress: string, referredAddress: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get existing referrals
    const referrals = loadReferrals();
    
    // Check if this referral already exists
    const existingReferral = referrals.find(
      ref => ref.referrer_address === referrerAddress && ref.referred_address === referredAddress
    );
    
    if (existingReferral) {
      return { success: false, error: 'This referral already exists' };
    }
    
    // Create new referral
    const newReferral: Referral = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      referrer_address: referrerAddress,
      referred_address: referredAddress,
      referral_date: new Date().toISOString(),
      nft_purchased: false,
      payment_processed: false
    };
    
    // Save referrals
    saveReferrals([...referrals, newReferral]);
    
    return { success: true };
  } catch (error) {
    console.error('Error creating referral:', error);
    return { success: false, error: 'Failed to create referral' };
  }
};

// Get referrals for a specific wallet address
export const getReferrals = async (walletAddress: string): Promise<{ referrals: Referral[] }> => {
  try {
    const referrals = loadReferrals();
    const userReferrals = referrals.filter(ref => ref.referrer_address === walletAddress);
    return { referrals: userReferrals };
  } catch (error) {
    console.error('Error getting referrals:', error);
    return { referrals: [] };
  }
};

// Get referral stats for a specific wallet address
export const getReferralStats = async (walletAddress: string): Promise<{ stats: ReferralStats }> => {
  try {
    const referrals = loadReferrals();
    const userReferrals = referrals.filter(ref => ref.referrer_address === walletAddress);
    
    const totalReferrals = userReferrals.length;
    const completedReferrals = userReferrals.filter(ref => ref.nft_purchased).length;
    const pendingReferrals = totalReferrals - completedReferrals;
    
    // Each completed referral earns $25
    const earnings = completedReferrals * 25;
    const pendingPayouts = userReferrals.filter(ref => ref.nft_purchased && !ref.payment_processed).length * 25;
    
    return {
      stats: {
        totalReferrals,
        pendingReferrals,
        completedReferrals,
        earnings,
        pendingPayouts
      }
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return { 
      stats: {
        totalReferrals: 0,
        pendingReferrals: 0,
        completedReferrals: 0,
        earnings: 0,
        pendingPayouts: 0
      }
    };
  }
};

// Process pending referral payments
export const processPendingReferralPayments = async (): Promise<{ success: boolean; processed: number; error?: string }> => {
  try {
    const referrals = loadReferrals();
    let processedCount = 0;
    
    const updatedReferrals = referrals.map(ref => {
      if (ref.nft_purchased && !ref.payment_processed) {
        processedCount++;
        return { ...ref, payment_processed: true };
      }
      return ref;
    });
    
    saveReferrals(updatedReferrals);
    
    return { success: true, processed: processedCount };
  } catch (error) {
    console.error('Error processing payments:', error);
    return { success: false, processed: 0, error: 'Failed to process payments' };
  }
};

// Check if a user owns a Bounty Hunter NFT (mock implementation)
export const checkBountyHunterOwnership = async (walletAddress: string): Promise<boolean> => {
  // For demonstration purposes, we'll consider every address valid
  // In a real implementation, this would check blockchain data
  console.log(`Checking ownership for ${walletAddress}`);
  return true;
};

// Mock implementation for NFT polling
let pollingInterval: number | null = null;

export const initNFTPolling = (): void => {
  if (pollingInterval) {
    window.clearInterval(pollingInterval);
  }
  
  // Poll every 30 seconds to check for NFT purchases
  pollingInterval = window.setInterval(() => {
    console.log('Polling for NFT purchases...');
    // This would normally check for NFT purchases and update referrals
  }, 30000);
  
  console.log('NFT polling initialized');
};

export const stopNFTPolling = (): void => {
  if (pollingInterval) {
    window.clearInterval(pollingInterval);
    pollingInterval = null;
    console.log('NFT polling stopped');
  }
};
