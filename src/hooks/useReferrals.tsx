
import { useState, useEffect } from 'react';
import { useCustomWallet } from './useCustomWallet';
import { 
  getAllReferrals, 
  createNewReferral, 
  validateReferralCode, 
  claimReferral,
  processReferralReward,
  ReferralMetadata
} from '@/services/referralService';

export const useReferrals = () => {
  const [referrals, setReferrals] = useState<ReferralMetadata[]>([]);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);
  const { address, isConnected } = useCustomWallet();

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!isConnected || !address) {
        setReferrals([]);
        setIsLoadingReferrals(false);
        return;
      }
      
      try {
        setIsLoadingReferrals(true);
        const referralData = await getAllReferrals(address);
        setReferrals(referralData);
      } catch (error) {
        console.error('Error fetching referrals:', error);
      } finally {
        setIsLoadingReferrals(false);
      }
    };
    
    fetchReferrals();
  }, [address, isConnected]);
  
  // Update createReferral to accept only the required parameters
  const createReferral = async (referralType: string, name: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }
    
    try {
      const newReferralId = await createNewReferral(referralType, name);
      // Refresh referrals list
      const referralData = await getAllReferrals(address);
      setReferrals(referralData);
      return newReferralId;
    } catch (error) {
      console.error('Error creating referral:', error);
      throw error;
    }
  };
  
  const validateReferral = async (referralCode: string) => {
    try {
      return await validateReferralCode(referralCode);
    } catch (error) {
      console.error('Error validating referral:', error);
      return false;
    }
  };
  
  const claimReferralCode = async (referralCode: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }
    
    try {
      return await claimReferral(referralCode, address);
    } catch (error) {
      console.error('Error claiming referral:', error);
      return false;
    }
  };
  
  const processReferral = async (jobId: string, jobReward: string, jobTitle: string, referralCode: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }
    
    try {
      return await processReferralReward(jobId, jobReward, jobTitle, referralCode);
    } catch (error) {
      console.error('Error processing referral:', error);
      return false;
    }
  };
  
  return {
    referrals,
    isLoadingReferrals,
    createReferral,
    validateReferral,
    claimReferralCode,
    processReferral,
  };
};
