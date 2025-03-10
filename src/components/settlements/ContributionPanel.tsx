
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Shield, Send, Info } from "lucide-react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { sentinelContributeToParty } from "@/services/partyProtocolService";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { 
  calculatePriceStructure, 
  formatEthAmount,
  PriceBreakdown 
} from "@/utils/priceCalculator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ReferralInfo {
  referrerAddress: string;
  referredAddress: string;
  referralDate: string;
  nftPurchased: boolean;
  paymentProcessed: boolean;
}

interface ContributionPanelProps {
  settlementId: string;
  settlementName: string;
  onSuccess?: () => void;
}

export const ContributionPanel = ({ settlementId, settlementName, onSuccess }: ContributionPanelProps) => {
  const [contribution, setContribution] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
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

  // Calculate price breakdown when contribution changes
  useEffect(() => {
    if (contribution && !isNaN(parseFloat(contribution))) {
      const desiredAmount = parseFloat(contribution);
      // Calculate price breakdown including Party DAO fees and referral rewards
      const breakdown = calculatePriceStructure(desiredAmount);
      setPriceBreakdown(breakdown);
    } else {
      setPriceBreakdown(null);
    }
  }, [contribution]);

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
      
      // If we have a price breakdown, use the gross amount for the transaction
      const contributionAmount = priceBreakdown 
        ? formatEthAmount(priceBreakdown.grossPrice) 
        : contribution;
      
      await sentinelContributeToParty(
        primaryWallet, 
        settlementId,
        contributionAmount,
        undefined,
        `Contributing to ${settlementName}`
      );
      
      toast({
        title: "Contribution Successful!",
        description: `You've contributed ${contributionAmount} ETH to the settlement.`,
      });
      
      // If this user was referred, record the purchase completion
      if (referrer) {
        console.log(`Referral purchase completed. Referrer: ${referrer}, Buyer: ${address}`);
        
        // Update the referral in localStorage to mark as purchased
        const storedReferrals = localStorage.getItem(`referrals_${referrer}`);
        if (storedReferrals) {
          const referrals: ReferralInfo[] = JSON.parse(storedReferrals);
          const updatedReferrals = referrals.map(ref => {
            if (ref.referredAddress === address) {
              return { ...ref, nftPurchased: true };
            }
            return ref;
          });
          
          localStorage.setItem(`referrals_${referrer}`, JSON.stringify(updatedReferrals));
        }
        
        // Notify the user about the referral bonus
        toast({
          title: "Referral Recorded",
          description: "Your purchase has been credited to your referrer.",
        });
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
          
          {priceBreakdown && (
            <div className="mt-2 text-xs space-y-1 bg-black/30 p-2 rounded border border-toxic-neon/10">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1 text-gray-400">
                        Party DAO Fee (2.5%)
                        <Info className="h-3 w-3 text-gray-500" />
                      </span>
                      <span className="text-red-400">-{formatEthAmount(priceBreakdown.partyDaoFee)} ETH</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black border border-toxic-neon/30 text-xs">
                    <p>Party Protocol charges a 2.5% fee on all transactions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {referrer && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Referral Reward</span>
                  <span className="text-amber-400">-{formatEthAmount(priceBreakdown.referralAmount)} ETH</span>
                </div>
              )}
              
              <div className="flex justify-between pt-1 border-t border-toxic-neon/10">
                <span className="font-medium text-toxic-neon">Final Settlement Amount</span>
                <span className="font-medium">{formatEthAmount(priceBreakdown.finalRevenue)} ETH</span>
              </div>
            </div>
          )}
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
