import { uploadMetadataToPinata } from "./pinataService";
import { getGovernanceImageCID } from "@/utils/governancePowerMapping";
import { supabase } from "@/integrations/supabase/client";

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
    
    // Extract governance power from attributes array
    const governancePowerAttr = metadata.attributes.find(
      (attr: { trait_type: string; value: string }) => 
      attr.trait_type === "Governance Power"
    );
    
    if (!governancePowerAttr) {
      throw new Error('Governance Power not found in metadata attributes');
    }

    // Call the Edge Function to handle metadata storage and verification
    const { data: mintResult, error } = await supabase.functions.invoke('mint-nft', {
      body: {
        address,
        governancePower: governancePowerAttr.value,
        metadata
      }
    });

    if (error) {
      throw new Error(`Minting process failed: ${error.message}`);
    }

    console.log('Metadata processing successful:', mintResult);

    // Upload metadata to IPFS for reference
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
    
    return { 
      success: true, 
      tokenId: mintResult.tokenId, 
      tokenURI,
      transactionHash: mintResult.transactionHash 
    };
  } catch (error) {
    console.error('Minting process failed:', error);
    throw error;
  }
};