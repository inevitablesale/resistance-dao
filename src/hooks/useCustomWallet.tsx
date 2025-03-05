
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export const useCustomWallet = () => {
  const { primaryWallet, user } = useDynamicContext();

  // Only consider connected if we have both wallet and user data
  const isFullyConnected = !!primaryWallet?.address && !!user;
  
  // Get the subdomain/ENS value from user data
  // First check for the name-service-subdomain-handle field
  // Then fall back to other possible sources
  const subdomain = user?.['name-service-subdomain-handle'] || 
                    user?.alias || 
                    user?.verifications?.customFields?.["LinkedIn Profile URL"] || 
                    user?.metadata?.["LinkedIn Profile URL"] || 
                    null;

  return {
    isConnected: isFullyConnected,
    isPendingUser: !!primaryWallet?.address && !user,
    address: primaryWallet?.address,
    user,
    subdomain,
    isSmartWallet: primaryWallet?.connector?.name?.toLowerCase().includes('zerodev')
  };
};
