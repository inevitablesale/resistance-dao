import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Map, BookOpen, Coins, Lock } from 'lucide-react';
import { ArchiveMapVisualization } from './ArchiveMapVisualization';
import { ArchiveEntriesFeed } from './ArchiveEntriesFeed';
import { ResourceFlow } from './ResourceFlow';
import { archiveEntries } from '@/data/archiveEntries';
import { ArchiveTimeline } from './ArchiveTimeline';
import { FeatureUnlock } from '@/hooks/useRadiationSystem';

interface ArchiveDashboardProps {
  currentRadiation: number;
  totalHolders: number;
  featureUnlocks: FeatureUnlock[];
  nextFeatureUnlock: FeatureUnlock | null;
  narrativeContext: string;
  reductionPerHolder: number;
}

export const ArchiveDashboard = ({
  currentRadiation,
  totalHolders,
  featureUnlocks,
  nextFeatureUnlock,
  narrativeContext,
  reductionPerHolder
}: ArchiveDashboardProps) => {
  const [activeTab, setActiveTab] = useState('map');
  
  // Get available entries based on radiation level
  const getAvailableEntries = () => {
    return archiveEntries.filter(entry => entry.radiationLevel >= currentRadiation);
  };
  
  // Check if a feature is unlocked based on radiation level
  const isFeatureUnlocked = (requiredLevel: number) => {
    return currentRadiation <= requiredLevel;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-mono text-toxic-neon mb-2">The Last Archive Dashboard</h1>
        <p className="text-white/70">
          Current Radiation Level: <span className="text-toxic-neon font-mono">{currentRadiation}%</span> • 
          Archive Units: <span className="text-toxic-neon font-mono">{totalHolders}</span> • 
          Network Status: <span className="text-toxic-neon font-mono">
            {currentRadiation > 90 ? "Critical" : 
             currentRadiation > 75 ? "Unstable" : 
             currentRadiation > 50 ? "Operational" : 
             currentRadiation > 25 ? "Enhanced" : "Optimal"}
          </span>
        </p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" /> Network Map
          </TabsTrigger>
          <TabsTrigger value="entries" className="flex items-center gap-2" disabled={!isFeatureUnlocked(75)}>
            <BookOpen className="h-4 w-4" /> Archive Entries {!isFeatureUnlocked(75) && <Lock className="h-3 w-3 ml-1" />}
          </TabsTrigger>
          <TabsTrigger value="economy" className="flex items-center gap-2" disabled={!isFeatureUnlocked(50)}>
            <Coins className="h-4 w-4" /> Resource Flows {!isFeatureUnlocked(50) && <Lock className="h-3 w-3 ml-1" />}
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Database className="h-4 w-4" /> Timeline
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="mt-0">
          <ArchiveMapVisualization 
            currentRadiation={currentRadiation}
            totalHolders={totalHolders}
            featureUnlocks={featureUnlocks}
            narrativeContext={narrativeContext}
          />
        </TabsContent>
        
        <TabsContent value="entries" className="mt-0">
          {isFeatureUnlocked(75) ? (
            <ArchiveEntriesFeed 
              currentRadiation={currentRadiation}
              entries={archiveEntries}
            />
          ) : (
            <div className="text-center py-12 text-white/60">
              <Lock className="h-8 w-8 mx-auto mb-3 text-white/40" />
              <h3 className="text-lg mb-2">Archive Entries Locked</h3>
              <p>Radiation must be reduced to 75% or lower to access archive entries.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="economy" className="mt-0">
          {isFeatureUnlocked(50) ? (
            <ResourceFlow 
              currentRadiation={currentRadiation}
              totalHolders={totalHolders}
            />
          ) : (
            <div className="text-center py-12 text-white/60">
              <Lock className="h-8 w-8 mx-auto mb-3 text-white/40" />
              <h3 className="text-lg mb-2">Resource Flows Locked</h3>
              <p>Radiation must be reduced to 50% or lower to access economic resources.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-0">
          <ArchiveTimeline 
            currentRadiation={currentRadiation}
            totalHolders={totalHolders}
            reductionPerHolder={reductionPerHolder}
            featureUnlocks={featureUnlocks}
            nextFeatureUnlock={nextFeatureUnlock}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
