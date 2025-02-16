
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

export const useCustomWallet = () => {
  const { primaryWallet, user } = useDynamicContext();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    const setupProvider = async () => {
      if (primaryWallet?.connector?.walletConnector?.provider) {
        const newProvider = new ethers.providers.Web3Provider(
          primaryWallet.connector.walletConnector.provider as any
        );
        setProvider(newProvider);
      } else {
        setProvider(null);
      }
    };

    setupProvider();
  }, [primaryWallet?.connector?.walletConnector?.provider]);

  return {
    isConnected: !!primaryWallet?.address && primaryWallet?.isConnected?.(),
    address: primaryWallet?.address,
    user,
    provider,
    wallet: primaryWallet
  };
};
