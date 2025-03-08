
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, Biohazard, Radiation, Shield, Users, 
  FlaskConical, Skull, Building2, Crosshair, HeartPulse, 
  BriefcaseBusiness, ChevronRight, Map, Flame, 
  BarChart3, TrendingUp, Eye, Flag, Compass
} from 'lucide-react';
import { DrippingSlime, ToxicPuddle } from '@/components/ui/dripping-slime';
import { ToxicCard, ToxicCardHeader, ToxicCardTitle, ToxicCardContent } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { SettlementsGrid } from '@/components/settlements/SettlementsGrid';
import { useProposal } from '@/hooks/useProposal';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { ResistanceWalletWidget } from '@/components/wallet/ResistanceWalletWidget';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { ProposalEvent } from '@/types/proposals';

const Hunt = () => {
  const navigate = useNavigate();
  const { isConnected, connect } = useWalletConnection();
  const [activeTab, setActiveTab] = useState('settlements');
  
  const mockSettlements: ProposalEvent[] = [
    {
      tokenId: "1",
      creator: "0x123...",
      blockNumber: 123456,
      transactionHash: "0xabc...",
      isLoading: false,
      metadata: {
        title: "Wasteland Outpost Alpha",
        description: "A fortified settlement on the edge of the toxic zone",
        investment: {
          targetCapital: "50000",
          description: "Resources for expansion and defense"
        },
        votingDuration: 604800,
        linkedInURL: ""
      },
      pledgedAmount: "25000"
    },
    {
      tokenId: "2",
      creator: "0x456...",
      blockNumber: 123457,
      transactionHash: "0xdef...",
      isLoading: false,
      metadata: {
        title: "Green Haven Refuge",
        description: "An agricultural settlement with radiation-resistant crops",
        investment: {
          targetCapital: "40000",
          description: "Advanced farming technology and security"
        },
        votingDuration: 604800,
        linkedInURL: ""
      },
      pledgedAmount: "32000"
    },
    {
      tokenId: "3",
      creator: "0x789...",
      blockNumber: 123458,
      transactionHash: "0xghi...",
      isLoading: false,
      metadata: {
        title: "Radiation Springs",
        description: "Trading hub with access to clean water sources",
        investment: {
          targetCapital: "60000",
          description: "Water purification systems and market expansion"
        },
        votingDuration: 604800,
        linkedInURL: ""
      },
      pledgedAmount: "15000"
    }
  ];

  const formatUSDAmount = (amount: string) => {
    return `${amount} RD`;
  };

  // Command center metrics
  const commandMetrics = [
    { 
      label: "Network Strength", 
      value: "68%", 
      icon: <TrendingUp className="h-5 w-5 text-toxic-neon" />,
      description: "Combined influence of all settlements",
      progress: 68
    },
    { 
      label: "Territory Control", 
      value: "3/12", 
      icon: <Flag className="h-5 w-5 text-toxic-neon" />,
      description: "Regions under resistance control",
      progress: 25
    },
    { 
      label: "Resource Index", 
      value: "42,750 RD", 
      icon: <BarChart3 className="h-5 w-5 text-toxic-neon" />,
      description: "Total resources allocated to settlements",
      progress: 42
    },
    { 
      label: "Survival Rate", 
      value: "83%", 
      icon: <HeartPulse className="h-5 w-5 text-toxic-neon" />,
      description: "Population survival probability",
      progress: 83
    }
  ];

  // Bounty hunter ranks for network tab
  const hunterRanks = [
    {
      rank: "Scout",
      abilities: ["Territory Mapping", "Resource Location"],
      riskLevel: "Low",
      rewardPotential: "Moderate",
      requiredExperience: "None",
      icon: <Eye className="h-10 w-10 text-toxic-neon/30" />
    },
    {
      rank: "Stalker",
      abilities: ["Advanced Recon", "Threat Assessment"],
      riskLevel: "Medium",
      rewardPotential: "High",
      requiredExperience: "5 missions",
      icon: <Compass className="h-10 w-10 text-toxic-neon/40" />
    },
    {
      rank: "Apex",
      abilities: ["Territory Control", "Resource Defense"],
      riskLevel: "High",
      rewardPotential: "Very High",
      requiredExperience: "15 missions",
      icon: <Shield className="h-10 w-10 text-toxic-neon/50" />
    },
    {
      rank: "Legend",
      abilities: ["Settlement Foundation", "Network Leadership"],
      riskLevel: "Extreme",
      rewardPotential: "Maximum",
      requiredExperience: "30 missions",
      icon: <Target className="h-10 w-10 text-toxic-neon/60" />
    }
  ];

  // Strategic operations for operations tab
  const operations = [
    {
      name: "Resource Extraction",
      description: "Secure vital resources from hazardous zones",
      duration: "24-48 hours",
      risk: "High",
      reward: "Resource Cache",
      status: "Available",
      icon: <FlaskConical className="h-10 w-10 text-toxic-neon/40" />
    },
    {
      name: "Territory Expansion",
      description: "Establish forward outposts to expand settlement reach",
      duration: "72 hours",
      risk: "Medium",
      reward: "Increased Influence",
      status: "Available",
      icon: <Map className="h-10 w-10 text-toxic-neon/40" />
    },
    {
      name: "Raider Suppression",
      description: "Eliminate hostile threats to settlement security",
      duration: "12 hours",
      risk: "Extreme",
      reward: "Enhanced Security",
      status: "Requires Scout Rank",
      icon: <Crosshair className="h-10 w-10 text-toxic-neon/40" />
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-10 z-0"></div>
      <div className="fog-overlay"></div>
      <div className="dust-particles"></div>
      
      {/* Wasteland atmospheric effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/70 z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNzUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 z-0 animate-pulse"></div>
      
      {/* Header Section - Command Center */}
      <section className="relative pt-20 pb-6 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-toxic-neon/20 to-toxic-neon/20 blur-xl"></div>
              <Target className="w-16 h-16 mx-auto text-toxic-neon relative" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-toxic-neon via-toxic-neon/80 to-toxic-neon">
              Bounty Hunter Command
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-6">
              Deploy scouts, control territory, and establish settlement networks in the wasteland
            </p>
            
            {/* Command Center Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 mb-6">
              {commandMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.1 * index }
                  }}
                  className="bg-black/60 border border-toxic-neon/20 rounded-lg p-4 relative overflow-hidden group hover:border-toxic-neon/40 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-toxic-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-toxic-neon font-mono text-sm">{metric.label}</h3>
                    {metric.icon}
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
                  <p className="text-xs text-white/60">{metric.description}</p>
                  <ToxicProgress variant="radiation" value={metric.progress} className="h-1 mt-2" />
                </motion.div>
              ))}
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex justify-center mt-8 mb-2 gap-2 flex-wrap">
              <ToxicButton 
                variant={activeTab === 'settlements' ? 'glowing' : 'outline'} 
                onClick={() => setActiveTab('settlements')}
                className="group"
              >
                <Building2 className="h-4 w-4 mr-1 group-hover:animate-pulse" />
                Settlement Opportunities
              </ToxicButton>
              <ToxicButton 
                variant={activeTab === 'network' ? 'glowing' : 'outline'} 
                onClick={() => setActiveTab('network')}
                className="group"
              >
                <Users className="h-4 w-4 mr-1 group-hover:animate-pulse" />
                Network Expansion
              </ToxicButton>
              <ToxicButton 
                variant={activeTab === 'operations' ? 'glowing' : 'outline'} 
                onClick={() => setActiveTab('operations')}
                className="group"
              >
                <Crosshair className="h-4 w-4 mr-1 group-hover:animate-pulse" />
                Strategic Operations
              </ToxicButton>
            </div>
          </motion.div>
          
          <div className="relative">
            <DrippingSlime 
              position="bottom" 
              dripsCount={10} 
              toxicGreen={true}
            />
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20 relative z-10 max-w-6xl">
        {/* Settlements Tab */}
        {activeTab === 'settlements' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <SettlementsGrid 
              settlements={mockSettlements}
              isLoading={false}
              formatUSDAmount={formatUSDAmount}
              title="Active Settlement Outposts"
              className="mb-12"
            />
            
            <div className="flex justify-center mt-12">
              <ToxicButton 
                variant="marketplace" 
                onClick={() => navigate('/thesis')}
                className="group"
              >
                <Building2 className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                Establish New Settlement
              </ToxicButton>
            </div>
          </motion.section>
        )}
        
        {/* Network Tab - Bounty Hunter Ranks */}
        {activeTab === 'network' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-mono text-toxic-neon flex items-center toxic-glow">
                <Users className="h-5 w-5 mr-2" /> Bounty Hunter Network
              </h2>
            </div>
            
            <div className="bg-toxic-dark/20 rounded-lg border border-toxic-neon/20 relative overflow-hidden p-6">
              <DrippingSlime position="top" dripsCount={4} toxicGreen={true} />
              
              <div className="text-center mb-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-toxic-neon/40" />
                <h3 className="text-xl text-toxic-neon mb-2">Hunter Rank Progression</h3>
                <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                  Join the wasteland's elite scouts and hunters. Each rank unlocks new abilities and mission opportunities.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {hunterRanks.map((rank, index) => (
                  <motion.div 
                    key={rank.rank}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0.1 * index }
                    }}
                    className="bg-black/60 border border-toxic-neon/20 rounded-lg p-4 relative group hover:border-toxic-neon/40 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-toxic-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <ToxicBadge variant="status" className="absolute top-2 right-2">
                      {rank.rank}
                    </ToxicBadge>
                    
                    <div className="text-center">
                      {rank.icon}
                      <h4 className="text-toxic-neon mb-2 mt-2">{rank.rank} Hunter</h4>
                    </div>
                    
                    <div className="space-y-2 mt-3">
                      <div className="text-xs">
                        <span className="text-white/60 block mb-1">Abilities:</span>
                        <span className="text-toxic-neon/80">{rank.abilities.join(", ")}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div>
                          <span className="text-white/60 block mb-1">Risk Level:</span>
                          <span className="text-toxic-neon/80">{rank.riskLevel}</span>
                        </div>
                        <div>
                          <span className="text-white/60 block mb-1">Reward:</span>
                          <span className="text-toxic-neon/80">{rank.rewardPotential}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs mt-2">
                        <span className="text-white/60 block mb-1">Required Experience:</span>
                        <span className="text-toxic-neon/80">{rank.requiredExperience}</span>
                      </div>
                    </div>
                    
                    <ToxicProgress variant="radiation" value={(index + 1) * 25} className="h-1 mt-4" />
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-center mt-10">
                <ToxicButton variant="glowing" className="group">
                  <Target className="h-4 w-4 mr-2" />
                  Join Hunter Network
                </ToxicButton>
              </div>
            </div>
          </motion.section>
        )}
        
        {/* Operations Tab - Strategic Missions */}
        {activeTab === 'operations' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-mono text-toxic-neon flex items-center toxic-glow">
                <Crosshair className="h-5 w-5 mr-2" /> Strategic Operations
              </h2>
            </div>
            
            <div className="bg-toxic-dark/20 rounded-lg border border-toxic-neon/20 relative overflow-hidden p-6">
              <DrippingSlime position="top" dripsCount={4} toxicGreen={true} />
              
              <div className="text-center mb-8">
                <Crosshair className="h-12 w-12 mx-auto mb-4 text-toxic-neon/40" />
                <h3 className="text-xl text-toxic-neon mb-2">Available Missions</h3>
                <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                  Critical operations that strengthen settlements and expand the resistance network in the wasteland.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {operations.map((op, index) => (
                  <motion.div 
                    key={op.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0.1 * index }
                    }}
                    className="bg-black/60 border border-toxic-neon/20 rounded-lg p-5 relative group hover:border-toxic-neon/40 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-toxic-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <ToxicBadge variant={op.risk === "Extreme" ? "danger" : "status"} className="absolute top-2 right-2">
                      {op.risk === "Extreme" ? (
                        <><Radiation className="h-3 w-3 mr-1" /> {op.risk}</>
                      ) : (
                        op.risk
                      )}
                    </ToxicBadge>
                    
                    <div className="text-center mb-4">
                      {op.icon}
                      <h4 className="text-toxic-neon mb-1 mt-2">{op.name}</h4>
                      <p className="text-white/70 text-sm">{op.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-xs mt-4">
                      <div>
                        <span className="text-white/60 block mb-1">Duration:</span>
                        <span className="text-toxic-neon/80">{op.duration}</span>
                      </div>
                      <div>
                        <span className="text-white/60 block mb-1">Reward:</span>
                        <span className="text-toxic-neon/80">{op.reward}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-white/60 block mb-1">Status:</span>
                        <span className={op.status === "Available" ? "text-toxic-neon/80" : "text-orange-400"}>{op.status}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <ToxicButton 
                        variant={op.status === "Available" ? "outline" : "tertiary"} 
                        className={op.status !== "Available" ? "opacity-70 cursor-not-allowed" : ""}
                        disabled={op.status !== "Available"}
                      >
                        {op.status === "Available" ? (
                          <>Accept Mission</>
                        ) : (
                          <>Rank Required</>
                        )}
                      </ToxicButton>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-center mt-10">
                <ToxicButton variant="marketplace" className="group">
                  <Map className="h-4 w-4 mr-2" />
                  View All Operations
                </ToxicButton>
              </div>
            </div>
          </motion.section>
        )}
      </div>
      
      <ResistanceWalletWidget />
    </div>
  );
};

export default Hunt;
