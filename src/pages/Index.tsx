
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { DrippingSlime } from "@/components/ui/dripping-slime";
import { TerminalLogin } from '@/components/terminal/TerminalLogin';
import { BreachSequence } from '@/components/terminal/BreachSequence';
import { StoryTerminal } from '@/components/terminal/StoryTerminal';
import { useRadiationSystem } from '@/hooks/useRadiationSystem';
import { Radiation, Database, Network, Shield } from "lucide-react";
import { ArchiveIntro } from '@/components/archive/ArchiveIntro';
import { ArchiveNFTReveal } from '@/components/archive/ArchiveNFTReveal';
import { ArchiveTimeline } from '@/components/archive/ArchiveTimeline';
import { ArchiveCallToAction } from '@/components/archive/ArchiveCallToAction';

type AuthState = "unauthenticated" | "authenticating" | "breaching" | "authenticated";

const Index = () => {
  const { isConnected } = useCustomWallet();
  const { connect } = useWalletConnection();
  const { 
    currentRadiation, 
    totalHolders, 
    radiationReduction,
    reductionPerHolder, 
    featureUnlocks, 
    nextFeatureUnlock,
    isLoading: isLoadingRadiation,
    status: radiationStatus,
    narrativeContext
  } = useRadiationSystem();
  
  const [authState, setAuthState] = useState<AuthState>("unauthenticated");
  const [showIntro, setShowIntro] = useState(true);
  const [showStoryTerminal, setShowStoryTerminal] = useState(false);
  
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
    setShowIntro(true);
  };

  const handleIntroContinue = () => {
    setShowIntro(false);
    setShowStoryTerminal(true);
  };

  const renderArchiveContent = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      {showIntro && (
        <ArchiveIntro 
          currentRadiation={currentRadiation} 
          narrativeContext={narrativeContext}
          onContinue={handleIntroContinue} 
        />
      )}
      
      <div className="text-left mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-neon/10 border border-toxic-neon/20 text-toxic-neon text-sm mb-4 font-mono broken-glass">
          <span className="w-2 h-2 bg-apocalypse-red rounded-full animate-pulse flash-critical" />
          <Radiation className="h-4 w-4 mr-1 toxic-glow" /> 
          Archive Status: <span className={`${
            currentRadiation > 75 ? "text-apocalypse-red" : 
            currentRadiation > 50 ? "text-amber-400" : 
            "text-toxic-neon"
          } font-bold status-critical`}>
            Radiation Level: {currentRadiation}%
          </span>
        </div>
        
        {showStoryTerminal && (
          <StoryTerminal 
            initiallyOpen={true} 
            onClose={() => setShowStoryTerminal(false)} 
            className="mb-8" 
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          <div className="md:col-span-5">
            <div className="sticky top-24">
              <div className="text-center mb-6">
                <motion.div 
                  className="inline-block p-3 rounded-full bg-black/60 border border-toxic-neon/30 radiation-pulse-circles mb-3"
                  animate={{ scale: [0.98, 1.02, 0.98] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="relative">
                    <Radiation className="h-16 w-16 text-toxic-neon opacity-90" />
                    <div className="absolute inset-0 flex items-center justify-center text-black font-mono text-lg font-bold">
                      {currentRadiation}%
                    </div>
                  </div>
                </motion.div>
                <h1 className="text-xl md:text-2xl font-mono text-toxic-neon mb-1">The Last Archive</h1>
                <p className="text-white/70 text-sm max-w-md mx-auto">
                  Global radiation levels are preventing full access to humanity's knowledge repository. 
                  Each NFT holder reduces interference by 0.1%.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-black/60 border border-toxic-neon/20 rounded-lg p-3 text-center">
                  <Database className="h-5 w-5 text-toxic-neon mx-auto mb-2" />
                  <div className="text-xs text-white/60">Archive Units</div>
                  <div className="text-lg font-mono text-toxic-neon">{totalHolders}/19</div>
                </div>
                <div className="bg-black/60 border border-toxic-neon/20 rounded-lg p-3 text-center">
                  <Network className="h-5 w-5 text-toxic-neon mx-auto mb-2" />
                  <div className="text-xs text-white/60">Reduction</div>
                  <div className="text-lg font-mono text-toxic-neon">-{radiationReduction.toFixed(1)}%</div>
                </div>
                <div className="bg-black/60 border border-toxic-neon/20 rounded-lg p-3 text-center">
                  <Shield className="h-5 w-5 text-toxic-neon mx-auto mb-2" />
                  <div className="text-xs text-white/60">Status</div>
                  <div className="text-lg font-mono text-toxic-neon truncate text-xs md:text-sm">
                    {radiationStatus}
                  </div>
                </div>
              </div>
              
              <ArchiveTimeline 
                currentRadiation={currentRadiation}
                totalHolders={totalHolders}
                reductionPerHolder={reductionPerHolder}
                featureUnlocks={featureUnlocks}
                nextFeatureUnlock={nextFeatureUnlock}
              />
            </div>
          </div>
          
          <div className="md:col-span-7">
            <ArchiveNFTReveal 
              currentRadiation={currentRadiation}
              totalHolders={totalHolders}
            />
            
            <ArchiveCallToAction 
              currentRadiation={currentRadiation}
              totalHolders={totalHolders}
            />
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
            renderArchiveContent()
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default Index;
