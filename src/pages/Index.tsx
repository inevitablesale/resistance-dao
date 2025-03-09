
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
import { ArchiveCallToAction } from '@/components/archive/ArchiveCallToAction';
import { ArchiveDashboard } from '@/components/archive/ArchiveDashboard';

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
  }, [isConnected, authState]);
  
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
      className="w-full mx-auto"
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
        
        <ArchiveDashboard 
          currentRadiation={currentRadiation}
          totalHolders={totalHolders}
          featureUnlocks={featureUnlocks}
          nextFeatureUnlock={nextFeatureUnlock}
          narrativeContext={narrativeContext}
          reductionPerHolder={reductionPerHolder}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          <div className="md:col-span-5">
            <ArchiveNFTReveal 
              currentRadiation={currentRadiation}
              totalHolders={totalHolders}
            />
          </div>
          
          <div className="md:col-span-7">
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
