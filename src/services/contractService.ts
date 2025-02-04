
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
