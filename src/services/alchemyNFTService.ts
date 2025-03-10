
import { useToast } from "@/hooks/use-toast";

// NFT Contract address for Resistance DAO NFTs
const RESISTANCE_NFT_CONTRACT = "0xdD44d15f54B799e940742195e97A30165A1CD285";
const ALCHEMY_API_KEY = "iTtNiAAH4RhVb4DGHCF4RgQ6xWCPLDN7"; // Replace with env variable in production
const ALCHEMY_BASE_URL = `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

export type NFTClass = "Sentinel" | "Bounty Hunter" | "Survivor";

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface NFTOwnership {
  tokenId: string;
  contractAddress: string;
  metadata: NFTMetadata;
}

/**
 * Get all NFTs owned by a specific address
 */
export const getOwnedNFTs = async (ownerAddress: string): Promise<NFTOwnership[]> => {
  try {
    const response = await fetch(
      `${ALCHEMY_BASE_URL}/getNFTs?owner=${ownerAddress}&contractAddresses[]=${RESISTANCE_NFT_CONTRACT}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch NFTs: ${response.status}`);
    }
    
    const data = await response.json();
    return data.ownedNfts;
  } catch (error) {
    console.error("Error fetching owned NFTs:", error);
    return [];
  }
};

/**
 * Get metadata for a specific NFT
 */
export const getNFTMetadata = async (tokenId: string): Promise<NFTMetadata | null> => {
  try {
    const response = await fetch(
      `${ALCHEMY_BASE_URL}/getNFTMetadata?contractAddress=${RESISTANCE_NFT_CONTRACT}&tokenId=${tokenId}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch NFT metadata: ${response.status}`);
    }
    
    const data = await response.json();
    return data.metadata;
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    return null;
  }
};

/**
 * Get NFT transfers for a specific address (both sent and received)
 */
export const getNFTTransfers = async (
  address: string,
  fromBlock: string = "0x0",
  toBlock: string = "latest"
): Promise<any[]> => {
  try {
    const response = await fetch(
      `${ALCHEMY_BASE_URL}/getNFTTransfers?fromAddress=${address}&toAddress=${address}&contractAddresses[]=${RESISTANCE_NFT_CONTRACT}&fromBlock=${fromBlock}&toBlock=${toBlock}&order=desc&maxCount=100`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch NFT transfers: ${response.status}`);
    }
    
    const data = await response.json();
    return data.transfers || [];
  } catch (error) {
    console.error("Error fetching NFT transfers:", error);
    return [];
  }
};

/**
 * Determine NFT type from metadata
 */
export const getNFTClass = (metadata: NFTMetadata | null): NFTClass | null => {
  if (!metadata || !metadata.attributes) return null;
  
  const classAttribute = metadata.attributes.find(
    attr => attr.trait_type === "Class"
  );
  
  return classAttribute?.value as NFTClass || null;
};

/**
 * Check if an address owns a Bounty Hunter NFT
 */
export const checkBountyHunterOwnership = async (address: string): Promise<boolean> => {
  try {
    const ownedNFTs = await getOwnedNFTs(address);
    
    // Check if any of the owned NFTs is a Bounty Hunter
    for (const nft of ownedNFTs) {
      if (!nft.metadata || !nft.metadata.attributes) continue;
      
      const classAttribute = nft.metadata.attributes.find(
        attr => attr.trait_type === "Class" && attr.value === "Bounty Hunter"
      );
      
      if (classAttribute) return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking Bounty Hunter ownership:", error);
    return false;
  }
};

/**
 * Poll for new NFT purchases by tracked addresses (for referral system)
 */
const POLLING_INTERVAL = 12000; // 12 seconds (average block time on Polygon)
const trackedAddresses = new Map<string, string>(); // referred_address -> referrer_address

export const startNFTPurchasePolling = (
  onPurchaseDetected: (referredAddress: string, referrerAddress: string, tokenId: string, nftClass: NFTClass) => void
) => {
  let lastCheckedBlock = "latest"; // Start from latest block
  let isPolling = false;
  
  const pollForPurchases = async () => {
    if (isPolling || trackedAddresses.size === 0) return;
    isPolling = true;
    
    try {
      // Get current block
      const blockResponse = await fetch(`${ALCHEMY_BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_blockNumber',
          params: []
        })
      });
      
      const blockData = await blockResponse.json();
      const currentBlock = blockData.result;
      
      // Skip if we're already at the latest block
      if (lastCheckedBlock === currentBlock) {
        isPolling = false;
        return;
      }
      
      // For each tracked address, check for new NFT transfers
      for (const [referredAddress, referrerAddress] of trackedAddresses.entries()) {
        const transfers = await getNFTTransfers(
          referredAddress,
          lastCheckedBlock === "latest" ? "0x0" : lastCheckedBlock,
          currentBlock
        );
        
        // Process incoming transfers (purchases)
        for (const transfer of transfers) {
          if (transfer.to.toLowerCase() === referredAddress.toLowerCase()) {
            // Get NFT metadata to determine class
            const metadata = await getNFTMetadata(transfer.tokenId);
            const nftClass = getNFTClass(metadata);
            
            if (nftClass && (nftClass === "Sentinel" || nftClass === "Survivor")) {
              onPurchaseDetected(referredAddress, referrerAddress, transfer.tokenId, nftClass);
            }
          }
        }
      }
      
      lastCheckedBlock = currentBlock;
    } catch (error) {
      console.error("Error during NFT purchase polling:", error);
    } finally {
      isPolling = false;
    }
  };
  
  // Start polling
  const intervalId = setInterval(pollForPurchases, POLLING_INTERVAL);
  
  // Return function to stop polling
  return {
    stop: () => clearInterval(intervalId),
    addTrackedAddress: (referredAddress: string, referrerAddress: string) => {
      trackedAddresses.set(referredAddress.toLowerCase(), referrerAddress.toLowerCase());
    },
    removeTrackedAddress: (referredAddress: string) => {
      trackedAddresses.delete(referredAddress.toLowerCase());
    }
  };
};
