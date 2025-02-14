
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export const useCustomWallet = () => {
  const { primaryWallet, user } = useDynamicContext();

  return {
    isConnected: !!primaryWallet?.address,
    address: primaryWallet?.address,
    user
  };
};
