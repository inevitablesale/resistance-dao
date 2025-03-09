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
import { NFTCollectionDisplay } from '@/components/radiation/NFTCollectionDisplay';
import { useRadiationSystem } from '@/hooks/useRadiationSystem';
import { 
  Unlock, 
  AlertTriangle, 
  Lock, 
  Check,
  Skull,
  Building2,
  CircleDollarSign,
  Network,
  Eye,
  Target,
  Scroll as ScrollIcon,
  MapPin
} from "lucide-react";
import { Biohazard, Coins, Users, Scale, ShieldX, Radiation } from "lucide-react";
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
  const { 
    currentRadiation, 
    totalHolders, 
    radiationReduction, 
    featureUnlocks, 
    nextFeatureUnlock,
    isLoading: isLoadingRadiation,
    status: radiationStatus
  } = useRadiationSystem();
  
  const [authState, setAuthState] = useState<AuthState>("unauthenticated");
  const [isRefreshingActivity, setIsRefreshingActivity] = useState(false);
  const [activeRole, setActiveRole] = useState<'sentinel' | 'pioneer'>('sentinel');
  const [storyTerminalOpen, setStoryTerminalOpen] = useState(true);
  
  const [referralEarnings, setReferralEarnings] = useState(375); // Mock data - earnings in MATIC
  const [totalReferrals, setTotalReferrals] = useState(15); // Mock data - total referrals
  
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
      type: 'sentinel',
      name: "Strategic Commander X-35",
      tokenId: 1,
      price: "15,000 RD",
      seller: "0x1234...5678",
      radiation: {
        level: "Immune",
        value: 100
      },
      attributes: [
        { trait: "Governance Rank", value: "Settlement Architect" },
        { trait: "Voting Power", value: "High" },
        { trait: "Investment Ability", value: "Strategic" }
      ],
      status: 'active',
      role: "Strategic Commander",
      rank: "Veteran",
      modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeiheog5wgtnl7ldazmsj3n7xmkgkzpjnix5e4tuxndzw7j3bgkp2n4"
    },
    {
      id: 2,
      type: 'sentinel',
      name: "Financial Overseer K-42",
      tokenId: 42,
      price: "32,000 RD",
      seller: "0x8765...4321",
      radiation: {
        level: "Immune",
        value: 100
      },
      attributes: [
        { trait: "Governance Rank", value: "Financial Overseer" },
        { trait: "Voting Power", value: "Critical" },
        { trait: "Investment Ability", value: "Economic" }
      ],
      status: 'active',
      role: "Financial Overseer",
      rank: "Elite",
      modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeiavqxeov62wgj6upfpvq6g4vpvot4mnwl3ggunxp27sbfjgs4hlfq"
    },
    {
      id: 3,
      type: 'sentinel',
      name: "Trade Commissioner B-007",
      tokenId: 7,
      price: "50,000 RD",
      seller: "0x9876...5432",
      radiation: {
        level: "Immune",
        value: 100
      },
      attributes: [
        { trait: "Governance Rank", value: "Trade Commissioner" },
        { trait: "Voting Power", value: "High" },
        { trait: "Investment Ability", value: "Diplomatic" }
      ],
      status: 'active',
      role: "Trade Commissioner",
      rank: "Legend",
      modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeig47okn4sqqbajhje57htkxw6py3tdms7boyc3hkvvr4qlj7zsabu"
    }
  ];
  
  const bountyHunterListings: MarketplaceListing[] = [
    {
      id: 4,
      type: 'bounty-hunter',
      name: "Protocol Tracker S-17",
      tokenId: 17,
      price: "18,500 RD",
      seller: "0x2468...1357",
      radiation: {
        level: "Medium",
        value: 58
      },
      attributes: [
        { trait: "Hunter Class", value: "Scout" },
        { trait: "Specialization", value: "Protocol Security" },
        { trait: "Operating Territory", value: "Wastelands" }
      ],
      status: 'active',
      role: "Protocol Tracker",
      rank: "Feared",
      modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeifzvpyj5znhgjq22cbjyzav5zsvese3m3klbkc4lcdm3fdbbxiooa"
    },
    {
      id: 5,
      type: 'bounty-hunter',
      name: "Asset Recovery A-67",
      tokenId: 67,
      price: "24,000 RD",
      seller: "0x1357...2468",
      radiation: {
        level: "High",
        value: 72
      },
      attributes: [
        { trait: "Hunter Class", value: "Apex" },
        { trait: "Specialization", value: "Asset Recovery" },
        { trait: "Operating Territory", value: "Cyber Core" }
      ],
      status: 'active',
      role: "Asset Recovery",
      rank: "Respected"
    },
    {
      id: 6,
      type: 'bounty-hunter',
      name: "Network Infiltrator L-89",
      tokenId: 89,
      price: "36,500 RD",
      seller: "0x6543...7890",
      radiation: {
        level: "Critical",
        value: 85
      },
      attributes: [
        { trait: "Hunter Class", value: "Legend" },
        { trait: "Specialization", value: "Network Infiltration" },
        { trait: "Operating Territory", value: "Deep Zone" }
      ],
      status: 'active',
      role: "Network Infiltrator",
      rank: "Infamous"
    }
  ];
  
  const survivorListings: MarketplaceListing[] = [
    {
      id: 7,
      type: 'survivor',
      name: "Engineer Pioneer R-12",
      tokenId: 12,
      price: "12,500 RD",
      seller: "0x5555...6666",
      radiation: {
        level: "Low",
        value: 28
      },
      attributes: [
        { trait: "Survivor Role", value: "Engineer" },
        { trait: "Specialty", value: "Construction" },
        { trait: "Settlement", value: "New Haven" }
      ],
      status: 'active',
      role: "Engineer",
      rank: "Veteran"
    },
    {
      id: 8,
      type: 'survivor',
      name: "Medic Support M-23",
      tokenId: 23,
      price: "9,800 RD",
      seller: "0x7777...8888",
      radiation: {
        level: "Medium",
        value: 45
      },
      attributes: [
        { trait: "Survivor Role", value: "Medic" },
        { trait: "Specialty", value: "Medicine" },
        { trait: "Settlement", value: "Outpost Alpha" }
      ],
      status: 'active',
      role: "Medic",
      rank: "Skilled"
    },
    {
      id: 9,
      type: 'survivor',
      name: "Settlement Leader T-01",
      tokenId: 1,
      price: "42,000 RD",
      seller: "0x9999...0000",
      radiation: {
        level: "High",
        value: 65
      },
      attributes: [
        { trait: "Survivor Role", value: "Settlement Leader" },
        { trait: "Specialty", value: "Resource Management" },
        { trait: "Settlement", value: "Reactor City" }
      ],
      status: 'active',
      role: "Settlement Leader",
      rank: "Master"
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
          <Biohazard className="h-4 w-4 mr-1 toxic-glow" /> 
          Wasteland Status: <span className={`${
            currentRadiation > 75 ? "text-apocalypse-red" : 
            currentRadiation > 50 ? "text-amber-400" : 
            "text-toxic-neon"
          } font-bold status-critical`}>
            Radiation Level: {currentRadiation}%
          </span>
        </div>
        
        <StoryTerminal 
          initiallyOpen={storyTerminalOpen} 
          onClose={() => setStoryTerminalOpen(false)} 
          className="mb-8" 
        />
        
        <WastelandSurvivalGuideEnhanced className="mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <RadiationSystem 
              currentRadiation={currentRadiation} 
              totalNFTsClaimed={totalHolders} 
              className="mb-6"
            />
            <ReferralSystem
              earnings={referralEarnings}
              totalReferrals={totalReferrals}
            />
          </div>
          <div className="md:col-span-2">
            <NFTDistributionStatus className="mb-6" />
            <ChroniclePanel className="mb-6" />
          </div>
        </div>

        <div className="mb-8">
          <NFTCollectionDisplay 
            currentRadiation={currentRadiation} 
          />
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
              <h2 className="text-2xl font-mono text-toxic-neon mb-4">Character Classes & Abilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ToxicCard 
                  className={`bg-black/60 border-toxic-neon/30 p-6 hover:bg-black/70 transition-all ${activeRole === 'sentinel' ? 'border-2 border-purple-500/70' : ''}`}
                  onClick={() => setActiveRole('sentinel')}
                >
                  <h3 className="text-2xl font-mono text-toxic-neon mb-3">SENTINEL</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">
                    Governance & Economic Oversight. Hold voting rights on key economic decisions, invest in settlements, and earn a share of marketplace transactions.
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-white/60">Free Claims</div>
                      <div className="text-toxic-neon font-mono">495 LEFT</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white/60">Total Supply</div>
                      <div className="text-toxic-neon font-mono">1,500</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white/60">Radiation Immunity</div>
                      <div className="text-toxic-neon font-mono">100%</div>
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
                  <h3 className="text-2xl font-mono text-toxic-neon mb-3">BOUNTY HUNTER</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">
                    Enforcers & Funders of the Wasteland. Earn from referrals, post jobs, track criminals, and drive the economy through investments and missions.
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-white/60">Free Claims</div>
                      <div className="text-toxic-neon font-mono">313 LEFT</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white/60">Total Supply</div>
                      <div className="text-toxic-neon font-mono">500</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white/60">Referral Reward</div>
                      <div className="text-toxic-neon font-mono">50%</div>
                    </div>
                  </div>
                  <ToxicButton 
                    variant="outline" 
                    className="w-full border-toxic-neon/40"
                    onClick={() => navigate('/marketplace/bounty-hunters')}
                  >
                    {isConnected ? "Access Bounty Center" : "Become a Bounty Hunter"}
                  </ToxicButton>
                </ToxicCard>
              </div>
              
              <div className="bg-black/70 border border-toxic-neon/30 rounded-lg p-5 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-toxic-neon/10">
                    <Unlock className="h-6 w-6 text-toxic-neon" />
                  </div>
                  <div>
                    <h3 className="text-xl font-mono text-toxic-neon">Feature Unlocks</h3>
                    <p className="text-white/60 text-sm">
                      Radiation Level: {currentRadiation}% | Status: {radiationStatus}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {featureUnlocks.map((feature) => (
                    <div 
                      key={feature.radiationLevel}
                      className={`p-4 rounded-lg border ${
                        feature.unlocked 
                          ? 'border-toxic-neon/30 bg-toxic-neon/10' 
                          : 'border-white/10 bg-black/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {feature.category === 'economic' ? (
                          <Coins className="h-5 w-5 text-amber-400" />
                        ) : feature.category === 'social' ? (
                          <Users className="h-5 w-5 text-blue-400" />
                        ) : (
                          <Scale className="h-5 w-5 text-purple-400" />
                        )}
                        <h4 className={`font-mono ${feature.unlocked ? 'text-toxic-neon' : 'text-white/70'}`}>
                          {feature.name}
                        </h4>
                      </div>
                      <p className={`text-sm mb-3 ${feature.unlocked ? 'text-white/80' : 'text-white/50'}`}>
                        {feature.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">Required Level</span>
                        <span className={feature.unlocked ? 'text-toxic-neon' : 'text-white/50'}>
                          {feature.radiationLevel}%
                        </span>
                      </div>
                      <div className="mt-2 flex justify-end">
                        {feature.unlocked ? (
                          <ToxicBadge variant="outline" className="text-toxic-neon border-toxic-neon/30">
                            <Check className="h-3 w-3 mr-1" /> Unlocked
                          </ToxicBadge>
                        ) : (
                          <ToxicBadge variant="outline" className="text-white/50 border-white/20">
                            <Lock className="h-3 w-3 mr-1" /> Locked
                          </ToxicBadge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {nextFeatureUnlock && (
                  <div className="bg-black/50 border border-amber-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                      <h4 className="text-amber-400 font-mono">Next Feature Unlock</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-3">
                      {nextFeatureUnlock.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-xs">
                        Current: {currentRadiation}% → Target: {nextFeatureUnlock.radiationLevel}%
                      </span>
                      <span className="text-amber-400 text-xs">
                        Need {Math.max(0, currentRadiation - nextFeatureUnlock.radiationLevel)} more % reduction
                      </span>
                    </div>
                    <ToxicProgress 
                      value={Math.min(100, (currentRadiation / nextFeatureUnlock.radiationLevel) * 100)} 
                      className="h-2 mt-2" 
                    />
                  </div>
                )}
              </div>
              
              <MarketplaceListingGrid 
                listings={sentinelListings} 
                title="FOUNDER SENTINELS: Governance & Oversight" 
                onListingClick={handleListingClick}
                currentRadiationLevel={currentRadiation}
                className="mb-8"
              />
              
              <MarketplaceListingGrid 
                listings={bountyHunterListings} 
                title="BOUNTY HUNTERS: Enforcers & Funders" 
                onListingClick={handleListingClick}
                currentRadiationLevel={currentRadiation}
                className="mb-8"
              />
              
              <MarketplaceListingGrid 
                listings={survivorListings} 
                title="SURVIVORS: Builders & Innovators" 
                onListingClick={handleListingClick}
                currentRadiationLevel={currentRadiation}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <ToxicCard className="bg-black/70 border-toxic-neon/30 p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-full bg-toxic-neon/10">
                  <Radiation className="w-5 h-5 text-toxic-neon" />
                </div>
                <h3 className="text-lg font-mono text-toxic-neon">Radiation Impact</h3>
              </div>
              
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">Global Radiation</span>
                    <span className={`font-mono ${
                      currentRadiation > 75 ? 'text-apocalypse-red' :
                      currentRadiation > 50 ? 'text-amber-400' :
                      'text-toxic-neon'
                    }`}>{currentRadiation}%</span>
                  </div>
                  <ToxicProgress value={100 - currentRadiation} variant="radiation" className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">Total NFT Holders</span>
                    <span className="text-toxic-neon font-mono">{totalHolders}</span>
                  </div>
                  <ToxicProgress value={(totalHolders / 2000) * 100} variant="governance" className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">Radiation Reduction</span>
                    <span className="text-toxic-neon font-mono">-{radiationReduction.toFixed(1)}%</span>
                  </div>
                  <ToxicProgress value={(radiationReduction / 100) * 100} variant="radiation" className="h-2" />
                </div>
              </div>
              
              <div className="bg-black/40 rounded-lg p-3 border border-toxic-neon/20 mb-4">
                <h4 className="text-toxic-neon text-sm font-mono mb-2">Status Effects</h4>
                <div className="space-y-2 text-xs">
                  {radiationStatus === 'Critical Danger' && (
                    <div className="flex items-start gap-2">
                      <Skull className="h-4 w-4 text-apocalypse-red shrink-0 mt-0.5" />
                      <p className="text-white/70">Hostile environment, minimal visibility, wasteland barely habitable. Limited character abilities.</p>
                    </div>
                  )}
                  {radiationStatus === 'High Risk' && (
                    <div className="flex items-start gap-2">
                      <ShieldX className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-white/70">Settlements forming but unstable. Characters beginning to reveal themselves through the radiation.</p>
                    </div>
                  )}
                  {radiationStatus === 'Settlement Formation' && (
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-white/70">Settlements establishing trade networks. More characters visible, marketplace expanding.</p>
                    </div>
                  )}
                  {(radiationStatus === 'Economic Stability' || radiationStatus === 'Flourishing Economy') && (
                    <div className="flex items-start gap-2">
                      <Coins className="h-4 w-4 text-toxic-neon shrink-0 mt-0.5" />
                      <p className="text-white/70">Economy stabilizing, most characters revealed. Full marketplace and governance systems active.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <ToxicButton 
                variant="outline" 
                className="w-full border-toxic-neon/40"
                onClick={() => navigate('/radiation')}
              >
                <Radiation className="h-4 w-4 mr-2" />
                Radiation System Details
              </ToxicButton>
            </ToxicCard>
            
            <MarketplaceActivityFeed 
              activities={recentActivities} 
              isLoading={isRefreshingActivity}
              onRefresh={handleRefreshActivity}
              className="mb-6"
            />
            
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
                    onClick={() => navigate('/marketplace/bounty-hunters')}
                  >
                    <Target className="h-4 w-4 mr-1" />
                    Bounty Hub
                  </ToxicButton>
                  
                  <ToxicButton 
                    variant="outline" 
                    size="sm"
                    className="border-toxic-neon/30"
                    onClick={() => navigate('/chronicles')}
                  >
                    <ScrollIcon className="h-4 w-4 mr-1" />
                    Chronicles
                  </ToxicButton>
                  
                  <ToxicButton 
                    variant="outline" 
                    size="sm"
                    className="border-toxic-neon/30"
                    onClick={() => navigate('/territories/map')}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
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
