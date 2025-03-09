
import React from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { FeatureUnlock } from '@/hooks/useRadiationSystem';
import { Radiation, Lock, Unlock, Clock, Network, Database, Building, Globe, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArchiveTimelineProps {
  currentRadiation: number;
  totalHolders: number;
  reductionPerHolder: number;
  featureUnlocks: FeatureUnlock[];
  nextFeatureUnlock: FeatureUnlock | null;
}

export function ArchiveTimeline({ 
  currentRadiation, 
  totalHolders, 
  reductionPerHolder,
  featureUnlocks,
  nextFeatureUnlock
}: ArchiveTimelineProps) {
  
  // Get category icon
  const getCategoryIcon = (category: 'economic' | 'social' | 'governance') => {
    switch (category) {
      case 'economic':
        return <Database className="h-4 w-4 text-toxic-neon" />;
      case 'social':
        return <Users className="h-4 w-4 text-amber-400" />;
      case 'governance':
        return <Building className="h-4 w-4 text-purple-400" />;
      default:
        return <Database className="h-4 w-4 text-toxic-neon" />;
    }
  };
  
  // Calculate how many more holders needed for next unlock
  const calculateMoreHoldersNeeded = () => {
    if (!nextFeatureUnlock) return 0;
    const neededReduction = currentRadiation - nextFeatureUnlock.radiationLevel;
    return Math.ceil(neededReduction / reductionPerHolder);
  };
  
  // Calculate timeline percentage
  const calculateTimelineProgress = () => {
    // From 100% to 0% radiation
    return 100 - currentRadiation;
  };
  
  const moreHoldersNeeded = calculateMoreHoldersNeeded();

  return (
    <ToxicCard className="bg-black/80 border-toxic-neon/30 p-5 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-toxic-neon/10">
          <Network className="h-6 w-6 text-toxic-neon" />
        </div>
        <div>
          <h2 className="text-xl font-mono text-toxic-neon">Rebuilding the Network</h2>
          <p className="text-white/60 text-sm">Archive Restoration Timeline</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/70">Restoration Progress</span>
          <span className="text-toxic-neon font-mono">{calculateTimelineProgress().toFixed(1)}%</span>
        </div>
        <ToxicProgress 
          value={calculateTimelineProgress()} 
          variant="radiation" 
          className="h-3 mb-3" 
        />
        
        <div className="flex justify-between text-xs mt-1">
          <span className="text-white/60">0%</span>
          <span className="text-toxic-neon">100%</span>
        </div>
      </div>
      
      {nextFeatureUnlock && (
        <motion.div 
          className="bg-black/50 border border-amber-500/30 rounded-lg p-3 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <h4 className="text-amber-400 font-mono">Next System Recovery</h4>
          </div>
          <div className="flex items-center gap-2 mb-3">
            {getCategoryIcon(nextFeatureUnlock.category)}
            <h5 className="text-white font-mono">{nextFeatureUnlock.name}</h5>
          </div>
          <p className="text-white/70 text-sm mb-3">
            {nextFeatureUnlock.narrative || nextFeatureUnlock.description}
          </p>
          <div className="flex justify-between text-xs">
            <span className="text-white/50">Required Radiation Level</span>
            <span className="text-amber-400 font-mono">{nextFeatureUnlock.radiationLevel}%</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-white/50">More Archive Units Needed</span>
            <span className="text-amber-400 font-mono">{moreHoldersNeeded}</span>
          </div>
          <ToxicProgress 
            value={(totalHolders / (totalHolders + moreHoldersNeeded)) * 100}
            variant="radiation" 
            className="h-2 mt-3" 
          />
        </motion.div>
      )}
      
      <div className="space-y-2">
        <h3 className="text-lg font-mono text-toxic-neon mb-3">System Recovery Timeline</h3>
        
        {featureUnlocks.map((feature, index) => (
          <motion.div 
            key={feature.radiationLevel}
            className="relative pl-8 pb-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            {/* Timeline connector line */}
            {index < featureUnlocks.length - 1 && (
              <div 
                className={`absolute left-4 top-4 bottom-0 w-0.5 ${
                  feature.unlocked ? 'bg-toxic-neon/50' : 'bg-gray-700/50'
                }`} 
              />
            )}
            
            {/* Timeline node */}
            <div 
              className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${
                feature.unlocked 
                  ? 'bg-toxic-neon/20 border border-toxic-neon/50' 
                  : 'bg-gray-900/50 border border-gray-700/50'
              }`}
            >
              {feature.unlocked ? (
                <Unlock className="h-4 w-4 text-toxic-neon" />
              ) : (
                <Lock className="h-4 w-4 text-gray-600" />
              )}
            </div>
            
            {/* Timeline content */}
            <div 
              className={`rounded-md p-3 ${
                feature.unlocked 
                  ? 'bg-toxic-neon/10 border border-toxic-neon/30' 
                  : 'bg-gray-900/30 border border-gray-800/30'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center">
                  {getCategoryIcon(feature.category)}
                  <h4 className={`ml-2 font-mono ${
                    feature.unlocked ? 'text-toxic-neon' : 'text-gray-400'
                  }`}>
                    {feature.name}
                  </h4>
                </div>
                <ToxicBadge variant="outline" className={
                  feature.unlocked 
                    ? 'text-toxic-neon border-toxic-neon/30' 
                    : 'text-gray-500 border-gray-700/30'
                }>
                  {feature.radiationLevel}%
                </ToxicBadge>
              </div>
              
              <p className={`text-sm ${feature.unlocked ? 'text-white/80' : 'text-white/40'}`}>
                {feature.narrative || feature.description}
              </p>
              
              <div className="flex items-center mt-2">
                <Radiation className={`h-3 w-3 mr-1 ${
                  feature.unlocked ? 'text-toxic-neon' : 'text-gray-600'
                }`} />
                <span className={`text-xs ${
                  feature.unlocked ? 'text-white/70' : 'text-white/40'
                }`}>
                  {feature.unlocked 
                    ? 'System Online' 
                    : `Requires ${feature.radiationLevel}% radiation`}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </ToxicCard>
  );
}
