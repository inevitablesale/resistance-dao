import { GoogleGenerativeAI } from "@google/generative-ai";

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
    
    const response = await fetch('https://us-central1-gen-lang-client-0981544718.cloudfunctions.net/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        linkedInData
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Vertex AI endpoint');
    }

    const data = await response.json();
    console.log('Raw Vertex AI Response:', data);
    
    return data;
  } catch (error) {
    console.error('Error generating NFT metadata:', error);
    throw error;
  }
};