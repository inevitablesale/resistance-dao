
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useNFTBalance } from "@/hooks/useNFTBalance";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Shield, Check, ArrowRight, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BuyMembershipNFT: React.FC = () => {
  const { isConnected, address } = useCustomWallet();
  const { data: nftBalance, isLoading: isLoadingNFT } = useNFTBalance(address);
  const hasMembershipNFT = nftBalance && nftBalance > 0;
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBuyNFT = () => {
    // This is a placeholder for the actual purchase functionality
    toast({
      title: "Purchase initiated",
      description: "Redirecting to payment gateway...",
    });
    
    // For demo purposes, we'll just show a success message
    setTimeout(() => {
      toast({
        title: "Purchase successful!",
        description: "Your membership NFT has been minted.",
        variant: "default" // Changed from "success" to "default"
      });
    }, 2000);
  };

  const benefits = [
    "Voting rights in DAO governance",
    "Access to exclusive opportunities",
    "Share in platform revenue",
    "Priority access to new features",
    "NFT holder rewards and airdrops"
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 bg-clip-text text-transparent mb-4">
            Resistance DAO Membership
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            Join our community of innovators and gain exclusive access to governance, rewards, and more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <CardHeader className="pt-6">
                <CardTitle className="text-2xl text-white">DAO Membership NFT</CardTitle>
                <CardDescription className="text-white/70">
                  Your key to the Resistance DAO ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-950/30 rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-white/70">Price</div>
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-green-400" />
                      <div className="text-2xl font-bold text-white">$50 USDC</div>
                    </div>
                  </div>
                  <div className="text-white/60 text-sm">
                    Pay with USDC on Ethereum or Polygon networks
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h3 className="text-white text-lg font-medium mb-2">Membership Benefits</h3>
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="text-green-500 w-5 h-5 mt-0.5 shrink-0" />
                      <span className="text-white/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-white/10 pt-4">
                {isLoadingNFT ? (
                  <Button disabled className="w-full">Loading...</Button>
                ) : hasMembershipNFT ? (
                  <div className="w-full">
                    <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                      <Check className="w-5 h-5" />
                      <span>You already own this membership</span>
                    </div>
                    <Button 
                      onClick={() => navigate('/settings')}
                      variant="outline"
                      className="w-full border-green-500/30 text-green-400"
                    >
                      Back to Settings
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleBuyNFT}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Purchase Membership NFT
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-4">Why Join Resistance DAO?</h3>
              <p className="text-white/70 mb-6">
                As a membership NFT holder, you become an integral part of the Resistance DAO ecosystem, 
                with the power to shape its future through governance and receive rewards from the DAO's activities.
                <span className="block mt-2 text-blue-400 font-medium">
                  Your membership includes the Project Creator pass, allowing you to submit fund proposals!
                </span>
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Exclusive Access</h4>
                    <p className="text-white/60 text-sm">Early access to new features and opportunities</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Active Participation</h4>
                    <p className="text-white/60 text-sm">Vote on proposals and help guide the platform's future</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/20 backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-2">DAO Treasury Sharing</h3>
              <p className="text-white/70">
                Membership NFT holders receive a proportional share of the DAO's revenue from platform fees, 
                distributed automatically through smart contracts.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyMembershipNFT;
