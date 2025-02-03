import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyArsLfJI0fawJid7fD403HFjQEtqPe8iec");

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
    console.log('Initializing Gemini model...');
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        maxOutputTokens: 8192,
      }
    });

    console.log('Processing LinkedIn data with saved prompt...');
    console.log('LinkedIn Data:', linkedInData);
    
    const result = await model.generateContent([
      { text: JSON.stringify(linkedInData) }
    ]);
    
    const response = await result.response;
    const text = response.text();
    console.log('Raw Vertex AI Response:', text);
    
    try {
      console.log('Parsing response...');
      const metadata = JSON.parse(text);
      console.log('Parsed NFT Metadata:', metadata);
      return metadata;
    } catch (parseError) {
      console.error('Error parsing Vertex AI response:', parseError);
      throw new Error('Failed to parse Vertex AI response');
    }
  } catch (error) {
    console.error('Error generating NFT metadata:', error);
    throw error;
  }
};