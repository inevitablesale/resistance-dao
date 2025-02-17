
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { getContractStatus, setTestMode } from "@/services/proposalContractService";
import { useWalletProvider } from "./useWalletProvider";
import { handleDynamicError } from "@/services/dynamicErrorHandler";

const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";
const AUTHORIZED_TEST_MODE_ADDRESS = "0x7b1B2b967923bC3EB4d9Bf5472EA017Ac644e4A2";

export const useWalletConnection = () => {
  const { primaryWallet, setShowAuthFlow, setShowOnRamp } = useDynamicContext();
  const { getProvider, validateNetwork, getWalletType } = useWalletProvider();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSettingTestMode, setIsSettingTestMode] = useState(false);
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

  const toggleTestMode = async (enabled: boolean): Promise<boolean> => {
    if (!primaryWallet?.address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to toggle test mode",
        variant: "destructive"
      });
      return false;
    }

    const userAddress = primaryWallet.address.toLowerCase();
    if (userAddress !== AUTHORIZED_TEST_MODE_ADDRESS.toLowerCase()) {
      toast({
        title: "Unauthorized",
        description: "You are not authorized to toggle test mode",
        variant: "destructive"
      });
      return false;
    }

    setIsSettingTestMode(true);
    try {
      await setTestMode(enabled, primaryWallet);
      toast({
        title: `Test Mode ${enabled ? 'Enabled' : 'Disabled'}`,
        description: `Successfully ${enabled ? 'enabled' : 'disabled'} test mode`,
      });
      return true;
    } catch (error) {
      console.error("Test mode toggle error:", error);
      toast({
        title: "Test Mode Toggle Failed",
        description: error instanceof Error ? error.message : "Failed to toggle test mode",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSettingTestMode(false);
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

      if (isTestMode && status.isTestMode) {
        console.log("Test mode is enabled, skipping LGR approval");
        return {} as ethers.ContractTransaction;
      }

      console.log(`Approving LGR tokens for treasury using ${walletProvider.type} wallet:`, status.treasury);
      const signer = walletProvider.provider.getSigner();
      const lgrToken = new ethers.Contract(
        LGR_TOKEN_ADDRESS,
        ["function approve(address spender, uint256 amount) returns (bool)"],
        signer
      );

      console.log("Calling approve with amount:", amount, "isTestMode:", isTestMode);
      return await lgrToken.approve(status.treasury, amount);
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
    isSettingTestMode,
    connect,
    disconnect,
    toggleTestMode,
    address: primaryWallet?.address,
    approveLGR,
    setShowOnRamp,
    setShowAuthFlow,
    wallet: primaryWallet
  };
};
