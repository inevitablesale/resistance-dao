
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Target, Radiation } from "lucide-react";
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

// Define the authentication states
type AuthStage = "pre-boot" | "authenticating" | "breach-transition" | "post-breach" | "authenticated";

// Define the application stages
type AppStage = "typing" | "nft-selection" | "questionnaire" | "completed";

const Index = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<"bounty-hunter" | "survivor" | null>(null);
  const [communityActivity, setCommunityActivity] = useState(0);
  const [terminalStage, setTerminalStage] = useState<AppStage>("typing");
  const [showEmergencyTransmission, setShowEmergencyTransmission] = useState(false);
  const [authStage, setAuthStage] = useState<AuthStage>("pre-boot");
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  
  // Community activity simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCommunityActivity(Math.floor(Math.random() * 100));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleRoleSelect = (role: "bounty-hunter" | "survivor") => {
    console.log("Role selected in Index component:", role);
    setUserRole(role);
    setTerminalStage("completed");
    
    toast.success(`${role === "bounty-hunter" ? "Bounty Hunter" : "Survivor"} role activated`, {
      description: `Your wasteland profile has been configured for ${role === "bounty-hunter" ? "tracking down crypto criminals" : "rebuilding communities"}`,
      duration: 4000,
    });
  };
  
  const handleTerminalComplete = () => {
    console.log("Typing animation complete, showing NFT selection");
    setTerminalStage("nft-selection");
  };

  const handleCloseEmergencyTransmission = () => {
    setShowEmergencyTransmission(false);
  };

  const handleShowEmergencyTransmission = () => {
    setShowEmergencyTransmission(true);
  };

  // Function to handle authentication completion
  const handleAuthenticated = () => {
    setAuthStage("authenticating");
    
    setTimeout(() => {
      setAuthStage("breach-transition");
      
      setTimeout(() => {
        setAuthStage("post-breach");
        
        // Typing animation will now happen in the post-breach stage
      }, 2500);
    }, 500);
  };

  // Prepare sidebar content for authenticated state
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

  // Render pre-authentication content
  const renderPreAuthContent = () => null; // Hide all pre-auth content

  // Render terminal typewriter content
  const renderTypewriterContent = () => (
    <div className="w-full px-4 py-6">
      <TerminalTypewriter 
        showBootSequence={false}
        onTypingComplete={handleTerminalComplete}
      />
    </div>
  );

  // Main content with NFT showcase
  const renderNFTContent = () => (
    <NFTShowcase 
      onRoleSelect={handleRoleSelect}
      selectedRole={userRole}
    />
  );

  // Determine what content to show based on the stages
  const renderMainContent = () => {
    if (authStage === "authenticated") {
      // If authenticated, show different content based on terminal stage
      if (terminalStage === "nft-selection") {
        return renderNFTContent();
      } else if (terminalStage === "typing") {
        // Show terminal typewriter in the authenticated state
        return renderTypewriterContent();
      }
    } else if (authStage === "post-breach") {
      // Always show terminal typewriter after breach
      return renderTypewriterContent();
    } else if (authStage === "pre-boot" || authStage === "authenticating" || authStage === "breach-transition") {
      // Pre-authentication shows nothing
      return renderPreAuthContent();
    }
    
    // Default fallback (should not reach here)
    return null;
  };

  return (
    <div className="min-h-screen bg-black text-white relative post-apocalyptic-bg">
      <DrippingSlime position="top" dripsCount={15} showIcons={false} toxicGreen={true} />
      <div className="dust-particles"></div>
      <div className="fog-overlay"></div>

      {/* Emergency Transmission Popup - only show when authenticated */}
      {(authStage === "authenticated" || authStage === "post-breach") && (
        <EmergencyTransmission 
          isOpen={showEmergencyTransmission} 
          onClose={handleCloseEmergencyTransmission} 
        />
      )}

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
            {/* Only show header elements if post-breach or authenticated */}
            {(authStage === "authenticated" || authStage === "post-breach") && (
              <div className="text-center mb-4 flex justify-between items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-neon/10 border border-toxic-neon/20 text-toxic-neon text-sm font-mono broken-glass">
                  <span className="w-2 h-2 bg-apocalypse-red rounded-full animate-pulse flash-critical" />
                  <Radiation className="h-4 w-4 mr-1 toxic-glow" /> Network Status: <span className="text-apocalypse-red font-bold status-critical">Critical</span>
                </div>
                
                <div className="flex space-x-2">
                  <ToxicButton variant="ghost" size="sm" onClick={handleShowEmergencyTransmission}>
                    <Radiation className="w-4 h-4 mr-2" />
                    Emergency Transmission
                  </ToxicButton>
                  
                  <ToxicButton variant="outline" size="sm">
                    <Shield className="w-4 h-4 mr-2" />
                    System Status
                  </ToxicButton>
                </div>
              </div>
            )}

            <Card className={`w-full bg-black/80 border-toxic-neon/30 p-0 relative overflow-hidden transition-all duration-500 ${(authStage === "authenticated" || authStage === "post-breach") ? "min-h-[80vh]" : "min-h-[50vh]"}`}>
              <div className="absolute inset-0 z-0 rust-overlay broken-glass">
                <div className="scanline absolute inset-0"></div>
              </div>
              
              <div className="relative z-10 p-6 md:p-8">
                {/* Only show this header if post-breach or authenticated */}
                {(authStage === "authenticated" || authStage === "post-breach") && (
                  <div className="flex items-center justify-between mb-4 border-b border-toxic-neon/20 pb-2">
                    <div className="flex items-center">
                      <Radiation className="h-5 w-5 mr-2 text-toxic-neon" />
                      <span className="text-toxic-neon font-mono text-lg">RESISTANCE_NETWORK</span>
                    </div>
                    
                    <div className="flex gap-1">
                      <div className="h-3 w-3 rounded-full bg-apocalypse-red animate-pulse"></div>
                      <div className="h-3 w-3 rounded-full bg-toxic-neon/70"></div>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  {/* Conditional rendering based on authentication state */}
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
                
                {/* Only show this if the user is in post-breach stage or typing terminal stage */}
                {(authStage === "post-breach" || (authStage === "authenticated" && terminalStage === "typing")) && (
                  <div className="mt-4 text-center">
                    <p className="text-white/70 text-sm mb-3">
                      Complete the terminal sequence to access the Resistance Network
                    </p>
                    <ToxicButton 
                      onClick={handleTerminalComplete}
                      variant="ghost"
                      size="sm"
                    >
                      <Radiation className="w-4 h-4 mr-2" />
                      Skip Intro Sequence
                    </ToxicButton>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
