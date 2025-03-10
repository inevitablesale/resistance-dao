
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with public keys (safe to expose)
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Example helper functions for common operations
export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
    
  if (error) throw error;
  return data;
}

export async function subscribeToRealtime(table: string, callback: (payload: any) => void) {
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table 
    }, callback)
    .subscribe();
}
