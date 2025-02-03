import { Contract, BrowserProvider } from 'ethers';
import { uploadMetadataToPinata } from "./pinataService";
import { getGovernanceImageCID } from "@/utils/governancePowerMapping";
import { supabase } from "@/integrations/supabase/client";

const NFT_CONTRACT_ADDRESS = '0x123...'; // Replace with actual contract address
const NFT_CONTRACT_ABI = [
  'function mint(address to, string memory uri) public returns (uint256)',
  // Add other needed contract functions
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
    console.log('Starting NFT minting with Dynamic AA wallet...');
    console.log('Wallet client:', walletClient);
    
    // Create contract instance using the wallet client from Dynamic
    const provider = new BrowserProvider(walletClient.provider.transport);
    const signer = await provider.getSigner(address);
    const contract = new Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI,
      signer
    );

    console.log('Contract instance created:', contract);
    console.log('Minting NFT for address:', address);
    console.log('With metadata:', metadata);

    // Call the mint function using AA wallet
    const tx = await contract.mint(address, metadata.tokenURI);
    console.log('Minting transaction sent:', tx.hash);

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log('Minting transaction confirmed:', receipt);

    return {
      success: true,
      tokenId: receipt.logs[0].topics[3], // Assuming this is where the token ID is
      tokenURI: metadata.tokenURI,
      transactionHash: receipt.hash
    };
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
};