
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Biohazard, Target, Filter, Shield, Home, Building2 } from "lucide-react";
import { ToxicButton } from "@/components/ui/toxic-button";
import { useNavigate } from "react-router-dom";
import { ProposalEvent } from "@/types/proposals";
import { SettlementCard } from "./SettlementCard";

interface SettlementsGridProps {
  settlements: ProposalEvent[];
  isLoading: boolean;
  formatUSDAmount: (amount: string) => string;
  title?: string;
  className?: string;
}

export const SettlementsGrid = ({
  settlements,
  isLoading,
  formatUSDAmount,
  title = "Active Settlements",
  className = ""
}: SettlementsGridProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6 text-center text-white/60">
          <p>Scanning for settlements...</p>
        </CardContent>
      </Card>
    );
  }

  if (settlements.length === 0) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6 text-center">
          <p className="text-white/60 mb-4">No settlements discovered in the wasteland</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/thesis')}
            className="bg-toxic-dark/50 border-toxic-neon/50 text-toxic-neon hover:bg-toxic-dark"
          >
            <Home className="h-4 w-4 mr-2" />
            Establish Settlement
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-mono text-toxic-neon flex items-center toxic-glow">
          <Building2 className="h-5 w-5 mr-2" /> {title}
        </h3>
        
        <div className="flex items-center gap-2">
          <ToxicButton 
            variant="ghost" 
            size="sm" 
            className="text-toxic-neon hover:bg-toxic-dark/20"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </ToxicButton>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {settlements.map((settlement, index) => (
          <SettlementCard
            key={settlement.tokenId}
            tokenId={settlement.tokenId}
            blockNumber={settlement.blockNumber}
            pledgedAmount={settlement.pledgedAmount}
            metadata={settlement.metadata}
            formatUSDAmount={formatUSDAmount}
            index={index}
            isLoading={settlement.isLoading}
            error={settlement.error}
          />
        ))}
      </div>
    </div>
  );
};
