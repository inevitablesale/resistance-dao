
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { getContractStatus } from "@/services/proposalContractService";
import { useWalletProvider } from "./useWalletProvider";
import { handleDynamicError } from "@/services/dynamicErrorHandler";

const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";

export const useWalletConnection = () => {
  const { primaryWallet, setShowAuthFlow, setShowOnRamp } = useDynamicContext();
  const { getProvider, validateNetwork, getWalletType } = useWalletProvider();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connect = async () => {
    try {
      setIsConnecting(true);
      setShowAuthFlow?.(true);
    } catch (error) {
      console.error("Connection error:", error);
      const proposalError = handleDynamicError(error);
      toast({
        title: "Connection Failed",
        description: proposalError.message,
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      setIsConnecting(true);
      if (primaryWallet?.disconnect) {
        await primaryWallet.disconnect();
      }
    } catch (error) {
      console.error("Disconnect error:", error);
      const proposalError = handleDynamicError(error);
      toast({
        title: "Disconnect Failed",
        description: proposalError.message,
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const approveLGR = async (amount: string, isTestMode: boolean = false): Promise<ethers.ContractTransaction> => {
    try {
      const walletProvider = await getProvider();
      await validateNetwork(walletProvider);

      console.log("Fetching contract status to get treasury address...");
      const status = await getContractStatus(primaryWallet!);
      console.log("Contract status received:", status);
      
      if (!status.treasury) {
        throw new Error("Treasury address not available in contract status");
      }

      // Convert the amount to a whole number and then to wei
      const wholeLGRAmount = Math.floor(parseFloat(amount));
      const amountInWei = ethers.utils.parseUnits(wholeLGRAmount.toString(), 18);
      
      console.log(`Approving LGR tokens for treasury using ${walletProvider.type} wallet:`, status.treasury);
      const signer = walletProvider.provider.getSigner();
      const lgrToken = new ethers.Contract(
        LGR_TOKEN_ADDRESS,
        ["function approve(address spender, uint256 amount) returns (bool)"],
        signer
      );

      console.log("Calling approve with amount:", amountInWei.toString(), "isTestMode:", isTestMode);
      return await lgrToken.approve(status.treasury, amountInWei);
    } catch (error) {
      console.error("Approval error in useWalletConnection:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (primaryWallet?.isConnected?.() && setShowAuthFlow) {
      setShowAuthFlow(false);
    }
  }, [primaryWallet, setShowAuthFlow]);

  return {
    isConnected: !!primaryWallet?.isConnected?.(),
    isConnecting,
    connect,
    disconnect,
    address: primaryWallet?.address,
    approveLGR,
    setShowOnRamp,
    setShowAuthFlow,
    wallet: primaryWallet
  };
};
