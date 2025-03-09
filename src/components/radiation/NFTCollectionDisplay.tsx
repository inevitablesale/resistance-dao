
import React from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { Image, Radiation, Shield, Target, Users, Skull, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

interface NFTCollectionDisplayProps {
  className?: string;
  currentRadiation: number;
}

interface NFTCharacter {
  id: number;
  name: string;
  type: 'sentinel' | 'bounty-hunter' | 'survivor';
  imageUrl: string;
  radiationImmunity: number;
  rarity: string;
  revealed: boolean;
  description: string;
}

export function NFTCollectionDisplay({ className = "", currentRadiation }: NFTCollectionDisplayProps) {
  const navigate = useNavigate();
  const [revealLevel, setRevealLevel] = React.useState(currentRadiation);

  // Sample NFT collection data
  const nftCharacters: NFTCharacter[] = [
    {
      id: 1,
      name: "Strategic Commander X-35",
      type: 'sentinel',
      imageUrl: "https://gateway.pinata.cloud/ipfs/bafybeiheog5wgtnl7ldazmsj3n7xmkgkzpjnix5e4tuxndzw7j3bgkp2n4",
      radiationImmunity: 100,
      rarity: "Legendary",
      revealed: currentRadiation <= 75,
      description: "Strategic leader and decision maker for governance systems"
    },
    {
      id: 2,
      name: "Financial Overseer K-42",
      type: 'sentinel',
      imageUrl: "https://gateway.pinata.cloud/ipfs/bafybeiavqxeov62wgj6upfpvq6g4vpvot4mnwl3ggunxp27sbfjgs4hlfq",
      radiationImmunity: 100,
      rarity: "Epic",
      revealed: currentRadiation <= 80,
      description: "Economic specialist and resource allocation expert"
    },
    {
      id: 3,
      name: "Protocol Tracker S-17",
      type: 'bounty-hunter',
      imageUrl: "https://gateway.pinata.cloud/ipfs/bafybeifzvpyj5znhgjq22cbjyzav5zsvese3m3klbkc4lcdm3fdbbxiooa",
      radiationImmunity: 85,
      rarity: "Rare",
      revealed: currentRadiation <= 65,
      description: "Enforcer and information gatherer in the wasteland"
    },
    {
      id: 4,
      name: "Settlement Leader T-01",
      type: 'survivor',
      imageUrl: "https://gateway.pinata.cloud/ipfs/bafybeig47okn4sqqbajhje57htkxw6py3tdms7boyc3hkvvr4qlj7zsabu",
      radiationImmunity: 50,
      rarity: "Uncommon",
      revealed: currentRadiation <= 50,
      description: "Builder and community organizer for new settlements"
    }
  ];

  // Filter revealed characters based on current radiation
  const revealedCharacters = nftCharacters.filter(char => 
    char.revealed || revealLevel <= (100 - char.radiationImmunity)
  );
  
  // Calculate reveal percentage
  const calculateRevealPercentage = () => {
    return (revealedCharacters.length / nftCharacters.length) * 100;
  };

  return (
    <ToxicCard className={`bg-black/80 border-toxic-neon/30 p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-toxic-neon/10">
          <Image className="h-6 w-6 text-toxic-neon" />
        </div>
        <div>
          <h2 className="text-xl font-mono text-toxic-neon">NFT Collection Reveal</h2>
          <p className="text-white/60 text-sm">
            Radiation Level: {currentRadiation}% | Characters Revealed: {revealedCharacters.length}/{nftCharacters.length}
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-white/70">Reveal Progress</span>
          <span className="text-toxic-neon font-mono">{calculateRevealPercentage().toFixed(0)}%</span>
        </div>
        <ToxicProgress 
          value={calculateRevealPercentage()} 
          variant="radiation" 
          className="h-3 mb-3" 
        />
        
        <div className="mb-4">
          <p className="text-white/70 mb-2 text-sm">Radiation Simulator: See characters at different radiation levels</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/60">0%</span>
            <Slider
              value={[revealLevel]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => setRevealLevel(values[0])}
              className="flex-1"
            />
            <span className="text-xs text-white/60">100%</span>
          </div>
          <div className="text-center mt-2">
            <ToxicBadge variant="outline" className="text-toxic-neon">
              <Radiation className="h-3 w-3 mr-1" /> 
              Radiation Level: {revealLevel}%
            </ToxicBadge>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {nftCharacters.map((character) => (
          <div 
            key={character.id}
            className={`relative overflow-hidden rounded-lg border ${
              character.revealed || revealLevel <= (100 - character.radiationImmunity)
                ? character.type === 'sentinel' 
                  ? 'border-purple-500/50 bg-black/60' 
                  : character.type === 'bounty-hunter'
                    ? 'border-apocalypse-red/50 bg-black/60'
                    : 'border-amber-500/50 bg-black/60'
                : 'border-gray-700/50 bg-black/80'
            }`}
          >
            {/* Radiation overlay for unrevealed characters */}
            {(!character.revealed && revealLevel > (100 - character.radiationImmunity)) && (
              <div className="absolute inset-0 backdrop-blur-md bg-black/80 z-10 flex flex-col items-center justify-center p-4">
                <Radiation className="h-10 w-10 text-apocalypse-red animate-pulse mb-2" />
                <p className="text-white/80 text-center font-mono mb-1">Radiation Level Too High</p>
                <p className="text-xs text-white/60 text-center mb-3">
                  Requires radiation level below {100 - character.radiationImmunity}%
                </p>
                <ToxicBadge variant="outline" className="text-toxic-neon">
                  <Shield className="h-3 w-3 mr-1" /> 
                  Immunity: {character.radiationImmunity}%
                </ToxicBadge>
              </div>
            )}
            
            <div className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className={`font-mono ${
                    character.type === 'sentinel' 
                      ? 'text-purple-400' 
                      : character.type === 'bounty-hunter'
                        ? 'text-apocalypse-red' 
                        : 'text-amber-400'
                  }`}>
                    {character.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-white/60">
                    {character.type === 'sentinel' ? (
                      <Shield className="h-3 w-3 text-purple-400" />
                    ) : character.type === 'bounty-hunter' ? (
                      <Target className="h-3 w-3 text-apocalypse-red" />
                    ) : (
                      <Users className="h-3 w-3 text-amber-400" />
                    )}
                    <span>
                      {character.type === 'sentinel' 
                        ? 'Sentinel' 
                        : character.type === 'bounty-hunter' 
                          ? 'Bounty Hunter' 
                          : 'Survivor'}
                    </span>
                  </div>
                </div>
                <ToxicBadge 
                  variant="outline" 
                  className={
                    character.rarity === 'Legendary' ? 'text-purple-400 border-purple-400/30' :
                    character.rarity === 'Epic' ? 'text-amber-400 border-amber-400/30' :
                    character.rarity === 'Rare' ? 'text-blue-400 border-blue-400/30' :
                    'text-green-400 border-green-400/30'
                  }
                >
                  {character.rarity}
                </ToxicBadge>
              </div>

              {/* Character image - shown only if revealed */}
              {(character.revealed || revealLevel <= (100 - character.radiationImmunity)) && (
                <div className="aspect-square mb-2 bg-black/40 rounded overflow-hidden">
                  <img 
                    src={character.imageUrl} 
                    alt={character.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}

              {/* Character details - shown only if revealed */}
              {(character.revealed || revealLevel <= (100 - character.radiationImmunity)) && (
                <div className="mb-2 text-xs text-white/70">
                  <p>{character.description}</p>
                </div>
              )}

              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <Zap className="h-3 w-3 text-toxic-neon mr-1" />
                  <span className="text-white/70">Immunity:</span>
                  <span className="text-toxic-neon ml-1">{character.radiationImmunity}%</span>
                </div>
                
                {(character.revealed || revealLevel <= (100 - character.radiationImmunity)) && (
                  <ToxicButton 
                    variant="outline" 
                    size="sm"
                    className="text-xs h-7 px-2 border-toxic-neon/30"
                    onClick={() => navigate(`/nft/${character.id}`)}
                  >
                    View Details
                  </ToxicButton>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <ToxicButton 
        variant="default" 
        className="w-full"
        onClick={() => navigate('/collection')}
      >
        View Full Collection ({nftCharacters.length})
      </ToxicButton>
    </ToxicCard>
  );
}
