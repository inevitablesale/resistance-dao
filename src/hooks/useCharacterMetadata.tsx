
import { useState, useEffect } from 'react';
import { 
  getCharacterTypeById, 
  fetchCharacterMetadata, 
  convertToOpenSeaNFT 
} from '@/services/characterMetadata';
import { type OpenSeaNFT } from '@/services/openseaService';

export const useCharacterMetadata = (characterId: number) => {
  const [nft, setNft] = useState<OpenSeaNFT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const characterType = getCharacterTypeById(characterId);
        if (!characterType) {
          throw new Error(`Character with ID ${characterId} not found`);
        }
        
        const metadata = await fetchCharacterMetadata(characterType.metadataCID);
        const nftData = convertToOpenSeaNFT(characterType, characterId, metadata);
        
        setNft(nftData);
      } catch (err) {
        console.error('Error fetching character metadata:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    if (characterId) {
      fetchData();
    }
  }, [characterId]);

  return { nft, isLoading, error };
};
