
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

      console.log("Getting contract status for treasury address...");
      const status = await getContractStatus(primaryWallet!);
      
      if (!status.treasury || !ethers.utils.isAddress(status.treasury)) {
        console.error("Invalid or missing treasury address:", status.treasury);
        throw new Error("Valid treasury address not available");
      }

      console.log("Contract status:", {
        treasury: status.treasury,
        isTestMode: status.isTestMode,
        amount: ethers.utils.formatEther(amount)
      });

      if (isTestMode && status.isTestMode) {
        console.log("Test mode is enabled, returning mock transaction");
        return {
          wait: async () => ({ status: 1 }),
          hash: "0x0000000000000000000000000000000000000000000000000000000000000000"
        } as ethers.ContractTransaction;
      }

      const signer = walletProvider.provider.getSigner();
      const signerAddress = await signer.getAddress();
      
      console.log("Approving LGR tokens for treasury:", {
        treasury: status.treasury,
        signer: signerAddress,
        amount: ethers.utils.formatEther(amount)
      });

      const lgrToken = new ethers.Contract(
        LGR_TOKEN_ADDRESS,
        [
          "function approve(address spender, uint256 amount) returns (bool)",
          "function allowance(address owner, address spender) view returns (uint256)",
          "function transfer(address to, uint256 amount) returns (bool)"
        ],
        signer
      );

      // Check current allowance
      const currentAllowance = await lgrToken.allowance(signerAddress, status.treasury);
      console.log("Current treasury allowance:", {
        amount: ethers.utils.formatEther(currentAllowance),
        required: ethers.utils.formatEther(amount)
      });

      if (currentAllowance.gte(amount)) {
        console.log("Sufficient treasury allowance exists, proceeding with transfer");
        return await lgrToken.transfer(status.treasury, amount);
      }

      console.log("Calling approve for treasury:", {
        treasury: status.treasury,
        amount: ethers.utils.formatEther(amount)
      });

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
    connect,
    disconnect,
    address: primaryWallet?.address,
    approveLGR,
    setShowOnRamp,
    setShowAuthFlow,
    wallet: primaryWallet
  };
};
