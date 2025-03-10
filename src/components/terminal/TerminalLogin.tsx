
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, LockKeyhole, AlertTriangle, Terminal, ExternalLink } from "lucide-react";
import { ToxicButton } from "@/components/ui/toxic-button";
import { useWalletConnection } from "@/hooks/useWalletConnection";

interface TerminalLoginProps {
  onLoginSuccess: () => void;
}

export const TerminalLogin: React.FC<TerminalLoginProps> = ({ onLoginSuccess }) => {
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);
  const [terminalMessages, setTerminalMessages] = useState<string[]>([
    "> RESISTANCE NETWORK TERMINAL v2.31",
    "> SECURE CONNECTION ESTABLISHED",
    "> AWAITING AUTHENTICATION..."
  ]);
  const { connect, isConnected, isConnecting } = useWalletConnection();

  useEffect(() => {
    if (isConnected) {
      addTerminalMessage("> WALLET AUTHENTICATION SUCCESSFUL");
      handleLoginSuccess();
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnecting) {
      setIsAuthenticating(true);
      addTerminalMessage("> INITIALIZING WALLET CONNECTION...");
    }
  }, [isConnecting]);

  const addTerminalMessage = (message: string) => {
    setTerminalMessages(prev => [...prev, message]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode.trim()) {
      setLoginErrors(["ERROR: ACCESS CODE REQUIRED"]);
      return;
    }

    authenticateWithPassword();
  };

  const authenticateWithPassword = () => {
    setIsAuthenticating(true);
    setLoginErrors([]);
    
    addTerminalMessage(`> VALIDATING ACCESS CODE: ${accessCode.replace(/./g, '*')}`);
    
    if (accessCode === "resistance" || accessCode === "admin") {
      addTerminalMessage("> ACCESS CODE VALIDATED");
      handleLoginSuccess();
    } else {
      setIsAuthenticating(false);
      setLoginErrors(["ERROR: INVALID ACCESS CODE"]);
      addTerminalMessage("> AUTHENTICATION FAILED");
    }
  };

  const handleWalletConnect = () => {
    setIsAuthenticating(true);
    setLoginErrors([]);
    addTerminalMessage("> INITIALIZING WALLET CONNECTION...");
    
    connect();
  };

  const handleLoginSuccess = () => {
    onLoginSuccess();
  };

  const terminalVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1, // Reduced from 0.2
        delayChildren: 0.2 // Reduced from 0.3
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 5 }, // Reduced y from 10 to 5
    animate: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-lg mx-auto">
      <motion.div 
        className="mb-6 text-center" // Reduced mb-8 to mb-6
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }} // Reduced from 1
      >
        <h1 className="text-5xl md:text-6xl font-mono text-toxic-neon mb-4 toxic-glow">THE RESISTANCE</h1>
        <p className="text-lg text-white/80 mb-6"> {/* Reduced mb-8 to mb-6 */}
          Enter access code to infiltrate the network
        </p>
      </motion.div>

      <motion.div 
        className="bg-black/70 border border-toxic-neon/30 p-5 rounded-lg broken-glass relative overflow-hidden" // Reduced p-6 to p-5
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }} // Reduced from 0.5
      >
        <div className="scanline"></div>
        
        <div className="flex items-center gap-2 mb-4"> {/* Reduced gap-3 to gap-2 and mb-6 to mb-4 */}
          <Terminal className="h-5 w-5 text-toxic-neon" />
          <h2 className="text-xl font-mono text-toxic-neon">TERMINAL ACCESS</h2>
        </div>

        <motion.div 
          className="terminal-output bg-black/90 p-3 rounded font-mono text-sm text-toxic-neon mb-5 h-36 overflow-y-auto flex flex-col"
          // Reduced p-4 to p-3, mb-6 to mb-5, and h-48 to h-36
          variants={terminalVariants}
          initial="initial"
          animate="animate"
        >
          {terminalMessages.map((message, index) => (
            <motion.div 
              key={`${message}-${index}`}
              variants={itemVariants}
              className="mb-0.5 terminal-line" // Reduced mb-1 to mb-0.5
            >
              {message}
            </motion.div>
          ))}
          {loginErrors.map((error, index) => (
            <motion.div 
              key={`error-${index}`}
              variants={itemVariants}
              className="text-apocalypse-red mb-0.5" // Reduced mb-1 to mb-0.5
            >
              {error}
            </motion.div>
          ))}
          {isAuthenticating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1 flex items-center" // Reduced mt-2 to mt-1
            >
              <span className="animate-pulse mr-1">▋</span> {/* Reduced mr-2 to mr-1 */}
              <span>Processing...</span>
            </motion.div>
          )}
        </motion.div>

        <form onSubmit={handleSubmit} className="mb-6"> {/* Reduced mb-8 to mb-6 */}
          <div className="flex flex-col md:flex-row gap-3"> {/* Reduced gap-4 to gap-3 */}
            <div className="relative flex-1">
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                disabled={isAuthenticating}
                placeholder="ENTER ACCESS CODE"
                className="w-full bg-black/80 border-2 border-toxic-neon/60 text-toxic-neon p-2.5 rounded font-mono focus:outline-none focus:border-toxic-neon focus:shadow-[0_0_12px_rgba(57,255,20,0.4)] transition-all duration-300"
                // Reduced p-3 to p-2.5
              />
              <span className="absolute top-1/2 -translate-y-1/2 right-3 text-toxic-neon/50 pointer-events-none text-xs">
                [ACCESS]
              </span>
            </div>
            <ToxicButton 
              type="submit" 
              disabled={isAuthenticating}
              variant="primary"
              size="lg" // Changed from xl to lg for a more compact look
              className="uppercase font-mono inline-flex items-center justify-center text-base md:w-auto w-full"
            >
              <LockKeyhole className="h-4 w-4 mr-2" /> {/* Reduced from h-5 w-5 */}
              AUTHENTICATE
            </ToxicButton>
          </div>
        </form>

        <div className="flex justify-center items-center gap-2 text-white/60 mb-4"> {/* Reduced mb-6 to mb-4 */}
          <span className="border-t border-white/20 flex-grow"></span>
          <span className="text-sm px-2">OR</span>
          <span className="border-t border-white/20 flex-grow"></span>
        </div>

        <ToxicButton 
          onClick={handleWalletConnect} 
          disabled={isAuthenticating}
          variant="secondary"
          size="md" // Changed from lg to md for a more compact look
          className="w-full uppercase font-mono inline-flex items-center justify-center py-2.5 text-base mb-6" // Reduced py-3 to py-2.5 and mb-8 to mb-6
        >
          <Shield className="h-4 w-4 mr-2" /> {/* Reduced from h-5 w-5 */}
          CONNECT CRYPTO WALLET
        </ToxicButton>

        <div className="flex justify-center items-center gap-2 text-white/60 mb-4"> {/* Reduced mb-6 to mb-4 */}
          <span className="border-t border-white/20 flex-grow"></span>
          <span className="text-sm px-2">OR</span>
          <span className="border-t border-white/20 flex-grow"></span>
        </div>

        <a 
          href="https://www.linkedin.com/groups/12657922/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block w-full"
        >
          <ToxicButton
            variant="tertiary"
            size="sm" // Changed from default to sm for a more compact look
            className="w-full uppercase font-mono inline-flex items-center justify-center py-2 text-sm" // Reduced py-2.5 to py-2
          >
            <ExternalLink className="h-3.5 w-3.5 mr-2" /> {/* Reduced from h-4 w-4 */}
            GAIN ACCESS CODE
          </ToxicButton>
        </a>

        <div className="mt-6 text-center"> {/* Reduced mt-8 to mt-6 */}
          <div className="text-white/40 text-xs flex items-center justify-center gap-2">
            <AlertTriangle className="h-3 w-3" />
            <span>UNAUTHORIZED ACCESS WILL BE TRACED</span>
            <AlertTriangle className="h-3 w-3" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
