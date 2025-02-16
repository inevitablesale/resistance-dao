
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";

export const useCustomWallet = () => {
  const { primaryWallet, user } = useDynamicContext();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      if (primaryWallet) {
        const connected = await primaryWallet.isConnected();
        setIsConnected(connected);
      } else {
        setIsConnected(false);
      }
    };

    checkConnection();
  }, [primaryWallet]);

  return {
    isConnected,
    address: primaryWallet?.address,
    user
  };
};
