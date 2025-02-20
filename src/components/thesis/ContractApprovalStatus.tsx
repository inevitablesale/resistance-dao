
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useTokenBalances } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { Check, AlertTriangle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { executeTransaction } from "@/services/transactionManager";
import { TransactionStatus } from "./TransactionStatus";
import { useDynamicUtils } from "@/hooks/useDynamicUtils";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { transactionQueue } from "@/services/transactionQueueService";
import { getContractStatus } from "@/services/proposalContractService";

const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";
const TESTER_ADDRESS = "0x7b1B2b967923bC3EB4d9Bf5472EA017Ac644e4A2";

interface ContractApprovalStatusProps {
  onApprovalComplete: (formData: any, approvalTx?: ethers.ContractTransaction, isTestMode?: boolean) => void;
  requiredAmount: ethers.BigNumberish;
  isTestMode?: boolean;
  currentFormData: any;
}

export const ContractApprovalStatus = ({
  onApprovalComplete,
  requiredAmount,
  isTestMode = false,
  currentFormData
}: ContractApprovalStatusProps) => {
  const { approveLGR, address, wallet } = useWalletConnection();
  const { getProvider, getWalletType } = useWalletProvider();
  const { isInitializing } = useDynamicUtils();
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [currentTxId, setCurrentTxId] = useState<string | null>(null);
  const [isTesterWallet, setIsTesterWallet] = useState(false);
  const [contractTestMode, setContractTestMode] = useState(false);
  const [isWalletReady, setIsWalletReady] = useState(false);
  const approvalCompletedRef = useRef(false);
  const { toast } = useToast();

  const { tokenBalances } = useTokenBalances({
    networkId: 137,
    accountAddress: address,
    includeFiat: false,
    includeNativeBalance: false,
    tokenAddresses: [LGR_TOKEN_ADDRESS]
  });

  const requiredAmountBN = ethers.BigNumber.from(requiredAmount);
  
  const hasRequiredBalance = tokenBalances?.find(token => 
    token.symbol === "LGR" && ethers.BigNumber.from(token.balance || "0").gte(requiredAmountBN)
  );

  useEffect(() => {
    const checkWalletStatus = async () => {
      if (wallet && !isInitializing) {
        try {
          const isConnected = await wallet.isConnected();
          setIsWalletReady(isConnected);
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          setIsWalletReady(false);
        }
      } else {
        setIsWalletReady(false);
      }
    };

    checkWalletStatus();
  }, [wallet, isInitializing]);

  useEffect(() => {
    const checkTestMode = async () => {
      if (!isWalletReady || !wallet || !address) {
        console.log("Wallet not ready for test mode check");
        return;
      }

      try {
        console.log("Checking test mode status...");
        const contractStatus = await getContractStatus(wallet);
        const isTester = address.toLowerCase() === TESTER_ADDRESS.toLowerCase();
        setIsTesterWallet(isTester);
        setContractTestMode(false); // Force test mode to false
        console.log("Test mode status:", {
          isTesterWallet: isTester,
          contractTestMode: false,
          walletAddress: address,
          testerAddress: TESTER_ADDRESS
        });
      } catch (error) {
        console.error("Error checking test mode:", error);
      }
    };

    checkTestMode();
  }, [wallet, address, isWalletReady]);

  const handleApprove = async () => {
    if (isApproving || isApproved || !isWalletReady || approvalCompletedRef.current) return;
    setIsApproving(true);
    try {
      console.log("Starting approval process...", {
        walletAddress: address,
        testerAddress: TESTER_ADDRESS,
        isTesterWallet,
        contractTestMode: false, // Always false now
        isTestMode: false, // Always false now
        currentFormData
      });
      
      if (wallet) {
        const contractStatus = await getContractStatus(wallet);
        console.log("Contract status:", {
          isTestMode: false,
          testerAddress: contractStatus.tester,
          connectedAddress: address,
          isTesterWallet: address?.toLowerCase() === contractStatus.tester.toLowerCase()
        });
      }
      
      // Always proceed with real LGR approval
      const walletProvider = await getProvider();
      const walletType = getWalletType();
      const network = await walletProvider.getNetwork();
      console.log('Network before transaction:', {
        chainId: network.chainId,
        name: network.name
      });

      const txId = await transactionQueue.addTransaction({
        type: 'token',
        description: `Approve ${ethers.utils.formatEther(requiredAmountBN)} LGR tokens`
      });
      setCurrentTxId(txId);

      const transaction = await executeTransaction(
        async () => {
          console.log("Executing real LGR approval transaction...");
          return approveLGR(requiredAmount.toString(), false); // Always false for real approval
        },
        {
          type: 'token',
          description: `Approve ${ethers.utils.formatEther(requiredAmountBN)} LGR tokens`,
          timeout: 180000,
          maxRetries: 3,
          backoffMs: 5000,
          tokenConfig: {
            tokenAddress: LGR_TOKEN_ADDRESS,
            spenderAddress: address!,
            amount: requiredAmount.toString(),
            isTestMode: false // Always false for real approval
          },
          walletType
        },
        walletProvider.provider
      );

      console.log("Transaction executed:", transaction);
      if (!approvalCompletedRef.current) {
        approvalCompletedRef.current = true;
        setIsApproved(true);
        onApprovalComplete(currentFormData, transaction, false); // Always false for real tx
      }
    } catch (error) {
      console.error("Approval error:", error);
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Failed to approve contract",
        variant: "destructive"
      });
      approvalCompletedRef.current = false;
    } finally {
      setIsApproving(false);
    }
  };

  const handleTxComplete = () => {
    console.log("Transaction completed");
    if (!approvalCompletedRef.current) {
      approvalCompletedRef.current = true;
      setIsApproved(true);
      onApprovalComplete(currentFormData, undefined, false); // Always false for real tx
    }
  };

  const handleTxError = (error: string) => {
    console.error("Transaction failed:", error);
    approvalCompletedRef.current = false;
    toast({
      title: "Transaction Failed",
      description: error,
      variant: "destructive"
    });
  };

  useEffect(() => {
    setIsApproved(false);
    setIsApproving(false);
    approvalCompletedRef.current = false;
    setCurrentTxId(null);
  }, [isTestMode]);

  if (!isWalletReady) {
    return (
      <Card className="bg-black/40 border-white/10 p-4">
        <div className="flex items-center justify-center space-x-2 text-white/60">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Initializing wallet...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-white/10 p-4">
      {currentTxId && (
        <TransactionStatus
          transactionId={currentTxId}
          onComplete={handleTxComplete}
          onError={handleTxError}
        />
      )}
      
      {!currentTxId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-white">Real Contract Approval</h3>
              <p className="text-sm text-white">
                Approve {ethers.utils.formatEther(requiredAmountBN)} LGR tokens for contract interaction
              </p>
            </div>
            {isApproved ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            )}
          </div>

          {!hasRequiredBalance && (
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">
                Insufficient LGR balance. You need {ethers.utils.formatEther(requiredAmountBN)} LGR tokens.
              </p>
            </div>
          )}

          <Button
            onClick={handleApprove}
            disabled={isApproving || isApproved || !isWalletReady || !hasRequiredBalance}
            className="w-full"
          >
            {isApproving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Approving...</span>
              </div>
            ) : isApproved ? (
              "Approved"
            ) : (
              `Approve ${ethers.utils.formatEther(requiredAmountBN)} LGR`
            )}
          </Button>
        </div>
      )}
    </Card>
  );
};

