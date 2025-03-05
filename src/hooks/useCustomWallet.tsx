
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export const useCustomWallet = () => {
  const { primaryWallet, user } = useDynamicContext();

  // Only consider connected if we have both wallet and user data
  const isFullyConnected = !!primaryWallet?.address && !!user;
  
  return {
    isConnected: isFullyConnected,
    isPendingUser: !!primaryWallet?.address && !user,
    address: primaryWallet?.address,
    user,
    isSmartWallet: primaryWallet?.connector?.name?.toLowerCase().includes('zerodev'),
    walletProvider: primaryWallet?.connector?.name || 'Unknown',
    chainId: primaryWallet?.chainId
  };
};
