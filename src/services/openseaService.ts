
import { toast } from "@/components/ui/use-toast";

// OpenSea API base URL for Polygon network
const OPENSEA_API_BASE_URL = "https://api.opensea.io/api/v2";
// Update the API key with a mock data fallback system
const OPENSEA_API_KEY = ""; // We'll leave this empty for now

// Mock NFT data for development when API is unavailable
const MOCK_NFTS = Array.from({ length: 20 }).map((_, index) => ({
  identifier: `${index + 1}`,
  collection: "resistance-wasteland",
  contract: "0xdD44d15f54B799e940742195e97A30165A1CD285",
  token_standard: "ERC721",
  name: `Wasteland Survivor #${index + 1}`,
  description: "A survivor in the post-apocalyptic wasteland.",
  image_url: `/placeholder.svg`,
  metadata_url: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_disabled: false,
  is_nsfw: false,
  traits: [
    {
      trait_type: "Role",
      value: index % 3 === 0 ? "Survivor" : index % 3 === 1 ? "Bounty Hunter" : "Scavenger",
      display_type: null,
    },
    {
      trait_type: "Radiation Level",
      value: `${Math.floor(Math.random() * 100)}`,
      display_type: null,
    },
    {
      trait_type: "Strength",
      value: `${Math.floor(Math.random() * 10) + 1}`,
      display_type: null,
    },
    {
      trait_type: "Agility",
      value: `${Math.floor(Math.random() * 10) + 1}`,
      display_type: null,
    },
  ],
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
}));

// Mock collection data
const MOCK_COLLECTION = {
  collection: "resistance-wasteland",
  name: "Resistance Wasteland",
  description: "Survivors, Bounty Hunters, and Scavengers in the post-apocalyptic wasteland.",
  image_url: "/placeholder.svg",
  banner_image_url: "",
  owner: "0xdD44d15f54B799e940742195e97A30165A1CD285",
  safelist_status: "verified",
  category: "gaming",
  is_disabled: false,
  is_nsfw: false,
  traits: {
    "Role": {
      values: {
        "Survivor": { count: 8, value: "Survivor" },
        "Bounty Hunter": { count: 7, value: "Bounty Hunter" },
        "Scavenger": { count: 5, value: "Scavenger" }
      },
      count: 20
    },
    "Radiation Level": {
      values: {
        "High": { count: 5, value: "High" },
        "Medium": { count: 8, value: "Medium" },
        "Low": { count: 7, value: "Low" }
      },
      count: 20
    }
  },
  payment_tokens: [
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000"
    }
  ],
  creator_earnings: 2.5
};

interface OpenSeaNFT {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string;
  name: string;
  description: string;
  image_url: string;
  metadata_url: string;
  created_at: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  traits: Array<{
    trait_type: string;
    value: string;
    display_type: string | null;
  }>;
  animation_url: string | null;
  is_suspicious: boolean;
  creator: string | null;
  owners: Array<{
    address: string;
    quantity: number;
  }>;
  rarity: {
    rank: number;
    score: number;
    total: number;
  } | null;
}

interface OpenSeaCollection {
  collection: string;
  name: string;
  description: string;
  image_url: string;
  banner_image_url: string;
  owner: string;
  safelist_status: string;
  category: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  traits: Record<string, {
    values: Record<string, {
      count: number;
      value: string;
    }>;
    count: number;
  }>;
  payment_tokens: Array<{
    name: string;
    symbol: string;
    decimals: number;
    address: string;
  }>;
  creator_earnings: number;
}

interface OpenSeaResponse<T> {
  data: T;
  next: string | null;
  previous: string | null;
}

