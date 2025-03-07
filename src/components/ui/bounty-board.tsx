
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Lock, Skull, Award, AlertTriangle } from 'lucide-react';
import { Card } from './card';
import { ToxicButton } from './toxic-button';

// Mock bounty data
const bounties = [
  {
    id: "BNT-127",
    target: "CryptoPhantom",
    reward: "250,000",
    difficulty: "High",
    description: "Responsible for the Exchange Collapse of '29. Last seen operating in Sector 5.",
    urgent: true
  },
  {
    id: "BNT-133",
    target: "OracleSaboteur",
    reward: "185,000",
    difficulty: "Medium",
    description: "Manipulated price feeds causing $3.2B in losses. Known associates in Settlement #4.",
    urgent: false
  },
  {
    id: "BNT-142",
    target: "BlockBreaker",
    reward: "320,000",
    difficulty: "Extreme",
    description: "Architect behind the 51% attack on major chains. High-value target, extremely dangerous.",
    urgent: true
  }
];

export function BountyBoard() {
  const [expandedBounty, setExpandedBounty] = useState<string | null>(null);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mb-6"
    >
      <Card className="bg-black/80 border-apocalypse-red/30 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-apocalypse-red" />
            <h3 className="text-apocalypse-red font-mono text-lg">ACTIVE BOUNTIES</h3>
          </div>
          
          <div className="space-y-3">
            <div className="relative">
              {/* Locked overlay */}
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-apocalypse-red mx-auto mb-2" />
                  <p className="text-apocalypse-red font-mono text-sm mb-3">BOUNTY HUNTER AUTH REQUIRED</p>
                  <ToxicButton
                    variant="ghost"
                    size="sm"
                    className="border-apocalypse-red text-apocalypse-red"
                  >
                    SELECT ROLE TO UNLOCK
                  </ToxicButton>
                </div>
              </div>
              
              {/* Bounty listings (blurred behind the overlay) */}
              {bounties.map(bounty => (
                <div 
                  key={bounty.id}
                  className={`
                    p-3 border rounded mb-3 cursor-pointer
                    ${expandedBounty === bounty.id ? 'bg-black/70 border-apocalypse-red' : 'bg-black/60 border-apocalypse-red/20'} 
                  `}
                  onClick={() => setExpandedBounty(expandedBounty === bounty.id ? null : bounty.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-apocalypse-red font-mono">{bounty.id}</span>
                        {bounty.urgent && <AlertTriangle className="h-4 w-4 text-apocalypse-red" />}
                      </div>
                      <h4 className="text-white font-mono text-sm mt-1">TARGET: {bounty.target}</h4>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-apocalypse-red mr-1" />
                        <span className="text-white font-mono text-sm">{bounty.reward}</span>
                      </div>
                      <span className="text-white/60 text-xs">
                        Difficulty: {bounty.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  {expandedBounty === bounty.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-apocalypse-red/30"
                    >
                      <p className="text-white/80 text-sm mb-3">{bounty.description}</p>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                          <Skull className="h-4 w-4 text-apocalypse-red" />
                          <span className="text-white/60 text-xs">Threat Level: {bounty.difficulty}</span>
                        </div>
                        <ToxicButton
                          variant="outline"
                          size="sm"
                          className="text-xs border-apocalypse-red text-apocalypse-red"
                        >
                          ACCEPT MISSION
                        </ToxicButton>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
