
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Facebook, Instagram, MessageSquare, Share2, ExternalLink } from "lucide-react";
import { useCustomWallet } from "@/hooks/useCustomWallet";

const ReferralProgram: React.FC = () => {
  const { isConnected, address } = useCustomWallet();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  
  // Generate a referral link using the wallet address or a placeholder
  const referralLink = isConnected && address 
    ? `https://refer.resistancedao.xyz/${address?.substring(0, 8)}`
    : "https://refer.resistancedao.xyz/connect-wallet";

  const stats = {
    linkClicks: 2,
    appointments: 0,
    invoicesBilled: 0,
    invoicesPaid: 0,
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
        // Instagram doesn't have a direct share URL, but we can show a toast
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

  const handleAddEmail = () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Email added",
      description: "You'll now receive notifications about your referrals"
    });
    
    // Reset email field
    setEmail("");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-400">Your Affiliate Dashboard</h1>
        <Button variant="outline" className="border-purple-500 text-purple-400">
          Transaction History
        </Button>
      </div>

      {/* Referral Link Section */}
      <Card className="mb-6 bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <Input 
            value={referralLink}
            readOnly
            className="bg-gray-900 border-gray-700 text-white p-4"
          />
        </CardContent>
      </Card>

      {/* Sharing Options */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-8">
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2 bg-gray-800 border-gray-700 hover:bg-gray-700"
          onClick={copyToClipboard}
        >
          <Copy size={16} /> Copy Link
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2 bg-gray-800 border-gray-700 hover:bg-gray-700"
          onClick={() => shareViaChannel('twitter')}
        >
          <Share2 size={16} /> Share on X
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2 bg-gray-800 border-gray-700 hover:bg-gray-700"
          onClick={() => shareViaChannel('facebook')}
        >
          <Facebook size={16} /> Share on Facebook
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2 bg-gray-800 border-gray-700 hover:bg-gray-700"
          onClick={() => shareViaChannel('telegram')}
        >
          <ExternalLink size={16} /> Share on Telegram
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2 bg-gray-800 border-gray-700 hover:bg-gray-700"
          onClick={() => shareViaChannel('instagram')}
        >
          <Instagram size={16} /> Share on Instagram
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2 bg-gray-800 border-gray-700 hover:bg-gray-700"
          onClick={() => shareViaChannel('sms')}
        >
          <MessageSquare size={16} /> Share via SMS
        </Button>
      </div>

      {/* Email Notifications */}
      <Card className="mb-8 bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4 text-white">Email Notifications</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input 
              placeholder="No email provided for notifications" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-gray-800 border-gray-700 text-white"
            />
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleAddEmail}
            >
              Add Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-gray-400 mb-2">Link Clicks</span>
            <span className="text-3xl font-bold text-purple-400">{stats.linkClicks}</span>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-gray-400 mb-2">Appointments</span>
            <span className="text-3xl font-bold text-purple-400">{stats.appointments}</span>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-gray-400 mb-2">Invoices Billed</span>
            <span className="text-3xl font-bold text-purple-400">{stats.invoicesBilled}</span>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-gray-400 mb-2">Invoices Paid</span>
            <span className="text-3xl font-bold text-purple-400">{stats.invoicesPaid}</span>
          </CardContent>
        </Card>
      </div>

      {/* Rewards Sections */}
      <div className="space-y-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 flex justify-between items-center">
            <span className="text-xl text-gray-300">Pending Rewards</span>
            <span className="text-2xl font-bold">
              <span className="text-blue-500">{stats.pendingRewards}</span>
              <span className="text-purple-400"> USDC</span>
            </span>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 flex justify-between items-center">
            <span className="text-xl text-gray-300">Paid Rewards</span>
            <span className="text-2xl font-bold">
              <span className="text-blue-500">{stats.paidRewards}</span>
              <span className="text-purple-400"> USDC</span>
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralProgram;
