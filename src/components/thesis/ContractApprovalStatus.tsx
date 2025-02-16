
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useTokenBalances } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { Check, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";

interface ContractApprovalStatusProps {
  onApprovalComplete: () => void;
  requiredAmount: string;
}

export const ContractApprovalStatus = ({
  onApprovalComplete,
  requiredAmount
}: ContractApprovalStatusProps) => {
  const { approveLGR, address } = useWalletConnection();
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { tokenBalances } = useTokenBalances({
    networkId: 137,
    accountAddress: address,
    includeFiat: false,
    includeNativeBalance: false,
    tokenAddresses: [LGR_TOKEN_ADDRESS]
  });

  // Get the test mode value from the parent component
  const isTestMode = true; // This will be received from the parent component later

  const hasRequiredBalance = isTestMode || (tokenBalances?.find(token => token.symbol === "LGR")?.balance || 0) >= Number(ethers.utils.formatEther(requiredAmount));

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const success = await approveLGR(requiredAmount);
      if (success) {
        setIsApproved(true);
        onApprovalComplete();
      }
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
            disabled={isApproving}
            className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"
          >
            {isApproving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
                Approving...
              </div>
            ) : (
              hasRequiredBalance ? "Approve" : "Insufficient LGR Balance"
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};
