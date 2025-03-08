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

import { 
  Rocket, 
  Coins, 
  Users, 
  Share2, 
  Check, 
  ChevronRight, 
  Building2, 
  CircleDollarSign,
  Scale,
  FileText,
  ChevronRight as ArrowIcon,
  Clock,
  Target,
  Wallet,
  RefreshCw,
  Radiation,
  Skull,
  Zap,
  Shield,
  Image,
  Biohazard,
  ShieldX,
  UserX,
  Bug,
  Bomb,
  Crosshair,
  PlusCircle,
  Search,
  ShoppingBag,
  Box,
  Eye, 
  Map,
  Globe,
  Network,
  Wrench,
  Hammer,
  Lightbulb,
  Flag,
  Scroll
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToxicButton } from "@/components/ui/toxic-button";
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
import { MarketplaceQuickActions } from "@/components/marketplace/MarketplaceQuickActions";
import { ChroniclePanel } from "@/components/chronicle/ChroniclePanel";
import { CharacterProgress } from "@/components/chronicle/CharacterProgress";
import { TerritoryStatus } from "@/components/chronicle/TerritoryStatus";
import { WastelandSurvivalGuideEnhanced } from "@/components/chronicle/WastelandSurvivalGuideEnhanced";
import { ModelPreview } from '@/components/marketplace/ModelPreview';

type AuthState = "unauthenticated" | "authenticating" | "breaching" | "authenticated";

