
import React from 'react';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ShoppingBag, Target, Shield, ListFilter, Search, PlusCircle, UserPlus, Settings, Award, Radiation, Star, Coins } from 'lucide-react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useNavigate } from 'react-router-dom';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import { Badge } from '@/components/ui/badge';

interface MarketplaceQuickActionsProps {
  className?: string;
  onCreateListing?: () => void;
  onBrowseListings?: () => void;
}

export function MarketplaceQuickActions({ 
  className,
  onCreateListing,
  onBrowseListings
}: MarketplaceQuickActionsProps) {
  const { setShowAuthFlow } = useWalletConnection();
  const { isConnected } = useCustomWallet();
  const navigate = useNavigate();
  
  const handleAction = (callback?: () => void) => {
    if (isConnected) {
      callback?.();
    } else {
      setShowAuthFlow(true);
    }
  };
  
  return (
    <ToxicCard className={`relative bg-black/70 border-toxic-neon/30 p-6 ${className}`}>
      {/* Only show scanline effect when not connected */}
      {!isConnected && <div className="scanline"></div>}
      
      <div className="flex flex-col space-y-6">
        <div>
          <h3 className="text-xl font-mono text-toxic-neon mb-2">Wasteland Marketplace</h3>
          <p className="text-white/70 text-sm mb-4">
            Trade rare assets, hire protection, and form alliances to survive the nuclear fallout
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center bg-toxic-dark/30 border border-toxic-neon/20 rounded-lg p-4 hover:bg-toxic-dark/40 hover:border-toxic-neon/30 transition-all group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-toxic-dark border border-toxic-neon/50 mb-3 group-hover:border-toxic-neon group-hover:scale-110 transition-all">
              <PlusCircle className="h-5 w-5 text-toxic-neon group-hover:animate-pulse" />
            </div>
            <span className="text-toxic-neon text-sm font-medium mb-2">Create Listing</span>
            <ToxicButton 
              variant="marketplace" 
              size="sm" 
              className="w-full group-hover:animate-toxic-pulse"
              onClick={() => handleAction(onCreateListing)}
            >
              List Asset
            </ToxicButton>
          </div>
          
          <div className="flex flex-col items-center bg-toxic-dark/30 border border-toxic-neon/20 rounded-lg p-4 hover:bg-toxic-dark/40 hover:border-toxic-neon/30 transition-all group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-toxic-dark border border-toxic-neon/50 mb-3 group-hover:border-toxic-neon group-hover:scale-110 transition-all">
              <Search className="h-5 w-5 text-toxic-neon group-hover:animate-pulse" />
            </div>
            <span className="text-toxic-neon text-sm font-medium mb-2">Browse Market</span>
            <ToxicButton 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleAction(onBrowseListings)}
            >
              View All
            </ToxicButton>
          </div>
          
          <div className="flex flex-col items-center bg-toxic-dark/30 border border-toxic-neon/20 rounded-lg p-4 hover:bg-toxic-dark/40 hover:border-toxic-neon/30 transition-all group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-toxic-dark border border-toxic-neon/50 mb-3 group-hover:border-toxic-neon group-hover:scale-110 transition-all">
              <Target className="h-5 w-5 text-toxic-neon group-hover:animate-pulse" />
            </div>
            <span className="text-toxic-neon text-sm font-medium mb-2">Bounty Hunters</span>
            <div className="mb-2 flex justify-center">
              <Badge className="bg-purple-900/60 text-purple-300 text-xs">NEW TIERS</Badge>
            </div>
            <ToxicButton 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleAction(() => navigate('/marketplace?type=bounty-hunter'))}
            >
              Explore
            </ToxicButton>
          </div>
          
          <div className="flex flex-col items-center bg-toxic-dark/30 border border-toxic-neon/20 rounded-lg p-4 hover:bg-toxic-dark/40 hover:border-toxic-neon/30 transition-all group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-toxic-dark border border-toxic-neon/50 mb-3 group-hover:border-toxic-neon group-hover:scale-110 transition-all">
              <Shield className="h-5 w-5 text-toxic-neon group-hover:animate-pulse" />
            </div>
            <span className="text-toxic-neon text-sm font-medium mb-2">Survivors</span>
            <div className="mb-2 flex justify-center">
              <Badge className="bg-amber-900/60 text-amber-300 text-xs">STAKING</Badge>
            </div>
            <ToxicButton 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleAction(() => navigate('/marketplace?type=survivor'))}
            >
              Explore
            </ToxicButton>
          </div>
        </div>
        
        {/* New NFT pricing & distribution info */}
        {isConnected && (
          <div className="bg-toxic-dark/30 border border-toxic-neon/20 rounded-lg p-4">
            <h4 className="text-toxic-neon font-mono text-sm mb-3 flex items-center">
              <Radiation className="h-4 w-4 mr-2" /> NFT PRICING & DISTRIBUTION
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-black/40 p-3 rounded border border-purple-500/30 flex flex-col">
                <div className="flex items-center text-purple-300 mb-1">
                  <Award className="h-4 w-4 mr-1" /> Legacy Founders
                </div>
                <span className="text-white/70">800 Airdropped</span>
                <span className="text-toxic-neon mt-1">Status: Active</span>
              </div>
              
              <div className="bg-black/40 p-3 rounded border border-green-500/30 flex flex-col">
                <div className="flex items-center text-green-300 mb-1">
                  <Star className="h-4 w-4 mr-1" /> Early Adopters
                </div>
                <span className="text-white/70">250 @ 50 RD</span>
                <span className="text-toxic-neon mt-1">Status: Selling</span>
              </div>
              
              <div className="bg-black/40 p-3 rounded border border-amber-500/30 flex flex-col">
                <div className="flex items-center text-amber-300 mb-1">
                  <Coins className="h-4 w-4 mr-1" /> Staking Rewards
                </div>
                <span className="text-white/70">Earn RD over time</span>
                <span className="text-toxic-neon mt-1">Hunters & Survivors</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Only show the connect prompt when not connected */}
        {!isConnected && (
          <div className="bg-toxic-neon/5 rounded-lg p-4 border border-toxic-neon/20">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-apocalypse-red/20">
                <Shield className="h-4 w-4 text-apocalypse-red" />
              </div>
              <div>
                <h4 className="text-sm font-mono text-toxic-neon">Connect Your Survival Pack</h4>
                <p className="text-xs text-white/70 mt-1">Authenticate your identity to access the secure trading network</p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <ToxicButton 
                variant="marketplace" 
                size="sm"
                onClick={() => setShowAuthFlow(true)}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Connect
              </ToxicButton>
            </div>
          </div>
        )}
      </div>
    </ToxicCard>
  );
}
