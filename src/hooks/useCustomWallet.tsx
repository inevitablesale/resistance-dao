
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useCustomWallet = () => {
  const { primaryWallet, user } = useDynamicContext();
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      if (primaryWallet?.isConnected) {
        try {
          await primaryWallet.isConnected();
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, [primaryWallet]);

  return {
    isConnected: !!primaryWallet?.address,
    address: primaryWallet?.address,
    user
  };
};
