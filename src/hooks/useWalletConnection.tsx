
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { getContractStatus } from "@/services/proposalContractService";

const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";

export const useWalletConnection = () => {
  const { primaryWallet, setShowAuthFlow, setShowOnRamp } = useDynamicContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [treasuryAddress, setTreasuryAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const connect = async () => {
    try {
      setIsConnecting(true);
      setShowAuthFlow?.(true);
    } catch (error) {
      console.error("Connection error:", error);
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
    } finally {
      setIsConnecting(false);
    }
  };

  const approveLGR = async (amount: string) => {
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

    const provider = new ethers.providers.Web3Provider(walletClient);
    const signer = provider.getSigner();
    const lgrToken = new ethers.Contract(
      LGR_TOKEN_ADDRESS,
      ["function approve(address spender, uint256 amount) returns (bool)"],
      signer
    );

    const tx = await lgrToken.approve(treasuryAddress, amount);
    await tx.wait();
    return true;
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
