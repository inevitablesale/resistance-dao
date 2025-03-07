
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Target, Radiation, CheckCircle, Sparkles, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToxicButton } from './toxic-button';
import { DrippingSlime } from './dripping-slime';
import { Card } from './card';
import { useNFTBalance } from '@/hooks/useNFTBalance';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import { toast } from 'sonner';

interface NFTShowcaseProps {
  onRoleSelect: (role: "bounty-hunter" | "survivor") => void;
  selectedRole?: "bounty-hunter" | "survivor" | null;
}

export function NFTShowcase({ onRoleSelect, selectedRole }: NFTShowcaseProps) {
  const [hoverState, setHoverState] = useState<"bounty-hunter" | "survivor" | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const { address } = useCustomWallet();
  const { data: nftBalance, isLoading } = useNFTBalance(address);
  
  // Enable particle effects after a short delay for dramatic effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParticles(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNFTSelect = (role: "bounty-hunter" | "survivor") => {
    onRoleSelect(role);
    
    toast.success(`${role === "bounty-hunter" ? "Bounty Hunter" : "Survivor"} role activated`, {
      description: `Your wasteland profile has been configured for ${role === "bounty-hunter" ? "tracking down crypto criminals" : "rebuilding communities"}`,
      duration: 4000,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-full flex flex-col justify-center items-center"
    >
      {/* Background atmosphere effects */}
      {showParticles && (
        <>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-full h-full radial-pulse-slow opacity-30"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-48 h-48 rounded-full bg-toxic-neon/5 blur-3xl animate-pulse"></div>
          </motion.div>
        </>
      )}

      {/* Main content */}
      <div className="space-y-6 max-w-4xl w-full z-10">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-4"
        >
          <h2 className="text-2xl md:text-3xl font-mono text-toxic-neon mb-2 tracking-tight">
            <Radiation className="inline-block w-6 h-6 mr-2 mb-1" />
            SELECT YOUR WASTELAND IDENTITY
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Your choice determines your role in the post-apocalyptic crypto wasteland. Choose wisely.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center w-full">
          {/* Bounty Hunter NFT Card */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={cn(
              "flex-1 relative",
              selectedRole === "bounty-hunter" && "scale-105 z-10",
              hoverState === "survivor" && "opacity-50 scale-95"
            )}
            onMouseEnter={() => setHoverState("bounty-hunter")}
            onMouseLeave={() => setHoverState(null)}
          >
            <Card className={cn(
              "bg-black/90 border-2 transition-all duration-300 h-full",
              selectedRole === "bounty-hunter" 
                ? "border-apocalypse-red shadow-[0_0_25px_rgba(234,56,76,0.4)]" 
                : hoverState === "bounty-hunter"
                  ? "border-apocalypse-red/60 shadow-[0_0_15px_rgba(234,56,76,0.3)]"
                  : "border-apocalypse-red/20"
            )}>
              <div className="p-6 flex flex-col h-full">
                {/* NFT Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      "bg-apocalypse-red/20 border border-apocalypse-red/40"
                    )}>
                      <Target className="w-6 h-6 text-apocalypse-red" />
                    </div>
                    <span className="text-xl font-mono text-apocalypse-red">BOUNTY HUNTER</span>
                  </div>
                  
                  <div className="bg-black/60 border border-apocalypse-red/30 rounded-full px-3 py-1 text-xs text-apocalypse-red">
                    OFFENSIVE
                  </div>
                </div>
                
                {/* NFT Image */}
                <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded border border-apocalypse-red/40 bg-black/60">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/ca457542-e761-44f2-acbf-1bf9b4255b78.png" 
                      alt="Bounty Hunter NFT" 
                      className={cn(
                        "w-full h-full object-cover transition-transform duration-700 object-center",
                        hoverState === "bounty-hunter" && "scale-110 filter saturate-150"
                      )}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Red Scanner Line Effect */}
                    <div className={cn(
                      "absolute inset-0 scanner-line-red opacity-0",
                      hoverState === "bounty-hunter" && "opacity-100"
                    )}></div>
                  </div>
                  
                  {/* Bottom caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="text-white/90 text-sm font-mono">NFT ID: #HUNTER-0037</div>
                  </div>
                </div>
                
                {/* NFT Description */}
                <div className="flex-1">
                  <div className="mb-4 font-mono">
                    <p className="text-white/80 mb-3 text-sm leading-relaxed">
                      Track down crypto criminals and claim bounties. Hunters specialize in neutralizing threats 
                      to the wasteland economy and returning stolen funds to the community.
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-apocalypse-red" />
                        <span className="text-white/80 text-sm">High-risk, high-reward missions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-apocalypse-red" />
                        <span className="text-white/80 text-sm">Special access to bounty listings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-apocalypse-red" />
                        <span className="text-white/80 text-sm">Combat-enhanced capabilities</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Select Button */}
                <ToxicButton 
                  onClick={() => handleNFTSelect("bounty-hunter")}
                  disabled={selectedRole !== null && selectedRole !== "bounty-hunter"}
                  className={cn(
                    "mt-4 w-full",
                    selectedRole === "bounty-hunter" ? "bg-apocalypse-red/20 border-apocalypse-red" : ""
                  )}
                >
                  <Target className="w-5 h-5 mr-2" />
                  {selectedRole === "bounty-hunter" ? (
                    <span className="flex items-center">
                      SELECTED <CheckCircle className="w-4 h-4 ml-2" />
                    </span>
                  ) : "BECOME BOUNTY HUNTER"}
                </ToxicButton>
              </div>
            </Card>
            
            {/* Selection indicator */}
            {selectedRole === "bounty-hunter" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -top-4 -right-4 bg-apocalypse-red rounded-full p-1 border-2 border-black z-20"
              >
                <CheckCircle className="w-6 h-6 text-black" />
              </motion.div>
            )}
            
            {/* Hover effects */}
            {hoverState === "bounty-hunter" && !selectedRole && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black/80 text-apocalypse-red border border-apocalypse-red/40 rounded-full px-3 py-1 text-sm font-mono z-20 whitespace-nowrap"
              >
                <Radiation className="inline-block w-4 h-4 mr-1 animate-pulse" />
                SELECT BOUNTY HUNTER
              </motion.div>
            )}
          </motion.div>
          
          {/* Survivor NFT Card */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={cn(
              "flex-1 relative",
              selectedRole === "survivor" && "scale-105 z-10",
              hoverState === "bounty-hunter" && "opacity-50 scale-95"
            )}
            onMouseEnter={() => setHoverState("survivor")}
            onMouseLeave={() => setHoverState(null)}
          >
            <Card className={cn(
              "bg-black/90 border-2 transition-all duration-300 h-full",
              selectedRole === "survivor" 
                ? "border-toxic-neon shadow-[0_0_25px_rgba(80,250,123,0.4)]" 
                : hoverState === "survivor"
                  ? "border-toxic-neon/60 shadow-[0_0_15px_rgba(80,250,123,0.3)]"
                  : "border-toxic-neon/20"
            )}>
              <div className="p-6 flex flex-col h-full">
                {/* NFT Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      "bg-toxic-neon/20 border border-toxic-neon/40"
                    )}>
                      <Shield className="w-6 h-6 text-toxic-neon" />
                    </div>
                    <span className="text-xl font-mono text-toxic-neon">SURVIVOR</span>
                  </div>
                  
                  <div className="bg-black/60 border border-toxic-neon/30 rounded-full px-3 py-1 text-xs text-toxic-neon">
                    DEFENSIVE
                  </div>
                </div>
                
                {/* NFT Image */}
                <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded border border-toxic-neon/40 bg-black/60">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/ca457542-e761-44f2-acbf-1bf9b4255b78.png" 
                      alt="Survivor NFT" 
                      className={cn(
                        "w-full h-full object-cover transition-transform duration-700 object-center",
                        hoverState === "survivor" && "scale-110 filter saturate-150"
                      )}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Green Scanner Line Effect */}
                    <div className={cn(
                      "absolute inset-0 scanner-line-green opacity-0",
                      hoverState === "survivor" && "opacity-100"
                    )}></div>
                  </div>
                  
                  {/* Bottom caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="text-white/90 text-sm font-mono">NFT ID: #SURVIVOR-0042</div>
                  </div>
                </div>
                
                {/* NFT Description */}
                <div className="flex-1">
                  <div className="mb-4 font-mono">
                    <p className="text-white/80 mb-3 text-sm leading-relaxed">
                      Rebuild civilization from the ruins. Survivors focus on community development, resource gathering, 
                      and creating new systems to replace what was lost in the collapse.
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-toxic-neon" />
                        <span className="text-white/80 text-sm">Enhanced resource discovery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-toxic-neon" />
                        <span className="text-white/80 text-sm">Community building bonuses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-toxic-neon" />
                        <span className="text-white/80 text-sm">Radiation immunity perks</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Select Button */}
                <ToxicButton 
                  onClick={() => handleNFTSelect("survivor")}
                  disabled={selectedRole !== null && selectedRole !== "survivor"}
                  className={cn(
                    "mt-4 w-full",
                    selectedRole === "survivor" ? "bg-toxic-neon/20 border-toxic-neon" : ""
                  )}
                >
                  <Shield className="w-5 h-5 mr-2" />
                  {selectedRole === "survivor" ? (
                    <span className="flex items-center">
                      SELECTED <CheckCircle className="w-4 h-4 ml-2" />
                    </span>
                  ) : "BECOME SURVIVOR"}
                </ToxicButton>
              </div>
            </Card>
            
            {/* Selection indicator */}
            {selectedRole === "survivor" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -top-4 -right-4 bg-toxic-neon rounded-full p-1 border-2 border-black z-20"
              >
                <CheckCircle className="w-6 h-6 text-black" />
              </motion.div>
            )}
            
            {/* Hover effects */}
            {hoverState === "survivor" && !selectedRole && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black/80 text-toxic-neon border border-toxic-neon/40 rounded-full px-3 py-1 text-sm font-mono z-20 whitespace-nowrap"
              >
                <Radiation className="inline-block w-4 h-4 mr-1 animate-pulse" />
                SELECT SURVIVOR
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Information section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <div className="inline-block bg-black/60 border border-toxic-neon/30 rounded-md p-3 text-sm text-white/70">
            <Gem className="inline-block text-toxic-neon w-4 h-4 mr-2" />
            Your identity NFT determines your role in the Resistance ecosystem and unlocks unique features
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
