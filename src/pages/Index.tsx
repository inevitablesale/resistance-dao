import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Target, Radiation, FileText, Map } from "lucide-react";
import { TerminalMonitor } from "@/components/ui/terminal-monitor";
import { ToxicButton } from "@/components/ui/toxic-button";
import { DrippingSlime } from "@/components/ui/dripping-slime";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { EmergencyTransmission } from "@/components/ui/emergency-transmission";
import { PreBootTerminal } from "@/components/ui/pre-boot-terminal";
import { SystemBreachTransition } from "@/components/ui/system-breach-transition";
import { NFTShowcase } from "@/components/ui/nft-showcase";
import { HistoricalRecords } from "@/components/ui/historical-records";
import { NetworkStats } from "@/components/ui/network-stats";
import { EmergencyTicker } from "@/components/ui/emergency-ticker";
import { SurvivorNotifications } from "@/components/ui/survivor-notifications";
import { BountyBoard } from "@/components/ui/bounty-board";
import { TerminalMini } from "@/components/ui/terminal-mini";
import { SettlementMap } from "@/components/ui/settlement-map";
import { PostAuthLayout } from "@/components/ui/post-auth-layout";
import { TerminalTypewriter } from "@/components/ui/terminal-typewriter";
import { ProgressIndicator } from "@/components/ui/progress-indicator";

type AuthStage = "pre-boot" | "authenticating" | "breach-transition" | "post-breach" | "authenticated";

type AppStage = "typing" | "desktop-environment" | "nft-selection" | "questionnaire" | "completed";

