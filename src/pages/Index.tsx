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
  Crosshair
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToxicButton } from "@/components/ui/toxic-button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle, ToxicCardDescription, ToxicCardFooter } from "@/components/ui/toxic-card";
import { Progress } from "@/components/ui/progress";
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

const Index = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: isLoadingStats } = useProposalStats();
  const { data: nftBalance = 0, isLoading: isLoadingNFT } = useNFTBalance("0x1234..."); // Demo address
  const { setShowAuthFlow, isConnected } = useWalletConnection();
  const [userRole, setUserRole] = useState<"bounty-hunter" | "survivor" | null>(null);
  
  const handleConnectWallet = () => {
    setShowAuthFlow(true);
  };
  
  const handleRoleSelect = (role: "bounty-hunter" | "survivor") => {
    setUserRole(role);
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

  const bountyHunterCollection = [
    {
      id: 1,
      name: "Mutant Zero X-35",
      crime: "Protocol Sabotage",
      tokenId: 1,
      bounty: "15,000 RD",
      attributes: [
        { trait: "Radiation Level", value: "High" },
        { trait: "Mutation", value: "Neural Hacking" },
        { trait: "Threat Level", value: "Extreme" }
      ]
    },
    {
      id: 2,
      name: "Toxic Liquidator K-42",
      crime: "DAO Treasury Theft",
      tokenId: 42,
      bounty: "32,000 RD",
      attributes: [
        { trait: "Radiation Level", value: "Medium" },
        { trait: "Mutation", value: "Toxic Immunity" },
        { trait: "Threat Level", value: "High" }
      ]
    },
    {
      id: 3,
      name: "Mind Raider B-007",
      crime: "Consensus Attack",
      tokenId: 7,
      bounty: "50,000 RD",
      attributes: [
        { trait: "Radiation Level", value: "Critical" },
        { trait: "Mutation", value: "Telepathy" },
        { trait: "Threat Level", value: "Catastrophic" }
      ]
    }
  ];

  const survivorCollection = [
    {
      id: 1,
      name: "Medic Unit S-12",
      skill: "Radiation Treatment",
      tokenId: 12,
      contribution: "Supply Chain",
      attributes: [
        { trait: "Medical Expertise", value: "Advanced" },
        { trait: "Resource Management", value: "High" },
        { trait: "Community Standing", value: "Respected" }
      ]
    },
    {
      id: 2,
      name: "Engineer K-19",
      skill: "Shelter Construction",
      tokenId: 19,
      contribution: "Infrastructure",
      attributes: [
        { trait: "Technical Knowledge", value: "Expert" },
        { trait: "Material Scavenging", value: "Efficient" },
        { trait: "Community Standing", value: "Essential" }
      ]
    },
    {
      id: 3,
      name: "Scout V-07",
      skill: "Safe Route Mapping",
      tokenId: 7,
      contribution: "Reconnaissance",
      attributes: [
        { trait: "Stealth", value: "Superior" },
        { trait: "Environmental Knowledge", value: "Comprehensive" },
        { trait: "Community Standing", value: "Trusted" }
      ]
    }
  ];

  const displayCollection = userRole === "survivor" ? survivorCollection : bountyHunterCollection;

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
            className="max-w-4xl mx-auto"
          >
            <div className="text-left mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-neon/10 border border-toxic-neon/20 text-toxic-neon text-sm mb-4 font-mono broken-glass">
                <span className="w-2 h-2 bg-apocalypse-red rounded-full animate-pulse flash-critical" />
                <Biohazard className="h-4 w-4 mr-1 toxic-glow" /> Network Status: <span className="text-apocalypse-red font-bold status-critical">Critical</span>
              </div>
              
              <div className="mb-6">
                <TerminalTypewriter 
                  isConnected={isConnected}
                  onConnect={handleConnectWallet}
                  onRoleSelect={handleRoleSelect}
                  selectedRole={userRole}
                  className="mb-4"
                />
              </div>

              <div className="flex gap-4 mb-8">
                <div className="bg-black/70 border border-toxic-neon/20 rounded-lg p-4 flex-1 relative overflow-hidden rust-overlay">
                  <div className="scanline"></div>
                  <div className="text-toxic-neon text-sm mb-1 flex items-center">
                    <Shield className="h-4 w-4 mr-2" /> Survivors
                  </div>
                  <div className="font-mono text-2xl text-white">821</div>
                </div>
                <div className="bg-black/70 border border-toxic-neon/20 rounded-lg p-4 flex-1 relative overflow-hidden rust-overlay">
                  <div className="scanline"></div>
                  <div className="text-toxic-neon text-sm mb-1 flex items-center">
                    <Users className="h-4 w-4 mr-2" /> Total Population
                  </div>
                  <div className="font-mono text-2xl text-white">2.5K</div>
                </div>
                <div className="bg-black/70 border border-toxic-neon/20 rounded-lg p-4 flex-1 relative overflow-hidden rust-overlay">
                  <div className="scanline"></div>
                  <div className="text-toxic-neon text-sm mb-1 flex items-center">
                    <Zap className="h-4 w-4 mr-2" /> Radio Subscribers
                  </div>
                  <div className="font-mono text-2xl text-white">2.7K</div>
                </div>
              </div>
              
              <div className="mb-12 bg-black/40 border border-toxic-neon/20 rounded-xl p-6 relative broken-glass">
                <div className="scanline"></div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-mono text-toxic-neon flex items-center toxic-glow">
                    <Crosshair className="h-5 w-5 mr-2" /> 
                    {userRole === "survivor" ? "Resistance SURVIVOR NETWORK" : "Resistance BOUNTY LIST"}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex bg-black/60 border border-toxic-neon/20 rounded-lg overflow-hidden">
                      <button 
                        className={`px-4 py-2 flex items-center gap-2 transition-all ${userRole === 'bounty-hunter' ? 'bg-toxic-neon/20 text-toxic-neon' : 'text-white/60 hover:text-white/80'}`}
                        onClick={() => handleRoleSelect('bounty-hunter')}
                      >
                        <Target className="w-4 h-4" />
                        <span>Bounty Hunter</span>
                      </button>
                      <button 
                        className={`px-4 py-2 flex items-center gap-2 transition-all ${userRole === 'survivor' ? 'bg-toxic-neon/20 text-toxic-neon' : 'text-white/60 hover:text-white/80'}`}
                        onClick={() => handleRoleSelect('survivor')}
                      >
                        <Shield className="w-4 h-4" />
                        <span>Survivor</span>
                      </button>
                    </div>
                    <ToxicButton 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate('/marketplace')}
                      className="text-toxic-neon hover:bg-toxic-dark/20 border-toxic-neon/50"
                    >
                      View All <ArrowIcon className="h-4 w-4 ml-1" />
                    </ToxicButton>
                  </div>
                </div>
                
                <div className="mb-6 p-4 bg-black/50 border border-apocalypse-red/30 rounded-lg relative">
                  <div className="absolute -top-2 -right-2 px-2 py-1 bg-apocalypse-red text-xs text-black font-mono rotate-3">
                    TOP SECRET
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-apocalypse-red/20 flex items-center justify-center">
                      {userRole === "survivor" ? (
                        <Shield className="w-6 h-6 text-apocalypse-red" />
                      ) : (
                        <UserX className="w-6 h-6 text-apocalypse-red" />
                      )}
                    </div>
                    <div>
                      {userRole === "survivor" ? (
                        <>
                          <h4 className="text-lg font-mono text-apocalypse-red mb-2">Survivor Network Protocol</h4>
                          <p className="text-white/80 mb-3 text-sm">
                            The wasteland is unforgiving to those who journey alone. As a <span className="text-toxic-neon font-semibold">Survivor</span>, 
                            your skills and resources are vital to building a new future from the ashes of the old world.
                          </p>
                          <p className="text-white/80 mb-3 text-sm">
                            Each survivor contributes according to their abilities - medical experts, engineers, scouts, and 
                            farmers all play crucial roles in our fragile network of settlements. Your survivor NFT represents 
                            your standing within the Resistance.
                          </p>
                          <div className="text-white/80 text-sm bg-apocalypse-red/10 p-3 border-l-2 border-apocalypse-red">
                            <span className="text-toxic-neon font-semibold block mb-1">» CRITICAL DIRECTIVE «</span>
                            Survivors must maintain a positive contribution ratio to access Resistance resources. Regular 
                            participation in community projects strengthens your position and unlocks greater benefits for all.
                          </div>
                        </>
                      ) : (
                        <>
                          <h4 className="text-lg font-mono text-apocalypse-red mb-2">Bounty Hunter Protocol</h4>
                          <p className="text-white/80 mb-3 text-sm">
                            After the collapse, a dangerous new breed emerged from the toxic wastelands - <span className="text-apocalypse-red font-semibold">Mutant Protocol Criminals</span>. 
                            Former CEOs, lead developers, and treasury managers who survived by mutating their code to drain liquidity 
                            from the survivors' remaining assets.
                          </p>
                          <p className="text-white/80 mb-3 text-sm">
                            The Resistance fights back through our elite <span className="text-toxic-neon font-semibold">Bounty Hunter Program</span>. 
                            Each captured criminal's digital signature is minted as an NFT trophy, with their stolen funds 
                            redirected to fuel the Resistance's operations.
                          </p>
                          <div className="text-white/80 text-sm bg-apocalypse-red/10 p-3 border-l-2 border-apocalypse-red">
                            <span className="text-toxic-neon font-semibold block mb-1">» CRITICAL DIRECTIVE «</span>
                            To join the Resistance, each bounty hunter must capture at least one criminal. Your first successful 
                            capture proves your commitment and grants you full Resistance membership privileges.
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {displayCollection.map((item) => (
                    <ToxicCard key={item.id} className="bg-black/70 border-toxic-neon/30 hover:border-toxic-neon/60 transition-all">
                      <ToxicCardContent className="p-0">
                        <div className="relative h-48 bg-gradient-to-b from-toxic-neon/20 to-black/60 rounded-t-lg overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            {userRole === "survivor" ? (
                              <Shield className="w-20 h-20 text-toxic-neon/50" />
                            ) : (
                              <Skull className="w-20 h-20 text-toxic-neon/50" />
                            )}
                          </div>
                          <DrippingSlime position="top" dripsCount={5} toxicGreen={true} showIcons={false} />
                          <div className="absolute top-2 right-2">
                            <div className="px-2 py-1 rounded-full bg-apocalypse-red/20 text-xs text-apocalypse-red font-mono">
                              #{item.tokenId}
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60">
                            <div className="flex items-center justify-between">
                              {userRole === "survivor" ? (
                                <>
                                  <span className="text-toxic-neon text-xs font-mono">SURVIVOR</span>
                                  <span className="text-toxic-neon text-xs font-mono">{(item as any).contribution}</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-apocalypse-red text-xs font-mono">WANTED</span>
                                  <span className="text-toxic-neon text-xs font-mono">BOUNTY: {(item as any).bounty}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-xl font-mono text-toxic-neon mb-1">{item.name}</h4>
                          <div className="flex items-center mb-3">
                            {userRole === "survivor" ? (
                              <>
                                <Shield className="h-4 w-4 text-toxic-neon mr-2" />
                                <span className="text-toxic-neon text-sm">{(item as any).skill}</span>
                              </>
                            ) : (
                              <>
                                <ShieldX className="h-4 w-4 text-apocalypse-red mr-2" />
                                <span className="text-apocalypse-red text-sm">{(item as any).crime}</span>
                              </>
                            )}
                          </div>
                          <div className="space-y-2 mb-4">
                            {item.attributes.map((attr, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-white/60">{attr.trait}</span>
                                <span className="text-toxic-neon/90">{attr.value}</span>
                              </div>
                            ))}
                          </div>
                          <ToxicButton 
                            className="w-full mt-2 bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80 text-sm"
                            size="sm"
                            onClick={handleConnectWallet}
                          >
                            {userRole === "survivor" ? (
                              <>
                                <Shield className="h-4 w-4 mr-1" /> Join Network
                              </>
                            ) : (
                              <>
                                <Target className="h-4 w-4 mr-1" /> Claim Bounty
                              </>
                            )}
                          </ToxicButton>
                        </div>
                      </ToxicCardContent>
                    </ToxicCard>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-toxic-neon/20">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {userRole === "survivor" ? (
                        <>
                          <Shield className="h-5 w-5 text-toxic-neon" />
                          <span className="text-lg font-mono text-toxic-neon">Your Survivor Status</span>
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5 text-toxic-neon" />
                          <span className="text-lg font-mono text-toxic-neon">Your Captured Bounties</span>
                        </>
                      )}
                    </div>
                    <div className="bg-toxic-neon/10 px-3 py-1 rounded-full text-toxic-neon text-sm font-mono">
                      {isLoadingNFT ? "Loading..." : `${nftBalance} ${userRole === "survivor" ? "Badges" : "Captures"}`}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <NFTDisplay balance={nftBalance} className="bg-black/30 p-4 rounded-lg" />
                    
                    {nftBalance === 0 && (
                      <div className="text-center py-6 bg-toxic-neon/5 rounded-lg mt-4">
                        {userRole === "survivor" ? (
                          <p className="text-white/70 mb-4">You haven't joined any survivor networks yet</p>
                        ) : (
                          <p className="text-white/70 mb-4">You haven't captured any mutant criminals yet</p>
                        )}
                        <ToxicButton 
                          variant="default"
                          onClick={handleConnectWallet}
                          className="bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
                        >
                          <Radiation className="h-4 w-4 mr-2" />
                          {userRole === "survivor" ? "Join Survivor Network" : "Hunt Your First Target"}
                        </ToxicButton>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="relative mb-8">
                <BuyRDTokens onConnectWallet={handleConnectWallet} />
                <ToxicPuddle className="absolute -bottom-2 -right-10" toxicGreen={true} />
              </div>
              
              <div className="mb-8">
                <div className="flex flex-wrap gap-4 mb-8">
                  <ToxicButton 
                    size="lg"
                    onClick={() => navigate('/thesis')}
                    variant="glowing"
                    className="bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
                  >
                    <Radiation className="w-5 h-5 mr-2 text-toxic-neon" />
                    Request Mission Sponsorship
                  </ToxicButton>
                  <ToxicButton 
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/proposals')}
                    className="border-toxic-neon/50 text-toxic-neon hover:bg-toxic-dark/30"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Scout Settlements
                  </ToxicButton>
                </div>

                <div className="mb-6 p-4 bg-black/50 border border-apocalypse-red/30 rounded-lg relative">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-apocalypse-red/20 flex items-center justify-center">
                      <Radiation className="w-6 h-6 text-apocalypse-red" />
                    </div>
                    <div>
                      <h4 className="text-lg font-mono text-apocalypse-red mb-2">Resource Allocation Protocol</h4>
                      <p className="text-white/80 mb-3 text-sm">
                        <span className="text-apocalypse-red font-semibold">Request Mission Sponsorship</span> - In the wasteland, 
                        lone survivors rarely last. Your mission might be vital to our collective survival, but resources are scarce. 
                        Present your plans to the Council and fellow survivors will vote with their Resistance Dollars to back missions 
                        that strengthen our foothold in this hostile world.
                      </p>
                      <p className="text-white/80 mb-3 text-sm">
                        <span className="text-toxic-neon font-semibold">Scout Settlements</span> - Our network of outposts and safe zones grows 
                        with each passing day. Browse the mission board to discover initiatives from fellow survivors - from radiation-resistant 
                        crop research to mutant defense systems. Contribute your expertise and RD tokens to missions that align with your survival strategy.
                      </p>
                      <div className="text-white/80 text-sm bg-apocalypse-red/10 p-3 border-l-2 border-apocalypse-red">
                        <span className="text-toxic-neon font-semibold block mb-1">» SURVIVAL DIRECTIVE «</span>
                        The old world fell because resources flowed to the greedy, not the worthy. The Resistance vets all projects through 
                        decentralized consensus - your voice matters in determining what gets built and who receives support. Choose wisely, survivor.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-black/40 border border-toxic-neon/20 rounded-xl p-6 relative broken-glass">
                  <div className="scanline"></div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-mono text-toxic-neon flex items-center">
                      <Radiation className="h-5 w-5 mr-2" /> Resistance Updates
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-toxic-neon/70">
                        <div className="w-2 h-2 bg-toxic-neon rounded-full animate-pulse" />
                        Emergency Broadcasts
                      </div>
                      <ToxicButton 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => window.location.reload()}
                        className="text-toxic-neon hover:bg-toxic-dark/20"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </ToxicButton>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {isLoadingStats ? (
                      <div className="animate-pulse">Scanning wasteland...</div>
                    ) : (
                      stats?.recentActivities.map((activity, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-toxic-neon/10 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.type === 'vote' ? 'bg-toxic-neon' :
                              activity.type === 'create' ? 'bg-toxic-neon/70' : 'bg-toxic-muted'
                            }`} />
                            <span className="text-white/70">
                              {activity.type === 'vote' ? 'New Survivor Pledge' :
                              activity.type === 'create' ? 'Settlement Initiative' :
                              'Resource Goal Reached'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-toxic-neon">
                              {activity.type === 'vote' || activity.type === 'complete' 
                                ? formatCurrency(Number(activity.amount))
                                : `#${activity.proposalId}`}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-8">
                  <ToxicCard className="relative bg-black/70 border-toxic-neon/30">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-toxic-neon/10">
                        <CircleDollarSign className="w-6 h-6 text-toxic-neon" />
                      </div>
                      <div>
                        <div className="text-toxic-neon/70 text-sm">Community Support</div>
                        <div className="text-2xl font-semibold text-white">
                          {isLoadingStats ? (
                            <span className="animate-pulse">Calculating...</span>
                          ) : (
                            formatCurrency(stats?.totalLockedValue || 0)
                          )}
                        </div>
                      </div>
                    </div>
                  </ToxicCard>

                  <ToxicCard className="relative bg-black/70 border-toxic-neon/30">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-toxic-neon/10">
                        <Users className="w-6 h-6 text-toxic-neon" />
                      </div>
                      <div>
                        <div className="text-toxic-neon/70 text-sm">Resistance Fighters</div>
                        <div className="text-2xl font-semibold text-white">
                          {isLoadingStats ? (
                            <span className="animate-pulse">Counting...</span>
                          ) : (
                            formatNumber(stats?.totalHolders || 0)
                          )}
                        </div>
                      </div>
                    </div>
                  </ToxicCard>

                  <ToxicCard className="relative bg-black/70 border-toxic-neon/30">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-toxic-neon/10">
                        <Scale className="w-6 h-6 text-toxic-neon" />
                      </div>
                      <div>
                        <div className="text-toxic-neon/70 text-sm">Established Colonies</div>
                        <div className="text-2xl font-semibold text-white">
                          {isLoadingStats ? (
                            <span className="animate-pulse">Searching...</span>
                          ) : (
                            formatNumber(stats?.activeProposals || 0)
                          )}
                        </div>
                      </div>
                    </div>
                  </ToxicCard>
                </div>
              </div>

              <div className="mb-12 relative">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-apocalypse-red/30 bg-black/60 text-apocalypse-red mb-4">
                    <Radiation className="w-5 h-5" />
                    <span className="text-sm font-mono">HISTORICAL ARCHIVES</span>
                  </div>
                  <h2 className="text-4xl font-bold font-mono mb-6 text-toxic-neon toxic-glow">
                    The Resistance Story
                  </h2>
                  <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12">
                    How we survived the crypto nuclear winter and built a new world from the ashes
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
                  <div className="relative">
                    <div className="absolute inset-0 bg-toxic-neon/5 rounded-2xl blur-xl"></div>
                    <div className="relative bg-black/60 rounded-xl overflow-hidden border border-apocalypse-ash p-1">
                      <div className="aspect-video bg-apocalypse-dark rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image className="w-32 h-32 text-apocalypse-ash/30" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                          <div className="text-xs text-apocalypse-ash/70 font-mono mb-1">DAY 0</div>
                          <div className="text-lg text-toxic-neon font-mono">The Fall</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-apocalypse-red/20">
                        <Skull className="h-4 w-4 text-apocalypse-red" />
                      </div>
                      <h3 className="text-xl font-bold text-toxic-neon font-mono">The Crypto Nuclear Winter</h3>
                    </div>
                    <p className="text-white/70 mb-4">
                      It began with the great crashes of 2022-2023. Major protocols imploded one by one, like a chain of nuclear detonations across the digital landscape. FTX, Terra Luna, 3AC - each collapse sent toxic fallout across the ecosystem.
                    </p>
                    <p className="text-white/70 mb-6">
                      User trust was obliterated. Capital fled in panic. Development froze as the crypto nuclear winter descended. Weakened by greed and centralization, the old world wasn't sustainable - it had to burn for something new to emerge.
                    </p>
                    <ToxicButton 
                      variant="outline" 
                      size="sm" 
                      className="border-apocalypse-red/30 text-toxic-neon hover:bg-apocalypse-red/10"
                      onClick={() => navigate('/crypto-history')}
                    >
                      Historical Records <ArrowIcon className="ml-2 h-4 w-4" />
                    </ToxicButton>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-center mb-16 md:mt-24">
                  <div className="order-2 md:order-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-toxic-neon/20">
                        <Radiation className="h-4 w-4 text-toxic-neon" />
                      </div>
                      <h3 className="text-xl font-bold text-toxic-neon font-mono">The First Survivors</h3>
                    </div>
                    <p className="text-white/70 mb-4">
                      As institutional players abandoned the wasteland, a resilient community began to form. We were the builders who stayed - developing during the depths of winter, convinced of the technology's potential despite the destruction.
                    </p>
                    <p className="text-white/70 mb-6">
                      Operating with minimal resources, we formed underground networks for mutual support. Skills were shared, protocols were hardened against radiation, and new models of trust were forged in the crucible of catastrophe.
                    </p>
                    <ToxicButton 
                      variant="outline" 
                      size="sm" 
                      className="border-toxic-neon/30 text-toxic-neon hover:bg-toxic-neon/10"
                      onClick={() => navigate('/resistance-origins')}
                    >
                      Survivor Stories <ArrowIcon className="ml-2 h-4 w-4" />
                    </ToxicButton>
                  </div>

                  <div className="order-1 md:order-2 relative">
                    <div className="absolute inset-0 bg-toxic-neon/5 rounded-2xl blur-xl"></div>
                    <div className="relative bg-black/60 rounded-xl overflow-hidden border border-apocalypse-ash p-1">
                      <div className="aspect-video bg-apocalypse-dark rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image className="w-32 h-32 text-apocalypse-ash/30" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                          <div className="text-xs text-apocalypse-ash/70 font-mono mb-1">DAY 248</div>
                          <div className="text-lg text-toxic-neon font-mono">First Resistance</div>
                        </div>
                        <DrippingSlime position="bottom" dripsCount={3} showIcons={false} toxicGreen={true} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-toxic-neon/5 rounded-2xl blur-xl"></div>
                    <div className="relative bg-black/60 rounded-xl overflow-hidden border border-apocalypse-ash p-1">
                      <div className="aspect-video bg-apocalypse-dark rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image className="w-32 h-32 text-apocalypse-ash/30" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                          <div className="text-xs text-apocalypse-ash/70 font-mono mb-1">DAY 621</div>
                          <div className="text-lg text-toxic-neon font-mono">The New Dawn</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-toxic-neon/20">
                        <Shield className="h-4 w-4 text-toxic-neon" />
                      </div>
                      <h3 className="text-xl font-bold text-toxic-neon font-mono">The Resistance DAO</h3>
                    </div>
                    <p className="text-white/70 mb-4">
                      From the remnants of the old world, we built something new. The Resistance DAO became a beacon in the wasteland - a community united by shared principles: decentralization, transparency, and user sovereignty.
                    </p>
                    <p className="text-white/70 mb-6">
                      Our Resistance Survivor Launchpad isn't just a place to build - it's a manifesto. We validate projects through community consensus, require transparent governance, and ensure value flows back to the ecosystem that nurtures them.
                    </p>
                    <ToxicButton 
                      variant="outline" 
                      size="sm" 
                      className="border-toxic-neon/30 text-toxic-neon hover:bg-toxic-neon/10"
                      onClick={() => navigate('/manifesto')}
                    >
                      Resistance Manifesto <ArrowIcon className="ml-2 h-4 w-4" />
                    </ToxicButton>
                  </div>
                </div>

                <div className="flex justify-center mt-16">
                  <ToxicButton 
                    size="lg"
                    onClick={handleConnectWallet}
                    variant="glowing"
                    className="bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
                  >
                    <Radiation className="w-5 h-5 mr-2 text-toxic-neon" />
                    Join The Resistance
                  </ToxicButton>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-black/40 border border-toxic-neon/20 rounded-xl p-6 relative broken-glass">
              <div className="scanline"></div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-mono text-toxic-neon flex items-center">
                  <Radiation className="h-5 w-5 mr-2" /> Resistance Updates
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-toxic-neon/70">
                    <div className="w-2 h-2 bg-toxic-neon rounded-full animate-pulse" />
                    Emergency Broadcasts
                  </div>
                  <ToxicButton 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.location.reload()}
                    className="text-toxic-neon hover:bg-toxic-dark/20"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </ToxicButton>
                </div>
              </div>
              <div className="space-y-4">
                {isLoadingStats ? (
                  <div className="animate-pulse">Scanning wasteland...</div>
                ) : (
                  stats?.recentActivities.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-toxic-neon/10 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'vote' ? 'bg-toxic-neon' :
                          activity.type === 'create' ? 'bg-toxic-neon/70' : 'bg-toxic-muted'
                        }`} />
                        <span className="text-white/70">
                          {activity.type === 'vote' ? 'New Survivor Pledge' :
                           activity.type === 'create' ? 'Settlement Initiative' :
                           'Resource Goal Reached'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-toxic-neon">
                          {activity.type === 'vote' || activity.type === 'complete' 
                            ? formatCurrency(Number(activity.amount))
                            : `#${activity.proposalId}`}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <ToxicCard className="relative bg-black/70 border-toxic-neon/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-toxic-neon/10">
                    <CircleDollarSign className="w-6 h-6 text-toxic-neon" />
                  </div>
                  <div>
                    <div className="text-toxic-neon/70 text-sm">Community Support</div>
                    <div className="text-2xl font-semibold text-white">
                      {isLoadingStats ? (
                        <span className="animate-pulse">Calculating...</span>
                      ) : (
                        formatCurrency(stats?.totalLockedValue || 0)
                      )}
                    </div>
                  </div>
                </div>
              </ToxicCard>

              <ToxicCard className="relative bg-black/70 border-toxic-neon/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-toxic-neon/10">
                    <Users className="w-6 h-6 text-toxic-neon" />
                  </div>
                  <div>
                    <div className="text-toxic-neon/70 text-sm">Resistance Fighters</div>
                    <div className="text-2xl font-semibold text-white">
                      {isLoadingStats ? (
                        <span className="animate-pulse">Counting...</span>
                      ) : (
                        formatNumber(stats?.totalHolders || 0)
                      )}
                    </div>
                  </div>
                </div>
              </ToxicCard>

              <ToxicCard className="relative bg-black/70 border-toxic-neon/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-toxic-neon/10">
                    <Scale className="w-6 h-6 text-toxic-neon" />
                  </div>
                  <div>
                    <div className="text-toxic-neon/70 text-sm">Established Colonies</div>
                    <div className="text-2xl font-semibold text-white">
                      {isLoadingStats ? (
                        <span className="animate-pulse">Searching...</span>
                      ) : (
                        formatNumber(stats?.activeProposals || 0)
                      )}
                    </div>
                  </div>
                </div>
              </ToxicCard>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
