
import React from "react";
import { JobsDashboard } from "@/components/jobs/JobsDashboard";
import { useNFTRoles } from "@/hooks/useNFTRoles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettlements } from "@/hooks/useSettlements";
import { ReferralSystem } from "@/components/radiation/ReferralSystem";
import { Target } from "lucide-react";

export const Hunt = () => {
  const { primaryRole, isLoading: isLoadingRoles } = useNFTRoles();
  
  if (isLoadingRoles) {
    return (
      <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-bold mb-4">Loading role information...</h2>
          <div className="h-4 w-32 bg-slate-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  // If user has no NFT role, show access restriction
  if (primaryRole === 'Unknown') {
    return (
      <div className="container mx-auto p-4 mt-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Access Restricted</CardTitle>
            <CardDescription>
              You need a membership NFT to access the job marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              The job marketplace is only available to Sentinel, Survivor, and Bounty Hunter NFT holders.
              Purchase an NFT to access exclusive jobs and earn rewards.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <a href="/buy-membership-nft">Get Membership NFT</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-12">
      <div className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white py-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Bounty Hunter's Hub</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Find jobs, earn rewards, and grow your bounty hunter network
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Referral System - Added to Hunt page */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-20">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-toxic-neon" />
                Bounty Network
              </h2>
              <ReferralSystem />
            </div>
          </div>
          
          {/* Main content - JobsDashboard */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <h2 className="text-2xl font-bold text-white mb-4">Available Bounties</h2>
            <JobsDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hunt;
