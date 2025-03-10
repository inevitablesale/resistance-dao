
import React, { useState } from 'react';
import { useNFTCollection } from '@/hooks/useNFTCollection';
import { NFTCard } from '@/components/nft/NFTCard';
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { LoaderCircle, ShieldAlert, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

interface NFTCollectionDisplayProps {
  className?: string;
  title?: string;
  limit?: number;
}

export const NFTCollectionDisplay: React.FC<NFTCollectionDisplayProps> = ({
  className = "",
  title = "Resistance NFT Collection",
  limit = 8
}) => {
  const { nfts, collection, isLoading, isFetching, error, loadMore, hasMore } = useNFTCollection(limit);
  const navigate = useNavigate();

  const handleViewNFT = (tokenId: string) => {
    navigate(`/nft/${tokenId}`);
  };

  return (
    <ToxicCard className={`bg-black/80 border-toxic-neon/30 ${className}`}>
      <ToxicCardHeader>
        <ToxicCardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-toxic-neon" />
          {title}
          {collection && (
            <span className="text-sm font-normal text-white/70 ml-2">
              ({collection.name})
            </span>
          )}
        </ToxicCardTitle>
      </ToxicCardHeader>
      <ToxicCardContent>
        {error ? (
          <div className="text-center py-10 text-apocalypse-red">
            <ShieldAlert className="h-10 w-10 mx-auto mb-2" />
            <p>Failed to load NFT collection</p>
            <p className="text-sm text-white/60 mt-2">{error.message}</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: limit }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-black/40 rounded-lg overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <div className="p-3">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {nfts.length === 0 ? (
              <div className="text-center py-10 text-white/70">
                <p>No NFTs found in this collection</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {nfts.map((nft) => (
                    <NFTCard 
                      key={nft.identifier} 
                      nft={nft} 
                      onClick={() => handleViewNFT(nft.identifier)}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-6">
                    <ToxicButton 
                      onClick={loadMore} 
                      disabled={isFetching}
                      className="min-w-[150px]"
                    >
                      {isFetching ? (
                        <>
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>Load More NFTs</>
                      )}
                    </ToxicButton>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {collection && (
          <div className="mt-6 p-4 bg-black/40 rounded-lg border border-toxic-neon/20">
            <h3 className="text-toxic-neon font-mono mb-2">Collection Info</h3>
            <div className="text-sm text-white/80">
              <p><span className="text-white/60">Name:</span> {collection.name}</p>
              {collection.description && (
                <p className="mt-1"><span className="text-white/60">Description:</span> {collection.description}</p>
              )}
              <div className="mt-3 flex gap-2">
                <ToxicButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(`https://opensea.io/collection/${collection.collection}`, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-1" /> View on OpenSea
                </ToxicButton>
              </div>
            </div>
          </div>
        )}
      </ToxicCardContent>
    </ToxicCard>
  );
};
