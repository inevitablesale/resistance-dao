
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Key, Shield, ExternalLink, Radiation, AlertTriangle, CheckCircle } from 'lucide-react';
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
  const [cursorVisible, setCursorVisible] = useState(true);
  const [commandLine, setCommandLine] = useState('');
  const [terminalReady, setTerminalReady] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [forgotHovered, setForgotHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Correct password - in a real app, this would come from a secure source
  const CORRECT_PASSWORD = 'resistance';

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  // Initial boot sequence typing effect with more atmospheric messages
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
        
        // Variable typing speed for more natural feel
        const isSpace = currentMessage[charIndex] === ' ';
        const isPunctuation = ['.', ',', ':', ';', '!', '?'].includes(currentMessage[charIndex] || '');
        let delay = 30 + Math.random() * 20;
        
        if (isPunctuation) delay += 200; // Pause longer at punctuation
        if (isSpace) delay += 50; // Slight pause at spaces
        
        timeout = setTimeout(() => {
          typeMessage(messageIndex, charIndex + 1);
        }, delay);
      } else {
        // Longer pause between messages
        const pauseTime = currentMessage.includes('WARNING') ? 1000 : 500; 
        timeout = setTimeout(() => {
          setCommandLine(prev => prev + '\n');
          typeMessage(messageIndex + 1, 0);
        }, pauseTime);
      }
    };

    // Add random "noise" glitches during startup
    const addNoise = () => {
      if (!terminalReady) {
        setCommandLine(prev => {
          // Only add noise if we're still in boot sequence
          if (prev.split('\n').length < bootMessages.length) {
            const lines = prev.split('\n');
            const randomIndex = Math.floor(Math.random() * lines.length);
            if (lines[randomIndex]) {
              const chars = "!@#$%^&*()_+-=[]\\{}|;':\",./<>?`~";
              const randomChar = chars[Math.floor(Math.random() * chars.length)];
              const position = Math.floor(Math.random() * lines[randomIndex].length);
              
              // Insert glitch character
              const newLine = lines[randomIndex].substring(0, position) + 
                              randomChar + 
                              lines[randomIndex].substring(position + 1);
              
              lines[randomIndex] = newLine;
              
              // Immediately fix the glitch
              setTimeout(() => {
                setCommandLine(prev => {
                  const currentLines = prev.split('\n');
                  if (currentLines[randomIndex] && currentLines.length === lines.length) {
                    currentLines[randomIndex] = bootMessages[randomIndex]?.substring(0, newLine.length) || '';
                    return currentLines.join('\n');
                  }
                  return prev;
                });
              }, 150);
              
              return lines.join('\n');
            }
          }
          return prev;
        });
        
        // Schedule next noise
        setTimeout(addNoise, 2000 + Math.random() * 3000);
      }
    };

    typeMessage();
    setTimeout(addNoise, 1000);

    return () => clearTimeout(timeout);
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandLine]);

  // Add subtle CRT flicker effect
  useEffect(() => {
    if (!terminalReady) return;
    
    const flickerInterval = setInterval(() => {
      const terminalEl = terminalRef.current;
      if (!terminalEl) return;
      
      // Apply brief flicker effect
      terminalEl.style.opacity = (0.85 + Math.random() * 0.15).toString();
      terminalEl.style.filter = `brightness(${0.9 + Math.random() * 0.2})`;
      
      // Reset after short duration
      setTimeout(() => {
        if (terminalEl) {
          terminalEl.style.opacity = '1';
          terminalEl.style.filter = 'brightness(1)';
        }
      }, 100);
    }, 5000 + Math.random() * 10000); // Random long intervals

    return () => clearInterval(flickerInterval);
  }, [terminalReady]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.trim() === '') return;
    
    // Set checking state with loading indicator
    setAuthStatus('checking');
    
    // Simulate network delay for authenticity
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        // Authentication success
        setAuthStatus('success');
        
        // Add access granted message with more detail
        setCommandLine(prev => 
          prev + 
          '\n\n> CREDENTIAL VERIFIED' +
          '\n> ACCESS LEVEL: RESISTANCE MEMBER' + 
          '\n> INITIALIZING SECURE BOOT SEQUENCE...' +
          '\n> ESTABLISHING ENCRYPTED CHANNEL...'
        );
        
        // Simulate loading before granting access
        setTimeout(() => {
          // Store authentication in localStorage
          localStorage.setItem('resistance_authenticated', 'true');
          
          // Call the callback to move to the next stage
          onAuthenticated();
        }, 2000);
      } else {
        // Authentication failure
        setAuthStatus('error');
        setShowError(true);
        
        setCommandLine(prev => 
          prev + 
          '\n\n> ERROR: INVALID CREDENTIALS' + 
          '\n> ACCESS DENIED' +
          '\n> SECURITY PROTOCOLS ENGAGED' +
          '\n> ATTEMPTS LOGGED'
        );
        
        // Clear password field
        setPassword('');
        
        // Return focus to input
        if (inputRef.current) {
          inputRef.current.focus();
        }
        
        // Clear error state after delay
        setTimeout(() => {
          setShowError(false);
          setAuthStatus('idle');
        }, 2000);
      }
    }, 1200);
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
        <div className="crt-flicker"></div>
        <div className="crt-vignette"></div>
      </div>
      
      <div className="relative monitor-screen p-4 font-mono text-sm sm:text-base overflow-hidden transition-all duration-300">
        <div className="monitor-scanlines absolute inset-0"></div>
        <div className="monitor-glow absolute inset-0"></div>
        
        <div className="terminal-content flex flex-col h-full">
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-3 border-b border-toxic-neon/20 pb-2">
            <Terminal className="h-4 w-4 text-toxic-neon animate-pulse" />
            <span className="text-toxic-neon/90 text-xs">RESISTANCE_SECURE_SHELL</span>
            <div className="ml-auto flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-apocalypse-red/80 animate-pulse"></div>
              <div className="h-2 w-2 rounded-full bg-toxic-neon/50"></div>
            </div>
          </div>
          
          {/* Terminal output with scrollable area */}
          <div 
            ref={terminalRef}
            className="flex-1 text-toxic-neon mb-4 whitespace-pre-line overflow-y-auto terminal-scrollbar max-h-[300px] transition-all duration-300"
          >
            {commandLine}
            {terminalReady && <span className="terminal-prompt block mt-2">resistance@secure:~$</span>}
            {cursorVisible && <span className="cursor">▌</span>}
          </div>
          
          {/* Password input section - only show when ready */}
          {terminalReady && (
            <form onSubmit={handlePasswordSubmit} className="mt-2">
              <div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <Key className="h-4 w-4 text-toxic-neon group-focus-within:animate-pulse" />
                    </div>
                    <Input
                      ref={inputRef}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter access code"
                      className={cn(
                        "bg-black/60 text-toxic-neon border-toxic-neon/40 pl-8 focus-visible:ring-toxic-neon/30 font-mono",
                        showError && "border-apocalypse-red animate-shake",
                        authStatus === 'checking' && "bg-toxic-neon/5",
                        authStatus === 'success' && "bg-toxic-neon/10 border-toxic-neon"
                      )}
                      disabled={authStatus === 'checking' || authStatus === 'success'}
                      autoFocus
                    />
                    
                    {/* Status indicators */}
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
                      authStatus === 'checking' && "opacity-70 cursor-not-allowed",
                      authStatus === 'success' && "bg-toxic-neon/20"
                    )}
                    disabled={authStatus === 'checking' || authStatus === 'success'}
                  >
                    <Terminal className="w-4 h-4 mr-2" />
                    {authStatus === 'checking' ? 'Verifying...' : 'Submit'}
                  </Button>
                </div>
                
                {/* Forgot password link with enhanced dripping effect */}
                <div className="mt-3 relative">
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
                    
                    <div className="relative py-1 px-2 bg-black/70 backdrop-blur-sm rounded border border-toxic-neon/10 inline-block">
                      <a 
                        href="https://www.linkedin.com/groups/14229615/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center text-xs text-toxic-neon/70 hover:text-toxic-neon transition-colors duration-300 relative broken-glass"
                      >
                        <span className={cn(
                          "absolute inset-0 bg-toxic-neon/5 opacity-0 transition-opacity duration-300",
                          forgotHovered && "opacity-100"
                        )}></span>
                        <ExternalLink className={cn(
                          "h-3 w-3 mr-1.5",
                          forgotHovered ? "animate-pulse text-toxic-neon" : "text-toxic-neon/70"
                        )} />
                        <span className="relative">
                          Forgot Password?
                          <span className={cn(
                            "ml-1.5 text-apocalypse-red/80 transition-all duration-300",
                            forgotHovered && "text-apocalypse-red flash-critical"
                          )}>[RESISTANCE GROUP]</span>
                        </span>
                      </a>
                      
                      {/* Tooltip that appears on hover */}
                      {forgotHovered && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute -bottom-16 left-0 w-56 bg-black/90 backdrop-blur-md border border-toxic-neon/30 rounded p-2 font-mono text-[10px] leading-tight z-10"
                        >
                          <div className="flex items-start gap-1.5">
                            <Radiation className="h-3 w-3 text-toxic-neon mt-0.5 animate-pulse" />
                            <div>
                              <span className="text-toxic-neon/90">EXTERNAL CONNECTION</span>
                              <p className="text-white/70 mt-1">Access the resistance network's public recovery channel on LinkedIn.</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Add extra CRT effects with CSS */}
      <style jsx>{`
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
        
        .crt-vignette {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-shadow: inset 0 0 150px rgba(0, 0, 0, 0.7);
          pointer-events: none;
          z-index: 10;
        }
        
        @keyframes flicker {
          0% { opacity: 0; }
          5% { opacity: 0.3; }
          6% { opacity: 0; }
          90% { opacity: 0; }
          95% { opacity: 0.3; }
          100% { opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}
