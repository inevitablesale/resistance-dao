
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Shield, Users, BadgeDollarSign, Target, Link as LinkIcon, CheckCircle, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ToxicCard } from "@/components/ui/toxic-card";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getBounty, Bounty } from "@/services/bountyService";
import ReferralLinkManager from "@/components/referrals/ReferralLinkManager";
import { ClaimBountyForm } from "./ClaimBountyForm";
import { useToast } from "@/hooks/use-toast";

export function BountyDetail() {
  const { bountyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [loading, setLoading] = useState(true);
  const [showClaimForm, setShowClaimForm] = useState(false);
  
  useEffect(() => {
    const loadBounty = async () => {
      setLoading(true);
      try {
        if (!bountyId) {
          throw new Error("Bounty ID is required");
        }
        
        const fetchedBounty = await getBounty(bountyId);
        setBounty(fetchedBounty);
      } catch (error) {
        console.error("Error loading bounty:", error);
        toast({
          title: "Error",
          description: "Failed to load bounty details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadBounty();
  }, [bountyId, toast]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-toxic-neon">Loading bounty details...</div>
      </div>
    );
  }
  
  if (!bounty) {
    return (
      <Card className="bg-gray-900/60 border border-toxic-neon/20">
        <CardHeader>
          <CardTitle className="text-white">Bounty Not Found</CardTitle>
          <CardDescription>
            The bounty you're looking for doesn't exist or has been removed.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate("/marketplace/bounty-hunters")}>
            Return to Bounties
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  const percentUsed = (bounty.usedBudget / bounty.totalBudget) * 100;
  const expirationDate = new Date(bounty.expiresAt * 1000).toLocaleDateString();
  const daysRemaining = Math.max(0, Math.floor((bounty.expiresAt - Date.now()/1000) / (24 * 60 * 60)));
  
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate("/marketplace/bounty-hunters")} className="mb-4">
        ← Back to Bounties
      </Button>
      
      <Card className="bg-gray-900/60 border border-toxic-neon/20">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={`
                  ${bounty.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/50' : ''}
                  ${bounty.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : ''}
                  ${bounty.status === 'expired' ? 'bg-red-500/20 text-red-400 border-red-500/50' : ''}
                  ${bounty.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : ''}
                `}>
                  {bounty.status.toUpperCase()}
                </Badge>
                <Target className="h-5 w-5 text-toxic-neon" />
              </div>
              <CardTitle className="text-white text-2xl mb-2">{bounty.name}</CardTitle>
              <CardDescription className="text-gray-300">
                {bounty.description}
              </CardDescription>
            </div>
            {bounty.status === 'active' && (
              <ToxicButton onClick={() => setShowClaimForm(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Claim Reward
              </ToxicButton>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Bounty Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
              <div className="flex items-center gap-2 mb-2">
                <BadgeDollarSign className="h-5 w-5 text-toxic-neon" />
                <span className="text-gray-400 text-sm">Reward Per Referral</span>
              </div>
              <span className="text-xl font-bold text-white block">{bounty.rewardAmount} MATIC</span>
            </div>
            
            <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-toxic-neon" />
                <span className="text-gray-400 text-sm">Successful Referrals</span>
              </div>
              <span className="text-xl font-bold text-white block">{bounty.successCount}</span>
            </div>
            
            <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-toxic-neon" />
                <span className="text-gray-400 text-sm">Expiration Date</span>
              </div>
              <span className="text-xl font-bold text-white block">{expirationDate}</span>
            </div>
            
            <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-toxic-neon" />
                <span className="text-gray-400 text-sm">Days Remaining</span>
              </div>
              <span className="text-xl font-bold text-white block">{daysRemaining}</span>
            </div>
          </div>
          
          {/* Budget Progress */}
          <ToxicCard className="border border-toxic-neon/30 bg-black/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-toxic-neon text-lg">Budget Utilization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Budget:</span>
                  <span className="text-white font-mono">{bounty.totalBudget} MATIC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Used Budget:</span>
                  <span className="text-white font-mono">{bounty.usedBudget} MATIC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Remaining Budget:</span>
                  <span className="text-toxic-neon font-mono">{bounty.remainingBudget} MATIC</span>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1 text-xs text-gray-400">
                    <span>Budget Utilization</span>
                    <span>{percentUsed.toFixed(0)}%</span>
                  </div>
                  <Progress value={percentUsed} className="h-2" />
                </div>
              </div>
            </CardContent>
          </ToxicCard>
          
          {/* Claim Form */}
          {showClaimForm && (
            <ToxicCard className="border border-toxic-neon/30 bg-black/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-toxic-neon text-lg">Claim Bounty Reward</CardTitle>
              </CardHeader>
              <CardContent>
                <ClaimBountyForm 
                  bountyId={bounty.id} 
                  onSuccess={() => {
                    setShowClaimForm(false);
                    // Reload bounty data after successful claim
                    getBounty(bounty.id).then(setBounty);
                  }}
                  onCancel={() => setShowClaimForm(false)}
                />
              </CardContent>
            </ToxicCard>
          )}
          
          {/* Referral Link */}
          <ToxicCard className="border border-toxic-neon/30 bg-black/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-toxic-neon text-lg">Share Your Referral Link</CardTitle>
            </CardHeader>
            <CardContent>
              <ReferralLinkManager address="0x" />
              <p className="text-sm text-gray-400 mt-3">
                Share this link to earn {bounty.rewardAmount} MATIC for each successful referral.
              </p>
            </CardContent>
          </ToxicCard>
          
          {/* Success Criteria */}
          <div className="bg-black/30 p-4 rounded-lg border border-toxic-neon/20">
            <h3 className="text-white font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-toxic-neon" />
              Success Criteria
            </h3>
            <p className="text-gray-300">{bounty.successCriteria || "Complete the specific task required by this bounty to earn the reward."}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
