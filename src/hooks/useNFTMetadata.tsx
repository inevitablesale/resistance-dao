
import { useQuery } from "@tanstack/react-query";
import { fetchNFTByTokenId, type OpenSeaNFT } from "@/services/openseaService";
import { CONTRACT_ADDRESS } from "@/hooks/useNFTCollection";
import { useCharacterMetadata } from "@/hooks/useCharacterMetadata";

export const useNFTMetadata = (tokenId: string) => {
  // Try to use character metadata first if the tokenId is a valid number in our character range
  const characterId = parseInt(tokenId, 10);
  const isValidCharacterId = !isNaN(characterId) && characterId >= 1 && characterId <= 16;
  
  // If it's a valid character ID, use our metadata
  const characterMetadata = useCharacterMetadata(characterId);
  
  // Only use OpenSea API as fallback if it's not one of our predefined characters
  const openSeaQuery = useQuery({
    queryKey: ['nft', CONTRACT_ADDRESS, tokenId],
    queryFn: () => fetchNFTByTokenId(CONTRACT_ADDRESS, tokenId),
    enabled: !!tokenId && !isValidCharacterId,
  });
  
  if (isValidCharacterId) {
    return {
      data: characterMetadata.nft,
      isLoading: characterMetadata.isLoading,
      error: characterMetadata.error,
    };
  }
  
  return openSeaQuery;
};
