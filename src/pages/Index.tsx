
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
  Shield,
  Biohazard, 
  Radiation, 
  ExternalLink,
  Info
} from "lucide-react";
import { ToxicButton } from "@/components/ui/toxic-button";
import { ToxicCard } from "@/components/ui/toxic-card";
import { ToxicProgress } from "@/components/ui/toxic-progress";
import { ToxicBadge } from "@/components/ui/toxic-badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type AuthState = "unauthenticated" | "authenticating" | "breaching" | "authenticated";

const Index = () => {
  const navigate = useNavigate();
  const { isConnected } = useCustomWallet();
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

  // OpenSea collection URL
  const openSeaUrl = "https://opensea.io/collection/resistance-collection";

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <RadiationSystem 
              currentRadiation={currentRadiation} 
              totalNFTsClaimed={totalHolders} 
              className="mb-6"
            />
            <ReferralSystem
              earnings={0}
              totalReferrals={0}
            />
          </div>
          <div className="md:col-span-2">
            <NFTDistributionStatus className="mb-6" />
            
            <ToxicCard className="bg-black/80 border-toxic-neon/30 p-5 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-toxic-neon/10">
                  <Shield className="h-6 w-6 text-toxic-neon" />
                </div>
                <div>
                  <h2 className="text-xl font-mono text-toxic-neon">Resistance Collection NFTs</h2>
                  <p className="text-white/60 text-sm">19 Unique NFTs - Each Reducing Global Radiation</p>
                </div>
              </div>
              
              <p className="text-white/70 mb-4">
                Each unique holder of a Resistance Collection NFT helps reduce the global radiation level by 0.1%. 
                As radiation decreases, new features of the wasteland economy will unlock.
              </p>
              
              <div className="bg-black/40 rounded-lg p-3 mb-4 border border-toxic-neon/20">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Total Supply</span>
                  <span className="text-toxic-neon font-mono">19 NFTs</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Current Unique Holders</span>
                  <span className="text-toxic-neon font-mono">{totalHolders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Radiation Reduction</span>
                  <span className="text-toxic-neon font-mono">-{radiationReduction.toFixed(1)}%</span>
                </div>
              </div>
              
              {nextFeatureUnlock && (
                <div className="bg-black/50 border border-amber-500/30 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <h4 className="text-amber-400 font-mono">Next Feature Unlock</h4>
                  </div>
                  <p className="text-white/70 text-sm mb-2">
                    {nextFeatureUnlock.name}: {nextFeatureUnlock.description}
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">Required Radiation Level</span>
                    <span className="text-amber-400 font-mono">{nextFeatureUnlock.radiationLevel}%</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex justify-between text-xs mt-1 cursor-help">
                          <span className="text-white/50">More Holders Needed</span>
                          <span className="text-amber-400 font-mono">
                            ~{Math.ceil((currentRadiation - nextFeatureUnlock.radiationLevel) / 0.1)} holders
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-[200px]">
                          Each unique holder reduces radiation by 0.1%. Currently at {currentRadiation}%, need to reach {nextFeatureUnlock.radiationLevel}%.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              
              <ToxicButton 
                variant="default" 
                className="w-full"
                onClick={() => window.open(openSeaUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Collection on OpenSea
              </ToxicButton>
            </ToxicCard>
          </div>
        </div>

        <div className="mb-8">
          <NFTCollectionDisplay 
            currentRadiation={currentRadiation} 
          />
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
