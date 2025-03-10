
import React, { useState } from 'react';
import { useAllContractNFTs, useContractStats, NFTMetadata } from '@/hooks/useContractNFTs';
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle } from '@/components/ui/toxic-card';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { RadiationOverlay } from '@/components/radiation/RadiationOverlay';
import { Loader2, AlertCircle, Radiation, ExternalLink } from 'lucide-react';
import { CharacterRevealSlider } from '@/components/marketplace/CharacterRevealSlider';

export const ContractNFTDisplay = () => {
  const [radiationLevel, setRadiationLevel] = useState(50);
  const { data: nfts, isLoading, error } = useAllContractNFTs(100); // Get first 100 NFTs
  const { data: contractStats } = useContractStats();
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-lg border border-toxic-neon/20">
        <Loader2 className="h-8 w-8 text-toxic-neon animate-spin mb-4" />
        <p className="text-toxic-neon">Scanning contract for NFTs via Alchemy API...</p>
        <p className="text-sm text-toxic-muted mt-2">0xdD44d15f54B799e940742195e97A30165A1CD285</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-lg border border-apocalypse-red/30">
        <AlertCircle className="h-8 w-8 text-apocalypse-red mb-4" />
        <p className="text-apocalypse-red">Error scanning contract</p>
        <p className="text-sm text-white/70 mt-2">Failed to load NFTs. Please try again later.</p>
        <p className="text-xs text-white/50 mt-4">{error.toString()}</p>
      </div>
    );
  }
  
  if (!nfts || nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-lg border border-toxic-neon/20">
        <Radiation className="h-8 w-8 text-toxic-neon mb-4" />
        <p className="text-toxic-neon">No NFTs found in this contract</p>
        <p className="text-sm text-toxic-muted mt-2">
          The contract appears to have no minted NFTs yet.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/40 p-4 rounded-lg border border-toxic-neon/20">
        <div>
          <h2 className="text-xl font-mono text-toxic-neon">Contract NFTs</h2>
          <p className="text-sm text-toxic-muted">
            {nfts[0]?.contractName || contractStats?.contractName || 'Unknown Collection'} ({nfts[0]?.contractSymbol || contractStats?.contractSymbol || '???'})
          </p>
          <p className="text-xs text-white/50 mt-1">
            <a 
              href={`https://polygonscan.com/address/0xdD44d15f54B799e940742195e97A30165A1CD285`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-toxic-neon transition-colors"
            >
              0xdD44d15f54B799e940742195e97A30165A1CD285
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </p>
        </div>
        <ToxicBadge variant="outline" className="text-toxic-neon">
          {nfts.length} NFTs Found ({contractStats?.totalMinted || '?'} Total Minted)
        </ToxicBadge>
      </div>
      
      <div className="w-full max-w-md mx-auto mb-6">
        <CharacterRevealSlider 
          value={radiationLevel}
          onChange={setRadiationLevel}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft: NFTMetadata) => (
          <ToxicCard key={nft.tokenId} className="bg-black/40 border-toxic-neon/30 overflow-hidden">
            <ToxicCardHeader>
              <ToxicCardTitle className="flex justify-between items-center">
                <span className="text-toxic-neon truncate">
                  {nft.name || `Token #${nft.tokenId}`}
                </span>
                <ToxicBadge variant="outline" className="text-xs">
                  #{nft.tokenId}
                </ToxicBadge>
              </ToxicCardTitle>
            </ToxicCardHeader>
            <ToxicCardContent>
              <div className="aspect-square relative overflow-hidden rounded-md mb-4">
                <RadiationOverlay radiationLevel={radiationLevel} animate={false}>
                  {nft.image ? (
                    <img 
                      src={nft.image} 
                      alt={nft.name || `Token #${nft.tokenId}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/60">
                      <Radiation className="h-16 w-16 text-toxic-neon/20" />
                    </div>
                  )}
                </RadiationOverlay>
              </div>
              
              {nft.description && (
                <p className="text-sm text-white/70 mb-4 line-clamp-3">
                  {nft.description}
                </p>
              )}
              
              {nft.attributes && nft.attributes.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {nft.attributes.slice(0, 4).map((attr, index) => (
                    <div key={index} className="bg-black/30 p-2 rounded text-xs">
                      <div className="text-white/60">{attr.trait_type}</div>
                      <div className="text-toxic-neon font-mono truncate">{attr.value.toString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </ToxicCardContent>
          </ToxicCard>
        ))}
      </div>
    </div>
  );
};
