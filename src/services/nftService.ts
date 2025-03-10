
import { createPublicClient, http, type PublicClient } from "viem";
import { polygon } from "viem/chains";

// NFT Contract address for all Resistance DAO roles
export const RESISTANCE_NFT_ADDRESS = "0xdD44d15f54B799e940742195e97A30165A1CD285";

// Define the supported NFT classes
export type NFTClass = 'Sentinel' | 'Survivor' | 'Bounty Hunter' | 'Unknown';

// Define the ResistanceNFT type
export interface ResistanceNFT {
  tokenId: string;
  class: NFTClass;
  name: string;
  description?: string;
  image?: string;
  animation_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

// NFT ABI for ERC721
const NFT_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "uint256", "name": "index", "type": "uint256" }
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Create Viem public client with a generic Polygon RPC endpoint
const client = createPublicClient({
  chain: polygon,
  transport: http("https://polygon-rpc.com")
});

/**
 * Get contract instance for the NFT contract
 * @returns Contract instance
 */
const getNFTContract = () => {
  return {
    address: RESISTANCE_NFT_ADDRESS as `0x${string}`,
    abi: NFT_ABI,
    publicClient: client
  };
};

/**
 * Gets the NFT balance for a specific address from the Resistance NFT contract
 * @param address Owner address
 * @returns Number of NFTs owned
 */
export const getNFTBalanceByContract = async (address: string): Promise<number> => {
  try {
    if (!address) return 0;
    
    // For development/testing
    if (process.env.NODE_ENV === 'development') {
      console.log(`Development mode: Mocking NFT balance for ${address}`);
      // Return mock data for testing
      return 3; // Mock total balance of NFTs
    }
    
    // Get contract instance
    const contract = getNFTContract();
    
    // Get balance
    const balance = await client.readContract({
      ...contract,
      functionName: 'balanceOf',
      args: [address as `0x${string}`]
    });
    
    return Number(balance);
  } catch (error) {
    console.error("Error getting NFT balance:", error);
    return 0;
  }
};

/**
 * Checks if an address owns any Resistance NFTs
 * @param address Owner address
 * @returns boolean indicating ownership
 */
export const checkNFTOwnership = async (address: string): Promise<boolean> => {
  try {
    const balance = await getNFTBalanceByContract(address);
    return balance > 0;
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return false;
  }
};

/**
 * Determines the NFT class from attributes
 * @param attributes Array of NFT attributes
 * @returns The NFT class
 */
const getNFTClassFromAttributes = (attributes: Array<{trait_type: string; value: string}>): NFTClass => {
  // Find the Class attribute
  const classAttribute = attributes.find(
    attr => attr.trait_type === "Class"
  );
  
  if (!classAttribute) return 'Unknown';
  
  // Check if the value matches one of our known classes
  switch (classAttribute.value) {
    case 'Sentinel':
      return 'Sentinel';
    case 'Survivor':
      return 'Survivor';
    case 'Bounty Hunter':
      return 'Bounty Hunter';
    default:
      return 'Unknown';
  }
};

/**
 * Get NFT metadata by token ID
 * @param tokenId Token ID
 * @returns NFT metadata
 */
const getNFTMetadata = async (tokenId: string): Promise<any> => {
  try {
    // For development/testing
    if (process.env.NODE_ENV === 'development') {
      // Return mock metadata based on token ID pattern
      // Token IDs 100-199: Sentinels, 200-299: Survivors, 300-399: Bounty Hunters
      const tokenNum = parseInt(tokenId);
      
      if (tokenNum >= 100 && tokenNum < 200) {
        return {
          name: "Sentinel #" + tokenId,
          description: "Sentinel NFT",
          attributes: [{ trait_type: "Class", value: "Sentinel" }]
        };
      } else if (tokenNum >= 200 && tokenNum < 300) {
        return {
          name: "Survivor #" + tokenId,
          description: "Survivor NFT",
          attributes: [{ trait_type: "Class", value: "Survivor" }]
        };
      } else {
        return {
          name: "Bounty Hunter #" + tokenId,
          description: "Bounty Hunter NFT",
          attributes: [{ trait_type: "Class", value: "Bounty Hunter" }]
        };
      }
    }
    
    // Get contract instance
    const contract = getNFTContract();
    
    // Get token URI
    const uri = await client.readContract({
      ...contract,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)]
    });
    
    // Fetch metadata from URI
    const response = await fetch(uri as string);
    return await response.json();
  } catch (error) {
    console.error("Error getting NFT metadata:", error);
    return null;
  }
};

