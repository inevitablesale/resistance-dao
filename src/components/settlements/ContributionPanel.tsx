
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Shield, Send } from "lucide-react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { sentinelContributeToParty } from "@/services/partyProtocolService";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { supabase } from "@/integrations/supabase/client";

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
  const { address, getReferrer } = useCustomWallet();
  const { toast } = useToast();
  const [referrer, setReferrer] = useState<string | null>(null);

  // Check for referrer when component mounts
  useEffect(() => {
    if (isConnected && address) {
      const storedReferrer = getReferrer();
      if (storedReferrer) {
        setReferrer(storedReferrer);
        console.log("Contribution will be credited to referrer:", storedReferrer);
      }
    }
  }, [isConnected, address, getReferrer]);

  // Function to update referral status after successful NFT purchase
  const updateReferralStatus = async () => {
    if (!referrer || !address) return;
    
    try {
      // Update the referral to mark NFT as purchased
      const { error } = await supabase
        .from('referrals')
        .update({
          nft_purchased: true,
          purchase_date: new Date().toISOString(),
          payment_amount: 25 // $25 per referral
        })
        .eq('referrer_address', referrer)
        .eq('referred_address', address)
        .is('nft_purchased', false);
        
      if (error) throw error;
      
      console.log("Referral updated - NFT purchase recorded");
      
      // Notify the user about the referral bonus
      toast({
        title: "Referral Recorded",
        description: "Your purchase has been credited to your referrer.",
      });
    } catch (error) {
      console.error("Error updating referral status:", error);
    }
  };

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
      
      // If this user was referred, update the referral status
      if (referrer) {
        await updateReferralStatus();
      }
      
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
    <div className="bg-[#111] rounded-xl border border-toxic-neon/30 p-6 space-y-6 shadow-[0_0_15px_rgba(57,255,20,0.15)]">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-toxic-neon">
        <Shield className="w-5 h-5 text-toxic-neon" />
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
              className="bg-black/50 border-toxic-neon/20 text-white focus:border-toxic-neon/50 focus:ring-toxic-neon/20"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        <ToxicButton
          onClick={handleContribute}
          disabled={isContributing || !contribution || parseFloat(contribution) <= 0}
          variant="primary"
          className="w-full"
        >
          {isContributing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-toxic-neon border-t-transparent mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Contribute to Settlement
            </>
          )}
        </ToxicButton>
        
        <div className="text-xs text-toxic-neon/70">
          By contributing, you'll receive governance rights in this settlement proportional to your contribution.
          {referrer && (
            <div className="mt-1 text-amber-400">
              Your purchase will credit your referrer with a $25 bounty reward.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
