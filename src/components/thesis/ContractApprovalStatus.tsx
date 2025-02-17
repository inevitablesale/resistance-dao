
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useTokenBalances } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { Check, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TEST_FORM_DATA } from "@/data/testFormData";

const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";

interface ContractApprovalStatusProps {
  onApprovalComplete: () => void;
  requiredAmount: string;
  isTestMode?: boolean;
}

export const ContractApprovalStatus = ({
  onApprovalComplete,
  requiredAmount,
  isTestMode = false
}: ContractApprovalStatusProps) => {
  const { approveLGR, address } = useWalletConnection();
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { toast } = useToast();
  const { tokenBalances } = useTokenBalances({
    networkId: 137,
    accountAddress: address,
    includeFiat: false,
    includeNativeBalance: false,
    tokenAddresses: [LGR_TOKEN_ADDRESS]
  });

  const hasRequiredBalance = isTestMode || (tokenBalances?.find(token => token.symbol === "LGR")?.balance || 0) >= Number(ethers.utils.formatEther(requiredAmount));

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      // In test mode, save the test data to localStorage before approving
      if (isTestMode) {
        localStorage.setItem('currentTestFormData', JSON.stringify(TEST_FORM_DATA));
      }
      
      const success = await approveLGR(requiredAmount, isTestMode);
      if (success) {
        setIsApproved(true);
        toast({
          title: "Approval Successful",
          description: "Contract approved successfully",
        });
        onApprovalComplete();
      }
    } catch (error) {
      console.error("Approval error in ContractApprovalStatus:", error);
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Failed to approve contract",
        variant: "destructive"
      });
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <Card className="bg-black/40 border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isApproved ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center"
            >
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            </motion.div>
          )}
          <div>
            <h3 className="text-sm font-medium text-white">Contract Approval Required</h3>
            <p className="text-sm text-gray-400">
              {isTestMode ? (
                "Test mode: No LGR required for approval"
              ) : (
                `Approve ${ethers.utils.formatEther(requiredAmount)} LGR for submission`
              )}
            </p>
          </div>
        </div>
        {!isApproved && (
          <Button
            onClick={handleApprove}
            disabled={isApproving || (!isTestMode && !hasRequiredBalance)}
            className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"
          >
            {isApproving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
                Approving...
              </div>
            ) : (
              hasRequiredBalance || isTestMode ? "Approve" : "Insufficient LGR Balance"
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};
