
import React from "react";
import { JobsDashboard } from "@/components/jobs/JobsDashboard";
import { useNFTRoles } from "@/hooks/useNFTRoles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettlements } from "@/hooks/useSettlements";
import { Settlement } from "@/utils/settlementConversion";

export const Hunt = () => {
  const { primaryRole, isLoading: isLoadingRoles } = useNFTRoles();
  const { settlements, loading: isLoadingSettlements } = useSettlements();

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
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white py-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Settlement Job Marketplace</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Find work, collaborate with settlements, and earn rewards in the Settlement ecosystem
          </p>
        </div>
      </div>
      
      <JobsDashboard />
    </div>
  );
};

export default Hunt;
