import { ethers } from "ethers";
import { uploadMetadataToPinata } from "./pinataService";
import { getGovernanceImageCID } from "@/utils/governancePowerMapping";

const CONTRACT_ADDRESS = "0x3dC25640b1B7528Dca23BeFcDAD835C5Bf4e5360";
const CONTRACT_ABI = [
  "function safeMint(address to, string memory governancePower) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function approve(address to, uint256 tokenId)",
  "function renounceOwnership()",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function setApprovalForAll(address operator, bool approved)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function transferOwnership(address newOwner)",
  "function updateGovernancePowerCID(uint256 tokenId, string memory newCID)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

export const checkNFTOwnership = async (walletClient: any, address: string) => {
  try {
    console.log('Checking NFT ownership for address:', address);
    
    const provider = new ethers.providers.Web3Provider(walletClient, {
      name: 'unknown',
      chainId: 137 // Polygon Mainnet
    });
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const balance = await contract.balanceOf(address);
    console.log('NFT balance:', balance.toString());
    
    return balance.gt(0);
  } catch (error) {
    console.error('Error checking NFT ownership:', error);
    return false;
  }
};

export const mintNFT = async (walletClient: any, address: string, metadata: any) => {
  try {
    console.log('Starting NFT minting process with metadata:', metadata);
    
    const governancePowerAttr = metadata.attributes.find(
      (attr: { trait_type: string; value: string }) => 
      attr.trait_type === "Governance Power"
    );
    
    if (!governancePowerAttr) {
      throw new Error('Governance Power not found in metadata attributes');
    }

    const provider = new ethers.providers.Web3Provider(walletClient, {
      name: 'unknown',
      chainId: 137 // Polygon Mainnet
    });
    
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    console.log('Minting NFT for address:', address);
    console.log('Using governance power:', governancePowerAttr.value);

    const tx = await contract.safeMint(address, governancePowerAttr.value);
    console.log('Minting transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Minting confirmed:', receipt);
    
    const mintEvent = receipt.events?.find(e => e.event === 'Transfer');
    const tokenId = mintEvent?.args?.tokenId;

    // Use profile picture if available, otherwise fallback to governance power image
    const imageUrl = metadata.profilePicCID 
      ? `https://ipfs.io/ipfs/${metadata.profilePicCID}`
      : `https://ipfs.io/ipfs/${getGovernanceImageCID(governancePowerAttr.value)}`;

    // Create the NFT metadata with the correct image URL
    const nftMetadata: NFTMetadata = {
      name: `${metadata.fullName}'s Professional NFT`,
      description: `This NFT represents the governance power level of ${metadata.fullName} based on their professional experience and qualifications.`,
      image: imageUrl,
      attributes: metadata.attributes
    };
    
    console.log('Preparing to upload metadata with image:', nftMetadata.image);
    const tokenURI = await uploadMetadataToPinata(nftMetadata);
    console.log('Metadata uploaded to IPFS:', tokenURI);
    
    return { success: true, tokenId, tokenURI };
  } catch (error) {
    console.error('Minting failed:', error);
    throw error;
  }
};

interface MintedNFT {
  tokenId: string;
  owner: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: {
      trait_type: string;
      value: string;
    }[];
  };
}

export const getAllMintedNFTs = async (walletClient: any): Promise<MintedNFT[]> => {
  try {
    console.log('Fetching all minted NFTs...');
    
    const provider = new ethers.providers.Web3Provider(walletClient, {
      name: 'unknown',
      chainId: 137 // Polygon Mainnet
    });
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    // Get all Transfer events from address 0x0 (minting)
    const filter = contract.filters.Transfer(
      '0x0000000000000000000000000000000000000000',
      null,
      null
    );
    
    console.log('Fetching Transfer events...');
    const events = await contract.queryFilter(filter);
    console.log(`Found ${events.length} minted NFTs`);
    
    const nfts: MintedNFT[] = await Promise.all(
      events.map(async (event) => {
        const tokenId = event.args?.tokenId.toString();
        const owner = await contract.ownerOf(tokenId);
        const tokenUri = await contract.tokenURI(tokenId);
        
        // Remove ipfs:// prefix if present and add gateway URL
        const metadataUrl = tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
        
        console.log(`Fetching metadata for token ${tokenId} from ${metadataUrl}`);
        try {
          const response = await fetch(metadataUrl);
          const contentType = response.headers.get('content-type');
          
          let metadata;
          if (contentType?.includes('image/')) {
            // If the tokenURI points to an image, create synthetic metadata
            metadata = {
              name: `LedgerFren NFT #${tokenId}`,
              description: "A Professional NFT in the LedgerFren Collection",
              image: metadataUrl,
              attributes: [{
                trait_type: "Governance Power",
                value: "Unknown" // We can't determine the power from just the image
              }]
            };
          } else {
            // Regular JSON metadata
            metadata = await response.json();
          }
          
          return {
            tokenId,
            owner,
            metadata
          };
        } catch (error) {
          console.error(`Error fetching metadata for token ${tokenId}:`, error);
          // Return a placeholder metadata if fetching fails
          return {
            tokenId,
            owner,
            metadata: {
              name: `LedgerFren NFT #${tokenId}`,
              description: "Metadata temporarily unavailable",
              image: "https://ipfs.io/ipfs/placeholder", // You might want to use a real placeholder image
              attributes: [{
                trait_type: "Governance Power",
                value: "Unknown"
              }]
            }
          };
        }
      })
    );
    
    console.log('Successfully fetched all NFT data');
    return nfts;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw error;
  }
};
