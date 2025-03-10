
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

// NFT contract address to query
const NFT_CONTRACT_ADDRESS = "0xdD44d15f54B799e940742195e97A30165A1CD285";
const ALCHEMY_API_KEY = "TA21E4w82XOfOVYm096iCgAh7jQS-iCQ";

// Enhanced ERC721 ABI with more functions
const NFT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function tokenByIndex(uint256 index) view returns (uint256)"
];

export interface NFTMetadata {
  tokenId: string;
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  contractName?: string;
  contractSymbol?: string;
  owner?: string;
}

interface ContractStats {
  totalMinted: number;
  contractName: string;
  contractSymbol: string;
}

interface AlchemyNFT {
  contract: {
    address: string;
    name?: string;
    symbol?: string;
    totalSupply?: number;
  };
  tokenId: string;
  tokenType: string;
  title: string;
  description: string;
  tokenUri?: {
    raw: string;
    gateway: string;
  };
  media?: Array<{
    raw: string;
    gateway: string;
    thumbnail?: string;
    format?: string;
  }>;
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
    [key: string]: any;
  };
  timeLastUpdated: string;
}

interface AlchemyResponse {
  ownedNfts: AlchemyNFT[];
  totalCount: number;
  blockHash: string;
}

// Function to fetch NFTs using Alchemy API
const fetchNFTsWithAlchemy = async (contractAddress: string, pageSize: number = 100): Promise<NFTMetadata[]> => {
  try {
    const url = `https://polygon-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getNFTsForContract?contractAddress=${contractAddress}&withMetadata=true&pageSize=${pageSize}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Alchemy API error: ${response.status}`);
    }
    
    const data: AlchemyResponse = await response.json();
    console.log('Alchemy API response:', data);
    
    // Map Alchemy response to our NFTMetadata format
    return data.ownedNfts.map(nft => ({
      tokenId: nft.tokenId,
      name: nft.metadata?.name || nft.title || `Token #${nft.tokenId}`,
      description: nft.metadata?.description || nft.description,
      image: nft.media?.[0]?.gateway || nft.metadata?.image,
      attributes: nft.metadata?.attributes,
      contractName: nft.contract.name,
      contractSymbol: nft.contract.symbol
    }));
  } catch (error) {
    console.error("Error fetching NFTs with Alchemy:", error);
    throw error;
  }
};

// Hook to get all minted NFTs in the contract using Alchemy
export const useAllContractNFTs = (first: number = 100) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['allContractNFTsAlchemy', NFT_CONTRACT_ADDRESS, first],
    queryFn: async (): Promise<NFTMetadata[]> => {
      try {
        // Try fetching with Alchemy first
        return await fetchNFTsWithAlchemy(NFT_CONTRACT_ADDRESS, first);
      } catch (alchemyError) {
        console.error("Alchemy fetch failed, falling back to direct contract call:", alchemyError);
        toast({
          title: "Alchemy API error",
          description: "Falling back to direct contract interaction",
          variant: "destructive"
        });
        
        // Fall back to original direct contract interaction
        const nfts: NFTMetadata[] = [];
        
        try {
          // Initialize provider and contract
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
          
          // Get contract metadata
          const contractName = await contract.name();
          const contractSymbol = await contract.symbol();
          
          // Get total supply
          const totalSupply = await contract.totalSupply();
          console.log(`Total supply: ${totalSupply.toString()} NFTs minted in contract`);
          
          // Limit to first N tokens or total supply, whichever is less
          const limit = Math.min(Number(totalSupply), first);
          
          // Get tokenIDs and metadata for all tokens
          for (let i = 0; i < limit; i++) {
            try {
              const tokenId = await contract.tokenByIndex(i);
              console.log(`Getting metadata for token ID: ${tokenId.toString()}`);
              
              let metadata: NFTMetadata = {
                tokenId: tokenId.toString(),
                contractName,
                contractSymbol
              };
              
              try {
                const tokenURI = await contract.tokenURI(tokenId);
                console.log(`Token URI for ${tokenId}: ${tokenURI}`);
                
                // If tokenURI is an IPFS URI, convert to HTTP
                const formattedURI = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
                
                // Fetch metadata
                const response = await fetch(formattedURI);
                const data = await response.json();
                
                metadata = {
                  ...metadata,
                  ...data,
                  tokenId: tokenId.toString()
                };
              } catch (err) {
                console.error(`Failed to fetch metadata for token ${tokenId}:`, err);
              }
              
              nfts.push(metadata);
            } catch (err) {
              console.error(`Error fetching token at index ${i}:`, err);
            }
          }
        } catch (err) {
          console.error("Error fetching all NFTs:", err);
          toast({
            title: "Error loading NFTs",
            description: "Could not load NFTs from the contract",
            variant: "destructive"
          });
        }
        
        return nfts;
      }
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

// Hook to get contract stats
export const useContractStats = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['contractStats', NFT_CONTRACT_ADDRESS],
    queryFn: async (): Promise<ContractStats> => {
      try {
        // Try fetching with Alchemy API
        const url = `https://polygon-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getContractMetadata?contractAddress=${NFT_CONTRACT_ADDRESS}`;
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          return {
            totalMinted: data.totalSupply || 0,
            contractName: data.name || "Unknown",
            contractSymbol: data.symbol || "???"
          };
        }
      } catch (error) {
        console.error("Error fetching contract stats from Alchemy:", error);
      }
      
      // Fallback to direct contract interaction
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
        
        // Get contract metadata
        const contractName = await contract.name();
        const contractSymbol = await contract.symbol();
        
        // Get total supply
        const totalSupply = await contract.totalSupply();
        console.log(`Total supply: ${totalSupply.toString()} NFTs minted in contract`);
        
        return {
          totalMinted: Number(totalSupply),
          contractName,
          contractSymbol
        };
      } catch (err) {
        console.error("Error fetching contract stats:", err);
        toast({
          title: "Error loading contract stats",
          description: "Could not load stats from the contract",
          variant: "destructive"
        });
        
        return {
          totalMinted: 0,
          contractName: "Unknown",
          contractSymbol: "???"
        };
      }
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

