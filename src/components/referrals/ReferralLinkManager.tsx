
import React, { useState } from 'react';
import { Copy, Share2, Check, QrCode } from 'lucide-react';
import { ToxicButton } from '@/components/ui/toxic-button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ReferralLinkManagerProps {
  address?: string;
}

const ReferralLinkManager: React.FC<ReferralLinkManagerProps> = ({ address }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Generate referral link based on connected wallet
  const referralLink = address 
    ? `${window.location.origin}/r/${address}` 
    : 'Connect wallet to generate your referral link';
  
  const copyToClipboard = () => {
    if (!address) return;
    
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    
    toast({
      title: "Referral Link Copied!",
      description: "Your unique referral link has been copied to clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareReferral = () => {
    if (!address) return;
    
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
  
  const showQRCode = () => {
    if (!address) return;
    
    toast({
      title: "QR Code Feature",
      description: "QR code generation will be available in the next update.",
    });
  };

  return (
    <div className="space-y-3">
      <div>
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
      
      <div className="grid grid-cols-3 gap-3">
        <ToxicButton 
          variant="outline"
          onClick={copyToClipboard}
          className="border-toxic-neon/30"
          disabled={!address}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </ToxicButton>
        <ToxicButton 
          variant="outline"
          onClick={shareReferral}
          className="border-toxic-neon/30"
          disabled={!address}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </ToxicButton>
        <ToxicButton 
          variant="outline"
          onClick={showQRCode}
          className="border-toxic-neon/30"
          disabled={!address}
        >
          <QrCode className="h-4 w-4 mr-2" />
          QR Code
        </ToxicButton>
      </div>
    </div>
  );
};

export default ReferralLinkManager;
