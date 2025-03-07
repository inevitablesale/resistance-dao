
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Radiation, X, CheckCircle, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToxicButton } from './toxic-button';

interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupType: "bounty-hunter" | "survivor" | null;
  onSelect: (role: "bounty-hunter" | "survivor") => void;
}

// Character data for each group
const bountyHunterCharacters = [
  { name: "Commander Vex", role: "Guild Leader", bio: "A former military strategist who established the first Bounty Hunter guild in the wasteland. Known for tactical precision and an unwavering moral code." },
  { name: "Cipher", role: "Blockchain Tracker", bio: "Can trace any transaction through the most complex mixing services. Has recovered millions in stolen assets using proprietary tracking algorithms." },
  { name: "Raven", role: "Intelligence Officer", bio: "Specializes in gathering information on scam operations before they launch. Has prevented countless rug pulls through early intervention." },
  { name: "Ironclad", role: "Asset Recovery Specialist", bio: "Expert in smart contract vulnerabilities and exploitation techniques. Uses the same methods as hackers to recover stolen funds." },
  { name: "Echo", role: "Field Operative", bio: "Works undercover to infiltrate criminal organizations. Has taken down three major scam syndicates from the inside." },
  { name: "Nexus", role: "Network Security", bio: "Maintains the secure communication channels used by all Bounty Hunters. Developed an unhackable encryption protocol." },
  { name: "Forge", role: "Weapons Engineer", bio: "Creates specialized digital tools for neutralizing threats. Their exploit prevention system is standard issue for all hunters." },
  { name: "Phantom", role: "Ghost Protocol Agent", bio: "Specializes in making criminals' ill-gotten gains vanish from their wallets. Can execute precision extractions within seconds." },
  { name: "Warden", role: "Boundary Enforcer", bio: "Patrols the edges of the network, identifying and neutralizing threats before they reach valuable assets." },
  { name: "Avalanche", role: "Heavy Tactical", bio: "When diplomatic approaches fail, Avalanche is sent in. Specializes in overwhelming force against the most dangerous criminals." }
];

const survivorCharacters = [
  { name: "Elder Thalia", role: "Haven Founder", bio: "Established the first sustainable post-collapse settlement. Her governance framework has been adopted by dozens of communities." },
  { name: "Gaia", role: "Resource Director", bio: "Has an uncanny ability to locate essential resources in depleted areas. Her mapping system has saved countless communities from resource wars." },
  { name: "Spark", role: "Energy Specialist", bio: "Developed a decentralized power grid that keeps settlements operational even during severe network disruptions." },
  { name: "Root", role: "Agricultural Lead", bio: "Created growing techniques that work in radiation-contaminated soil. Their methods have eliminated food scarcity in multiple regions." },
  { name: "Beacon", role: "Communications Expert", bio: "Maintains the emergency broadcast system that connects all survivor settlements, ensuring no community is ever truly isolated." },
  { name: "Sanctuary", role: "Defense Coordinator", bio: "Designs non-violent security systems that protect settlements without escalating conflicts with outsiders." },
  { name: "Chronicle", role: "Knowledge Keeper", bio: "Has memorized thousands of pre-collapse technologies and ensures this information is preserved for future generations." },
  { name: "Junction", role: "Trade Master", bio: "Established the first inter-settlement commerce routes. Their economic models have created stable currencies in dozens of regions." },
  { name: "Remedy", role: "Medical Director", bio: "Combines pre-collapse medical knowledge with wasteland innovations to provide healthcare in resource-limited environments." },
  { name: "Horizon", role: "Futures Planner", bio: "Specializes in long-term community development. Their 100-year reconstruction plans have become the foundation of the new society." }
];

export function GroupDetailsModal({ 
  isOpen, 
  onClose, 
  groupType,
  onSelect
}: GroupDetailsModalProps) {
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [showCharacterView, setShowCharacterView] = useState(false);
  
  if (!isOpen || !groupType) return null;
  
  const isHunter = groupType === "bounty-hunter";
  const primaryColor = isHunter ? "text-apocalypse-red" : "text-toxic-neon";
  const borderColor = isHunter ? "border-apocalypse-red" : "border-toxic-neon";
  const bgColor = isHunter ? "bg-apocalypse-red" : "bg-toxic-neon";
  const glowColor = isHunter 
    ? "shadow-[0_0_25px_rgba(234,56,76,0.4)]" 
    : "shadow-[0_0_25px_rgba(80,250,123,0.4)]";
  
  const characters = isHunter ? bountyHunterCharacters : survivorCharacters;
  const currentCharacter = characters[currentCharacterIndex];
  
  const nextCharacter = () => {
    setCurrentCharacterIndex((prev) => (prev + 1) % characters.length);
  };
  
  const prevCharacter = () => {
    setCurrentCharacterIndex((prev) => (prev - 1 + characters.length) % characters.length);
  };
  
  const toggleView = () => {
    setShowCharacterView(!showCharacterView);
  };
  
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
          
          {/* Toggle view button */}
          <button 
            onClick={toggleView}
            className={cn(
              "ml-auto p-2 rounded-md transition-colors",
              isHunter ? "bg-apocalypse-red/10 hover:bg-apocalypse-red/20" : "bg-toxic-neon/10 hover:bg-toxic-neon/20"
            )}
          >
            <span className={cn("text-sm font-mono", primaryColor)}>
              {showCharacterView ? "GROUP INFO" : "CHARACTERS"}
            </span>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {showCharacterView ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className={cn("text-xl font-mono", primaryColor)}>
                  <User className="inline-block w-5 h-5 mr-2" />
                  RESISTANCE PERSONNEL ({currentCharacterIndex + 1}/{characters.length})
                </h3>
                
                <div className="flex gap-2">
                  <button 
                    onClick={prevCharacter}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      isHunter ? "hover:bg-apocalypse-red/20" : "hover:bg-toxic-neon/20"
                    )}
                  >
                    <ChevronLeft className={cn("w-5 h-5", primaryColor)} />
                  </button>
                  <button 
                    onClick={nextCharacter}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      isHunter ? "hover:bg-apocalypse-red/20" : "hover:bg-toxic-neon/20"
                    )}
                  >
                    <ChevronRight className={cn("w-5 h-5", primaryColor)} />
                  </button>
                </div>
              </div>
              
              <motion.div
                key={currentCharacterIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "p-6 rounded-lg border",
                  isHunter ? "bg-apocalypse-red/10 border-apocalypse-red/30" : "bg-toxic-neon/10 border-toxic-neon/30"
                )}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center",
                    isHunter ? "bg-apocalypse-red/20" : "bg-toxic-neon/20"
                  )}>
                    <User className={cn("w-8 h-8", primaryColor)} />
                  </div>
                  <div>
                    <h4 className={cn("text-xl font-bold", primaryColor)}>{currentCharacter.name}</h4>
                    <p className="text-white/70">{currentCharacter.role}</p>
                  </div>
                </div>
                
                <p className="text-white/80 leading-relaxed">
                  {currentCharacter.bio}
                </p>
              </motion.div>
              
              <div className="flex justify-center mt-4">
                {characters.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCharacterIndex(index)}
                    className={cn(
                      "w-2 h-2 mx-1 rounded-full transition-all",
                      currentCharacterIndex === index
                        ? isHunter ? "bg-apocalypse-red" : "bg-toxic-neon"
                        : "bg-gray-500"
                    )}
                  />
                ))}
              </div>
            </div>
          ) : (
            isHunter ? (
              <BountyHunterDetails />
            ) : (
              <SurvivorDetails />
            )
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
