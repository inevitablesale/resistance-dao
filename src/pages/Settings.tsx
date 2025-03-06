
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Facebook, Instagram, MessageSquare, Share2, ExternalLink, Shield, ChevronRight, AlertCircle } from "lucide-react";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useNFTBalance } from "@/hooks/useNFTBalance";
import { useNavigate } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const Settings: React.FC = () => {
  const { isConnected, address } = useCustomWallet();
  const { user } = useDynamicContext();
  const { toast } = useToast();
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const navigate = useNavigate();
  
  const { data: nftBalance, isLoading: isLoadingNFT } = useNFTBalance(address);
  const hasMembershipNFT = nftBalance && nftBalance > 0;
  
  // Check if this is the first visit after connecting wallet
  useEffect(() => {
    const hasVisitedReferral = localStorage.getItem('has_visited_referral');
    if (!hasVisitedReferral && isConnected) {
      setIsFirstVisit(true);
      localStorage.setItem('has_visited_referral', 'true');
    }
  }, [isConnected]);
  
  // Generate a referral link using the wallet address
  const referralLink = isConnected && address
    ? `https://www.resistancedao.xyz/r/${address}`
    : "";

  const stats = {
    linkClicks: 0, // Reset to 0 as requested
    walletsSignedUp: 0, // Changed from appointments
    nftsPurchased: 0, // Changed from invoicesBilled
    pendingRewards: "0.00",
    paidRewards: "0.00"
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareViaChannel = (channel: string) => {
    let shareUrl = '';
    
    const encodedMessage = encodeURIComponent("Join Resistance DAO with my referral link!");
    const encodedUrl = encodeURIComponent(referralLink);
    
    switch (channel) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`;
        break;
      case 'instagram':
        toast({
          title: "Instagram Sharing",
          description: "Copy the link and share it on Instagram",
        });
        return;
      case 'sms':
        shareUrl = `sms:?body=${encodedMessage} ${encodedUrl}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleBuyNFT = () => {
    navigate('/buy-membership-nft');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-10" />
        </div>

        <div className="container mx-auto py-8 px-4 max-w-6xl pt-32 relative z-10">
          {/* Under Construction Notice */}
          <Card className="mb-8 bg-yellow-900/30 border-yellow-500/30 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-200">
                This page is currently under construction. Some features may not be fully functional.
              </p>
            </CardContent>
          </Card>
          
          {isFirstVisit && isConnected && (
            <Card className="mb-8 bg-black/40 border-blue-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-blue-300 mb-2">Welcome to Resistance DAO!</h2>
                <p className="text-white/80 mb-4">
                  This is your settings dashboard where you can manage your account, 
                  referrals, and membership status.
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-500 rounded-full" />
                  <p className="text-blue-200 font-medium">
                    Share your unique link below to start earning rewards!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 bg-clip-text text-transparent">Account Settings</h1>
          </div>

          {/* Debug Card for development only */}
          {isConnected && process.env.NODE_ENV === 'development' && (
            <Card className="mb-8 bg-black/40 border-yellow-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-yellow-300">User Data Debug</h2>
                <div className="space-y-2 text-white/80 text-sm">
                  <p><span className="font-bold">Wallet Address:</span> {address || 'Not connected'}</p>
                  <p><span className="font-bold">Referral Link:</span> {referralLink || 'No referral link'}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Membership NFT Status */}
          <Card className="mb-8 bg-black/40 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Membership Status</h2>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">DAO Membership NFT</div>
                    <div className="text-white/60 text-sm">Required for governance and rewards</div>
                  </div>
                </div>
                
                {isLoadingNFT ? (
                  <div className="text-white/60">Loading...</div>
                ) : hasMembershipNFT ? (
                  <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                    Active Member
                  </div>
                ) : (
                  <Button 
                    onClick={handleBuyNFT}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    Get Membership <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Only show Referral Link Section when connected */}
          {isConnected && referralLink && (
            <>
              <Card className="mb-6 bg-black/40 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-white">Your Referral Link</h2>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input 
                      value={referralLink}
                      readOnly
                      className="bg-black/40 border-white/10 text-white p-4 flex-grow"
                    />
                    <Button 
                      onClick={copyToClipboard}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" /> Copy Link
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-blue-300">This referral is stored permanently once a user visits your link</p>
                </CardContent>
              </Card>

              {/* Sharing Options */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-8">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2 bg-black/40 border-white/10 hover:bg-white/5 text-white"
                  onClick={() => shareViaChannel('twitter')}
                >
                  <Share2 size={16} /> Share on X
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2 bg-black/40 border-white/10 hover:bg-white/5 text-white"
                  onClick={() => shareViaChannel('facebook')}
                >
                  <Facebook size={16} /> Share on Facebook
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2 bg-black/40 border-white/10 hover:bg-white/5 text-white"
                  onClick={() => shareViaChannel('telegram')}
                >
                  <ExternalLink size={16} /> Share on Telegram
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2 bg-black/40 border-white/10 hover:bg-white/5 text-white"
                  onClick={() => shareViaChannel('instagram')}
                >
                  <Instagram size={16} /> Share on Instagram
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2 bg-black/40 border-white/10 hover:bg-white/5 text-white"
                  onClick={() => shareViaChannel('sms')}
                >
                  <MessageSquare size={16} /> Share via SMS
                </Button>
              </div>
            </>
          )}

          {/* Stats Cards - Updated labels and removed Invoices Paid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <span className="text-gray-400 mb-2">Link Clicks</span>
                <span className="text-3xl font-bold text-blue-400">{stats.linkClicks}</span>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <span className="text-gray-400 mb-2">Wallets Signed Up</span>
                <span className="text-3xl font-bold text-blue-400">{stats.walletsSignedUp}</span>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <span className="text-gray-400 mb-2">NFTs Purchased</span>
                <span className="text-3xl font-bold text-blue-400">{stats.nftsPurchased}</span>
              </CardContent>
            </Card>
          </div>

          {/* Rewards Sections */}
          <div className="space-y-4">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 flex justify-between items-center">
                <span className="text-xl text-gray-300">Pending Rewards</span>
                <span className="text-2xl font-bold">
                  <span className="text-blue-500">{stats.pendingRewards}</span>
                  <span className="text-blue-400"> USDC</span>
                </span>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 flex justify-between items-center">
                <span className="text-xl text-gray-300">Paid Rewards</span>
                <span className="text-2xl font-bold">
                  <span className="text-blue-500">{stats.paidRewards}</span>
                  <span className="text-blue-400"> USDC</span>
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
