
import { useDynamicContext, useWalletConnectorEvent } from "@dynamic-labs/sdk-react-core";
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
  const walletConnectorEvent = useWalletConnectorEvent();

  useEffect(() => {
    const unsubscribe = walletConnectorEvent.subscribe((event) => {
      console.log('Wallet event:', event);
      switch (event.type) {
        case 'connected':
          toast({
            title: "Wallet Connected",
            description: "Your wallet has been successfully connected.",
          });
          break;
        case 'disconnected':
          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected.",
          });
          break;
        case 'networkChanged':
          toast({
            title: "Network Changed",
            description: "The network connection has been updated.",
          });
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [walletConnectorEvent, toast]);

  const connect = async () => {
    try {
      setIsConnecting(true);
      setShowAuthFlow?.(true);
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
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
      toast({
        title: "Disconnect Failed",
        description: error instanceof Error ? error.message : "Failed to disconnect wallet",
        variant: "destructive"
      });
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

    const provider = new ethers.providers.Web3Provider(walletClient as any);
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

  // Check wallet connection status
  useEffect(() => {
    const checkConnection = async () => {
      if (primaryWallet?.isConnected) {
        const isConnected = await primaryWallet.isConnected();
        if (isConnected && setShowAuthFlow) {
          setShowAuthFlow(false);
        }
      }
    };

    checkConnection();
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
