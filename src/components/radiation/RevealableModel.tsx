
import React, { useState, useEffect } from 'react';
import { ModelPreview } from '@/components/marketplace/ModelPreview';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { Radiation, Skull, AlertTriangle } from 'lucide-react';
import { useCharacterMetadata } from '@/hooks/useCharacterMetadata';
import { CharacterType } from '@/types/character';

// Default radiation cloud model URL
const DEFAULT_RADIATION_CLOUD = "https://gateway.pinata.cloud/ipfs/bafybeihfebnoakbibi53tqkqarh6vjzuksdwuw66yrope5vaprbhw4k2tm";
// Default character model URL if metadata doesn't provide one
const DEFAULT_CHARACTER_MODEL = "https://gateway.pinata.cloud/ipfs/bafybeig47okn4sqqbajhje57htkxw6py3tdms7boyc3hkvvr4qlj7zsabu";

interface RevealableModelProps {
  character: CharacterType;
  role: "SURVIVOR" | "SENTINEL" | "BOUNTY_HUNTER";
  isRevealed: boolean;
  onReveal: () => void;
  className?: string;
  height?: string;
}

export function RevealableModel({ 
  character,
  role,
  isRevealed,
  onReveal,
  className = "",
  height = "100%"
}: RevealableModelProps) {
  const [revealProgress, setRevealProgress] = useState(0);
  const [revealState, setRevealState] = useState<'idle' | 'scanning' | 'revealed'>('idle');
  const { metadata, isLoading, error } = useCharacterMetadata(character.ipfsCID, role, character.name);
  
  useEffect(() => {
    if (isRevealed && revealState !== 'revealed') {
      setRevealState('scanning');
      const timer = setInterval(() => {
        setRevealProgress(prev => {
          const newProgress = prev + (Math.random() * 5);
          if (newProgress >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setRevealState('revealed');
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [isRevealed, revealState]);
  
  // Reset state when character changes
  useEffect(() => {
    if (!isRevealed) {
      setRevealProgress(0);
      setRevealState('idle');
    }
  }, [character.id, isRevealed]);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className={`w-full flex flex-col items-center justify-center bg-black/50 ${className}`} style={{ height }}>
        <Radiation className="h-16 w-16 text-toxic-neon animate-pulse mb-4" />
        <p className="text-toxic-neon font-mono text-sm">Loading Character Data...</p>
      </div>
    );
  }
  
  // Handle error state
  if (error || !metadata) {
    return (
      <div className={`w-full flex flex-col items-center justify-center bg-black/50 ${className}`} style={{ height }}>
        <AlertTriangle className="h-16 w-16 text-apocalypse-red mb-4" />
        <p className="text-apocalypse-red font-mono text-sm">Error Loading Character</p>
        <p className="text-white/60 text-xs mt-2">{error || "Metadata unavailable"}</p>
      </div>
    );
  }
  
  // Determine which model to show
  const modelUrl = revealState === 'revealed' 
    ? (metadata.modelUrl || DEFAULT_CHARACTER_MODEL)
    : (metadata.radiationCloudUrl || DEFAULT_RADIATION_CLOUD);
  
  return (
    <div className={`relative w-full ${className}`} style={{ height }}>
      <ModelPreview
        modelUrl={modelUrl}
        height={height}
        width="100%"
        autoRotate={true}
      />
      
      {/* Overlay for non-revealed state */}
      {revealState !== 'revealed' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
          {revealState === 'idle' ? (
            <div className="text-center">
              <Radiation className="h-16 w-16 text-toxic-neon mx-auto mb-4" />
              <p className="text-toxic-neon font-mono mb-4">Character Concealed by Radiation</p>
              <ToxicButton 
                variant="secondary"
                onClick={onReveal}
              >
                <Skull className="h-4 w-4 mr-2" />
                Initiate Scan
              </ToxicButton>
            </div>
          ) : (
            <div className="w-3/4 text-center">
              <Radiation className="h-12 w-12 text-toxic-neon animate-pulse mx-auto mb-4" />
              <p className="text-toxic-neon font-mono text-sm mb-2">Radiation Scan in Progress</p>
              <ToxicProgress 
                value={revealProgress} 
                variant="radiation" 
                className="h-2 mb-2" 
              />
              <p className="text-toxic-muted text-xs">{revealProgress.toFixed(0)}% Complete</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
