import { motion } from "framer-motion";
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
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToxicButton } from "@/components/ui/toxic-button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle, ToxicCardDescription, ToxicCardFooter } from "@/components/ui/toxic-card";
import { ToxicProgress } from "@/components/ui/toxic-progress";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { useProposalStats } from "@/hooks/useProposalStats";
import { BuyRDTokens } from "@/components/BuyRDTokens";
import { FACTORY_ADDRESS, RD_TOKEN_ADDRESS } from "@/lib/constants";
import { DrippingSlime, ToxicPuddle } from "@/components/ui/dripping-slime";
import { ToxicBadge } from "@/components/ui/toxic-badge";
import { useNFTBalance } from "@/hooks/useNFTBalance";
import { NFTDisplay } from "@/components/wallet/ResistanceWalletWidget/NFTDisplay";
import { TerminalTypewriter } from "@/components/ui/terminal-typewriter";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useState, useEffect } from "react";
import { MarketplaceListingGrid, MarketplaceListing } from "@/components/marketplace/MarketplaceListingGrid";
import { MarketplaceStatusPanel } from "@/components/marketplace/MarketplaceStatusPanel";
import { MarketplaceActivityFeed, MarketplaceActivity } from "@/components/marketplace/MarketplaceActivityFeed";
import { MarketplaceQuickActions } from "@/components/marketplace/MarketplaceQuickActions";

