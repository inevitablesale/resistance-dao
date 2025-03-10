
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Send } from "lucide-react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { sentinelContributeToParty } from "@/services/partyProtocolService";
import { useWalletConnection } from "@/hooks/useWalletConnection";

interface ContributionPanelProps {
  settlementId: string;
  settlementName: string;
  onSuccess?: () => void;
}

export const ContributionPanel = ({ settlementId, settlementName, onSuccess }: ContributionPanelProps) => {
  const [contribution, setContribution] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  const { primaryWallet } = useDynamicContext();
  const { isConnected, connect } = useWalletConnection();
  const { toast } = useToast();

  const handleContribute = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to contribute to this settlement",
      });
      connect();
      return;
    }
    
    if (!primaryWallet || !contribution || !settlementId) {
      toast({
        title: "Invalid Contribution",
        description: "Please enter a valid contribution amount",
        variant: "destructive",
      });
      return;
    }
    
    setIsContributing(true);
    try {
      toast({
        title: "Processing Contribution...",
        description: "Please approve the transaction",
      });
      
      await sentinelContributeToParty(
        primaryWallet, 
        settlementId,
        contribution,
        undefined,
        `Contributing to ${settlementName}`
      );
      
      toast({
        title: "Contribution Successful!",
        description: `You've contributed ${contribution} ETH to the settlement.`,
      });
      
      // Reset form and notify parent component
      setContribution("");
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Error contributing:", error);
      toast({
        title: "Contribution Failed",
        description: error.message || "An error occurred while processing your contribution.",
        variant: "destructive",
      });
    } finally {
      setIsContributing(false);
    }
  };

  return (
    <div className="bg-[#111] rounded-xl border border-white/5 p-6 space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-400" />
        Sentinel Contribution
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">Contribution Amount (ETH)</label>
          <div className="flex mt-1">
            <Input
              type="number"
              placeholder="0.0"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              className="bg-black/50 border-white/10"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        <Button
          onClick={handleContribute}
          disabled={isContributing || !contribution || parseFloat(contribution) <= 0}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {isContributing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Contribute to Settlement
            </>
          )}
        </Button>
        
        <div className="text-xs text-gray-400">
          By contributing, you'll receive governance rights in this settlement proportional to your contribution.
        </div>
      </div>
    </div>
  );
};
