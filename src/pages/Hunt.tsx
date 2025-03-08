
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, Biohazard, Radiation, Shield, Users, 
  Flask, Skull, Building2, Crosshair, HeartPulse, 
  BriefcaseBusiness, ChevronRight
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
  
  // Mock data for settlements
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

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-10 z-0"></div>
      <div className="fog-overlay"></div>
      <div className="dust-particles"></div>
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-toxic-neon/20 to-toxic-neon/20 blur-xl"></div>
              <Target className="w-16 h-16 mx-auto text-toxic-neon relative" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-toxic-neon via-toxic-neon/80 to-toxic-neon">
              Wasteland Hunter
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Track settlements, find medics, and secure jobs in the post-apocalyptic wasteland
            </p>
            
            {/* Navigation Tabs */}
            <div className="flex justify-center mt-8 mb-2 gap-2 flex-wrap">
              <ToxicButton 
                variant={activeTab === 'settlements' ? 'glowing' : 'outline'} 
                onClick={() => setActiveTab('settlements')}
                className="group"
              >
                <Building2 className="h-4 w-4 mr-1 group-hover:animate-pulse" />
                Settlements
              </ToxicButton>
              <ToxicButton 
                variant={activeTab === 'medics' ? 'glowing' : 'outline'} 
                onClick={() => setActiveTab('medics')}
                className="group"
              >
                <HeartPulse className="h-4 w-4 mr-1 group-hover:animate-pulse" />
                Medics & Healers
              </ToxicButton>
              <ToxicButton 
                variant={activeTab === 'jobs' ? 'glowing' : 'outline'} 
                onClick={() => setActiveTab('jobs')}
                className="group"
              >
                <BriefcaseBusiness className="h-4 w-4 mr-1 group-hover:animate-pulse" />
                Job Opportunities
              </ToxicButton>
            </div>
          </motion.div>
          
          {/* Dripping effect at the bottom of hero section */}
          <div className="relative">
            <DrippingSlime 
              position="bottom" 
              dripsCount={10} 
              toxicGreen={true}
            />
          </div>
        </div>
      </section>
      
      {/* Content Sections */}
      <div className="container mx-auto px-4 pb-20 relative z-10 max-w-6xl">
        {/* Settlements Section */}
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
              title="Active Settlements"
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
        
        {/* Medics & Healers Section */}
        {activeTab === 'medics' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-mono text-toxic-neon flex items-center toxic-glow">
                <HeartPulse className="h-5 w-5 mr-2" /> Medics & Healers
              </h2>
            </div>
            
            <div className="text-center py-12 bg-toxic-dark/20 rounded-lg border border-toxic-neon/20 relative overflow-hidden">
              <DrippingSlime position="top" dripsCount={4} toxicGreen={true} />
              <HeartPulse className="h-12 w-12 mx-auto mb-4 text-toxic-neon/40" />
              <h3 className="text-xl text-toxic-neon mb-2">Medics & Healers Coming Soon</h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Recruit specialized medical personnel to improve survival rates in your settlements. 
                Different tiers of healers provide various benefits to your community.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 max-w-4xl mx-auto mt-8">
                {/* Tier 1 - Field Medic */}
                <div className="bg-black/60 border border-toxic-neon/20 rounded-lg p-4 relative">
                  <ToxicBadge variant="status" className="absolute top-2 right-2">
                    Tier 1
                  </ToxicBadge>
                  <HeartPulse className="h-8 w-8 mx-auto mb-2 text-toxic-neon/30" />
                  <h4 className="text-toxic-neon mb-1">Field Medic</h4>
                  <p className="text-white/60 text-sm">Basic medical support for minor injuries</p>
                  <ToxicProgress variant="radiation" value={25} className="h-1 mt-4" />
                </div>
                
                {/* Tier 2 - Radiation Specialist */}
                <div className="bg-black/60 border border-toxic-neon/20 rounded-lg p-4 relative">
                  <ToxicBadge variant="status" className="absolute top-2 right-2">
                    Tier 2
                  </ToxicBadge>
                  <Radiation className="h-8 w-8 mx-auto mb-2 text-toxic-neon/40" />
                  <h4 className="text-toxic-neon mb-1">Radiation Specialist</h4>
                  <p className="text-white/60 text-sm">Treats radiation sickness and provides immunity</p>
                  <ToxicProgress variant="radiation" value={50} className="h-1 mt-4" />
                </div>
                
                {/* Tier 3 - Wasteland Surgeon */}
                <div className="bg-black/60 border border-toxic-neon/20 rounded-lg p-4 relative">
                  <ToxicBadge variant="status" className="absolute top-2 right-2">
                    Tier 3
                  </ToxicBadge>
                  <Flask className="h-8 w-8 mx-auto mb-2 text-toxic-neon/50" />
                  <h4 className="text-toxic-neon mb-1">Wasteland Surgeon</h4>
                  <p className="text-white/60 text-sm">Advanced medical procedures and treatments</p>
                  <ToxicProgress variant="radiation" value={75} className="h-1 mt-4" />
                </div>
                
                {/* Tier 4 - Genetic Healer */}
                <div className="bg-black/60 border border-toxic-neon/20 rounded-lg p-4 relative">
                  <ToxicBadge variant="status" className="absolute top-2 right-2">
                    Tier 4
                  </ToxicBadge>
                  <Biohazard className="h-8 w-8 mx-auto mb-2 text-toxic-neon/60" />
                  <h4 className="text-toxic-neon mb-1">Genetic Healer</h4>
                  <p className="text-white/60 text-sm">Genetic modification and advanced healing</p>
                  <ToxicProgress variant="radiation" value={100} className="h-1 mt-4" />
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <ToxicButton variant="outline" className="opacity-70 cursor-not-allowed">
                  Coming Soon
                </ToxicButton>
              </div>
            </div>
          </motion.section>
        )}
        
        {/* Job Opportunities Section */}
        {activeTab === 'jobs' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-mono text-toxic-neon flex items-center toxic-glow">
                <BriefcaseBusiness className="h-5 w-5 mr-2" /> Job Opportunities
              </h2>
            </div>
            
            <div className="text-center py-12 bg-toxic-dark/20 rounded-lg border border-toxic-neon/20 relative overflow-hidden">
              <DrippingSlime position="top" dripsCount={5} toxicGreen={true} />
              <BriefcaseBusiness className="h-12 w-12 mx-auto mb-4 text-toxic-neon/40" />
              <h3 className="text-xl text-toxic-neon mb-2">Job Opportunities Coming Soon</h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Find specialized work in the wasteland or post job openings for your settlement.
                Each position comes with unique risks and rewards.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-4xl mx-auto mt-8">
                {/* Scout Position */}
                <div className="bg-black/60 border border-toxic-neon/20 rounded-lg p-4 relative">
                  <ToxicBadge variant="danger" className="absolute top-2 right-2">
                    <Radiation className="h-3 w-3 mr-1" /> High Risk
                  </ToxicBadge>
                  <Target className="h-10 w-10 mx-auto mb-2 text-toxic-neon/30" />
                  <h4 className="text-toxic-neon mb-1">Wasteland Scout</h4>
                  <p className="text-white/60 text-sm mb-3">Explore uncharted territories for valuable resources</p>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Radiation Exposure:</span>
                    <span className="text-red-400">Extreme</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Reward Potential:</span>
                    <span className="text-toxic-neon">Very High</span>
                  </div>
                </div>
                
                {/* Security Position */}
                <div className="bg-black/60 border border-toxic-neon/20 rounded-lg p-4 relative">
                  <ToxicBadge variant="secondary" className="absolute top-2 right-2">
                    <Radiation className="h-3 w-3 mr-1" /> Medium Risk
                  </ToxicBadge>
                  <Shield className="h-10 w-10 mx-auto mb-2 text-toxic-neon/30" />
                  <h4 className="text-toxic-neon mb-1">Settlement Security</h4>
                  <p className="text-white/60 text-sm mb-3">Protect settlements from raiders and wasteland threats</p>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Radiation Exposure:</span>
                    <span className="text-yellow-400">Moderate</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Reward Potential:</span>
                    <span className="text-toxic-neon">High</span>
                  </div>
                </div>
                
                {/* Engineer Position */}
                <div className="bg-black/60 border border-toxic-neon/20 rounded-lg p-4 relative">
                  <ToxicBadge variant="default" className="absolute top-2 right-2">
                    <Radiation className="h-3 w-3 mr-1" /> Low Risk
                  </ToxicBadge>
                  <Flask className="h-10 w-10 mx-auto mb-2 text-toxic-neon/30" />
                  <h4 className="text-toxic-neon mb-1">Water Engineer</h4>
                  <p className="text-white/60 text-sm mb-3">Build and maintain water purification systems</p>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Radiation Exposure:</span>
                    <span className="text-toxic-neon">Minimal</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Reward Potential:</span>
                    <span className="text-toxic-neon">Steady</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <ToxicButton variant="outline" className="opacity-70 cursor-not-allowed">
                  Coming Soon
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
