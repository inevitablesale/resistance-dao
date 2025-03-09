
import React from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { Shield, ExternalLink, Radiation, Users, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArchiveCallToActionProps {
  currentRadiation: number;
  totalHolders: number;
}

export function ArchiveCallToAction({ currentRadiation, totalHolders }: ArchiveCallToActionProps) {
  // OpenSea collection URL
  const openSeaUrl = "https://opensea.io/collection/resistance-collection";
  
  // Calculate impact of one new holder
  const newHolderImpact = 0.1; // 0.1% reduction per holder
  const potentialNewRadiation = Math.max(0, currentRadiation - newHolderImpact).toFixed(1);
  
  return (
    <ToxicCard className="bg-black/80 border-toxic-neon/30 p-5">
      <motion.div 
        className="flex flex-col md:flex-row gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-toxic-neon/10">
              <Shield className="h-6 w-6 text-toxic-neon" />
            </div>
            <div>
              <h2 className="text-xl font-mono text-toxic-neon">Join the Resistance</h2>
              <p className="text-white/60 text-sm">Help Restore the Archive</p>
            </div>
          </div>
          
          <p className="text-white/80 mb-4">
            Each recovered Archive unit (represented by an NFT) reduces global radiation by 0.1%. 
            By acquiring an NFT, you directly contribute to restoring humanity's knowledge base
            and unlocking new features for all users.
          </p>
          
          <div className="mb-6">
            <div className="bg-black/40 rounded-lg p-4 border border-toxic-neon/20 mb-4">
              <h3 className="text-toxic-neon font-mono mb-2">Your Impact</h3>
              <div className="flex justify-between mb-1">
                <span className="text-white/70">Current Radiation</span>
                <span className="text-toxic-neon font-mono">{currentRadiation}%</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-white/70">Your Reduction</span>
                <span className="text-toxic-neon font-mono">-{newHolderImpact}%</span>
              </div>
              <div className="flex justify-between mb-1 border-t border-toxic-neon/10 pt-1 mt-1">
                <span className="text-white/70">New Radiation Level</span>
                <span className="text-toxic-neon font-mono">{potentialNewRadiation}%</span>
              </div>
            </div>
            
            <ToxicButton 
              variant="default" 
              size="lg"
              className="w-full mb-3"
              onClick={() => window.open(openSeaUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Acquire Archive Unit on OpenSea
            </ToxicButton>
            
            <ToxicButton 
              variant="outline" 
              className="w-full"
              onClick={() => window.open("/referral", "_blank")}
            >
              <Target className="h-4 w-4 mr-2" />
              Generate Referral Link
            </ToxicButton>
          </div>
        </div>
        
        <div className="flex-1 bg-black/70 rounded-lg p-5 border border-toxic-neon/10">
          <h3 className="text-toxic-neon font-mono mb-4">Archive Recovery FAQ</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-white/90 font-mono text-sm mb-1">What are Archive Units?</h4>
              <p className="text-white/60 text-xs">
                Archive Units are NFTs that represent connection nodes to The Last Archive. 
                Each unit owned by a unique holder reduces global radiation interference by 0.1%.
              </p>
            </div>
            
            <div>
              <h4 className="text-white/90 font-mono text-sm mb-1">How do I acquire an Archive Unit?</h4>
              <p className="text-white/60 text-xs">
                Units can be purchased on OpenSea. Each of the 19 Archive Units is unique,
                with different capabilities revealed as radiation levels decrease.
              </p>
            </div>
            
            <div>
              <h4 className="text-white/90 font-mono text-sm mb-1">What happens when radiation decreases?</h4>
              <p className="text-white/60 text-xs">
                As the global radiation level drops, new Archive systems come online,
                unlocking features like communication channels, resource tracking, 
                and governance systems.
              </p>
            </div>
            
            <div>
              <h4 className="text-white/90 font-mono text-sm mb-1">Do I need a crypto wallet?</h4>
              <p className="text-white/60 text-xs">
                Yes, you'll need a wallet compatible with OpenSea to purchase and hold
                Archive Units. Connect your wallet above to interact with the Archive.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </ToxicCard>
  );
}
