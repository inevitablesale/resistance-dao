import { supabaseClient } from '@/integrations/supabase/client';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import { IPFSContent, ReferralStatus } from '@/types/content';
import { JobMetadata } from '@/utils/settlementConversion';

export interface ReferralMetadata {
  id: string;
  code: string;
  creator: string;
  jobId?: string;
  createdAt: number;
  expiresAt?: number;
  status: ReferralStatus;
  claimedBy?: string;
  claimedAt?: number;
  reward?: string;
  type: string;
  name: string;
  description: string;
  rewardPercentage: number;
}

export interface Referral extends ReferralMetadata {
  id: string;
}

export const generateReferralCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export const createNewReferral = async (
  type: string,
  name: string,
): Promise<string> => {
  const referralCode = generateReferralCode();
  const { address } = useCustomWallet();

  if (!address) {
    throw new Error('Wallet not connected');
  }

  const { data, error } = await supabaseClient
    .from('referrals')
    .insert([
      {
        code: referralCode,
        creator: address,
        createdAt: Date.now(),
        status: 'active',
        type: type,
        name: name,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating referral:', error);
    throw error;
  }

  return data.id;
};

export const getAllReferrals = async (userAddress: string): Promise<ReferralMetadata[]> => {
    try {
        const { data, error } = await supabaseClient
            .from('referrals')
            .select('*')
            .eq('creator', userAddress)
            .order('createdAt', { ascending: false });

        if (error) {
            console.error('Error fetching referrals:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching referrals:', error);
        return [];
    }
};

export const getReferralByCode = async (code: string): Promise<ReferralMetadata | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('referrals')
      .select('*')
      .eq('code', code)
      .single();

    if (error) {
      console.error('Error fetching referral by code:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching referral by code:', error);
    return null;
  }
};

export const validateReferralCode = async (code: string): Promise<boolean> => {
  const referral = await getReferralByCode(code);
  return !!referral && referral.status === 'active';
};

export const claimReferral = async (code: string, userAddress: string): Promise<boolean> => {
  try {
    const referral = await getReferralByCode(code);

    if (!referral) {
      console.error('Referral not found');
      return false;
    }

    if (referral.status !== 'active') {
      console.error('Referral is not active');
      return false;
    }

    const { error } = await supabaseClient
      .from('referrals')
      .update({
        status: 'claimed',
        claimedBy: userAddress,
        claimedAt: Date.now(),
      })
      .eq('code', code);

    if (error) {
      console.error('Error claiming referral:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error claiming referral:', error);
    return false;
  }
};

export const processReferralReward = async (
  jobId: string,
  jobReward: string,
  jobTitle: string,
  referralCode: string
): Promise<boolean> => {
  try {
    const referral = await getReferralByCode(referralCode);

    if (!referral) {
      console.error('Referral not found');
      return false;
    }

    if (referral.status !== 'claimed') {
      console.error('Referral is not claimed');
      return false;
    }

    // Update referral status to completed and add reward details
    const { error } = await supabaseClient
      .from('referrals')
      .update({
        status: 'completed',
        reward: jobReward,
      })
      .eq('code', referralCode);

    if (error) {
      console.error('Error processing referral reward:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error processing referral reward:', error);
    return false;
  }
};

// Update the function with the status comparison issue
export const processReferralClaim = async (referralId: string): Promise<boolean> => {
  try {
    // Get the referral
    const { data: referral, error: fetchError } = await supabaseClient
      .from('referrals')
      .select('*')
      .eq('id', referralId)
      .single();
    
    if (fetchError || !referral) {
      console.error('Error fetching referral:', fetchError);
      return false;
    }
    
    // Check if the referral is active and can be claimed
    // Fix the comparison by using the correct status type
    if (referral.status !== 'active') {
      console.error('Referral is not active');
      return false;
    }
    
    // Update the referral status to claimed
    const { error: updateError } = await supabaseClient
      .from('referrals')
      .update({
        status: 'claimed',
        claimedAt: new Date().toISOString()
      })
      .eq('id', referralId);
    
    if (updateError) {
      console.error('Error updating referral:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error processing referral claim:', error);
    return false;
  }
}
