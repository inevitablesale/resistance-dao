
import React from "react";
import { JobsDashboard } from "@/components/jobs/JobsDashboard";
import { useNFTRoles } from "@/hooks/useNFTRoles";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettlements } from "@/hooks/useSettlements";
import { ReferralSystem } from "@/components/radiation/ReferralSystem";
import { Shield, Target, AlertTriangle } from "lucide-react";
import { ToxicButton } from "@/components/ui/toxic-button";

export const Hunt = () => {
  const { primaryRole, isLoading: isLoadingRoles } = useNFTRoles();
  
  if (isLoadingRoles) {
    return (
      <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-bold mb-4">Loading role information...</h2>
          <div className="h-4 w-32 bg-slate-700 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  // If user has no NFT role, show access restriction
  if (primaryRole === 'Unknown') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-gray-800 bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-6 w-6 text-toxic-neon" />
              <CardTitle className="text-2xl text-white">Access Restricted</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              You need a membership NFT to access the job marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p className="mb-4">
              The job marketplace is only available to Sentinel, Survivor, and Bounty Hunter NFT holders.
              Purchase an NFT to access exclusive jobs and earn rewards.
            </p>
          </CardContent>
          <CardFooter className="pt-2">
            <ToxicButton className="w-full" variant="primary" asChild>
              <a href="/buy-membership-nft">Get Membership NFT</a>
            </ToxicButton>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gradient-to-r from-gray-900 to-black py-16 px-4 border-b border-gray-800">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-toxic-neon">Bounty Hunter's Hub</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Find jobs, earn rewards, and grow your bounty hunter network
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Referral System - Added to Hunt page */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-20">
              <h2 className="text-2xl font-bold text-toxic-neon mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-toxic-neon" />
                Bounty Network
              </h2>
              <ReferralSystem />
            </div>
          </div>
          
          {/* Main content - JobsDashboard */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <h2 className="text-2xl font-bold text-toxic-neon mb-4">Available Bounties</h2>
            <JobsDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hunt;
