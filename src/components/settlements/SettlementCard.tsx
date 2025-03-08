
import React from 'react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Shield, Target, Users, Radiation, Clock, ChevronRight, 
  Biohazard, Building2, Coins, Home
} from "lucide-react";
import { ToxicCard, ToxicCardContent } from "@/components/ui/toxic-card";
import { ToxicBadge } from "@/components/ui/toxic-badge";
import { ToxicButton } from "@/components/ui/toxic-button";
import { ToxicProgress } from "@/components/ui/toxic-progress";
import { DrippingSlime } from "@/components/ui/dripping-slime";
import { ProposalMetadata } from "@/types/proposals";
import { formatDistanceToNow } from "date-fns";
import { isPast } from "date-fns";

interface SettlementCardProps {
  tokenId: string;
  blockNumber: number;
  pledgedAmount?: string;
  metadata?: ProposalMetadata;
  formatUSDAmount: (amount: string) => string;
  index?: number;
  isLoading?: boolean;
  error?: string;
}

export const SettlementCard = ({ 
  tokenId, 
  blockNumber,
  pledgedAmount = "0", 
  metadata,
  formatUSDAmount,
  index = 0,
  isLoading,
  error
}: SettlementCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/proposals/${tokenId}`);
  };

  const getSettlementRisk = () => {
    if (!metadata?.investment?.targetCapital || !pledgedAmount) return 85;
    const progress = (Number(pledgedAmount) / Number(metadata.investment.targetCapital)) * 100;
    return Math.max(5, 100 - progress);
  };

  const getSettlementRiskLabel = (risk: number) => {
    if (risk > 75) return "Critical";
    if (risk > 50) return "High";
    if (risk > 25) return "Moderate";
    return "Low";
  };

  const getRiskBadgeClass = (risk: number) => {
    if (risk > 75) return "bg-black border-apocalypse-red/70 text-apocalypse-red";
    if (risk > 50) return "bg-black border-yellow-400/70 text-yellow-400";
    return "bg-black border-toxic-neon/70 text-toxic-neon";
  };

  const getTimeRemaining = () => {
    if (!metadata?.submissionTimestamp || !metadata?.votingDuration) {
      return "Unknown";
    }
    
    const submissionTimestamp = metadata.submissionTimestamp;
    const endTimestamp = (submissionTimestamp + metadata.votingDuration) * 1000;
    const endDate = new Date(endTimestamp);
    
    if (isPast(endDate)) {
      return "Voting ended";
    }
    
    return `${formatDistanceToNow(endDate)} left`;
  };

  const settlementRisk = getSettlementRisk();
  const timeRemaining = getTimeRemaining();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <ToxicCard 
        className="bg-black/90 border-toxic-neon/30 hover:border-toxic-neon/60 transition-all cursor-pointer p-0"
        onClick={handleClick}
      >
        <ToxicCardContent className="p-0">
          <div className="relative h-48 bg-gradient-to-b from-transparent to-black/90 rounded-t-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Building2 className="w-20 h-20 text-toxic-neon/50" />
            </div>
            
            <DrippingSlime position="top" dripsCount={5} toxicGreen={true} showIcons={false} />
            
            <div className="absolute top-0 left-0 right-0 p-2">
              <div className="bg-black/60 border border-toxic-neon/30 rounded-full px-4 py-1 flex items-center justify-center mx-auto max-w-[90%]">
                <Shield className="h-4 w-4 mr-2 text-toxic-neon" />
                <span className="text-toxic-neon font-mono uppercase tracking-wider text-sm">Settlement Outpost</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-black">
            {/* Name */}
            <h4 className="text-2xl font-mono text-toxic-neon mb-4 text-center">
              {metadata?.title || `Settlement #${tokenId}`}
            </h4>
            
            {/* Settlement Status Badge */}
            <div className="flex justify-center mb-4">
              <ToxicBadge 
                variant="secondary" 
                className={`border px-4 py-1 rounded-full ${getRiskBadgeClass(settlementRisk)}`}
              >
                <Radiation className="h-4 w-4 mr-2" />
                RISK LEVEL: {getSettlementRiskLabel(settlementRisk)} ({Math.round(settlementRisk)}%)
              </ToxicBadge>
            </div>
            
            {/* Settlement Details */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Required Resources:</span>
                <span className="text-toxic-neon">{metadata?.investment?.targetCapital || "Unknown"} RD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Current Pledges:</span>
                <span className="text-toxic-neon">{pledgedAmount} RD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Security Status:</span>
                <span className="text-toxic-neon">{timeRemaining}</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <ToxicProgress 
                variant="radiation" 
                value={100 - settlementRisk} 
                className="h-2 mb-2" 
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>Vulnerability</span>
                <span>Security</span>
              </div>
            </div>
            
            {/* Button */}
            <ToxicButton 
              className="w-full bg-black border-toxic-neon hover:bg-toxic-dark/80 text-sm group transition-all duration-300"
              size="sm"
              variant="marketplace"
            >
              <Target className="h-4 w-4 mr-1 group-hover:animate-pulse" /> Secure Settlement
            </ToxicButton>
          </div>
        </ToxicCardContent>
      </ToxicCard>
    </motion.div>
  );
};
