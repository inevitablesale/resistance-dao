
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";

export const useCustomWallet = () => {
  const { primaryWallet, user } = useDynamicContext();
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Only consider connected if we have both wallet and user data
  const isFullyConnected = !!primaryWallet?.address && !!user;
  
  // Effect to handle subdomain retrieval and logging
  useEffect(() => {
    if (user) {
      // Log the raw user object to check all available properties
      console.log("[useCustomWallet] Raw user object:", user);
      
      // Check if name-service-subdomain-handle exists directly on user object
      const hasSubdomainField = Object.prototype.hasOwnProperty.call(user, 'name-service-subdomain-handle');
      
      // Create more detailed debug info
      const debugData = {
        nameServiceSubdomain: user?.['name-service-subdomain-handle'],
        nameServiceExists: hasSubdomainField,
        alias: user?.alias,
        linkedInFromVerifications: user?.verifications?.customFields?.["LinkedIn Profile URL"],
        linkedInFromMetadata: user?.metadata?.["LinkedIn Profile URL"],
        hasVerifications: !!user?.verifications,
        userKeys: Object.keys(user),
        customFieldsKeys: user?.verifications?.customFields ? Object.keys(user?.verifications?.customFields) : [],
        metadataKeys: user?.metadata ? Object.keys(user?.metadata) : []
      };
      
      setDebugInfo(debugData);
      console.log("[useCustomWallet] Detailed debug info:", debugData);
      
      // Get the subdomain/ENS value from user data with direct access attempt
      let userSubdomain = hasSubdomainField ? user['name-service-subdomain-handle'] : null;
      
      // Fall back to other sources if direct access didn't work
      if (!userSubdomain) {
        userSubdomain = user?.alias || 
                       user?.verifications?.customFields?.["LinkedIn Profile URL"] || 
                       user?.metadata?.["LinkedIn Profile URL"] || 
                       null;
        
        console.log("[useCustomWallet] Using fallback for subdomain:", userSubdomain);
      } else {
        console.log("[useCustomWallet] Successfully accessed name-service-subdomain-handle:", userSubdomain);
      }
      
      setSubdomain(userSubdomain);
    }
  }, [user]);

  return {
    isConnected: isFullyConnected,
    isPendingUser: !!primaryWallet?.address && !user,
    address: primaryWallet?.address,
    user,
    subdomain,
    debugInfo, // Include debug info in the return value for use in components
    isSmartWallet: primaryWallet?.connector?.name?.toLowerCase().includes('zerodev')
  };
};
