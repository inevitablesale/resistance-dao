import { ethers } from "ethers";
import { uploadMetadataToPinata } from "./pinataService";
import { getGovernanceImageCID } from "@/utils/governancePowerMapping";

const CONTRACT_ADDRESS = "0x3dC25640b1B7528Dca23BeFcDAD835C5Bf4e5360";
const CONTRACT_ABI = [
  "function safeMint(address to, string memory governancePower) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)"
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

export const mintNFT = async (walletClient: any, address: string, metadata: any) => {
  try {
    console.group('NFT Minting Process');
    console.log('Starting minting process with metadata:', metadata);
    
    // Extract governance power from attributes array
    const governancePowerAttr = metadata.attributes.find(
      (attr: { trait_type: string; value: string }) => 
      attr.trait_type === "Governance Power"
    );
    
    if (!governancePowerAttr) {
      throw new Error('Governance Power not found in metadata attributes');
    }

    // Create provider with AA support
    const provider = new ethers.providers.Web3Provider(walletClient, {
      name: 'Polygon',
      chainId: 137
    });
    
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    console.log('Minting NFT for address:', address);
    console.log('Using governance power:', governancePowerAttr.value);

    // Prepare transaction with gas sponsorship
    const tx = await contract.safeMint(
      address, 
      governancePowerAttr.value,
      {
        maxFeePerGas: ethers.utils.parseUnits("100", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      }
    );
    
    console.log('Transaction sent:', tx.hash);
    console.log('Waiting for confirmation...');
    
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);
    
    // Get the token ID from the event logs
    const mintEvent = receipt.events?.find(e => e.event === 'Transfer');
    const tokenId = mintEvent?.args?.tokenId;

    // Upload metadata to IPFS
    const governanceImageCID = getGovernanceImageCID(governancePowerAttr.value);
    const governanceImageUrl = `ipfs://${governanceImageCID}`;
    
    const nftMetadata: NFTMetadata = {
      name: `Professional Governance Power NFT`,
      description: `This NFT represents the governance power level of ${metadata.fullName} based on their professional experience and qualifications.`,
      image: governanceImageUrl,
      attributes: metadata.attributes
    };
    
    const tokenURI = await uploadMetadataToPinata(nftMetadata);
    console.log('Metadata uploaded to IPFS:', tokenURI);
    
    console.groupEnd();
    return { success: true, tokenId, tokenURI };
  } catch (error) {
    console.error('Minting failed:', error);
    console.groupEnd();
    throw error;
  }
};