const Index = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: isLoadingStats } = useProposalStats();
  const { data: nftBalance = 0, isLoading: isLoadingNFT } = useNFTBalance("0x1234..."); // Demo address
  const { isConnected, address } = useCustomWallet();
  const { connect } = useWalletConnection();
  
  const [isRefreshingActivity, setIsRefreshingActivity] = useState(false);
  const [storyStage, setStoryStage] = useState<number>(isConnected ? 1 : 0);
  
  useEffect(() => {
    if (isConnected) {
      setStoryStage(1); // Skip to marketplace view when connected
      console.log("[Index] Wallet connected, showing marketplace view");
    }
  }, [isConnected]);
  
  const handleConnectWallet = () => {
    console.log("[Index] Triggering wallet connection from Index page");
    connect();
  };

  const advanceStory = () => {
    setStoryStage(prev => prev + 1);
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
  
  const bountyHunterListings: MarketplaceListing[] = [
    {
      id: 1,
      type: 'bounty-hunter',
      name: "Mutant Zero X-35",
      tokenId: 1,
      price: "15,000 RD",
      seller: "0x1234...5678",
      radiation: {
        level: "High",
        value: 78
      },
      attributes: [
        { trait: "Radiation Level", value: "High" },
        { trait: "Mutation", value: "Neural Hacking" },
        { trait: "Threat Level", value: "Extreme" }
      ],
      status: 'active',
      modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeiheog5wgtnl7ldazmsj3n7xmkgkzpjnix5e4tuxndzw7j3bgkp2n4"
    },
    {
      id: 2,
      type: 'bounty-hunter',
      name: "Toxic Liquidator K-42",
      tokenId: 42,
      price: "32,000 RD",
      seller: "0x8765...4321",
      radiation: {
        level: "Medium",
        value: 54
      },
      attributes: [
        { trait: "Radiation Level", value: "Medium" },
        { trait: "Mutation", value: "Toxic Immunity" },
        { trait: "Threat Level", value: "High" }
      ],
      status: 'active',
      modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeiavqxeov62wgj6upfpvq6g4vpvot4mnwl3ggunxp27sbfjgs4hlfq"
    },
    {
      id: 3,
      type: 'bounty-hunter',
      name: "Mind Raider B-007",
      tokenId: 7,
      price: "50,000 RD",
      seller: "0x9876...5432",
      radiation: {
        level: "Critical",
        value: 92
      },
      attributes: [
        { trait: "Radiation Level", value: "Critical" },
        { trait: "Mutation", value: "Telepathy" },
        { trait: "Threat Level", value: "Catastrophic" }
      ],
      status: 'active',
      modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeig47okn4sqqbajhje57htkxw6py3tdms7boyc3hkvvr4qlj7zsabu"
    }
  ];
  
  const survivorListings: MarketplaceListing[] = [
    {
      id: 4,
      type: 'survivor',
      name: "Wasteland Medic R-12",
      tokenId: 12,
      price: "18,500 RD",
      seller: "0x2468...1357",
      radiation: {
        level: "Low",
        value: 28
      },
      attributes: [
        { trait: "Specialty", value: "Medicine" },
        { trait: "Radiation Resistance", value: "Enhanced" },
        { trait: "Settlement", value: "New Haven" }
      ],
      status: 'active',
      modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeifzvpyj5znhgjq22cbjyzav5zsvese3m3klbkc4lcdm3fdbbxiooa"
    },
    {
      id: 5,
      type: 'survivor',
      name: "Scout Unit E-67",
      tokenId: 67,
      price: "24,000 RD",
      seller: "0x1357...2468",
      radiation: {
        level: "Medium",
        value: 45
      },
      attributes: [
        { trait: "Specialty", value: "Recon" },
        { trait: "Radiation Resistance", value: "Standard" },
        { trait: "Settlement", value: "Outpost Alpha" }
      ],
      status: 'active'
    },
    {
      id: 6,
      type: 'survivor',
      name: "Engineer T-89",
      tokenId: 89,
      price: "36,500 RD",
      seller: "0x6543...7890",
      radiation: {
        level: "High",
        value: 65
      },
      attributes: [
        { trait: "Specialty", value: "Engineering" },
        { trait: "Radiation Resistance", value: "High" },
        { trait: "Settlement", value: "Reactor City" }
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

  const WastelandSurvivalGuide = () => (
    <div className="mb-8 bg-black/40 border border-toxic-neon/20 rounded-xl p-6 relative broken-glass">
      <div className="scanline"></div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-mono text-toxic-neon flex items-center toxic-glow">
          <Radiation className="h-6 w-6 mr-2" /> WASTELAND SURVIVAL GUIDE
        </h3>
      </div>
      
      <div className="mb-6 p-4 bg-black/50 border border-apocalypse-red/30 rounded-lg relative">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-apocalypse-red/20 flex items-center justify-center">
            <Biohazard className="w-6 h-6 text-apocalypse-red" />
          </div>
          <div>
            <h4 className="text-lg font-mono text-apocalypse-red mb-2">Resistance Protocol</h4>
            <p className="text-white/80 mb-3 text-sm">
              The <span className="text-apocalypse-red font-semibold">Resistance</span> connects survivors and bounty hunters to rebuild from the ashes of the old financial world.
            </p>
            <p className="text-white/80 mb-3 text-sm">
              Whether you're a <span className="text-toxic-neon font-semibold">Hunter tracking criminal protocols</span> or a <span className="text-toxic-neon font-semibold">Survivor contributing rebuild skills</span>, our network facilitates wasteland justice and rebuilding efforts.
            </p>
            <div className="text-white/80 text-sm bg-apocalypse-red/10 p-3 border-l-2 border-apocalypse-red">
              <span className="text-toxic-neon font-semibold block mb-1">» COMING SOON «</span>
              Settler Jobs | Wasteland Expeditions | Settlement Building - Expanding the Resistance with more ways to survive and rebuild.
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-black/40 border border-toxic-neon/20 rounded-lg p-4 hover:bg-black/50 hover:border-toxic-neon/30 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-toxic-neon/10">
              <Target className="w-5 h-5 text-toxic-neon" />
            </div>
            <h4 className="text-lg font-mono text-toxic-neon">Hunt Bounties</h4>
          </div>
          <p className="text-white/70 text-sm mb-3">
            Track down the criminals who crashed the old world. Submit capture evidence and earn rewards for bringing justice to the wasteland.
          </p>
          <div className="flex justify-end">
            <ToxicButton 
              variant="outline" 
              size="sm" 
              className="text-toxic-neon border-toxic-neon/30"
              onClick={() => navigate('/marketplace/bounty-hunters')}
            >
              Hunt <ChevronRight className="ml-1 h-4 w-4" />
            </ToxicButton>
          </div>
        </div>
        
        <div className="bg-black/40 border border-toxic-neon/20 rounded-lg p-4 hover:bg-black/50 hover:border-toxic-neon/30 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-toxic-neon/10">
              <Shield className="w-5 h-5 text-toxic-neon" />
            </div>
            <h4 className="text-lg font-mono text-toxic-neon">Join Survivors</h4>
          </div>
          <p className="text-white/70 text-sm mb-3">
            Contribute your skills to rebuilding civilization. Each survivor plays a vital role in our settlement network, from medics to engineers.
          </p>
          <div className="flex justify-end">
            <ToxicButton 
              variant="outline" 
              size="sm" 
              className="text-toxic-neon border-toxic-neon/30"
              onClick={() => navigate('/marketplace/survivors')}
            >
              Settle <ChevronRight className="ml-1 h-4 w-4" />
            </ToxicButton>
          </div>
        </div>
        
        <div className="bg-black/40 border border-toxic-neon/20 rounded-lg p-4 hover:bg-black/50 hover:border-toxic-neon/30 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-toxic-neon/10">
              <Coins className="w-5 h-5 text-toxic-neon" />
            </div>
            <h4 className="text-lg font-mono text-toxic-neon">Fund Economy</h4>
          </div>
          <p className="text-white/70 text-sm mb-3">
            Convert your Old World assets to Resistance Dollars (RD). Power the new wasteland economy and gain governance rights in settlement decisions.
          </p>
          <div className="flex justify-end">
            <ToxicButton 
              variant="outline" 
              size="sm" 
              className="text-toxic-neon border-toxic-neon/30"
              onClick={() => navigate('/buy-rd')}
            >
              Convert <ChevronRight className="ml-1 h-4 w-4" />
            </ToxicButton>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStoryIntro = () => (
    <div className="max-w-4xl mx-auto mb-16">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-6xl md:text-7xl font-mono text-toxic-neon mb-8 toxic-glow">THE RESISTANCE</h1>
        <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
          After the financial collapse of 2031, centralized powers seized control of global funding.
          Innovation stalled. Independent projects disappeared. The future darkened.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8">
          <TerminalTypewriter 
            textToType="Enter access code"
            isConnected={isConnected}
            onConnect={handleConnectWallet}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ToxicCard className="bg-black/60 border-toxic-neon/30 p-6 hover:bg-black/70 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-toxic-neon/10">
                <Skull className="w-5 h-5 text-toxic-neon" />
              </div>
              <h3 className="text-xl font-mono text-toxic-neon">The Collapse</h3>
            </div>
            <p className="text-white/70 mb-4">
              Traditional venture capital dried up. Banks consolidated power. Independent innovators were shut out of the system.
            </p>
          </ToxicCard>
          
          <ToxicCard className="bg-black/60 border-toxic-neon/30 p-6 hover:bg-black/70 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-toxic-neon/10">
                <Zap className="w-5 h-5 text-toxic-neon" />
              </div>
              <h3 className="text-xl font-mono text-toxic-neon">The Awakening</h3>
            </div>
            <p className="text-white/70 mb-4">
              A group of renegade builders created a new system. Project funding through community commitment. Decentralized control.
            </p>
          </ToxicCard>
          
          <ToxicCard className="bg-black/60 border-toxic-neon/30 p-6 hover:bg-black/70 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-toxic-neon/10">
                <Shield className="w-5 h-5 text-toxic-neon" />
              </div>
              <h3 className="text-xl font-mono text-toxic-neon">The Resistance</h3>
            </div>
            <p className="text-white/70 mb-4">
              Now we're building the future. Supporting innovation through soft capital commitments. No gatekeepers. Direct access.
            </p>
          </ToxicCard>
        </div>
      </motion.div>
    </div>
  );
  
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
        
        <WastelandSurvivalGuide />
        
        <div className="mb-6">
          <TerminalTypewriter 
            textToType="WELCOME TO THE RESISTANCE SURVIVAL TERMINAL - JOIN THE NETWORK TO REBUILD CIVILIZATION"
            isConnected={isConnected}
            onConnect={handleConnectWallet}
            className="mb-4"
            marketplaceMode={true}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ToxicCard className="bg-black/60 border-toxic-neon/30 p-6 hover:bg-black/70 transition-all">
                  <h3 className="text-2xl font-mono text-toxic-neon mb-3">BOUNTY HUNTER</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">
                    Stalk the wasteland hunting the criminals who crashed the old world. Track digital signatures, capture mutated protocols, and earn rewards for bringing justice to the Resistance.
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-white/60">Collection Size:</div>
                      <div className="text-toxic-neon font-mono">142 CRIMINALS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white/60">Avg. Bounty Value:</div>
                      <div className="text-toxic-neon font-mono">22,500 RD</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white/60">Active Hunters:</div>
                      <div className="text-toxic-neon font-mono">68</div>
                    </div>
                  </div>
                  <ToxicButton 
                    variant="outline" 
                    className="w-full border-toxic-neon/40"
                    onClick={() => navigate('/marketplace/bounty-hunters')}
                  >
                    {isConnected ? "Browse Bounty Hunters" : "Select Bounty Hunter"}
                  </ToxicButton>
                </ToxicCard>
                
                <ToxicCard className="bg-black/60 border-toxic-neon/30 p-6 hover:bg-black/70 transition-all">
                  <h3 className="text-2xl font-mono text-toxic-neon mb-3">SURVIVOR</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">
                    Join a network of settlements rebuilding civilization from the ashes. Contribute your skills to community projects, develop new technologies, and shape our collective future.
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-white/60">Collection Size:</div>
                      <div className="text-toxic-neon font-mono">821 SURVIVORS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white/60">Settlement Outposts:</div>
                      <div className="text-toxic-neon font-mono">37</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white/60">Active Projects:</div>
                      <div className="text-toxic-neon font-mono">84</div>
                    </div>
                  </div>
                  <ToxicButton 
                    variant="outline" 
                    className="w-full border-toxic-neon/40"
                    onClick={() => navigate('/marketplace/survivors')}
                  >
                    {isConnected ? "Browse Survivors" : "Select Survivor"}
                  </ToxicButton>
                </ToxicCard>
              </div>
              
              <MarketplaceListingGrid 
                listings={bountyHunterListings} 
                title="WANTED: Top Bounty Targets" 
                onListingClick={handleListingClick}
                className="mb-8"
              />
              
              <MarketplaceListingGrid 
                listings={survivorListings} 
                title="RECRUTING: Needed Survivor Skills" 
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
                <h3 className="text-lg font-mono text-toxic-neon">Survivor Status</h3>
              </div>
              
              {isConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Bounties Claimed</span>
                    <span className="text-toxic-neon font-mono">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Wasteland Reputation</span>
                    <div className="flex items-center">
                      <ToxicBadge variant="rating" className="text-toxic-neon">★ 0.0</ToxicBadge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Radiation Level</span>
                    <span className="text-toxic-neon font-mono">
                      <span className="text-toxic-neon">LOW (5%)</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-toxic-neon/5 rounded-lg">
                  <p className="text-white/70 mb-4">Connect to view your wasteland status</p>
                  <ToxicButton 
                    variant="marketplace"
                    onClick={handleConnectWallet}
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
                    <Target className="w-5 h-5 text-toxic-neon" />
                  </div>
                  <h3 className="text-lg font-mono text-toxic-neon">Wasteland Missions</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <ToxicButton 
                    variant="outline" 
                    size="sm"
                    className="border-toxic-neon/30"
                    onClick={handleCreateListing}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Submit Mission
                  </ToxicButton>
                  
                  <ToxicButton 
                    variant="outline" 
                    size="sm"
                    className="border-toxic-neon/30"
                    onClick={handleBrowseListings}
                  >
                    <Search className="h-4 w-4 mr-1" />
                    Hunt Bounties
                  </ToxicButton>
                  
                  <ToxicButton 
                    variant="outline" 
                    size="sm"
                    className="border-toxic-neon/30"
                    onClick={() => navigate('/marketplace/inventory')}
                  >
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    My Captures
                  </ToxicButton>
                  
                  <ToxicButton 
                    variant="outline" 
                    size="sm"
                    className="border-toxic-neon/30"
                    onClick={() => navigate('/marketplace/offers')}
                  >
                    <Target className="h-4 w-4 mr-1" />
                    Active Missions
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

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -top-48 -left-24" />
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -bottom-48 -right-24" />
        </div>
        
        <div className="container px-4 relative">
          {storyStage === 0 ? renderStoryIntro() : renderMarketplace()}
        </div>
      </section>
    </div>
  );
};

export default Index;
