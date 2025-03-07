
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Key, Shield, ExternalLink } from 'lucide-react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Correct password - in a real app, this would come from a secure source
  const CORRECT_PASSWORD = 'resistance';

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  // Initial boot sequence typing effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const bootMessages = [
      'Initializing terminal...',
      'Establishing secure connection...',
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
        
        timeout = setTimeout(() => {
          typeMessage(messageIndex, charIndex + 1);
        }, 30 + Math.random() * 30);
      } else {
        timeout = setTimeout(() => {
          setCommandLine(prev => prev + '\n');
          typeMessage(messageIndex + 1, 0);
        }, 500);
      }
    };

    typeMessage();

    return () => clearTimeout(timeout);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      // Add access granted message
      setCommandLine(prev => prev + '\nAccess granted. Initiating boot sequence...');
      
      // Simulate loading before granting access
      setTimeout(() => {
        // Store authentication in localStorage
        localStorage.setItem('resistance_authenticated', 'true');
        
        // Call the callback to move to the next stage
        onAuthenticated();
      }, 1500);
    } else {
      setShowError(true);
      setCommandLine(prev => prev + '\nAccess denied. Invalid credentials.');
      
      // Clear error message after a delay
      setTimeout(() => {
        setShowError(false);
      }, 2000);
    }
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
      <div className="relative monitor-screen p-4 font-mono text-sm sm:text-base overflow-hidden">
        <div className="monitor-scanlines absolute inset-0"></div>
        <div className="monitor-glow absolute inset-0"></div>
        
        <div className="terminal-content flex flex-col h-full">
          {/* Terminal output */}
          <div className="flex-1 text-toxic-neon mb-4 whitespace-pre-line">
            {commandLine}
            {terminalReady && <span className="terminal-prompt block mt-2">ask@resistance:~$</span>}
            {cursorVisible && <span className="cursor">▌</span>}
          </div>
          
          {/* Password input section - only show when ready */}
          {terminalReady && (
            <form onSubmit={handlePasswordSubmit} className="mt-2">
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-toxic-neon" />
                  <Input
                    ref={inputRef}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter access code"
                    className={cn(
                      "bg-black/60 text-toxic-neon border-toxic-neon/40 pl-2 focus-visible:ring-toxic-neon/30",
                      showError && "border-apocalypse-red animate-shake"
                    )}
                    autoFocus
                  />
                  <Button 
                    type="submit" 
                    className="bg-black/80 border border-toxic-neon text-toxic-neon hover:bg-toxic-neon/20"
                  >
                    <Terminal className="w-4 h-4 mr-2" />
                    Submit
                  </Button>
                </div>
                
                {/* Forgot password link with dripping effect */}
                <div className="mt-2 relative">
                  <DrippingSlime 
                    position="top" 
                    dripsCount={3} 
                    toxicGreen={true} 
                    className="pointer-events-none absolute inset-x-0 top-0 h-0"
                  />
                  
                  <a 
                    href="https://www.linkedin.com/groups/14229615/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex items-center text-xs text-toxic-neon/70 hover:text-toxic-neon transition-colors duration-300 relative ml-6 broken-glass"
                  >
                    <span className="absolute inset-0 bg-toxic-neon/5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <ExternalLink className="h-3 w-3 mr-1 flash-beacon" />
                    Forgot Password?
                    <span className="ml-1 flash-critical">[LINK TO RESISTANCE GROUP]</span>
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}
