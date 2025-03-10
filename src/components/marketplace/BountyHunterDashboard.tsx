
import React, { useState, useEffect } from "react";
import { CheckCircle2, Clock, DollarSign, ExternalLink, Trophy, Users, Copy, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle, ToxicCardDescription, ToxicCardFooter } from "@/components/ui/toxic-card";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { getUserReferrals, claimReferralRewards } from "@/services/bountyService";
import { useReferralSystem } from "@/hooks/useReferralSystem";
import ReferralLinkManager from "@/components/referrals/ReferralLinkManager";

export const BountyHunterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { primaryWallet } = useDynamicContext();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [selectedReferrals, setSelectedReferrals] = useState<string[]>([]);
  const { generateReferralLink, isGenerating } = useReferralSystem();
  
  // Load user's referrals
  useEffect(() => {
    const loadReferrals = async () => {
      if (!primaryWallet) return;
      
      try {
        setLoading(true);
        const address = await primaryWallet.address;
        const userReferrals = await getUserReferrals(address);
        setReferrals(userReferrals);
      } catch (error) {
        console.error("Error loading referrals:", error);
        toast({
          title: "Error",
          description: "Failed to load your referrals",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadReferrals();
  }, [primaryWallet]);
  
  // Calculate statistics
  const stats = {
    totalEarned: referrals
      .filter(r => r.payment_processed)
      .reduce((sum, r) => sum + parseFloat(r.reward_amount || "0"), 0),
    pendingRewards: referrals
      .filter(r => r.status === "verified" && !r.payment_processed)
      .reduce((sum, r) => sum + parseFloat(r.reward_amount || "0"), 0),
    successfulReferrals: referrals.filter(r => r.status === "verified").length,
    pendingReferrals: referrals.filter(r => r.status === "pending").length
  };
  
  // Handle claiming rewards
  const handleClaimRewards = async () => {
    if (!primaryWallet || selectedReferrals.length === 0) return;
    
    try {
      setClaiming(true);
      
      const result = await claimReferralRewards(primaryWallet, selectedReferrals);
      
      if (result.success) {
        toast({
          title: "Rewards Claimed",
          description: `Successfully claimed rewards for ${result.results.reduce((sum: number, r: any) => sum + r.referralsProcessed, 0)} referrals`,
        });
        
        // Refresh referrals
        const address = await primaryWallet.address;
        const userReferrals = await getUserReferrals(address);
        setReferrals(userReferrals);
        setSelectedReferrals([]);
      }
    } catch (error: any) {
      console.error("Error claiming rewards:", error);
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim rewards",
        variant: "destructive"
      });
    } finally {
      setClaiming(false);
    }
  };
  
  // Toggle selection of a referral
  const toggleReferralSelection = (referralId: string) => {
    if (selectedReferrals.includes(referralId)) {
      setSelectedReferrals(selectedReferrals.filter(id => id !== referralId));
    } else {
      setSelectedReferrals([...selectedReferrals, referralId]);
    }
  };
  
  // Determine if the claim button should be enabled
  const canClaim = selectedReferrals.length > 0 && !claiming;
  
  // Generate a referral link for a specific bounty
  const handleGenerateReferral = async (bountyId: string) => {
    const link = await generateReferralLink(bountyId);
    
    if (link) {
      navigator.clipboard.writeText(link);
      toast({
        title: "Referral Link Generated",
        description: "Link copied to clipboard",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <ToxicCard className="bg-gray-900/60 border border-toxic-neon/40">
        <ToxicCardHeader>
          <div className="flex justify-between items-center">
            <ToxicCardTitle>Bounty Hunter Command Center</ToxicCardTitle>
            <span className="text-toxic-neon font-mono text-sm px-3 py-1 rounded-full bg-black/60 border border-toxic-neon/40">
              <DollarSign className="h-4 w-4 mr-1 inline" /> Total Earned: {stats.totalEarned} MATIC
            </span>
          </div>
          <ToxicCardDescription>
            Track your bounty hunting progress and claim rewards
          </ToxicCardDescription>
        </ToxicCardHeader>
        
        <ToxicCardContent>
          {!primaryWallet ? (
            <Alert className="bg-black/50 border-toxic-neon/30">
              <Users className="h-5 w-5 text-toxic-neon" />
              <AlertTitle className="text-white">Connect Your Wallet</AlertTitle>
              <AlertDescription className="text-gray-400">
                Connect your wallet to start hunting bounties and earning rewards
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Total Earned</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">{stats.totalEarned} MATIC</span>
                </div>
                
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Pending Rewards</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">{stats.pendingRewards} MATIC</span>
                </div>
                
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Successful Referrals</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">{stats.successfulReferrals}</span>
                </div>
                
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Pending Verification</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">{stats.pendingReferrals}</span>
                </div>
              </div>

              <div className="mb-6">
                <ReferralLinkManager address={primaryWallet?.address} />
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Your Referrals</h3>
                  
                  {stats.pendingRewards > 0 && (
                    <ToxicButton 
                      variant="primary" 
                      size="sm"
                      onClick={handleClaimRewards}
                      disabled={!canClaim}
                    >
                      {claiming ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Claiming...
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4 mr-1" />
                          Claim Selected Rewards
                        </>
                      )}
                    </ToxicButton>
                  )}
                </div>
                
                {loading ? (
                  <div className="text-center py-8 text-gray-400">Loading your referrals...</div>
                ) : referrals.length === 0 ? (
                  <div className="text-center py-8 bg-black/30 rounded-lg border border-toxic-neon/20">
                    <Trophy className="h-8 w-8 text-toxic-neon/30 mx-auto mb-3" />
                    <p className="text-white/70 mb-4">You haven't made any referrals yet</p>
                    <ToxicButton 
                      variant="primary" 
                      onClick={() => navigate("/marketplace/bounty-hunters")}
                    >
                      Browse Available Bounties
                    </ToxicButton>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {referrals.map((referral) => (
                      <div key={referral.id} className="bg-black/30 p-4 rounded-lg border border-toxic-neon/30 hover:border-toxic-neon/50 transition-all">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              {referral.status === "verified" ? (
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-400" />
                              )}
                              <h4 className="text-white font-medium">
                                {referral.bounties?.name || "Bounty"}
                              </h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                referral.status === "verified" 
                                  ? "bg-green-500/20 text-green-400" 
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}>
                                {referral.status === "verified" ? "Verified" : "Pending"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              Referred: {referral.referred_address.substring(0, 6)}...{referral.referred_address.substring(referral.referred_address.length - 4)}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {referral.status === "verified" && !referral.payment_processed && (
                              <input
                                type="checkbox"
                                checked={selectedReferrals.includes(referral.id)}
                                onChange={() => toggleReferralSelection(referral.id)}
                                className="h-4 w-4 rounded border-toxic-neon/40 bg-black/50"
                              />
                            )}
                            <span className="text-lg font-mono text-toxic-neon">
                              {referral.reward_amount} MATIC
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                          <span>
                            {new Date(referral.created_at).toLocaleDateString()}
                          </span>
                          
                          <div className="flex gap-2">
                            {referral.bounty_id && (
                              <button 
                                onClick={() => handleGenerateReferral(referral.bounty_id)}
                                className="flex items-center gap-1 text-toxic-neon/70 hover:text-toxic-neon"
                              >
                                <Share2 className="h-3 w-3" />
                                Share
                              </button>
                            )}
                            
                            {referral.payment_tx_hash && (
                              <a 
                                href={`https://polygonscan.com/tx/${referral.payment_tx_hash}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-toxic-neon/70 hover:text-toxic-neon"
                              >
                                <ExternalLink className="h-3 w-3" />
                                View Transaction
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </ToxicCardContent>
        
        <ToxicCardFooter>
          <ToxicButton 
            variant="outline" 
            onClick={() => navigate("/marketplace/bounty-hunters")}
          >
            Browse Bounties
          </ToxicButton>
        </ToxicCardFooter>
      </ToxicCard>
    </div>
  );
};

export default BountyHunterDashboard;
