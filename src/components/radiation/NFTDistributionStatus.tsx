
import React from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { ToxicButton } from '@/components/ui/toxic-button';
import { Shield, Target, Hammer, Radiation } from 'lucide-react';

interface NFTSupply {
  type: 'sentinel' | 'bounty-hunter' | 'survivor';
  name: string;
  icon: React.ReactNode;
  total: number;
  claimed: number;
  free: number;
  cost: number | 'Free';
  description: string;
}

interface NFTDistributionStatusProps {
  className?: string;
}

export function NFTDistributionStatus({ className = "" }: NFTDistributionStatusProps) {
  const nftSupplies: NFTSupply[] = [
    {
      type: 'sentinel',
      name: "Founder Sentinels",
      icon: <Shield className="h-5 w-5 text-purple-400" />,
      total: 1500,
      claimed: 326,
      free: 821,
      cost: 50,
      description: "Governance & Economic Oversight"
    },
    {
      type: 'bounty-hunter',
      name: "Bounty Hunters",
      icon: <Target className="h-5 w-5 text-apocalypse-red" />,
      total: 500,
      claimed: 187,
      free: 500,
      cost: 'Free',
      description: "Enforcers & Funders"
    },
    {
      type: 'survivor',
      name: "Survivors",
      icon: <Hammer className="h-5 w-5 text-amber-400" />,
      total: 1500,
      claimed: 412,
      free: 0,
      cost: 50,
      description: "Builders & Innovators"
    }
  ];

  // Calculate total claimed and percentage
  const totalNFTs = nftSupplies.reduce((sum, supply) => sum + supply.total, 0);
  const totalClaimed = nftSupplies.reduce((sum, supply) => sum + supply.claimed, 0);
  const claimedPercentage = (totalClaimed / totalNFTs) * 100;
  
  // Calculate radiation reduction
  const radiationReduction = totalClaimed * 0.1;

  return (
    <ToxicCard className={`bg-black/80 border-toxic-neon/30 p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-toxic-neon/10">
          <Radiation className="h-6 w-6 text-toxic-neon" />
        </div>
        <div>
          <h2 className="text-xl font-mono text-toxic-neon">NFT Distribution Status</h2>
          <p className="text-white/60 text-sm">Total Radiation Reduction: {radiationReduction.toFixed(1)}%</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-white/70">Global Claim Progress</span>
          <span className="text-toxic-neon font-mono">{totalClaimed} / {totalNFTs}</span>
        </div>
        <ToxicProgress 
          value={claimedPercentage} 
          variant="radiation" 
          className="h-3" 
        />
      </div>
      
      <div className="space-y-4">
        {nftSupplies.map((supply) => (
          <div key={supply.type} className="bg-black/40 rounded-lg p-3 border border-toxic-neon/20">
            <div className="flex items-center gap-2 mb-2">
              {supply.icon}
              <div>
                <h3 className="text-toxic-neon font-mono">{supply.name}</h3>
                <p className="text-white/60 text-xs">{supply.description}</p>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/70">Claimed</span>
                <span className="text-toxic-neon font-mono">{supply.claimed} / {supply.total}</span>
              </div>
              <ToxicProgress 
                value={(supply.claimed / supply.total) * 100}
                variant={supply.type === 'sentinel' ? 'governance' : supply.type === 'bounty-hunter' ? 'reputation' : 'staking'}
                className="h-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-black/30 p-2 rounded">
                <span className="text-white/60 block">Free Claims</span>
                <span className="text-toxic-neon font-mono">{Math.max(0, supply.free - supply.claimed)} remaining</span>
              </div>
              <div className="bg-black/30 p-2 rounded">
                <span className="text-white/60 block">Cost</span>
                <span className="text-toxic-neon font-mono">
                  {typeof supply.cost === 'number' ? `${supply.cost} MATIC` : supply.cost}
                </span>
              </div>
            </div>
            
            <ToxicButton 
              variant={supply.type === 'sentinel' ? 'default' : supply.type === 'bounty-hunter' ? 'primary' : 'outline'}
              size="sm"
              className="w-full"
            >
              Claim {supply.name.replace('s', '')}
            </ToxicButton>
          </div>
        ))}
      </div>
    </ToxicCard>
  );
}
