
import { toast } from "@/components/ui/use-toast";

// OpenSea API base URL for Polygon network
const OPENSEA_API_BASE_URL = "https://api.opensea.io/api/v2";
const OPENSEA_API_KEY = "5cde1d5bb5304b1e8736b6d12e4c6f11";

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
    const response = await fetch(`${OPENSEA_API_BASE_URL}/chain/matic/contract/${contractAddress}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': OPENSEA_API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenSea API error:', errorData);
      throw new Error(`Failed to fetch collection: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching collection info:', error);
    toast({
      title: "Error fetching collection",
      description: error.message || "Failed to load NFT collection information",
      variant: "destructive"
    });
    return null;
  }
};

// Function to fetch NFTs for a contract
export const fetchNFTsByContract = async (
  contractAddress: string, 
  limit: number = 20, 
  next: string | null = null
): Promise<OpenSeaResponse<OpenSeaNFT[]> | null> => {
  try {
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
      const errorData = await response.json();
      console.error('OpenSea API error:', errorData);
      throw new Error(`Failed to fetch NFTs: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching NFTs by contract:', error);
    toast({
      title: "Error fetching NFTs",
      description: error.message || "Failed to load NFTs from contract",
      variant: "destructive"
    });
    return null;
  }
};

// Function to fetch a specific NFT
export const fetchNFTByTokenId = async (
  contractAddress: string,
  tokenId: string
): Promise<OpenSeaNFT | null> => {
  try {
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
      const errorData = await response.json();
      console.error('OpenSea API error:', errorData);
      throw new Error(`Failed to fetch NFT: ${response.status}`);
    }

    const data = await response.json();
    return data.nft;
  } catch (error) {
    console.error('Error fetching NFT by token ID:', error);
    toast({
      title: "Error fetching NFT",
      description: error.message || "Failed to load NFT details",
      variant: "destructive"
    });
    return null;
  }
};

// Export types for use in other files
export type { OpenSeaNFT, OpenSeaCollection, OpenSeaResponse };
