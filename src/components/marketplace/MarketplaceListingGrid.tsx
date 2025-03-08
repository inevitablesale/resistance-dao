
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Target, Biohazard, Zap, Shield, Activity, Hammer } from 'lucide-react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ModelPreview } from './ModelPreview';
import { motion } from 'framer-motion';

export interface MarketplaceAttribute {
  trait: string;
  value: string;
}

export interface RadiationLevel {
  level: string;
  value: number;
}

export type MarketplaceListingType = 'bounty-hunter' | 'survivor' | 'sentinel' | 'equipment' | 'settlement';

export interface MarketplaceListing {
  id: number;
  type?: MarketplaceListingType;
  name: string;
  tokenId: number;
  price: string;
  seller: string;
  radiation?: RadiationLevel;
  attributes?: MarketplaceAttribute[];
  status: 'active' | 'sold' | 'auction';
  modelUrl?: string;
  role?: string;
  rank?: string;
  description?: string;
}

interface MarketplaceListingGridProps {
  listings: MarketplaceListing[];
  title?: string;
  onListingClick?: (listing: MarketplaceListing) => void;
  className?: string;
  currentRadiationLevel?: number; // Global radiation level (0-100)
}

export function MarketplaceListingGrid({ 
  listings, 
  title, 
  onListingClick, 
  className = "",
  currentRadiationLevel = 100 // Default to full radiation
}: MarketplaceListingGridProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const visibleListings = listings.slice(currentIndex, currentIndex + 2);
  const hasNext = currentIndex + 2 < listings.length;
  const hasPrev = currentIndex > 0;
  
  const handlePrev = () => {
    if (hasPrev) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (hasNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  // Calculate radiation overlay level for model preview based on global radiation and NFT type
  const getModelRadiationLevel = (listing: MarketplaceListing): number => {
    if (listing.type === 'sentinel') {
      // Sentinels have less radiation than the global level (they're clearing it)
      return Math.max(0, currentRadiationLevel - 20);
    } else if (listing.type === 'bounty-hunter') {
      // Bounty hunters have the same radiation as global
      return currentRadiationLevel;
    } else {
      // Survivors have more radiation than global (they're more affected)
      return Math.min(100, currentRadiationLevel + 10);
    }
  };
  
  const getRadiationBadgeColor = (level?: string) => {
    if (!level) return 'bg-toxic-neon/20 text-toxic-neon';
    
    switch (level.toLowerCase()) {
      case 'low':
        return 'bg-toxic-neon/30 text-toxic-neon border-toxic-neon/40';
      case 'medium':
        return 'bg-amber-500/30 text-amber-400 border-amber-500/40';
      case 'high':
        return 'bg-orange-500/30 text-orange-400 border-orange-500/40';
      case 'critical':
        return 'bg-apocalypse-red/30 text-apocalypse-red border-apocalypse-red/40';
      case 'immune':
        return 'bg-purple-600/30 text-purple-400 border-purple-600/40';
      default:
        return 'bg-toxic-neon/20 text-toxic-neon border-toxic-neon/40';
    }
  };

  const getRoleIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'bounty-hunter':
        return <Target className="w-3 h-3 mr-1 text-apocalypse-red" />;
      case 'survivor':
        return <Hammer className="w-3 h-3 mr-1 text-amber-400" />;
      case 'sentinel':
        return <Shield className="w-3 h-3 mr-1 text-purple-400" />;
      default:
        return <Activity className="w-3 h-3 mr-1 text-toxic-neon" />;
    }
  };
  
  const getRoleLabel = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'bounty-hunter':
        return 'BOUNTY HUNTER';
      case 'survivor':
        return 'SURVIVOR';
      case 'sentinel':
        return 'FOUNDER SENTINEL';
      default:
        return 'WASTELAND NFT';
    }
  };
  
  return (
    <div className={`w-full ${className}`}>
      {title && (
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-mono text-toxic-neon">{title}</h2>
          <div className="flex gap-2">
            <ToxicButton 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 border-toxic-neon/40"
              onClick={handlePrev}
              disabled={!hasPrev}
            >
              <ChevronLeft className="h-4 w-4 text-toxic-neon" />
            </ToxicButton>
            <ToxicButton 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 border-toxic-neon/40"
              onClick={handleNext}
              disabled={!hasNext}
            >
              <ChevronRight className="h-4 w-4 text-toxic-neon" />
            </ToxicButton>
          </div>
        </div>
      )}
      
      <div ref={scrollContainerRef} className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleListings.map((listing) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ToxicCard 
                className="bg-black/80 border-toxic-neon/30 p-0 h-full flex flex-col hover:border-toxic-neon/60 transition-all cursor-pointer relative overflow-hidden"
                onClick={() => onListingClick && onListingClick(listing)}
              >
                {/* Type Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <ToxicBadge variant="marketplace" className="bg-black/60 border-toxic-neon/50">
                    {getRoleIcon(listing.type)} 
                    {getRoleLabel(listing.type)}
                  </ToxicBadge>
                </div>
                
                {/* Role/Rank Badge - New */}
                {listing.role && (
                  <div className="absolute top-3 right-3 z-10">
                    <ToxicBadge variant="marketplace" className="bg-black/60 border-toxic-neon/50">
                      {listing.role}
                    </ToxicBadge>
                  </div>
                )}
                
                {/* Model Preview with radiation overlay */}
                <div className="relative w-full h-64 bg-gradient-to-b from-black/40 to-black/90">
                  {listing.modelUrl ? (
                    <ModelPreview
                      modelUrl={listing.modelUrl}
                      height="100%"
                      width="100%"
                      autoRotate={true}
                      className="rounded-none"
                      radiationLevel={getModelRadiationLevel(listing)}
                      animateRadiation={false} // Don't animate in listing grid for performance
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/50">
                      <Zap className="w-12 h-12 text-toxic-neon/20" />
                    </div>
                  )}
                  
                  {/* Quick Stats Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/70 backdrop-blur-sm flex justify-between items-center">
                    <div className="text-lg font-mono text-toxic-neon truncate pr-2">
                      {listing.name}
                    </div>
                    <div className="flex-shrink-0 text-lg font-mono text-toxic-neon">
                      {listing.price}
                    </div>
                  </div>
                </div>
                
                {/* Radiation Level Badge */}
                {listing.radiation && (
                  <div className="px-4 py-3">
                    <ToxicBadge 
                      variant="status" 
                      className={`w-full flex justify-between items-center py-2 ${getRadiationBadgeColor(listing.radiation.level)}`}
                    >
                      <span className="flex items-center">
                        <Biohazard className="w-3.5 h-3.5 mr-1.5" /> RAD LEVEL: {listing.radiation.level}
                      </span>
                      <span>({listing.radiation.value}%)</span>
                    </ToxicBadge>
                  </div>
                )}
                
                {/* Rank Badge - New */}
                {listing.rank && (
                  <div className="px-4 py-1">
                    <ToxicBadge 
                      variant="outline" 
                      className="w-full flex justify-between items-center py-1 bg-black/40"
                    >
                      <span className="flex items-center">
                        RANK
                      </span>
                      <span className="text-toxic-neon">{listing.rank}</span>
                    </ToxicBadge>
                  </div>
                )}
                
                {/* Attributes */}
                {listing.attributes && (
                  <div className="px-4 pb-4 mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                    {listing.attributes.map((attr, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-white/70">{attr.trait}</span>
                        <span className="text-toxic-neon font-mono">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </ToxicCard>
            </motion.div>
          ))}
        </div>
        
        {/* Page Indicator for Mobile */}
        <div className="mt-4 flex justify-center gap-2 md:hidden">
          {listings.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx >= currentIndex && idx < currentIndex + 2
                  ? "bg-toxic-neon"
                  : "bg-toxic-neon/30"
              }`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
