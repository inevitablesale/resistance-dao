
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";

export const useCustomWallet = () => {
  const { primaryWallet, user } = useDynamicContext();
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
        metadataKeys: user?.metadata ? Object.keys(user?.metadata) : []
      });
      
      // Get the subdomain/ENS value from user data
      // First check for the name-service-subdomain-handle field
      // Then fall back to other possible sources
      const userSubdomain = user?.['name-service-subdomain-handle'] || 
                          user?.alias || 
                          user?.verifications?.customFields?.["LinkedIn Profile URL"] || 
                          user?.metadata?.["LinkedIn Profile URL"] || 
                          null;
      
      setSubdomain(userSubdomain);
      
      if (!user?.['name-service-subdomain-handle']) {
        console.log("[useCustomWallet] name-service-subdomain-handle not found, using fallback:", userSubdomain);
      } else {
        console.log("[useCustomWallet] Using name-service-subdomain-handle:", user?.['name-service-subdomain-handle']);
      }
    }
  }, [user]);

  return {
    isConnected: isFullyConnected,
    isPendingUser: !!primaryWallet?.address && !user,
    address: primaryWallet?.address,
    user,
    subdomain,
    isSmartWallet: primaryWallet?.connector?.name?.toLowerCase().includes('zerodev')
  };
};
