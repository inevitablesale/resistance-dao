
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lock, ExternalLink } from 'lucide-react';
import { Card } from './card';
import { cn } from '@/lib/utils';
import { ToxicButton } from './toxic-button';

export function BountyBoard() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
      className="mb-6"
    >
      <Card className={cn(
        "bg-black/90 border-toxic-neon/30 overflow-hidden",
        "border-[1px]"
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-apocalypse-red" />
              <h3 className="text-apocalypse-red font-mono text-lg">ACTIVE BOUNTIES</h3>
            </div>
            <button 
              className="text-apocalypse-red hover:bg-apocalypse-red/20 p-1 rounded"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Locked bounties with blurred content */}
            <div className="relative">
              <div className="p-3 bg-black border border-apocalypse-red/20 rounded">
                <div className="flex flex-col gap-1 blur-sm pointer-events-none">
                  <div className="h-5 bg-apocalypse-red/10 rounded w-3/4"></div>
                  <div className="h-4 bg-apocalypse-red/5 rounded w-1/2"></div>
                  <div className="h-4 bg-apocalypse-red/5 rounded w-5/6"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-apocalypse-red/70" />
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="p-3 bg-black border border-apocalypse-red/20 rounded">
                <div className="flex flex-col gap-1 blur-sm pointer-events-none">
                  <div className="h-5 bg-apocalypse-red/10 rounded w-2/3"></div>
                  <div className="h-4 bg-apocalypse-red/5 rounded w-1/3"></div>
                  <div className="h-4 bg-apocalypse-red/5 rounded w-3/4"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-apocalypse-red/70" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center px-3 py-4 bg-black/60 border border-apocalypse-red/30 rounded">
              <Lock className="h-8 w-8 text-apocalypse-red mb-2" />
              <div className="text-apocalypse-red font-mono text-sm text-center mb-1">
                BOUNTY HUNTER AUTH REQUIRED
              </div>
              <ToxicButton 
                variant="outline" 
                size="sm"
                className="w-full mt-2 border-apocalypse-red/50 text-apocalypse-red"
              >
                <Target className="w-4 h-4 mr-2 text-apocalypse-red" />
                SELECT ROLE TO UNLOCK
              </ToxicButton>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
