
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Target, Biohazard, Zap } from 'lucide-react';
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

export interface MarketplaceListing {
  id: number;
  type?: 'bounty-hunter' | 'survivor' | 'equipment';
  name: string;
  tokenId: number;
  price: string;
  seller: string;
  radiation?: RadiationLevel;
  attributes?: MarketplaceAttribute[];
  status: 'active' | 'sold' | 'auction';
  modelUrl?: string;
}

interface MarketplaceListingGridProps {
  listings: MarketplaceListing[];
  title?: string;
  onListingClick?: (listing: MarketplaceListing) => void;
  className?: string;
}

export function MarketplaceListingGrid({ 
  listings, 
  title, 
  onListingClick, 
  className = "" 
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
      default:
        return 'bg-toxic-neon/20 text-toxic-neon border-toxic-neon/40';
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
                    <Target className="w-3 h-3 mr-1 text-apocalypse-red" /> 
                    BOUNTY HUNTER
                  </ToxicBadge>
                </div>
                
                {/* Model Preview with fixed height */}
                <div className="relative w-full h-64 bg-gradient-to-b from-black/40 to-black/90">
                  {listing.modelUrl ? (
                    <ModelPreview
                      modelUrl={listing.modelUrl}
                      height="100%"
                      width="100%"
                      autoRotate={true}
                      className="rounded-none"
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
