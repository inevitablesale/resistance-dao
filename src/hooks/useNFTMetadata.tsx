
import { useCharacterMetadata } from "@/hooks/useCharacterMetadata";
import { CONTRACT_ADDRESS } from "@/hooks/useNFTCollection";

export const useNFTMetadata = (tokenId: string) => {
  // Try to use character metadata if the tokenId is a valid number in our character range
  const characterId = parseInt(tokenId, 10);
  const isValidCharacterId = !isNaN(characterId) && characterId >= 1 && characterId <= 16;
  
  // If it's a valid character ID, use our metadata
  const characterMetadata = useCharacterMetadata(characterId);
  
  // Return our character metadata for valid character IDs
  if (isValidCharacterId) {
    return {
      data: characterMetadata.nft,
      isLoading: characterMetadata.isLoading,
      error: characterMetadata.error,
    };
  }
  
  // Return a fallback for unknown token IDs
  return {
    data: null,
    isLoading: false,
    error: new Error("Token ID not recognized"),
  };
};
