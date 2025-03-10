import { type OpenSeaNFT } from "@/services/openseaService";
import { toast } from "@/components/ui/use-toast";

// Character types
export type CharacterRole = 'Sentinel' | 'Survivor' | 'Bounty Hunter';

export interface CharacterMetadata {
  id: number;
  tokenId: string;
  name: string;
  description: string;
  image_url: string;
  model_url?: string;
  character_model_cid?: string;
  role: CharacterRole;
  radiation_level: number;
  rarity: string;
  traits: Array<{
    trait_type: string;
    value: string;
  }>;
}

// Convert character metadata to OpenSeaNFT format for compatibility
export const convertToNFT = (character: CharacterMetadata): OpenSeaNFT => {
  console.log("Converting character to NFT format:", {
    id: character.id,
    name: character.name,
    model_url: character.model_url,
    character_model_cid: character.character_model_cid
  });
  
  // Properly format the animation_url based on character_model_cid or model_url
  const animation_url = character.character_model_cid 
    ? `https://gateway.pinata.cloud/ipfs/${character.character_model_cid}`
    : character.model_url || null;
  
  console.log("Using animation URL:", animation_url);
  
  return {
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
      trait_type: trait.trait_type,
      value: trait.value,
      display_type: null // Add the required display_type property
    })),
    animation_url,
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
  };
};

