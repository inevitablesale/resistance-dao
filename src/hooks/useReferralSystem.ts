
import { useState, useEffect } from 'react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from '@/hooks/use-toast';
import * as supabaseClient from '@/services/supabaseClient';

export type ReferralStatus = 'pending' | 'active' | 'completed' | 'rejected' | 'expired';

export interface Referral {
  id: string;
  bountyId: string;
  referrerAddress: string;
  referredAddress: string;
  referralDate: string;
  status: ReferralStatus;
  rewardAmount?: number;
  completedAt?: string;
  txHash?: string;
}

export function useReferralSystem(bountyId?: string) {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralLink, setReferralLink] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    totalEarnings: 0
  });

  // Generate a referral link based on the connected wallet
  useEffect(() => {
    if (primaryWallet?.address) {
      const baseUrl = window.location.origin;
      const refLink = `${baseUrl}/r/${primaryWallet.address}${bountyId ? `?bounty=${bountyId}` : ''}`;
      setReferralLink(refLink);
    }
  }, [primaryWallet?.address, bountyId]);

  // Fetch referrals for the current user
  const fetchReferrals = async () => {
    if (!primaryWallet?.address) return;
    
    setLoading(true);
    try {
      // Fetch all referrals where the current user is the referrer
      const data = await supabaseClient.getReferrals(bountyId, primaryWallet.address);
      
      if (data) {
        // Transform the data to match our interface
        const formattedReferrals: Referral[] = data.map(ref => ({
          id: ref.id,
          bountyId: ref.bounty_id,
          referrerAddress: ref.referrer_address,
          referredAddress: ref.referred_address,
          referralDate: ref.referral_date,
          status: ref.status as ReferralStatus,
          rewardAmount: ref.reward_amount,
          completedAt: ref.completed_at,
          txHash: ref.tx_hash
        }));
        
        setReferrals(formattedReferrals);
        
        // Calculate statistics
        const pending = formattedReferrals.filter(r => r.status === 'pending' || r.status === 'active').length;
        const completed = formattedReferrals.filter(r => r.status === 'completed').length;
        const totalEarnings = formattedReferrals
          .filter(r => r.status === 'completed' && r.rewardAmount)
          .reduce((sum, ref) => sum + (ref.rewardAmount || 0), 0);
        
        setStats({
          totalReferrals: formattedReferrals.length,
          pendingReferrals: pending,
          completedReferrals: completed,
          totalEarnings
        });
      }
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast({
        title: 'Error fetching referrals',
        description: 'Failed to load your referral data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new referral
  const createReferral = async (referredAddress: string, bountyId: string): Promise<boolean> => {
    if (!primaryWallet?.address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to create referrals.',
        variant: 'destructive'
      });
      return false;
    }
    
    try {
      // Check if referral already exists
      const existingReferrals = await supabaseClient.getReferrals(bountyId, primaryWallet.address);
      const alreadyReferred = existingReferrals.some(ref => 
        ref.referrer_address === primaryWallet.address && 
        ref.referred_address === referredAddress
      );
      
      if (alreadyReferred) {
        toast({
          title: 'Referral already exists',
          description: 'You have already referred this address for this bounty.',
          variant: 'destructive'
        });
        return false;
      }
      
      // Create the new referral
      await supabaseClient.createReferral({
        bounty_id: bountyId,
        referrer_address: primaryWallet.address,
        referred_address: referredAddress,
        status: 'pending'
      });
      
      toast({
        title: 'Referral created',
        description: 'Your referral has been successfully recorded.',
      });
      
      // Refresh the referrals list
      fetchReferrals();
      return true;
    } catch (error) {
      console.error('Error creating referral:', error);
      toast({
        title: 'Error creating referral',
        description: 'Failed to create referral. Please try again.',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Copy referral link to clipboard
  const copyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      toast({
        title: 'Link copied',
        description: 'Referral link copied to clipboard!',
      });
    }
  };

  // Fetch referrals on component mount
  useEffect(() => {
    if (primaryWallet?.address) {
      fetchReferrals();
      
      // Set up a polling mechanism to simulate real-time updates
      const interval = setInterval(fetchReferrals, 15000);
      return () => clearInterval(interval);
    }
  }, [primaryWallet?.address, bountyId]);

  return {
    referrals,
    referralLink,
    stats,
    loading,
    createReferral,
    copyReferralLink,
    refreshReferrals: fetchReferrals
  };
}