// Function to fetch collection info
export const fetchCollectionInfo = async (contractAddress: string): Promise<OpenSeaCollection | null> => {
  try {
    // If API key is not provided, use mock data
    if (!OPENSEA_API_KEY) {
      console.log("Using mock collection data (no API key provided)");
      return MOCK_COLLECTION;
    }

    const response = await fetch(`${OPENSEA_API_BASE_URL}/chain/matic/contract/${contractAddress}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': OPENSEA_API_KEY
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenSea API error:', errorText);
      
      // Fallback to mock data on error
      console.log("Falling back to mock collection data");
      return MOCK_COLLECTION;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching collection info:', error);
    toast({
      title: "Using demo NFT data",
      description: "Could not connect to OpenSea API, using sample data instead",
      variant: "default"
    });
    
    // Return mock data on error
    return MOCK_COLLECTION;
  }
};

// Function to fetch NFTs for a contract
export const fetchNFTsByContract = async (
  contractAddress: string, 
  limit: number = 20, 
  next: string | null = null
): Promise<OpenSeaResponse<OpenSeaNFT[]> | null> => {
  try {
    // If API key is not provided, use mock data
    if (!OPENSEA_API_KEY) {
      console.log("Using mock NFT data (no API key provided)");
      const mockData = MOCK_NFTS.slice(0, limit);
      return {
        data: mockData,
        next: mockData.length >= limit ? "mock-next-cursor" : null,
        previous: null
      };
    }

    let url = `${OPENSEA_API_BASE_URL}/chain/matic/contract/${contractAddress}/nfts?limit=${limit}`;
    
    if (next) {
      url += `&next=${next}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': OPENSEA_API_KEY
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenSea API error:', errorText);
      
      // Fallback to mock data on error
      console.log("Falling back to mock NFT data");
      const mockData = MOCK_NFTS.slice(0, limit);
      return {
        data: mockData,
        next: mockData.length >= limit ? "mock-next-cursor" : null,
        previous: null
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching NFTs by contract:', error);
    toast({
      title: "Using demo NFT data",
      description: "Could not connect to OpenSea API, using sample data instead",
      variant: "default"
    });
    
    // Return mock data on error
    const mockData = MOCK_NFTS.slice(0, limit);
    return {
      data: mockData,
      next: mockData.length >= limit ? "mock-next-cursor" : null,
      previous: null
    };
  }
};

// Function to fetch a specific NFT
export const fetchNFTByTokenId = async (
  contractAddress: string,
  tokenId: string
): Promise<OpenSeaNFT | null> => {
  try {
    // If API key is not provided, use mock data
    if (!OPENSEA_API_KEY) {
      console.log("Using mock NFT data (no API key provided)");
      const mockNft = MOCK_NFTS.find(nft => nft.identifier === tokenId) || MOCK_NFTS[0];
      return {
        ...mockNft,
        identifier: tokenId
      };
    }

    const response = await fetch(
      `${OPENSEA_API_BASE_URL}/chain/matic/contract/${contractAddress}/nfts/${tokenId}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'X-API-KEY': OPENSEA_API_KEY
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenSea API error:', errorText);
      
      // Fallback to mock data on error
      console.log("Falling back to mock NFT data");
      const mockNft = MOCK_NFTS.find(nft => nft.identifier === tokenId) || MOCK_NFTS[0];
      return {
        ...mockNft,
        identifier: tokenId
      };
    }

    const data = await response.json();
    return data.nft;
  } catch (error) {
    console.error('Error fetching NFT by token ID:', error);
    toast({
      title: "Using demo NFT data",
      description: "Could not connect to OpenSea API, using sample data instead",
      variant: "default"
    });
    
    // Return mock data on error
    const mockNft = MOCK_NFTS.find(nft => nft.identifier === tokenId) || MOCK_NFTS[0];
    return {
      ...mockNft,
      identifier: tokenId
    };
  }
};

// Create role-specific NFT groups for the character showcase
export const getNFTsByRole = () => {
  const survivors = MOCK_NFTS.filter(nft => 
    nft.traits.some(trait => 
      trait.trait_type === 'Role' && trait.value === 'Survivor'
    )
  ).slice(0, 3);
  
  const bountyHunters = MOCK_NFTS.filter(nft => 
    nft.traits.some(trait => 
      trait.trait_type === 'Role' && trait.value === 'Bounty Hunter'
    )
  ).slice(0, 3);
  
  const scavengers = MOCK_NFTS.filter(nft => 
    nft.traits.some(trait => 
      trait.trait_type === 'Role' && trait.value === 'Scavenger'
    )
  ).slice(0, 3);
  
  return {
    survivors,
    bountyHunters,
    scavengers
  };
};

// Export types for use in other files
export type { OpenSeaNFT, OpenSeaCollection, OpenSeaResponse };
