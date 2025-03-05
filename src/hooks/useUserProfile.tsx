
import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type UserProfileData = {
  address: string;
  subdomainHandle: string | null;
  linkedinUrl: string | null;
  email: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export const useUserProfile = () => {
  const { primaryWallet, user } = useDynamicContext();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  // Fetch profile from Supabase whenever wallet changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!primaryWallet?.address) return;
      
      try {
        setIsLoading(true);
        console.log("Fetching profile for address:", primaryWallet.address);
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('address', primaryWallet.address.toLowerCase())
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
          console.error("Profile fetch error:", error);
          toast({
            title: "Error fetching profile",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        if (data) {
          console.log("Profile found:", data);
          setProfileData(data as UserProfileData);
        } else {
          // Create default profile with Dynamic data if available
          const defaultProfile: UserProfileData = {
            address: primaryWallet.address.toLowerCase(),
            subdomainHandle: user?.['name-service-subdomain-handle'] || null,
            linkedinUrl: user?.verifications?.customFields?.["LinkedIn Profile URL"] || 
                         user?.metadata?.["LinkedIn Profile URL"] || null,
            email: null
          };
          
          console.log("Creating default profile:", defaultProfile);
          setProfileData(defaultProfile);
          await saveProfile(defaultProfile);
        }
      } catch (err) {
        console.error("Profile fetch exception:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [primaryWallet?.address, user, toast]);
  
  // Save profile to Supabase
  const saveProfile = async (data: UserProfileData) => {
    if (!primaryWallet?.address) return;
    
    try {
      setIsSaving(true);
      
      // Ensure lowercase address for consistency
      const profileToSave = {
        ...data,
        address: data.address.toLowerCase(),
        updatedAt: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileToSave, { onConflict: 'address' });
      
      if (error) {
        console.error("Profile save error:", error);
        toast({
          title: "Error saving profile",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      setProfileData(profileToSave);
      return true;
    } catch (err) {
      console.error("Profile save exception:", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  const updateProfile = async (updates: Partial<UserProfileData>) => {
    if (!profileData) return false;
    
    const updatedProfile = {
      ...profileData,
      ...updates
    };
    
    const success = await saveProfile(updatedProfile);
    
    if (success) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully",
      });
      return true;
    }
    
    return false;
  };
  
  return {
    profileData,
    isLoading,
    isSaving,
    updateProfile
  };
};
