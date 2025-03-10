
import { useQuery } from "@tanstack/react-query";
import { type OpenSeaNFT } from "@/services/openseaService";
import { CONTRACT_ADDRESS } from "@/hooks/useNFTCollection";
import { useCharacterMetadata } from "@/hooks/useCharacterMetadata";
import { getCharacterNFTByTokenId } from "@/services/characterMetadata";
import { fetchMetadataFromCID } from "@/services/cidMetadataService";

export const useNFTMetadata = (tokenId: string) => {
  // Try to use character metadata if the tokenId is a valid number in our character range
  const characterId = parseInt(tokenId, 10);
  const isValidCharacterId = !isNaN(characterId) && characterId >= 1 && characterId <= 16;
  
  // If it's a valid character ID, use our metadata
  const characterMetadata = useCharacterMetadata(characterId);
  
  // Use our character data service instead of OpenSea API
  const openSeaQuery = useQuery({
    queryKey: ['nft', CONTRACT_ADDRESS, tokenId],
    queryFn: () => getCharacterNFTByTokenId(tokenId),
    enabled: !!tokenId && !isValidCharacterId,
  });
  
  if (isValidCharacterId) {
    return {
      data: characterMetadata.nft,
      metadata: characterMetadata.modelMetadata,
      isLoading: characterMetadata.isLoading,
      error: characterMetadata.error,
    };
  }
  
  return {
    ...openSeaQuery,
    metadata: null
  };
};
