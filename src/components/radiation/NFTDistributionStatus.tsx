
import React from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { ToxicButton } from '@/components/ui/toxic-button';
import { Shield, Target, Hammer, Radiation, Loader2 } from 'lucide-react';
import { useContractStats } from '@/hooks/useContractNFTs';
import { useCustomWallet } from '@/hooks/useCustomWallet';

interface NFTDistributionStatusProps {
  className?: string;
}

export function NFTDistributionStatus({ className = "" }: NFTDistributionStatusProps) {
  const { data: contractStats, isLoading: isLoadingStats } = useContractStats();
  const { isConnected } = useCustomWallet();
  
  // Total supply targets for each NFT type
  const TOTAL_SENTINELS = 1500;
  const TOTAL_BOUNTY_HUNTERS = 500;
  const TOTAL_SURVIVORS = 1500;
  
  // Get the total claimed NFTs (from contract stats)
  const totalClaimed = contractStats?.totalMinted || 0;
  console.log("Total claimed from contract stats:", totalClaimed);
  
  // Calculate the total NFT supply for all types
  const totalNFTs = TOTAL_SENTINELS + TOTAL_BOUNTY_HUNTERS + TOTAL_SURVIVORS;
  
  // Calculate the claimed percentage
  const claimedPercentage = (totalClaimed / totalNFTs) * 100;
  
  // Calculate radiation reduction - each NFT reduces radiation by 0.1%
  const radiationReduction = totalClaimed * 0.1;
  
  // Estimated distribution by role (simplified)
  // For a real implementation, we'd need to analyze the actual NFT metadata attributes
  const estimatedSentinels = Math.floor(totalClaimed * (TOTAL_SENTINELS / totalNFTs));
  const estimatedBountyHunters = Math.floor(totalClaimed * (TOTAL_BOUNTY_HUNTERS / totalNFTs));
  const estimatedSurvivors = totalClaimed - estimatedSentinels - estimatedBountyHunters;
  
  // Calculate radiation visibility level based on estimated claimed Sentinels
  const getRadiationVisibility = (claimedSentinels: number): string => {
    if (claimedSentinels <= 100) return "10% Exposed";
    if (claimedSentinels <= 300) return "25% Exposed";
    if (claimedSentinels <= 600) return "50% Exposed";
    if (claimedSentinels <= 1000) return "75% Exposed";
    return "100% Exposed";
  };
  
  // Get radiation effect description
  const getRadiationEffect = (claimedSentinels: number): string => {
    if (claimedSentinels <= 100) return "Heavy Fog, Intense Radiation Glow";
    if (claimedSentinels <= 300) return "Pulsing Radiation with Small Breaks";
    if (claimedSentinels <= 600) return "Thin Fog, Radiation Dissipating";
    if (claimedSentinels <= 1000) return "Faint Radiation Glow Remaining";
    return "No More Radiation, Full Detail";
  };

  // Get visibility and effect based on estimated Sentinels
  const visibilityStatus = getRadiationVisibility(estimatedSentinels);
  const radiationEffect = getRadiationEffect(estimatedSentinels);
  
  // Define NFT supplies with metadata
  const nftSupplies = [
    {
      type: 'sentinel',
      name: "Founder Sentinels",
      icon: <Shield className="h-5 w-5 text-purple-400" />,
      total: TOTAL_SENTINELS,
      claimed: estimatedSentinels,
      free: Math.max(0, TOTAL_SENTINELS - estimatedSentinels),
      cost: 50,
      description: "Governance & Economic Oversight"
    },
    {
      type: 'bounty-hunter',
      name: "Bounty Hunters",
      icon: <Target className="h-5 w-5 text-apocalypse-red" />,
      total: TOTAL_BOUNTY_HUNTERS,
      claimed: estimatedBountyHunters,
      free: Math.max(0, TOTAL_BOUNTY_HUNTERS - estimatedBountyHunters),
      cost: 'Free',
      description: "Enforcers & Funders"
    },
    {
      type: 'survivor',
      name: "Survivors",
      icon: <Hammer className="h-5 w-5 text-amber-400" />,
      total: TOTAL_SURVIVORS,
      claimed: estimatedSurvivors,
      free: 0, // No free survivors
      cost: 50,
      description: "Builders & Innovators"
    }
  ];

  // Loading state
  if (isLoadingStats) {
    return (
      <ToxicCard className={`bg-black/80 border-toxic-neon/30 p-5 ${className}`}>
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-toxic-neon animate-spin mb-4" />
          <p className="text-toxic-neon">Loading Contract Data...</p>
          <p className="text-sm text-toxic-muted mt-2">Scanning blockchain for NFT distribution stats</p>
        </div>
      </ToxicCard>
    );
  }

  return (
    <ToxicCard className={`bg-black/80 border-toxic-neon/30 p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-toxic-neon/10">
          <Radiation className="h-6 w-6 text-toxic-neon" />
        </div>
        <div>
          <h2 className="text-xl font-mono text-toxic-neon">NFT Distribution Status</h2>
          <p className="text-white/60 text-sm">
            {contractStats?.contractName || "Unknown"} ({contractStats?.contractSymbol || "???"}) - Total Minted: {totalClaimed}
          </p>
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
      
      {/* Radiation Reveal Status Section */}
      <div className="mb-6 bg-black/40 rounded-lg p-3 border border-toxic-neon/20">
        <h3 className="text-toxic-neon font-mono mb-2">Radiation Dissipation Status</h3>
        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
          <div>
            <span className="text-white/70 block mb-1">Sentinel Reveal Progress</span>
            <span className="text-toxic-neon font-mono">{estimatedSentinels} / {TOTAL_SENTINELS}</span>
            <ToxicProgress 
              value={(estimatedSentinels / TOTAL_SENTINELS) * 100}
              variant="radiation" 
              className="h-2 mt-1" 
            />
          </div>
          <div>
            <span className="text-white/70 block mb-1">Current Visibility</span>
            <span className="text-toxic-neon font-mono">{visibilityStatus}</span>
          </div>
        </div>
        <div className="text-xs text-white/60 italic">
          Current Effect: <span className="text-toxic-neon">{radiationEffect}</span>
        </div>
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
                variant={
                  supply.type === 'sentinel' ? 'governance' : 
                  supply.type === 'bounty-hunter' ? 'reputation' : 'staking'
                }
                className="h-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-black/30 p-2 rounded">
                <span className="text-white/60 block">Free Claims</span>
                <span className="text-toxic-neon font-mono">{supply.free} remaining</span>
              </div>
              <div className="bg-black/30 p-2 rounded">
                <span className="text-white/60 block">Cost</span>
                <span className="text-toxic-neon font-mono">
                  {typeof supply.cost === 'number' ? `${supply.cost} MATIC` : supply.cost}
                </span>
              </div>
            </div>
            
            <ToxicButton 
              variant={
                supply.type === 'sentinel' ? 'default' : 
                supply.type === 'bounty-hunter' ? 'primary' : 'outline'
              }
              size="sm"
              className="w-full"
              disabled={!isConnected}
              onClick={() => window.open(`/mint/${supply.type}`, "_blank")}
            >
              {isConnected ? `Claim ${supply.name.replace('s', '')}` : "Connect Wallet to Claim"}
            </ToxicButton>
          </div>
        ))}
      </div>
    </ToxicCard>
  );
}
