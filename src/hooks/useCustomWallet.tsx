
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export const useCustomWallet = () => {
  const { primaryWallet, user } = useDynamicContext();

  return {
    isConnected: !!primaryWallet?.address && primaryWallet?.isConnected?.(),
    address: primaryWallet?.address,
    user
  };
};
