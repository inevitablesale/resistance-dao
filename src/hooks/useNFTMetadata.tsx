
import { useQuery } from "@tanstack/react-query";
import { CONTRACT_ADDRESS } from "@/hooks/useNFTCollection";
import { useCharacterMetadata } from "@/hooks/useCharacterMetadata";

export const useNFTMetadata = (tokenId: string) => {
  // Try to use character metadata if the tokenId is a valid number in our character range
  const characterId = parseInt(tokenId, 10);
  const isValidCharacterId = !isNaN(characterId) && characterId >= 1 && characterId <= 16;
  
  console.log('🔴 useNFTMetadata called with tokenId:', tokenId, 'parsed as characterId:', characterId);
  
  // If it's a valid character ID, use our metadata
  const characterMetadata = useCharacterMetadata(isValidCharacterId ? characterId : 0);
  
  // No OpenSea call - only use character data
  if (isValidCharacterId) {
    console.log('🔴 Using character metadata for tokenId:', tokenId);
    console.log('🔴 Model metadata from Pinata:', characterMetadata.modelMetadata);
    
    return {
      data: characterMetadata.nft,
      metadata: characterMetadata.modelMetadata,
      isLoading: characterMetadata.isLoading,
      error: characterMetadata.error,
    };
  }
  
  // Return null data if not a valid character ID
  console.log('🔴 Invalid character ID, not fetching any metadata');
  return {
    data: null,
    isLoading: false,
    error: new Error("Not a valid character token ID"),
    metadata: null
  };
};
