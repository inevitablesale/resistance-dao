
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Copy, Link, CheckCircle, Clock, AlertCircle, ExternalLink, RefreshCw, Award } from 'lucide-react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getBounties, Bounty } from '@/services/bountyService';
import { useReferralSystem } from '@/hooks/useReferralSystem';
import { formatDistanceToNow } from 'date-fns';
import { ethers } from 'ethers';

const BountyHunterDashboard: React.FC = () => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const [activeBounties, setActiveBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  
  const { 
    referrals, 
    referralLink, 
    stats, 
    copyReferralLink, 
    refreshReferrals, 
    loading: referralsLoading 
  } = useReferralSystem(selectedBounty?.id);

  // Fetch active bounties
  useEffect(() => {
    const fetchActiveBounties = async () => {
      setLoading(true);
      try {
        const bounties = await getBounties('active');
        setActiveBounties(bounties);
        
        // Select the first bounty by default if available
        if (bounties.length > 0 && !selectedBounty) {
          setSelectedBounty(bounties[0]);
        }
      } catch (error) {
        console.error('Error fetching bounties:', error);
        toast({
          title: 'Error fetching bounties',
          description: 'Failed to load active bounties. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchActiveBounties();
  }, [primaryWallet]);

  const handleBountySelect = (bounty: Bounty) => {
    setSelectedBounty(bounty);
  };

  const handleRefresh = () => {
    refreshReferrals();
  };

  if (!primaryWallet) {
    return (
      <div className="w-full p-8 text-center">
        <Alert className="mx-auto max-w-lg bg-yellow-900/20 border-yellow-600/30">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <AlertTitle className="ml-2 text-yellow-500">Wallet not connected</AlertTitle>
          <AlertDescription className="text-gray-400">
            Please connect your wallet to access the bounty hunter dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <Card className="w-full max-w-5xl bg-black/50 border-blue-900/30">
          <CardHeader className="text-center">
            <CardTitle>Loading Bounty Data</CardTitle>
            <CardDescription>Please wait while we fetch available bounties...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar with bounty list */}
        <div className="w-full lg:w-64 space-y-4">
          <Card className="bg-black/50 border-blue-900/30">
            <CardHeader>
              <CardTitle className="text-lg">Active Bounties</CardTitle>
              <CardDescription>Select a bounty to hunt</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {activeBounties.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No active bounties available
                </div>
              ) : (
                <div className="space-y-1">
                  {activeBounties.map((bounty) => (
                    <Button
                      key={bounty.id}
                      variant={selectedBounty?.id === bounty.id ? "default" : "ghost"}
                      className="w-full justify-start text-left py-2 px-3"
                      onClick={() => handleBountySelect(bounty)}
                    >
                      <div className="truncate">
                        {bounty.name}
                        <div className="text-xs text-gray-400">
                          Reward: {bounty.rewardAmount} MATIC
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Referral Stats Card */}
          <Card className="bg-black/50 border-blue-900/30">
            <CardHeader>
              <CardTitle className="text-lg">Your Stats</CardTitle>
              <CardDescription>Referral performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Referrals</span>
                <span className="font-mono">{stats.totalReferrals}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Completed</span>
                <span className="font-mono">{stats.completedReferrals}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pending</span>
                <span className="font-mono">{stats.pendingReferrals}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-300">Total Earnings</span>
                <span className="font-mono text-green-500">{stats.totalEarnings} MATIC</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          {!selectedBounty ? (
            <Alert className="bg-blue-900/20 border-blue-600/30">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <AlertTitle className="ml-2 text-blue-500">Select a bounty</AlertTitle>
              <AlertDescription className="text-gray-400">
                Please select a bounty from the list to start hunting.
              </AlertDescription>
            </Alert>
          ) : (
            <Card className="bg-black/50 border-blue-900/30">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedBounty.name}</CardTitle>
                    <CardDescription className="mt-1">{selectedBounty.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-400/20">
                    Reward: {selectedBounty.rewardAmount} MATIC
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Remaining Budget</span>
                    <span className="font-medium">
                      {selectedBounty.remainingBudget} / {selectedBounty.totalBudget} MATIC
                    </span>
                  </div>
                  <Progress value={(selectedBounty.remainingBudget / selectedBounty.totalBudget) * 100} />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-black/30 p-3 rounded-lg border border-blue-900/20">
                    <div className="text-xs text-gray-400 mb-1">Time Remaining</div>
                    <div className="font-medium">
                      {formatDistanceToNow(new Date(selectedBounty.expiresAt * 1000), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg border border-blue-900/20">
                    <div className="text-xs text-gray-400 mb-1">Successful Referrals</div>
                    <div className="font-medium">{selectedBounty.successCount}</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg border border-blue-900/20">
                    <div className="text-xs text-gray-400 mb-1">Your Earnings</div>
                    <div className="font-medium text-green-500">
                      {stats.totalEarnings} MATIC
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Your Referral Link</h3>
                  <div className="flex">
                    <Input 
                      value={referralLink} 
                      readOnly 
                      className="bg-black/40 border-gray-700 text-gray-300"
                    />
                    <Button 
                      onClick={copyReferralLink} 
                      className="ml-2" 
                      variant="outline"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400">
                    Share this link to earn {selectedBounty.rewardAmount} MATIC for each successful referral.
                  </p>
                </div>
                
                <Tabs defaultValue="referrals">
                  <TabsList className="w-full">
                    <TabsTrigger value="referrals" className="flex-1">Your Referrals</TabsTrigger>
                    <TabsTrigger value="howto" className="flex-1">How It Works</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="referrals" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Recent Referrals</h3>
                      <Button variant="outline" size="sm" onClick={handleRefresh}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                    
                    {referralsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading your referrals...</p>
                      </div>
                    ) : referrals.length === 0 ? (
                      <div className="text-center py-8">
                        <Link className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">You haven't made any referrals for this bounty yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {referrals.map((referral) => (
                          <div 
                            key={referral.id} 
                            className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-gray-800"
                          >
                            <div>
                              <div className="font-mono text-sm text-gray-400">
                                {`${referral.referredAddress.slice(0, 6)}...${referral.referredAddress.slice(-4)}`}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(referral.referralDate).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {referral.status === 'completed' ? (
                                <>
                                  <span className="text-green-500 font-medium">
                                    +{referral.rewardAmount} MATIC
                                  </span>
                                  <Badge className="bg-green-900/20 text-green-400 border-green-400/20">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Completed
                                  </Badge>
                                </>
                              ) : referral.status === 'pending' ? (
                                <Badge className="bg-yellow-900/20 text-yellow-400 border-yellow-400/20">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </Badge>
                              ) : (
                                <Badge className="bg-blue-900/20 text-blue-400 border-blue-400/20">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  {referral.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="howto" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">How to Earn Rewards</h3>
                      <ol className="space-y-3 list-decimal list-inside text-gray-300">
                        <li>Copy your unique referral link</li>
                        <li>Share the link with potential users</li>
                        <li>When someone follows your link and completes the required action, you earn {selectedBounty.rewardAmount} MATIC</li>
                        <li>Rewards are automatically sent to your wallet</li>
                      </ol>
                      
                      <Alert className="bg-blue-900/20 border-blue-600/30">
                        <AlertTitle className="text-blue-400">Requirements</AlertTitle>
                        <AlertDescription className="text-gray-300">
                          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                            <li>Your referral must be a new user to the platform</li>
                            <li>They must complete the required action within 7 days</li>
                            <li>You can refer up to 50 users per bounty</li>
                          </ul>
                        </AlertDescription>
                      </Alert>
                      
                      {selectedBounty.partyAddress && (
                        <div className="pt-4">
                          <h4 className="text-sm font-medium mb-2">Bounty Contract</h4>
                          <div className="flex justify-between bg-black/30 p-3 rounded-lg border border-gray-800">
                            <span className="font-mono text-sm">
                              {selectedBounty.partyAddress.slice(0, 8)}...{selectedBounty.partyAddress.slice(-6)}
                            </span>
                            <a
                              href={`https://polygonscan.com/address/${selectedBounty.partyAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter>
                <p className="text-xs text-gray-500 w-full text-center">
                  Happy hunting! Rewards are distributed automatically when referrals are verified.
                </p>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BountyHunterDashboard;
