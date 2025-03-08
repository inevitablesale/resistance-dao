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
  ShoppingBag
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
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useState } from "react";
import { MarketplaceListingGrid, MarketplaceListing } from "@/components/marketplace/MarketplaceListingGrid";
import { MarketplaceStatusPanel } from "@/components/marketplace/MarketplaceStatusPanel";
import { MarketplaceActivityFeed, MarketplaceActivity } from "@/components/marketplace/MarketplaceActivityFeed";
import { MarketplaceQuickActions } from "@/components/marketplace/MarketplaceQuickActions";

const Index = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: isLoadingStats } = useProposalStats();
  const { data: nftBalance = 0, isLoading: isLoadingNFT } = useNFTBalance("0x1234..."); // Demo address
  const { setShowAuthFlow, isConnected } = useWalletConnection();
  
  const [isRefreshingActivity, setIsRefreshingActivity] = useState(false);
  
  const handleConnectWallet = () => {
    setShowAuthFlow(true);
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
  
  // Mock marketplace data
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
      status: 'active'
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
      status: 'active'
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
      status: 'active'
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
      status: 'active'
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-left mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-neon/10 border border-toxic-neon/20 text-toxic-neon text-sm mb-4 font-mono broken-glass">
                <span className="w-2 h-2 bg-apocalypse-red rounded-full animate-pulse flash-critical" />
                <Biohazard className="h-4 w-4 mr-1 toxic-glow" /> Project Status: <span className="text-apocalypse-red font-bold status-critical">Seeking Capital Commitments</span>
              </div>
              
              <div className="mb-6">
                <TerminalTypewriter 
                  textToType="WELCOME TO THE RESISTANCE PROJECT FUNDING PORTAL - SOFT CAPITAL COMMITMENTS ACTIVE"
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
                  <MarketplaceListingGrid 
                    listings={bountyHunterListings} 
                    title="Featured Projects - Bounty Hunter Series" 
                    onListingClick={handleListingClick}
                    className="mb-8"
                  />
                  
                  <MarketplaceListingGrid 
                    listings={survivorListings} 
                    title="Community-Voted Projects - Survivor Series" 
                    onListingClick={handleListingClick}
                  />
                </div>
                
                <div className="lg:col-span-1">
                  <MarketplaceActivityFeed 
                    activities={recentActivities} 
                    isLoading={isRefreshingActivity}
                    onRefresh={handleRefreshActivity}
                    className="mb-6"
                  />
                  
                  <ToxicCard className="bg-black/70 border-toxic-neon/30 p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-full bg-toxic-neon/10">
                        <Shield className="w-5 h-5 text-toxic-neon" />
                      </div>
                      <h3 className="text-lg font-mono text-toxic-neon">My Funding Status</h3>
                    </div>
                    
                    {isConnected ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Active Commitments</span>
                          <span className="text-toxic-neon font-mono">0</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Funding Reputation</span>
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
                        <p className="text-white/70 mb-4">Connect to view your funding status</p>
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
                  
                  {isConnected && (
                    <ToxicCard className="bg-black/70 border-toxic-neon/30 p-4 mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-full bg-toxic-neon/10">
                          <CircleDollarSign className="w-5 h-5 text-toxic-neon" />
                        </div>
                        <h3 className="text-lg font-mono text-toxic-neon">Quick Actions</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <ToxicButton 
                          variant="outline" 
                          size="sm"
                          className="border-toxic-neon/30"
                          onClick={handleCreateListing}
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Submit Project
                        </ToxicButton>
                        
                        <ToxicButton 
                          variant="outline" 
                          size="sm"
                          className="border-toxic-neon/30"
                          onClick={handleBrowseListings}
                        >
                          <Search className="h-4 w-4 mr-1" />
                          Browse
                        </ToxicButton>
                        
                        <ToxicButton 
                          variant="outline" 
                          size="sm"
                          className="border-toxic-neon/30"
                          onClick={() => navigate('/marketplace/inventory')}
                        >
                          <ShoppingBag className="h-4 w-4 mr-1" />
                          My Projects
                        </ToxicButton>
                        
                        <ToxicButton 
                          variant="outline" 
                          size="sm"
                          className="border-toxic-neon/30"
                          onClick={() => navigate('/marketplace/offers')}
                        >
                          <Target className="h-4 w-4 mr-1" />
                          Commitments
                        </ToxicButton>
                      </div>
                    </ToxicCard>
                  )}
                </div>
              </div>
              
              <div className="relative mb-8">
                <BuyRDTokens onConnectWallet={handleConnectWallet} />
                <ToxicPuddle className="absolute -bottom-2 -right-10" toxicGreen={true} />
              </div>
              
              <div className="mb-12 bg-black/40 border border-toxic-neon/20 rounded-xl p-6 relative broken-glass">
                <div className="scanline"></div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-mono text-toxic-neon flex items-center toxic-glow">
                    <Radiation className="h-6 w-6 mr-2" /> PROJECT FUNDING GUIDE
                  </h3>
                </div>
                
                <div className="mb-6 p-4 bg-black/50 border border-apocalypse-red/30 rounded-lg relative">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-apocalypse-red/20 flex items-center justify-center">
                      <Biohazard className="w-6 h-6 text-apocalypse-red" />
                    </div>
                    <div>
                      <h4 className="text-lg font-mono text-apocalypse-red mb-2">Soft Capital Commitments</h4>
                      <p className="text-white/80 mb-3 text-sm">
                        The <span className="text-apocalypse-red font-semibold">Resistance Project Funding Portal</span> connects project owners with potential backers through soft capital commitments - no upfront capital required.
                      </p>
                      <p className="text-white/80 mb-3 text-sm">
                        Whether you're <span className="text-toxic-neon font-semibold">seeking funding</span> for your innovative protocol or looking to <span className="text-toxic-neon font-semibold">support promising projects</span>, our platform facilitates secure commitments and project validation.
                      </p>
                      <div className="text-white/80 text-sm bg-apocalypse-red/10 p-3 border-l-2 border-apocalypse-red">
                        <span className="text-toxic-neon font-semibold block mb-1">» COMING SOON «</span>
                        Job Listings | Partner Matching | Role Seeking - Expanding the Resistance network with more ways to connect and collaborate.
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
                      <h4 className="text-lg font-mono text-toxic-neon">Project Submission</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-3">
                      Submit your project for community validation and funding. Projects with sufficient soft commitments move into development with Resistance support.
                    </p>
                    <div className="flex justify-end">
                      <ToxicButton 
                        variant="outline" 
                        size="sm" 
                        className="text-toxic-neon border-toxic-neon/30"
                        onClick={() => navigate('/thesis')}
                      >
                        Submit <ChevronRight className="ml-1 h-4 w-4" />
                      </ToxicButton>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 border border-toxic-neon/20 rounded-lg p-4 hover:bg-black/50 hover:border-toxic-neon/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-toxic-neon/10">
                        <Shield className="w-5 h-5 text-toxic-neon" />
                      </div>
                      <h4 className="text-lg font-mono text-toxic-neon">Fund Projects</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-3">
                      Browse promising projects and show support through soft commitments. Validate quality protocols before they launch with no upfront capital required.
                    </p>
                    <div className="flex justify-end">
                      <ToxicButton 
                        variant="outline" 
                        size="sm" 
                        className="text-toxic-neon border-toxic-neon/30"
                        onClick={() => navigate('/proposals')}
                      >
                        Explore <ChevronRight className="ml-1 h-4 w-4" />
                      </ToxicButton>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 border border-toxic-neon/20 rounded-lg p-4 hover:bg-black/50 hover:border-toxic-neon/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-toxic-neon/10">
                        <ShoppingBag className="w-5 h-5 text-toxic-neon" />
                      </div>
                      <h4 className="text-lg font-mono text-toxic-neon">Coming Soon</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-3">
                      Job Listings | Partner Matching | Role Seeking - New ways to connect talent, projects, and resources within the Resistance ecosystem.
                    </p>
                    <div className="flex justify-end">
                      <ToxicButton 
                        variant="outline" 
                        size="sm" 
                        className="text-toxic-neon border-toxic-neon/30 opacity-60 cursor-not-allowed"
                      >
                        Soon <ChevronRight className="ml-1 h-4 w-4" />
                      </ToxicButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
