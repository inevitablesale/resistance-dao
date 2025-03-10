
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NFTCard } from './NFTCard';
import { Shield, Target, Biohazard } from 'lucide-react';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { getCharactersGroupedByRole } from '@/services/characterMetadata';
import { type OpenSeaNFT } from '@/services/openseaService';
import { ModelPreview } from '@/components/marketplace/ModelPreview';

interface CharacterShowcaseProps {
  className?: string;
}

export const CharacterShowcase: React.FC<CharacterShowcaseProps> = ({ 
  className = "" 
}) => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<{
    sentinels: OpenSeaNFT[];
    survivors: OpenSeaNFT[];
    bountyHunters: OpenSeaNFT[];
  }>({
    sentinels: [],
    survivors: [],
    bountyHunters: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setIsLoading(true);
        const groupedCharacters = await getCharactersGroupedByRole();
        setCharacters({
          sentinels: groupedCharacters.sentinels.slice(0, 3),
          survivors: groupedCharacters.survivors.slice(0, 3),
          bountyHunters: groupedCharacters.bountyHunters.slice(0, 3)
        });
      } catch (error) {
        console.error("Error loading character data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, []);

  const handleViewNFT = (tokenId: string) => {
    navigate(`/nft/${tokenId}`);
  };

  // Enhanced NFT card with 3D model and radiation cloud
  const EnhancedNFTCard = ({ nft, radiation }: { nft: OpenSeaNFT, radiation: number }) => {
    return (
      <div className="bg-black/70 border border-toxic-neon/30 hover:border-toxic-neon/60 transition-all cursor-pointer rounded-lg overflow-hidden"
        onClick={() => handleViewNFT(nft.identifier)}>
        <div className="h-40 bg-gradient-to-b from-toxic-neon/20 to-black/60 relative">
          {nft.animation_url ? (
            <ModelPreview 
              modelUrl={nft.animation_url}
              height="100%"
              width="100%"
              autoRotate={true}
              radiationLevel={radiation}
              useRadiationCloud={true}
              radiationCloudUrl="bafybeiayvmbutisgus45sujbr65sqnpeqcd3vtu6tjxwbmwadf35frszp4"
              revealValue={20} // Show just a hint of the character
            />
          ) : nft.image_url ? (
            <img 
              src={nft.image_url} 
              alt={nft.name || `NFT #${nft.identifier}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Biohazard className="h-12 w-12 text-toxic-neon/30" />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60">
            <div className="flex items-center justify-between">
              <ToxicBadge variant="outline" className="flex items-center gap-1 text-xs">
                <Biohazard className="h-4 w-4 text-toxic-neon" />
                <span>#{nft.identifier}</span>
              </ToxicBadge>
              <span className={`text-xs font-mono ${radiation > 70 ? "text-apocalypse-red" : radiation > 40 ? "text-yellow-400" : "text-toxic-neon"}`}>
                RAD {radiation}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="text-toxic-neon font-mono text-sm truncate">
            {nft.name || `Wasteland NFT #${nft.identifier}`}
          </h3>
          
          {nft.traits && nft.traits.find(t => t.trait_type === "Role") && (
            <div className="text-xs text-white/70 mt-1">
              Role: <span className="text-toxic-neon">
                {nft.traits.find(t => t.trait_type === "Role")?.value}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getRadiationLevel = (nft: OpenSeaNFT): number => {
    const radiationTrait = nft.traits.find(trait => 
      trait.trait_type.toLowerCase() === 'radiation' || 
      trait.trait_type.toLowerCase() === 'radiation level'
    );
    
    return radiationTrait ? parseInt(radiationTrait.value, 10) : Math.floor(Math.random() * 100);
  };

  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-xl font-mono text-toxic-neon mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Wasteland Characters
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sentinels Section */}
        <div className="bg-black/80 border border-toxic-neon/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-toxic-neon" />
            <h3 className="text-toxic-neon font-mono">Sentinels</h3>
          </div>
          <p className="text-white/70 text-sm mb-4">
            The guardians of the wasteland, enforcing order in the chaos.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-40 bg-black/50 border border-toxic-neon/20 rounded-lg animate-pulse"></div>
              ))
            ) : (
              characters.sentinels.map(nft => (
                <EnhancedNFTCard 
                  key={nft.identifier} 
                  nft={nft}
                  radiation={getRadiationLevel(nft)}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Survivors Section */}
        <div className="bg-black/80 border border-apocalypse-red/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-apocalypse-red" />
            <h3 className="text-apocalypse-red font-mono">Survivors</h3>
          </div>
          <p className="text-white/70 text-sm mb-4">
            Resilient inhabitants adapting to life in the harsh wasteland.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-40 bg-black/50 border border-apocalypse-red/20 rounded-lg animate-pulse"></div>
              ))
            ) : (
              characters.survivors.map(nft => (
                <EnhancedNFTCard 
                  key={nft.identifier} 
                  nft={nft}
                  radiation={getRadiationLevel(nft)}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Bounty Hunters Section */}
        <div className="bg-black/80 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Biohazard className="h-5 w-5 text-yellow-500" />
            <h3 className="text-yellow-500 font-mono">Bounty Hunters</h3>
          </div>
          <p className="text-white/70 text-sm mb-4">
            Ruthless trackers who pursue targets for payment or resources.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-40 bg-black/50 border border-yellow-500/20 rounded-lg animate-pulse"></div>
              ))
            ) : (
              characters.bountyHunters.map(nft => (
                <EnhancedNFTCard 
                  key={nft.identifier} 
                  nft={nft}
                  radiation={getRadiationLevel(nft)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
