import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { DrippingSlime } from "@/components/ui/dripping-slime";
import { TerminalLogin } from '@/components/terminal/TerminalLogin';
import { BreachSequence } from '@/components/terminal/BreachSequence';
import { StoryTerminal } from '@/components/terminal/StoryTerminal';
import { RadiationSystem } from '@/components/radiation/RadiationSystem';
import { NFTDistributionStatus } from '@/components/radiation/NFTDistributionStatus';
import { ReferralSystem } from '@/components/radiation/ReferralSystem';
import { Rocket, Coins, Users, Share2, Check, ChevronRight, Building2, CircleDollarSign, Scale, FileText, ChevronRight as ArrowIcon, Clock, Target, Wallet, RefreshCw, Radiation, Skull, Zap, Shield, Image, Biohazard, ShieldX, UserX, Bug, Bomb, Crosshair, PlusCircle, Search, ShoppingBag, Box, Eye, Map, Globe, Network, Wrench, Hammer, Lightbulb, Flag, Scroll } from "lucide-react";
import { ToxicButton } from "@/components/ui/button";
import { ToxicButton as Button } from "@/components/ui/toxic-button";
import { Card, CardContent } from "@/components/ui/card";
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle, ToxicCardDescription, ToxicCardFooter } from "@/components/ui/toxic-card";
import { ToxicProgress } from "@/components/ui/toxic-progress";
import { useProposalStats } from "@/hooks/useProposalStats";
import { BuyRDTokens } from "@/components/BuyRDTokens";
import { FACTORY_ADDRESS, RD_TOKEN_ADDRESS } from "@/lib/constants";
import { ToxicPuddle } from "@/components/ui/dripping-slime";
import { ToxicBadge } from "@/components/ui/toxic-badge";
import { useNFTBalance } from "@/hooks/useNFTBalance";
import { NFTDisplay } from "@/components/wallet/ResistanceWalletWidget/NFTDisplay";
import { TerminalTypewriter } from "@/components/ui/terminal-typewriter";
import { MarketplaceListingGrid, MarketplaceListing } from "@/components/marketplace/MarketplaceListingGrid";
import { MarketplaceStatusPanel } from "@/components/marketplace/MarketplaceStatusPanel";
import { MarketplaceActivityFeed, MarketplaceActivity } from "@/components/marketplace/MarketplaceActivityFeed";
import { CharacterProgress } from "@/components/chronicle/CharacterProgress";
import { TerritoryStatus } from "@/components/chronicle/TerritoryStatus";
import { ModelPreview } from '@/components/marketplace/ModelPreview';
import { NFTCollectionDisplay } from '@/components/nft/NFTCollectionDisplay';

type AuthState = "unauthenticated" | "authenticating" | "breaching" | "authenticated";

