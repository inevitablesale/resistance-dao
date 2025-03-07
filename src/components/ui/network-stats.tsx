
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Radio, Shield, Target, Radiation, Database } from 'lucide-react';
import { Card } from './card';

export function NetworkStats() {
  // Simulate changing network stats
  const [stats, setStats] = useState({
    survivors: 12458,
    radioSubscribers: 8721,
    settlements: 23,
    activeBounties: 145,
    resourcesRecovered: "1.25M",
  });
  
  // Randomly update one stat every few seconds for dynamic effect
  useEffect(() => {
    const interval = setInterval(() => {
      const randomChange = Math.floor(Math.random() * 10) - 5; // Random number between -5 and 5
      
      setStats(prevStats => {
        const statToUpdate = Math.floor(Math.random() * 5);
        
        switch(statToUpdate) {
          case 0:
            return { ...prevStats, survivors: Math.max(10000, prevStats.survivors + randomChange * 10) };
          case 1:
            return { ...prevStats, radioSubscribers: Math.max(8000, prevStats.radioSubscribers + randomChange * 8) };
          case 2:
            return { ...prevStats, settlements: Math.max(20, prevStats.settlements + (randomChange > 0 ? 1 : 0)) };
          case 3:
            return { ...prevStats, activeBounties: Math.max(100, prevStats.activeBounties + randomChange * 2) };
          case 4:
            // For resources, we'll just toggle between a few values
            const resources = ["1.25M", "1.26M", "1.24M", "1.27M"];
            const newIdx = (resources.indexOf(prevStats.resourcesRecovered) + 1) % resources.length;
            return { ...prevStats, resourcesRecovered: resources[newIdx] };
          default:
            return prevStats;
        }
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="mb-6"
    >
      <Card className="bg-black/80 border-toxic-neon/30">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-5 w-5 text-toxic-neon" />
            <h3 className="text-toxic-neon font-mono text-lg">NETWORK STATISTICS</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div className="p-2 bg-black/60 border border-toxic-neon/20 rounded flex items-center gap-2">
              <Users className="h-4 w-4 text-toxic-neon flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-white/70">Survivors</span>
                <span className="text-white font-mono">{stats.survivors.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="p-2 bg-black/60 border border-toxic-neon/20 rounded flex items-center gap-2">
              <Radio className="h-4 w-4 text-toxic-neon flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-white/70">Radio Subs</span>
                <span className="text-white font-mono">{stats.radioSubscribers.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="p-2 bg-black/60 border border-toxic-neon/20 rounded flex items-center gap-2">
              <Shield className="h-4 w-4 text-toxic-neon flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-white/70">Settlements</span>
                <span className="text-white font-mono">{stats.settlements}</span>
              </div>
            </div>
            
            <div className="p-2 bg-black/60 border border-toxic-neon/20 rounded flex items-center gap-2">
              <Target className="h-4 w-4 text-apocalypse-red flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-white/70">Bounties</span>
                <span className="text-white font-mono">{stats.activeBounties}</span>
              </div>
            </div>
            
            <div className="p-2 bg-black/60 border border-toxic-neon/20 rounded flex items-center gap-2 col-span-1 sm:col-span-2">
              <Radiation className="h-4 w-4 text-toxic-neon flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-white/70">Resources Recovered</span>
                <span className="text-white font-mono">{stats.resourcesRecovered}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
