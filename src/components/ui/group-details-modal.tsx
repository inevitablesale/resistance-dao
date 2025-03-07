
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Target, X, CheckCircle, Award } from 'lucide-react';
import { ToxicButton } from './toxic-button';

interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupType: "bounty-hunter" | "survivor" | null;
  onSelect: (role: "bounty-hunter" | "survivor") => void;
}

export function GroupDetailsModal({ isOpen, onClose, groupType, onSelect }: GroupDetailsModalProps) {
  if (!groupType) return null;
  
  const isBountyHunter = groupType === "bounty-hunter";
  const primaryColor = isBountyHunter ? "text-apocalypse-red" : "text-toxic-neon";
  const borderColor = isBountyHunter ? "border-apocalypse-red" : "border-toxic-neon";
  const bgHoverColor = isBountyHunter ? "hover:bg-apocalypse-red/20" : "hover:bg-toxic-neon/20";
  
  const roleTitle = isBountyHunter ? "BOUNTY HUNTER" : "SURVIVOR";
  const roleIcon = isBountyHunter ? <Target className="w-5 h-5" /> : <Shield className="w-5 h-5" />;
  
  // Role-specific content
  const roleDescription = isBountyHunter
    ? "Bounty Hunters track down those responsible for the cryptocolypse and recover stolen assets. They operate in high-risk areas and receive special access to the network's bounty listings."
    : "Survivors focus on rebuilding what was lost, creating sustainable settlements, and developing new systems to replace what was destroyed in the collapse.";
    
  const roleBenefits = isBountyHunter
    ? [
        "Access to all active bounty listings",
        "Enhanced tracking capabilities",
        "Priority resource allocation",
        "Higher rewards for successful missions",
        "Advanced weapons training"
      ]
    : [
        "Settlement development bonuses",
        "Resource discovery enhancement",
        "Community growth acceleration",
        "Technology recovery specialization",
        "Radiation immunity perks"
      ];
      
  const roleSpecialties = isBountyHunter
    ? [
        { name: "Asset Recovery", level: 85 },
        { name: "Threat Neutralization", level: 90 },
        { name: "Tracking", level: 80 },
        { name: "Combat", level: 95 },
        { name: "Network Security", level: 75 }
      ]
    : [
        { name: "Resource Management", level: 90 },
        { name: "Community Building", level: 95 },
        { name: "Radiation Resistance", level: 85 },
        { name: "Tech Recovery", level: 80 },
        { name: "Medical Support", level: 75 }
      ];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className={`relative border-2 ${borderColor} rounded-md p-6 bg-black/95 shadow-xl backdrop-blur-sm`}>
              <button 
                onClick={onClose}
                className={`absolute top-4 right-4 ${primaryColor} ${bgHoverColor} p-2 rounded-full`}
              >
                <X size={18} />
              </button>
              
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isBountyHunter ? 'bg-apocalypse-red/20' : 'bg-toxic-neon/20'} ${borderColor}`}>
                    {roleIcon}
                  </div>
                  <div>
                    <h2 className={`text-2xl font-mono ${primaryColor}`}>{roleTitle}</h2>
                    <p className="text-white/70 text-sm">
                      {isBountyHunter ? 'Offensive Specialist' : 'Defensive Specialist'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-white font-mono text-lg mb-2">Description</h3>
                      <p className="text-white/70 text-sm">
                        {roleDescription}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-mono text-lg mb-2">Benefits</h3>
                      <ul className="space-y-2">
                        {roleBenefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className={`w-4 h-4 mt-0.5 ${primaryColor}`} />
                            <span className="text-white/70 text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-mono text-lg mb-2">Specialties</h3>
                    <div className="space-y-3">
                      {roleSpecialties.map((specialty, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white/80">{specialty.name}</span>
                            <span className={primaryColor}>{specialty.level}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${isBountyHunter ? 'bg-apocalypse-red' : 'bg-toxic-neon'}`} 
                              style={{ width: `${specialty.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-3 border border-dashed border-white/20 rounded">
                      <div className="flex items-center gap-3">
                        <Award className={`w-5 h-5 ${primaryColor}`} />
                        <div>
                          <h4 className="text-white font-mono text-sm">Special Ability</h4>
                          <p className="text-white/70 text-xs">
                            {isBountyHunter 
                              ? "Enhanced tracking system that reveals hidden crypto trails" 
                              : "Advanced resource detection that increases discovery rates by 35%"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-6 flex justify-between items-center">
                  <button 
                    className="text-white/60 text-sm hover:text-white"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  
                  <ToxicButton
                    onClick={() => onSelect(groupType)}
                    className={isBountyHunter ? 'bg-apocalypse-red/10 border-apocalypse-red' : 'bg-toxic-neon/10 border-toxic-neon'}
                  >
                    {roleIcon}
                    {`CONFIRM ${roleTitle} SELECTION`}
                  </ToxicButton>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
