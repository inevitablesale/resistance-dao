
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";

export const useCustomWallet = () => {
  const { primaryWallet, user } = useDynamicContext();
  
  // Only consider connected if we have both wallet and user data
  const isFullyConnected = !!primaryWallet?.address && !!user;
  
  // Effect to handle logging of user data for debugging
  useEffect(() => {
    if (user) {
      // Basic debug logging of user object
      console.log("[useCustomWallet] User connected:", {
        hasWallet: !!primaryWallet?.address,
        hasUser: !!user,
        walletAddress: primaryWallet?.address
      });
    }
  }, [user, primaryWallet]);

  return {
    isConnected: isFullyConnected,
    isPendingUser: !!primaryWallet?.address && !user,
    address: primaryWallet?.address,
    user,
    isSmartWallet: primaryWallet?.connector?.name?.toLowerCase().includes('zerodev')
  };
};
