
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import { useUserProfile } from "./useUserProfile";

export const useCustomWallet = () => {
  const { primaryWallet, user } = useDynamicContext();
  const { profileData } = useUserProfile();
  const [subdomain, setSubdomain] = useState<string | null>(null);

  // Only consider connected if we have both wallet and user data
  const isFullyConnected = !!primaryWallet?.address && !!user;
  
  // Effect to handle subdomain retrieval and logging
  useEffect(() => {
    if (user) {
      // Log available user data for debugging
      console.log("[useCustomWallet] User data:", {
        nameServiceSubdomain: user?.['name-service-subdomain-handle'],
        alias: user?.alias,
        linkedInFromVerifications: user?.verifications?.customFields?.["LinkedIn Profile URL"],
        linkedInFromMetadata: user?.metadata?.["LinkedIn Profile URL"],
        hasVerifications: !!user?.verifications,
        customFieldsKeys: user?.verifications?.customFields ? Object.keys(user?.verifications?.customFields) : [],
        metadataKeys: user?.metadata ? Object.keys(user?.metadata) : [],
        profileDataSubdomain: profileData?.subdomainHandle
      });
      
      // Priority order for subdomain:
      // 1. User-entered subdomain from profileData (Supabase)
      // 2. Dynamic SDK name-service-subdomain-handle
      // 3. Dynamic SDK alias
      // 4. LinkedIn URL (from either source)
      // 5. null
      const userSubdomain = profileData?.subdomainHandle || 
                          user?.['name-service-subdomain-handle'] || 
                          user?.alias || 
                          user?.verifications?.customFields?.["LinkedIn Profile URL"] || 
                          user?.metadata?.["LinkedIn Profile URL"] || 
                          null;
      
      setSubdomain(userSubdomain);
      
      if (profileData?.subdomainHandle) {
        console.log("[useCustomWallet] Using user-entered subdomain from profile:", profileData.subdomainHandle);
      } else if (user?.['name-service-subdomain-handle']) {
        console.log("[useCustomWallet] Using name-service-subdomain-handle:", user?.['name-service-subdomain-handle']);
      } else {
        console.log("[useCustomWallet] No subdomain found from primary sources, using fallback:", userSubdomain);
      }
    }
  }, [user, profileData]);

  return {
    isConnected: isFullyConnected,
    isPendingUser: !!primaryWallet?.address && !user,
    address: primaryWallet?.address,
    user,
    subdomain,
    isSmartWallet: primaryWallet?.connector?.name?.toLowerCase().includes('zerodev')
  };
};
