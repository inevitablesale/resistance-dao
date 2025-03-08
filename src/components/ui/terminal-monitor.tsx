import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minimize2, Maximize2, X, Monitor, Shield, Target, Radio, Users, Clock, AlertTriangle, BookOpen, Radiation, AppWindow, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TerminalTypewriter } from './terminal-typewriter';
import { Button } from './button';

interface TerminalAppProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  zIndex: number;
  children: React.ReactNode;
}

const TerminalApp: React.FC<TerminalAppProps> = ({
  title,
  icon,
  isOpen,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  zIndex,
  children
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute border border-toxic-neon/40 bg-black/90 rounded-md overflow-hidden",
            isMaximized 
              ? "inset-4" 
              : "w-[85%] h-[80%] top-[10%] left-[8%]"
          )}
          style={{ zIndex }}
        >
          <div className="flex items-center justify-between bg-black border-b border-toxic-neon/40 p-2">
            <div className="flex items-center gap-2 text-toxic-neon">
              {icon}
              <span className="font-mono text-sm">{title}</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={onMinimize}
                className="p-1 hover:bg-toxic-neon/20 rounded-sm text-toxic-neon"
              >
                <Minimize2 size={14} />
              </button>
              <button 
                onClick={onMaximize}
                className="p-1 hover:bg-toxic-neon/20 rounded-sm text-toxic-neon"
              >
                <Maximize2 size={14} />
              </button>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-apocalypse-red/20 rounded-sm text-apocalypse-red"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="p-4 h-[calc(100%-40px)] overflow-auto terminal-scrollbar">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onClick, isActive }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center p-1 rounded-md cursor-pointer group",
        isActive ? "bg-toxic-neon/20" : "hover:bg-toxic-neon/10"
      )}
    >
      <div className="w-10 h-10 rounded-md bg-black/80 border border-toxic-neon/30 flex items-center justify-center mb-1 group-hover:border-toxic-neon/60">
        <div className="text-toxic-neon">
          {icon}
        </div>
      </div>
      <span className="text-toxic-neon/80 text-xs font-mono text-center group-hover:text-toxic-neon max-w-[60px] truncate">
        {label}
      </span>
    </div>
  );
};

interface TerminalMonitorProps {
  terminalContent?: React.ReactNode;
  showQuestionnaire?: boolean;
  onTypingComplete?: () => void;
  onRoleSelect?: (role: "bounty-hunter" | "survivor") => void;
  selectedRole?: "bounty-hunter" | "survivor" | null;
  className?: string;
  skipBootSequence?: boolean;
}

