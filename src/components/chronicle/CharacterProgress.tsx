
import React, { useState } from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { User, Shield, Zap, Target, Award, Flag, Network, BookOpen, Radiation, Eye, Hammer } from 'lucide-react';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import { ModelPreview } from '@/components/marketplace/ModelPreview';
import { motion } from 'framer-motion';
import { ToxicButton } from '@/components/ui/toxic-button';

interface CharacterProgressProps {
  className?: string;
  role?: 'sentinel' | 'pioneer' | undefined;
}

export function CharacterProgress({ className, role }: CharacterProgressProps) {
  const { isConnected } = useCustomWallet();
  const [viewingModel, setViewingModel] = useState(false);
  
  // This would come from actual user data in production
  const characterStats = {
    level: 2,
    reputation: 65,
    influence: 42,
    radiation: 28,
    territories: 3,
    chronicles: 8,
    achievements: 5
  };
  
  // Character model based on role
  const characterModel = role === 'sentinel' 
    ? "https://gateway.pinata.cloud/ipfs/bafybeiavqxeov62wgj6upfpvq6g4vpvot4mnwl3ggunxp27sbfjgs4hlfq"
    : "https://gateway.pinata.cloud/ipfs/bafybeifzvpyj5znhgjq22cbjyzav5zsvese3m3klbkc4lcdm3fdbbxiooa";
  
  // Calculate XP percentage to next level
  const levelProgress = ((characterStats.level % 1) * 100) || 75;
  
  // Determine character class based on role
  const characterRole = role || 'sentinel';
  const getRoleColor = () => {
    return characterRole === 'sentinel' ? 'text-purple-400' : 'text-amber-400';
  };
  
  const getRoleBadge = () => {
    if (characterRole === 'sentinel') {
      return (
        <ToxicBadge variant="marketplace" className="bg-purple-900/60 text-purple-300">
          <Eye className="w-3 h-3 mr-1" /> SENTINEL
        </ToxicBadge>
      );
    } else {
      return (
        <ToxicBadge variant="marketplace" className="bg-amber-900/60 text-amber-300">
          <Hammer className="w-3 h-3 mr-1" /> PIONEER
        </ToxicBadge>
      );
    }
  };
  
  const toggleModel = () => {
    setViewingModel(!viewingModel);
  };
  
  if (!isConnected) {
    return null;
  }
  
  return (
    <ToxicCard className={`bg-black/70 border-toxic-neon/30 p-4 relative ${className}`}>
      <div className="scanline"></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-toxic-neon/10">
            <User className="w-4 h-4 text-toxic-neon" />
          </div>
          <h3 className="text-lg font-mono text-toxic-neon">SURVIVOR PROFILE</h3>
        </div>
        {getRoleBadge()}
      </div>
      
      {/* 3D Model View */}
      {viewingModel ? (
        <div className="mb-4 relative">
          <ModelPreview 
            modelUrl={characterModel} 
            height="220px" 
            width="100%" 
            autoRotate={true}
            className="rounded-lg overflow-hidden"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleModel}
            className="absolute top-2 right-2 bg-black/70 p-1 rounded-full"
          >
            <Target className="w-4 h-4 text-toxic-neon" />
          </motion.button>
          <ToxicButton 
            variant="outline" 
            size="sm" 
            className="absolute bottom-3 right-3 bg-black/60 border-toxic-neon/40 text-toxic-neon text-xs"
            onClick={toggleModel}
          >
            Hide Model
          </ToxicButton>
        </div>
      ) : (
        <div className="mb-4 h-10 flex items-center justify-between">
          <span className="text-white/70 text-sm">Level {Math.floor(characterStats.level)}</span>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleModel}
            className="cursor-pointer flex items-center gap-1 bg-toxic-neon/10 px-2 py-1 rounded text-xs text-toxic-neon"
          >
            <Eye className="w-3 h-3" /> View Character
          </motion.div>
          <span className={`text-sm font-mono ${getRoleColor()}`}>
            {levelProgress}% to Level {Math.floor(characterStats.level) + 1}
          </span>
        </div>
      )}
      
      <div className="mb-4">
        <ToxicProgress 
          value={levelProgress} 
          className="h-2" 
          variant={characterRole === 'sentinel' ? 'governance' : 'staking'} 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-black/40 border border-toxic-neon/10 p-2 rounded">
          <div className="flex justify-between items-center mb-1">
            <span className="flex items-center text-xs text-white/70">
              <Shield className="w-3 h-3 mr-1 text-toxic-neon/70" /> Reputation
            </span>
            <span className="text-xs text-toxic-neon">{characterStats.reputation}%</span>
          </div>
          <ToxicProgress value={characterStats.reputation} className="h-1" variant="reputation" />
        </div>
        
        <div className="bg-black/40 border border-toxic-neon/10 p-2 rounded">
          <div className="flex justify-between items-center mb-1">
            <span className="flex items-center text-xs text-white/70">
              <Network className="w-3 h-3 mr-1 text-toxic-neon/70" /> Influence
            </span>
            <span className="text-xs text-toxic-neon">{characterStats.influence}%</span>
          </div>
          <ToxicProgress value={characterStats.influence} className="h-1" variant="governance" />
        </div>
        
        <div className="bg-black/40 border border-toxic-neon/10 p-2 rounded">
          <div className="flex justify-between items-center mb-1">
            <span className="flex items-center text-xs text-white/70">
              <Radiation className="w-3 h-3 mr-1 text-toxic-neon/70" /> Radiation
            </span>
            <span className="text-xs text-toxic-neon">{characterStats.radiation}%</span>
          </div>
          <ToxicProgress value={characterStats.radiation} className="h-1" variant="radiation" />
        </div>
        
        <div className="bg-black/40 border border-toxic-neon/10 p-2 rounded">
          <div className="flex justify-between items-center mb-1">
            <span className="flex items-center text-xs text-white/70">
              <Flag className="w-3 h-3 mr-1 text-toxic-neon/70" /> Territories
            </span>
            <span className="text-xs text-toxic-neon">{characterStats.territories}</span>
          </div>
          <ToxicProgress value={(characterStats.territories / 5) * 100} className="h-1" variant="staking" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-black/40 border border-toxic-neon/10 p-2 rounded text-center"
        >
          <BookOpen className="w-4 h-4 text-toxic-neon/70 mx-auto mb-1" />
          <div className="text-xs text-white/70">Chronicles</div>
          <div className="text-sm text-toxic-neon">{characterStats.chronicles}</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-black/40 border border-toxic-neon/10 p-2 rounded text-center"
        >
          <Award className="w-4 h-4 text-toxic-neon/70 mx-auto mb-1" />
          <div className="text-xs text-white/70">Achievements</div>
          <div className="text-sm text-toxic-neon">{characterStats.achievements}</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-black/40 border border-toxic-neon/10 p-2 rounded text-center"
        >
          <Target className="w-4 h-4 text-toxic-neon/70 mx-auto mb-1" />
          <div className="text-xs text-white/70">Rank</div>
          <div className="text-sm text-toxic-neon">Survivor</div>
        </motion.div>
      </div>
    </ToxicCard>
  );
}