/**
 * Gets token IDs owned by an address
 * @param address Owner address
 * @returns Array of token IDs
 */
const getTokenIdsForOwner = async (address: string): Promise<string[]> => {
  try {
    // For development/testing
    if (process.env.NODE_ENV === 'development') {
      // Return mock token IDs - a mix of classes for testing
      return ["101", "201", "301"]; // Sentinel, Survivor, Bounty Hunter
    }
    
    // Get contract instance
    const contract = getNFTContract();
    
    // Get balance
    const balance = await client.readContract({
      ...contract,
      functionName: 'balanceOf',
      args: [address as `0x${string}`]
    });
    
    const tokenIds: string[] = [];
    
    // Get all token IDs
    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await client.readContract({
        ...contract,
        functionName: 'tokenOfOwnerByIndex',
        args: [address as `0x${string}`, BigInt(i)]
      });
      
      tokenIds.push(tokenId.toString());
    }
    
    return tokenIds;
  } catch (error) {
    console.error("Error getting token IDs:", error);
    return [];
  }
};

/**
 * Fetches all NFTs owned by an address
 * @param address Owner address
 * @returns Array of ResistanceNFT objects
 */
export const fetchNFTsForAddress = async (address: string): Promise<ResistanceNFT[]> => {
  try {
    console.log(`Fetching NFTs for address: ${address}`);
    
    if (!address) return [];
    
    // Fetch token IDs owned by the address
    const tokenIds = await getTokenIdsForOwner(address);
    
    const nfts: ResistanceNFT[] = [];
    
    // Process each token and fetch its metadata
    for (const tokenId of tokenIds) {
      const metadata = await getNFTMetadata(tokenId);
      if (!metadata) continue;
      
      // Determine the NFT class from metadata attributes
      const nftClass = getNFTClassFromAttributes(metadata?.attributes || []);
      
      nfts.push({
        tokenId,
        class: nftClass,
        name: metadata?.name || `NFT #${tokenId}`,
        description: metadata?.description,
        image: metadata?.image,
        animation_url: metadata?.animation_url,
        attributes: metadata?.attributes || []
      });
    }
    
    return nfts;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
};

/**
 * Gets the primary role of an address based on their NFTs
 * @param address Owner address
 * @returns The primary NFT class
 */
export const getPrimaryRole = async (address: string): Promise<NFTClass> => {
  try {
    const nfts = await fetchNFTsForAddress(address);
    
    if (nfts.length === 0) return 'Unknown';
    
    // Priority: Sentinel > Bounty Hunter > Survivor
    if (nfts.some(nft => nft.class === 'Sentinel')) return 'Sentinel';
    if (nfts.some(nft => nft.class === 'Bounty Hunter')) return 'Bounty Hunter';
    if (nfts.some(nft => nft.class === 'Survivor')) return 'Survivor';
    
    return 'Unknown';
  } catch (error) {
    console.error("Error getting primary role:", error);
    return 'Unknown';
  }
};

/**
 * Process settlements with role-based permissions
 * @param settlements Array of settlements to process
 * @param userRole User's primary role
 * @returns Settlements with added permission flags
 */
export const processSettlementPermissions = (
  settlements: any[], 
  userRole: NFTClass
): any[] => {
  return settlements.map(settlement => {
    // Clone the settlement to avoid mutating the original
    const processedSettlement = { ...settlement };
    
    // Apply role-based permissions
    processedSettlement.canInvest = userRole === 'Sentinel';
    processedSettlement.canPropose = ['Sentinel', 'Survivor'].includes(userRole);
    processedSettlement.canVote = userRole !== 'Unknown';
    
    return processedSettlement;
  });
};
