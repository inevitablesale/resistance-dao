
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, Check, X, ExternalLink, Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useToast } from '@/hooks/use-toast';
import { ToxicBadge } from "@/components/ui/toxic-badge";

interface Settlement {
  id: string;
  name: string;
  description: string;
  totalRaised: string;
  targetAmount: string;
  remainingTime: string;
  status: 'active' | 'completed' | 'funded' | 'failed';
  image?: string;
}

interface SettlementCardProps {
  settlement: Settlement;
}

export const SettlementCard: React.FC<SettlementCardProps> = ({ settlement }) => {
  const navigate = useNavigate();
  const { isConnected, connect } = useWalletConnection();
  const { toast } = useToast();
  
  // Calculate progress percentage
  const progress = Math.min(
    100,
    (Number(settlement.totalRaised) / Number(settlement.targetAmount)) * 100
  );
  
  const statusBadge = () => {
    switch (settlement.status) {
      case 'active':
        return (
          <ToxicBadge variant="status" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Active</span>
          </ToxicBadge>
        );
      case 'funded':
      case 'completed':
        return (
          <ToxicBadge variant="default" className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>Funded</span>
          </ToxicBadge>
        );
      case 'failed':
        return (
          <ToxicBadge variant="danger" className="flex items-center gap-1">
            <X className="w-3 h-3" />
            <span>Failed</span>
          </ToxicBadge>
        );
      default:
        return null;
    }
  };
  
  const handleCardClick = () => {
    navigate(`/settlements/${settlement.id}`);
  };
  
  const handleContributeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    
    if (!isConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to contribute to this settlement",
      });
      connect();
      return;
    }
    
    navigate(`/settlements/${settlement.id}`);
  };
  
  return (
    <Card 
      className="bg-[#0a0a0a] border border-toxic-neon/20 overflow-hidden hover:border-toxic-neon/60 transition-all cursor-pointer group shadow-[0_0_10px_rgba(57,255,20,0.1)]"
      onClick={handleCardClick}
    >
      <div className="h-40 bg-gradient-to-b from-toxic-dark to-black overflow-hidden">
        {settlement.image ? (
          <img 
            src={settlement.image} 
            alt={settlement.name} 
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <Shield className="w-12 h-12 text-toxic-neon" />
          </div>
        )}
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold group-hover:text-toxic-neon transition-colors line-clamp-1 text-white">{settlement.name}</h3>
          {statusBadge()}
        </div>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">{settlement.description}</p>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Funding Progress</span>
              <span className="text-toxic-neon font-medium">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-black/50" indicatorClassName="bg-toxic-neon" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-400">Raised</div>
              <div className="font-semibold text-white">{settlement.totalRaised} ETH</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Target</div>
              <div className="font-semibold text-white">{settlement.targetAmount} ETH</div>
            </div>
          </div>
          
          {settlement.status === 'active' && (
            <div className="text-xs text-toxic-neon flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              <span>{settlement.remainingTime} remaining</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        {settlement.status === 'active' ? (
          <Button 
            className="w-full bg-toxic-dark/70 text-toxic-neon border border-toxic-neon/60 shadow-[0_0_10px_rgba(57,255,20,0.3)] hover:bg-toxic-dark/50 hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] gap-2"
            onClick={handleContributeClick}
          >
            <Shield className="w-4 h-4" />
            Contribute
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full border-toxic-neon/30 bg-transparent text-toxic-neon/70 shadow-[0_0_8px_rgba(57,255,20,0.1)] hover:bg-toxic-neon/5 hover:border-toxic-neon/50 hover:text-toxic-neon/90 hover:shadow-[0_0_12px_rgba(57,255,20,0.2)] gap-2"
            onClick={handleCardClick}
          >
            <ExternalLink className="w-4 h-4" />
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