// Character data - includes our predefined characters
const characterData: CharacterMetadata[] = [
  {
    id: 1,
    tokenId: "1",
    name: "Sentinel Alpha",
    description: "Leader of the Sentinel faction, protector of the wasteland survivors.",
    image_url: "/images/characters/sentinel-01.jpg",
    model_url: "bafybeibekhofrvk7beimkculpeyum4wvcvyd7rhsst4wppnrwyqvw5i4ke",
    character_model_cid: "bafybeibekhofrvk7beimkculpeyum4wvcvyd7rhsst4wppnrwyqvw5i4ke",
    role: "Sentinel",
    radiation_level: 25,
    rarity: "Legendary",
    traits: [
      { trait_type: "Role", value: "Sentinel" },
      { trait_type: "Radiation Level", value: "25" },
      { trait_type: "Strength", value: "9" },
      { trait_type: "Agility", value: "7" },
      { trait_type: "Intelligence", value: "8" },
      { trait_type: "Leadership", value: "10" },
    ]
  },
  {
    id: 2,
    tokenId: "2",
    name: "Survivor Echo",
    description: "A resourceful survivor who has adapted to the toxic wasteland.",
    image_url: "/images/characters/survivor-01.jpg",
    model_url: "bafybeihpgxrm2ichhfyrwkpni5omrdnkomxktv5uybjyqvuagoe73mn7bu",
    role: "Survivor",
    radiation_level: 45,
    rarity: "Rare",
    traits: [
      { trait_type: "Role", value: "Survivor" },
      { trait_type: "Radiation Level", value: "45" },
      { trait_type: "Strength", value: "6" },
      { trait_type: "Agility", value: "8" },
      { trait_type: "Intelligence", value: "7" },
      { trait_type: "Resourcefulness", value: "9" },
    ]
  },
  {
    id: 3,
    tokenId: "3",
    name: "Bounty Hunter Vex",
    description: "A ruthless hunter who tracks down targets for payment.",
    image_url: "/images/characters/bounty-hunter-01.jpg",
    model_url: "bafybeidymb7wlx2clkvdnbxsyb5jfg46i6bgu4zmnl5tt2f7lpjbyvpjtm",
    role: "Bounty Hunter",
    radiation_level: 60,
    rarity: "Epic",
    traits: [
      { trait_type: "Role", value: "Bounty Hunter" },
      { trait_type: "Radiation Level", value: "60" },
      { trait_type: "Strength", value: "8" },
      { trait_type: "Agility", value: "9" },
      { trait_type: "Intelligence", value: "6" },
      { trait_type: "Lethality", value: "9" },
    ]
  },
  {
    id: 4,
    tokenId: "4",
    name: "Sentinel Guardian",
    description: "A dedicated protector of the wasteland safe zones.",
    image_url: "/images/characters/sentinel-02.jpg",
    model_url: "bafybeibdfykzadcbcplapkgpqcvtieswlyvzv2qgf6k7yzmvxdrzq3ar2q",
    role: "Sentinel",
    radiation_level: 35,
    rarity: "Uncommon",
    traits: [
      { trait_type: "Role", value: "Sentinel" },
      { trait_type: "Radiation Level", value: "35" },
      { trait_type: "Strength", value: "8" },
      { trait_type: "Agility", value: "6" },
      { trait_type: "Intelligence", value: "7" },
      { trait_type: "Resilience", value: "9" },
    ]
  },
  {
    id: 5,
    tokenId: "5",
    name: "Survivor Nova",
    description: "A survivor with immunity to certain radiation effects.",
    image_url: "/images/characters/survivor-02.jpg",
    model_url: "bafybeicfmxnp43c2v5rhuuh6riyxxhyb2gmnkulzgr7fxnlpwsxcvx35ry",
    role: "Survivor",
    radiation_level: 80,
    rarity: "Epic",
    traits: [
      { trait_type: "Role", value: "Survivor" },
      { trait_type: "Radiation Level", value: "80" },
      { trait_type: "Strength", value: "5" },
      { trait_type: "Agility", value: "7" },
      { trait_type: "Intelligence", value: "9" },
      { trait_type: "Radiation Resistance", value: "10" },
    ]
  },
  {
    id: 6,
    tokenId: "6",
    name: "Bounty Hunter Raze",
    description: "An expert tracker who never fails to find their target.",
    image_url: "/images/characters/bounty-hunter-02.jpg",
    model_url: "bafybeiakow7qyvh3jtn6vdq4sqcmzkqyjmcpxcnzxgdeipn6kd3ulrskv4",
    role: "Bounty Hunter",
    radiation_level: 50,
    rarity: "Rare",
    traits: [
      { trait_type: "Role", value: "Bounty Hunter" },
      { trait_type: "Radiation Level", value: "50" },
      { trait_type: "Strength", value: "7" },
      { trait_type: "Agility", value: "10" },
      { trait_type: "Intelligence", value: "8" },
      { trait_type: "Tracking", value: "10" },
    ]
  },
  {
    id: 7,
    tokenId: "7",
    name: "Sentinel Warden",
    description: "A tech-enhanced sentinel with advanced combat capabilities.",
    image_url: "/images/characters/sentinel-03.jpg",
    model_url: "bafybeicrn5lh7kls7qtfbx3hbgqseyrrbrmnc7kxzgy7y54ygxgslpw6ba",
    role: "Sentinel",
    radiation_level: 30,
    rarity: "Legendary",
    traits: [
      { trait_type: "Role", value: "Sentinel" },
      { trait_type: "Radiation Level", value: "30" },
      { trait_type: "Strength", value: "9" },
      { trait_type: "Agility", value: "8" },
      { trait_type: "Intelligence", value: "9" },
      { trait_type: "Tech Mastery", value: "10" },
    ]
  },
  {
    id: 8,
    tokenId: "8",
    name: "Survivor Ghost",
    description: "A stealthy survivor who has mastered the art of remaining unseen.",
    image_url: "/images/characters/survivor-03.jpg",
    model_url: "bafybeiekpitgwfjthioaglxhwxtui5iivz6rmttoibgud5eygws3uq5peu",
    role: "Survivor",
    radiation_level: 40,
    rarity: "Uncommon",
    traits: [
      { trait_type: "Role", value: "Survivor" },
      { trait_type: "Radiation Level", value: "40" },
      { trait_type: "Strength", value: "6" },
      { trait_type: "Agility", value: "10" },
      { trait_type: "Intelligence", value: "8" },
      { trait_type: "Stealth", value: "10" },
    ]
  },
  {
    id: 9,
    tokenId: "9",
    name: "Bounty Hunter Null",
    description: "A mysterious hunter with a perfect record of successful captures.",
    image_url: "/images/characters/bounty-hunter-03.jpg",
    model_url: "bafybeicm5qw5kso35vebgxakvspj3qsofpkmuhvpxotwsk5rprq5lqmpbm",
    role: "Bounty Hunter",
    radiation_level: 70,
    rarity: "Legendary",
    traits: [
      { trait_type: "Role", value: "Bounty Hunter" },
      { trait_type: "Radiation Level", value: "70" },
      { trait_type: "Strength", value: "9" },
      { trait_type: "Agility", value: "9" },
      { trait_type: "Intelligence", value: "9" },
      { trait_type: "Adaptability", value: "10" },
    ]
  },
  {
    id: 10,
    tokenId: "10",
    name: "Sentinel Forge",
    description: "A sentinel specialized in repairing and building technology.",
    image_url: "/images/characters/sentinel-04.jpg",
    model_url: "bafybeigbvfvhlsb72pxdmmupidmef2yocfavs4ldnbfkp7vbk7fvrz6wqq",
    role: "Sentinel",
    radiation_level: 20,
    rarity: "Common",
    traits: [
      { trait_type: "Role", value: "Sentinel" },
      { trait_type: "Radiation Level", value: "20" },
      { trait_type: "Strength", value: "8" },
      { trait_type: "Agility", value: "5" },
      { trait_type: "Intelligence", value: "10" },
      { trait_type: "Engineering", value: "10" },
    ]
  },
  {
    id: 11,
    tokenId: "11",
    name: "Survivor Drift",
    description: "A nomadic survivor who never stays in one place for long.",
    image_url: "/images/characters/survivor-04.jpg",
    model_url: "bafybeicfsmttgshkn2q3mlj4vctmwb7xoxnfzwdmhlefn7snvr2j3x4q5m",
    role: "Survivor",
    radiation_level: 55,
    rarity: "Rare",
    traits: [
      { trait_type: "Role", value: "Survivor" },
      { trait_type: "Radiation Level", value: "55" },
      { trait_type: "Strength", value: "7" },
      { trait_type: "Agility", value: "9" },
      { trait_type: "Intelligence", value: "8" },
      { trait_type: "Survival", value: "10" },
    ]
  },
  {
    id: 12,
    tokenId: "12",
    name: "Bounty Hunter Cross",
    description: "A strategic hunter who plans every move with precision.",
    image_url: "/images/characters/bounty-hunter-04.jpg",
    model_url: "bafybeidiuujaqoq2sjfwh7u6j3sveavgfyv7g2vr35vnqgvb3sge42iyui",
    role: "Bounty Hunter",
    radiation_level: 40,
    rarity: "Uncommon",
    traits: [
      { trait_type: "Role", value: "Bounty Hunter" },
      { trait_type: "Radiation Level", value: "40" },
      { trait_type: "Strength", value: "7" },
      { trait_type: "Agility", value: "7" },
      { trait_type: "Intelligence", value: "10" },
      { trait_type: "Strategy", value: "9" },
    ]
  },
  {
    id: 13,
    tokenId: "13",
    name: "Sentinel Pulse",
    description: "A sentinel with enhanced vision who can detect radiation fluctuations.",
    image_url: "/images/characters/sentinel-05.jpg",
    model_url: "bafybeicvvl64jcbdcnj6p4pnlefutcpd6mwwndqnz7ymqfifzkkszk5zl4",
    role: "Sentinel",
    radiation_level: 45,
    rarity: "Epic",
    traits: [
      { trait_type: "Role", value: "Sentinel" },
      { trait_type: "Radiation Level", value: "45" },
      { trait_type: "Strength", value: "6" },
      { trait_type: "Agility", value: "7" },
      { trait_type: "Intelligence", value: "9" },
      { trait_type: "Perception", value: "10" },
    ]
  },
  {
    id: 14,
    tokenId: "14",
    name: "Survivor Spark",
    description: "A survivor who harnesses radiation to power salvaged technology.",
    image_url: "/images/characters/survivor-05.jpg",
    model_url: "bafybeib5n4g7qixwugrbipaa2o6h6gr4mvagxvyxrja565mbbzod5avtv4",
    role: "Survivor",
    radiation_level: 75,
    rarity: "Legendary",
    traits: [
      { trait_type: "Role", value: "Survivor" },
      { trait_type: "Radiation Level", value: "75" },
      { trait_type: "Strength", value: "5" },
      { trait_type: "Agility", value: "6" },
      { trait_type: "Intelligence", value: "10" },
      { trait_type: "Energy Manipulation", value: "9" },
    ]
  },
  {
    id: 15,
    tokenId: "15",
    name: "Bounty Hunter Shadow",
    description: "A hunter who operates only at night, using darkness as cover.",
    image_url: "/images/characters/bounty-hunter-05.jpg",
    model_url: "bafybeihmbhjsik7iw7nwlys4ckxdhaiwixg5y6odgepvogolj7xkrlxgm4",
    role: "Bounty Hunter",
    radiation_level: 65,
    rarity: "Epic",
    traits: [
      { trait_type: "Role", value: "Bounty Hunter" },
      { trait_type: "Radiation Level", value: "65" },
      { trait_type: "Strength", value: "8" },
      { trait_type: "Agility", value: "10" },
      { trait_type: "Intelligence", value: "7" },
      { trait_type: "Stealth", value: "10" },
    ]
  },
  {
    id: 16,
    tokenId: "16",
    name: "Sentinel Nexus",
    description: "The most advanced sentinel, with unique radiation immunity.",
    image_url: "/images/characters/sentinel-06.jpg",
    model_url: "bafybeid7rxuopx5r2p2mbtvchzpnqwwphqtx22zs7coyhcw33csd6l24vy",
    role: "Sentinel",
    radiation_level: 90,
    rarity: "Mythic",
    traits: [
      { trait_type: "Role", value: "Sentinel" },
      { trait_type: "Radiation Level", value: "90" },
      { trait_type: "Strength", value: "10" },
      { trait_type: "Agility", value: "9" },
      { trait_type: "Intelligence", value: "10" },
      { trait_type: "Augmentation", value: "10" },
    ]
  },
];

