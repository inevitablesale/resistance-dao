
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minimize2, Maximize2, X, Monitor, Shield, Target, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TerminalTypewriter } from './terminal-typewriter';

interface TerminalAppProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
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
  onMaximize,
  isMaximized,
  zIndex,
  children
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
                onClick={onMaximize}
                className="p-1 hover:bg-toxic-neon/20 rounded-sm text-toxic-neon"
              >
                {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-apocalypse-red/20 rounded-sm text-apocalypse-red"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="p-4 h-[calc(100%-40px)] overflow-auto">
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
        "flex flex-col items-center p-1 rounded-md cursor-pointer",
        isActive ? "bg-toxic-neon/20" : "hover:bg-toxic-neon/10"
      )}
    >
      <div className="w-10 h-10 rounded-md bg-black/80 border border-toxic-neon/30 flex items-center justify-center mb-1">
        <div className="text-toxic-neon">
          {icon}
        </div>
      </div>
      <span className="text-toxic-neon/80 text-xs font-mono text-center max-w-[60px] truncate">
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
  initialAppOpened?: boolean;
  onDesktopExplored?: () => void;
}

export function TerminalMonitor({
  terminalContent,
  showQuestionnaire = false,
  onTypingComplete,
  onRoleSelect,
  selectedRole,
  className,
  skipBootSequence = false,
  initialAppOpened = false,
  onDesktopExplored
}: TerminalMonitorProps) {
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [maximizedApp, setMaximizedApp] = useState<string | null>(null);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [appZIndex, setAppZIndex] = useState<Record<string, number>>({});
  const [nextZIndex, setNextZIndex] = useState(10);
  const [showDesktopIcons, setShowDesktopIcons] = useState(skipBootSequence);
  const [bootComplete, setBootComplete] = useState(skipBootSequence);
  
  // Auto-open Network Status app when initialAppOpened prop changes
  useEffect(() => {
    if (initialAppOpened && showDesktopIcons && !openApps.includes('network-status')) {
      handleOpenApp('network-status');
    }
  }, [initialAppOpened, showDesktopIcons, openApps]);

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

  const handleMaximizeApp = (appId: string) => {
    setMaximizedApp(maximizedApp === appId ? null : appId);
  };

  const handleCompleteBootSequence = () => {
    if (onTypingComplete) {
      onTypingComplete();
    }
    setBootComplete(true);
  };

  // Simplified app content
  const appContent: Record<string, { title: string, icon: React.ReactNode, content: React.ReactNode }> = {
    'network-status': {
      title: 'NETWORK',
      icon: <AlertTriangle size={16} />,
      content: (
        <div className="p-2">
          <h3 className="text-toxic-neon text-lg mb-3">Network Status</h3>
          <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/70 mb-4">
            <p className="text-white/80">
              Network connection established.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/70">
              <h4 className="text-toxic-neon font-mono mb-1">Survivors</h4>
              <p className="text-2xl text-white font-mono">821</p>
            </div>
            
            <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/70">
              <h4 className="text-toxic-neon font-mono mb-1">Settlements</h4>
              <p className="text-2xl text-white font-mono">23</p>
            </div>
          </div>
        </div>
      )
    },
    'survey': {
      title: 'ROLE SELECT',
      icon: <Shield size={16} />,
      content: (
        <div className="p-2">
          <h3 className="text-toxic-neon text-lg mb-3">Role Assessment</h3>
          <TerminalTypewriter
            showQuestionnaire={true}
            onRoleSelect={onRoleSelect}
            selectedRole={selectedRole}
          />
        </div>
      )
    },
    'bounty-hunter': {
      title: 'BOUNTIES',
      icon: <Target size={16} />,
      content: (
        <div className="p-2">
          <h3 className="text-toxic-neon text-lg mb-3">Active Bounties</h3>
          <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/70 mb-4">
            <p className="text-white/80">
              Displaying active bounties.
            </p>
          </div>
          
          <div className="border border-toxic-neon/30 rounded-md p-3 bg-black/70 mb-4">
            <h4 className="text-toxic-neon font-mono mb-1">Target #42</h4>
            <p className="text-white/80 mb-2">Toxic Liquidator K-42</p>
            <p className="text-white/70 text-sm">Bounty: 32,000 RD</p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className={cn("terminal-monitor relative", className)}>
      {/* Simplified monitor frame */}
      <div className="monitor-frame bg-black/90 border border-toxic-neon/40 rounded-lg overflow-hidden shadow-[0_0_10px_rgba(80,250,123,0.2)] relative">
        {/* Monitor screen - reduced visual effects */}
        <div className="monitor-screen bg-black p-2 relative overflow-hidden" style={{ minHeight: "400px", height: "60vh", maxHeight: "600px" }}>
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
                {/* Desktop Icons - simplified grid */}
                {showDesktopIcons && (
                  <div className="grid grid-cols-3 gap-2 p-2 absolute top-0 left-0 z-10">
                    <DesktopIcon 
                      icon={<AlertTriangle size={20} />} 
                      label="Network"
                      onClick={() => handleOpenApp('network-status')}
                      isActive={activeApp === 'network-status'}
                    />
                    <DesktopIcon 
                      icon={<Shield size={20} />} 
                      label="Survey"
                      onClick={() => handleOpenApp('survey')}
                      isActive={activeApp === 'survey'}
                    />
                    <DesktopIcon 
                      icon={<Target size={20} />} 
                      label="Bounties"
                      onClick={() => handleOpenApp('bounty-hunter')}
                      isActive={activeApp === 'bounty-hunter'}
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
                    onMaximize={() => handleMaximizeApp(appId)}
                    isMaximized={maximizedApp === appId}
                    zIndex={appZIndex[appId] || 10}
                    children={app.content}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>
        {`
        .monitor-scanlines::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, 0.05) 51%
          );
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 1;
        }
        `}
      </style>
    </div>
  );
}