export function TerminalMonitor({
  terminalContent,
  showQuestionnaire = false,
  onTypingComplete,
  onRoleSelect,
  selectedRole,
  className,
  skipBootSequence = false
}: TerminalMonitorProps) {
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [maximizedApp, setMaximizedApp] = useState<string | null>(null);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [appZIndex, setAppZIndex] = useState<Record<string, number>>({});
  const [nextZIndex, setNextZIndex] = useState(10);
  const [showDesktopIcons, setShowDesktopIcons] = useState(skipBootSequence);
  const [bootComplete, setBootComplete] = useState(skipBootSequence);

  // Removed auto-open app on desktop load

  // Show desktop icons after boot sequence or role selection
  useEffect(() => {
    if (selectedRole || bootComplete) {
      setShowDesktopIcons(true);
    }
  }, [selectedRole, bootComplete]);
  
  const handleOpenApp = (appId: string) => {
    if (!openApps.includes(appId)) {
      setOpenApps([...openApps, appId]);
    }
    
    setActiveApp(appId);
    setAppZIndex({
      ...appZIndex,
      [appId]: nextZIndex
    });
    setNextZIndex(nextZIndex + 1);
  };

  const handleCloseApp = (appId: string) => {
    setOpenApps(openApps.filter(id => id !== appId));
    if (maximizedApp === appId) {
      setMaximizedApp(null);
    }
    if (activeApp === appId) {
      setActiveApp(null);
    }
  };

  const handleMinimizeApp = (appId: string) => {
    // Just close for now as we don't have a taskbar minimized state
    handleCloseApp(appId);
  };

  const handleMaximizeApp = (appId: string) => {
    setMaximizedApp(maximizedApp === appId ? null : appId);
  };

  const handleAppFocus = (appId: string) => {
    if (openApps.includes(appId)) {
      setActiveApp(appId);
      setAppZIndex({
        ...appZIndex,
        [appId]: nextZIndex
      });
      setNextZIndex(nextZIndex + 1);
    }
  };

  const handleCompleteBootSequence = () => {
    if (onTypingComplete) {
      onTypingComplete();
    }
    setBootComplete(true);
  };

  // Apps content based on user's suggestions
  const appContent: Record<string, { title: string, icon: React.ReactNode, content: React.ReactNode }> = {
    'network-status': {
      title: 'NETWORK STATUS',
      icon: <AlertTriangle size={16} />,
      content: (
        <div className="p-2">
          <div className="mb-6 border border-apocalypse-red/40 rounded-md p-4 bg-black/70">
            <div className="flex justify-center">
              <Button variant="destructive" className="w-full">
                <Radio className="w-4 h-4 mr-2" />
                ACTIVATE RESISTANCE BEACON
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border border-toxic-neon/30 rounded-md p-4 bg-black/70">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-toxic-neon w-5 h-5" />
                <h3 className="text-toxic-neon font-mono">Survivors</h3>
              </div>
              <p className="text-2xl text-white font-mono">821</p>
            </div>
            
            <div className="border border-toxic-neon/30 rounded-md p-4 bg-black/70">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-toxic-neon w-5 h-5" />
                <h3 className="text-toxic-neon font-mono">Total Population</h3>
              </div>
              <p className="text-2xl text-white font-mono">2.5K</p>
            </div>
          </div>
          
          <div className="border border-toxic-neon/30 rounded-md p-4 bg-black/70 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Radio className="text-toxic-neon w-5 h-5" />
              <h3 className="text-toxic-neon font-mono">Radio Subscribers</h3>
            </div>
            <p className="text-2xl text-white font-mono">2.7K</p>
          </div>
        </div>
      )
    },
    'survey': {
      title: 'WASTELAND ROLE ASSESSMENT',
      icon: <FileQuestion size={16} />,
      content: (
        <div className="p-2">
          <div className="mb-4">
            <h2 className="text-xl text-toxic-neon font-mono mb-3">WASTELAND ROLE ASSESSMENT</h2>
            <p className="text-white/80 mb-4">
              The wasteland requires different skills to survive. Complete this assessment to determine your optimal role.
            </p>
          </div>
          
          <TerminalTypewriter
            showQuestionnaire={true}
            onRoleSelect={onRoleSelect}
            selectedRole={selectedRole}
          />
        </div>
      )
    },
    'bounty-hunter': {
      title: 'RESISTANCE BOUNTY LIST',
      icon: <Target size={16} />,
      content: (
        <div className="p-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-toxic-neon font-mono">Resistance BOUNTY LIST</h2>
            <Button variant="outline" size="sm" className="text-toxic-neon text-xs">
              View All
            </Button>
          </div>
          
          <div className="border border-apocalypse-red/30 rounded-md p-4 bg-black/70 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-apocalypse-red w-5 h-5" />
              <h3 className="text-apocalypse-red font-mono">TOP SECRET</h3>
            </div>
            
            <h3 className="text-xl text-toxic-neon font-mono mb-3">Bounty Hunter Protocol</h3>
            
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border border-toxic-neon/30 rounded-md bg-black/70 overflow-hidden">
              <div className="bg-apocalypse-red/20 p-2 border-b border-apocalypse-red/30">
                <div className="flex items-center justify-between">
                  <span className="text-apocalypse-red font-mono">#1</span>
                  <span className="text-white/80 font-mono text-xs">WANTED</span>
                </div>
                <div className="text-white font-mono mt-1">BOUNTY: 15,000 RD</div>
              </div>
              
              <div className="p-3">
                <h4 className="text-toxic-neon font-mono mb-1">Mutant Zero X-35</h4>
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
                
                <Button variant="outline" size="sm" className="w-full text-toxic-neon text-xs">
                  Claim Bounty
                </Button>
              </div>
            </div>
            
            <div className="border border-toxic-neon/30 rounded-md bg-black/70 overflow-hidden">
              <div className="bg-apocalypse-red/20 p-2 border-b border-apocalypse-red/30">
                <div className="flex items-center justify-between">
                  <span className="text-apocalypse-red font-mono">#42</span>
                  <span className="text-white/80 font-mono text-xs">WANTED</span>
                </div>
                <div className="text-white font-mono mt-1">BOUNTY: 32,000 RD</div>
              </div>
              
              <div className="p-3">
                <h4 className="text-toxic-neon font-mono mb-1">Toxic Liquidator K-42</h4>
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
                
                <Button variant="outline" size="sm" className="w-full text-toxic-neon text-xs">
                  Claim Bounty
                </Button>
              </div>
            </div>
            
            <div className="border border-toxic-neon/30 rounded-md bg-black/70 overflow-hidden">
              <div className="bg-apocalypse-red/20 p-2 border-b border-apocalypse-red/30">
                <div className="flex items-center justify-between">
                  <span className="text-apocalypse-red font-mono">#7</span>
                  <span className="text-white/80 font-mono text-xs">WANTED</span>
                </div>
                <div className="text-white font-mono mt-1">BOUNTY: 50,000 RD</div>
              </div>
              
              <div className="p-3">
                <h4 className="text-toxic-neon font-mono mb-1">Mind Raider B-007</h4>
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
                
                <Button variant="outline" size="sm" className="w-full text-toxic-neon text-xs">
                  Claim Bounty
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border border-toxic-neon/30 rounded-md p-4 bg-black/70 mb-6">
            <h3 className="text-toxic-neon font-mono mb-3">Your Captured Bounties</h3>
            <p className="text-white/70 text-center py-4">You haven't captured any mutant criminals yet</p>
            
            <Button variant="default" className="w-full">
              <Target className="w-4 h-4 mr-2" />
              Hunt Your First Target
            </Button>
          </div>
        </div>
      )
    },
    'archives': {
      title: 'HISTORICAL ARCHIVES',
      icon: <BookOpen size={16} />,
      content: (
        <div className="p-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-toxic-neon font-mono">HISTORICAL ARCHIVES</h2>
          </div>
          
          <div className="border border-toxic-neon/30 rounded-md p-4 bg-black/70 mb-6">
            <h3 className="text-toxic-neon font-mono mb-3 text-lg">The Resistance Story</h3>
            <p className="text-white/80 mb-4 text-sm">
              How we survived the crypto nuclear winter and built a new world from the ashes
            </p>
            
            <div className="mb-6">
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
            
            <div className="mb-6">
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
            
            <div className="mb-6">
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
            
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="text-toxic-neon">
                <BookOpen className="w-4 h-4 mr-2" />
                Resistance Manifesto
              </Button>
              
              <Button variant="default">
                <Shield className="w-4 h-4 mr-2" />
                Join The Resistance
              </Button>
            </div>
          </div>
        </div>
      )
    },
    'thesis-test': {
      title: 'THESIS TESTING',
      icon: <AppWindow size={16} />,
      content: (
        <div className="p-2">
          <div className="border border-toxic-neon/30 rounded-md p-4 bg-black/70 mb-6">
            <h3 className="text-toxic-neon font-mono mb-3 text-lg">Test Market Interest, Then Launch With Confidence</h3>
            <p className="text-white/80 mb-4 text-sm">
              Collect soft commitments from interested supporters and build your launch community before investing in development.
            </p>
            
            <p className="text-white/80 mb-4 text-sm">
              Supporters indicate their potential investment amount through soft pledges with a voting fee to RD. Test your project's market interest verified without requiring immediate investment.
            </p>
            
            <p className="text-white/80 mb-4 text-sm">
              Connect directly with interested supporters and track their soft commitment amounts. Build reports that provide concrete proof of market interest.
            </p>
            
            <p className="text-white/80 mb-4 text-sm">
              Once interest is proven, launch with confidence knowing there's a committed community ready to support your project from day one.
            </p>
            
            <Button variant="default" className="w-full mt-4">
              <Target className="w-4 h-4 mr-2" />
              Submit Your Thesis
            </Button>
          </div>
        </div>
      )
    }
  };

  return (
    <div className={cn("terminal-monitor relative", className)}>
      {/* Monitor frame */}
      <div className="monitor-frame bg-black/90 border-2 border-toxic-neon/40 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(80,250,123,0.2)] relative">
        {/* Monitor screen */}
        <div className="monitor-screen bg-black p-1 md:p-2 relative overflow-hidden" style={{ minHeight: "400px", height: "60vh", maxHeight: "600px" }}>
          <div className="monitor-scanlines absolute inset-0 pointer-events-none"></div>
          <div className="monitor-glow absolute inset-0 pointer-events-none"></div>
          
          {/* Monitor bezel elements */}
          <div className="absolute top-2 left-2 flex items-center gap-1 z-30">
            <div className="w-2 h-2 rounded-full bg-apocalypse-red animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-toxic-neon/70"></div>
          </div>
          
          <div className="absolute top-2 right-2 text-toxic-neon/50 text-xs font-mono z-30">
            RSTNC_OS v3.2.1
          </div>
          
          {/* Terminal content */}
          <div className="relative p-2 h-full">
            {!bootComplete && !selectedRole && !skipBootSequence ? (
              <div className="w-full h-full">
                <TerminalTypewriter
                  showBootSequence={true}
                  onTypingComplete={handleCompleteBootSequence}
                />
              </div>
            ) : (
              <div className="desktop-environment h-full relative">
                {/* Desktop Icons */}
                {showDesktopIcons && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-2 absolute top-0 left-0 z-10">
                    <DesktopIcon 
                      icon={<AlertTriangle size={20} />} 
                      label="Network Status"
                      onClick={() => handleOpenApp('network-status')}
                      isActive={activeApp === 'network-status'}
                    />
                    <DesktopIcon 
                      icon={<FileQuestion size={20} />} 
                      label="Assessment"
                      onClick={() => handleOpenApp('survey')}
                      isActive={activeApp === 'survey'}
                    />
                    <DesktopIcon 
                      icon={<Target size={20} />} 
                      label="Bounty List"
                      onClick={() => handleOpenApp('bounty-hunter')}
                      isActive={activeApp === 'bounty-hunter'}
                    />
                    <DesktopIcon 
                      icon={<BookOpen size={20} />} 
                      label="Archives"
                      onClick={() => handleOpenApp('archives')}
                      isActive={activeApp === 'archives'}
                    />
                    <DesktopIcon 
                      icon={<AppWindow size={20} />} 
                      label="Thesis Test"
                      onClick={() => handleOpenApp('thesis-test')}
                      isActive={activeApp === 'thesis-test'}
                    />
                  </div>
                )}
                
                {/* Desktop Apps */}
                {Object.entries(appContent).map(([appId, app]) => (
                  <TerminalApp
                    key={appId}
                    title={app.title}
                    icon={app.icon}
                    isOpen={openApps.includes(appId)}
                    onClose={() => handleCloseApp(appId)}
                    onMinimize={() => handleMinimizeApp(appId)}
                    onMaximize={() => handleMaximizeApp(appId)}
                    isMaximized={maximizedApp === appId}
                    zIndex={appZIndex[appId] || 10}
                    children={app.content}
                  />
                ))}
                
                {/* Task Bar */}
                {showDesktopIcons && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 border-t border-toxic-neon/30 h-10 flex items-center px-2 z-20">
                    <div className="flex items-center gap-2 overflow-x-auto terminal-scrollbar flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-toxic-neon flex-shrink-0"
                        onClick={() => {}}
                      >
                        <Radiation className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                      
                      {openApps.length > 0 && (
                        <div className="h-6 border-r border-toxic-neon/20 flex-shrink-0"></div>
                      )}
                      
                      {openApps.map(appId => (
                        <Button
                          key={appId}
                          variant={activeApp === appId ? "secondary" : "ghost"}
                          size="sm"
                          className="h-8 text-xs text-toxic-neon flex-shrink-0"
                          onClick={() => handleAppFocus(appId)}
                        >
                          {appContent[appId].icon}
                          <span className="ml-1 max-w-20 truncate">{appContent[appId].title}</span>
                        </Button>
                      ))}
                    </div>
                    
                    <div className="ml-auto flex items-center text-toxic-neon flex-shrink-0">
                      <Clock size={14} className="mr-2" />
                      <span className="text-xs font-mono">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
