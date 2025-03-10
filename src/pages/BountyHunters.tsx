
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Trophy, ArrowRight, Zap } from "lucide-react";
import { ToxicButton } from "@/components/ui/toxic-button";
import { BountyCategories } from "@/components/bounty/BountyCategories";
import { ReferralSystem } from "@/components/radiation/ReferralSystem";

const BountyHunters = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gradient-to-r from-gray-900 to-black py-16 px-4 border-b border-gray-800">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-toxic-neon">Bounty Hunter's Hub</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Earn rewards by completing bounties and growing the Resistance DAO network
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <Card className="bg-gray-900/50 border-toxic-neon/30 p-4 flex items-center gap-3 w-full sm:w-auto">
              <Trophy className="h-6 w-6 text-toxic-neon flex-shrink-0" />
              <div>
                <p className="text-white text-sm">Top bounty hunters earn</p>
                <p className="text-toxic-neon font-bold">$500+ monthly</p>
              </div>
            </Card>
            
            <Card className="bg-gray-900/50 border-toxic-neon/30 p-4 flex items-center gap-3 w-full sm:w-auto">
              <Target className="h-6 w-6 text-toxic-neon flex-shrink-0" />
              <div>
                <p className="text-white text-sm">Active bounty hunters</p>
                <p className="text-toxic-neon font-bold">97 hunters</p>
              </div>
            </Card>
            
            <Card className="bg-gray-900/50 border-toxic-neon/30 p-4 flex items-center gap-3 w-full sm:w-auto">
              <Zap className="h-6 w-6 text-toxic-neon flex-shrink-0" />
              <div>
                <p className="text-white text-sm">Bounties completed</p>
                <p className="text-toxic-neon font-bold">354 total</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content - Bounty Categories */}
          <div className="lg:col-span-8 order-1">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-toxic-neon">Bounty Categories</h2>
                <ToxicButton variant="outline" size="sm" asChild>
                  <a href="/hunt" className="flex items-center gap-1">
                    View Job Board <ArrowRight className="h-4 w-4" />
                  </a>
                </ToxicButton>
              </div>
              <p className="text-gray-400 mb-6">Browse available bounty categories and start earning rewards.</p>
              <BountyCategories showActive={true} />
            </div>
            
            {/* All Categories Section */}
            <div>
              <h2 className="text-2xl font-bold text-toxic-neon mb-4">All Categories</h2>
              <p className="text-gray-400 mb-6">Check out all bounty categories, including upcoming opportunities.</p>
              <BountyCategories />
            </div>
          </div>
          
          {/* Referral System - Right side */}
          <div className="lg:col-span-4 order-2">
            <div className="sticky top-20">
              <h2 className="text-2xl font-bold text-toxic-neon mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-toxic-neon" />
                Bounty Network
              </h2>
              <ReferralSystem />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BountyHunters;
