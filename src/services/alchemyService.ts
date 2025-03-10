
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";

// NFT Contract address for Resistance DAO
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

// Create Alchemy client
const client = createPublicClient({
  chain: polygon,
  transport: http("https://polygon-mainnet.g.alchemy.com/v2/iTtNiAAH4RhVb4DGHCF4RgQ6xWCPLDN7"),
});

/**
 * Fetches all NFTs owned by an address
 * @param address Owner address
 * @returns Array of ResistanceNFT objects
 */
export const fetchNFTsForAddress = async (address: string): Promise<ResistanceNFT[]> => {
  try {
    console.log(`Fetching NFTs for address: ${address}`);
    
    // Mock implementation for development
    // In production, this would call Alchemy API
    const mockNFTs: ResistanceNFT[] = [
      {
        tokenId: "1",
        class: "Sentinel",
        name: "Sentinel - The DAO Enforcer",
        image: "https://gateway.pinata.cloud/ipfs/sentinel-image",
        attributes: [
          { trait_type: "Class", value: "Sentinel" },
          { trait_type: "Rank", value: "Enforcer" }
        ]
      },
      {
        tokenId: "2",
        class: "Survivor",
        name: "Survivor - Wasteland Engineer",
        image: "https://gateway.pinata.cloud/ipfs/survivor-image",
        attributes: [
          { trait_type: "Class", value: "Survivor" },
          { trait_type: "Skill", value: "Engineering" }
        ]
      }
    ];
    
    return mockNFTs;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
};

/**
 * Checks if an address owns any Resistance NFTs
 * @param address Owner address
 * @returns boolean indicating ownership
 */
export const checkNFTOwnership = async (address: string): Promise<boolean> => {
  try {
    const nfts = await fetchNFTsForAddress(address);
    return nfts.length > 0;
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return false;
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
 * Gets the NFT balance for a specific contract
 * @param address Owner address
 * @param contractAddress NFT contract address
 * @returns Number of NFTs owned
 */
export const getNFTBalanceByContract = async (
  address: string, 
  contractAddress: string
): Promise<number> => {
  try {
    // Mock implementation for development
    // In production, this would query the blockchain
    if (contractAddress === RESISTANCE_NFT_ADDRESS) {
      const nfts = await fetchNFTsForAddress(address);
      return nfts.length;
    }
    return 0;
  } catch (error) {
    console.error("Error getting NFT balance:", error);
    return 0;
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
