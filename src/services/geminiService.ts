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
    
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_VERTEX_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze this LinkedIn profile data and generate NFT metadata that represents the professional's experience and qualifications:
      ${JSON.stringify(linkedInData)}
      
      Return a JSON object with the following structure:
      {
        "fullName": "Full name of the professional",
        "publicIdentifier": "LinkedIn public identifier",
        "attributes": [
          {
            "trait_type": "Experience Level",
            "value": "Number of years of experience"
          },
          {
            "trait_type": "Skills",
            "value": {
              "skill1": confidence_score,
              "skill2": confidence_score
            }
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Vertex AI Response:', text);
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating NFT metadata:', error);
    throw error;
  }
};