// Original hook to get NFTs owned by a specific address
export const useContractNFTs = (address?: string) => {
  return useQuery({
    queryKey: ['contractNFTs', address, NFT_CONTRACT_ADDRESS],
    queryFn: async (): Promise<NFTMetadata[]> => {
      if (!address) return [];
      
      try {
        // Try Alchemy API first
        const url = `https://polygon-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getNFTsForOwner?owner=${address}&contractAddresses[]=${NFT_CONTRACT_ADDRESS}&withMetadata=true&pageSize=100`;
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data: AlchemyResponse = await response.json();
          return data.ownedNfts.map(nft => ({
            tokenId: nft.tokenId,
            name: nft.metadata?.name || nft.title || `Token #${nft.tokenId}`,
            description: nft.metadata?.description || nft.description,
            image: nft.media?.[0]?.gateway || nft.metadata?.image,
            attributes: nft.metadata?.attributes,
            contractName: nft.contract.name,
            contractSymbol: nft.contract.symbol,
            owner: address
          }));
        }
      } catch (error) {
        console.error("Error fetching NFTs with Alchemy:", error);
      }
      
      // Fallback to original method
      const nfts: NFTMetadata[] = [];
      
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
        
        // Get contract metadata
        const contractName = await contract.name();
        const contractSymbol = await contract.symbol();
        
        console.log(`Contract name: ${contractName}, symbol: ${contractSymbol}`);
        
        // Get balance
        const balance = await contract.balanceOf(address);
        console.log(`Balance: ${balance.toString()} NFTs found for address ${address}`);
        
        // Get token IDs and metadata
        for (let i = 0; i < Number(balance); i++) {
          try {
            const tokenId = await contract.tokenOfOwnerByIndex(address, i);
            console.log(`Found token ID: ${tokenId.toString()}`);
            
            let metadata: NFTMetadata = {
              tokenId: tokenId.toString(),
              contractName,
              contractSymbol,
              owner: address
            };
            
            try {
              const tokenURI = await contract.tokenURI(tokenId);
              console.log(`Token URI for ${tokenId}: ${tokenURI}`);
              
              // If tokenURI is an IPFS URI, convert to HTTP
              const formattedURI = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
              
              // Fetch metadata
              const response = await fetch(formattedURI);
              const data = await response.json();
              
              metadata = {
                ...metadata,
                ...data,
                tokenId: tokenId.toString(),
                owner: address
              };
            } catch (err) {
              console.error(`Failed to fetch metadata for token ${tokenId}:`, err);
            }
            
            nfts.push(metadata);
          } catch (err) {
            console.error(`Error fetching token at index ${i}:`, err);
          }
        }
      } catch (err) {
        console.error("Error fetching NFTs:", err);
      }
      
      return nfts;
    },
    enabled: !!address,
  });
};