const Index = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: isLoadingStats } = useProposalStats();
  const { data: nftBalance = 0, isLoading: isLoadingNFT } = useNFTBalance("0x1234..."); // Demo address
  const { isConnected, address } = useCustomWallet();
  const { connect } = useWalletConnection();
  
  const [authState, setAuthState] = useState<AuthState>("unauthenticated");
  const [isRefreshingActivity, setIsRefreshingActivity] = useState(false);
  const [activeRole, setActiveRole] = useState<'sentinel' | 'pioneer'>('sentinel');
  const [storyTerminalOpen, setStoryTerminalOpen] = useState(true);
  
  useEffect(() => {
    if (isConnected && authState === "unauthenticated") {
      setAuthState("authenticated");
    }
  }, [isConnected]);
  
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
  
  const sentinelListings: MarketplaceListing[] = [
    {
      id: 1,
      type: 'bounty-hunter',
      name: "Territory Watcher X-35",
      tokenId: 1,
      price: "15,000 RD",
      seller: "0x1234...5678",
      radiation: {
        level: "High",
        value: 78
      },
      attributes: [
        { trait: "Network Influence", value: "High" },
        { trait: "Resource Allocation", value: "Territory Control" },
        { trait: "Strategic Rating", value: "Exceptional" }
      ],
      status: 'active',
      modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeiheog5wgtnl7ldazmsj3n7xmkgkzpjnix5e4tuxndzw7j3bgkp2n4"
    },
    {
      id: 2,
      type: 'bounty-hunter',
      name: "Resource Director K-42",
      tokenId: 42,
      price: "32,000 RD",
      seller: "0x8765...4321",
      radiation: {
        level: "Medium",
        value: 54
      },
      attributes: [
        { trait: "Network Influence", value: "Medium" },
        { trait: "Resource Allocation", value: "Supply Chain" },
        { trait: "Strategic Rating", value: "Advanced" }
      ],
      status: 'active',
      modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeiavqxeov62wgj6upfpvq6g4vpvot4mnwl3ggunxp27sbfjgs4hlfq"
    },
    {
      id: 3,
      type: 'bounty-hunter',
      name: "Network Commander B-007",
      tokenId: 7,
      price: "50,000 RD",
      seller: "0x9876...5432",
      radiation: {
        level: "Critical",
        value: 92
      },
      attributes: [
        { trait: "Network Influence", value: "Critical" },
        { trait: "Resource Allocation", value: "Full Network" },
        { trait: "Strategic Rating", value: "Elite" }
      ],
      status: 'active',
      modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeig47okn4sqqbajhje57htkxw6py3tdms7boyc3hkvvr4qlj7zsabu"
    }
  ];
  
  const pioneerListings: MarketplaceListing[] = [
    {
      id: 4,
      type: 'survivor',
      name: "Settlement Architect R-12",
      tokenId: 12,
      price: "18,500 RD",
      seller: "0x2468...1357",
      radiation: {
        level: "Low",
        value: 28
      },
      attributes: [
        { trait: "Innovation", value: "Medical Systems" },
        { trait: "Build Rating", value: "Enhanced" },
        { trait: "Project", value: "New Haven" }
      ],
      status: 'active',
      modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeifzvpyj5znhgjq22cbjyzav5zsvese3m3klbkc4lcdm3fdbbxiooa"
    },
    {
      id: 5,
      type: 'survivor',
      name: "Innovation Builder E-67",
      tokenId: 67,
      price: "24,000 RD",
      seller: "0x1357...2468",
      radiation: {
        level: "Medium",
        value: 45
      },
      attributes: [
        { trait: "Innovation", value: "Reconnaissance Tech" },
        { trait: "Build Rating", value: "Standard" },
        { trait: "Project", value: "Outpost Alpha" }
      ],
      status: 'active'
    },
    {
      id: 6,
      type: 'survivor',
      name: "Project Founder T-89",
      tokenId: 89,
      price: "36,500 RD",
      seller: "0x6543...7890",
      radiation: {
        level: "High",
        value: 65
      },
      attributes: [
        { trait: "Innovation", value: "Power Systems" },
        { trait: "Build Rating", value: "High" },
        { trait: "Project", value: "Reactor City" }
      ],
      status: 'active'
    }
  ];

  const recentActivities: MarketplaceActivity[] = [
    {
      id: "act-1",
      type: "listing",
      title: "New Bounty Hunter Listed",
      timestamp: "2 minutes ago",
      itemId: "BH-724"
    },
    {
      id: "act-2",
      type: "purchase",
      title: "Survivor Token Purchased",
      timestamp: "15 minutes ago",
      amount: "24,500 RD"
    },
    {
      id: "act-3",
      type: "offer",
      title: "Offer Made on Equipment",
      timestamp: "32 minutes ago",
      amount: "8,750 RD"
    },
    {
      id: "act-4",
      type: "trade",
      title: "Successful Trade Completed",
      timestamp: "1 hour ago",
      itemId: "S-198"
    },
    {
      id: "act-5",
      type: "mint",
      title: "New Survivor NFT Minted",
      timestamp: "2 hours ago",
      address: "0x789...012"
    }
  ];

  const handleListingClick = (listing: MarketplaceListing) => {
    navigate(`/marketplace/${listing.id}`);
  };
  
  const handleCreateListing = () => {
    navigate('/marketplace/create');
  };
  
  const handleBrowseListings = () => {
    navigate('/marketplace');
  };

  const renderMarketplace = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      <div className="text-left mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-neon/10 border border-toxic-neon/20 text-toxic-neon text-sm mb-4 font-mono broken-glass">
          <span className="w-2 h-2 bg-apocalypse-red rounded-full animate-pulse flash-critical" />
          <Biohazard className="h-4 w-4 mr-1 toxic-glow" /> Wasteland Status: <span className="text-apocalypse-red font-bold status-critical">Rebuilding From The Ashes</span>
        </div>
        
        <StoryTerminal 
          initiallyOpen={storyTerminalOpen} 
          onClose={() => setStoryTerminalOpen(false)} 
          className="mb-8" 
        />
        
        <WastelandSurvivalGuideEnhanced className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <ChroniclePanel className="mb-6" />
          </div>
          <div className="md:col-span-1">
            <CharacterProgress className="mb-6" role={activeRole} />
            <TerritoryStatus />
          </div>
        </div>

        <MarketplaceQuickActions 
          className="mb-8"
          onCreateListing={handleCreateListing}
          onBrowseListings={handleBrowseListings}
        />

        <MarketplaceStatusPanel 
          stats={marketplaceStats} 
          isLoading={isLoadingStats}
          className="mb-8"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ToxicCard 
                  className={`bg-black/60 border-toxic-neon/30 p-6 hover:bg-black/70 transition-all ${activeRole === 'sentinel' ? 'border-2 border-purple-500/70' : ''}`}
                  onClick={() => setActiveRole('sentinel')}
                >
                  <h3 className="text-2xl font-mono text-toxic-neon mb-3">SENTINEL</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">
                    Monitor territories, direct network resources, and track strategic objectives across the wasteland. Guide the resistance by connecting outposts and controlling the flow of critical supplies.
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-white/60">Network Size:</div>
                      <div className="text-toxic-neon font-mono">142 TERRITORIES</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white/60">Resource Pool:</div>
                      <div className="text-toxic-neon font-mono">325,000 RD</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white/60">Active Sentinels:</div>
                      <div className="text-toxic-neon font-mono">68</div>
                    </div>
                  </div>
                  <ToxicButton 
                    variant="outline" 
                    className="w-full border-toxic-neon/40"
                    onClick={() => navigate('/hunt')}
                  >
                    {isConnected ? "Enter Command Center" : "Become a Sentinel"}
                  </ToxicButton>
                </ToxicCard>
                
                <ToxicCard 
                  className={`bg-black/60 border-toxic-neon/30 p-6 hover:bg-black/70 transition-all ${activeRole === 'pioneer' ? 'border-2 border-amber-500/70' : ''}`}
                  onClick={() => setActiveRole('pioneer')}
                >
                  <h3 className="text-2xl font-mono text-toxic-neon mb-3">PIONEER</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">
                    Build settlements, develop innovations, and create the foundation for a new civilization. Pioneers lead projects from medical facilities to power networks, shaping our collective future.
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-white/60">Active Projects:</div>
                      <div className="text-toxic-neon font-mono">84 INITIATIVES</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white/60">Settlement Outposts:</div>
                      <div className="text-toxic-neon font-mono">37</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white/60">Innovation Rate:</div>
                      <div className="text-toxic-neon font-mono">78%</div>
                    </div>
                  </div>
                  <ToxicButton 
                    variant="outline" 
                    className="w-full border-toxic-neon/40"
                    onClick={() => navigate('/marketplace/pioneers')}
                  >
                    {isConnected ? "Access Build Center" : "Become a Pioneer"}
                  </ToxicButton>
                </ToxicCard>
              </div>
              
              <MarketplaceListingGrid 
                listings={sentinelListings} 
                title="SENTINEL: Territory Network Leaders" 
                onListingClick={handleListingClick}
                className="mb-8"
              />
              
              <MarketplaceListingGrid 
                listings={pioneerListings} 
                title="PIONEER: Settlement Innovators" 
                onListingClick={handleListingClick}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <MarketplaceActivityFeed 
              activities={recentActivities} 
              isLoading={isRefreshingActivity}
              onRefresh={handleRefreshActivity}
              className="mb-6"
            />
            
            <ToxicCard className="bg-black/70 border-toxic-neon/30 p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-full bg-toxic-neon/10">
                  <Shield className="w-5 h-5 text-toxic-neon" />
                </div>
                <h3 className="text-lg font-mono text-toxic-neon">Resistance Status</h3>
              </div>
              
              {isConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Network Influence</span>
                    <span className="text-toxic-neon font-mono">42</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Wasteland Reputation</span>
                    <div className="flex items-center">
                      <ToxicBadge variant="rating" className="text-toxic-neon">★ 3.8</ToxicBadge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Radiation Level</span>
                    <span className="text-toxic-neon font-mono">
                      <span className="text-amber-400">MEDIUM (28%)</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Chronicle Entries</span>
                    <span className="text-toxic-neon font-mono">8</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-toxic-neon/5 rounded-lg">
                  <p className="text-white/70 mb-4">Connect to view your resistance status</p>
                  <ToxicButton 
                    variant="marketplace"
                    onClick={connect}
                  >
                    <Radiation className="h-4 w-4 mr-2" />
                    ACTIVATE SURVIVAL BEACON
                  </ToxicButton>
                </div>
              )}
            </ToxicCard>
            
            <ToxicCard className="bg-black/70 border-toxic-neon/30 p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-full bg-toxic-neon/10">
                  <CircleDollarSign className="w-5 h-5 text-toxic-neon" />
                </div>
                <h3 className="text-lg font-mono text-toxic-neon">Fuel The New Economy</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">
                PRESALE NOW ACTIVE - Join the first wave of wasteland rebuilders.
              </p>
              <p className="text-white/70 text-sm mb-4">
                Convert your Old World currency (USDC) into Resistance Dollars (RD) to establish trade networks and power the post-apocalyptic economy.
              </p>
              <div className="bg-black/50 border border-toxic-neon/20 p-3 rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/70">Exchange Rate</span>
                  <span className="text-sm text-toxic-neon font-mono">1 USDC = 1 RD</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/70">Minimum Contribution</span>
                  <span className="text-sm text-toxic-neon font-mono">10 USDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/70">Protocol Fee</span>
                  <span className="text-sm text-toxic-neon font-mono">0.5%</span>
                </div>
              </div>
              <ToxicButton
                variant="marketplace"
                className="w-full"
                onClick={() => navigate('/buy-rd')}
              >
                {isConnected ? "ACCESS FUNDING TERMINAL" : "JOIN THE RESISTANCE ECONOMY"}
              </ToxicButton>
            </ToxicCard>
            
            {isConnected && (
              <ToxicCard className="bg-black/70 border-toxic-neon/30 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-full bg-toxic-neon/10">
                    <Network className="w-5 h-5 text-toxic-neon" />
                  </div>
                  <h3 className="text-lg font-mono text-toxic-neon">Wasteland Operations</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <ToxicButton 
                    variant="outline" 
                    size="sm"
                    className="border-toxic-neon/30"
                    onClick={() => navigate('/hunt')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Sentinel Center
                  </ToxicButton>
                  
                  <ToxicButton 
                    variant="outline" 
                    size="sm"
                    className="border-toxic-neon/30"
                    onClick={() => navigate('/marketplace/pioneers')}
                  >
                    <Hammer className="h-4 w-4 mr-1" />
                    Pioneer Hub
                  </ToxicButton>
                  
                  <ToxicButton 
                    variant="outline" 
                    size="sm"
                    className="border-toxic-neon/30"
                    onClick={() => navigate('/chronicles')}
                  >
                    <Scroll className="h-4 w-4 mr-1" />
                    Chronicles
                  </ToxicButton>
                  
                  <ToxicButton 
                    variant="outline" 
                    size="sm"
                    className="border-toxic-neon/30"
                    onClick={() => navigate('/territories/map')}
                  >
                    <Map className="h-4 w-4 mr-1" />
                    Territory Map
                  </ToxicButton>
                </div>
              </ToxicCard>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative post-apocalyptic-bg">
      <DrippingSlime position="top" dripsCount={15} showIcons={false} toxicGreen={true} />
      <div className="dust-particles"></div>
      <div className="fog-overlay"></div>

      {authState === "breaching" && (
        <BreachSequence onComplete={handleBreachComplete} />
      )}

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -top-48 -left-24" />
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -bottom-48 -right-24" />
        </div>
        
        <div className="container px-4 relative">
          {authState === "unauthenticated" ? (
            <TerminalLogin onLoginSuccess={handleLoginSuccess} />
          ) : authState === "authenticated" ? (
            renderMarketplace()
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default Index;
