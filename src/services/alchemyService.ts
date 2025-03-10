
import { createPublicClient, http, PublicClient } from "viem";
import { polygon } from "viem/chains";
import { Settlement } from "@/utils/settlementConversion";

// Constants
export const RESISTANCE_NFT_ADDRESS = "0xdD44d15f54B799e940742195e97A30165A1CD285";
export const SURVIVOR_NFT_ADDRESS = "0xd3F9cA9d44728611dA7128ec71E40D0314FCE89C";

// Alchemy API key
const ALCHEMY_API_KEY = "iTtNiAAH4RhVb4DGHCF4RgQ6xWCPLDN7";
const ALCHEMY_BASE_URL = "https://polygon-mainnet.g.alchemy.com/v2/";

// Create a viem public client using Alchemy
export const alchemyClient = createPublicClient({
  chain: polygon,
  transport: http(`${ALCHEMY_BASE_URL}${ALCHEMY_API_KEY}`),
});

// NFT Types
export type NFTClass = 'Sentinel' | 'Survivor' | 'Bounty Hunter' | 'Unknown';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  animation_url?: string;
  character_model_cid?: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface ResistanceNFT {
  tokenId: string;
  contractAddress: string;
  class: NFTClass;
  name?: string;
  image?: string;
  animation_url?: string;
  modelCid?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
  owner?: string;
}

// Responses from Alchemy API
interface AlchemyNFTResponse {
  ownedNfts: Array<{
    contractAddress: string;
    tokenId: string;
    tokenType: string;
    title: string;
    description: string;
    tokenUri: {
      raw: string;
      gateway: string;
    };
    media: Array<{
      raw: string;
      gateway: string;
    }>;
    metadata: NFTMetadata;
    timeLastUpdated: string;
  }>;
  totalCount: number;
  blockHash: string;
}

// Fetch NFTs for a given address
export const fetchNFTsForAddress = async (address: string): Promise<ResistanceNFT[]> => {
  try {
    // Use the Alchemy NFT API
    const url = `${ALCHEMY_BASE_URL}${ALCHEMY_API_KEY}/getNFTs/?owner=${address}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Alchemy API error: ${response.statusText}`);
    }
    
    const data: AlchemyNFTResponse = await response.json();
    
    // Process and filter for Resistance NFTs
    return data.ownedNfts
      .filter(nft => nft.contractAddress.toLowerCase() === RESISTANCE_NFT_ADDRESS.toLowerCase())
      .map(nft => {
        // Extract class from metadata attributes
        const classAttribute = nft.metadata?.attributes?.find(attr => 
          attr.trait_type === "Class"
        );
        
        const resistanceNFT: ResistanceNFT = {
          tokenId: nft.tokenId,
          contractAddress: nft.contractAddress,
          class: (classAttribute?.value as NFTClass) || 'Unknown',
          name: nft.metadata?.name,
          image: nft.metadata?.image,
          animation_url: nft.metadata?.animation_url,
          modelCid: nft.metadata?.character_model_cid,
          attributes: nft.metadata?.attributes,
          owner: address
        };
        
        return resistanceNFT;
      });
  } catch (error) {
    console.error("Error fetching NFTs from Alchemy:", error);
    return [];
  }
};

// Check if address owns a specific type of NFT
export const checkNFTOwnership = async (
  address: string, 
  nftClass?: NFTClass
): Promise<{ hasNFT: boolean; tokenId?: string; nft?: ResistanceNFT }> => {
  try {
    const nfts = await fetchNFTsForAddress(address);
    
    if (nfts.length === 0) {
      return { hasNFT: false };
    }
    
    // If no specific class is requested, return true if any NFT exists
    if (!nftClass) {
      return { 
        hasNFT: true, 
        tokenId: nfts[0].tokenId,
        nft: nfts[0]
      };
    }
    
    // Find NFT of the specified class
    const matchingNFT = nfts.find(nft => nft.class === nftClass);
    
    if (matchingNFT) {
      return {
        hasNFT: true,
        tokenId: matchingNFT.tokenId,
        nft: matchingNFT
      };
    }
    
    return { hasNFT: false };
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return { hasNFT: false };
  }
};

// Check if address is a Sentinel
export const isSentinel = async (address: string): Promise<boolean> => {
  const { hasNFT } = await checkNFTOwnership(address, 'Sentinel');
  return hasNFT;
};

// Check if address is a Survivor
export const isSurvivor = async (address: string): Promise<boolean> => {
  const { hasNFT } = await checkNFTOwnership(address, 'Survivor');
  return hasNFT;
};

// Check if address is a Bounty Hunter
export const isBountyHunter = async (address: string): Promise<boolean> => {
  const { hasNFT } = await checkNFTOwnership(address, 'Bounty Hunter');
  return hasNFT;
};

// Get primary role of an address
export const getPrimaryRole = async (address: string): Promise<NFTClass> => {
  // Priority order: Sentinel > Bounty Hunter > Survivor
  if (await isSentinel(address)) return 'Sentinel';
  if (await isBountyHunter(address)) return 'Bounty Hunter';
  if (await isSurvivor(address)) return 'Survivor';
  return 'Unknown';
};

// Get NFT balances by contract
export const getNFTBalanceByContract = async (
  address: string,
  contractAddress: string
): Promise<number> => {
  try {
    const url = `${ALCHEMY_BASE_URL}${ALCHEMY_API_KEY}/getNFTs/?owner=${address}&contractAddresses[]=${contractAddress}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Alchemy API error: ${response.statusText}`);
    }
    
    const data: AlchemyNFTResponse = await response.json();
    return data.totalCount;
  } catch (error) {
    console.error("Error getting NFT balance:", error);
    return 0;
  }
};

// Get NFT metadata by token ID and contract
export const getNFTMetadataByTokenId = async (
  contractAddress: string,
  tokenId: string
): Promise<NFTMetadata | null> => {
  try {
    const url = `${ALCHEMY_BASE_URL}${ALCHEMY_API_KEY}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${tokenId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Alchemy API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.metadata;
  } catch (error) {
    console.error("Error getting NFT metadata:", error);
    return null;
  }
};

// Process settlement data based on NFT ownership
export const processSettlementPermissions = (
  settlements: Settlement[], 
  userRole: NFTClass
): Settlement[] => {
  return settlements.map(settlement => {
    // Add permission flags based on user role
    const canInvest = userRole === 'Sentinel';
    const canPropose = userRole === 'Sentinel' || userRole === 'Survivor';
    const canVote = userRole !== 'Unknown';
    
    // Add category based on settlement type
    const category = settlement.category || getDefaultCategory(settlement.name);
    
    return {
      ...settlement,
      canInvest,
      canPropose,
      canVote,
      category
    };
  });
};

// Helper to get default category if none exists
const getDefaultCategory = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('token') || lowerName.includes('defi')) return 'DeFi';
  if (lowerName.includes('game')) return 'Gaming';
  if (lowerName.includes('nft') || lowerName.includes('art')) return 'NFT';
  if (lowerName.includes('dao')) return 'Governance';
  if (lowerName.includes('data') || lowerName.includes('ai')) return 'Data & AI';
  return 'Infrastructure';
};
