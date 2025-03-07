
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollText, ChevronDown, ChevronUp, Radiation } from 'lucide-react';
import { Card } from './card';
import { Button } from './button';
import { ToxicButton } from './toxic-button';

export function HistoricalRecords() {
  const [isExpanded, setIsExpanded] = useState(false);
  
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
              <ScrollText className="h-5 w-5 text-toxic-neon" />
              <h3 className="text-toxic-neon font-mono text-lg">HISTORICAL ARCHIVES</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-toxic-neon hover:bg-toxic-neon/20"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="text-white/70 text-sm">
            <p className="mb-2">Access to the RESISTANCE™ Network's historical records from before the cryptocolypse.</p>
            
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-4 font-mono text-xs leading-relaxed"
              >
                <div className="p-3 border border-toxic-neon/20 bg-black/60 rounded">
                  <p className="text-toxic-neon mb-1">2029-03-15 | EMERGENCY ALERT</p>
                  <p>The mass blockchain collapse has triggered widespread technical failures across all financial networks. 70% of digital assets have been entirely erased from existence.</p>
                </div>
                
                <div className="p-3 border border-toxic-neon/20 bg-black/60 rounded">
                  <p className="text-toxic-neon mb-1">2029-03-18 | RESISTANCE FORMED</p>
                  <p>First Resistance Network node established. Recruitment of survivors begins. Secure communication channels established using remaining decentralized infrastructure.</p>
                </div>
                
                <div className="p-3 border border-toxic-neon/20 bg-black/60 rounded">
                  <p className="text-toxic-neon mb-1">2029-05-02 | BOUNTY SYSTEM</p>
                  <p>Implementation of bounty system to track down those responsible for the cryptocolypse. First recovery of stolen assets completed. Resource distribution protocols established.</p>
                </div>
                
                <div className="p-3 border border-toxic-neon/20 bg-black/60 rounded">
                  <p className="text-toxic-neon mb-1">2030-01-10 | SETTLEMENTS</p>
                  <p>First permanent Resistance settlement established. Decentralized governance structure implemented. Begin rebuilding technological infrastructure with security protocols.</p>
                </div>
                
                <ToxicButton 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2"
                >
                  <Radiation className="h-4 w-4 mr-2" />
                  REQUEST FULL ACCESS
                </ToxicButton>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
