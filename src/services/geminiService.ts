interface NFTMetadata {
  fullName: string;
  publicIdentifier: string;
  profilePic?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number | null | {
      [key: string]: number;
    };
  }>;
}

export const generateNFTMetadata = async (linkedInData: any): Promise<NFTMetadata> => {
  try {
    console.log('LinkedIn Data:', linkedInData);
    
    const response = await fetch('/api/generate-nft-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        linkedInData
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate NFT metadata');
    }

    const data = await response.json();
    console.log('Raw Vertex AI Response:', data);
    
    return data;
  } catch (error) {
    console.error('Error generating NFT metadata:', error);
    throw error;
  }
};