
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Target, Radiation } from "lucide-react";
import { TerminalMonitor } from "@/components/ui/terminal-monitor";
import { ToxicButton } from "@/components/ui/toxic-button";
import { DrippingSlime, ToxicPuddle } from "@/components/ui/dripping-slime";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { EmergencyTransmission } from "@/components/ui/emergency-transmission";
import { PreBootTerminal } from "@/components/ui/pre-boot-terminal";
import { SystemBreachTransition } from "@/components/ui/system-breach-transition";
import { NFTShowcase } from "@/components/ui/nft-showcase";

// Define the authentication states
type AuthStage = "pre-boot" | "authenticating" | "authenticated" | "system-breach";

// Define the application stages
type AppStage = "typing" | "nft-selection" | "questionnaire" | "completed";

const Index = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<"bounty-hunter" | "survivor" | null>(null);
  const [communityActivity, setCommunityActivity] = useState(0);
  const [terminalStage, setTerminalStage] = useState<AppStage>("typing");
  const [showEmergencyTransmission, setShowEmergencyTransmission] = useState(false);
  const [authStage, setAuthStage] = useState<AuthStage>("pre-boot");
  const [hoverState, setHoverState] = useState<"bounty-hunter" | "survivor" | null>(null);
  
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
      setAuthStage("system-breach");
      
      setTimeout(() => {
        setAuthStage("authenticated");
        // Important change: Immediately set terminal stage to nft-selection after authentication
        setTerminalStage("nft-selection");
        
        toast.success("Access granted", {
          description: "Welcome to the Resistance Network terminal",
          duration: 3000,
        });
      }, 2500);
    }, 500);
  };

  // Determine what content to show based on the stages
  const renderMainContent = () => {
    if (authStage === "authenticated") {
      // If authenticated but no role selected yet, show NFT showcase
      if (!userRole) {
        return (
          <NFTShowcase 
            onRoleSelect={handleRoleSelect}
            selectedRole={userRole}
          />
        );
      } else {
        // If role is selected, show terminal with completed state
        return (
          <TerminalMonitor
            showQuestionnaire={false}
            onTypingComplete={handleTerminalComplete}
            onRoleSelect={handleRoleSelect}
            selectedRole={userRole}
            className="w-full" 
            skipBootSequence={true}
          />
        );
      }
    } else if (authStage === "pre-boot" || authStage === "authenticating" || authStage === "system-breach") {
      // Authentication flow content
      return null;
    }
    
    // Default fallback
    return (
      <TerminalMonitor
        showQuestionnaire={terminalStage === "questionnaire"}
        onTypingComplete={handleTerminalComplete}
        onRoleSelect={handleRoleSelect}
        selectedRole={userRole}
        className="w-full" 
        skipBootSequence={true}
      />
    );
  };

  // Determine slime color based on user role or hover state
  const getSlimeProps = () => {
    if (userRole === "bounty-hunter" || hoverState === "bounty-hunter") {
      return { toxicGreen: false, postApocalyptic: true };
    } else if (userRole === "survivor" || hoverState === "survivor") {
      return { toxicGreen: true, postApocalyptic: false };
    }
    return { toxicGreen: true, postApocalyptic: false };
  };

  return (
    <div 
      className="min-h-screen bg-black text-white relative post-apocalyptic-bg overflow-hidden"
      onMouseLeave={() => setHoverState(null)}
    >
      {/* Global slime effects */}
      <DrippingSlime 
        position="top" 
        dripsCount={20} 
        showIcons={false} 
        intensity="high"
        zIndex={15}
        {...getSlimeProps()}
      />
      
      <DrippingSlime 
        position="bottom" 
        dripsCount={15} 
        intensity="medium"
        puddleCount={8}
        zIndex={15}
        {...getSlimeProps()}
      />
      
      <DrippingSlime 
        position="left" 
        dripsCount={12} 
        intensity="low"
        zIndex={15}
        {...getSlimeProps()}
      />
      
      <DrippingSlime 
        position="right" 
        dripsCount={12} 
        intensity="low"
        zIndex={15}
        {...getSlimeProps()}
      />
      
      {/* Random puddles throughout the page */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <ToxicPuddle className="absolute left-[15%] top-[20%]" size="small" {...getSlimeProps()} />
        <ToxicPuddle className="absolute left-[85%] top-[40%]" size="medium" {...getSlimeProps()} />
        <ToxicPuddle className="absolute left-[30%] top-[80%]" size="large" {...getSlimeProps()} />
        <ToxicPuddle className="absolute left-[60%] top-[60%]" size="small" {...getSlimeProps()} />
        <ToxicPuddle className="absolute left-[45%] top-[30%]" size="medium" {...getSlimeProps()} />
      </div>

      <div className="dust-particles"></div>
      <div className="fog-overlay"></div>

      {/* Emergency Transmission Popup */}
      <EmergencyTransmission 
        isOpen={showEmergencyTransmission} 
        onClose={handleCloseEmergencyTransmission} 
      />

      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -top-48 -left-24" />
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -bottom-48 -right-24" />
        </div>
        
        <AnimatePresence mode="wait">
          {authStage === "system-breach" && (
            <SystemBreachTransition />
          )}
        </AnimatePresence>
        
        <div 
          className={`container px-4 relative w-full mx-auto h-full py-10 transition-all duration-500 ${authStage === "authenticated" ? "max-w-[95%]" : "max-w-5xl"}`}
          onMouseEnter={() => setHoverState(null)}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            <div className={`text-center mb-4 flex ${authStage === "authenticated" ? "justify-between" : "justify-center"} items-center relative`}>
              {/* Top header slime effect */}
              <DrippingSlime 
                position="top" 
                dripsCount={10} 
                className="absolute inset-x-0 top-0"
                intensity="medium"
                zIndex={20}
                {...getSlimeProps()}
              />
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-neon/10 border border-toxic-neon/20 text-toxic-neon text-sm font-mono broken-glass">
                <span className="w-2 h-2 bg-apocalypse-red rounded-full animate-pulse flash-critical" />
                <Radiation className="h-4 w-4 mr-1 toxic-glow" /> Network Status: <span className="text-apocalypse-red font-bold status-critical">Critical</span>
              </div>
              
              {/* Only show emergency transmission button when authenticated */}
              {authStage === "authenticated" && (
                <div className="flex space-x-2 relative">
                  {/* Button slime effect */}
                  <DrippingSlime 
                    position="top" 
                    dripsCount={5} 
                    className="absolute inset-x-0 -top-1"
                    intensity="low"
                    zIndex={25}
                    {...getSlimeProps()}
                  />
                  
                  <ToxicButton 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleShowEmergencyTransmission}
                    onMouseEnter={() => userRole === "bounty-hunter" ? setHoverState("bounty-hunter") : setHoverState("survivor")}
                  >
                    <Radiation className="w-4 h-4 mr-2" />
                    Emergency Transmission
                  </ToxicButton>
                  
                  <ToxicButton 
                    variant="outline" 
                    size="sm"
                    onMouseEnter={() => userRole === "bounty-hunter" ? setHoverState("bounty-hunter") : setHoverState("survivor")}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    System Status
                  </ToxicButton>
                </div>
              )}
            </div>

            <Card className={`w-full bg-black/80 border-toxic-neon/30 p-0 relative overflow-hidden transition-all duration-500 ${authStage === "authenticated" ? "min-h-[80vh]" : ""}`}>
              {/* Card inner slime effects */}
              <DrippingSlime 
                position="top" 
                dripsCount={15} 
                className="absolute inset-x-0 top-0"
                intensity="medium"
                zIndex={15}
                {...getSlimeProps()}
              />
              
              <div className="absolute inset-0 z-0 rust-overlay broken-glass">
                <div className="scanline absolute inset-0"></div>
              </div>
              
              <div className="relative z-10 p-6 md:p-8">
                <div className="flex items-center justify-between mb-4 border-b border-toxic-neon/20 pb-2 relative">
                  {/* Header border slime effect */}
                  <DrippingSlime 
                    position="bottom" 
                    dripsCount={8} 
                    className="absolute inset-x-0 bottom-0 h-2"
                    intensity="low"
                    zIndex={15}
                    {...getSlimeProps()}
                  />
                  
                  <div 
                    className="flex items-center"
                    onMouseEnter={() => setHoverState("survivor")}
                  >
                    <Radiation className="h-5 w-5 mr-2 text-toxic-neon" />
                    <span className="text-toxic-neon font-mono text-lg">RESISTANCE_NETWORK</span>
                  </div>
                  
                  <div className="flex gap-1">
                    <div 
                      className="h-3 w-3 rounded-full bg-apocalypse-red animate-pulse"
                      onMouseEnter={() => setHoverState("bounty-hunter")}
                    ></div>
                    <div 
                      className="h-3 w-3 rounded-full bg-toxic-neon/70"
                      onMouseEnter={() => setHoverState("survivor")}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-6 relative">
                  {/* Content slime puddle */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
                    <ToxicPuddle className="absolute left-[10%] bottom-0" size="large" {...getSlimeProps()} />
                    <ToxicPuddle className="absolute left-[70%] bottom-0" size="medium" {...getSlimeProps()} />
                  </div>
                  
                  {/* Conditional rendering based on authentication state */}
                  {authStage === "pre-boot" && (
                    <PreBootTerminal onAuthenticated={handleAuthenticated} />
                  )}
                  
                  {authStage === "authenticated" && renderMainContent()}
                </div>
                
                {/* Only show this if the user is authenticated but doesn't have access to the desktop yet */}
                {authStage === "authenticated" && !userRole && terminalStage !== "nft-selection" && terminalStage !== "completed" && (
                  <div className="mt-4 text-center relative">
                    {/* Button slime effect */}
                    <DrippingSlime 
                      position="top" 
                      dripsCount={5} 
                      className="absolute inset-x-0 top-0"
                      intensity="low"
                      zIndex={15}
                      {...getSlimeProps()}
                    />
                    
                    <p className="text-white/70 text-sm mb-3">
                      Complete the terminal sequence to access the Resistance Network
                    </p>
                    <ToxicButton 
                      onClick={() => setTerminalStage("nft-selection")}
                      variant="ghost"
                      size="sm"
                      onMouseEnter={() => setHoverState("survivor")}
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
