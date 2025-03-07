
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Lock, Radiation, Shield, Target } from 'lucide-react';
import { Card } from './card';
import { ToxicButton } from './toxic-button';

export function SettlementMap() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // These coordinates represent settlement locations on our map
  const settlements = [
    { id: 1, x: 25, y: 30, name: "Alpha Base", type: "main", status: "active" },
    { id: 2, x: 45, y: 40, name: "Outpost 7", type: "outpost", status: "active" },
    { id: 3, x: 65, y: 25, name: "Node 12", type: "tech", status: "alert" },
    { id: 4, x: 35, y: 60, name: "Sanctuary", type: "civilians", status: "active" },
    { id: 5, x: 78, y: 70, name: "Watchtower", type: "defense", status: "active" },
    { id: 6, x: 15, y: 75, name: "Recovery Zone", type: "resource", status: "warning" },
  ];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mb-6"
    >
      <Card className="bg-black/80 border-toxic-neon/30 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-toxic-neon" />
              <h3 className="text-toxic-neon font-mono text-lg">SETTLEMENT MAP</h3>
            </div>
            <ToxicButton 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "MINIMIZE" : "EXPAND"}
            </ToxicButton>
          </div>
          
          <div className={`relative overflow-hidden ${isExpanded ? 'h-96' : 'h-48'} transition-all duration-300 ease-in-out`}>
            {/* Map background */}
            <div className="absolute inset-0 bg-[url('/lovable-uploads/ca457542-e761-44f2-acbf-1bf9b4255b78.png')] bg-cover bg-center opacity-20"></div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
            
            {/* Settlements */}
            {settlements.map(settlement => (
              <div 
                key={settlement.id}
                className="absolute w-3 h-3 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${settlement.x}%`, top: `${settlement.y}%` }}
              >
                <div className={`
                  w-3 h-3 rounded-full 
                  ${settlement.status === 'active' ? 'bg-toxic-neon' : 
                    settlement.status === 'alert' ? 'bg-apocalypse-red' : 'bg-yellow-500'}
                  animate-ping absolute opacity-75
                `}></div>
                <div className={`
                  w-3 h-3 rounded-full 
                  ${settlement.status === 'active' ? 'bg-toxic-neon' : 
                    settlement.status === 'alert' ? 'bg-apocalypse-red' : 'bg-yellow-500'}
                  relative
                `}></div>
                
                {isExpanded && (
                  <div className="absolute bg-black/80 border border-toxic-neon/40 text-toxic-neon p-1 rounded text-xs whitespace-nowrap -ml-10 -mt-8">
                    {settlement.name}
                  </div>
                )}
              </div>
            ))}
            
            {/* Locked overlay */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center">
                <Lock className="h-8 w-8 text-toxic-neon mx-auto mb-2" />
                <p className="text-toxic-neon font-mono text-sm mb-3">FULL MAP ACCESS RESTRICTED</p>
                <ToxicButton
                  variant="ghost"
                  size="sm"
                >
                  SELECT ROLE TO UNLOCK
                </ToxicButton>
              </div>
            </div>
          </div>
          
          {isExpanded && (
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-toxic-neon"></div>
                <span className="text-white/70">Active</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-white/70">Warning</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-apocalypse-red"></div>
                <span className="text-white/70">Alert</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
