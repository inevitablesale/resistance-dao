
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  SettlementCard as StyledSettlementCard, 
  SettlementCardHeader, 
  SettlementCardContent 
} from '@/components/ui/card';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { ToxicButton } from '@/components/ui/toxic-button';
import { Progress } from '@/components/ui/progress';
import { Users, Calendar, Building2 } from 'lucide-react';
import { Settlement } from '@/hooks/useSettlements';

interface SettlementCardProps {
  settlement: Settlement;
}

export const SettlementCard: React.FC<SettlementCardProps> = ({ settlement }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'funding': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const fundingProgress = parseFloat(settlement.totalPledged) / parseFloat(settlement.targetCapital) * 100;
  const date = new Date(settlement.createdAt * 1000);
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  return (
    <StyledSettlementCard>
      <SettlementCardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-mono text-toxic-neon truncate">{settlement.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <ToxicBadge className={`${getStatusColor(settlement.status)}`}>
            {settlement.status.charAt(0).toUpperCase() + settlement.status.slice(1)}
          </ToxicBadge>
        </div>
      </SettlementCardHeader>
      
      <SettlementCardContent>
        <div className="mb-4">
          <p className="text-gray-400 text-sm line-clamp-2">{settlement.description}</p>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Funding Progress</span>
            <span className="text-toxic-neon">{parseFloat(settlement.totalPledged).toFixed(2)} / {parseFloat(settlement.targetCapital).toFixed(2)} ETH</span>
          </div>
          <Progress value={fundingProgress} className="h-2" />
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Users className="h-4 w-4" />
            <span>{settlement.backerCount} backers</span>
          </div>
          {settlement.category && (
            <ToxicBadge variant="outline" className="bg-black/30">
              {settlement.category}
            </ToxicBadge>
          )}
        </div>
        
        <Link to={`/settlement/${settlement.id}`}>
          <ToxicButton variant="primary" className="w-full">
            View Settlement
          </ToxicButton>
        </Link>
      </SettlementCardContent>
    </StyledSettlementCard>
  );
};
