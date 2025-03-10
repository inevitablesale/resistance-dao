
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, Check, X, ExternalLink, Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useToast } from '@/hooks/use-toast';

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
          <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            <span>Active</span>
          </div>
        );
      case 'funded':
      case 'completed':
        return (
          <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
            <Check className="w-3 h-3" />
            <span>Funded</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
            <X className="w-3 h-3" />
            <span>Failed</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  const handleCardClick = () => {
    navigate(`/proposals/${settlement.id}`);
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
    
    navigate(`/proposals/${settlement.id}`);
  };
  
  return (
    <Card 
      className="bg-[#0a0a0a] border border-white/5 overflow-hidden hover:border-blue-500/20 transition-all cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="h-36 bg-gradient-to-b from-blue-900/20 to-blue-700/5 overflow-hidden">
        {settlement.image && (
          <img 
            src={settlement.image} 
            alt={settlement.name} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          />
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">{settlement.name}</h3>
          {statusBadge()}
        </div>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{settlement.description}</p>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Funding Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-xs text-gray-400">Raised</div>
              <div className="font-semibold">{settlement.totalRaised} ETH</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Target</div>
              <div className="font-semibold">{settlement.targetAmount} ETH</div>
            </div>
          </div>
          
          {settlement.status === 'active' && (
            <div className="text-xs text-gray-400 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-blue-400" />
              <span>{settlement.remainingTime} remaining</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        {settlement.status === 'active' ? (
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600 gap-2"
            onClick={handleContributeClick}
          >
            <Shield className="w-4 h-4" />
            Contribute
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full border-white/10 hover:bg-white/5 gap-2"
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
