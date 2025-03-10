
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Shield, Clock, DollarSign, Target, UserCheck, Copy, 
  Share2, ExternalLink, ArrowLeftCircle, AlertTriangle 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle, ToxicCardDescription, ToxicCardFooter } from "@/components/ui/toxic-card";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { getBounty, getBountyReferrals, deployBountyToBlockchain, Bounty } from "@/services/bountyService";
import { useReferralSystem } from "@/hooks/useReferralSystem";
import { ClaimBountyForm } from "./ClaimBountyForm";

const BountyDetail: React.FC = () => {
  const { bountyId } = useParams<{ bountyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { primaryWallet } = useDynamicContext();
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const { generateReferralLink, isGenerating } = useReferralSystem();
  const [referralLink, setReferralLink] = useState("");
  
  useEffect(() => {
    const loadBountyDetails = async () => {
      if (!bountyId) return;
      
      try {
        setLoading(true);
        const bountyData = await getBounty(bountyId);
        
        if (!bountyData) {
          toast({
            title: "Bounty Not Found",
            description: "The bounty you're looking for doesn't exist",
            variant: "destructive"
          });
          navigate("/marketplace/bounty-hunters");
          return;
        }
        
        setBounty(bountyData);
        
        // Load referrals
        const referralsData = await getBountyReferrals(bountyId);
        setReferrals(referralsData);
        
        // Generate referral link if wallet is connected
        if (primaryWallet) {
          const link = await generateReferralLink(bountyId);
          setReferralLink(link);
        }
      } catch (error) {
        console.error("Error loading bounty details:", error);
        toast({
          title: "Error",
          description: "Failed to load bounty details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadBountyDetails();
  }, [bountyId, primaryWallet]);
  
  const copyReferralLink = () => {
    if (!referralLink) return;
    
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied!",
      description: "Referral link copied to clipboard",
    });
  };
  
  const handleDeployToBlockchain = async () => {
    if (!primaryWallet || !bounty) return;
    
    try {
      setDeploying(true);
      
      toast({
        title: "Deploying Bounty",
        description: "Please approve the transactions to deploy this bounty to the blockchain",
      });
      
      const result = await deployBountyToBlockchain(bounty.id, primaryWallet);
      
      if (result) {
        toast({
          title: "Deployment Successful",
          description: "Bounty has been successfully deployed to the blockchain",
        });
        
        // Refresh bounty data
        const updatedBounty = await getBounty(bounty.id);
        setBounty(updatedBounty);
      }
    } catch (error: any) {
      console.error("Error deploying bounty:", error);
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to deploy bounty to blockchain",
        variant: "destructive"
      });
    } finally {
      setDeploying(false);
    }
  };
  
  // Format time remaining or expiry status
  const getTimeRemaining = () => {
    if (!bounty) return "";
    
    const now = Math.floor(Date.now() / 1000);
    
    if (bounty.expiresAt <= now) {
      return "Expired";
    }
    
    const secondsRemaining = bounty.expiresAt - now;
    const days = Math.floor(secondsRemaining / (24 * 60 * 60));
    const hours = Math.floor((secondsRemaining % (24 * 60 * 60)) / (60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-toxic-neon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-toxic-neon">Loading bounty details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!bounty) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Bounty Not Found</h2>
            <p className="text-gray-400 mb-6">The bounty you're looking for doesn't exist or has been removed.</p>
            <ToxicButton 
              variant="primary" 
              onClick={() => navigate("/marketplace/bounty-hunters")}
            >
              View Available Bounties
            </ToxicButton>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-toxic-neon/80 hover:text-toxic-neon mb-6"
        >
          <ArrowLeftCircle className="h-5 w-5 mr-2" />
          Back to Bounties
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ToxicCard className="mb-6">
              <ToxicCardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-toxic-neon/20 text-toxic-neon border-toxic-neon/30 px-3 py-1">
                        {bounty.bountyType || "NFT Referral"}
                      </Badge>
                      <Badge variant="outline" className={`px-3 py-1 ${
                        bounty.status === "active" 
                          ? "bg-green-500/20 text-green-400 border-green-500/30" 
                          : bounty.status === "paused"
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}>
                        {bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}
                      </Badge>
                    </div>
                    <ToxicCardTitle className="text-2xl">{bounty.name}</ToxicCardTitle>
                    <ToxicCardDescription className="mt-2">
                      {bounty.description}
                    </ToxicCardDescription>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-toxic-neon">
                      {bounty.rewardAmount} <span className="text-sm">MATIC</span>
                    </div>
                    <div className="text-sm text-gray-400">per successful referral</div>
                  </div>
                </div>
              </ToxicCardHeader>
              
              <ToxicCardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-black/50 p-3 rounded-lg border border-toxic-neon/20">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4 text-toxic-neon" />
                      <span className="text-gray-400 text-sm">Total Budget</span>
                    </div>
                    <span className="text-xl font-bold text-white">{bounty.totalBudget} MATIC</span>
                  </div>
                  
                  <div className="bg-black/50 p-3 rounded-lg border border-toxic-neon/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-toxic-neon" />
                      <span className="text-gray-400 text-sm">Time Remaining</span>
                    </div>
                    <span className="text-xl font-bold text-white">{getTimeRemaining()}</span>
                  </div>
                  
                  <div className="bg-black/50 p-3 rounded-lg border border-toxic-neon/20">
                    <div className="flex items-center gap-2 mb-1">
                      <UserCheck className="h-4 w-4 text-toxic-neon" />
                      <span className="text-gray-400 text-sm">Successful Referrals</span>
                    </div>
                    <span className="text-xl font-bold text-white">{bounty.successCount}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-gray-400">Budget Remaining</span>
                    <span className="text-toxic-neon">{bounty.remainingBudget} MATIC ({Math.floor((bounty.remainingBudget / bounty.totalBudget) * 100)}%)</span>
                  </div>
                  <Progress value={(bounty.remainingBudget / bounty.totalBudget) * 100} className="h-2" />
                </div>
                
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20 mt-6">
                  <h3 className="text-lg font-medium text-white mb-3">Success Criteria</h3>
                  <p className="text-gray-300">
                    {bounty.successCriteria || "Complete the required action to earn the reward. See details below."}
                  </p>
                </div>
                
                {bounty.partyAddress ? (
                  <div className="mt-6 bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                    <h3 className="text-lg font-medium text-white mb-3">Blockchain Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Party Address</div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono text-sm">{bounty.partyAddress.slice(0, 8)}...{bounty.partyAddress.slice(-6)}</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(bounty.partyAddress || "");
                              toast({
                                title: "Address Copied",
                                description: "Party address copied to clipboard",
                              });
                            }}
                            className="text-toxic-neon/70 hover:text-toxic-neon"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <a 
                            href={`https://polygonscan.com/address/${bounty.partyAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-toxic-neon/70 hover:text-toxic-neon"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                      
                      {bounty.crowdfundAddress && (
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Crowdfund Address</div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-mono text-sm">{bounty.crowdfundAddress.slice(0, 8)}...{bounty.crowdfundAddress.slice(-6)}</span>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(bounty.crowdfundAddress || "");
                                toast({
                                  title: "Address Copied",
                                  description: "Crowdfund address copied to clipboard",
                                });
                              }}
                              className="text-toxic-neon/70 hover:text-toxic-neon"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <a 
                              href={`https://polygonscan.com/address/${bounty.crowdfundAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-toxic-neon/70 hover:text-toxic-neon"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Alert className="mt-6 bg-black/50 border-yellow-500/30">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertTitle className="text-white">Not Yet On-Chain</AlertTitle>
                    <AlertDescription className="text-gray-400">
                      This bounty hasn't been deployed to the blockchain yet. The creator needs to deploy it to enable on-chain rewards.
                    </AlertDescription>
                  </Alert>
                )}
              </ToxicCardContent>
              
              <ToxicCardFooter>
                {!bounty.partyAddress && primaryWallet ? (
                  <ToxicButton
                    variant="primary"
                    onClick={handleDeployToBlockchain}
                    disabled={deploying}
                  >
                    {deploying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Deploy to Blockchain
                      </>
                    )}
                  </ToxicButton>
                ) : (
                  <ToxicButton
                    variant="outline"
                    onClick={() => navigate("/marketplace/bounty-hunters")}
                  >
                    Browse Other Bounties
                  </ToxicButton>
                )}
              </ToxicCardFooter>
            </ToxicCard>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="bg-gray-900/60 border border-toxic-neon/20">
              <CardHeader>
                <CardTitle className="text-white">Claim This Bounty</CardTitle>
                <CardDescription>
                  Share your referral link and earn rewards for each successful referral
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {!primaryWallet ? (
                  <Alert className="bg-black/50 border-toxic-neon/30 mb-4">
                    <Shield className="h-4 w-4 text-toxic-neon" />
                    <AlertTitle className="text-white">Connect Wallet</AlertTitle>
                    <AlertDescription className="text-gray-400">
                      Connect your wallet to claim this bounty and start referring
                    </AlertDescription>
                  </Alert>
                ) : (
                  referralLink ? (
                    <div className="space-y-4">
                      <div className="bg-black/50 p-3 rounded-lg border border-toxic-neon/30 break-all font-mono text-sm text-toxic-neon">
                        {referralLink}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <ToxicButton 
                          variant="outline" 
                          className="w-full" 
                          onClick={copyReferralLink}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </ToxicButton>
                        
                        <ToxicButton 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: bounty.name,
                                text: "Check out this bounty and join the Resistance!",
                                url: referralLink
                              });
                            } else {
                              copyReferralLink();
                            }
                          }}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </ToxicButton>
                      </div>
                      
                      <div className="text-sm text-gray-400 mt-2">
                        <p>You'll earn <span className="text-toxic-neon font-bold">{bounty.rewardAmount} MATIC</span> for each successful referral.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-6 h-6 border-2 border-toxic-neon border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-sm text-gray-400">Generating your referral link...</p>
                    </div>
                  )
                )}
                
                <ClaimBountyForm bounty={bounty} />
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/60 border border-toxic-neon/20 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription>
                  Recent successful referrals for this bounty
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {referrals.length === 0 ? (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    No activity recorded yet for this bounty
                  </div>
                ) : (
                  <div className="space-y-3">
                    {referrals.slice(0, 5).map((referral) => (
                      <div key={referral.id} className="bg-black/40 p-3 rounded-lg border border-toxic-neon/20">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-white text-sm font-medium">
                              {referral.referrer_address.slice(0, 6)}...{referral.referrer_address.slice(-4)}
                            </div>
                            <div className="text-gray-400 text-xs">
                              Referred: {referral.referred_address.slice(0, 6)}...{referral.referred_address.slice(-4)}
                            </div>
                          </div>
                          <span className="text-toxic-neon font-mono text-sm">
                            {referral.reward_amount || bounty.rewardAmount} MATIC
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BountyDetail;
