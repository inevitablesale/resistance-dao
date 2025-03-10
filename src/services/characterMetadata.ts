
import { toast } from "@/components/ui/use-toast";

// Character Roles
export enum NFTRole {
  SENTINEL = "SENTINEL",
  SURVIVOR = "SURVIVOR",
  BOUNTY_HUNTER = "BOUNTY_HUNTER"
}

// Character Type definition
export interface CharacterType {
  role: NFTRole;
  maxSupply: number;
  minted: number;
  name: string;
  metadataCID: string;
}

// Character metadata interface
export interface CharacterMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

// Define constants for character type supplies
const SENTINEL_PER_TYPE = 100;
const OTHER_ROLES_PER_TYPE = 150;

// Character types with metadata CIDs from Pinata
export const characterTypes: Record<number, CharacterType> = {
  // SENTINELS (Types 1..7)
  1: { role: NFTRole.SENTINEL, maxSupply: SENTINEL_PER_TYPE, minted: 0, name: "DAO Enforcer", metadataCID: "bafkreibo6bk5dezlsii7imuabncv7tihxwbi4f4urds75l7nuy2rnxfkru" },
  2: { role: NFTRole.SENTINEL, maxSupply: SENTINEL_PER_TYPE, minted: 0, name: "Insolvent Medic", metadataCID: "bafkreid7oobbrlbxcnnigfcwfbgr5m3dmsl6wemsuaxluzd54ioclneubq" },
  3: { role: NFTRole.SENTINEL, maxSupply: SENTINEL_PER_TYPE, minted: 0, name: "Liquidation Phantom", metadataCID: "bafkreicfsovqdpu3byxvyfev4y7xdmqz3hggewsuyx4brifoscercektpy" },
  4: { role: NFTRole.SENTINEL, maxSupply: SENTINEL_PER_TYPE, minted: 0, name: "Margin Call Marauder", metadataCID: "bafkreiaasojzt45tw5jkohgwvibtth6nl4jlognknercfpgir6zjpw335u" },
  5: { role: NFTRole.SENTINEL, maxSupply: SENTINEL_PER_TYPE, minted: 0, name: "Overleveraged Berserker", metadataCID: "bafkreihigf4xjzy4jrqkm7wsxxdtokwew4m3njdxt6hheb67nuit47byta" },
  6: { role: NFTRole.SENTINEL, maxSupply: SENTINEL_PER_TYPE, minted: 0, name: "Rugged Nomad", metadataCID: "bafkreibhb3upqoifbl77jbrqxp2puudelcrjf45jnfkdqipef6skzpewti" },
  7: { role: NFTRole.SENTINEL, maxSupply: SENTINEL_PER_TYPE, minted: 0, name: "Yield Farm Executioner", metadataCID: "bafkreibo5yjsmqlt2cc7olqeuz2wxref7oe54bmallzl4mgwkt3xsnjlqi" },
  // SURVIVORS (Types 8..10)
  8: { role: NFTRole.SURVIVOR, maxSupply: OTHER_ROLES_PER_TYPE, minted: 0, name: "Rugpull Veteran", metadataCID: "bafkreiek2ihnc7fmpwzseitea2vflvwdmm6qvn4vydd5ww6wgipntf3w7a" },
  9: { role: NFTRole.SURVIVOR, maxSupply: OTHER_ROLES_PER_TYPE, minted: 0, name: "Blacklist Exile", metadataCID: "bafkreica5ugau5cjah7hkwz4ko36oqxkg2v4swqpxnhzi7z4wgftl76q5m" },
  10: { role: NFTRole.SURVIVOR, maxSupply: OTHER_ROLES_PER_TYPE, minted: 0, name: "Failed Validator", metadataCID: "bafkreigw5k75stzjhamdjtwlssbolhxepbeglfs3qoyowgu2q4n2fnfszy" },
  // BOUNTY HUNTERS (Types 11..16)
  11: { role: NFTRole.BOUNTY_HUNTER, maxSupply: OTHER_ROLES_PER_TYPE, minted: 0, name: "Chain Reaper", metadataCID: "bafkreifepvbd2shm4uxfysdxtva5mjs7fqnxbxehutcoqfblmcgtp7h7ka" },
  12: { role: NFTRole.BOUNTY_HUNTER, maxSupply: OTHER_ROLES_PER_TYPE, minted: 0, name: "Forked Hunter", metadataCID: "bafkreierebrs3yw24r7wgkezgok6lhbiwqwwgen5fnfqxm6cqul644x3fe" },
  13: { role: NFTRole.BOUNTY_HUNTER, maxSupply: OTHER_ROLES_PER_TYPE, minted: 0, name: "Liquidated Tracker", metadataCID: "bafkreiajc2mwtirx3423mbf55scuniqlwh3ph2cglk7y2nbd764r6g6ine" },
  14: { role: NFTRole.BOUNTY_HUNTER, maxSupply: OTHER_ROLES_PER_TYPE, minted: 0, name: "Oracle Stalker", metadataCID: "bafkreieytk2bsis7fdavqu74t3dgquew36ppycxnlbxt6dgzudjakcrexq" },
  15: { role: NFTRole.BOUNTY_HUNTER, maxSupply: OTHER_ROLES_PER_TYPE, minted: 0, name: "Slippage Sniper", metadataCID: "bafkreidrcpfmaken4gsbeweqthzrg3bkcxi344bftqwndiapeo6pm4msda" },
  16: { role: NFTRole.BOUNTY_HUNTER, maxSupply: OTHER_ROLES_PER_TYPE, minted: 0, name: "Sandwich Hunter", metadataCID: "bafkreigxfbvntll522na4la6b4cdvp5g74jztgjhgdmz2b5uv7uaieywie" }
};