const Index = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<"bounty-hunter" | "survivor" | null>(null);
  const [communityActivity, setCommunityActivity] = useState(0);
  const [terminalStage, setTerminalStage] = useState<AppStage>("typing");
  const [showEmergencyTransmission, setShowEmergencyTransmission] = useState(false);
  const [authStage, setAuthStage] = useState<AuthStage>("pre-boot");
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  const [showDesktopEnvironment, setShowDesktopEnvironment] = useState(false);
  const [initialAppOpened, setInitialAppOpened] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCommunityActivity(Math.floor(Math.random() * 100));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (authStage === "post-breach" && terminalStage === "desktop-environment" && !initialAppOpened) {
      console.log("Auto-opening Network Status app");
      setTimeout(() => {
        setInitialAppOpened(true);
      }, 1500);
    }
  }, [authStage, terminalStage, initialAppOpened]);
  
  const handleRoleSelect = (role: "bounty-hunter" | "survivor") => {
    console.log("Role selected in Index component:", role);
    setUserRole(role);
    setTerminalStage("completed");
    setAuthStage("authenticated");
    
    toast.success(`${role === "bounty-hunter" ? "Bounty Hunter" : "Survivor"} role activated`, {
      description: `Your wasteland profile has been configured for ${role === "bounty-hunter" ? "tracking down crypto criminals" : "rebuilding communities"}`,
      duration: 4000,
    });
  };
  
  const handleTerminalComplete = () => {
    console.log("Typing animation complete, showing desktop environment");
    setTerminalStage("desktop-environment");
    setShowDesktopEnvironment(true);
  };

  const handleDesktopExplored = () => {
    console.log("Desktop exploration complete, proceeding to NFT selection");
    setTerminalStage("nft-selection");
  };

  const handleCloseEmergencyTransmission = () => {
    setShowEmergencyTransmission(false);
  };

  const handleShowEmergencyTransmission = () => {
    setShowEmergencyTransmission(true);
  };

  const handleAuthenticated = () => {
    setAuthStage("authenticating");
    
    setTimeout(() => {
      setAuthStage("breach-transition");
      
      setTimeout(() => {
        setAuthStage("post-breach");
        
        setTimeout(() => {
          setTerminalStage("typing");
        }, 2500);
      }, 2500);
    }, 500);
  };

  const renderLeftSidebar = () => (
    <>
      <TerminalMini 
        minimized={terminalMinimized}
        onToggleMinimize={() => setTerminalMinimized(!terminalMinimized)}
      />
      <NetworkStats />
      <SettlementMap />
    </>
  );
  
  const renderRightSidebar = () => (
    <>
      <SurvivorNotifications />
      <BountyBoard />
    </>
  );

  const renderPreAuthContent = () => null;

  const renderTypewriterContent = () => (
    <div className="w-full px-4 py-6">
      <TerminalTypewriter 
        showBootSequence={false}
        onTypingComplete={handleTerminalComplete}
      />
    </div>
  );

  const renderDesktopEnvironment = () => (
    <div className="w-full px-4 py-6">
      <TerminalMonitor
        skipBootSequence={true}
        initialAppOpened={initialAppOpened}
        onDesktopExplored={handleDesktopExplored}
      />
    </div>
  );

  const renderNFTContent = () => (
    <NFTShowcase 
      onRoleSelect={handleRoleSelect}
      selectedRole={userRole}
    />
  );

  const renderMainContent = () => {
    if (authStage === "authenticated" || authStage === "post-breach") {
      if (terminalStage === "nft-selection") {
        console.log("Showing NFT selection content");
        return renderNFTContent();
      } else if (terminalStage === "desktop-environment") {
        console.log("Showing desktop environment");
        return renderDesktopEnvironment();
      } else if (terminalStage === "typing") {
        return renderTypewriterContent();
      }
    } else if (authStage === "pre-boot" || authStage === "authenticating" || authStage === "breach-transition") {
      return renderPreAuthContent();
    }
    
    return null;
  };

  const journalStages = [
    { 
      id: "boot", 
      label: "System Access Established", 
      completed: authStage !== "pre-boot" 
    },
    { 
      id: "breach", 
      label: "Network Security Bypassed", 
      completed: authStage === "post-breach" || authStage === "authenticated" 
    },
    { 
      id: "desktop", 
      label: "Resistance Interface Connected", 
      completed: terminalStage !== "typing" && (authStage === "post-breach" || authStage === "authenticated") 
    },
    { 
      id: "role", 
      label: "Survivor Identity Confirmed", 
      completed: userRole !== null 
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative post-apocalyptic-bg">
      <DrippingSlime position="top" dripsCount={15} showIcons={false} toxicGreen={true} />
      <div className="dust-particles"></div>
      <div className="fog-overlay"></div>

      {(authStage === "authenticated" || authStage === "post-breach") && (
        <EmergencyTransmission 
          isOpen={showEmergencyTransmission} 
          onClose={handleCloseEmergencyTransmission} 
        />
      )}

      <div className="fixed top-4 right-4 z-50">
        <ProgressIndicator stages={journalStages} />
      </div>

      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -top-48 -left-24" />
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -bottom-48 -right-24" />
        </div>
        
        <AnimatePresence mode="wait">
          {authStage === "breach-transition" && (
            <SystemBreachTransition />
          )}
        </AnimatePresence>
        
        <div className={`container px-4 relative w-full mx-auto h-full py-10 transition-all duration-500 ${(authStage === "authenticated" || authStage === "post-breach") ? "max-w-[95%]" : "max-w-5xl"}`}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            {(authStage === "authenticated" || authStage === "post-breach") && (
              <div className="text-center mb-4 flex justify-between items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-neon/10 border border-toxic-neon/20 text-toxic-neon text-sm font-mono broken-glass">
                  <span className="w-2 h-2 bg-apocalypse-red rounded-full animate-pulse flash-critical" />
                  <Radiation className="h-4 w-4 mr-1 toxic-glow" /> Network Status: <span className="text-apocalypse-red font-bold status-critical">Critical</span>
                </div>
                
                <div className="flex space-x-2">
                  <ToxicButton 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleShowEmergencyTransmission}
                    className="animate-pulse-subtle hover:animate-none"
                  >
                    <Radiation className="w-4 h-4 mr-2" />
                    Emergency Transmission
                  </ToxicButton>
                  
                  <ToxicButton variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Journal Entries
                  </ToxicButton>
                </div>
              </div>
            )}

            <Card className={`w-full bg-black/80 border-toxic-neon/30 p-0 relative overflow-hidden transition-all duration-500 ${(authStage === "authenticated" || authStage === "post-breach") ? "min-h-[80vh]" : "min-h-[50vh]"}`}>
              <div className="absolute inset-0 z-0 rust-overlay broken-glass">
                <div className="scanline absolute inset-0"></div>
              </div>
              
              <div className="relative z-10 p-6 md:p-8">
                {(authStage === "authenticated" || authStage === "post-breach") && (
                  <div className="flex items-center justify-between mb-4 border-b border-toxic-neon/20 pb-2">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-toxic-neon" />
                      <span className="text-toxic-neon font-mono text-lg">WASTELAND_JOURNAL</span>
                    </div>
                    
                    <div className="flex gap-1">
                      <div className="h-3 w-3 rounded-full bg-apocalypse-red animate-pulse"></div>
                      <div className="h-3 w-3 rounded-full bg-toxic-neon/70"></div>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  {authStage === "pre-boot" && (
                    <PreBootTerminal onAuthenticated={handleAuthenticated} />
                  )}
                  
                  {(authStage === "authenticated" || authStage === "post-breach") ? (
                    <PostAuthLayout
                      leftSidebar={renderLeftSidebar()}
                      mainContent={renderMainContent()}
                      rightSidebar={renderRightSidebar()}
                    />
                  ) : (
                    renderMainContent()
                  )}
                </div>
                
                {(

