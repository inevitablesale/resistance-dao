
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Target, Radiation, Zap, Biohazard } from "lucide-react";
import { ToxicButton } from "@/components/ui/toxic-button";
import { TerminalTypewriter } from "@/components/ui/terminal-typewriter";
import { DrippingSlime, ToxicPuddle } from "@/components/ui/dripping-slime";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Card } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const { setShowAuthFlow, isConnected } = useWalletConnection();
  const [userRole, setUserRole] = useState<"bounty-hunter" | "survivor" | null>(null);
  
  const handleConnectWallet = () => {
    setShowAuthFlow(true);
  };
  
  const handleRoleSelect = (role: "bounty-hunter" | "survivor") => {
    setUserRole(role);
  };
  
  // Terminal text content for immersive experience
  const terminalIntroText = `SURVIVORS DETECTED... IF YOU CAN READ THIS, YOU'RE STILL ALIVE. THE CRYPTO NUCLEAR WINTER KILLED 90% OF PROTOCOLS. THOSE WHO REMAIN HAVE ADAPTED TO THE HARSH NEW REALITY. RESILIENT COMMUNITIES HAVE ESTABLISHED NEW ECONOMIES FROM THE ASHES. OUR TRADERS REPORT THAT TOKEN EXCHANGE NETWORKS ARE FUNCTIONING AGAIN. WE ARE REBUILDING THE FINANCIAL SYSTEM. JOIN US.`;

  return (
    <div className="min-h-screen bg-black text-white relative post-apocalyptic-bg">
      <DrippingSlime position="top" dripsCount={15} showIcons={false} toxicGreen={true} />
      <div className="dust-particles"></div>
      <div className="fog-overlay"></div>

      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -top-48 -left-24" />
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -bottom-48 -right-24" />
        </div>
        
        <div className="container px-4 relative w-full max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-neon/10 border border-toxic-neon/20 text-toxic-neon text-sm mb-4 font-mono broken-glass">
                <span className="w-2 h-2 bg-apocalypse-red rounded-full animate-pulse flash-critical" />
                <Biohazard className="h-4 w-4 mr-1 toxic-glow" /> Network Status: <span className="text-apocalypse-red font-bold status-critical">Critical</span>
              </div>
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
                  
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="h-3 w-3 rounded-full bg-apocalypse-red animate-pulse"></div>
                      <div className="h-3 w-3 rounded-full bg-toxic-neon/70"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <TerminalTypewriter 
                    textToType={terminalIntroText}
                    isConnected={isConnected}
                    onConnect={handleConnectWallet}
                    onRoleSelect={handleRoleSelect}
                    selectedRole={userRole}
                    onAssessmentComplete={handleRoleSelect}
                    className="w-full" 
                  />
                </div>
                
                {userRole && (
                  <div className="mt-6 border-t border-toxic-neon/20 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        {userRole === "survivor" ? (
                          <Shield className="h-6 w-6 mr-2 text-toxic-neon" />
                        ) : (
                          <Target className="h-6 w-6 mr-2 text-apocalypse-red" />
                        )}
                        <h3 className="text-xl font-mono text-toxic-neon">
                          {userRole === "survivor" ? "SURVIVOR PROTOCOL" : "BOUNTY HUNTER PROTOCOL"}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-black/50 border border-toxic-neon/30 rounded-lg p-4 relative overflow-hidden hover:border-toxic-neon/60 transition-all group">
                        <div className="flex items-center mb-3">
                          <Radiation className="h-5 w-5 mr-2 text-toxic-neon" />
                          <h4 className="text-lg font-mono text-toxic-neon">
                            {userRole === "survivor" ? "Submit Settlement Proposal" : "Submit Bounty Evidence"}
                          </h4>
                        </div>
                        <p className="text-white/70 mb-4">
                          {userRole === "survivor" 
                            ? "Propose new projects to strengthen our wasteland communities and secure funding from fellow survivors."
                            : "Submit evidence of crypto criminals you've captured to claim bounty rewards and recognition."
                          }
                        </p>
                        <ToxicButton
                          onClick={() => navigate('/thesis')}
                          className="w-full bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
                        >
                          <Radiation className="w-4 h-4 mr-2" />
                          {userRole === "survivor" ? "Create Proposal" : "Submit Evidence"}
                        </ToxicButton>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-toxic-neon/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      
                      <div className="bg-black/50 border border-toxic-neon/30 rounded-lg p-4 relative overflow-hidden hover:border-toxic-neon/60 transition-all group">
                        <div className="flex items-center mb-3">
                          <Zap className="h-5 w-5 mr-2 text-toxic-neon" />
                          <h4 className="text-lg font-mono text-toxic-neon">
                            {userRole === "survivor" ? "Explore Settlements" : "Browse Active Bounties"}
                          </h4>
                        </div>
                        <p className="text-white/70 mb-4">
                          {userRole === "survivor" 
                            ? "Discover and support initiatives from fellow survivors to strengthen our network of settlements."
                            : "View the most wanted crypto criminals with the highest bounties and plan your next hunt."
                          }
                        </p>
                        <ToxicButton 
                          onClick={() => navigate('/proposals')}
                          className="w-full bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          {userRole === "survivor" ? "View Settlements" : "View Bounties"}
                        </ToxicButton>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-toxic-neon/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                    
                    <ToxicButton 
                      size="lg"
                      onClick={handleConnectWallet}
                      variant="glowing"
                      className="w-full bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
                    >
                      <Radiation className="w-5 h-5 mr-2 text-toxic-neon" />
                      <span className="flash-beacon">
                        {isConnected ? "ACCESS YOUR WASTELAND PROFILE" : "CONNECT TO THE RESISTANCE NETWORK"}
                      </span>
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
