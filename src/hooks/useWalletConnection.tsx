
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
  const [treasury, setTreasury] = useState<string | null>(null);
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

  const approveLGR = async (amount: string, isTestMode: boolean = false): Promise<ethers.ContractTransaction> => {
    try {
      // Always validate network
      await validateNetwork();

      // In test mode, return a mock transaction that matches the ContractTransaction interface
      if (isTestMode) {
        const mockFrom = "0x" + "3".repeat(40);
        const mockHash = "0x" + "1".repeat(64);
        const mockBlockHash = "0x" + "4".repeat(64);
        
        return {
          hash: mockHash,
          from: mockFrom,
          confirmations: 1,
          nonce: 0,
          gasLimit: ethers.BigNumber.from(21000),
          gasPrice: ethers.BigNumber.from(1000000000),
          data: "0x",
          value: ethers.BigNumber.from(0),
          chainId: 137,
          wait: async () => ({
            to: "0x" + "2".repeat(40),
            from: mockFrom,
            contractAddress: LGR_TOKEN_ADDRESS,
            transactionHash: mockHash,
            blockHash: mockBlockHash,
            blockNumber: 1,
            timestamp: Date.now(),
            confirmations: 1,
            events: [],
            logs: [],
            status: 1,
            gasUsed: ethers.BigNumber.from(21000),
            cumulativeGasUsed: ethers.BigNumber.from(21000),
            effectiveGasPrice: ethers.BigNumber.from(1000000000),
            logsBloom: "0x" + "0".repeat(512),
            transactionIndex: 0,
            byzantium: true
          })
        } as ethers.ContractTransaction;
      }

      if (!treasury) {
        console.log("Fetching contract status to get treasury address...");
        const status = await getContractStatus(primaryWallet!);
        console.log("Contract status received:", status);
        setTreasury(status.treasury);
      }

      if (!treasury) {
        throw new Error("Treasury address not available");
      }

      console.log("Approving LGR tokens for treasury:", treasury);
      const provider = await getProvider();
      const signer = provider.getSigner();
      const lgrToken = new ethers.Contract(
        LGR_TOKEN_ADDRESS,
        ["function approve(address spender, uint256 amount) returns (bool)"],
        signer
      );

      console.log("Calling approve with amount:", amount);
      return await lgrToken.approve(treasury, amount);
    } catch (error) {
      console.error("Approval error in useWalletConnection:", error);
      throw error; // Let the component handle the error display
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
