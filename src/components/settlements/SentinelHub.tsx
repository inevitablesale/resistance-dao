
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Shield, Zap, Clock, ChevronRight, Plus } from 'lucide-react';
import { getBounties, Bounty, createBounty, BountyOptions } from '@/services/bountyService';

// This is a component for Sentinels to view and create bounties
const SentinelHub: React.FC = () => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBounties = async () => {
      setLoading(true);
      try {
        const data = await getBounties();
        setBounties(data);
      } catch (error) {
        console.error('Error fetching bounties:', error);
        toast({
          title: 'Error',
          description: 'Failed to load bounties. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBounties();
  }, []);

  const handleCreateBounty = async () => {
    if (!primaryWallet) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to create a bounty',
        variant: 'destructive'
      });
      return;
    }
    
    // Sample bounty options
    const options: BountyOptions = {
      name: "NFT Membership Referral",
      description: "Earn rewards for referring new users who purchase a membership NFT",
      rewardType: "fixed",
      rewardAmount: 25,
      totalBudget: 2500,
      duration: 30, // 30 days
      maxReferralsPerHunter: 10,
      allowPublicHunters: true,
      requireVerification: true,
      eligibleNFTs: [],
      successCriteria: "New user must purchase a membership NFT using referrer's link",
      bountyType: "nft_referral"
    };
    
    try {
      const newBounty = await createBounty(options);
      if (newBounty) {
        toast({
          title: 'Bounty Created',
          description: 'New bounty has been created successfully',
        });
        setBounties(prev => [newBounty, ...prev]);
      }
    } catch (error) {
      console.error('Error creating bounty:', error);
      toast({
        title: 'Creation Failed',
        description: 'Failed to create bounty. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Active Bounties</h2>
        <Button onClick={handleCreateBounty}>
          <Plus className="mr-2 h-4 w-4" />
          Create Bounty
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading bounties...</p>
        </div>
      ) : bounties.length === 0 ? (
        <Card className="bg-black/50 border-blue-900/30">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-blue-500 mb-4 opacity-50" />
            <p className="text-gray-400">No active bounties found</p>
            <Button onClick={handleCreateBounty} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Bounty
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bounties.map((bounty) => (
            <Link to={`/bounties/${bounty.id}`} key={bounty.id}>
              <Card className="bg-black/50 border-blue-900/30 hover:border-blue-600/50 transition-all h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{bounty.name}</CardTitle>
                    <Badge className={bounty.status === 'active' ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'}>
                      {bounty.status}
                    </Badge>
                  </div>
                  <CardDescription>{bounty.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-black/30 p-2 rounded-lg">
                      <Zap className="h-4 w-4 mx-auto mb-1 text-green-400" />
                      <div className="text-sm font-medium text-green-400">{bounty.rewardAmount} MATIC</div>
                      <div className="text-xs text-gray-500">Reward</div>
                    </div>
                    <div className="bg-black/30 p-2 rounded-lg">
                      <Shield className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                      <div className="text-sm font-medium">{bounty.successCount}</div>
                      <div className="text-xs text-gray-500">Successes</div>
                    </div>
                    <div className="bg-black/30 p-2 rounded-lg">
                      <Clock className="h-4 w-4 mx-auto mb-1 text-yellow-400" />
                      <div className="text-sm font-medium">{Math.ceil((bounty.expiresAt - Date.now()/1000) / (24*60*60))}d</div>
                      <div className="text-xs text-gray-500">Remaining</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SentinelHub;
