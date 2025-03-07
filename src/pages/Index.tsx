import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Target, Radiation } from "lucide-react";
import { TerminalMonitor } from "@/components/ui/terminal-monitor";
import { ToxicButton } from "@/components/ui/toxic-button";
import { DrippingSlime } from "@/components/ui/dripping-slime";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { EmergencyTransmission } from "@/components/ui/emergency-transmission";
import { PreBootTerminal } from "@/components/ui/pre-boot-terminal";

// Define the authentication states
type AuthStage = "pre-boot" | "authenticated";

// Define the application stages
type AppStage = "typing" | "questionnaire" | "completed";

const Index = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<"bounty-hunter" | "survivor" | null>(null);
  const [communityActivity, setCommunityActivity] = useState(0);
  const [terminalStage, setTerminalStage] = useState<AppStage>("typing");
  const [showEmergencyTransmission, setShowEmergencyTransmission] = useState(false);
  const [authStage, setAuthStage] = useState<AuthStage>("pre-boot");
  
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
    console.log("Typing animation complete, showing questionnaire");
    setTerminalStage("questionnaire");
  };

  const handleCloseEmergencyTransmission = () => {
    setShowEmergencyTransmission(false);
  };

  // Function to manually show the emergency transmission
  const handleShowEmergencyTransmission = () => {
    setShowEmergencyTransmission(true);
  };

  // Function to handle authentication completion
  const handleAuthenticated = () => {
    setAuthStage("authenticated");
    toast.success("Access granted", {
      description: "Welcome to the Resistance Network terminal",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white relative post-apocalyptic-bg">
      <DrippingSlime position="top" dripsCount={15} showIcons={false} toxicGreen={true} />
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
        
        <div className="container px-4 relative w-full max-w-5xl mx-auto h-full py-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-neon/10 border border-toxic-neon/20 text-toxic-neon text-sm mb-4 font-mono broken-glass">
                <span className="w-2 h-2 bg-apocalypse-red rounded-full animate-pulse flash-critical" />
                <Radiation className="h-4 w-4 mr-1 toxic-glow" /> Network Status: <span className="text-apocalypse-red font-bold status-critical">Critical</span>
              </div>
              
              {/* Only show emergency transmission button when authenticated */}
              {authStage === "authenticated" && (
                <ToxicButton variant="ghost" size="sm" onClick={handleShowEmergencyTransmission} className="ml-2">
                  <Radiation className="w-4 h-4 mr-2" />
                  View Emergency Transmission
                </ToxicButton>
              )}
            </div>

            <Card className="w-full bg-black/80 border-toxic-neon/30 p-0 relative overflow-hidden">
              <div className="absolute inset-0 z-0 rust-overlay broken-glass">
                <div className="scanline absolute inset-0"></div>
              </div>
              
              <div className="relative z-10 p-6 md:p-8">
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
                
                <div className="mb-6">
                  {/* Conditional rendering based on authentication state */}
                  {authStage === "pre-boot" ? (
                    <PreBootTerminal onAuthenticated={handleAuthenticated} />
                  ) : (
                    <TerminalMonitor
                      showQuestionnaire={terminalStage === "questionnaire"}
                      onTypingComplete={handleTerminalComplete}
                      onRoleSelect={handleRoleSelect}
                      selectedRole={userRole}
                      className="w-full" 
                      skipBootSequence={true}
                    />
                  )}
                </div>
                
                {/* Only show this if the user is authenticated but doesn't have access to the desktop yet */}
                {authStage === "authenticated" && !userRole && terminalStage !== "completed" && (
                  <div className="mt-4 text-center">
                    <p className="text-white/70 text-sm mb-3">
                      Complete the terminal sequence to access the Resistance Network
                    </p>
                    <ToxicButton 
                      onClick={() => setTerminalStage("questionnaire")}
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
