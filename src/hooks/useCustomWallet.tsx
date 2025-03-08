
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";

export const useCustomWallet = () => {
  const { primaryWallet, user } = useDynamicContext();
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Only consider connected if we have both wallet and user data
  const isFullyConnected = !!primaryWallet?.address && !!user;
  
  // Effect to handle logging of user data for debugging and initialization state
  useEffect(() => {
    if (isInitializing) {
      // Set initializing to false after a short delay
      const timer = setTimeout(() => {
        setIsInitializing(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    if (user) {
      // Basic debug logging of user object
      console.log("[useCustomWallet] User connected:", {
        hasWallet: !!primaryWallet?.address,
        hasUser: !!user,
        walletAddress: primaryWallet?.address
      });
    }
  }, [user, primaryWallet, isInitializing]);

  // Get stored referrer from localStorage if available
  const getReferrer = () => {
    return localStorage.getItem("referrer_address") || null;
  };

  return {
    isConnected: isFullyConnected,
    isPendingUser: !!primaryWallet?.address && !user,
    isInitializing,
    address: primaryWallet?.address,
    user,
    isSmartWallet: primaryWallet?.connector?.name?.toLowerCase().includes('zerodev'),
    getReferrer
  };
};
