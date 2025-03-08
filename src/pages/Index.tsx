
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
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    ">> RESISTANCE NETWORK TERMINAL v2.3",
    ">> RESTRICTED ACCESS MODE",
    ">> Type 'help' for available commands"
  ]);
  const [survivorActivities, setSurvivorActivities] = useState([
    { id: 1, name: "CryptoRebel_92", action: "Joined the Resistance", time: "5m ago" },
    { id: 2, name: "WastelandWanderer", action: "Pledged to Settlement #7", time: "12m ago" },
    { id: 3, name: "RadiatedRachel", action: "Recovered 25k resources", time: "25m ago" }
  ]);
  const [networkStats, setNetworkStats] = useState({
    survivors: 12458,
    radioSubs: 8681,
    settlements: 23,
    bounties: 145,
    resources: "1.25M"
  });
  
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

  // Handle terminal input
  const handleTerminalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerminalInput(e.target.value);
  };

  // Handle terminal command submission
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!terminalInput.trim()) return;
    
    const newHistory = [...terminalHistory, `> ${terminalInput}`];
    
    // Simple command processing
    switch (terminalInput.toLowerCase()) {
      case 'help':
        newHistory.push("Available commands: help, status, bounties, settlements, clear");
        break;
      case 'status':
        newHistory.push("[STATUS] Network: CRITICAL | Survivors: 12,458 | Threat Level: HIGH");
        break;
      case 'bounties':
        newHistory.push("[BOUNTIES] 145 active bounties. Authorization required for details.");
        break;
      case 'settlements':
        newHistory.push("[SETTLEMENTS] 23 settlements established. Use 'map' command for details.");
        break;
      case 'clear':
        setTerminalHistory([
          ">> RESISTANCE NETWORK TERMINAL v2.3",
          ">> RESTRICTED ACCESS MODE",
          ">> Type 'help' for available commands"
        ]);
        setTerminalInput("");
        return;
      default:
        newHistory.push(`Command not recognized: '${terminalInput}'`);
    }
    
    setTerminalHistory(newHistory);
    setTerminalInput("");
  };

  // Render terminal content
  const renderTerminalContent = () => (
    <div className="p-4 h-full bg-black text-toxic-neon font-mono overflow-hidden flex flex-col">
      <div className="overflow-y-auto mb-4 flex-grow">
        {terminalHistory.map((line, i) => (
          <div key={i} className="mb-1">
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleTerminalSubmit} className="flex items-center">
        <span className="mr-2">{">"}</span>
        <input
          type="text"
          value={terminalInput}
          onChange={handleTerminalInputChange}
          placeholder="Enter command..."
          className="flex-grow bg-transparent border-none outline-none text-toxic-neon font-mono"
          autoFocus
        />
      </form>
    </div>
  );

  // Render survivor activity feed
  const renderSurvivorActivity = () => (
    <div className="p-4 bg-black/80 border border-toxic-neon/30 rounded-lg h-full">
      <h3 className="text-toxic-neon font-mono mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2" /> SURVIVOR ACTIVITY
      </h3>
      
      <div className="space-y-3">
        {survivorActivities.map((activity) => (
          <div key={activity.id} className="border border-toxic-neon/20 bg-black/60 p-3 rounded-md flex items-start">
            <div className="w-6 h-6 rounded-full bg-toxic-neon/20 border border-toxic-neon/40 flex items-center justify-center mr-3">
              <Users className="w-3 h-3 text-toxic-neon" />
            </div>
            <div className="flex-grow">
              <div className="text-toxic-neon font-mono">{activity.name}</div>
              <div className="text-white/70 text-sm">{activity.action}</div>
            </div>
            <div className="text-white/50 text-xs">{activity.time}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-toxic-neon/80 text-sm hover:text-toxic-neon hover:underline transition-colors">
          VIEW ALL SURVIVOR ACTIVITIES
        </button>
      </div>
    </div>
  );

  // Render network statistics
  const renderNetworkStatistics = () => (
    <div className="p-4 bg-black/80 border border-toxic-neon/30 rounded-lg">
      <h3 className="text-toxic-neon font-mono mb-4 flex items-center">
        <Database className="w-5 h-5 mr-2" /> NETWORK STATISTICS
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/60">
          <div className="flex items-center gap-2 mb-1">
            <Users className="text-toxic-neon w-4 h-4" />
            <h4 className="text-toxic-neon font-mono text-sm">Survivors</h4>
          </div>
          <p className="text-2xl text-white font-mono">{networkStats.survivors.toLocaleString()}</p>
        </div>
        
        <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/60">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="text-toxic-neon w-4 h-4" />
            <h4 className="text-toxic-neon font-mono text-sm">Radio Subs</h4>
          </div>
          <p className="text-2xl text-white font-mono">{networkStats.radioSubs.toLocaleString()}</p>
        </div>
        
        <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/60">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="text-toxic-neon w-4 h-4" />
            <h4 className="text-toxic-neon font-mono text-sm">Settlements</h4>
          </div>
          <p className="text-2xl text-white font-mono">{networkStats.settlements}</p>
        </div>
        
        <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/60">
          <div className="flex items-center gap-2 mb-1">
            <Target className="text-toxic-neon w-4 h-4" />
            <h4 className="text-toxic-neon font-mono text-sm">Bounties</h4>
          </div>
          <p className="text-2xl text-white font-mono">{networkStats.bounties}</p>
        </div>
      </div>
      
      <div className="mt-3 border border-toxic-neon/30 rounded-md p-3 bg-black/60">
        <div className="flex items-center gap-2 mb-1">
          <Database className="text-toxic-neon w-4 h-4" />
          <h4 className="text-toxic-neon font-mono text-sm">Resources Recovered</h4>
        </div>
        <p className="text-2xl text-white font-mono">{networkStats.resources}</p>
      </div>
    </div>
  );

  // Render settlement map
  const renderSettlementMap = () => (
    <div className="p-4 bg-black/80 border border-toxic-neon/30 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-toxic-neon font-mono flex items-center">
          <Shield className="w-5 h-5 mr-2" /> SETTLEMENT MAP
        </h3>
        
        <button className="text-toxic-neon text-sm border border-toxic-neon/40 px-2 py-1 rounded hover:bg-toxic-neon/20 transition-colors">
          EXPAND
        </button>
      </div>
      
      <div className="border border-toxic-neon/30 rounded-md h-64 bg-black/60 relative overflow-hidden">
        {/* Map placeholder */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-6 gap-px">
          {Array(60).fill(0).map((_, i) => (
            <div key={i} className="border-toxic-neon/5 border"></div>
          ))}
        </div>
        
        {/* Settlement markers */}
        <div className="absolute left-[20%] top-[30%]">
          <div className="w-3 h-3 rounded-full bg-toxic-neon/80 animate-pulse"></div>
        </div>
        <div className="absolute left-[50%] top-[40%]">
          <div className="w-3 h-3 rounded-full bg-toxic-neon/80 animate-pulse"></div>
        </div>
        <div className="absolute left-[80%] top-[20%]">
          <div className="w-3 h-3 rounded-full bg-toxic-neon/80 animate-pulse"></div>
        </div>
        <div className="absolute left-[35%] top-[70%]">
          <div className="w-3 h-3 rounded-full bg-toxic-neon/80 animate-pulse"></div>
        </div>
        <div className="absolute left-[65%] top-[60%]">
          <div className="w-3 h-3 rounded-full bg-toxic-neon/80 animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-3 text-white/60 text-sm">
        23 settlements established across the wasteland
      </div>
    </div>
  );

  // Render active bounties
  const renderActiveBounties = () => (
    <div className="p-4 bg-black/80 border border-toxic-neon/30 rounded-lg">
      <h3 className="text-toxic-neon font-mono mb-4 flex items-center">
        <Target className="w-5 h-5 mr-2" /> ACTIVE BOUNTIES
      </h3>
      
      {!userRole ? (
        <div className="text-center p-6">
          <div className="w-16 h-16 rounded-full mx-auto bg-black/60 border border-apocalypse-red/50 flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-apocalypse-red/70" />
          </div>
          <p className="text-white/70 text-center mb-4">BOUNTY HUNTER AUTH REQUIRED</p>
          
          <ToxicButton variant="outline" onClick={() => setTerminalStage("nft-selection")}>
            SELECT ROLE TO UNLOCK
          </ToxicButton>
        </div>
      ) : (
        <div className="space-y-3">
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
        </div>
      )}
    </div>
  );

  // Main dashboard content based on the new design
  const renderRedesignedDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 h-full">
      {/* Left Column - Terminal and Network Stats */}
      <div className="col-span-12 md:col-span-3 space-y-4">
        <div className="bg-black/80 border border-toxic-neon/30 rounded-lg overflow-hidden h-[300px]">
          {renderTerminalContent()}
        </div>
        {renderNetworkStatistics()}
        {renderSettlementMap()}
      </div>

      {/* Main Content Area */}
      <div className="col-span-12 md:col-span-6 space-y-4">
        <div className="bg-black/80 border border-toxic-neon/30 rounded-lg p-4">
          {/* Main content area - can be customized based on selected tab/function */}
          <div className="border border-toxic-neon/20 rounded-lg min-h-[400px] p-4 bg-black/60">
            <h2 className="text-toxic-neon font-mono text-xl mb-4">RESISTANCE COMMAND CENTER</h2>
            
            <div className="text-white/80 space-y-4">
              <p>
                Welcome to the Resistance Network. Our mission is to reclaim the crypto wasteland from mutant protocol criminals and rebuild a sustainable ecosystem.
              </p>
              
              <div className="border border-toxic-neon/20 rounded-md p-3 bg-black/40">
                <h3 className="text-toxic-neon font-mono text-lg mb-2">NETWORK STATUS REPORT</h3>
                <p>Threat level remains HIGH. Crypto mutants have been detected in Settlements #4, #12, and #19. Bounty hunters dispatched.</p>
              </div>
              
              <div className="border border-toxic-neon/20 rounded-md p-3 bg-black/40">
                <h3 className="text-toxic-neon font-mono text-lg mb-2">RESOURCE UPDATE</h3>
                <p>Resource production has increased by 15% in the Northern Wastelands. Colony expansion approved for Settlement #7.</p>
              </div>
              
              <div className="border border-toxic-neon/20 rounded-md p-3 bg-black/40">
                <h3 className="text-toxic-neon font-mono text-lg mb-2">GOVERNANCE ALERT</h3>
                <p>Resistance DAO voting opens in 12 hours. Three governance proposals submitted for consideration.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom content area */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/80 border border-toxic-neon/30 rounded-lg p-4">
            <h3 className="text-toxic-neon font-mono mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" /> ACTIVE MISSIONS
            </h3>
            <div className="text-white/70 text-sm">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-toxic-neon rounded-full mr-2"></div>
                  Settlement Protection #45
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-toxic-neon rounded-full mr-2"></div>
                  Resource Recovery #23
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-apocalypse-red rounded-full mr-2"></div>
                  Mutant Tracking #12 (Critical)
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-black/80 border border-toxic-neon/30 rounded-lg p-4">
            <h3 className="text-toxic-neon font-mono mb-3 flex items-center">
              <Database className="w-5 h-5 mr-2" /> RESOURCE ALLOCATION
            </h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Settlement Fund</span>
                  <span>68%</span>
                </div>
                <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                  <div className="h-full bg-toxic-neon w-[68%] rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Bounty Rewards</span>
                  <span>45%</span>
                </div>
                <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                  <div className="h-full bg-toxic-neon w-[45%] rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Defense Systems</span>
                  <span>92%</span>
                </div>
                <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                  <div className="h-full bg-apocalypse-red w-[92%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Activity Feed and Bounties */}
      <div className="col-span-12 md:col-span-3 space-y-4">
        {renderSurvivorActivity()}
        {renderActiveBounties()}
      </div>
    </div>
  );

  // Render content for the terminal typewriter stage
  const renderTypewriterContent = () => (
    <div className="h-full">
      <TerminalTypewriter
        showBootSequence={false}
        onTypingComplete={handleTerminalComplete}
      />
    </div>
  );

  // Render content for the NFT selection stage
  const renderNFTContent = () => (
    <div className="h-full">
      <TerminalTypewriter
        showBootSequence={false}
        showQuestionnaire={true}
        onRoleSelect={handleRoleSelect}
        selectedRole={userRole}
      />
    </div>
  );

  // Render content for the desktop environment stage
  const renderDesktopEnvironment = () => (
    <PostAuthLayout
      onAppOpened={() => setInitialAppOpened(true)}
    />
  );

  // Function to render different content based on the authentication and terminal stages
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
        // Show redesigned dashboard in the completed state
        return renderRedesignedDashboard();
      }
    } else if (authStage === "pre-boot") {
      // Pre-authentication shows pre-boot terminal
      return <PreBootTerminal onAuthenticated={handleAuthenticated} />;
    }
    
    // Default fallback (should not reach here)
    return null;
  };

  // Determine whether to show the progress indicator
  const shouldShowProgressIndicator = () => {
    return authStage === "pre-boot" && showProgressIndicator;
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

      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -top-48 -left-24" />
          <div className="absolute w-[500px] h-[500px] bg-toxic-neon/5 rounded-full blur-3xl -bottom-48 -right-24" />
        </div>
        
        <AnimatePresence mode="wait">
          {authStage === "breach-transition" && (
            <SystemBreachTransition />
          )}
        </AnimatePresence>
        
        <div className="container px-4 relative w-full mx-auto h-full py-4 max-w-[95%]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            {/* Header with network status */}
            <div className="flex justify-between items-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-toxic-neon/20 text-toxic-neon text-sm font-mono">
                <span className="w-2 h-2 bg-apocalypse-red rounded-full animate-pulse flash-critical" />
                <Radiation className="h-4 w-4 mr-1 toxic-glow" /> Network Status: <span className="text-apocalypse-red font-bold status-critical">Critical</span>
              </div>
              
              <div className="flex space-x-2">
                <ToxicButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowJournalDialog(true)}
                  className="text-toxic-neon hover:bg-black/60"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Survivor Messages
                </ToxicButton>
                
                <ToxicButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleShowEmergencyTransmission}
                  className="text-toxic-neon hover:bg-black/60"
                >
                  <Radiation className="w-4 w-4 mr-2" />
                  Emergency Transmission
                </ToxicButton>
                
                <ToxicButton variant="outline" size="sm" className="text-toxic-neon hover:bg-black/60">
                  <Shield className="w-4 h-4 mr-2" />
                  System Status
                </ToxicButton>
              </div>
            </div>

            <Card className="w-full bg-black/80 border-toxic-neon/30 p-0 relative overflow-hidden min-h-[80vh]">
              <div className="absolute inset-0 z-0 rust-overlay broken-glass">
                <div className="scanline absolute inset-0"></div>
              </div>
              
              <div className="relative z-10 p-4 h-full">
                {/* Terminal header */}
                <div className="flex items-center justify-between mb-4 border-b border-toxic-neon/20 pb-2">
                  <div className="flex items-center">
                    <Radiation className="w-5 h-5 text-toxic-neon mr-2" />
                    <h2 className="text-toxic-neon text-xl font-mono">RESISTANCE NETWORK</h2>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <ToxicBadge variant="alert" className="animate-pulse">
                      <AlertTriangle className="w-3 h-3 mr-1" /> SECURITY BREACH
                    </ToxicBadge>
                    
                    <ToxicBadge variant="warning">
                      <Clock className="w-3 h-3 mr-1" /> 12:45:22
                    </ToxicBadge>
                  </div>
                </div>
                
                {/* Progress indicator - only show during pre-boot */}
                {shouldShowProgressIndicator() && (
                  <div className="mb-4">
                    <ProgressIndicator
                      currentStage={1}
                      stages={[
                        { name: "SECURITY SCAN", status: "complete" },
                        { name: "AUTHENTICATION", status: "active" },
                        { name: "NODE CONNECTION", status: "pending" },
                        { name: "SYSTEM ACCESS", status: "pending" }
                      ]}
                    />
                  </div>
                )}
                
                {/* Main content */}
                <div className="h-[calc(100%-4rem)]">
                  {renderMainContent()}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
