import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Key, Shield, ExternalLink, Radiation, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';
import { DrippingSlime } from './dripping-slime';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const CORRECT_PASSWORD = 'resistance';

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const bootMessages = [
      'Initializing secure terminal...',
      'Establishing encrypted connection...',
      '[WARNING]: Connection masking enabled',
      'Routing through decentralized nodes...',
      'RESISTANCE NETWORK TERMINAL v3.27',
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
        
        if (Math.random() < 0.03) {
          setTerminalEffect('glitch');
          setTimeout(() => setTerminalEffect('normal'), 120);
        }
        
        timeout = setTimeout(() => {
          typeMessage(messageIndex, charIndex + 1);
        }, delay);
      } else {
        const pauseTime = currentMessage.includes('WARNING') ? 150 : 50; 
        
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
    }, 3000);

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
    
    if (password.trim() === '') return;
    
    setAuthStatus('checking');
    
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        setAuthStatus('success');
        setTerminalEffect('flicker');
        
        setCommandLine(prev => 
          prev + 
          '\n\n> CREDENTIAL VERIFIED' +
          '\n> ACCESS LEVEL: RESISTANCE MEMBER' + 
          '\n> INITIALIZING SECURE BOOT SEQUENCE...' +
          '\n> ESTABLISHING ENCRYPTED CHANNEL...' +
          '\n> SYSTEM BREACH IMMINENT...'
        );
        
        setTimeout(() => {
          setTerminalEffect('glitch');
          setTimeout(() => {
            onAuthenticated();
          }, 800);
        }, 1000);
      } else {
        setAuthStatus('error');
        setShowError(true);
        setTerminalEffect('glitch');
        
        setCommandLine(prev => 
          prev + 
          '\n\n> ERROR: INVALID CREDENTIALS' + 
          '\n> ACCESS DENIED' +
          '\n> SECURITY PROTOCOLS ENGAGED' +
          '\n> ATTEMPTS LOGGED'
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
    }, 600);
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
          <div className="flex items-center gap-2 mb-3 border-b border-toxic-neon/20 pb-2">
            <motion.div 
              animate={{ rotate: [0, 360] }} 
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
              className="text-toxic-neon"
            >
              <Terminal className="h-4 w-4 text-toxic-neon" />
            </motion.div>
            <span className="text-toxic-neon/90 text-xs tracking-wider">RESISTANCE_SECURE_SHELL</span>
            <div className="ml-auto flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-apocalypse-red/80 animate-pulse"></div>
              <div className="h-2 w-2 rounded-full bg-toxic-neon/50"></div>
            </div>
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
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
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
                      placeholder="Enter access code"
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
                    />
                    
                    <AnimatePresence>
                      {authStatus === 'checking' && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-y-0 right-2 flex items-center"
                        >
                          <div className="h-4 w-4 border-2 border-toxic-neon border-t-transparent rounded-full animate-spin"></div>
                        </motion.div>
                      )}
                      {authStatus === 'success' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-y-0 right-2 flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 text-toxic-neon" />
                        </motion.div>
                      )}
                      {authStatus === 'error' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-y-0 right-2 flex items-center"
                        >
                          <AlertTriangle className="h-4 w-4 text-apocalypse-red" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className={cn(
                      "bg-black/80 border border-toxic-neon text-toxic-neon hover:bg-toxic-neon/20 transition-all duration-300",
                      "flex items-center justify-center relative overflow-hidden",
                      authStatus === 'checking' && "opacity-70 cursor-not-allowed",
                      authStatus === 'success' && "bg-toxic-neon/20"
                    )}
                    disabled={authStatus === 'checking' || authStatus === 'success'}
                  >
                    <span className="z-10 flex items-center">
                      <Terminal className="w-4 h-4 mr-2" />
                      {authStatus === 'checking' ? 'Verifying...' : 'Submit'}
                    </span>
                    <span className="absolute inset-0 bg-toxic-neon/0 hover:bg-toxic-neon/20 transition-colors duration-300"></span>
                  </Button>
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
                      <div className="access-code-message text-toxic-neon/60 font-mono text-sm mb-2">// Access code is "resistance"</div>
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
                          Join Resistance LinkedIn Group
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
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
        `}
      </style>
    </motion.div>
  );
}
