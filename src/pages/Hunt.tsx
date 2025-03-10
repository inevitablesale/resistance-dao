
import React from "react";
import { JobsDashboard } from "@/components/jobs/JobsDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { useSettlements } from "@/hooks/useSettlements";
import { ReferralSystem } from "@/components/radiation/ReferralSystem";
import { Target, Briefcase } from "lucide-react";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Link } from "react-router-dom";

export const Hunt = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gradient-to-r from-gray-900 to-black py-16 px-4 border-b border-gray-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-toxic-neon">Talent Acquisition Bounties</h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                Find qualified professionals for open roles and earn placement commissions
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <ToxicButton variant="outline" asChild>
                <Link to="/marketplace/bounty-hunters" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Bounty Hunter Hub
                </Link>
              </ToxicButton>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Referral System - Added to Hunt page */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-20">
              <h2 className="text-2xl font-bold text-toxic-neon mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-toxic-neon" />
                How It Works
              </h2>
              <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-sm mb-6">
                <CardContent className="pt-6">
                  <ol className="space-y-4 text-gray-300">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-toxic-neon/20 text-toxic-neon flex items-center justify-center text-sm">1</span>
                      <span>Browse available talent acquisition bounties</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-toxic-neon/20 text-toxic-neon flex items-center justify-center text-sm">2</span>
                      <span>Apply to bounties you can help fulfill</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-toxic-neon/20 text-toxic-neon flex items-center justify-center text-sm">3</span>
                      <span>Find and refer qualified candidates</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-toxic-neon/20 text-toxic-neon flex items-center justify-center text-sm">4</span>
                      <span>Earn 10-20% commission when your referral is hired</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
              
              <h2 className="text-2xl font-bold text-toxic-neon mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-toxic-neon" />
                Bounty Network
              </h2>
              <ReferralSystem />
            </div>
          </div>
          
          {/* Main content - JobsDashboard */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <h2 className="text-2xl font-bold text-toxic-neon mb-4">Available Talent Bounties</h2>
            <JobsDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hunt;
