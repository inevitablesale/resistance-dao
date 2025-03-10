
import { createPublicClient, http, getContract, type GetContractReturnType } from "viem";
import { polygon } from "viem/chains";

// NFT Contract addresses for Resistance DAO roles
export const RESISTANCE_NFT_ADDRESS = "0xdD44d15f54B799e940742195e97A30165A1CD285";
export const SENTINEL_NFT_ADDRESS = "0xd3F9cA9d44728611dA7128ec71E40D0314FCE89C";
export const SURVIVOR_NFT_ADDRESS = "0xd3F9cA9d44728611dA7128ec71E40D0314FCE89C";
export const BOUNTY_HUNTER_NFT_ADDRESS = "0xdD44d15f54B799e940742195e97A30165A1CD285";

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
] as const; // Const assertion is important for proper typing

// Type for the NFT contract
type NFTContract = GetContractReturnType<typeof NFT_ABI>;

// Create Viem public client
const client = createPublicClient({
  chain: polygon,
  transport: http("https://polygon-mainnet.g.alchemy.com/v2/iTtNiAAH4RhVb4DGHCF4RgQ6xWCPLDN7")
});

/**
 * Get contract instance for a specific NFT contract
 * @param contractAddress The NFT contract address
 * @returns Contract instance
 */
const getNFTContract = (contractAddress: string): NFTContract => {
  return getContract({
    address: contractAddress as `0x${string}`,
    abi: NFT_ABI,
    publicClient: client
  });
};

/**
 * Gets the NFT balance for a specific address and contract
 * @param address Owner address
 * @param contractAddress NFT contract address
 * @returns Number of NFTs owned
 */
export const getNFTBalanceByContract = async (
  address: string, 
  contractAddress: string
): Promise<number> => {
  try {
    if (!address) return 0;
    
    // For development/testing
    if (process.env.NODE_ENV === 'development') {
      console.log(`Development mode: Mocking NFT balance for ${contractAddress}`);
      // Return mock data based on contract address
      if (contractAddress === SENTINEL_NFT_ADDRESS) return 1;
      if (contractAddress === SURVIVOR_NFT_ADDRESS) return 2;
      if (contractAddress === BOUNTY_HUNTER_NFT_ADDRESS) return 3;
      return 0;
    }
    
    // Get contract instance
    const contract = getNFTContract(contractAddress);
    
    // Get balance
    const balance = await contract.read.balanceOf([address as `0x${string}`]);
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
    const sentinelBalance = await getNFTBalanceByContract(address, SENTINEL_NFT_ADDRESS);
    const survivorBalance = await getNFTBalanceByContract(address, SURVIVOR_NFT_ADDRESS);
    const bountyHunterBalance = await getNFTBalanceByContract(address, BOUNTY_HUNTER_NFT_ADDRESS);
    
    return sentinelBalance > 0 || survivorBalance > 0 || bountyHunterBalance > 0;
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return false;
  }
};

/**
 * Get NFT metadata by token ID
 * @param contractAddress Contract address
 * @param tokenId Token ID
 * @returns NFT metadata
 */
const getNFTMetadata = async (contractAddress: string, tokenId: string): Promise<any> => {
  try {
    // For development/testing
    if (process.env.NODE_ENV === 'development') {
      // Return mock metadata
      if (contractAddress === SENTINEL_NFT_ADDRESS) {
        return {
          name: "Sentinel #" + tokenId,
          description: "Sentinel NFT",
          attributes: [{ trait_type: "Class", value: "Sentinel" }]
        };
      } else if (contractAddress === SURVIVOR_NFT_ADDRESS) {
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
    const contract = getNFTContract(contractAddress);
    
    // Get token URI
    const uri = await contract.read.tokenURI([BigInt(tokenId)]);
    
    // Fetch metadata from URI
    const response = await fetch(uri);
    return await response.json();
  } catch (error) {
    console.error("Error getting NFT metadata:", error);
    return null;
  }
};

/**
 * Gets token IDs owned by an address for a specific contract
 * @param address Owner address
 * @param contractAddress NFT contract address
 * @returns Array of token IDs
 */
const getTokenIdsForOwner = async (address: string, contractAddress: string): Promise<string[]> => {
  try {
    // For development/testing
    if (process.env.NODE_ENV === 'development') {
      // Return mock token IDs
      if (contractAddress === SENTINEL_NFT_ADDRESS) return ["101"];
      if (contractAddress === SURVIVOR_NFT_ADDRESS) return ["201", "202"];
      if (contractAddress === BOUNTY_HUNTER_NFT_ADDRESS) return ["301", "302", "303"];
      return [];
    }
    
    // Get contract instance
    const contract = getNFTContract(contractAddress);
    
    // Get balance
    const balance = await contract.read.balanceOf([address as `0x${string}`]);
    const tokenIds: string[] = [];
    
    // Get all token IDs
    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await contract.read.tokenOfOwnerByIndex([
        address as `0x${string}`,
        BigInt(i)
      ]);
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
    
    // Fetch token IDs for each contract
    const sentinelTokenIds = await getTokenIdsForOwner(address, SENTINEL_NFT_ADDRESS);
    const survivorTokenIds = await getTokenIdsForOwner(address, SURVIVOR_NFT_ADDRESS);
    const bountyHunterTokenIds = await getTokenIdsForOwner(address, BOUNTY_HUNTER_NFT_ADDRESS);
    
    const nfts: ResistanceNFT[] = [];
    
    // Process Sentinel NFTs
    for (const tokenId of sentinelTokenIds) {
      const metadata = await getNFTMetadata(SENTINEL_NFT_ADDRESS, tokenId);
      nfts.push({
        tokenId,
        class: 'Sentinel',
        name: metadata?.name || `Sentinel #${tokenId}`,
        description: metadata?.description,
        image: metadata?.image,
        animation_url: metadata?.animation_url,
        attributes: metadata?.attributes || [{ trait_type: "Class", value: "Sentinel" }]
      });
    }
    
    // Process Survivor NFTs
    for (const tokenId of survivorTokenIds) {
      const metadata = await getNFTMetadata(SURVIVOR_NFT_ADDRESS, tokenId);
      nfts.push({
        tokenId,
        class: 'Survivor',
        name: metadata?.name || `Survivor #${tokenId}`,
        description: metadata?.description,
        image: metadata?.image,
        animation_url: metadata?.animation_url,
        attributes: metadata?.attributes || [{ trait_type: "Class", value: "Survivor" }]
      });
    }
    
    // Process Bounty Hunter NFTs
    for (const tokenId of bountyHunterTokenIds) {
      const metadata = await getNFTMetadata(BOUNTY_HUNTER_NFT_ADDRESS, tokenId);
      nfts.push({
        tokenId,
        class: 'Bounty Hunter',
        name: metadata?.name || `Bounty Hunter #${tokenId}`,
        description: metadata?.description,
        image: metadata?.image,
        animation_url: metadata?.animation_url,
        attributes: metadata?.attributes || [{ trait_type: "Class", value: "Bounty Hunter" }]
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
