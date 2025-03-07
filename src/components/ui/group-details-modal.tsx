
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Radiation, X, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToxicButton } from './toxic-button';

interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupType: "bounty-hunter" | "survivor" | null;
  onSelect: (role: "bounty-hunter" | "survivor") => void;
}

export function GroupDetailsModal({ 
  isOpen, 
  onClose, 
  groupType,
  onSelect
}: GroupDetailsModalProps) {
  if (!isOpen || !groupType) return null;
  
  const isHunter = groupType === "bounty-hunter";
  const primaryColor = isHunter ? "text-apocalypse-red" : "text-toxic-neon";
  const borderColor = isHunter ? "border-apocalypse-red" : "border-toxic-neon";
  const bgColor = isHunter ? "bg-apocalypse-red" : "bg-toxic-neon";
  const glowColor = isHunter 
    ? "shadow-[0_0_25px_rgba(234,56,76,0.4)]" 
    : "shadow-[0_0_25px_rgba(80,250,123,0.4)]";
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/70"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className={cn(
          "relative w-full max-w-2xl rounded-lg bg-black border-2 overflow-hidden",
          borderColor,
          glowColor
        )}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 p-1 rounded-full z-10",
            `hover:${bgColor}/20 transition-colors`
          )}
        >
          <X className={cn("w-6 h-6", primaryColor)} />
        </button>
        
        {/* Header with glowing effect */}
        <div className={cn(
          "p-6 flex items-center gap-4 border-b",
          isHunter ? "border-apocalypse-red/30" : "border-toxic-neon/30"
        )}>
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            isHunter 
              ? "bg-apocalypse-red/20 border border-apocalypse-red/40"
              : "bg-toxic-neon/20 border border-toxic-neon/40"
          )}>
            {isHunter 
              ? <Target className="w-7 h-7 text-apocalypse-red" />
              : <Shield className="w-7 h-7 text-toxic-neon" />
            }
          </div>
          <div>
            <h2 className={cn("text-2xl font-mono tracking-tight", primaryColor)}>
              {isHunter ? "BOUNTY HUNTER" : "SURVIVOR"} RESISTANCE
            </h2>
            <p className="text-white/70 text-sm">
              <Radiation className="inline-block w-4 h-4 mr-1" />
              {isHunter ? "Offensive specialists" : "Defensive community builders"}
            </p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isHunter ? (
            <BountyHunterDetails />
          ) : (
            <SurvivorDetails />
          )}
          
          {/* Footer with action button */}
          <div className="mt-8 flex justify-end">
            <ToxicButton 
              onClick={() => {
                onSelect(groupType);
                onClose();
              }}
              className={isHunter ? "border-apocalypse-red" : "border-toxic-neon"}
            >
              {isHunter 
                ? <Target className="w-5 h-5 mr-2" /> 
                : <Shield className="w-5 h-5 mr-2" />
              }
              CONFIRM SELECTION
            </ToxicButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Group-specific content components
