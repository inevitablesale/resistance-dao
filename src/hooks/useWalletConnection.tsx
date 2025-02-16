
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";
const TREASURY_ADDRESS = "0x..."; // Add actual treasury address

export const useWalletConnection = () => {
  const { primaryWallet, setShowAuthFlow, setShowOnRamp } = useDynamicContext();
  const [isConnecting, setIsConnecting] = useState(false);
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
    if (!primaryWallet?.connector) {
      throw new Error("No provider available");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const lgrToken = new ethers.Contract(
      LGR_TOKEN_ADDRESS,
      ["function approve(address spender, uint256 amount) returns (bool)"],
      signer
    );

    const tx = await lgrToken.approve(TREASURY_ADDRESS, amount);
    await tx.wait();
    return true;
  };

  // Monitor connection state and close auth flow when connected
  if (primaryWallet?.isConnected?.() && setShowAuthFlow) {
    setShowAuthFlow(false);
  }

  return {
    isConnected: primaryWallet?.isConnected?.() || false,
    isConnecting,
    connect,
    disconnect,
    address: primaryWallet?.address,
    approveLGR,
    setShowOnRamp
  };
};
