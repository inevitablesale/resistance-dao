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
    console.log('Initializing Gemini model with saved prompt...');
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        maxOutputTokens: 8192,
      }
    });

    console.log('LinkedIn Data:', linkedInData);
    
    const prompt = `You are a professional NFT metadata generator. Given a LinkedIn profile data, generate NFT metadata in the following JSON format:
    {
      "fullName": "string",
      "publicIdentifier": "string",
      "profilePic": "string (optional)",
      "attributes": [
        {
          "trait_type": "Governance Power",
          "value": "string"
        },
        {
          "trait_type": "Experience Level",
          "value": "string"
        },
        {
          "trait_type": "Specialty",
          "value": "string"
        },
        {
          "trait_type": "Years in Practice",
          "value": "string"
        },
        {
          "trait_type": "Client Base",
          "value": "string"
        },
        {
          "trait_type": "Service Line Expertise",
          "value": "string"
        }
      ]
    }

    IMPORTANT: Return ONLY valid JSON, no markdown or other text.
    Here is the LinkedIn profile data to analyze: ${JSON.stringify(linkedInData)}`;

    const result = await model.generateContent([
      { text: prompt }
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