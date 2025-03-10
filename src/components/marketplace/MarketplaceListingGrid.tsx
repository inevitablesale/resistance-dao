import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Target, AlertTriangle, Biohazard, Clock, User } from 'lucide-react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { ModelPreview } from './ModelPreview';

export type MarketplaceListingType = 'sentinel' | 'bounty-hunter' | 'survivor' | 'settlement' | 'equipment';

export interface MarketplaceListing {
  id: number;
  type: MarketplaceListingType;
  name: string;
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
  status: 'active' | 'sold' | 'expired';
  description?: string;
  modelUrl?: string;
}

interface MarketplaceListingGridProps {
  listings: MarketplaceListing[];
  className?: string;
  title?: string;
  onListingClick?: (listing: MarketplaceListing) => void;
}

const getTypeIcon = (type: MarketplaceListingType) => {
  switch(type) {
    case 'sentinel':
      return <Shield className="h-4 w-4 text-purple-400" />;
    case 'bounty-hunter':
      return <Target className="h-4 w-4 text-apocalypse-red" />;
    case 'survivor':
      return <User className="h-4 w-4 text-amber-400" />;
    case 'settlement':
      return <Clock className="h-4 w-4 text-blue-400" />;
    case 'equipment':
      return <Biohazard className="h-4 w-4 text-toxic-neon" />;
    default:
      return <Biohazard className="h-4 w-4 text-toxic-neon" />;
  }
};

const getRadiationColor = (value: number) => {
  if (value >= 80) return "text-apocalypse-red";
  if (value >= 50) return "text-yellow-400";
  return "text-toxic-neon";
};

export function MarketplaceListingGrid({ listings, className = "", title, onListingClick }: MarketplaceListingGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-8 bg-black/40 border border-toxic-neon/20 rounded-lg">
        <AlertTriangle className="h-12 w-12 text-yellow-400 mb-4" />
        <h3 className="text-lg font-mono text-toxic-neon mb-2">No Listings Found</h3>
        <p className="text-white/70 text-center">No wasteland assets match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <h2 className="text-lg font-mono text-toxic-neon mb-4 pb-2 border-b border-toxic-neon/30">{title}</h2>
      )}
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {listings.map((listing) => (
          <motion.div key={listing.id} variants={itemVariants}>
            <div 
              onClick={() => onListingClick && onListingClick(listing)}
              className="cursor-pointer"
            >
              <ToxicCard className="bg-black/70 border-toxic-neon/30 hover:border-toxic-neon/60 transition-all overflow-hidden">
                <div className="p-0">
                  <div className="h-40 bg-gradient-to-b from-toxic-neon/20 to-black/60 relative overflow-hidden">
                    {listing.modelUrl ? (
                      <ModelPreview 
                        modelUrl={listing.modelUrl} 
                        height="100%"
                        width="100%"
                        autoRotate={true}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Biohazard className="h-16 w-16 text-toxic-neon/30" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <ToxicBadge 
                        variant={listing.status === 'active' ? 'outline' : 'secondary'} 
                        className="text-xs bg-black/60 border-toxic-neon/60"
                      >
                        {listing.status.toUpperCase()}
                      </ToxicBadge>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <ToxicBadge variant="outline" className="flex items-center gap-1">
                        {getTypeIcon(listing.type)}
                        <span className="text-xs">{listing.type.replace('-', ' ')}</span>
                      </ToxicBadge>
                      <span className="text-toxic-neon font-mono text-sm">{listing.price}</span>
                    </div>
                    
                    <h3 className="text-toxic-neon font-mono text-sm mb-1 truncate">{listing.name}</h3>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60">Token #{listing.tokenId}</span>
                      <span className={`${getRadiationColor(listing.radiation.value)} font-mono`}>
                        RAD {listing.radiation.value}%
                      </span>
                    </div>
                  </div>
                </div>
              </ToxicCard>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
