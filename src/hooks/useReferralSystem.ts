
import { useState } from 'react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from '@/hooks/use-toast';
import { supabaseClient } from '@/services/supabaseClient';

export interface ReferralData {
  referrerAddress: string;
  bountyId?: string;
  code?: string;
}

export const useReferralSystem = () => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  
  // Generate a referral link for the current user
  const generateReferralLink = async (bountyId?: string): Promise<string> => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to generate a referral link",
        variant: "destructive"
      });
      return '';
    }
    
    try {
      setIsGenerating(true);
      
      const address = await primaryWallet.address;
      let code = '';
      
      // Generate a unique code for the referral if bountyId is provided
      if (bountyId && supabaseClient) {
        // Check if a code already exists for this wallet and bounty
        const { data: existingCodes } = await supabaseClient
          .from('referral_codes')
          .select('code')
          .eq('referrer_address', address)
          .eq('bounty_id', bountyId)
          .single();
          
        if (existingCodes?.code) {
          code = existingCodes.code;
        } else {
          // Generate a new code
          code = generateUniqueCode();
          
          // Store the code in the database
          await supabaseClient
            .from('referral_codes')
            .insert({
              referrer_address: address,
              bounty_id: bountyId,
              code
            });
        }
        
        return `${window.location.origin}/r/${address}?bounty=${bountyId}&code=${code}`;
      }
      
      // Basic referral link without code
      return `${window.location.origin}/r/${address}`;
    } catch (error) {
      console.error("Error generating referral link:", error);
      toast({
        title: "Error",
        description: "Failed to generate referral link",
        variant: "destructive"
      });
      return '';
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Track a referral visit
  const trackReferralVisit = async (data: ReferralData) => {
    try {
      setIsTracking(true);
      
      // If supabase is available, track the visit
      if (supabaseClient) {
        await supabaseClient
          .from('referral_visits')
          .insert({
            referrer_address: data.referrerAddress,
            bounty_id: data.bountyId,
            code: data.code,
            visitor_ip: 'anonymous', // for privacy
            visitor_user_agent: navigator.userAgent,
            visit_timestamp: new Date().toISOString()
          });
      }
      
      // Store in local storage as fallback
      const visits = JSON.parse(localStorage.getItem('referral_visits') || '[]');
      visits.push({
        referrerAddress: data.referrerAddress,
        bountyId: data.bountyId,
        code: data.code,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('referral_visits', JSON.stringify(visits));
      
      return true;
    } catch (error) {
      console.error("Error tracking referral visit:", error);
      return false;
    } finally {
      setIsTracking(false);
    }
  };
  
  // Verify a referral and record it
  const verifyAndRecordReferral = async (
    referrerAddress: string,
    bountyId: string,
    code?: string
  ) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to complete the referral",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const referredAddress = await primaryWallet.address;
      
      // Don't allow self-referrals
      if (referrerAddress.toLowerCase() === referredAddress.toLowerCase()) {
        toast({
          title: "Invalid Referral",
          description: "You cannot refer yourself",
          variant: "destructive"
        });
        return false;
      }
      
      // Verify the code if provided
      if (code && supabaseClient) {
        const { data: codeData } = await supabaseClient
          .from('referral_codes')
          .select('*')
          .eq('referrer_address', referrerAddress)
          .eq('bounty_id', bountyId)
          .eq('code', code)
          .single();
          
        if (!codeData) {
          toast({
            title: "Invalid Referral Code",
            description: "The referral code is invalid or expired",
            variant: "destructive"
          });
          return false;
        }
      }
      
      // Check if this referral already exists
      if (supabaseClient) {
        const { data: existingReferral } = await supabaseClient
          .from('bounty_referrals')
          .select('*')
          .eq('bounty_id', bountyId)
          .eq('referrer_address', referrerAddress)
          .eq('referred_address', referredAddress)
          .single();
          
        if (existingReferral) {
          toast({
            title: "Referral Already Exists",
            description: "This referral has already been recorded",
          });
          return true;
        }
        
        // Get the bounty to check reward amount
        const { data: bounty } = await supabaseClient
          .from('bounties')
          .select('reward_amount, remaining_budget')
          .eq('id', bountyId)
          .single();
          
        if (!bounty || bounty.remaining_budget < bounty.reward_amount) {
          toast({
            title: "Insufficient Bounty Budget",
            description: "This bounty does not have enough budget remaining",
            variant: "destructive"
          });
          return false;
        }
        
        // Record the referral
        await supabaseClient
          .from('bounty_referrals')
          .insert({
            bounty_id: bountyId,
            referrer_address: referrerAddress,
            referred_address: referredAddress,
            status: 'pending',
            reward_amount: bounty.reward_amount
          });
        
        toast({
          title: "Referral Recorded",
          description: "Your referral has been successfully recorded",
        });
        
        return true;
      }
      
      // Fallback to localStorage
      const referrals = JSON.parse(localStorage.getItem('bounty_referrals') || '[]');
      referrals.push({
        id: `ref-${Date.now()}`,
        bounty_id: bountyId,
        referrer_address: referrerAddress,
        referred_address: referredAddress,
        status: 'pending',
        created_at: new Date().toISOString()
      });
      localStorage.setItem('bounty_referrals', JSON.stringify(referrals));
      
      toast({
        title: "Referral Recorded",
        description: "Your referral has been successfully recorded",
      });
      
      return true;
    } catch (error) {
      console.error("Error verifying referral:", error);
      toast({
        title: "Error",
        description: "Failed to verify and record referral",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Helper to generate a unique code
  const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };
  
  return {
    generateReferralLink,
    trackReferralVisit,
    verifyAndRecordReferral,
    isGenerating,
    isTracking
  };
};
