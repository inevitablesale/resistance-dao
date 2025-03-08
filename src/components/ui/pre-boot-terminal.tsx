import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Key, Shield, ExternalLink, Radiation, AlertTriangle, 
  CheckCircle, Lock, Zap, Code, Signal, Wifi, Radar, 
  RadioTower, Fingerprint, Users, Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';
import { DrippingSlime } from './dripping-slime';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ToxicBadge } from './toxic-badge';

interface PreBootTerminalProps {
  onAuthenticated: () => void;
}

export function PreBootTerminal({ onAuthenticated }: PreBootTerminalProps) {
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [commandLine, setCommandLine] = useState('');
  const [terminalReady, setTerminalReady] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [forgotHovered, setForgotHovered] = useState(false);
  const [terminalEffect, setTerminalEffect] = useState<'flicker' | 'glitch' | 'normal'>('normal');
  const [isHackMode, setIsHackMode] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [encryptionStatus, setEncryptionStatus] = useState<number>(0);
  const [nodeConnections, setNodeConnections] = useState<number>(0);
  const [threatStatus, setThreatStatus] = useState<'none' | 'detected' | 'imminent'>('none');
  const [squadStatus, setSquadStatus] = useState<'standby' | 'deployed' | 'engaged'>('standby');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const dynamicContext = useDynamicContext();

  const CORRECT_PASSWORD = 'resistance';

  useEffect(() => {
    if (!terminalReady) return;

    const securityInterval = setInterval(() => {
      const securityLevels: Array<'low' | 'medium' | 'high' | 'critical'> = ['medium', 'high', 'high', 'critical'];
      setSecurityLevel(securityLevels[Math.floor(Math.random() * securityLevels.length)]);
      
      setNodeConnections(Math.floor(Math.random() * 17) + 42);
      
      if (Math.random() < 0.3) {
        const threats: Array<'none' | 'detected' | 'imminent'> = ['none', 'detected', 'imminent'];
        setThreatStatus(threats[Math.floor(Math.random() * threats.length)]);
      }
      
      if (Math.random() < 0.2) {
        const squads: Array<'standby' | 'deployed' | 'engaged'> = ['standby', 'deployed', 'engaged'];
        setSquadStatus(squads[Math.floor(Math.random() * squads.length)]);
      }
      
      setEncryptionStatus(Math.floor(Math.random() * 21) + 80);
    }, 5000);

    return () => clearInterval(securityInterval);
  }, [terminalReady]);

  useEffect(() => {
    if (dynamicContext.primaryWallet && dynamicContext.user) {
      console.log("Wallet already connected, bypassing authentication");
      setAuthStatus('success');
      setTerminalEffect('glitch');
      
      setTimeout(() => {
        onAuthenticated();
      }, 500);
    }
  }, [dynamicContext.primaryWallet, dynamicContext.user, onAuthenticated]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const bootMessages = [
      'Initializing military-grade secure terminal...',
      'Establishing quantum-encrypted connection...',
      '[WARNING]: Hostile network detected',
      'Activating counter-surveillance protocols...',
      'Routing through decentralized resistance nodes...',
      'Node security verification: COMPLETE',
      'Firmware integrity check: PASSED',
      'RESISTANCE COMBAT NETWORK TERMINAL v5.14',
      'Clearance level required: OPERATIVE',
      'Authentication required:',
    ];

    const typeMessage = (messageIndex: number = 0, charIndex: number = 0) => {
      if (messageIndex >= bootMessages.length) {
        setTerminalReady(true);
        return;
      }

      const currentMessage = bootMessages[messageIndex];
      
      if (charIndex <= currentMessage.length) {
        setCommandLine(prev => 
          prev.split('\n').slice(0, messageIndex).join('\n') + 
          (messageIndex > 0 ? '\n' : '') + 
          currentMessage.substring(0, charIndex)
        );
        
        const isSpace = currentMessage[charIndex] === ' ';
        const isPunctuation = ['.', ',', ':', ';', '!', '?'].includes(currentMessage[charIndex] || '');
        let delay = 5 + Math.random() * 5;
        
        if (isPunctuation) delay += 30;
        if (isSpace) delay += 10;
        
        if (Math.random() < 0.05) {
          setTerminalEffect('glitch');
          setTimeout(() => setTerminalEffect('normal'), 120);
        }
        
        timeout = setTimeout(() => {
          typeMessage(messageIndex, charIndex + 1);
        }, delay);
      } else {
        const pauseTime = 
          currentMessage.includes('WARNING') ? 300 : 
          currentMessage.includes('RESISTANCE COMBAT') ? 250 : 
          currentMessage.includes('Clearance') ? 200 : 80;
        
        if (currentMessage.includes('WARNING')) {
          setTerminalEffect('flicker');
          setTimeout(() => setTerminalEffect('normal'), 400);
        }
        
        timeout = setTimeout(() => {
          setCommandLine(prev => prev + '\n');
          typeMessage(messageIndex + 1, 0);
        }, pauseTime);
      }
    };

    typeMessage();
    
    const forceCompleteTimeout = setTimeout(() => {
      if (!terminalReady) {
        clearTimeout(timeout);
        setCommandLine(bootMessages.join('\n'));
        setTerminalReady(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(forceCompleteTimeout);
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandLine]);

  useEffect(() => {
    if (!terminalReady) return;
    
    const flickerInterval = setInterval(() => {
      const terminalEl = terminalRef.current;
      if (!terminalEl) return;
      
      if (Math.random() < 0.4) {
        setTerminalEffect('flicker');
        setTimeout(() => setTerminalEffect('normal'), 150);
      }
      
    }, 5000 + Math.random() * 10000);

    return () => clearInterval(flickerInterval);
  }, [terminalReady]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.trim() === '' && !isHackMode) return;
    
    setAuthStatus('checking');
    
    setTimeout(() => {
      if (password === CORRECT_PASSWORD || isHackMode) {
        setAuthStatus('success');
        setTerminalEffect('flicker');
        
        if (isHackMode) {
          setCommandLine(prev => 
            prev + 
            '\n\n> UNAUTHORIZED ACCESS DETECTED' +
            '\n> EXTERNAL ENCRYPTION KEY RECOGNIZED' +
            '\n> ADVANCED INFILTRATION PROTOCOL ACTIVATED' + 
            '\n> BYPASSING SECURITY CHECKPOINTS...' +
            '\n> DISABLING PERIMETER DEFENSES...' +
            '\n> OVERRIDING COMMAND PROTOCOLS...' +
            '\n> SYSTEM BREACH IMMINENT...'
          );
        } else {
          setCommandLine(prev => 
            prev + 
            '\n\n> OPERATIVE CREDENTIALS VERIFIED' +
            '\n> ACCESS LEVEL: RESISTANCE COMMAND' + 
            '\n> INITIALIZING TACTICAL OVERLAY...' +
            '\n> ESTABLISHING SECURE BATTLEFIELD CHANNEL...' +
            '\n> DEPLOYING COMMAND INTERFACE...' +
            '\n> SYSTEM BREACH IMMINENT...'
          );
        }
        
        setTimeout(() => {
          setTerminalEffect('glitch');
          setTimeout(() => {
            onAuthenticated();
          }, 800);
        }, 1500);
      } else {
        setAuthStatus('error');
        setShowError(true);
        setTerminalEffect('glitch');
        
        setCommandLine(prev => 
          prev + 
          '\n\n> ERROR: INVALID CREDENTIALS' + 
          '\n> ACCESS DENIED' +
          '\n> SECURITY PROTOCOLS ENGAGED' +
          '\n> HOSTILE ATTEMPT LOGGED'
        );
        
        setPassword('');
        
        if (inputRef.current) {
          inputRef.current.focus();
        }
        
        setTimeout(() => {
          setShowError(false);
          setAuthStatus('idle');
          setTerminalEffect('normal');
        }, 1000);
      }
    }, 1200);
  };

  const handleWalletHack = async () => {
    setIsHackMode(true);
    if (dynamicContext && dynamicContext.setShowAuthFlow) {
      try {
        dynamicContext.setShowAuthFlow(true);
        handlePasswordSubmit(new Event('submit') as any);
      } catch (error) {
        console.error("Wallet connection failed:", error);
        setIsHackMode(false);
        setAuthStatus('error');
        setShowError(true);
      }
    }
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getStatusDisplay = (status: string, type: 'security' | 'threat' | 'squad' | 'nodes') => {
    if (type === 'security') {
      const colors = {
        low: 'text-green-400',
        medium: 'text-yellow-400',
        high: 'text-orange-400',
        critical: 'text-apocalypse-red animate-pulse'
      };
      return <span className={colors[status as keyof typeof colors]}>{status.toUpperCase()}</span>;
    }
    
    if (type === 'threat') {
      const colors = {
        none: 'text-green-400',
        detected: 'text-yellow-400',
        imminent: 'text-apocalypse-red animate-pulse'
      };
      return <span className={colors[status as keyof typeof colors]}>{status.toUpperCase()}</span>;
    }
    
    if (type === 'squad') {
      const colors = {
        standby: 'text-blue-400',
        deployed: 'text-yellow-400',
        engaged: 'text-apocalypse-red'
      };
      return <span className={colors[status as keyof typeof colors]}>{status.toUpperCase()}</span>;
    }
    
    return <span>{status}</span>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="monitor-frame w-full max-w-3xl mx-auto relative overflow-hidden bg-black border border-toxic-neon/30 rounded-md shadow-[0_0_15px_rgba(80,250,123,0.2)]"
      onClick={focusInput}
    >
      <div className="absolute inset-0 overflow-hidden crt-overlay">
        <div className="crt-scanline"></div>
        <div className={cn("crt-flicker", terminalEffect === 'flicker' && "active-flicker")}></div>
        <div className="crt-vignette"></div>
        
        <div className="terminal-matrix-bg absolute inset-0 opacity-10 z-0 pointer-events-none"></div>
        
        <div className="scanner-active-line absolute left-0 right-0 h-[2px] bg-toxic-neon/20 z-10 pointer-events-none"></div>
      </div>
      
      <div className={cn(
        "relative monitor-screen p-4 sm:p-6 font-mono text-sm sm:text-base overflow-hidden transition-all duration-300",
        terminalEffect === 'glitch' && "terminal-glitch-effect"
      )}>
        <div className="monitor-scanlines absolute inset-0"></div>
        <div className="monitor-glow absolute inset-0"></div>
        
        <div className="terminal-content flex flex-col h-full">
          <div className="flex flex-col gap-2 mb-3 border-b border-toxic-neon/20 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div 
                  animate={{ rotate: [0, 360] }} 
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
                  className="text-toxic-neon"
                >
                  <Terminal className="h-4 w-4 text-toxic-neon" />
                </motion.div>
                <span className="text-toxic-neon/90 text-xs tracking-wider">RESISTANCE_COMBAT_TERMINAL</span>
              </div>
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-apocalypse-red/80 animate-pulse"></div>
                <div className="h-2 w-2 rounded-full bg-toxic-neon/50"></div>
              </div>
            </div>
            
            {terminalReady && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-toxic-neon/70" />
                  <span className="text-white/70">SECURITY:</span>
                  {getStatusDisplay(securityLevel, 'security')}
                </div>
                <div className="flex items-center gap-1">
                  <Radiation className="h-3 w-3 text-toxic-neon/70" />
                  <span className="text-white/70">THREAT:</span>
                  {getStatusDisplay(threatStatus, 'threat')}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-toxic-neon/70" />
                  <span className="text-white/70">SQUAD:</span>
                  {getStatusDisplay(squadStatus, 'squad')}
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-toxic-neon/70" />
                  <span className="text-white/70">ENCRYPT:</span>
                  <span className={encryptionStatus > 90 ? "text-green-400" : "text-yellow-400"}>
                    {encryptionStatus}%
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div 
            ref={terminalRef}
            className="flex-1 text-toxic-neon mb-4 whitespace-pre-line overflow-y-auto terminal-scrollbar max-h-[300px] transition-all duration-300"
          >
            {commandLine}
            {terminalReady && <span className="terminal-prompt block mt-2 text-toxic-neon/90">resistance@secure:~$</span>}
          </div>
          
          {terminalReady && (
            <form onSubmit={handlePasswordSubmit} className="mt-2">
              <div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <Lock className={cn(
                        "h-4 w-4 transition-colors duration-300",
                        authStatus === 'checking' ? "text-toxic-neon animate-pulse" : 
                        authStatus === 'success' ? "text-toxic-neon" : 
                        authStatus === 'error' ? "text-apocalypse-red" : 
                        "text-toxic-neon/60 group-focus-within:text-toxic-neon"
                      )} />
                    </div>
                    <Input
                      ref={inputRef}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Clearance Code"
                      className={cn(
                        "bg-black/60 text-toxic-neon border-toxic-neon/40 pl-8 focus-visible:ring-toxic-neon/30 font-mono",
                        "transition-all duration-300",
                        "focus:placeholder-toxic-neon/40 placeholder-toxic-neon/20", 
                        showError && "border-apocalypse-red animate-shake",
                        authStatus === 'checking' && "bg-toxic-neon/5",
                        authStatus === 'success' && "bg-toxic-neon/10 border-toxic-neon"
                      )}
                      disabled={authStatus === 'checking' || authStatus === 'success'}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handlePasswordSubmit(e);
                        }
                      }}
                    />

                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <AnimatePresence>
                        {authStatus === 'checking' && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="h-4 w-4 border-2 border-toxic-neon border-t-transparent rounded-full animate-spin"></div>
                          </motion.div>
                        )}
                        {authStatus === 'success' && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <CheckCircle className="h-4 w-4 text-toxic-neon" />
                          </motion.div>
                        )}
                        {authStatus === 'error' && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <AlertTriangle className="h-4 w-4 text-apocalypse-red" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.div
                      initial={false}
                      animate={{ 
                        height: authStatus === 'idle' && terminalReady ? "auto" : 0,
                        opacity: authStatus === 'idle' && terminalReady ? 1 : 0,
                        marginTop: authStatus === 'idle' && terminalReady ? 4 : 0
                      }}
                      className="overflow-hidden text-xs text-white/60"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Fingerprint className="h-3 w-3 text-toxic-neon/70" />
                          <span>Biometric</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-white/30"></div>
                        <div className="flex items-center gap-1">
                          <RadioTower className="h-3 w-3 text-toxic-neon/70" />
                          <span>Squad verification</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-white/30"></div>
                        <div className="flex items-center gap-1">
                          <Signal className="h-3 w-3 text-toxic-neon/70" />
                          <span>Command protocol</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <ToxicBadge variant="outline" className="font-mono">
                      <Radiation className="h-3 w-3 mr-1" /> OR
                    </ToxicBadge>
                  </div>
                  
                  <div className="flex">
                    <Button 
                      type="button"
                      onClick={handleWalletHack}
                      className={cn(
                        "bg-black/80 border border-apocalypse-red text-apocalypse-red hover:bg-apocalypse-red/20 transition-all duration-300",
                        "flex items-center justify-center relative overflow-hidden w-full",
                        "shadow-[0_0_10px_rgba(234,56,76,0.2)]",
                        authStatus === 'checking' && "opacity-70 cursor-not-allowed",
                        authStatus === 'success' && "bg-apocalypse-red/20"
                      )}
                      disabled={authStatus === 'checking' || authStatus === 'success'}
                    >
                      <span className="z-10 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        <Code className="w-4 h-4 mr-2" />
                        Breach Mainframe
                      </span>
                      <span className="absolute inset-0 bg-apocalypse-red/0 hover:bg-apocalypse-red/20 transition-colors duration-300"></span>
                      <span className="absolute -inset-[1px] border border-apocalypse-red/30 opacity-0 group-hover:opacity-100 rounded-md"></span>
                      <span className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-apocalypse-red/50 to-transparent transform -translate-x-full animate-[scan_3s_ease-in-out_infinite]"></span>
                    </Button>
                  </div>
                </div>
                
                <div className="mt-5 relative">
                  <div 
                    className="relative"
                    onMouseEnter={() => setForgotHovered(true)}
                    onMouseLeave={() => setForgotHovered(false)}
                  >
                    <DrippingSlime 
                      position="top" 
                      dripsCount={forgotHovered ? 5 : 3} 
                      toxicGreen={true} 
                      className="pointer-events-none absolute inset-x-0 top-0 h-0"
                    />
                    
                    <div className="relative py-3 px-4 bg-black/70 backdrop-blur-sm rounded border border-toxic-neon/10 inline-block group">
                      <a 
                        href="https://www.linkedin.com/groups/12657922/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center text-base text-toxic-neon hover:text-toxic-neon transition-colors duration-300 relative broken-glass"
                      >
                        <span className={cn(
                          "absolute inset-0 bg-toxic-neon/5 opacity-0 transition-opacity duration-300",
                          forgotHovered && "opacity-100"
                        )}></span>
                        <ExternalLink className={cn(
                          "h-5 w-5 mr-2 transition-all duration-300",
                          forgotHovered ? "animate-pulse text-toxic-neon" : "text-toxic-neon/90"
                        )} />
                        <span className="relative font-bold group-hover:underline">
                          Join Resistance Command Group for Strategic Access
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

                {terminalReady && (
                  <div className="mt-4 border-t border-toxic-neon/10 pt-3">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <div className="flex items-center gap-1">
                        <Wifi className="h-3 w-3 text-toxic-neon/70" />
                        <span className="text-white/70">RESISTANCE NODE CONNECTIONS:</span>
                      </div>
                      <span className="text-toxic-neon/80">{nodeConnections}/60</span>
                    </div>
                    <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-toxic-neon/70 rounded-full transition-all"
                        style={{ width: `${(nodeConnections / 60) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
      
      <style>
        {`
        .crt-scanline::before {
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
          z-index: 11;
        }
        
        .crt-flicker {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(57, 255, 20, 0.02);
          opacity: 0;
          pointer-events: none;
          z-index: 12;
          animation: flicker 5s infinite;
        }
        
        .active-flicker {
          opacity: 0.1;
          animation: intense-flicker 0.2s infinite;
        }
        
        .crt-vignette {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-shadow: inset 0 0 150px rgba(0, 0, 0, 0.9);
          pointer-events: none;
          z-index: 10;
        }
        
        .terminal-glitch-effect {
          animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        
        .terminal-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .terminal-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.4);
        }
        
        .terminal-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(80, 250, 123, 0.3);
          border-radius: 20px;
        }
        
        .typing-text {
          border-right: 2px solid rgba(80, 250, 123, 0.7);
          animation: blink-caret 1s step-end infinite;
        }
        
        .scanner-active-line {
          animation: scanner-move 3s infinite linear;
          box-shadow: 0 0 5px rgba(80, 250, 123, 0.5);
        }
        
        .terminal-matrix-bg {
          background-image: linear-gradient(
            rgba(0, 10, 2, 0.8) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(0, 10, 2, 0.8) 1px,
            transparent 1px
          );
          background-size: 20px 20px;
          background-position: center center;
        }
        
        @keyframes scanner-move {
          0% {
            top: -2px;
          }
          100% {
            top: 100%;
          }
        }
        
        @keyframes intense-flicker {
          0% { opacity: 0.05; }
          25% { opacity: 0.2; }
          50% { opacity: 0.05; }
          75% { opacity: 0.15; }
          100% { opacity: 0.05; }
        }
        
        @keyframes flicker {
          0% { opacity: 0; }
          5% { opacity: 0.3; }
          6% { opacity: 0; }
          90% { opacity: 0; }
          95% { opacity: 0.3; }
          100% { opacity: 0; }
        }
        
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: rgba(80, 250, 123, 0.7) }
        }
        
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }
        
        @keyframes scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        `}
      </style>
    </motion.div>
  );
}
