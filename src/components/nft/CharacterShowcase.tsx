
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getNFTsByRole } from '@/services/openseaService';
import { NFTCard } from './NFTCard';
import { Shield, Target, Biohazard } from 'lucide-react';
import { ToxicBadge } from '@/components/ui/toxic-badge';

interface CharacterShowcaseProps {
  className?: string;
}

export const CharacterShowcase: React.FC<CharacterShowcaseProps> = ({ 
  className = "" 
}) => {
  const navigate = useNavigate();
  const { survivors, bountyHunters, scavengers } = getNFTsByRole();

  const handleViewNFT = (tokenId: string) => {
    navigate(`/nft/${tokenId}`);
  };

  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-xl font-mono text-toxic-neon mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Wasteland Characters
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Survivors Section */}
        <div className="bg-black/80 border border-toxic-neon/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-toxic-neon" />
            <h3 className="text-toxic-neon font-mono">Survivors</h3>
          </div>
          <p className="text-white/70 text-sm mb-4">
            Resilient inhabitants adapting to life in the wasteland.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {survivors.map(nft => (
              <NFTCard 
                key={nft.identifier} 
                nft={nft} 
                onClick={() => handleViewNFT(nft.identifier)}
                className="transition-transform hover:scale-105"
              />
            ))}
          </div>
        </div>
        
        {/* Bounty Hunters Section */}
        <div className="bg-black/80 border border-apocalypse-red/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-apocalypse-red" />
            <h3 className="text-apocalypse-red font-mono">Bounty Hunters</h3>
          </div>
          <p className="text-white/70 text-sm mb-4">
            Ruthless trackers who pursue targets for payment or resources.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {bountyHunters.map(nft => (
              <NFTCard 
                key={nft.identifier} 
                nft={nft} 
                onClick={() => handleViewNFT(nft.identifier)}
                className="transition-transform hover:scale-105"
              />
            ))}
          </div>
        </div>
        
        {/* Scavengers Section */}
        <div className="bg-black/80 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Biohazard className="h-5 w-5 text-yellow-500" />
            <h3 className="text-yellow-500 font-mono">Scavengers</h3>
          </div>
          <p className="text-white/70 text-sm mb-4">
            Resource gatherers who thrive by finding valuable items in the ruins.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {scavengers.map(nft => (
              <NFTCard 
                key={nft.identifier} 
                nft={nft} 
                onClick={() => handleViewNFT(nft.identifier)}
                className="transition-transform hover:scale-105"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
