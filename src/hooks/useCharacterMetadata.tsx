
import { useQuery } from "@tanstack/react-query";
import { getCharacterById, getCharacterNFTByTokenId, type CharacterMetadata } from "@/services/characterMetadata";
import { type OpenSeaNFT } from "@/services/openseaService";
import { fetchMetadataFromCID } from "@/services/cidMetadataService";

export const useCharacterMetadata = (characterId: number) => {
  const {
    data: character,
    isLoading: characterLoading,
    error: characterError
  } = useQuery({
    queryKey: ['character', characterId],
    queryFn: () => {
      if (!characterId || characterId === 0) {
        return null;
      }
      return getCharacterById(characterId);
    },
    enabled: !!characterId && !isNaN(characterId) && characterId > 0,
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes (formerly cacheTime)
  });

  // Fetch the actual model metadata from Pinata if we have a CID
  const {
    data: modelMetadata,
    isLoading: modelLoading,
    error: modelError
  } = useQuery({
    queryKey: ['character-model-metadata', character?.character_model_cid],
    queryFn: async () => {
      if (!character?.character_model_cid) {
        throw new Error('No model CID available');
      }
      return await fetchMetadataFromCID(character.character_model_cid);
    },
    enabled: !!character?.character_model_cid,
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes (formerly cacheTime)
    retry: 1, // Limit retries to avoid excessive requests
  });

  // Convert character metadata to OpenSeaNFT format for compatibility
  const nft: OpenSeaNFT | null = character ? {
    identifier: character.tokenId,
    collection: "resistance-wasteland",
    contract: "0xdD44d15f54B799e940742195e97A30165A1CD285",
    token_standard: "ERC721",
    name: character.name,
    description: character.description,
    image_url: character.image_url,
    metadata_url: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_disabled: false,
    is_nsfw: false,
    traits: character.traits.map(trait => ({
      ...trait,
      display_type: null // Add the required display_type property
    })),
    // Use character_model_cid if available, properly formatted as a Pinata gateway URL
    animation_url: character.character_model_cid 
      ? `https://gateway.pinata.cloud/ipfs/${character.character_model_cid}`
      : character.model_url || null,
    is_suspicious: false,
    creator: null,
    owners: [
      {
        address: `0x${Math.random().toString(16).substring(2, 42)}`,
        quantity: 1,
      },
    ],
    rarity: {
      rank: Math.floor(Math.random() * 100) + 1,
      score: Math.random() * 100,
      total: 1000,
    },
  } : null;

  return {
    character,
    modelMetadata,
    nft,
    isLoading: characterLoading || (!!character?.character_model_cid && modelLoading),
    error: characterError || modelError
  };
};
