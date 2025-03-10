
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Biohazard, Zap, Radiation } from 'lucide-react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { ToxicButton } from '@/components/ui/toxic-button';
import { motion } from 'framer-motion';
import { RevealableModel } from '@/components/radiation/RevealableModel';
import { CHARACTERS } from '@/components/radiation/NFTDistributionStatus';

interface CharacterListProps {
  type: 'SENTINEL' | 'SURVIVOR' | 'BOUNTY_HUNTER';
  title: string;
  description: string;
  onCharacterClick?: (ipfsCID: string) => void;
  className?: string;
}

export function CharacterList({ 
  type, 
  title,
  description,
  onCharacterClick, 
  className = "" 
}: CharacterListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Select the appropriate character list based on type
  const characterList = type === 'SENTINEL' 
    ? CHARACTERS.SENTINEL_CHARACTERS 
    : type === 'SURVIVOR' 
      ? CHARACTERS.SURVIVOR_CHARACTERS 
      : CHARACTERS.BOUNTY_HUNTER_CHARACTERS;
  
  const visibleCharacters = characterList.slice(currentIndex, currentIndex + 2);
  const hasNext = currentIndex + 2 < characterList.length;
  const hasPrev = currentIndex > 0;
  
  const handlePrev = () => {
    if (hasPrev) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (hasNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const getRoleColor = (type: string) => {
    switch (type) {
      case 'SENTINEL':
        return 'text-purple-400';
      case 'SURVIVOR':
        return 'text-amber-400';
      case 'BOUNTY_HUNTER':
        return 'text-apocalypse-red';
      default:
        return 'text-toxic-neon';
    }
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-mono text-toxic-neon">{title}</h2>
          <p className="text-white/60 text-sm">{description}</p>
        </div>
        <div className="flex gap-2">
          <ToxicButton 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 border-toxic-neon/40"
            onClick={handlePrev}
            disabled={!hasPrev}
          >
            <ChevronLeft className="h-4 w-4 text-toxic-neon" />
          </ToxicButton>
          <ToxicButton 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 border-toxic-neon/40"
            onClick={handleNext}
            disabled={!hasNext}
          >
            <ChevronRight className="h-4 w-4 text-toxic-neon" />
          </ToxicButton>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleCharacters.map((character) => (
          <motion.div
            key={character.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ToxicCard 
              className="bg-black/80 border-toxic-neon/30 p-0 h-full flex flex-col hover:border-toxic-neon/60 transition-all cursor-pointer relative overflow-hidden"
              onClick={() => onCharacterClick && onCharacterClick(character.ipfsCID)}
            >
              {/* Type Badge */}
              <div className="absolute top-3 left-3 z-10">
                <ToxicBadge variant="marketplace" className="bg-black/60 border-toxic-neon/50">
                  <Radiation className={`w-3 h-3 mr-1 ${getRoleColor(type)}`} /> 
                  {type.replace('_', ' ')}
                </ToxicBadge>
              </div>
              
              {/* Model Preview with fixed height */}
              <div className="relative w-full h-64 bg-gradient-to-b from-black/40 to-black/90">
                <RevealableModel
                  ipfsCID={character.ipfsCID}
                  role={type}
                  name={character.name}
                  height="100%"
                  width="100%"
                  autoRotate={true}
                />
                
                {/* Quick Stats Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/70 backdrop-blur-sm flex justify-between items-center">
                  <div className="text-lg font-mono text-toxic-neon truncate pr-2">
                    {character.name}
                  </div>
                  <div className="flex-shrink-0 text-lg font-mono text-toxic-neon">
                    #{character.id}
                  </div>
                </div>
              </div>
              
              {/* Radiation Level Badge */}
              <div className="px-4 py-3">
                <ToxicBadge 
                  variant="status" 
                  className="w-full flex justify-between items-center py-2 bg-toxic-neon/30 text-toxic-neon border-toxic-neon/40"
                >
                  <span className="flex items-center">
                    <Biohazard className="w-3.5 h-3.5 mr-1.5" /> RADIATION LEVEL
                  </span>
                  <span>MAXIMUM (100%)</span>
                </ToxicBadge>
              </div>
              
              {/* Reveal Button */}
              <div className="p-4 mt-auto">
                <ToxicButton 
                  variant="toxic" 
                  className="w-full"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Clear Radiation
                </ToxicButton>
              </div>
            </ToxicCard>
          </motion.div>
        ))}
      </div>
      
      {/* Page Indicator for Mobile */}
      <div className="mt-4 flex justify-center gap-2 md:hidden">
        {characterList.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${
              idx >= currentIndex && idx < currentIndex + 2
                ? "bg-toxic-neon"
                : "bg-toxic-neon/30"
            }`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
