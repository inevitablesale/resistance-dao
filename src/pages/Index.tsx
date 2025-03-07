
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Target, Radiation, Zap, Biohazard, Users, Activity, Clock, MessageSquare } from "lucide-react";
import { ToxicButton } from "@/components/ui/toxic-button";
import { TerminalTypewriter } from "@/components/ui/terminal-typewriter";
import { DrippingSlime } from "@/components/ui/dripping-slime";
import { Card } from "@/components/ui/card";
import { ToxicSlider } from "@/components/ui/toxic-slider";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<"bounty-hunter" | "survivor" | null>(null);
  const [communityActivity, setCommunityActivity] = useState(0);
  const [showCommunityChallenges, setShowCommunityChallenges] = useState(false);
  const [terminalStage, setTerminalStage] = useState<"typing" | "questionnaire" | "completed">("typing");
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCommunityActivity(Math.floor(Math.random() * 100));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleRoleSelect = (role: "bounty-hunter" | "survivor") => {
    setUserRole(role);
    
    toast.success(`${role === "bounty-hunter" ? "Bounty Hunter" : "Survivor"} role activated`, {
      description: `Your wasteland profile has been configured for ${role === "bounty-hunter" ? "tracking down crypto criminals" : "rebuilding communities"}`,
      duration: 4000,
    });
  };
  
  const handleJoinChallenge = () => {
    toast.success("Challenge joined", {
      description: "You've joined the community challenge. Complete objectives to earn rewards.",
      duration: 4000,
    });
  };
  
  const handleTerminalComplete = () => {
    setTerminalStage("questionnaire");
  };
  
  const handleQuestionnaireComplete = (role: "bounty-hunter" | "survivor") => {
    setUserRole(role);
    setTerminalStage("completed");
  };
  
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
                  
                  <div className="flex gap-1">
                    <div className="h-3 w-3 rounded-full bg-apocalypse-red animate-pulse"></div>
                    <div className="h-3 w-3 rounded-full bg-toxic-neon/70"></div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <TerminalTypewriter 
                    textToType={terminalIntroText}
                    showBootSequence={true}
                    typeDelay={20}
                    onTypingComplete={handleTerminalComplete}
                    showQuestionnaire={terminalStage === "questionnaire"}
                    onRoleSelect={handleQuestionnaireComplete}
                    selectedRole={userRole}
                    className="w-full" 
                  />
                </div>
                
                {userRole && (
                  <div className="mt-6 border-t border-toxic-neen/20 pt-6">
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
                    
                    {/* Wasteland Economy Dashboard - Brief Version */}
                    <div className="mb-6 bg-black/50 border border-toxic-neon/30 rounded-lg p-4 relative overflow-hidden">
                      <div className="flex items-center mb-3">
                        <Activity className="h-5 w-5 mr-2 text-toxic-neon" />
                        <h4 className="text-lg font-mono text-toxic-neon">
                          Wasteland Economy Status
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="p-2 bg-black/70 border border-toxic-neon/20 rounded">
                          <div className="text-xs text-white/60 mb-1">Network Stability</div>
                          <div className="h-1.5 bg-black/60 rounded-full overflow-hidden">
                            <div className="h-full bg-toxic-neon/70 rounded-full" style={{ width: '63%' }}></div>
                          </div>
                          <div className="text-right text-xs mt-1 text-toxic-neon/80">63%</div>
                        </div>
                        
                        <div className="p-2 bg-black/70 border border-toxic-neon/20 rounded">
                          <div className="text-xs text-white/60 mb-1">Community Activity</div>
                          <div className="h-1.5 bg-black/60 rounded-full overflow-hidden">
                            <div className="h-full bg-toxic-neon/70 rounded-full" style={{ width: `${communityActivity}%` }}></div>
                          </div>
                          <div className="text-right text-xs mt-1 text-toxic-neon/80">{communityActivity}%</div>
                        </div>
                        
                        <div className="p-2 bg-black/70 border border-toxic-neon/20 rounded">
                          <div className="text-xs text-white/60 mb-1">Token Value</div>
                          <div className="h-1.5 bg-black/60 rounded-full overflow-hidden">
                            <div className="h-full bg-apocalypse-red/70 rounded-full" style={{ width: '41%' }}></div>
                          </div>
                          <div className="text-right text-xs mt-1 text-apocalypse-red/80">41%</div>
                        </div>
                        
                        <div className="p-2 bg-black/70 border border-toxic-neon/20 rounded">
                          <div className="text-xs text-white/60 mb-1">Settlement Security</div>
                          <div className="h-1.5 bg-black/60 rounded-full overflow-hidden">
                            <div className="h-full bg-toxic-neon/70 rounded-full" style={{ width: '78%' }}></div>
                          </div>
                          <div className="text-right text-xs mt-1 text-toxic-neon/80">78%</div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <ToxicButton
                          onClick={() => navigate('/proposals')}
                          size="sm"
                          variant="ghost"
                          className="text-xs"
                        >
                          <Activity className="w-3 h-3 mr-1" />
                          View Full Dashboard
                        </ToxicButton>
                      </div>
                    </div>
                    
                    {/* Community Integration Panel */}
                    <div className="mb-6 bg-black/50 border border-toxic-neon/30 rounded-lg p-4 relative overflow-hidden">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-toxic-neon" />
                          <h4 className="text-lg font-mono text-toxic-neon">
                            Community Activity
                          </h4>
                        </div>
                        
                        <ToxicButton
                          onClick={() => setShowCommunityChallenges(!showCommunityChallenges)}
                          size="sm"
                          variant="ghost"
                          className="text-xs"
                        >
                          {showCommunityChallenges ? "Hide Challenges" : "Show Challenges"}
                        </ToxicButton>
                      </div>
                      
                      <div className="p-3 bg-black/70 border border-toxic-neon/20 rounded-lg mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-toxic-neon/20 border border-toxic-neon/40 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-toxic-neon" />
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="text-toxic-neon font-bold text-sm">WastelandPioneer_42</span>
                              <span className="text-xs text-white/50 ml-2">2h ago</span>
                            </div>
                            <p className="text-sm text-white/80">
                              Our settlement just established a functioning token exchange with two neighboring communities. Resources are finally flowing again. Join us if you have goods to trade.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {showCommunityChallenges && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="text-white/70 text-sm mb-2">Active Community Challenges</div>
                            
                            <div className="p-3 bg-black/70 border border-toxic-neon/20 rounded-lg mb-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-toxic-neon" />
                                  <span className="text-toxic-neon font-mono">Settlement Defense Initiative</span>
                                </div>
                                <span className="text-xs text-white/50">14h remaining</span>
                              </div>
                              <p className="text-sm text-white/80 mb-2">
                                Join forces with other survivors to establish defensive perimeters around new settlements.
                              </p>
                              <div className="h-1.5 bg-black/60 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-toxic-neon/70 rounded-full" style={{ width: '62%' }}></div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-white/60">
                                <span>38 participants</span>
                                <span>62% complete</span>
                              </div>
                              <ToxicButton
                                onClick={handleJoinChallenge}
                                size="sm"
                                className="mt-3 w-full text-xs py-1"
                              >
                                Join Challenge
                              </ToxicButton>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                    
                    {/* Resource-Aware UI Element with Slider */}
                    <div className="bg-black/50 border border-toxic-neon/30 rounded-lg p-4 mb-6">
                      <div className="flex items-center mb-3">
                        <MessageSquare className="h-5 w-5 mr-2 text-toxic-neon" />
                        <h4 className="text-lg font-mono text-toxic-neon">Resource Allocation Simulator</h4>
                      </div>
                      
                      <p className="text-white/70 mb-4 text-sm">
                        {userRole === "survivor" 
                          ? "Adjust the sliders to simulate resource distribution across your settlement projects."
                          : "Configure resource allocation for your next bounty hunting expedition in the wasteland."
                        }
                      </p>
                      
                      <div className="space-y-4 mb-4">
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="text-white/80">Defense Systems</span>
                            <span className="text-toxic-neon">42%</span>
                          </div>
                          <ToxicSlider 
                            defaultValue={[42]} 
                            max={100} 
                            step={1}
                            glowIntensity="medium"
                            showRadiation={true}
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="text-white/80">Food Production</span>
                            <span className="text-toxic-neon">28%</span>
                          </div>
                          <ToxicSlider 
                            defaultValue={[28]} 
                            max={100} 
                            step={1}
                            glowIntensity="low"
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="text-white/80">Technology</span>
                            <span className="text-toxic-neon">30%</span>
                          </div>
                          <ToxicSlider 
                            defaultValue={[30]} 
                            max={100} 
                            step={1}
                            glowIntensity="high"
                            showRadiation={true}
                          />
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <ToxicButton 
                          size="sm"
                          onClick={() => {
                            toast.success("Resource simulation complete", {
                              description: "Your settlement would survive with this configuration.",
                            });
                          }}
                        >
                          Run Simulation
                        </ToxicButton>
                      </div>
                    </div>
                    
                    <ToxicButton 
                      size="lg"
                      onClick={() => navigate('/proposals')}
                      variant="glowing"
                      className="w-full bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
                    >
                      <Radiation className="w-5 h-5 mr-2 text-toxic-neon" />
                      <span className="flash-beacon">
                        ACCESS THE WASTELAND NETWORK
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