function BountyHunterDetails() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-xl text-apocalypse-red font-mono mb-3 flex items-center">
          <Target className="w-5 h-5 mr-2" /> BOUNTY HUNTER MANIFESTO
        </h3>
        <p className="text-white/80 mb-4 leading-relaxed">
          We are the enforcers of the new order. In a wasteland where crypto scammers and bad actors prey on the weak, 
          Bounty Hunters restore justice through direct action. We track, we hunt, and we neutralize threats to the 
          resistance economy.
        </p>
        <div className="bg-apocalypse-red/10 p-4 rounded border border-apocalypse-red/30 font-mono text-sm text-white/90 mb-6">
          <p className="mb-2">
            "Justice in the wasteland isn't delivered through committees and debates. It's delivered through 
            those willing to venture into the toxic zones and confront the criminals directly. We are those people."
          </p>
          <p className="text-right text-apocalypse-red">— Commander Vex, First Wasteland Bounty Guild</p>
        </div>
      </section>
      
      <section>
        <h3 className="text-xl text-apocalypse-red font-mono mb-3 flex items-center">
          <Radiation className="w-5 h-5 mr-2" /> SPECIALIZED CAPABILITIES
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 bg-black/40 p-3 rounded border border-apocalypse-red/20">
            <CheckCircle className="w-5 h-5 text-apocalypse-red shrink-0 mt-0.5" />
            <div>
              <h4 className="text-apocalypse-red font-mono">Enhanced Tracking Systems</h4>
              <p className="text-white/80 text-sm">Access to advanced blockchain analytics tools to identify and locate bad actors in the crypto wasteland.</p>
            </div>
          </li>
          <li className="flex items-start gap-3 bg-black/40 p-3 rounded border border-apocalypse-red/20">
            <CheckCircle className="w-5 h-5 text-apocalypse-red shrink-0 mt-0.5" />
            <div>
              <h4 className="text-apocalypse-red font-mono">Combat-Ready Equipment</h4>
              <p className="text-white/80 text-sm">Specialized tools for offensive security operations, including vulnerability scanners and exploit prevention systems.</p>
            </div>
          </li>
          <li className="flex items-start gap-3 bg-black/40 p-3 rounded border border-apocalypse-red/20">
            <CheckCircle className="w-5 h-5 text-apocalypse-red shrink-0 mt-0.5" />
            <div>
              <h4 className="text-apocalypse-red font-mono">Reward Multipliers</h4>
              <p className="text-white/80 text-sm">Higher percentage of recovered funds and additional bounty incentives for successful neutralization of crypto criminals.</p>
            </div>
          </li>
        </ul>
      </section>
      
      <section>
        <h3 className="text-xl text-apocalypse-red font-mono mb-3 flex items-center">
          <Target className="w-5 h-5 mr-2" /> PRIMARY OBJECTIVES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/40 p-4 rounded border border-apocalypse-red/20">
            <h4 className="text-apocalypse-red font-mono mb-2">Neutralize Threats</h4>
            <p className="text-white/80 text-sm">Identify and take down malicious actors, scam operations, and those who threaten the stability of our blockchain economy.</p>
          </div>
          <div className="bg-black/40 p-4 rounded border border-apocalypse-red/20">
            <h4 className="text-apocalypse-red font-mono mb-2">Asset Recovery</h4>
            <p className="text-white/80 text-sm">Track and recover stolen crypto assets, returning them to their rightful owners or the community treasury.</p>
          </div>
          <div className="bg-black/40 p-4 rounded border border-apocalypse-red/20">
            <h4 className="text-apocalypse-red font-mono mb-2">Security Enforcement</h4>
            <p className="text-white/80 text-sm">Patrol the network perimeter, identifying vulnerabilities before they can be exploited by wasteland raiders.</p>
          </div>
          <div className="bg-black/40 p-4 rounded border border-apocalypse-red/20">
            <h4 className="text-apocalypse-red font-mono mb-2">Intel Gathering</h4>
            <p className="text-white/80 text-sm">Collect and share threat intelligence to build a stronger defense against organized crime in the wasteland.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SurvivorDetails() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-xl text-toxic-neon font-mono mb-3 flex items-center">
          <Shield className="w-5 h-5 mr-2" /> SURVIVOR COVENANT
        </h3>
        <p className="text-white/80 mb-4 leading-relaxed">
          We are the builders of tomorrow. Where others see only destruction, Survivors envision a new society 
          rising from the ashes. Through community empowerment and collaborative innovation, we create sustainable 
          systems that will endure long after the wasteland has been reclaimed.
        </p>
        <div className="bg-toxic-neon/10 p-4 rounded border border-toxic-neon/30 font-mono text-sm text-white/90 mb-6">
          <p className="mb-2">
            "The true measure of our resistance isn't how many enemies we defeat, but how many communities 
            we save and rebuild. Every settlement we establish is a beacon of hope in the darkness of the wasteland."
          </p>
          <p className="text-right text-toxic-neon">— Elder Thalia, Founder of the Haven Network</p>
        </div>
      </section>
      
      <section>
        <h3 className="text-xl text-toxic-neon font-mono mb-3 flex items-center">
          <Radiation className="w-5 h-5 mr-2" /> COMMUNITY EMPOWERMENT
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 bg-black/40 p-3 rounded border border-toxic-neon/20">
            <CheckCircle className="w-5 h-5 text-toxic-neon shrink-0 mt-0.5" />
            <div>
              <h4 className="text-toxic-neon font-mono">Resource Discovery</h4>
              <p className="text-white/80 text-sm">Enhanced ability to locate and distribute critical resources across survivor communities and settlements.</p>
            </div>
          </li>
          <li className="flex items-start gap-3 bg-black/40 p-3 rounded border border-toxic-neon/20">
            <CheckCircle className="w-5 h-5 text-toxic-neon shrink-0 mt-0.5" />
            <div>
              <h4 className="text-toxic-neon font-mono">Radiation Immunity</h4>
              <p className="text-white/80 text-sm">Special protective measures that allow settlement and farming in areas others would find uninhabitable.</p>
            </div>
          </li>
          <li className="flex items-start gap-3 bg-black/40 p-3 rounded border border-toxic-neon/20">
            <CheckCircle className="w-5 h-5 text-toxic-neon shrink-0 mt-0.5" />
            <div>
              <h4 className="text-toxic-neon font-mono">Community Multipliers</h4>
              <p className="text-white/80 text-sm">Governance power increases with each community member you recruit and each settlement you help establish.</p>
            </div>
          </li>
        </ul>
      </section>
      
      <section>
        <h3 className="text-xl text-toxic-neon font-mono mb-3 flex items-center">
          <Shield className="w-5 h-5 mr-2" /> RECONSTRUCTION OBJECTIVES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/40 p-4 rounded border border-toxic-neon/20">
            <h4 className="text-toxic-neon font-mono mb-2">Build Settlements</h4>
            <p className="text-white/80 text-sm">Establish and grow self-sustaining communities with robust governance and resource-sharing systems.</p>
          </div>
          <div className="bg-black/40 p-4 rounded border border-toxic-neon/20">
            <h4 className="text-toxic-neon font-mono mb-2">Knowledge Preservation</h4>
            <p className="text-white/80 text-sm">Document and share critical information about blockchain technology, ensuring no knowledge is lost to time.</p>
          </div>
          <div className="bg-black/40 p-4 rounded border border-toxic-neon/20">
            <h4 className="text-toxic-neon font-mono mb-2">Trade Networks</h4>
            <p className="text-white/80 text-sm">Create and maintain secure transaction corridors between survivor settlements, enabling commerce and cooperation.</p>
          </div>
          <div className="bg-black/40 p-4 rounded border border-toxic-neon/20">
            <h4 className="text-toxic-neon font-mono mb-2">Infrastructure Restoration</h4>
            <p className="text-white/80 text-sm">Rebuild critical systems and develop resilient infrastructure that can withstand future crises.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