// Get all the characters
export const getAllCharacters = (): Promise<CharacterMetadata[]> => {
  return Promise.resolve([...characterData]);
};

// Get character by ID
export const getCharacterById = (id: number): Promise<CharacterMetadata | undefined> => {
  const character = characterData.find(char => char.id === id);
  return Promise.resolve(character);
};

// Get character by token ID
export const getCharacterByTokenId = (tokenId: string): Promise<CharacterMetadata | undefined> => {
  const character = characterData.find(char => char.tokenId === tokenId);
  return Promise.resolve(character);
};

// Group characters by role
export const getCharactersGroupedByRole = async (): Promise<{
  sentinels: OpenSeaNFT[];
  survivors: OpenSeaNFT[];
  bountyHunters: OpenSeaNFT[];
}> => {
  try {
    console.log("Fetching characters grouped by role");
    const allCharacters = await getAllCharacters();
    
    const sentinels = allCharacters
      .filter(char => char.role === "Sentinel")
      .map(char => convertToNFT(char));
    
    const survivors = allCharacters
      .filter(char => char.role === "Survivor")
      .map(char => convertToNFT(char));
    
    const bountyHunters = allCharacters
      .filter(char => char.role === "Bounty Hunter")
      .map(char => convertToNFT(char));
    
    return { sentinels, survivors, bountyHunters };
  } catch (error) {
    console.error("Error fetching characters by role:", error);
    toast({
      title: "Error fetching characters",
      description: "Could not load character data. Please try again later.",
      variant: "destructive"
    });
    
    return { sentinels: [], survivors: [], bountyHunters: [] };
  }
};

// Get character NFT by token ID
export const getCharacterNFTByTokenId = async (tokenId: string): Promise<OpenSeaNFT | null> => {
  try {
    const character = await getCharacterByTokenId(tokenId);
    
    if (character) {
      return convertToNFT(character);
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching character NFT:", error);
    return null;
  }
};
