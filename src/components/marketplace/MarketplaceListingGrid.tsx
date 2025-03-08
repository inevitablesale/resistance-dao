
import React, { useState } from 'react';
import { ToxicCard, ToxicCardContent } from "@/components/ui/toxic-card";
import { ToxicBadge } from "@/components/ui/toxic-badge";
import { ToxicButton } from "@/components/ui/toxic-button";
import { DrippingSlime } from "@/components/ui/dripping-slime";
import { ModelPreview } from "@/components/marketplace/ModelPreview";
import { 
  Skull, 
  Biohazard, 
  ChevronRight, 
  Filter, 
  SearchCode, 
  Users, 
  Target, 
  Shield, 
  Radiation, 
  ShieldX, 
  Image, 
  Box, 
  Star, 
  Award, 
  Coins, 
  Badge,
  Vote
} from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

export type MarketplaceListingType = 'survivor' | 'bounty-hunter' | 'equipment' | 'settlement';
export type PricingTier = 'early' | 'mid' | 'premium' | 'legacy';
export type StakingStatus = 'active' | 'inactive' | 'locked';

export interface MarketplaceListing {
  id: number;
  type: MarketplaceListingType;
  name: string;
  description?: string;
  tokenId: number;
  price: string;
  seller: string;
  radiation: {
    level: string;
    value: number;
  };
  attributes: {
    trait: string;
    value: string;
  }[];
  status: 'active' | 'pending' | 'sold';
  imageUrl?: string;
  modelUrl?: string;
  
  // New fields based on economic strategy
  isLegacyFounder?: boolean;
  pricingTier?: PricingTier;
  stakingStatus?: StakingStatus;
  stakingRewards?: string;
  reputation?: number;
  governancePower?: number;
  projectHistory?: number;
}

interface MarketplaceListingGridProps {
  listings: MarketplaceListing[];
  title: string;
  emptyMessage?: string;
  className?: string;
  onListingClick?: (listing: MarketplaceListing) => void;
}

