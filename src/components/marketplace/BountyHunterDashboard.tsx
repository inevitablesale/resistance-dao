
import React, { useState, useEffect } from "react";
import { Target, Award, BadgeDollarSign, Link as LinkIcon, Clock, User, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle } from "@/components/ui/toxic-card";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { getBounties, Bounty } from "@/services/bountyService";
import ReferralLinkManager from "@/components/referrals/ReferralLinkManager";
import { useToast } from "@/hooks/use-toast";

// Mock data for my referrals
const mockReferrals = [
  {
    id: "ref-1",
    bountyId: "b-la9lbp",
    bountyName: "NFT Referral Program",
    referredAddress: "0x123...abc",
    timestamp: Date.now() - 86400000 * 2,
    status: "completed",
    reward: 20,
  },
  {
    id: "ref-2",
    bountyId: "b-la9lbp",
    bountyName: "NFT Referral Program",
    referredAddress: "0x456...def",
    timestamp: Date.now() - 86400000,
    status: "pending",
    reward: 20,
  }
];

export function BountyHunterDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("available");
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Mock hunter stats
  const hunterStats = {
    totalEarned: 20,
    pendingRewards: 20,
    successfulReferrals: 1,
    pendingReferrals: 1
  };
  
  // Load bounties from service
  useEffect(() => {
    const loadBounties = async () => {
      setLoading(true);
      try {
        const fetchedBounties = await getBounties();
        setBounties(fetchedBounties.filter(b => b.status === "active"));
      } catch (error) {
        console.error("Error loading bounties:", error);
        toast({
          title: "Failed to Load Bounties",
          description: "There was an error loading available bounties",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadBounties();
  }, [toast]);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="available" className="data-[state=active]:bg-toxic-neon/20 data-[state=active]:text-toxic-neon">
            <Target className="h-4 w-4 mr-2" />
            Available Bounties
          </TabsTrigger>
          <TabsTrigger value="my-referrals" className="data-[state=active]:bg-toxic-neon/20 data-[state=active]:text-toxic-neon">
            <LinkIcon className="h-4 w-4 mr-2" />
            My Referrals
          </TabsTrigger>
          <TabsTrigger value="earnings" className="data-[state=active]:bg-toxic-neon/20 data-[state=active]:text-toxic-neon">
            <BadgeDollarSign className="h-4 w-4 mr-2" />
            Earnings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="space-y-6">
          <ToxicCard className="bg-gray-900/60 border border-toxic-neon/40">
            <ToxicCardHeader>
              <ToxicCardTitle>Available Bounties</ToxicCardTitle>
              <CardDescription className="text-gray-400">
                Browse active bounties and start earning rewards
              </CardDescription>
            </ToxicCardHeader>
            <ToxicCardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading bounties...</div>
              ) : bounties.length === 0 ? (
                <div className="text-center py-8 bg-black/30 rounded-lg border border-toxic-neon/20">
                  <Target className="h-8 w-8 text-toxic-neon/30 mx-auto mb-3" />
                  <p className="text-white/70 mb-2">No active bounties available right now</p>
                  <p className="text-gray-400 text-sm">Check back later for new opportunities</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bounties.map((bounty) => (
                    <div key={bounty.id} className="bg-black/40 p-4 rounded-lg border border-toxic-neon/30 hover:border-toxic-neon/50 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-medium">{bounty.name}</h4>
                          <p className="text-sm text-gray-400">{bounty.description.substring(0, 100)}...</p>
                        </div>
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                          {bounty.rewardAmount} MATIC
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 text-sm">
                        <div>
                          <p className="text-gray-400">Total Budget</p>
                          <p className="text-white font-mono">{bounty.totalBudget} MATIC</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Remaining</p>
                          <p className="text-toxic-neon font-mono">{bounty.remainingBudget} MATIC</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Successful Claims</p>
                          <p className="text-white font-mono">{bounty.successCount}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1 text-xs text-gray-400">
                          <span>Budget Utilization</span>
                          <span>{((bounty.usedBudget / bounty.totalBudget) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={(bounty.usedBudget / bounty.totalBudget) * 100} className="h-1.5" />
                      </div>
                      
                      <div className="flex justify-end mt-4 gap-2">
                        <Button variant="outline" size="sm" onClick={() => setActiveTab("my-referrals")}>
                          <LinkIcon className="h-4 w-4 mr-1" />
                          Generate Link
                        </Button>
                        <ToxicButton 
                          variant="primary" 
                          size="sm"
                          onClick={() => navigate(`/marketplace/bounty-hunters/${bounty.id}`)}
                        >
                          View Details
                        </ToxicButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ToxicCardContent>
          </ToxicCard>
        </TabsContent>
        
        <TabsContent value="my-referrals" className="space-y-6">
          <ToxicCard className="bg-gray-900/60 border border-toxic-neon/40">
            <ToxicCardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <ToxicCardTitle>My Referrals</ToxicCardTitle>
                  <CardDescription className="text-gray-400">
                    Track your referral links and their status
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-toxic-neon/20 text-toxic-neon border-toxic-neon/50">
                  {hunterStats.successfulReferrals} Successful / {hunterStats.pendingReferrals} Pending
                </Badge>
              </div>
            </ToxicCardHeader>
            <ToxicCardContent>
              {/* Generate Referral Link Section */}
              <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/30 mb-6">
                <h3 className="text-toxic-neon font-medium mb-3">Generate Your Referral Link</h3>
                <ReferralLinkManager address="0x" />
              </div>
              
              {/* Referrals List */}
              <h3 className="text-white font-medium mb-3">Your Referral History</h3>
              {mockReferrals.length === 0 ? (
                <div className="text-center py-8 bg-black/30 rounded-lg border border-toxic-neon/20">
                  <LinkIcon className="h-8 w-8 text-toxic-neon/30 mx-auto mb-3" />
                  <p className="text-white/70 mb-2">No referrals yet</p>
                  <p className="text-gray-400 text-sm">Start sharing your links to earn rewards</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockReferrals.map((referral) => (
                    <div key={referral.id} className="bg-black/40 p-4 rounded-lg border border-gray-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">{referral.bountyName}</h4>
                          <div className="flex items-center text-sm text-gray-400 mt-1">
                            <User className="h-3 w-3 mr-1" />
                            {referral.referredAddress}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Referred {new Date(referral.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge variant="outline" className={`
                            ${referral.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/50' : ''}
                            ${referral.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : ''}
                            ${referral.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/50' : ''}
                          `}>
                            {referral.status.toUpperCase()}
                          </Badge>
                          <span className="text-toxic-neon font-mono text-sm mt-2">
                            {referral.reward} MATIC
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-3">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Transaction
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ToxicCardContent>
          </ToxicCard>
        </TabsContent>
        
        <TabsContent value="earnings" className="space-y-6">
          <ToxicCard className="bg-gray-900/60 border border-toxic-neon/40">
            <ToxicCardHeader>
              <ToxicCardTitle>Earnings Dashboard</ToxicCardTitle>
              <CardDescription className="text-gray-400">
                Track your bounty hunting rewards and earnings
              </CardDescription>
            </ToxicCardHeader>
            <ToxicCardContent>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <BadgeDollarSign className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Total Earned</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">{hunterStats.totalEarned} MATIC</span>
                </div>
                
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Pending Rewards</span>
                  </div>
                  <span className="text-2xl font-bold text-toxic-neon block">{hunterStats.pendingRewards} MATIC</span>
                </div>
                
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Success Rate</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">50%</span>
                </div>
                
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Active Links</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">1</span>
                </div>
              </div>
              
              {/* Payout History */}
              <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                <h3 className="text-white font-medium mb-3">Payout History</h3>
                
                {hunterStats.totalEarned === 0 ? (
                  <div className="text-center py-8">
                    <BadgeDollarSign className="h-8 w-8 text-toxic-neon/30 mx-auto mb-3" />
                    <p className="text-white/70 mb-2">No earnings yet</p>
                    <p className="text-gray-400 text-sm">Start referring to earn rewards</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-4 py-3 bg-black/30 border border-gray-800 rounded">
                      <div>
                        <p className="text-white">NFT Referral Program</p>
                        <p className="text-xs text-gray-500">Paid on {new Date(Date.now() - 86400000 * 3).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-toxic-neon font-mono">20 MATIC</span>
                        <Button variant="ghost" size="sm" className="ml-2">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ToxicCardContent>
          </ToxicCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
