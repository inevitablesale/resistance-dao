
import React, { useState } from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { Target, Copy, Share2, Check, ArrowUp, Coins } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import { useToast } from '@/hooks/use-toast';

interface ReferralSystemProps {
  earnings?: number;
  totalReferrals?: number;
  className?: string;
}

export function ReferralSystem({ earnings = 0, totalReferrals = 0, className = "" }: ReferralSystemProps) {
  const { address, isConnected } = useCustomWallet();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Generate referral link based on connected wallet
  const referralLink = isConnected && address 
    ? `${window.location.origin}/r/${address}` 
    : 'Connect wallet to generate your referral link';
  
  const copyToClipboard = () => {
    if (!isConnected) return;
    
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    
    toast({
      title: "Referral Link Copied!",
      description: "Your unique referral link has been copied to clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareReferral = () => {
    if (!isConnected) return;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join the Wasteland Resistance',
        text: 'Claim your free NFT and help rebuild civilization in the Wasteland!',
        url: referralLink,
      });
    } else {
      copyToClipboard();
    }
  };

  return (
    <ToxicCard className={`bg-black/80 border-toxic-neon/30 p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-toxic-neon/10">
          <Target className="h-6 w-6 text-toxic-neon" />
        </div>
        <div>
          <h2 className="text-xl font-mono text-toxic-neon">Referral System</h2>
          <p className="text-white/60 text-sm">Earn 50% of every NFT purchase</p>
        </div>
      </div>
      
      {isConnected ? (
        <>
          <div className="bg-black/40 rounded-lg p-3 mb-4 border border-toxic-neon/20">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-white/70 text-sm">Total Earnings</div>
                <div className="text-xl font-mono text-toxic-neon">{earnings} MATIC</div>
              </div>
              <div className="text-center">
                <div className="text-white/70 text-sm">Total Referrals</div>
                <div className="text-xl font-mono text-toxic-neon">{totalReferrals}</div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="text-white/70 text-sm mb-2 block">Your Referral Link</label>
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
              onClick={shareReferral}
              className="border-toxic-neon/30"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </ToxicButton>
          </div>
          
          <div className="bg-black/30 p-3 rounded-lg border border-amber-500/20">
            <h3 className="text-amber-400 font-mono flex items-center mb-2">
              <Coins className="h-4 w-4 mr-2" />
              Earnings Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Sentinel Referral</span>
                <span className="text-toxic-neon">25 MATIC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Survivor Referral</span>
                <span className="text-toxic-neon">25 MATIC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Bounty Hunter</span>
                <span className="text-toxic-neon">Free Claim</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 bg-black/30 rounded-lg border border-toxic-neon/20 mb-4">
          <Target className="h-12 w-12 text-toxic-neon/30 mx-auto mb-3" />
          <p className="text-white/70 mb-4">Connect your wallet to generate your unique referral link and start earning</p>
          <ToxicButton variant="default">
            Connect Wallet
          </ToxicButton>
        </div>
      )}
      
      <div className="mt-4">
        <ToxicBadge variant="outline" className="w-full flex justify-between items-center py-2 bg-black/40 border-toxic-neon/30">
          <span className="flex items-center text-white/70">
            <ArrowUp className="h-3 w-3 mr-1 text-toxic-neon" /> Refer Friends
          </span>
          <span className="text-toxic-neon">Lower Radiation</span>
        </ToxicBadge>
      </div>
    </ToxicCard>
  );
}
