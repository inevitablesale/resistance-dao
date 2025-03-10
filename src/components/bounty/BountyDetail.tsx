
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getBounty, deployBountyToBlockchain, Bounty } from '@/services/bountyService';
import { Clock, Shield, Users, ArrowUpRight, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { ClaimBountyForm } from './ClaimBountyForm';
import { formatDistanceToNow } from 'date-fns';
import { ethers } from 'ethers';

export const BountyDetail: React.FC = () => {
  const { bountyId } = useParams<{ bountyId: string }>();
  const navigate = useNavigate();
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  
  useEffect(() => {
    const fetchBountyDetails = async () => {
      if (!bountyId) return;
      
      setLoading(true);
      try {
        const bountyData = await getBounty(bountyId);
        setBounty(bountyData);
      } catch (error) {
        console.error('Error fetching bounty details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load bounty details. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBountyDetails();
  }, [bountyId]);

  const handleDeployToBlockchain = async () => {
    if (!bounty || !primaryWallet) return;
    
    setIsDeploying(true);
    try {
      const result = await deployBountyToBlockchain(bounty.id, primaryWallet);
      
      toast({
        title: 'Deployment Successful',
        description: 'Bounty has been deployed to the blockchain.',
      });
      
      // Update the bounty data with new addresses
      setBounty(prev => prev ? {
        ...prev,
        partyAddress: result.partyAddress,
        crowdfundAddress: result.crowdfundAddress
      } : null);
      
    } catch (error) {
      console.error('Error deploying bounty:', error);
      toast({
        title: 'Deployment Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900/20 text-green-400 border-green-400/20';
      case 'paused':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-400/20';
      case 'expired':
        return 'bg-red-900/20 text-red-400 border-red-400/20';
      case 'completed':
        return 'bg-blue-900/20 text-blue-400 border-blue-400/20';
      default:
        return 'bg-gray-800 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 pt-8">
        <Card className="mx-auto max-w-3xl bg-black/50 border-blue-900/30">
          <CardHeader className="text-center">
            <CardTitle>Loading Bounty Details</CardTitle>
            <CardDescription>Please wait...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bounty) {
    return (
      <div className="container mx-auto p-4 pt-8">
        <Alert className="mx-auto max-w-3xl bg-red-900/20 border-red-600/30">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <AlertTitle className="ml-2 text-red-500">Bounty Not Found</AlertTitle>
          <AlertDescription className="text-gray-400">
            The requested bounty could not be found. It may have been removed or expired.
          </AlertDescription>
        </Alert>
        <div className="text-center mt-6">
          <Button onClick={() => navigate('/bounties')}>
            View All Bounties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-8">
      <Card className="mx-auto max-w-3xl bg-black/50 border-blue-900/30">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{bounty.name}</CardTitle>
              <CardDescription className="mt-2">{bounty.description}</CardDescription>
            </div>
            <Badge className={getStatusColor(bounty.status)}>
              {bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/30 p-4 rounded-lg border border-blue-900/20 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-green-400">
                {bounty.rewardAmount} MATIC
              </div>
              <div className="text-sm text-gray-400">Reward per Referral</div>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg border border-blue-900/20 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">
                {bounty.successCount}
              </div>
              <div className="text-sm text-gray-400">Successful Referrals</div>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg border border-blue-900/20 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">
                {formatDistanceToNow(new Date(bounty.expiresAt * 1000), { addSuffix: true })}
              </div>
              <div className="text-sm text-gray-400">Time Remaining</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Budget Utilization</span>
              <span className="font-medium">
                {bounty.usedBudget} / {bounty.totalBudget} MATIC
              </span>
            </div>
            <Progress value={(bounty.usedBudget / bounty.totalBudget) * 100} />
          </div>
          
          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
              <TabsTrigger value="claim" className="flex-1">Claim Rewards</TabsTrigger>
              {bounty.partyAddress && (
                <TabsTrigger value="blockchain" className="flex-1">Blockchain</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Bounty Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Created</span>
                    <span>{new Date(bounty.createdAt * 1000).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expires</span>
                    <span>{new Date(bounty.expiresAt * 1000).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hunters</span>
                    <span>{bounty.hunterCount}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-400">Remaining Budget</span>
                    <span className="font-medium">{bounty.remainingBudget} MATIC</span>
                  </div>
                </div>
                
                {bounty.eligibleNFTs && bounty.eligibleNFTs.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Eligible NFTs</h4>
                    <div className="space-y-2">
                      {bounty.eligibleNFTs.map((nftAddress, index) => (
                        <div key={index} className="flex justify-between bg-black/30 p-2 rounded-lg border border-gray-800 text-sm">
                          <span className="font-mono">{nftAddress}</span>
                          <a
                            href={`https://polygonscan.com/address/${nftAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {!bounty.partyAddress && (
                  <div className="mt-4">
                    <Alert className="bg-yellow-900/20 border-yellow-600/30">
                      <AlertTitle className="text-yellow-500">Not Yet On-Chain</AlertTitle>
                      <AlertDescription className="text-gray-300">
                        This bounty has not yet been deployed to the blockchain.
                      </AlertDescription>
                    </Alert>
                    
                    {primaryWallet && (
                      <Button 
                        onClick={handleDeployToBlockchain}
                        className="w-full mt-4"
                        disabled={isDeploying}
                      >
                        {isDeploying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Deploying...
                          </>
                        ) : (
                          <>
                            <Shield className="mr-2 h-4 w-4" />
                            Deploy to Blockchain
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="claim" className="pt-4">
              <ClaimBountyForm bounty={bounty} />
            </TabsContent>
            
            {bounty.partyAddress && (
              <TabsContent value="blockchain" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Blockchain Details</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm text-gray-400 mb-1">Party Address</h4>
                      <div className="flex justify-between bg-black/30 p-3 rounded-lg border border-gray-800">
                        <span className="font-mono text-sm">{bounty.partyAddress}</span>
                        <a
                          href={`https://polygonscan.com/address/${bounty.partyAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                    
                    {bounty.crowdfundAddress && (
                      <div>
                        <h4 className="text-sm text-gray-400 mb-1">Crowdfund Address</h4>
                        <div className="flex justify-between bg-black/30 p-3 rounded-lg border border-gray-800">
                          <span className="font-mono text-sm">{bounty.crowdfundAddress}</span>
                          <a
                            href={`https://polygonscan.com/address/${bounty.crowdfundAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    )}
                    
                    <Alert className="bg-blue-900/20 border-blue-600/30 mt-4">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <AlertTitle className="ml-2 text-blue-500">On-Chain Verification</AlertTitle>
                      <AlertDescription className="text-gray-300">
                        This bounty has been deployed to the Polygon network and uses Party Protocol for secure reward distribution.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => navigate('/bounties')}
          >
            <ArrowUpRight className="mr-2 h-4 w-4" />
            View All Bounties
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
