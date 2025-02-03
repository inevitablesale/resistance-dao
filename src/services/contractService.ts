import { ethers } from "ethers";
import { uploadMetadataToPinata } from "./pinataService";

const CONTRACT_ADDRESS = "0x3dC25640b1B7528Dca23BeFcDAD835C5Bf4e5360";
const CONTRACT_ABI = [
  "function mint(address to, string memory tokenURI) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)"
];

export const mintNFT = async (walletClient: any, address: string, metadata: any) => {
  try {
    console.log('Starting NFT minting process with metadata:', metadata);
    
    // First upload metadata to IPFS via Pinata
    const tokenURI = await uploadMetadataToPinata(metadata);
    console.log('Metadata uploaded to IPFS:', tokenURI);
    
    // Create provider without ENS support
    const provider = new ethers.providers.Web3Provider(walletClient, {
      name: 'unknown',
      chainId: 137 // Polygon Mainnet
    });
    
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    console.log('Minting NFT for address:', address);
    const tx = await contract.mint(address, tokenURI);
    console.log('Minting transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Minting confirmed:', receipt);
    
    // Get the token ID from the event logs
    const mintEvent = receipt.events?.find(e => e.event === 'Transfer');
    const tokenId = mintEvent?.args?.tokenId;
    
    return { success: true, tokenId, tokenURI };
  } catch (error) {
    console.error('Minting failed:', error);
    throw error;
  }
};