import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useTokenBalances } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { Check, AlertTriangle, Loader2, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { executeTransaction } from "@/services/transactionManager";
import { TransactionStatus } from "./TransactionStatus";
import { useDynamicUtils } from "@/hooks/useDynamicUtils";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { transactionQueue } from "@/services/transactionQueueService";
import { getContractStatus } from "@/services/proposalContractService";
import { cn } from "@/lib/utils";

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
  
  const hasRequiredBalance = (isTesterWallet && contractTestMode) || tokenBalances?.some(token => 
    token.symbol === "LGR" && ethers.BigNumber.from(token.balance || "0").gte(requiredAmountBN)
  ) || false;

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
        setContractTestMode(contractStatus.isTestMode);
        console.log("Test mode status:", {
          isTesterWallet: isTester,
          contractTestMode: contractStatus.isTestMode,
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
        contractTestMode,
        isTestMode,
        currentFormData
      });
      
      if (wallet) {
        const contractStatus = await getContractStatus(wallet);
        console.log("Contract status:", {
          isTestMode: contractStatus.isTestMode,
          testerAddress: contractStatus.tester,
          connectedAddress: address,
          isTesterWallet: address?.toLowerCase() === contractStatus.tester.toLowerCase()
        });
      }
      
      const effectiveTestMode = isTesterWallet && contractTestMode;
      console.log("Effective test mode:", effectiveTestMode);
      
      if (effectiveTestMode) {
        console.log("Test mode active - bypassing LGR approval");
        const txId = await transactionQueue.addTransaction({
          type: 'token',
          description: 'Test Mode: Simulating LGR approval'
        });
        setCurrentTxId(txId);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await transactionQueue.processTransaction(txId, async () => {
          return {
            success: true,
            transaction: {} as ethers.ContractTransaction,
            receipt: {} as ethers.ContractReceipt
          };
        });
        console.log("Test mode transaction completed with form data:", currentFormData);
        if (!approvalCompletedRef.current) {
          approvalCompletedRef.current = true;
          setIsApproved(true);
          onApprovalComplete(currentFormData, undefined, effectiveTestMode);
        }
        return;
      }

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
          console.log("Executing LGR approval transaction...");
          return approveLGR(requiredAmount.toString(), effectiveTestMode);
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
            isTestMode: effectiveTestMode
          },
          walletType
        },
        walletProvider.provider
      );

      console.log("Transaction executed:", transaction);
      if (!approvalCompletedRef.current) {
        approvalCompletedRef.current = true;
        setIsApproved(true);
        onApprovalComplete(currentFormData, transaction, effectiveTestMode);
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
      onApprovalComplete(currentFormData, undefined, isTesterWallet && contractTestMode);
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
      <Card className="neo-blur p-4">
        <div className="flex items-center justify-center space-x-2 text-white/60">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Initializing wallet...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="neo-blur">
      {currentTxId && (
        <TransactionStatus
          transactionId={currentTxId}
          onComplete={handleTxComplete}
          onError={handleTxError}
        />
      )}
      
      {!currentTxId && (
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  Contract Approval
                </h3>
                <p className="text-sm text-white/60">
                  {isTesterWallet && contractTestMode 
                    ? "Test Mode: Approval will be simulated"
                    : "Approve LGR tokens for contract interaction"
                  }
                </p>
              </div>
              {isApproved ? (
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
              )}
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Required Amount</span>
                <span className="font-medium text-white">
                  {ethers.utils.formatEther(requiredAmount)} LGR
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleApprove}
            disabled={isApproving || isApproved || !isWalletReady}
            className={cn(
              "w-full h-12",
              "bg-gradient-to-r from-yellow-500 to-teal-500",
              "hover:from-yellow-600 hover:to-teal-600",
              "text-white font-medium",
              "transition-all duration-300",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "rounded-lg"
            )}
          >
            {isApproving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Approving...</span>
              </div>
            ) : isApproved ? (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Approved</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                <span>Approve Contract</span>
              </div>
            )}
          </Button>

          {!hasRequiredBalance && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-red-500">
                    Insufficient LGR Balance
                  </p>
                  <p className="text-xs text-red-400/80">
                    You need at least {ethers.utils.formatEther(requiredAmount)} LGR tokens to submit a thesis
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
