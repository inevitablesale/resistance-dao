
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Hammer, Radiation, Biohazard } from 'lucide-react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { ToxicButton } from '@/components/ui/toxic-button';
import { RevealableModel } from '@/components/radiation/RevealableModel';
import { CHARACTERS } from '@/components/radiation/NFTDistributionStatus';
import { CharacterType } from '@/types/character';

interface CharacterListProps {
  className?: string;
  filterRole?: 'sentinel' | 'survivor' | 'bounty-hunter' | 'all';
}

const getCharactersByRole = (role: 'sentinel' | 'survivor' | 'bounty-hunter' | 'all'): CharacterType[] => {
  if (role === 'all') {
    return [
      ...CHARACTERS.SENTINEL_CHARACTERS,
      ...CHARACTERS.SURVIVOR_CHARACTERS,
      ...CHARACTERS.BOUNTY_HUNTER_CHARACTERS
    ];
  }
  
  switch (role) {
    case 'sentinel':
      return CHARACTERS.SENTINEL_CHARACTERS;
    case 'survivor':
      return CHARACTERS.SURVIVOR_CHARACTERS;
    case 'bounty-hunter':
      return CHARACTERS.BOUNTY_HUNTER_CHARACTERS;
    default:
      return [];
  }
};

const getRoleIcon = (role: 'sentinel' | 'survivor' | 'bounty-hunter') => {
  switch (role) {
    case 'sentinel':
      return <Shield className="h-4 w-4 text-purple-400" />;
    case 'survivor':
      return <Hammer className="h-4 w-4 text-amber-400" />;
    case 'bounty-hunter':
      return <Target className="h-4 w-4 text-apocalypse-red" />;
    default:
      return <Biohazard className="h-4 w-4 text-toxic-neon" />;
  }
};

const getCharacterRole = (id: number): 'sentinel' | 'survivor' | 'bounty-hunter' => {
  if (id >= 1 && id <= 7) return 'sentinel';
  if (id >= 8 && id <= 10) return 'survivor';
  return 'bounty-hunter';
};

export function CharacterList({ className = "", filterRole = 'all' }: CharacterListProps) {
  const characters = getCharactersByRole(filterRole);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(null);
  const [revealedCharacters, setRevealedCharacters] = useState<number[]>([]);

  const handleReveal = (character: CharacterType) => {
    if (!revealedCharacters.includes(character.id)) {
      setRevealedCharacters([...revealedCharacters, character.id]);
    }
  };

  const handleReset = () => {
    setRevealedCharacters([]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-mono text-toxic-neon">Wasteland Characters</h2>
        {revealedCharacters.length > 0 && (
          <ToxicButton 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="text-xs"
          >
            <Radiation className="h-4 w-4 mr-1" />
            Reset Reveals
          </ToxicButton>
        )}
      </div>
      
      {selectedCharacter ? (
        <div className="mb-5">
          <ToxicCard className="bg-black/70 border-toxic-neon/30 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getRoleIcon(getCharacterRole(selectedCharacter.id))}
                  <h3 className="text-toxic-neon font-mono">{selectedCharacter.name}</h3>
                </div>
                <ToxicBadge variant="outline" className="text-xs">
                  ID #{selectedCharacter.id}
                </ToxicBadge>
              </div>
              
              <div className="h-[300px] bg-black/40 rounded-lg overflow-hidden mb-3">
                <RevealableModel 
                  character={selectedCharacter}
                  role={getCharacterRole(selectedCharacter.id) === 'sentinel' ? 'SENTINEL' : 
                        getCharacterRole(selectedCharacter.id) === 'survivor' ? 'SURVIVOR' : 'BOUNTY_HUNTER'}
                  isRevealed={revealedCharacters.includes(selectedCharacter.id)}
                  onReveal={() => handleReveal(selectedCharacter)}
                />
              </div>
              
              <div className="flex justify-between">
                <ToxicButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedCharacter(null)}
                >
                  Back to List
                </ToxicButton>
                
                {!revealedCharacters.includes(selectedCharacter.id) && (
                  <ToxicButton 
                    variant="secondary"
                    size="sm"
                    onClick={() => handleReveal(selectedCharacter)}
                  >
                    <Radiation className="h-4 w-4 mr-1" />
                    Reveal Character
                  </ToxicButton>
                )}
              </div>
            </div>
          </ToxicCard>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {characters.map((character) => (
            <motion.div key={character.id} variants={itemVariants}>
              <ToxicCard 
                className="bg-black/70 border-toxic-neon/30 cursor-pointer hover:border-toxic-neon/60 transition-all"
                onClick={() => setSelectedCharacter(character)}
              >
                <div className="p-3">
                  <div className="h-24 bg-gradient-to-b from-toxic-neon/20 to-black/60 rounded-lg flex items-center justify-center mb-2">
                    {revealedCharacters.includes(character.id) ? (
                      <img 
                        src={`https://gateway.pinata.cloud/ipfs/${character.ipfsCID}`} 
                        alt={character.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Radiation className="h-10 w-10 text-toxic-neon/40 animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {getRoleIcon(getCharacterRole(character.id))}
                      <span className="text-white/80 text-xs truncate">{character.name}</span>
                    </div>
                    <ToxicBadge variant="outline" className="text-[10px] h-4">
                      #{character.id}
                    </ToxicBadge>
                  </div>
                </div>
              </ToxicCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
