
import React, { useState } from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { Target, Copy, Share2, Check, Users, ChevronRight, DollarSign, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useReferrals } from '@/hooks/useReferrals';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import { SettlementsNavBar } from '@/components/settlements/SettlementsNavBar';
import { Button } from '@/components/ui/button';
import { ReferralSystem } from '@/components/radiation/ReferralSystem';
import { formatDistance } from 'date-fns';

const ReferralsPage: React.FC = () => {
  const { isConnected } = useCustomWallet();
  const [copied, setCopied] = useState(false);
  const { 
    referrals, 
    stats, 
    isLoadingReferrals, 
    referralLink, 
    copyReferralLink,
    shareReferralLink,
    refetchReferrals,
    processPayments,
    isProcessingPayments
  } = useReferrals();

  const timeAgo = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (e) {
      return 'unknown time';
    }
  };

  const copyToClipboard = () => {
    copyReferralLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto py-8 px-4 max-w-6xl pt-32">
        <SettlementsNavBar />
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Referral System Component */}
          <div className="md:col-span-1">
            <ReferralSystem className="sticky top-32" />
          </div>
          
          {/* Referral Details */}
          <div className="md:col-span-2 space-y-6">
            <ToxicCard className="bg-black/80 border-toxic-neon/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-toxic-neon">Your Referral Dashboard</h2>
                <Button
                  onClick={() => refetchReferrals()}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-toxic-neon bg-black/40 border-toxic-neon/30"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-black/60 rounded-lg p-3 border border-white/5">
                  <div className="text-white/60 text-sm mb-1">Total Referrals</div>
                  <div className="text-2xl font-mono text-toxic-neon">{stats.totalReferrals}</div>
                </div>
                <div className="bg-black/60 rounded-lg p-3 border border-white/5">
                  <div className="text-white/60 text-sm mb-1">Pending</div>
                  <div className="text-2xl font-mono text-toxic-neon">{stats.pendingReferrals}</div>
                </div>
                <div className="bg-black/60 rounded-lg p-3 border border-white/5">
                  <div className="text-white/60 text-sm mb-1">Completed</div>
                  <div className="text-2xl font-mono text-toxic-neon">{stats.completedReferrals}</div>
                </div>
                <div className="bg-black/60 rounded-lg p-3 border border-white/5">
                  <div className="text-white/60 text-sm mb-1">Total Earned</div>
                  <div className="text-2xl font-mono text-toxic-neon">${stats.earnings}</div>
                </div>
              </div>
              
              {stats.pendingPayouts > 0 && (
                <div className="mb-6 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="text-amber-400 font-medium">Pending Payments</div>
                    <div className="text-sm text-white/70">You have ${stats.pendingPayouts} in pending payments</div>
                  </div>
                  <ToxicButton
                    variant="primary"
                    onClick={() => processPayments()}
                    disabled={isProcessingPayments}
                  >
                    {isProcessingPayments ? "Processing..." : "Process Now"}
                  </ToxicButton>
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-white font-medium mb-2">Your Referral Link</h3>
                <div className="relative">
                  <Input 
                    value={referralLink}
                    readOnly
                    className="bg-black/50 border-toxic-neon/30 text-toxic-neon pr-10"
                  />
                  <button 
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-toxic-neon/60 hover:text-toxic-neon"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <ToxicButton 
                  variant="outline"
                  onClick={copyToClipboard}
                  className="border-toxic-neon/30"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </ToxicButton>
                <ToxicButton 
                  variant="outline"
                  onClick={shareReferralLink}
                  className="border-toxic-neon/30"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Link
                </ToxicButton>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-3">Referral History</h3>
                {isLoadingReferrals ? (
                  <div className="text-center py-8 text-white/60">Loading referrals...</div>
                ) : referrals.length === 0 ? (
                  <div className="text-center py-8 bg-black/40 rounded-lg border border-toxic-neon/10">
                    <Target className="h-12 w-12 text-toxic-neon/30 mx-auto mb-3" />
                    <p className="text-white/70 mb-2">No referrals yet</p>
                    <p className="text-sm text-white/50 max-w-sm mx-auto mb-4">
                      Share your referral link to start earning rewards when people purchase NFTs
                    </p>
                    <ToxicButton variant="outline" onClick={shareReferralLink} className="border-toxic-neon/30">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Link
                    </ToxicButton>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {referrals.map((referral) => (
                      <div 
                        key={referral.id} 
                        className={`p-3 rounded-lg border ${
                          referral.nft_purchased 
                            ? "bg-green-900/20 border-green-500/30" 
                            : "bg-black/40 border-white/10"
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="truncate max-w-[180px] md:max-w-[300px]">
                            <div className="text-toxic-neon font-mono text-sm truncate">
                              {referral.referred_address}
                            </div>
                            <div className="text-white/60 text-xs">
                              Referred {timeAgo(referral.referral_date)}
                            </div>
                          </div>
                          <div className="text-right">
                            {referral.nft_purchased ? (
                              <>
                                <div className="text-green-400 font-medium">Completed</div>
                                <div className="text-white/60 text-xs">
                                  {referral.payment_processed ? "Payment sent" : "Payment pending"}
                                </div>
                              </>
                            ) : (
                              <div className="text-white/60 font-medium">Pending</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ToxicCard>
            
            <ToxicCard className="bg-black/80 border-toxic-neon/20 p-6">
              <h2 className="text-xl font-bold text-toxic-neon mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="flex gap-3 p-3 bg-black/40 rounded-lg border border-white/10">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-toxic-neon/20 flex items-center justify-center text-toxic-neon font-bold">1</div>
                  <div>
                    <h3 className="text-white font-medium">Share Your Referral Link</h3>
                    <p className="text-white/60 text-sm">Send your unique referral link to friends, followers, or anyone interested in joining the Resistance</p>
                  </div>
                </div>
                
                <div className="flex gap-3 p-3 bg-black/40 rounded-lg border border-white/10">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-toxic-neon/20 flex items-center justify-center text-toxic-neon font-bold">2</div>
                  <div>
                    <h3 className="text-white font-medium">They Purchase an NFT</h3>
                    <p className="text-white/60 text-sm">When someone you referred purchases a Survivor or Sentinel NFT, it's tracked automatically</p>
                  </div>
                </div>
                
                <div className="flex gap-3 p-3 bg-black/40 rounded-lg border border-white/10">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-toxic-neon/20 flex items-center justify-center text-toxic-neon font-bold">3</div>
                  <div>
                    <h3 className="text-white font-medium">Earn $25 Per Purchase</h3>
                    <p className="text-white/60 text-sm">You earn $25 for each successful referral. Rewards are paid out automatically</p>
                  </div>
                </div>
              </div>
            </ToxicCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
