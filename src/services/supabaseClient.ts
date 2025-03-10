
import { createClient } from '@supabase/supabase-js'

// Supabase client configuration
// Using public anon key which is safe to expose (requires proper RLS policies)
export const supabaseClient = typeof window !== 'undefined' 
  ? createClient(
      'https://your-project.supabase.co', // Replace with your Supabase project URL
      'your-anon-key' // Replace with your public anon key
    )
  : null;

export const isSuperbaseAvailable = () => {
  return !!supabaseClient;
};

// Helper functions for error handling
export const handleSupabaseError = (error: any, fallbackMsg: string = 'An error occurred') => {
  if (error) {
    console.error('Supabase error:', error);
    return error.message || fallbackMsg;
  }
  return null;
};

// Helper function to get user session
export const getCurrentSession = async () => {
  if (!supabaseClient) return null;
  
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return data.session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  if (!supabaseClient) return null;
  
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return data.user;
};
