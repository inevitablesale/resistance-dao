
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with public keys (safe to expose)
// For now, we'll use localStorage as a fallback since Supabase isn't properly configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

const USING_MOCK_DATA = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Local storage keys
const LS_KEYS = {
  BOUNTIES: 'resistance-bounties',
  REFERRALS: 'resistance-referrals',
  PROFILES: 'resistance-profiles',
};

// Helper function to get data from localStorage or return default
const getLocalData = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
};

// Helper function to save data to localStorage
const saveLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(`Error saving to ${key} in localStorage:`, e);
    return false;
  }
};

// Mock function for fetching user profile from localStorage when Supabase isn't configured
export async function fetchUserProfile(userId: string) {
  if (!USING_MOCK_DATA) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  } else {
    // Mock implementation using localStorage
    const profiles = getLocalData(LS_KEYS.PROFILES, []);
    const profile = profiles.find(p => p.id === userId);
    if (!profile) {
      return null;
    }
    return profile;
  }
}

// Mock function for updating user profile in localStorage when Supabase isn't configured
export async function updateUserProfile(userId: string, updates: any) {
  if (!USING_MOCK_DATA) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
      
    if (error) throw error;
    return data;
  } else {
    // Mock implementation using localStorage
    const profiles = getLocalData(LS_KEYS.PROFILES, []);
    const profileIndex = profiles.findIndex(p => p.id === userId);
    
    if (profileIndex >= 0) {
      profiles[profileIndex] = { ...profiles[profileIndex], ...updates };
    } else {
      profiles.push({ id: userId, ...updates });
    }
    
    saveLocalData(LS_KEYS.PROFILES, profiles);
    return profiles[profileIndex >= 0 ? profileIndex : profiles.length - 1];
  }
}

// Mock function for real-time subscriptions when Supabase isn't configured
export async function subscribeToRealtime(table: string, callback: (payload: any) => void) {
  if (!USING_MOCK_DATA) {
    return supabase
      .channel(`public:${table}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table 
      }, callback)
      .subscribe();
  } else {
    // For local storage implementation, we'll just return a mock unsubscribe function
    // Real-time updates will be simulated when data changes through our CRUD operations
    console.log(`Mock subscription to ${table} created`);
    return {
      unsubscribe: () => console.log(`Mock subscription to ${table} removed`)
    };
  }
}

// Additional functions for bounty management with localStorage fallback
export async function getBounties(status?: string) {
  if (!USING_MOCK_DATA) {
    let query = supabase.from('bounties').select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } else {
    // Mock implementation using localStorage
    let bounties = getLocalData(LS_KEYS.BOUNTIES, []);
    
    if (status) {
      bounties = bounties.filter(b => b.status === status);
    }
    
    return bounties;
  }
}

export async function getBounty(id: string) {
  if (!USING_MOCK_DATA) {
    const { data, error } = await supabase
      .from('bounties')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } else {
    // Mock implementation using localStorage
    const bounties = getLocalData(LS_KEYS.BOUNTIES, []);
    return bounties.find(b => b.id === id) || null;
  }
}

export async function createBounty(bounty: any) {
  if (!USING_MOCK_DATA) {
    const { data, error } = await supabase
      .from('bounties')
      .insert([bounty])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } else {
    // Mock implementation using localStorage
    const bounties = getLocalData(LS_KEYS.BOUNTIES, []);
    
    // Generate unique ID if not provided
    if (!bounty.id) {
      bounty.id = `b-${Date.now().toString(36)}`;
    }
    
    // Set default values
    const now = Math.floor(Date.now() / 1000);
    const completedbounty = {
      ...bounty,
      createdAt: bounty.createdAt || now,
      usedBudget: bounty.usedBudget || 0,
      remainingBudget: bounty.totalBudget,
      status: bounty.status || 'active',
      successCount: bounty.successCount || 0,
      hunterCount: bounty.hunterCount || 0,
    };
    
    bounties.push(completedbounty);
    saveLocalData(LS_KEYS.BOUNTIES, bounties);
    
    return completedbounty;
  }
}

export async function getReferrals(bountyId?: string, referrerAddress?: string) {
  if (!USING_MOCK_DATA) {
    let query = supabase.from('bounty_referrals').select('*');
    
    if (bountyId) {
      query = query.eq('bounty_id', bountyId);
    }
    
    if (referrerAddress) {
      query = query.eq('referrer_address', referrerAddress);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } else {
    // Mock implementation using localStorage
    let referrals = getLocalData(LS_KEYS.REFERRALS, []);
    
    if (bountyId) {
      referrals = referrals.filter(r => r.bounty_id === bountyId);
    }
    
    if (referrerAddress) {
      referrals = referrals.filter(r => r.referrer_address === referrerAddress);
    }
    
    return referrals;
  }
}

export async function createReferral(referral: any) {
  if (!USING_MOCK_DATA) {
    const { data, error } = await supabase
      .from('bounty_referrals')
      .insert([referral])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } else {
    // Mock implementation using localStorage
    const referrals = getLocalData(LS_KEYS.REFERRALS, []);
    
    // Generate unique ID if not provided
    if (!referral.id) {
      referral.id = `r-${Date.now().toString(36)}`;
    }
    
    // Set default values
    const now = new Date().toISOString();
    const completedReferral = {
      ...referral,
      referral_date: referral.referral_date || now,
      status: referral.status || 'pending',
    };
    
    referrals.push(completedReferral);
    saveLocalData(LS_KEYS.REFERRALS, referrals);
    
    return completedReferral;
  }
}
