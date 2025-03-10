
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";

// NFT contract address to query
const NFT_CONTRACT_ADDRESS = "0xdD44d15f54B799e940742195e97A30165A1CD285";

// Basic ERC721 ABI containing just the functions we need
const NFT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)"
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
}

export const useContractNFTs = (address?: string) => {
  return useQuery({
    queryKey: ['contractNFTs', address, NFT_CONTRACT_ADDRESS],
    queryFn: async (): Promise<NFTMetadata[]> => {
      if (!address) return [];
      
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
        console.error("Error fetching NFTs:", err);
      }
      
      return nfts;
    },
    enabled: !!address,
  });
};
