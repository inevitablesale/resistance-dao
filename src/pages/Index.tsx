
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Target, Radiation, MessageSquare, AlertTriangle, Users, Clock, Radio, 
         BookOpen, ChevronRight, Database, ArrowUpRight, Droplets, Zap, Loader2 } from "lucide-react";
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
import { JournalDialog } from "@/components/ui/journal-dialog";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { ToxicCard, ToxicCardHeader, ToxicCardTitle, ToxicCardContent, ToxicCardFooter } from "@/components/ui/toxic-card";
import { ToxicBadge } from "@/components/ui/toxic-badge";

// Define the authentication states
type AuthStage = "pre-boot" | "authenticating" | "breach-transition" | "post-breach" | "authenticated";

// Define the application stages
type AppStage = "typing" | "desktop-environment" | "nft-selection" | "questionnaire" | "completed";

const Index = () => {
  const navigate = useNavigate();
  const { isConnected } = useCustomWallet();
  const [userRole, setUserRole] = useState<"bounty-hunter" | "survivor" | null>(null);
  const [communityActivity, setCommunityActivity] = useState(0);
  const [terminalStage, setTerminalStage] = useState<AppStage>("typing");
  const [showEmergencyTransmission, setShowEmergencyTransmission] = useState(false);
  const [authStage, setAuthStage] = useState<AuthStage>("pre-boot");
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  const [showDesktopEnvironment, setShowDesktopEnvironment] = useState(false);
  const [initialAppOpened, setInitialAppOpened] = useState(false);
  const [showJournalDialog, setShowJournalDialog] = useState(false);
  const [showProgressIndicator, setShowProgressIndicator] = useState(true);
  const [conversionAmount, setConversionAmount] = useState<string>("100");
  const [activeTab, setActiveTab] = useState<"bounty" | "survival" | "history">("bounty");
  
  // Show journal dialog when wallet connects
  useEffect(() => {
    if (isConnected && (authStage === "authenticated" || authStage === "post-breach")) {
      const timer = setTimeout(() => {
        setShowJournalDialog(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, authStage]);
  
  // Community activity simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCommunityActivity(Math.floor(Math.random() * 100));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-open Network Status app after post-breach
  useEffect(() => {
    if (authStage === "post-breach" && terminalStage === "desktop-environment" && !initialAppOpened) {
      console.log("Auto-opening Network Status app");
      setTimeout(() => {
        setInitialAppOpened(true);
      }, 1500);
    }
  }, [authStage, terminalStage, initialAppOpened]);
  
  // Hide progress indicator after the terminal stage is completed
  useEffect(() => {
    if (terminalStage !== "typing") {
      setShowProgressIndicator(false);
    }
  }, [terminalStage]);
  
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

  // Main content with desktop environment
  const renderDesktopEnvironment = () => (
    <div className="w-full px-4 py-6">
      <TerminalMonitor
        skipBootSequence={true}
        initialAppOpened={initialAppOpened}
        onDesktopExplored={handleDesktopExplored}
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

  // The enhanced dashboard content - new design
  const renderEnhancedDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
      {/* Network Status Header - Full Width */}
      <div className="col-span-12 mb-2">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-black/50 border border-toxic-neon/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-neon/10 border border-toxic-neon/20">
              <span className="w-2 h-2 bg-apocalypse-red rounded-full animate-pulse flash-critical"></span>
              <Radiation className="h-4 w-4 mr-1 toxic-glow" /> 
              <span className="text-toxic-neon text-sm font-mono">Network Status:</span>
              <span className="text-apocalypse-red font-bold status-critical">CRITICAL</span>
            </div>
            
            <ToxicBadge variant="danger" className="animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" /> 
              THREAT LEVEL: ELEVATED
            </ToxicBadge>
            
            <ToxicBadge variant="default">
              <Users className="h-3 w-3 mr-1" /> 
              SETTLEMENTS: 7 ACTIVE
            </ToxicBadge>
          </div>
          
          <div className="flex items-center gap-2">
            <ToxicButton 
              variant="outline" 
              size="sm" 
              onClick={() => setShowJournalDialog(true)}
              className="text-xs"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Survivor Messages
            </ToxicButton>
            
            <ToxicButton 
              variant="glowing" 
              size="sm" 
              onClick={handleShowEmergencyTransmission}
              className="text-xs"
            >
              <Radiation className="w-4 h-4 mr-2" />
              Emergency Transmission
            </ToxicButton>
          </div>
        </div>
      </div>
      
      {/* Primary Content */}
      <div className="col-span-12 md:col-span-8 space-y-4">
        {/* Tab Navigation */}
        <div className="flex border-b border-toxic-neon/20 mb-4">
          <button 
            className={`px-4 py-2 font-mono text-sm relative ${activeTab === 'bounty' ? 'text-toxic-neon' : 'text-toxic-neon/60 hover:text-toxic-neon/80'}`}
            onClick={() => setActiveTab('bounty')}
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>BOUNTY NETWORK</span>
            </div>
            {activeTab === 'bounty' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-toxic-neon"></div>
            )}
          </button>
          
          <button 
            className={`px-4 py-2 font-mono text-sm relative ${activeTab === 'survival' ? 'text-toxic-neon' : 'text-toxic-neon/60 hover:text-toxic-neon/80'}`}
            onClick={() => setActiveTab('survival')}
          >
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4" />
              <span>SURVIVAL PROTOCOL</span>
            </div>
            {activeTab === 'survival' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-toxic-neon"></div>
            )}
          </button>
          
          <button 
            className={`px-4 py-2 font-mono text-sm relative ${activeTab === 'history' ? 'text-toxic-neon' : 'text-toxic-neon/60 hover:text-toxic-neon/80'}`}
            onClick={() => setActiveTab('history')}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>RESISTANCE ARCHIVES</span>
            </div>
            {activeTab === 'history' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-toxic-neon"></div>
            )}
          </button>
        </div>
        
        {/* Tab Content - Bounty Network */}
        {activeTab === 'bounty' && (
          <div className="space-y-4">
            {/* Top Secret Section */}
            <ToxicCard>
              <ToxicCardHeader>
                <div className="flex items-center gap-2">
                  <Target className="text-apocalypse-red w-5 h-5" />
                  <ToxicCardTitle>BOUNTY HUNTER PROTOCOL</ToxicCardTitle>
                </div>
                <ToxicBadge variant="danger" className="self-start mt-1">TOP SECRET</ToxicBadge>
              </ToxicCardHeader>
              
              <ToxicCardContent>
                <p className="text-white/80 mb-4 text-sm">
                  After the collapse, a dangerous new breed emerged from the toxic wastelands - Mutant Protocol Criminals. 
                  Former CEOs, lead developers, and treasury managers who survived by mutating their code to drain 
                  liquidity from the survivors' remaining assets.
                </p>
                
                <p className="text-white/80 mb-4 text-sm">
                  The Resistance fights back through our elite Bounty Hunter Program. Each captured criminal's digital 
                  signature is minted as an NFT trophy, with their stolen funds redirected to fuel the Resistance's operations.
                </p>
                
                <div className="border border-apocalypse-red/30 rounded-md p-3 bg-black/50 mb-4">
                  <h4 className="text-center text-apocalypse-red font-mono mb-2">» CRITICAL DIRECTIVE «</h4>
                  <p className="text-white/90 text-sm">
                    To join the Resistance, each survivor must capture at least one criminal. Your first successful 
                    capture proves your commitment and grants you full Resistance membership privileges.
                  </p>
                </div>
              </ToxicCardContent>
            </ToxicCard>
            
            {/* Active Bounties Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-toxic-neon font-mono text-lg">ACTIVE BOUNTIES</h3>
                <ToxicButton variant="outline" size="sm" className="text-toxic-neon text-xs">
                  View All Bounties
                </ToxicButton>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bounty Card 1 */}
                <div className="border border-toxic-neon/30 rounded-md bg-black/70 overflow-hidden hover:border-apocalypse-red/50 transition-colors duration-300 hover:bg-black/80 group">
                  <div className="bg-apocalypse-red/20 p-2 border-b border-apocalypse-red/30">
                    <div className="flex items-center justify-between">
                      <span className="text-apocalypse-red font-mono">#1</span>
                      <span className="text-white/80 font-mono text-xs">WANTED</span>
                    </div>
                    <div className="text-white font-mono mt-1">BOUNTY: 15,000 RD</div>
                  </div>
                  
                  <div className="p-3">
                    <h4 className="text-toxic-neon font-mono mb-1 flex items-center group-hover:translate-x-1 transition-transform duration-300">
                      Mutant Zero X-35 
                      <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </h4>
                    <p className="text-white/70 text-xs mb-3">Protocol Sabotage</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Radiation Level</span>
                        <span className="text-apocalypse-red">High</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Mutation</span>
                        <span className="text-toxic-neon">Neural Hacking</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Threat Level</span>
                        <span className="text-apocalypse-red">Extreme</span>
                      </div>
                    </div>
                    
                    <ToxicButton variant="outline" size="sm" className="w-full text-toxic-neon text-xs">
                      Claim Bounty
                    </ToxicButton>
                  </div>
                </div>
                
                {/* Bounty Card 2 */}
                <div className="border border-toxic-neon/30 rounded-md bg-black/70 overflow-hidden hover:border-apocalypse-red/50 transition-colors duration-300 hover:bg-black/80 group">
                  <div className="bg-apocalypse-red/20 p-2 border-b border-apocalypse-red/30">
                    <div className="flex items-center justify-between">
                      <span className="text-apocalypse-red font-mono">#42</span>
                      <span className="text-white/80 font-mono text-xs">WANTED</span>
                    </div>
                    <div className="text-white font-mono mt-1">BOUNTY: 32,000 RD</div>
                  </div>
                  
                  <div className="p-3">
                    <h4 className="text-toxic-neon font-mono mb-1 flex items-center group-hover:translate-x-1 transition-transform duration-300">
                      Toxic Liquidator K-42
                      <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </h4>
                    <p className="text-white/70 text-xs mb-3">DAO Treasury Theft</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Radiation Level</span>
                        <span className="text-toxic-neon">Medium</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Mutation</span>
                        <span className="text-toxic-neon">Toxic Immunity</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Threat Level</span>
                        <span className="text-apocalypse-red">High</span>
                      </div>
                    </div>
                    
                    <ToxicButton variant="outline" size="sm" className="w-full text-toxic-neon text-xs">
                      Claim Bounty
                    </ToxicButton>
                  </div>
                </div>
                
                {/* Bounty Card 3 */}
                <div className="border border-toxic-neon/30 rounded-md bg-black/70 overflow-hidden hover:border-apocalypse-red/50 transition-colors duration-300 hover:bg-black/80 group">
                  <div className="bg-apocalypse-red/20 p-2 border-b border-apocalypse-red/30">
                    <div className="flex items-center justify-between">
                      <span className="text-apocalypse-red font-mono">#7</span>
                      <span className="text-white/80 font-mono text-xs">WANTED</span>
                    </div>
                    <div className="text-white font-mono mt-1">BOUNTY: 50,000 RD</div>
                  </div>
                  
                  <div className="p-3">
                    <h4 className="text-toxic-neon font-mono mb-1 flex items-center group-hover:translate-x-1 transition-transform duration-300">
                      Mind Raider B-007
                      <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </h4>
                    <p className="text-white/70 text-xs mb-3">Consensus Attack</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Radiation Level</span>
                        <span className="text-apocalypse-red">Critical</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Mutation</span>
                        <span className="text-toxic-neon">Telepathy</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Threat Level</span>
                        <span className="text-apocalypse-red">Catastrophic</span>
                      </div>
                    </div>
                    
                    <ToxicButton variant="outline" size="sm" className="w-full text-toxic-neon text-xs">
                      Claim Bounty
                    </ToxicButton>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Captured Bounties */}
            <ToxicCard>
              <ToxicCardHeader>
                <ToxicCardTitle>YOUR CAPTURED BOUNTIES</ToxicCardTitle>
              </ToxicCardHeader>
              
              <ToxicCardContent>
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-black/60 border border-toxic-neon/30 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-toxic-neon/50" />
                  </div>
                  <p className="text-white/70 mb-4">You haven't captured any mutant criminals yet</p>
                  
                  <ToxicButton variant="glowing">
                    <Target className="w-4 h-4 mr-2" />
                    Hunt Your First Target
                  </ToxicButton>
                </div>
              </ToxicCardContent>
            </ToxicCard>
          </div>
        )}
        
        {/* Tab Content - Survival Protocol */}
        {activeTab === 'survival' && (
          <div className="space-y-4">
            {/* Fund Bounty Hunters */}
            <ToxicCard>
              <ToxicCardHeader>
                <div className="flex items-center gap-2">
                  <Database className="text-toxic-neon w-5 h-5" />
                  <ToxicCardTitle>FUND BOUNTY HUNTERS</ToxicCardTitle>
                </div>
                <p className="text-toxic-muted text-sm mt-1">
                  Convert your Old World currency (USDC) into Resistance Dollars (RD) to support bounty hunters tracking mutant protocol criminals across the wasteland.
                </p>
              </ToxicCardHeader>
              
              <ToxicCardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/50">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowUpRight className="text-toxic-neon w-4 h-4" />
                      <h3 className="text-toxic-neon font-mono text-sm">Exchange Rate</h3>
                    </div>
                    <p className="text-white text-lg font-mono">1 USDC = 1 RD</p>
                  </div>
                  
                  <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="text-toxic-neon w-4 h-4" />
                      <h3 className="text-toxic-neon font-mono text-sm">Minimum Transfer</h3>
                    </div>
                    <p className="text-white text-lg font-mono">10 USDC</p>
                  </div>
                  
                  <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="text-toxic-neon w-4 h-4" />
                      <h3 className="text-toxic-neon font-mono text-sm">Protocol Fee</h3>
                    </div>
                    <p className="text-white text-lg font-mono">0.5%</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-toxic-neon font-mono text-sm mb-2 block">Amount to Convert</label>
                    <div className="flex">
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="number"
                            value={conversionAmount}
                            onChange={(e) => setConversionAmount(e.target.value)}
                            className="w-full bg-black border border-toxic-neon/30 rounded-l-md p-2 text-white font-mono focus:outline-none focus:border-toxic-neon transition-colors"
                          />
                          <div className="absolute text-xs text-white/50 right-2 top-1">
                            Balance: 0 USDC
                          </div>
                        </div>
                      </div>
                      <div className="bg-toxic-neon/20 border border-toxic-neon/30 rounded-r-md flex items-center justify-center px-4">
                        <span className="text-toxic-neon font-mono">USDC</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/50">
                    <div className="flex justify-between mb-1">
                      <span className="text-toxic-muted">You'll Receive</span>
                      <span className="text-white/60 text-sm">Est. Value</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-toxic-neon text-2xl font-mono">{conversionAmount} RD</span>
                      <span className="text-white font-mono">RD</span>
                    </div>
                  </div>
                </div>
              </ToxicCardContent>
              
              <ToxicCardFooter>
                <ToxicButton variant="glowing" className="w-full">
                  <Radiation className="w-4 h-4 mr-2" />
                  ACTIVATE SURVIVAL BEACON
                </ToxicButton>
              </ToxicCardFooter>
            </ToxicCard>
            
            {/* Why Join Cards */}
            <div className="space-y-3">
              <h3 className="text-toxic-neon font-mono text-lg">WHY JOIN THE RESISTANCE?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-toxic-neon/30 rounded-md p-4 bg-black/60 hover:bg-black/70 transition-colors hover:border-toxic-neon/60">
                  <div className="w-12 h-12 rounded-full bg-toxic-neon/10 border border-toxic-neon/30 flex items-center justify-center mb-3">
                    <Shield className="w-6 h-6 text-toxic-neon" />
                  </div>
                  <h4 className="text-toxic-neon font-mono mb-2">Secure Asset Storage</h4>
                  <p className="text-white/70 text-sm">
                    Your RD tokens are stored in radiation-hardened vaults secured by battle-tested smart contracts.
                  </p>
                </div>
                
                <div className="border border-toxic-neon/30 rounded-md p-4 bg-black/60 hover:bg-black/70 transition-colors hover:border-toxic-neon/60">
                  <div className="w-12 h-12 rounded-full bg-toxic-neon/10 border border-toxic-neon/30 flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-toxic-neon" />
                  </div>
                  <h4 className="text-toxic-neon font-mono mb-2">Governance Rights</h4>
                  <p className="text-white/70 text-sm">
                    RD token holders vote on Resistance initiatives and resource allocation throughout the wasteland.
                  </p>
                </div>
                
                <div className="border border-toxic-neon/30 rounded-md p-4 bg-black/60 hover:bg-black/70 transition-colors hover:border-toxic-neon/60">
                  <div className="w-12 h-12 rounded-full bg-toxic-neon/10 border border-toxic-neon/30 flex items-center justify-center mb-3">
                    <Target className="w-6 h-6 text-toxic-neon" />
                  </div>
                  <h4 className="text-toxic-neon font-mono mb-2">Priority Access</h4>
                  <p className="text-white/70 text-sm">
                    Early access to new Resistance technology and survival protocols before they're released to the wasteland.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Mission Sponsorship */}
            <ToxicCard>
              <ToxicCardHeader>
                <div className="flex gap-2 mb-2">
                  <ToxicButton variant="outline" size="sm" className="text-sm">
                    Request Mission Sponsorship
                  </ToxicButton>
                  
                  <ToxicButton variant="ghost" size="sm" className="text-sm">
                    Scout Settlements
                  </ToxicButton>
                </div>
                <p className="text-sm text-toxic-muted">
                  <span className="text-toxic-neon font-medium">Resource Allocation Protocol</span> - 
                  Request Mission Sponsorship - Survivors with vital projects can request Resistance support. 
                  Present your mission to gather support and resources from the collective. 
                  Projects that strengthen our network receive priority allocation.
                </p>
              </ToxicCardHeader>
              
              <ToxicCardContent>
                <p className="text-white/80 text-sm mb-4">
                  Scout Settlements - Browse existing Resistance outposts and missions. Support vital projects with your Resistance Dollars and gain influence in the territories you help establish.
                </p>
                
                <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/50">
                  <h4 className="text-center text-toxic-neon font-mono mb-2">» SURVIVAL DIRECTIVE «</h4>
                  <p className="text-white/90 text-sm">
                    All Resistance projects undergo rigorous community vetting before receiving support. Only projects with sustainable survival value will be approved.
                  </p>
                </div>
              </ToxicCardContent>
            </ToxicCard>
          </div>
        )}
        
        {/* Tab Content - Resistance Archives */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {/* The Resistance Story */}
            <ToxicCard>
              <ToxicCardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="text-toxic-neon w-5 h-5" />
                  <ToxicCardTitle>THE RESISTANCE STORY</ToxicCardTitle>
                </div>
                <p className="text-toxic-muted text-sm mt-1">
                  How we survived the crypto nuclear winter and built a new world from the ashes
                </p>
              </ToxicCardHeader>
              
              <ToxicCardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-toxic-neon/20 rounded-full px-3 py-1 text-xs text-toxic-neon font-mono">DAY 0</span>
                      <h4 className="text-white font-mono">The Fall</h4>
                    </div>
                    
                    <h4 className="text-toxic-neon font-mono mb-2">The Crypto Nuclear Winter</h4>
                    <p className="text-white/80 mb-4 text-sm">
                      It began with the great crashes of 2022-2023. Major protocols imploded one by one, like a chain of 
                      nuclear detonations across the digital landscape. FTX, Terra Luna, 3AC - each collapse sent toxic 
                      fallout across the ecosystem.
                    </p>
                    <p className="text-white/80 mb-4 text-sm">
                      User trust was obliterated. Capital fled in panic. Development froze as the crypto nuclear winter 
                      descended. Weakened by greed and centralization, the old world wasn't sustainable - it had to burn 
                      for something new to emerge.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-toxic-neon font-mono mb-2">Historical Records</h4>
                    <h5 className="text-white font-mono mb-2">The First Survivors</h5>
                    <p className="text-white/80 mb-4 text-sm">
                      As institutional players abandoned the wasteland, a resilient community began to form. We were the 
                      builders who stayed - developing during the depths of winter, convinced of the technology's potential 
                      despite the destruction.
                    </p>
                    <p className="text-white/80 mb-4 text-sm">
                      Operating with minimal resources, we formed underground networks for mutual support. Skills were shared, 
                      protocols were hardened against radiation, and new models of trust were forged in the crucible of catastrophe.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-toxic-neon/20 rounded-full px-3 py-1 text-xs text-toxic-neon font-mono">DAY 248</span>
                      <h4 className="text-white font-mono">First Resistance</h4>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-toxic-neon/20 rounded-full px-3 py-1 text-xs text-toxic-neon font-mono">DAY 621</span>
                      <h4 className="text-white font-mono">The New Dawn</h4>
                    </div>
                    
                    <h4 className="text-toxic-neon font-mono mb-2">The Resistance DAO</h4>
                    <p className="text-white/80 mb-4 text-sm">
                      From the remnants of the old world, we built something new. The Resistance DAO became a beacon in the 
                      wasteland - a community united by shared principles: decentralization, transparency, and user sovereignty.
                    </p>
                    <p className="text-white/80 mb-4 text-sm">
                      Our Resistance Survivor Launchpad isn't just a place to build - it's a manifesto. We validate projects 
                      through community consensus, require transparent governance, and ensure value flows back to the ecosystem 
                      that nurtures them.
                    </p>
                  </div>
                </div>
              </ToxicCardContent>
              
              <ToxicCardFooter className="flex justify-center gap-4">
                <ToxicButton variant="outline" className="text-toxic-neon">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Resistance Manifesto
                </ToxicButton>
                
                <ToxicButton variant="glowing">
                  <Shield className="w-4 h-4 mr-2" />
                  Join The Resistance
                </ToxicButton>
              </ToxicCardFooter>
            </ToxicCard>
          </div>
        )}
      </div>
      
      {/* Sidebar */}
      <div className="col-span-12 md:col-span-4 space-y-4">
        {/* Survivor Stats */}
        <ToxicCard>
          <ToxicCardHeader>
            <div className="flex items-center justify-between">
              <ToxicCardTitle className="text-base">RESISTANCE METRICS</ToxicCardTitle>
              <Clock className="w-4 h-4 text-toxic-neon/70" />
            </div>
          </ToxicCardHeader>
          
          <ToxicCardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/50">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="text-toxic-neon w-4 h-4" />
                  <h3 className="text-toxic-neon font-mono text-sm">Survivors</h3>
                </div>
                <p className="text-2xl text-white font-mono">821</p>
              </div>
              
              <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/50">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="text-toxic-neon w-4 h-4" />
                  <h3 className="text-toxic-neon font-mono text-sm">Population</h3>
                </div>
                <p className="text-2xl text-white font-mono">2.5K</p>
              </div>
              
              <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/50">
                <div className="flex items-center gap-2 mb-1">
                  <Radio className="text-toxic-neon w-4 h-4" />
                  <h3 className="text-toxic-neon font-mono text-sm">Radio Subs</h3>
                </div>
                <p className="text-2xl text-white font-mono">2.7K</p>
              </div>
              
              <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/50">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="text-toxic-neon w-4 h-4" />
                  <h3 className="text-toxic-neon font-mono text-sm">Bounty Hunters</h3>
                </div>
                <p className="text-2xl text-white font-mono">782</p>
              </div>
            </div>
          </ToxicCardContent>
        </ToxicCard>
        
        {/* Emergency Updates */}
        <ToxicCard>
          <ToxicCardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-apocalypse-red w-5 h-5" />
              <ToxicCardTitle className="text-base">EMERGENCY BROADCASTS</ToxicCardTitle>
            </div>
          </ToxicCardHeader>
          
          <ToxicCardContent>
            <div className="space-y-3">
              <div className="rounded-md p-2 bg-toxic-neon/5 border border-toxic-neon/20 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-toxic-neon animate-pulse"></div>
                <div>
                  <div className="text-toxic-neon text-sm">New Survivor Pledge</div>
                  <div className="text-white font-mono text-xs">$500</div>
                </div>
              </div>
              
              <div className="rounded-md p-2 bg-toxic-neon/5 border border-toxic-neon/20 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-toxic-neon animate-pulse"></div>
                <div>
                  <div className="text-toxic-neon text-sm">New Survivor Pledge</div>
                  <div className="text-white font-mono text-xs">$23,500</div>
                </div>
              </div>
              
              <div className="rounded-md p-2 bg-toxic-neon/5 border border-toxic-neon/20 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-toxic-neon animate-pulse"></div>
                <div>
                  <div className="text-toxic-neon text-sm">New Survivor Pledge</div>
                  <div className="text-white font-mono text-xs">$150</div>
                </div>
              </div>
            </div>
          </ToxicCardContent>
        </ToxicCard>
        
        {/* Community Support */}
        <ToxicCard>
          <ToxicCardHeader>
            <ToxicCardTitle className="text-base">COMMUNITY SUPPORT</ToxicCardTitle>
          </ToxicCardHeader>
          
          <ToxicCardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-white/70 text-sm">Total Support</div>
                <div className="text-toxic-neon font-mono text-lg">$37,660</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/50 text-center">
                  <div className="text-toxic-neon font-mono">2</div>
                  <div className="text-white/60 text-xs">Resistance Fighters</div>
                </div>
                
                <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/50 text-center">
                  <div className="text-toxic-neon font-mono">7</div>
                  <div className="text-white/60 text-xs">Established Colonies</div>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="h-1 bg-black/60 rounded-full overflow-hidden">
                  <div className="h-full bg-toxic-neon w-3/5 rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <div>Phase 1: 60%</div>
                  <div>Goal: $50,000</div>
                </div>
              </div>
            </div>
          </ToxicCardContent>
        </ToxicCard>
      </div>
    </div>
  );

  // Determine what content to show based on the stages
  const renderMainContent = () => {
    if (authStage === "post-breach" || authStage === "authenticated") {
      // If post-breach or authenticated, show different content based on terminal stage
      if (terminalStage === "nft-selection") {
        console.log("Showing NFT selection content");
        return renderNFTContent();
      } else if (terminalStage === "desktop-environment") {
        console.log("Showing desktop environment");
        return renderDesktopEnvironment();
      } else if (terminalStage === "typing") {
        // Show terminal typewriter in the authenticated state
        return renderTypewriterContent();
      } else if (terminalStage === "completed") {
        // Show enhanced dashboard in the completed state
        return renderEnhancedDashboard();
      }
    } else {
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

      {/* Journal Dialog - shown after wallet connection */}
      <JournalDialog 
        isOpen={showJournalDialog}
        onClose={() => setShowJournalDialog(false)}
      />

      {/* Emergency Transmission Popup - only show when authenticated */}
      {(authStage === "post-breach" || authStage === "authenticated") && (
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
            {(authStage === "post-breach" || authStage === "authenticated") && (
              <div className="text-center mb-4 flex justify-between items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-neon/10 border border-toxic-neon/20 text-toxic-neon text-sm font-mono broken-glass">
                  <span className="w-2 h-2 bg-apocalypse-red rounded-full animate-pulse flash-critical" />
                  <Radiation className="h-4 w-4 mr-1 toxic-glow" /> Network Status: <span className="text-apocalypse-red font-bold status-critical">Critical</span>
                </div>
                
                <div className="flex space-x-2">
                  <ToxicButton 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowJournalDialog(true)}
                    className="animate-pulse-subtle hover:animate-none"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Survivor Messages
                  </ToxicButton>
                  
                  <ToxicButton 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleShowEmergencyTransmission}
                    className="animate-pulse-subtle hover:animate-none"
                  >
                    <Radiation className="w-4 w-4 mr-2" />
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
                {(authStage === "post-breach" || authStage === "authenticated") && (
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
                    <>
                      <PreBootTerminal onAuthenticated={handleAuthenticated} />
                      {/* Progress Indicator only shown during pre-boot stage */}
                      {showProgressIndicator && (
                        <div className="mt-6">
                          <ProgressIndicator 
                            stages={[
                              { id: "boot", label: "Boot", completed: authStage !== "pre-boot" },
                              { id: "breach", label: "System Breach", completed: authStage === "post-breach" || authStage === "authenticated" },
                              { id: "desktop", label: "Interface", completed: terminalStage !== "typing" },
                              { id: "role", label: "Role Selection", completed: userRole !== null }
                            ]}
                          />
                        </div>
                      )}
                    </>
                  )}
                  
                  {(authStage === "post-breach" || authStage === "authenticated") && (
                    <>
                      <PostAuthLayout
                        leftSidebar={renderLeftSidebar()}
                        mainContent={renderMainContent()}
                        rightSidebar={renderRightSidebar()}
                      />
                      {/* Progress Indicator only shown during typing stage after breach */}
                      {showProgressIndicator && terminalStage === "typing" && (
                        <div className="mt-6">
                          <ProgressIndicator 
                            stages={[
                              { id: "boot", label: "Boot", completed: true },
                              { id: "breach", label: "System Breach", completed: true },
                              { id: "desktop", label: "Interface", completed: terminalStage !== "typing" },
                              { id: "role", label: "Role Selection", completed: userRole !== null }
                            ]}
                          />
                        </div>
                      )}
                    </>
                  )}
                  
                  {authStage !== "pre-boot" && authStage !== "post-breach" && authStage !== "authenticated" && (
                    renderMainContent()
                  )}
                </div>
                
                {/* Show skip button for typing terminal stage only */}
                {(authStage === "post-breach" || authStage === "authenticated") && terminalStage === "typing" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                    className="mt-4 text-center"
                  >
                    <p className="text-white/70 text-sm mb-3">
                      Complete the terminal sequence to access the Resistance Network
                    </p>
                    <ToxicButton 
                      onClick={handleTerminalComplete}
                      variant="ghost"
                      size="sm"
                      className="hover:bg-toxic-neon/20 transition-all duration-300"
                    >
                      <Radiation className="w-4 h-4 mr-2" />
                      Skip Intro Sequence
                    </ToxicButton>
                  </motion.div>
                )}
                
                {/* Show continue button for desktop environment */}
                {(authStage === "post-breach" || authStage === "authenticated") && terminalStage === "desktop-environment" && initialAppOpened && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 8 }}
                    className="mt-4 text-center"
                  >
                    <ToxicButton 
                      onClick={handleDesktopExplored}
                      variant="default"
                      size="lg"
                      className="animate-pulse-subtle"
                    >
                      <Target className="w-5 h-5 mr-2" />
                      Continue to Resistance Role Selection
                    </ToxicButton>
                  </motion.div>
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
