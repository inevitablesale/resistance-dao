
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRpcProviders, EvmNetwork } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

export const useCustomWallet = () => {
  const { primaryWallet, user } = useDynamicContext();
  const { defaultProvider } = useRpcProviders({ evmNetworks: [EvmNetwork.MAINNET] });
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    const setupProvider = async () => {
      if (defaultProvider) {
        const newProvider = new ethers.providers.Web3Provider(
          defaultProvider as any
        );
        setProvider(newProvider);
      } else {
        setProvider(null);
      }
    };

    setupProvider();
  }, [defaultProvider]);

  return {
    isConnected: !!primaryWallet?.address && primaryWallet?.isConnected?.(),
    address: primaryWallet?.address,
    user,
    provider,
    wallet: primaryWallet
  };
};
