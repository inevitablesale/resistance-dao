
import React from 'react';
import { SettlementCard } from './SettlementCard';
import { Settlement } from '@/hooks/useSettlements';

interface SettlementsGridProps {
  settlements: Settlement[];
}

export const SettlementsGrid: React.FC<SettlementsGridProps> = ({ settlements }) => {
  if (settlements.length === 0) {
    return (
      <div className="text-center py-12 bg-black/30 border border-toxic-neon/20 rounded-lg">
        <h3 className="text-xl text-toxic-neon mb-2">No settlements found</h3>
        <p className="text-gray-400">No settlements match your current criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {settlements.map((settlement) => (
        <SettlementCard key={settlement.id} settlement={settlement} />
      ))}
    </div>
  );
};
