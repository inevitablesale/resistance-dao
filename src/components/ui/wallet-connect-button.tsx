
import React from "react";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Wallet, ShieldAlert, Loader2 } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";

interface WalletConnectButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function WalletConnectButton({ 
  variant = "default", 
  size = "default",
  className = ""
}: WalletConnectButtonProps) {
  const { isConnected, isConnecting, address, connect, disconnect } = useWalletConnection();

  return (
    <ToxicButton
      variant={variant}
      size={size}
      className={className}
      onClick={isConnected ? disconnect : connect}
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : isConnected ? (
        <>
          <ShieldAlert className="h-4 w-4 mr-2 text-toxic-neon" />
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </>
      )}
    </ToxicButton>
  );
}
