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
  experiences: Array<{
    title: string;
    company: string;
    duration: string;
    location: string;
  }>;
}

const systemInstruction = `You are an AI Agent specializing in transforming LinkedIn profile data into structured NFT metadata objects. Analyze the provided LinkedIn profile and return a valid JSON object with the following structure:
{
  "fullName": "string",
  "publicIdentifier": "string",
  "profilePic": "string",
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
}`;

export const generateNFTMetadata = async (linkedInData: any): Promise<NFTMetadata> => {
  try {
    console.log('Initializing Gemini model...');
    
    const genAI = new GoogleGenerativeAI("AIzaSyArsLfJI0fawJid7fD403HFjQEtqPe8iec");
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    const prompt = `${systemInstruction}\n\nAnalyze this LinkedIn profile and generate the NFT metadata according to the specified format:\n${JSON.stringify(linkedInData, null, 2)}`;

    console.log('Generating content with Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      console.log('Raw Gemini response:', text);
      
      // Extract JSON from the response if it's wrapped in other text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const jsonStr = jsonMatch[0];
      console.log('Extracted JSON:', jsonStr);
      
      const metadata = JSON.parse(jsonStr);
      
      // Validate required fields
      if (!metadata.fullName || !metadata.publicIdentifier || !metadata.attributes) {
        throw new Error('Missing required fields in metadata');
      }
      
      // Ensure attributes array has all required traits
      const requiredTraits = [
        "Governance Power",
        "Experience Level",
        "Specialty",
        "Years in Practice",
        "Client Base",
        "Service Line Expertise"
      ];
      
      const hasAllTraits = requiredTraits.every(trait => 
        metadata.attributes.some(attr => attr.trait_type === trait)
      );
      
      if (!hasAllTraits) {
        throw new Error('Missing required traits in attributes');
      }

      console.log('Generated NFT Metadata:', metadata);
      return metadata;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse Gemini response');
    }
  } catch (error) {
    console.error('Error generating NFT metadata:', error);
    throw error;
  }
};

const calculateGovernanceVotingPower = (experiences: any[], serviceExpertise: any) => {
  // Calculate years of experience
  const totalYears = experiences.reduce((acc, exp) => {
    const duration = exp.duration;
    const years = duration.includes('yr') ? 
      parseInt(duration.split(' ')[0]) :
      duration.includes('mos') ? 
        parseInt(duration.split(' ')[0]) / 12 : 0;
    return acc + years;
  }, 0);

  // Calculate expertise score (simplified since serviceExpertise structure changed)
  const expertiseScore = typeof serviceExpertise === 'string' ? 8 : 5; // Default score if not numeric

  // Normalize years (max 20 years = 1.0)
  const normalizedYears = Math.min(totalYears / 20, 1);
  
  // Calculate voting power (70% experience weight, 30% expertise weight)
  const votingPower = (normalizedYears * 0.7) + (expertiseScore / 10 * 0.3);

  // Round to 3 decimal places
  return Math.round(votingPower * 1000) / 1000;
};
