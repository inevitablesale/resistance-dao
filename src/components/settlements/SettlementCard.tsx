
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Shield, Zap } from "lucide-react";
import { GovernanceStats } from "./GovernanceStats";

interface SettlementCardProps {
  settlement: {
    id: string;
    name: string;
    description: string;
    totalRaised: string;
    targetAmount: string;
    remainingTime: string;
    status: string;
    image?: string;
  };
}

export const SettlementCard = ({ settlement }: SettlementCardProps) => {
  const progressPercentage = Math.min(
    100,
    (parseFloat(settlement.totalRaised) / parseFloat(settlement.targetAmount)) * 100
  );
  
  return (
    <Link to={`/settlement/${settlement.id}`}>
      <Card className="bg-[#0a0a0a] border border-white/5 hover:border-blue-500/30 transition-all duration-200 h-full overflow-hidden flex flex-col">
        <div className="relative">
          <div className="h-36 bg-gradient-to-b from-blue-900/20 to-blue-700/5 flex items-center justify-center">
            {settlement.image ? (
              <img 
                src={settlement.image} 
                alt={settlement.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <Shield className="w-12 h-12 text-blue-400/30" />
            )}
          </div>
          <Badge 
            className={`absolute top-3 right-3 ${
              settlement.status === 'active' 
                ? 'bg-green-500/20 hover:bg-green-500/20 text-green-400' 
                : settlement.status === 'completed'
                  ? 'bg-blue-500/20 hover:bg-blue-500/20 text-blue-400'
                  : 'bg-red-500/20 hover:bg-red-500/20 text-red-400'
            }`}
          >
            {settlement.status === 'active' ? 'Active' : 
             settlement.status === 'completed' ? 'Funded' : 'Failed'}
          </Badge>
        </div>
        
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{settlement.name}</h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{settlement.description}</p>
          
          <div className="mt-auto space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Funding</span>
              <span>{ethers.utils.commify(settlement.totalRaised)} / {ethers.utils.commify(settlement.targetAmount)} ETH</span>
            </div>
            
            <Progress value={progressPercentage} className="h-1.5 bg-gray-800" />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{settlement.remainingTime}</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-blue-400">
                <Zap className="w-3 h-3" />
                <span>{progressPercentage.toFixed(0)}% Funded</span>
              </div>
            </div>
            
            <GovernanceStats settlementId={settlement.id} compact={true} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
