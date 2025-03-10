
import React from 'react';
import { CharacterList } from '@/components/marketplace/CharacterList';
import { useNavigate } from 'react-router-dom';

interface CharactersDisplayProps {
  className?: string;
}

export function CharactersDisplay({ className = "" }: CharactersDisplayProps) {
  const navigate = useNavigate();
  
  const handleCharacterClick = (ipfsCID: string) => {
    navigate(`/character/${ipfsCID}`);
  };
  
  return (
    <div className={`space-y-12 ${className}`}>
      <CharacterList
        characterRole="SENTINEL"
        title="FOUNDER SENTINELS: Governance & Oversight"
        description="Economic commanders with full radiation immunity"
        onCharacterClick={handleCharacterClick}
      />
      
      <CharacterList
        characterRole="BOUNTY_HUNTER"
        title="BOUNTY HUNTERS: Enforcers & Funders"
        description="Track targets across the wasteland"
        onCharacterClick={handleCharacterClick}
      />
      
      <CharacterList
        characterRole="SURVIVOR"
        title="SURVIVORS: Builders & Innovators" 
        description="Crafting the future from the ruins"
        onCharacterClick={handleCharacterClick}
      />
    </div>
  );
}
