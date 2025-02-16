
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { getContractStatus } from "@/services/proposalContractService";

const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";

export const useWalletConnection = () => {
  const { primaryWallet, setShowAuthFlow, setShowOnRamp } = useDynamicContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [treasuryAddress, setTreasuryAddress] = useState<string | null>(null);
  const { toast } = useToast();

  // Update connection status when wallet changes
  useEffect(() => {
    const updateConnectionStatus = async () => {
      if (primaryWallet) {
        const connected = await primaryWallet.isConnected();
        setIsConnected(connected);
      } else {
        setIsConnected(false);
      }
    };

    updateConnectionStatus();
  }, [primaryWallet]);

  const connect = async () => {
    try {
      setIsConnecting(true);
      setShowAuthFlow?.(true);
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
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
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Disconnect error:", error);
      toast({
        title: "Disconnect Failed",
        description: error instanceof Error ? error.message : "Failed to disconnect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const approveLGR = useCallback(async (amount: string) => {
    if (!primaryWallet) {
      throw new Error("No wallet connected");
    }

    if (!treasuryAddress) {
      const status = await getContractStatus(primaryWallet);
      setTreasuryAddress(status.treasuryAddress);
    }

    const walletClient = await primaryWallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }

    const ethersProvider = new ethers.providers.Web3Provider(walletClient as any);
    const signer = ethersProvider.getSigner();
    const lgrToken = new ethers.Contract(
      LGR_TOKEN_ADDRESS,
      ["function approve(address spender, uint256 amount) returns (bool)"],
      signer
    );

    const tx = await lgrToken.approve(treasuryAddress, amount);
    await tx.wait();
    return true;
  }, [primaryWallet, treasuryAddress]);

  // Move the auth flow closing logic to useEffect
  useEffect(() => {
    const checkAndCloseAuth = async () => {
      if (primaryWallet && await primaryWallet.isConnected() && setShowAuthFlow) {
        setShowAuthFlow(false);
      }
    };
    checkAndCloseAuth();
  }, [primaryWallet, setShowAuthFlow]);

  return {
    isConnected,
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