// Convert characterType to OpenSeaNFT format for compatibility with existing components
export const convertToOpenSeaNFT = (characterType: CharacterType, typeId: number, metadata: CharacterMetadata) => {
  return {
    identifier: typeId.toString(),
    collection: "resistance-wasteland",
    contract: "0xdD44d15f54B799e940742195e97A30165A1CD285",
    token_standard: "ERC721",
    name: characterType.name,
    description: metadata.description || `A ${characterType.role.toLowerCase()} in the post-apocalyptic wasteland.`,
    image_url: metadata.image || `/placeholder.svg`,
    metadata_url: `ipfs://${characterType.metadataCID}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_disabled: false,
    is_nsfw: false,
    traits: metadata.attributes.map(attr => ({
      trait_type: attr.trait_type,
      value: attr.value.toString(),
      display_type: null,
    })),
    animation_url: null,
    is_suspicious: false,
    creator: null,
    owners: [
      {
        address: `0x${Math.random().toString(16).substring(2, 42)}`,
        quantity: 1,
      },
    ],
    rarity: {
      rank: Math.floor(Math.random() * 1000) + 1,
      score: Math.random() * 100,
      total: 1000,
    },
  };
};

// Cache for character metadata to avoid repeated fetching
const metadataCache: Record<string, CharacterMetadata> = {};

// Function to fetch character metadata from Pinata
export const fetchCharacterMetadata = async (cid: string): Promise<CharacterMetadata> => {
  try {
    // Check if metadata is already in cache
    if (metadataCache[cid]) {
      return metadataCache[cid];
    }

    // Fetch metadata from Pinata gateway
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
    console.log('Fetching character metadata from:', ipfsUrl);
    
    const response = await fetch(ipfsUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }
    
    const metadata = await response.json();
    
    // Cache the metadata
    metadataCache[cid] = metadata;
    
    return metadata;
  } catch (error) {
    console.error('Error fetching character metadata:', error);
    toast({
      title: "Error loading character metadata",
      description: "Using fallback data instead",
      variant: "destructive"
    });
    
    // Return fallback metadata
    return {
      name: "Unknown Character",
      description: "Metadata unavailable",
      image: "/placeholder.svg",
      attributes: [
        { trait_type: "Role", value: "Unknown" },
        { trait_type: "Radiation Level", value: Math.floor(Math.random() * 100) }
      ]
    };
  }
};

// Get character type by ID
export const getCharacterTypeById = (id: number): CharacterType | null => {
  return characterTypes[id] || null;
};

// Get all character types of a specific role
export const getCharactersByRole = (role: NFTRole): {id: number, character: CharacterType}[] => {
  return Object.entries(characterTypes)
    .filter(([_, character]) => character.role === role)
    .map(([id, character]) => ({ id: parseInt(id), character }));
};

// Function to fetch multiple characters with their metadata
export const fetchCharactersWithMetadata = async (characterIds: number[]): Promise<Array<{id: number, nft: any}>> => {
  const results = await Promise.all(
    characterIds.map(async (id) => {
      const character = getCharacterTypeById(id);
      if (!character) return null;
      
      try {
        const metadata = await fetchCharacterMetadata(character.metadataCID);
        const nft = convertToOpenSeaNFT(character, id, metadata);
        return { id, nft };
      } catch (error) {
        console.error(`Error fetching metadata for character ${id}:`, error);
        return null;
      }
    })
  );
  
  return results.filter(Boolean) as Array<{id: number, nft: any}>;
};

// Get characters grouped by role with metadata
export const getCharactersGroupedByRole = async () => {
  const sentinelIds = getCharactersByRole(NFTRole.SENTINEL).map(item => item.id);
  const survivorIds = getCharactersByRole(NFTRole.SURVIVOR).map(item => item.id);
  const bountyHunterIds = getCharactersByRole(NFTRole.BOUNTY_HUNTER).map(item => item.id);
  
  const [sentinels, survivors, bountyHunters] = await Promise.all([
    fetchCharactersWithMetadata(sentinelIds),
    fetchCharactersWithMetadata(survivorIds),
    fetchCharactersWithMetadata(bountyHunterIds)
  ]);
  
  return {
    sentinels: sentinels.map(item => item.nft),
    survivors: survivors.map(item => item.nft),
    bountyHunters: bountyHunters.map(item => item.nft)
  };
};
