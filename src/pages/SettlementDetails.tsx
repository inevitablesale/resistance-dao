
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { sentinelContributeToParty } from "@/services/partyProtocolService";
import { Shield, Users, Zap, Clock, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SettlementDetails() {
  const { settlementId } = useParams<{ settlementId: string }>();
  const { toast } = useToast();
  const { primaryWallet } = useDynamicContext();
  const [loading, setLoading] = useState(true);
  const [contribution, setContribution] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  const [settlementData, setSettlementData] = useState({
    name: "Loading...",
    description: "Loading settlement details...",
    totalRaised: "0",
    targetAmount: "0",
    backerCount: 0,
    remainingTime: "0 days",
    creator: "0x...",
    status: "active"
  });

  useEffect(() => {
    // In a real implementation, this would fetch the settlement data from the Party contract
    // For now, we'll use placeholder data
    setTimeout(() => {
      setSettlementData({
        name: "Decentralized Identity Protocol",
        description: "A protocol for self-sovereign identity management using zero-knowledge proofs",
        totalRaised: "125.5",
        targetAmount: "500",
        backerCount: 12,
        remainingTime: "13 days",
        creator: "0x7b1B2b967923bC3EB4d9Bf5472EA017Ac644e4A2",
        status: "active"
      });
      setLoading(false);
    }, 1500);
  }, [settlementId]);

  const handleContribute = async () => {
    if (!primaryWallet || !contribution || !settlementId) return;
    
    setIsContributing(true);
    try {
      toast({
        title: "Processing Contribution...",
        description: "Please approve the transaction",
      });
      
      // In a real implementation, this would use the crowdfund address
      await sentinelContributeToParty(
        primaryWallet, 
        settlementId, // This would actually be the crowdfund address
        contribution,
        undefined,
        "Supporting the settlement"
      );
      
      toast({
        title: "Contribution Successful!",
        description: `You've contributed ${contribution} ETH to the settlement.`,
      });
      
      // Reset form and refresh data
      setContribution("");
      
    } catch (error: any) {
      console.error("Error contributing:", error);
      toast({
        title: "Contribution Failed",
        description: error.message || "An error occurred while processing your contribution.",
        variant: "destructive",
      });
    } finally {
      setIsContributing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Link 
                to="/settlements" 
                className="text-blue-400 hover:text-blue-300 text-sm mb-2 flex items-center gap-1"
              >
                <span>←</span> All Settlements
              </Link>
              <h1 className="text-4xl font-bold">{settlementData.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-sm ${
                settlementData.status === 'active' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {settlementData.status === 'active' ? 'Active Funding' : 'Funding Complete'}
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="md:col-span-2">
              <div className="bg-[#111] rounded-xl border border-white/5 p-6 space-y-6">
                <h2 className="text-xl font-semibold">Settlement Vision</h2>
                <p className="text-gray-300">{settlementData.description}</p>
                
                <Separator className="my-6 bg-white/10" />
                
                <h2 className="text-xl font-semibold">Funding Progress</h2>
                <div className="bg-black/50 h-4 w-full rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full" 
                    style={{ 
                      width: `${Math.min(
                        100, 
                        (parseFloat(settlementData.totalRaised) / parseFloat(settlementData.targetAmount)) * 100
                      )}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{settlementData.totalRaised} ETH raised</span>
                  <span>Target: {settlementData.targetAmount} ETH</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-[#0a1020] p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Backers</span>
                    </div>
                    <span className="text-2xl font-bold">{settlementData.backerCount}</span>
                  </div>
                  
                  <div className="bg-[#0a1020] p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm">Progress</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {Math.round((parseFloat(settlementData.totalRaised) / parseFloat(settlementData.targetAmount)) * 100)}%
                    </span>
                  </div>
                  
                  <div className="bg-[#0a1020] p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Remaining</span>
                    </div>
                    <span className="text-2xl font-bold">{settlementData.remainingTime}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-[#111] rounded-xl border border-white/5 p-6 space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Sentinel Contribution
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Contribution Amount (ETH)</label>
                    <div className="flex mt-1">
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={contribution}
                        onChange={(e) => setContribution(e.target.value)}
                        className="bg-black/50 border-white/10"
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleContribute}
                    disabled={isContributing || !contribution}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    {isContributing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Contribute to Settlement
                      </>
                    )}
                  </Button>
                  
                  <div className="text-xs text-gray-400">
                    By contributing, you'll receive governance rights in this settlement proportional to your contribution.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ResistanceWalletWidget />
    </div>
  );
}
