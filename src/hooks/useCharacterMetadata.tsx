
import { useQuery } from "@tanstack/react-query";
import { getCharacterById, getCharacterNFTByTokenId, type CharacterMetadata } from "@/services/characterMetadata";
import { type OpenSeaNFT } from "@/services/openseaService";

export const useCharacterMetadata = (characterId: number) => {
  const {
    data: character,
    isLoading,
    error
  } = useQuery({
    queryKey: ['character', characterId],
    queryFn: () => {
      console.log(`Fetching character data for ID: ${characterId}`);
      return getCharacterById(characterId);
    },
    enabled: !!characterId && !isNaN(characterId)
  });

  // Log character data when it's available
  if (character) {
    console.log(`Character data for ID ${characterId}:`, {
      name: character.name,
      model_url: character.model_url,
      character_model_cid: character.character_model_cid,
      role: character.role,
      traits: character.traits
    });
  }

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
    nft,
    isLoading,
    error
  };
};
