
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
    queryFn: () => getCharacterById(characterId),
    enabled: !!characterId && !isNaN(characterId),
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
    traits: character.traits,
    animation_url: character.model_url || null,
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
