
import { useState } from 'react';
import { ChevronRight, Copy, ExternalLink, Check, RefreshCw, Plus, Tag, Award, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { ToxicCard, ToxicCardHeader, ToxicCardTitle, ToxicCardContent, ToxicCardFooter } from '@/components/ui/toxic-card';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { useReferrals } from '@/hooks/useReferrals';
import { formatDistanceToNow } from 'date-fns';
import { ethers } from 'ethers';
import { ReferralInfo, ReferralReward } from '@/services/referralService';

export const ReferralDashboard = () => {
  const {
    referrals,
    isLoadingReferrals,
    isCreatingReferral,
    useReferralRewards,
    createReferral,
    generateReferralLink,
    canCreateReferral,
    refetchReferrals
  } = useReferrals();
  
  const [selectedReferral, setSelectedReferral] = useState<ReferralInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: selectedRewards = [], isLoading: isLoadingRewards } = 
    useReferralRewards(selectedReferral?.referralId || '');
  
  const handleCopyLink = (referralCode: string) => {
    const link = generateReferralLink(referralCode);
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    refetchReferrals().finally(() => {
      setTimeout(() => setIsRefreshing(false), 1000);
    });
  };
  
  const handleCreateReferral = () => {
    if (canCreateReferral) {
      createReferral();
    }
  };
  
  return (
    <div className="p-6 bg-black/60 border border-toxic-neon/30 rounded-xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-mono text-toxic-neon mb-1">Bounty Hunter Referrals</h2>
          <p className="text-white/60 text-sm">
            Refer survivors and earn rewards when they make purchases
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-1 border-toxic-neon/20 text-toxic-neon"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <ToxicButton 
            size="sm" 
            onClick={handleCreateReferral}
            disabled={isCreatingReferral || !canCreateReferral}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            {isCreatingReferral ? 'Creating...' : 'New Referral'}
          </ToxicButton>
        </div>
      </div>
      
      {!canCreateReferral && (
        <div className="p-4 bg-red-900/30 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-white">Bounty Hunter Role Required</h3>
              <p className="text-white/70">Only Bounty Hunters can create referrals and earn rewards.</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-sm font-medium text-white/80">Your Referral Codes</h3>
          
          {isLoadingReferrals ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse bg-white/5 rounded-lg h-16"></div>
              ))}
            </div>
          ) : referrals.length === 0 ? (
            <div className="bg-white/5 rounded-lg p-4 text-center text-white/60">
              <p>No referral codes yet</p>
              {canCreateReferral && (
                <Button 
                  variant="link" 
                  onClick={handleCreateReferral}
                  className="text-toxic-neon mt-2"
                >
                  Create your first referral code
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {referrals.map((referral) => (
                <ToxicCard 
                  key={referral.referralId}
                  onClick={() => setSelectedReferral(referral)}
                  className={`cursor-pointer transition-all ${
                    selectedReferral?.referralId === referral.referralId 
                      ? 'border-toxic-neon' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <ToxicCardContent className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-mono text-toxic-neon">{referral.referralCode}</div>
                      <div className="text-sm text-white/60">
                        {formatDistanceToNow(referral.createdAt * 1000, { addSuffix: true })}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </ToxicCardContent>
                </ToxicCard>
              ))}
            </div>
          )}
        </div>
        
        <div className="md:col-span-2">
          {selectedReferral ? (
            <ToxicCard className="h-full">
              <ToxicCardHeader>
                <ToxicCardTitle className="flex justify-between items-center">
                  <span>Referral Details</span>
                  <ToxicBadge variant={selectedReferral.active ? "success" : "destructive"}>
                    {selectedReferral.active ? "Active" : "Inactive"}
                  </ToxicBadge>
                </ToxicCardTitle>
              </ToxicCardHeader>
              
              <ToxicCardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-white/60">Code</div>
                    <div className="font-mono text-lg text-toxic-neon">{selectedReferral.referralCode}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-white/60">Created</div>
                    <div className="text-white">
                      {new Date(selectedReferral.createdAt * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-white/60">Referral Link</div>
                  <div className="flex items-center gap-2">
                    <div className="bg-black/40 p-2 rounded border border-toxic-neon/20 text-white/80 flex-1 truncate font-mono text-sm">
                      {generateReferralLink(selectedReferral.referralCode)}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleCopyLink(selectedReferral.referralCode)}
                      className="shrink-0"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-white/60">Rewards</div>
                    <div className="text-sm text-white/60">
                      {selectedReferral.rewardsClaimed} / {selectedRewards.length} claimed
                    </div>
                  </div>
                  
                  <ToxicProgress 
                    value={(selectedReferral.rewardsClaimed / Math.max(selectedRewards.length, 1)) * 100} 
                    className="h-2"
                  />
                  
                  <div className="text-lg font-mono text-toxic-neon">
                    {ethers.utils.formatEther(selectedReferral.totalEarned.toString())} ETH
                    <span className="text-sm text-white/60 ml-2">total earned</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm text-white/60">Recent Rewards</div>
                  
                  {isLoadingRewards ? (
                    <div className="space-y-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse bg-white/5 rounded-lg h-12"></div>
                      ))}
                    </div>
                  ) : selectedRewards.length === 0 ? (
                    <div className="bg-white/5 rounded-lg p-4 text-center text-white/60">
                      <p>No rewards yet</p>
                      <p className="text-sm">Share your referral link to earn rewards</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {selectedRewards.map((reward: ReferralReward) => (
                        <div 
                          key={reward.referralId + reward.timestamp}
                          className="bg-white/5 rounded-lg p-3 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium text-white truncate">
                              From: {reward.purchaser.substring(0, 6)}...{reward.purchaser.substring(38)}
                            </div>
                            <div className="text-sm text-white/60">
                              {formatDistanceToNow(reward.timestamp * 1000, { addSuffix: true })}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="font-mono text-toxic-neon">
                              {ethers.utils.formatEther(reward.amount)} ETH
                            </div>
                            <ToxicBadge variant={reward.claimed ? "success" : "default"} className="text-xs">
                              {reward.claimed ? "Claimed" : "Pending"}
                            </ToxicBadge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ToxicCardContent>
              
              <ToxicCardFooter>
                <div className="flex justify-between items-center w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 border-toxic-neon/20 text-toxic-neon"
                    onClick={() => window.open(`https://etherscan.io/address/${selectedReferral.partyAddress}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Party Contract
                  </Button>
                  
                  <ToxicButton
                    size="sm"
                    className="gap-1"
                  >
                    <Gift className="w-4 h-4" />
                    Claim All Rewards
                  </ToxicButton>
                </div>
              </ToxicCardFooter>
            </ToxicCard>
          ) : (
            <div className="h-full flex items-center justify-center bg-black/20 rounded-xl border border-white/5 p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-toxic-neon/10 text-toxic-neon mx-auto flex items-center justify-center">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-medium text-white">Select a Referral</h3>
                <p className="text-white/60 max-w-xs">
                  Select a referral code from the list to view details and track rewards
                </p>
                
                {canCreateReferral && referrals.length === 0 && (
                  <ToxicButton 
                    onClick={handleCreateReferral}
                    disabled={isCreatingReferral}
                    className="gap-1 mt-4"
                  >
                    <Plus className="w-4 h-4" />
                    {isCreatingReferral ? 'Creating...' : 'Create Your First Referral'}
                  </ToxicButton>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