const Index = () => {
  const navigate = useNavigate();
  const {
    data: stats,
    isLoading: isLoadingStats
  } = useProposalStats();
  const {
    isConnected,
    address
  } = useCustomWallet();
  const {
    connect
  } = useWalletConnection();
  const [authState, setAuthState] = useState<AuthState>("unauthenticated");
  const [isRefreshingActivity, setIsRefreshingActivity] = useState(false);
  const [storyTerminalOpen, setStoryTerminalOpen] = useState(false); // Changed from true to false

  // New states for radiation system
  const [currentRadiation, setCurrentRadiation] = useState(94); // Start at 94% radiation
  const [totalNFTsClaimed, setTotalNFTsClaimed] = useState(925); // Mock data - total claimed NFTs
  const [referralEarnings, setReferralEarnings] = useState(375); // Mock data - earnings in MATIC
  const [totalReferrals, setTotalReferrals] = useState(15); // Mock data - total referrals

  useEffect(() => {
    // Remove this effect to prevent directly setting authenticated state
    // when wallet is connected, now handled by the TerminalLogin component
  }, []);
  
  const handleLoginSuccess = () => {
    setAuthState("breaching");
  };
  
  const handleBreachComplete = () => {
    setAuthState("authenticated");
  };
  
  const handleRefreshActivity = () => {
    setIsRefreshingActivity(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshingActivity(false);
    }, 1000);
  };
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const marketplaceStats = {
    tradingVolume: 2450000,
    activeListings: 472,
    registeredSurvivors: 821,
    averageRadiationLevel: 68,
    successfulTrades: 389,
    bountyHunterRatio: 35
  };
  
  const recentActivities: MarketplaceActivity[] = [{
    id: "act-1",
    type: "listing",
    title: "New Bounty Hunter Listed",
    timestamp: "2 minutes ago",
    itemId: "BH-724"
  }, {
    id: "act-2",
    type: "purchase",
    title: "Survivor Token Purchased",
    timestamp: "15 minutes ago",
    amount: "24,500 RD"
  }, {
    id: "act-3",
    type: "offer",
    title: "Offer Made on Equipment",
    timestamp: "32 minutes ago",
    amount: "8,750 RD"
  }, {
    id: "act-4",
    type: "trade",
    title: "Successful Trade Completed",
    timestamp: "1 hour ago",
    itemId: "S-198"
  }, {
    id: "act-5",
    type: "mint",
    title: "New Survivor NFT Minted",
    timestamp: "2 hours ago",
    address: "0x789...012"
  }];
  
  const renderMarketplace = () => <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.5
  }} className="max-w-5xl mx-auto">
      <div className="text-left mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-neon/10 border border-toxic-neon/20 text-toxic-neon text-sm mb-4 font-mono broken-glass">
          <span className="w-2 h-2 bg-apocalypse-red rounded-full animate-pulse flash-critical" />
          <Radiation className="h-4 w-4 mr-1 toxic-glow" /> 
          Wasteland Status: <span className="text-apocalypse-red font-semibold status-critical">Radiation Level: {currentRadiation}%</span>
        </div>
        
        <StoryTerminal initiallyOpen={storyTerminalOpen} onClose={() => setStoryTerminalOpen(false)} className="mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <RadiationSystem currentRadiation={currentRadiation} totalNFTsClaimed={totalNFTsClaimed} className="mb-6" />
            <ReferralSystem earnings={referralEarnings} totalReferrals={totalReferrals} />
          </div>
          <div className="md:col-span-2">
            <NFTDistributionStatus className="mb-6" />
          </div>
        </div>

        <MarketplaceStatusPanel stats={marketplaceStats} isLoading={isLoadingStats} className="mb-8" />
        
        {/* NFT Collection Display */}
        <NFTCollectionDisplay className="mb-8" title="Resistance Wasteland NFTs" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {/* All role cards have been completely removed */}
          </div>
          
          <div className="lg:col-span-1">
            <MarketplaceActivityFeed activities={recentActivities} isLoading={isRefreshingActivity} onRefresh={handleRefreshActivity} className="mb-6" />
            
            {isConnected && <ToxicCard className="bg-black/70 border-toxic-neon/30 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-full bg-toxic-neon/10">
                    <Network className="w-5 h-5 text-toxic-neon" />
                  </div>
                  <h3 className="text-lg font-mono text-toxic-neon">Wasteland Operations</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="border-toxic-neon/30" onClick={() => navigate('/hunt')}>
                    <Eye className="h-4 w-4 mr-1" />
                    Sentinel Center
                  </Button>
                  
                  <Button variant="outline" size="sm" className="border-toxic-neon/30" onClick={() => navigate('/marketplace/bounty-hunters')}>
                    <Network className="h-4 w-4 mr-1" />
                    Bounty Hub
                  </Button>
                  
                  <Button variant="outline" size="sm" className="border-toxic-neon/30" onClick={() => navigate('/chronicles')}>
                    <Scroll className="h-4 w-4 mr-1" />
                    Chronicles
                  </Button>
                  
                  <Button variant="outline" size="sm" className="border-toxic-neon/30" onClick={() => navigate('/territories/map')}>
                    <Map className="h-4 w-4 mr-1" />
                    Territory Map
                  </Button>
                </div>
              </ToxicCard>}
          </div>
        </div>
      </div>
    </motion.div>;
  
  return <div className="min-h-screen bg-black text-white relative post-apocalyptic-bg">
      <DrippingSlime position="top" dripsCount={15} showIcons={false} toxicGreen={true} />
      <div className="dust-particles"></div>
      <div className="fog-overlay"></div>

      {authState === "breaching" && <BreachSequence onComplete={handleBreachComplete} />}

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -top-48 -left-24" />
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -bottom-48 -right-24" />
        </div>
        
        <div className="container px-4 relative">
          {authState === "unauthenticated" ? <TerminalLogin onLoginSuccess={handleLoginSuccess} /> : authState === "authenticated" ? renderMarketplace() : null}
        </div>
      </section>
    </div>;
};

export default Index;
