
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { getContractStatus } from "@/services/proposalContractService";
import { useDynamicUtils } from "./useDynamicUtils";
import { handleDynamicError } from "@/services/dynamicErrorHandler";

const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";

export const useWalletConnection = () => {
  const { primaryWallet, setShowAuthFlow, setShowOnRamp } = useDynamicContext();
  const { getWalletState, getProvider, connectWallet, validateNetwork } = useDynamicUtils();
  const [isConnecting, setIsConnecting] = useState(false);
  const [treasuryAddress, setTreasuryAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const connect = async () => {
    try {
      setIsConnecting(true);
      await connectWallet();
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

  const approveLGR = async (amount: string, isTestMode: boolean = false) => {
    try {
      // Skip network validation in test mode
      if (!isTestMode) {
        await validateNetwork();
      }

      // In test mode, we can skip the actual contract interaction
      if (isTestMode) {
        return true;
      }

      if (!treasuryAddress) {
        const status = await getContractStatus(primaryWallet!);
        setTreasuryAddress(status.treasuryAddress);
      }

      const provider = await getProvider();
      const signer = provider.getSigner();
      const lgrToken = new ethers.Contract(
        LGR_TOKEN_ADDRESS,
        ["function approve(address spender, uint256 amount) returns (bool)"],
        signer
      );

      const tx = await lgrToken.approve(treasuryAddress, amount);
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Approval error:", error);
      const proposalError = handleDynamicError(error);
      toast({
        title: "Approval Failed",
        description: proposalError.message,
        variant: "destructive"
      });
      throw proposalError;
    }
  };

  // Move the auth flow closing logic to useEffect
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
