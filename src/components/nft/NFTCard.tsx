
import React from 'react';
import { type OpenSeaNFT } from '@/services/openseaService';
import { Biohazard, Shield, Target } from 'lucide-react';
import { ToxicBadge } from '@/components/ui/toxic-badge';

interface NFTCardProps {
  nft: OpenSeaNFT;
  onClick?: () => void;
  className?: string;
  showDetails?: boolean;
}

export const NFTCard: React.FC<NFTCardProps> = ({
  nft,
  onClick,
  className = "",
  showDetails = false
}) => {
  // Get radiation level from traits
  const radiationTrait = nft.traits.find(trait => 
    trait.trait_type.toLowerCase() === 'radiation' || 
    trait.trait_type.toLowerCase() === 'radiation level'
  );
  
  const radiationLevel = radiationTrait ? parseInt(radiationTrait.value, 10) : Math.floor(Math.random() * 100);
  
  // Get role from traits
  const roleTrait = nft.traits.find(trait => 
    trait.trait_type.toLowerCase() === 'role' || 
    trait.trait_type.toLowerCase() === 'class'
  );
  
  const role = roleTrait?.value || '';

  // Determine role icon
  const getRoleIcon = () => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('survivor')) return <Shield className="h-4 w-4 text-toxic-neon" />;
    if (roleLower.includes('hunter') || roleLower.includes('bounty')) return <Target className="h-4 w-4 text-apocalypse-red" />;
    return <Biohazard className="h-4 w-4 text-toxic-neon" />;
  };

  // Get radiation color based on level
  const getRadiationColor = (value: number) => {
    if (value >= 80) return "text-apocalypse-red";
    if (value >= 50) return "text-yellow-400";
    return "text-toxic-neon";
  };

  return (
    <div 
      className={`bg-black/70 border border-toxic-neon/30 hover:border-toxic-neon/60 transition-all cursor-pointer rounded-lg overflow-hidden ${className}`}
      onClick={onClick}
    >
      <div className="h-40 bg-gradient-to-b from-toxic-neon/20 to-black/60 relative">
        {nft.image_url ? (
          <img 
            src={nft.image_url} 
            alt={nft.name || `NFT #${nft.identifier}`} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Biohazard className="h-12 w-12 text-toxic-neon/30" />
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60">
          <div className="flex items-center justify-between">
            <ToxicBadge variant="outline" className="flex items-center gap-1 text-xs">
              {getRoleIcon()}
              <span>#{nft.identifier}</span>
            </ToxicBadge>
            <span className={`text-xs font-mono ${getRadiationColor(radiationLevel)}`}>
              RAD {radiationLevel}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="text-toxic-neon font-mono text-sm truncate">
          {nft.name || `Wasteland NFT #${nft.identifier}`}
        </h3>
        
        {role && (
          <div className="text-xs text-white/70 mt-1">
            Role: <span className="text-toxic-neon">{role}</span>
          </div>
        )}
        
        {showDetails && nft.traits && nft.traits.length > 0 && (
          <div className="mt-2 pt-2 border-t border-toxic-neon/20">
            <div className="text-xs font-mono text-white/70">Traits:</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {nft.traits.slice(0, 3).map((trait, index) => (
                <ToxicBadge key={index} variant="secondary" className="text-xs">
                  {trait.trait_type}: {trait.value}
                </ToxicBadge>
              ))}
              {nft.traits.length > 3 && (
                <ToxicBadge variant="outline" className="text-xs">
                  +{nft.traits.length - 3} more
                </ToxicBadge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
