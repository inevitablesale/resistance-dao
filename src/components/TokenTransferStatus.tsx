
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Clipboard, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import { 
  getTokenTransferStatusMessage, 
  TokenTransferStatus, 
  getTokenTransferProgress 
} from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { verifyBountyTokenTransfer } from '@/services/bountyService';
import { useWalletProvider } from '@/hooks/useWalletProvider';

interface TokenTransferStatusProps {
  bountyId: string;
  holdingAddress: string;
  tokenAddress: string;
  tokenType: "erc20" | "erc721" | "erc1155";
  status: TokenTransferStatus;
  currentAmount?: string;
  targetAmount?: string;
  onStatusChange?: (status: TokenTransferStatus) => void;
}

export function TokenTransferStatus({
  bountyId,
  holdingAddress,
  tokenAddress,
  tokenType,
  status,
  currentAmount = "0",
  targetAmount = "0",
  onStatusChange
}: TokenTransferStatusProps) {
  const [transferStatus, setTransferStatus] = useState<TokenTransferStatus>(status);
  const [isVerifying, setIsVerifying] = useState(false);
  const [current, setCurrent] = useState(currentAmount);
  const [target, setTarget] = useState(targetAmount);
  const [missingTokens, setMissingTokens] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  const { toast } = useToast();
  const { getProvider } = useWalletProvider();
  
  // Copy holding address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(holdingAddress);
    toast({
      title: "Address Copied",
      description: "Holding address copied to clipboard"
    });
  };
  
  // Verify token transfer
  const verifyTransfer = async () => {
    try {
      setIsVerifying(true);
      
      const { provider } = await getProvider();
      const result = await verifyBountyTokenTransfer(bountyId, provider);
      
      setTransferStatus(result.status);
      setCurrent(result.currentAmount);
      setTarget(result.targetAmount);
      
      if (result.missingTokens) {
        setMissingTokens(result.missingTokens);
      }
      
      // Calculate progress percentage
      const progressValue = getTokenTransferProgress(
        parseFloat(result.currentAmount), 
        parseFloat(result.targetAmount)
      );
      setProgress(progressValue);
      
      // Notify parent component of status change
      if (onStatusChange) {
        onStatusChange(result.status);
      }
      
      // Show appropriate toast based on status
      if (result.status === "completed") {
        toast({
          title: "Transfer Verified",
          description: "All tokens have been received!",
          variant: "default"
        });
      } else if (result.status === "verifying") {
        toast({
          title: "Partial Transfer Detected",
          description: `Received ${result.currentAmount} of ${result.targetAmount} tokens`,
          variant: "default"
        });
      } else if (result.status === "failed") {
        toast({
          title: "Verification Failed",
          description: "Could not verify token transfer",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error verifying transfer:", error);
      toast({
        title: "Verification Error",
        description: error instanceof Error ? error.message : "Failed to verify token transfer",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Update progress when current/target amounts change
  useEffect(() => {
    const progressValue = getTokenTransferProgress(
      parseFloat(current), 
      parseFloat(target)
    );
    setProgress(progressValue);
  }, [current, target]);
  
  // Select alert variant based on status
  const getAlertVariant = () => {
    switch (transferStatus) {
      case "completed":
        return "default";
      case "verifying":
        return "default";
      case "failed":
        return "destructive";
      default:
        return "default";
    }
  };
  
  // Get icon based on status
  const getStatusIcon = () => {
    switch (transferStatus) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Get token type display text
  const getTokenTypeDisplay = () => {
    switch (tokenType) {
      case "erc20":
        return "tokens";
      case "erc721":
        return "NFTs";
      case "erc1155":
        return "tokens";
      default:
        return "tokens";
    }
  };
  
  return (
    <div className="space-y-4">
      <Alert variant={getAlertVariant()}>
        <AlertTitle className="flex items-center">
          {getStatusIcon()}
          <span className="ml-2">{getTokenTransferStatusMessage(transferStatus)}</span>
        </AlertTitle>
        <AlertDescription>
          Transfer your {getTokenTypeDisplay()} to the holding address below to activate your pool.
        </AlertDescription>
      </Alert>
      
      <div className="p-4 border rounded-md bg-muted/50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Holding Address:</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyToClipboard} 
            className="h-8 gap-1"
          >
            <Clipboard className="h-4 w-4" />
            Copy
          </Button>
        </div>
        <code className="block p-2 bg-background rounded text-xs break-all">
          {holdingAddress}
        </code>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress:</span>
            <span>{current} / {target} {getTokenTypeDisplay()}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {missingTokens.length > 0 && (
          <div className="mt-4">
            <span className="text-sm font-medium">Missing tokens:</span>
            <ul className="mt-1 text-xs space-y-1">
              {missingTokens.map((token, i) => (
                <li key={i} className="text-muted-foreground">{token}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <Button 
        onClick={verifyTransfer} 
        disabled={isVerifying}
        className="w-full"
      >
        {isVerifying ? (
          <>
            <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Verify Transfer
          </>
        )}
      </Button>
    </div>
  );
}
