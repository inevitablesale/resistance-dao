import { ethers } from "ethers";
import { uploadMetadataToPinata } from "./pinataService";
import { getGovernanceImageCID } from "@/utils/governancePowerMapping";
import { supabase } from "@/integrations/supabase/client";

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
    console.log('Starting NFT minting process with metadata:', metadata);
    
    // Get ZeroDev credentials from Supabase
    const { data: { ZERODEV_PROJECT_ID, ZERODEV_AA_KEY } } = await supabase
      .from('secrets')
      .select('ZERODEV_PROJECT_ID, ZERODEV_AA_KEY')
      .single();

    if (!ZERODEV_PROJECT_ID || !ZERODEV_AA_KEY) {
      throw new Error('ZeroDev credentials not found');
    }
    
    // Extract governance power from attributes array
    const governancePowerAttr = metadata.attributes.find(
      (attr: { trait_type: string; value: string }) => 
      attr.trait_type === "Governance Power"
    );
    
    if (!governancePowerAttr) {
      throw new Error('Governance Power not found in metadata attributes');
    }

    // Create provider without ENS support
    const provider = new ethers.providers.Web3Provider(walletClient, {
      name: 'unknown',
      chainId: 137 // Polygon Mainnet
    });
    
    const signer = provider.getSigner();
    
    // Initialize ZeroDev SDK with credentials
    const zeroDevSigner = await provider.getSigner().connectToZeroDev({
      projectId: ZERODEV_PROJECT_ID,
      owner: address,
    });

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, zeroDevSigner);
    
    console.log('Minting NFT for address:', address);
    console.log('Using governance power:', governancePowerAttr.value);

    // Call safeMint with the governance power value using ZeroDev signer
    const tx = await contract.safeMint(address, governancePowerAttr.value);
    console.log('Minting transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Minting confirmed:', receipt);
    
    // Get the token ID from the event logs
    const mintEvent = receipt.events?.find(e => e.event === 'Transfer');
    const tokenId = mintEvent?.args?.tokenId;

    // Still upload metadata to IPFS for reference
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
    
    return { success: true, tokenId, tokenURI };
  } catch (error) {
    console.error('Minting failed:', error);
    throw error;
  }
};