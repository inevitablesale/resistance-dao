
import React, { useState } from 'react';
import { Link, ArrowRight, Copy, Clock, UserPlus, Sparkles } from 'lucide-react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useReferralSystem } from '@/hooks/useReferralSystem';
import { ToxicCard, ToxicCardHeader, ToxicCardTitle, ToxicCardContent, ToxicCardFooter } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function NFTReferralDashboard() {
  const { primaryWallet } = useDynamicContext();
  const { 
    referrals, 
    referralLink, 
    stats, 
    loading, 
    copyReferralLink 
  } = useReferralSystem();
  
  // Generate a shortened display version of wallet addresses
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <ToxicCard className="bg-black/50 border border-toxic-neon/30">
        <ToxicCardHeader>
          <ToxicCardTitle>Your Referral Dashboard</ToxicCardTitle>
        </ToxicCardHeader>
        <ToxicCardContent>
          {!primaryWallet ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto bg-black/60 rounded-full flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-toxic-neon" />
              </div>
              <h3 className="text-lg font-medium text-white">Connect Your Wallet</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Connect your wallet to generate your unique referral link and start earning rewards.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/60 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <UserPlus className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Total Referrals</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">{stats.totalReferrals}</span>
                </div>
                
                <div className="bg-black/60 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Pending Rewards</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">{stats.pendingReferrals}</span>
                </div>
                
                <div className="bg-black/60 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Total Earnings</span>
                  </div>
                  <span className="text-2xl font-bold text-toxic-neon block">{stats.totalEarnings} MATIC</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Your Referral Link</h3>
                <div className="flex bg-black/60 rounded-md border border-toxic-neon/30 p-2 items-center">
                  <div className="flex-1 truncate font-mono text-sm text-gray-300 px-2">
                    {referralLink}
                  </div>
                  <ToxicButton onClick={copyReferralLink} size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </ToxicButton>
                </div>
                <p className="text-sm text-gray-400">
                  Share this link to earn rewards when users mint NFTs through your referral.
                </p>
              </div>
              
              <Tabs defaultValue="active">
                <TabsList className="bg-black/60 border border-gray-800">
                  <TabsTrigger value="active">Active Referrals</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="mt-4 space-y-2">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-toxic-neon"></div>
                    </div>
                  ) : referrals.filter(r => r.status === 'pending' || r.status === 'active').length === 0 ? (
                    <div className="text-center py-8 bg-black/30 rounded-lg border border-gray-800">
                      <Link className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400">You don't have any active referrals yet.</p>
                      <p className="text-sm text-gray-500 mt-1">Share your referral link to start earning.</p>
                    </div>
                  ) : (
                    referrals
                      .filter(r => r.status === 'pending' || r.status === 'active')
                      .map(referral => (
                        <div 
                          key={referral.id}
                          className="bg-black/40 p-4 rounded-lg border border-toxic-neon/20 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-mono text-gray-300">{shortenAddress(referral.referredAddress)}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(referral.referralDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <ToxicBadge variant="status">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {referral.status}
                            </ToxicBadge>
                          </div>
                        </div>
                      ))
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="mt-4 space-y-2">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-toxic-neon"></div>
                    </div>
                  ) : referrals.filter(r => r.status === 'completed').length === 0 ? (
                    <div className="text-center py-8 bg-black/30 rounded-lg border border-gray-800">
                      <Sparkles className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400">No completed referrals yet.</p>
                      <p className="text-sm text-gray-500 mt-1">Completed referrals will appear here.</p>
                    </div>
                  ) : (
                    referrals
                      .filter(r => r.status === 'completed')
                      .map(referral => (
                        <div 
                          key={referral.id}
                          className="bg-black/40 p-4 rounded-lg border border-toxic-neon/20 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-mono text-gray-300">{shortenAddress(referral.referredAddress)}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(referral.referralDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-toxic-neon font-medium">
                              +{referral.rewardAmount} MATIC
                            </span>
                            <ToxicBadge variant="success">Completed</ToxicBadge>
                          </div>
                        </div>
                      ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </ToxicCardContent>
        <ToxicCardFooter className="border-t border-toxic-neon/20 flex items-center justify-between">
          <span className="text-xs text-gray-500">Rewards automatically sent to your wallet</span>
          <ToxicButton variant="outline" size="sm" as="a" href="/marketplace/bounty-hunters">
            View All Bounties
            <ArrowRight className="ml-2 h-4 w-4" />
          </ToxicButton>
        </ToxicCardFooter>
      </ToxicCard>
    </div>
  );
}