export function MarketplaceListingGrid({ 
  listings, 
  title, 
  emptyMessage = "No listings found in the wasteland",
  className,
  onListingClick
}: MarketplaceListingGridProps) {
  const { setShowAuthFlow } = useWalletConnection();
  const [modelViewEnabled, setModelViewEnabled] = useState(true);
  const navigate = useNavigate();
  const { isConnected } = useWalletConnection();

  const getListingTypeIcon = (type: MarketplaceListingType) => {
    switch(type) {
      case 'survivor':
        return <Shield className="h-4 w-4 text-toxic-neon" />;
      case 'bounty-hunter':
        return <Target className="h-4 w-4 text-apocalypse-red" />;
      case 'equipment':
        return <Radiation className="h-4 w-4 text-toxic-neon" />;
      case 'settlement':
        return <Users className="h-4 w-4 text-toxic-muted" />;
      default:
        return <Biohazard className="h-4 w-4 text-toxic-neon" />;
    }
  };

  const getRadiationColor = (value: number) => {
    if (value >= 80) return "text-apocalypse-red border-apocalypse-red/70 shadow-[0_0_8px_rgba(255,0,0,0.3)]";
    if (value >= 50) return "text-yellow-400 border-yellow-400/70 shadow-[0_0_8px_rgba(255,255,0,0.3)]";
    return "text-toxic-neon border-toxic-neon/70 shadow-[0_0_8px_rgba(57,255,20,0.3)]";
  };

  const getPricingTierBadge = (tier?: PricingTier) => {
    if (!tier) return null;
    
    switch(tier) {
      case 'legacy':
        return (
          <ToxicBadge variant="rating" className="flex items-center gap-1 bg-purple-900/50 text-purple-300 border-purple-500/70">
            <Award className="h-3 w-3 mr-1" />
            LEGACY FOUNDER
          </ToxicBadge>
        );
      case 'early':
        return (
          <ToxicBadge variant="rating" className="flex items-center gap-1 bg-green-900/50 text-green-300 border-green-500/70">
            <Star className="h-3 w-3 mr-1" />
            EARLY ADOPTER
          </ToxicBadge>
        );
      case 'mid':
        return (
          <ToxicBadge variant="rating" className="flex items-center gap-1 bg-blue-900/50 text-blue-300 border-blue-500/70">
            <Badge className="h-3 w-3 mr-1" />
            MID TIER
          </ToxicBadge>
        );
      case 'premium':
        return (
          <ToxicBadge variant="rating" className="flex items-center gap-1 bg-amber-900/50 text-amber-300 border-amber-500/70">
            <Award className="h-3 w-3 mr-1" />
            PREMIUM
          </ToxicBadge>
        );
      default:
        return null;
    }
  };

  const getStakingStatusBadge = (status?: StakingStatus) => {
    if (!status) return null;
    
    switch(status) {
      case 'active':
        return (
          <ToxicBadge variant="marketplace" className="flex items-center gap-1 bg-toxic-dark/70 text-toxic-neon border-toxic-neon/70">
            <Coins className="h-3 w-3 mr-1" />
            STAKED
          </ToxicBadge>
        );
      case 'locked':
        return (
          <ToxicBadge variant="marketplace" className="flex items-center gap-1 bg-blue-900/50 text-blue-300 border-blue-500/70">
            <ShieldX className="h-3 w-3 mr-1" />
            LOCKED
          </ToxicBadge>
        );
      default:
        return null;
    }
  };

  const toggleModelView = () => {
    setModelViewEnabled(!modelViewEnabled);
  };

  const handleItemClick = (listing: MarketplaceListing) => {
    if (onListingClick) {
      onListingClick(listing);
    } else {
      navigate(`/marketplace/${listing.id}`);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-mono text-toxic-neon flex items-center toxic-glow">
          <Radiation className="h-5 w-5 mr-2" /> {title}
        </h3>
        
        <div className="flex items-center gap-2">
          <ToxicButton 
            variant="ghost" 
            size="sm" 
            className="text-toxic-neon hover:bg-toxic-dark/20"
            onClick={toggleModelView}
          >
            {modelViewEnabled ? (
              <>
                <Image className="h-4 w-4 mr-1" />
                2D View
              </>
            ) : (
              <>
                <Box className="h-4 w-4 mr-1" />
                3D View
              </>
            )}
          </ToxicButton>
          <ToxicButton 
            variant="ghost" 
            size="sm" 
            className="text-toxic-neon hover:bg-toxic-dark/20"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </ToxicButton>
          <ToxicButton 
            variant="ghost" 
            size="sm" 
            className="text-toxic-neon hover:bg-toxic-dark/20"
          >
            <SearchCode className="h-4 w-4 mr-1" />
            Search
          </ToxicButton>
        </div>
      </div>
      
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ToxicCard 
              key={listing.id} 
              className={`bg-black/70 border-toxic-neon/30 hover:border-toxic-neon/60 transition-all cursor-pointer ${listing.isLegacyFounder ? 'animate-toxic-pulse' : ''}`}
              onClick={() => handleItemClick(listing)}
            >
              <ToxicCardContent className="p-0">
                <div className="relative h-48 bg-gradient-to-b from-toxic-neon/20 to-black/60 rounded-t-lg overflow-hidden">
                  {listing.modelUrl && modelViewEnabled ? (
                    <ModelPreview 
                      modelUrl={listing.modelUrl} 
                      height="100%" 
                      width="100%" 
                      autoRotate={true} 
                    />
                  ) : listing.imageUrl ? (
                    <img 
                      src={listing.imageUrl} 
                      alt={listing.name} 
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {listing.type === 'bounty-hunter' ? (
                        <Skull className="w-20 h-20 text-toxic-neon/50" />
                      ) : (
                        <Biohazard className="w-20 h-20 text-toxic-neon/50" />
                      )}
                    </div>
                  )}
                  
                  <DrippingSlime position="top" dripsCount={5} toxicGreen={true} showIcons={false} />
                  <div className="absolute top-2 right-2">
                    <div className="px-2 py-1 rounded-full bg-black/60 text-xs text-toxic-neon font-mono">
                      #{listing.tokenId}
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <ToxicBadge variant="marketplace" className="flex items-center gap-1">
                      {getListingTypeIcon(listing.type)}
                      <span>{listing.type.replace('-', ' ').toUpperCase()}</span>
                    </ToxicBadge>
                  </div>
                  {listing.modelUrl && (
                    <div className="absolute top-2 right-12">
                      <ToxicBadge variant="secondary" className="bg-toxic-neon/20 text-toxic-neon">
                        <Box className="h-3 w-3 mr-1" /> 3D
                      </ToxicBadge>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60">
                    <div className="flex items-center justify-between">
                      <span className="text-toxic-neon text-xs font-mono">TYPE: {listing.type.toUpperCase()}</span>
                      <span className="text-toxic-neon text-xs font-mono">PRICE: {listing.price}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-col gap-2 mb-3">
                    <h4 className="text-xl font-mono text-toxic-neon">{listing.name}</h4>
                    
                    {/* Tier & Legacy Status */}
                    <div className="flex flex-wrap gap-2">
                      {getPricingTierBadge(listing.pricingTier)}
                      {getStakingStatusBadge(listing.stakingStatus)}
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <ToxicBadge 
                      variant="secondary" 
                      className={`flex items-center gap-1 ${getRadiationColor(listing.radiation.value)}`}
                    >
                      <Radiation className="h-3 w-3 mr-1" />
                      RAD LEVEL: {listing.radiation.level} ({listing.radiation.value}%)
                    </ToxicBadge>
                  </div>
                  
                  {/* Reputation & Governance Power */}
                  {(listing.reputation !== undefined || listing.governancePower !== undefined) && (
                    <div className="space-y-2 mb-3 bg-black/30 p-2 rounded border border-toxic-neon/20">
                      {listing.reputation !== undefined && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-white/60">Reputation</span>
                            <span className="text-toxic-neon/90">{listing.reputation}/100</span>
                          </div>
                          <Progress value={listing.reputation || 0} className="h-1" />
                        </div>
                      )}
                      
                      {listing.governancePower !== undefined && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-white/60 flex items-center">
                              <Vote className="h-3 w-3 mr-1" /> Governance Power
                            </span>
                            <span className="text-yellow-400">{listing.governancePower}/10</span>
                          </div>
                          <Progress value={listing.governancePower * 10 || 0} className="h-1" />
                        </div>
                      )}
                      
                      {listing.projectHistory !== undefined && (
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Projects Completed</span>
                          <span className="text-toxic-neon/90">{listing.projectHistory}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Staking Rewards */}
                  {listing.stakingStatus === 'active' && listing.stakingRewards && (
                    <div className="bg-toxic-dark/30 p-2 rounded border border-toxic-neon/30 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60 flex items-center">
                          <Coins className="h-3 w-3 mr-1" /> Staking Rewards
                        </span>
                        <span className="text-toxic-neon font-mono">{listing.stakingRewards}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {listing.attributes.slice(0, 3).map((attr, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-white/60">{attr.trait}</span>
                        <span className="text-toxic-neon/90">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <ToxicButton 
                    className="w-full mt-2 bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80 text-sm group transition-all duration-300"
                    size="sm"
                    variant="marketplace"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isConnected) {
                        handleItemClick(listing);
                      } else {
                        setShowAuthFlow(true);
                      }
                    }}
                  >
                    {isConnected ? (
                      <>
                        <Target className="h-4 w-4 mr-1 group-hover:animate-pulse" /> View Listing
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-1 group-hover:animate-pulse" /> Connect to View
                      </>
                    )}
                  </ToxicButton>
                </div>
              </ToxicCardContent>
            </ToxicCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-toxic-neon/5 rounded-lg border border-toxic-neon/20">
          <Biohazard className="h-12 w-12 mx-auto mb-4 text-toxic-neon/40" />
          <p className="text-white/70 mb-4">{emptyMessage}</p>
          <ToxicButton 
            variant="marketplace"
            onClick={() => setShowAuthFlow(true)}
          >
            {isConnected ? (
              <>
                <Target className="h-4 w-4 mr-2" />
                Create Listing
              </>
            ) : (
              <>
                <Radiation className="h-4 w-4 mr-2" />
                Create First Listing
              </>
            )}
          </ToxicButton>
        </div>
      )}
      
      {listings.length > 0 && (
        <div className="flex justify-center mt-6">
          <ToxicButton 
            variant="outline" 
            size="sm" 
            className="text-toxic-neon hover:bg-toxic-dark/20 border-toxic-neon/30 group"
          >
            View All <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </ToxicButton>
        </div>
      )}
    </div>
  );
}
