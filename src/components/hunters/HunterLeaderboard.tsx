
import React, { useState, useEffect } from "react";
import { BountyMetadata, HunterTierLevel } from "@/types/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HunterTierBadge } from "./HunterTierBadge";
import { TrophyIcon, ArrowUpIcon, Medal } from "lucide-react";
import { shortenAddress } from "@/lib/utils";

interface HunterLeaderboardProps {
  bountyMetadata: BountyMetadata;
  className?: string;
}

export const HunterLeaderboard: React.FC<HunterLeaderboardProps> = ({
  bountyMetadata,
  className
}) => {
  const [hunters, setHunters] = useState<Array<{
    address: string;
    performanceData: any;
    rank: number;
  }>>([]);
  
  const [period, setPeriod] = useState<"all" | "weekly" | "monthly">("all");
  
  useEffect(() => {
    // Transform hunter performance data into a sortable array
    if (bountyMetadata.hunterPerformance) {
      const hunterEntries = Object.entries(bountyMetadata.hunterPerformance)
        .map(([address, data]) => ({
          address,
          performanceData: data,
          rank: 0 // To be set after sorting
        }))
        .filter(hunter => {
          // Filter based on period if needed
          if (period === "all") return true;
          
          const lastUpdated = hunter.performanceData.lastUpdated;
          const now = Math.floor(Date.now() / 1000);
          const oneWeek = 7 * 24 * 60 * 60;
          const oneMonth = 30 * 24 * 60 * 60;
          
          if (period === "weekly" && (now - lastUpdated) > oneWeek) {
            return false;
          }
          
          if (period === "monthly" && (now - lastUpdated) > oneMonth) {
            return false;
          }
          
          return true;
        })
        .sort((a, b) => {
          // Sort by successful referrals first
          const refDiff = b.performanceData.successfulReferrals - a.performanceData.successfulReferrals;
          if (refDiff !== 0) return refDiff;
          
          // Then by success rate
          return b.performanceData.successRate - a.performanceData.successRate;
        });
      
      // Assign ranks
      hunterEntries.forEach((hunter, index) => {
        hunter.rank = index + 1;
      });
      
      setHunters(hunterEntries);
    }
  }, [bountyMetadata.hunterPerformance, period]);
  
  // Generate random avatar background color based on address
  const getAvatarColor = (address: string) => {
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", 
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
    ];
    
    // Use a hash function to map address to a color
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
      hash = ((hash << 5) - hash) + address.charCodeAt(i);
      hash &= hash;
    }
    
    // Ensure positive index
    hash = Math.abs(hash);
    return colors[hash % colors.length];
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrophyIcon className="h-5 w-5 text-yellow-500" />
            Hunter Leaderboard
          </CardTitle>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs px-2">All Time</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs px-2">Monthly</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs px-2">Weekly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardDescription>
          Top performing bounty hunters ranked by successful referrals
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hunters.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No hunter data available yet
          </div>
        ) : (
          <div className="space-y-1">
            {hunters.slice(0, 10).map((hunter) => {
              const isTopThree = hunter.rank <= 3;
              
              return (
                <div 
                  key={hunter.address}
                  className={`
                    flex items-center p-2 rounded-md
                    ${isTopThree ? 'bg-gradient-to-r from-black/20 to-yellow-500/10 border border-yellow-500/20' : 'hover:bg-black/10'}
                  `}
                >
                  <div className="flex items-center justify-center w-8">
                    {hunter.rank === 1 ? (
                      <Medal className="h-5 w-5 text-yellow-500" />
                    ) : hunter.rank === 2 ? (
                      <Medal className="h-5 w-5 text-slate-300" />
                    ) : hunter.rank === 3 ? (
                      <Medal className="h-5 w-5 text-amber-600" />
                    ) : (
                      <span className="text-gray-500 font-medium">{hunter.rank}</span>
                    )}
                  </div>
                  
                  <Avatar className={`h-8 w-8 ${getAvatarColor(hunter.address)}`}>
                    <AvatarFallback>
                      {hunter.address.substring(2, 4)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <span className="font-medium">
                        {shortenAddress(hunter.address)}
                      </span>
                      <HunterTierBadge
                        tier={hunter.performanceData.currentTier as HunterTierLevel}
                        multiplier={hunter.performanceData.rewardMultiplier}
                        compact
                        className="ml-2 text-xs"
                      />
                    </div>
                    <div className="text-xs text-gray-400">
                      {hunter.performanceData.successfulReferrals} successful ({Math.round(hunter.performanceData.successRate)}% rate)
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-green-500">
                      {(hunter.performanceData.totalEarned || 0).toFixed(2)} ETH
                    </div>
                    <div className="text-xs flex items-center justify-end text-gray-400">
                      {hunter.performanceData.rewardMultiplier.toFixed(1)}x
                      <ArrowUpIcon className="h-3 w-3 ml-1 text-green-500" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HunterLeaderboard;
