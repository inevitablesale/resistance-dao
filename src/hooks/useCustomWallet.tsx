
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
      // Check each property on the user object to find subdomain-related fields
      const userProps = Object.keys(user).filter(key => 
        typeof user[key as keyof typeof user] !== 'function' && 
        key !== 'verifications' && 
        key !== 'metadata'
      );
      
      // Log all available user properties for debugging
      console.log("[useCustomWallet] User properties:", userProps);
      console.log("[useCustomWallet] Direct check for name-service fields:", {
        // Try different case variations to find the right property
        nameServiceSubdomainHandle: user?.['name-service-subdomain-handle'],
        nameServiceSubdomain: user?.['name-service-subdomain'],
        nameService: user?.['name-service'],
        // Check if the property exists by looking at property descriptor
        hasNameServiceSubdomainHandle: Object.getOwnPropertyDescriptor(user, 'name-service-subdomain-handle') !== undefined,
        // Check using hasOwnProperty method
        hasOwnNameServiceProperty: user.hasOwnProperty('name-service-subdomain-handle')
      });
      
      // Check nested properties
      console.log("[useCustomWallet] User data structure:", {
        nameServiceSubdomainHandle: user?.['name-service-subdomain-handle'],
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

  // Additional logging when user object changes
  useEffect(() => {
    if (user) {
      console.log("[useCustomWallet] User object updated, checking for subdomain field...");
      
      // Try to access the field with different methods
      const nameServiceField = user?.['name-service-subdomain-handle'];
      console.log("[useCustomWallet] Subdomain access result:", nameServiceField);
      
      // Print the user object type
      console.log("[useCustomWallet] User object type:", typeof user, user.constructor?.name);
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
