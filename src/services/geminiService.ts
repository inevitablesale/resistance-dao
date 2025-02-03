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
  experiences: Array<{
    title: string;
    company: string;
    duration: string;
    location: string;
  }>;
}

const calculateGovernanceVotingPower = (experiences: any[], serviceExpertise: { [key: string]: number }) => {
  // Calculate years of experience
  const totalYears = experiences.reduce((acc, exp) => {
    const duration = exp.duration;
    const years = duration.includes('yr') ? 
      parseInt(duration.split(' ')[0]) :
      duration.includes('mos') ? 
        parseInt(duration.split(' ')[0]) / 12 : 0;
    return acc + years;
  }, 0);

  // Calculate average expertise score
  const expertiseScores = Object.values(serviceExpertise);
  const averageExpertise = expertiseScores.reduce((a, b) => a + b, 0) / expertiseScores.length;

  // Normalize years (max 20 years = 1.0)
  const normalizedYears = Math.min(totalYears / 20, 1);
  
  // Normalize expertise (already on 0-10 scale, convert to 0-1)
  const normalizedExpertise = averageExpertise / 10;

  // Calculate voting power (50% experience weight, 50% expertise weight)
  const votingPower = (normalizedYears * 0.5) + (normalizedExpertise * 0.5);

  // Round to 3 decimal places
  return Math.round(votingPower * 1000) / 1000;
};

export const generateNFTMetadata = async (linkedInData: any): Promise<NFTMetadata> => {
  try {
    console.log('Raw LinkedIn data:', linkedInData);
    
    // Extract just the data object if it exists
    const profileData = linkedInData.data || linkedInData;
    
    console.log('Processing profile data:', profileData);

    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const prompt = `
You are an AI assistant that analyzes LinkedIn profiles and generates NFT metadata. Your task is to extract relevant information and return it in a specific JSON format.

Given a LinkedIn profile, generate NFT metadata with the following structure:
{
  "fullName": "string",
  "publicIdentifier": "string",
  "profilePic": "string (optional)",
  "attributes": [
    {
      "trait_type": "string",
      "value": "string or number"
    }
  ],
  "experiences": [
    {
      "title": "string",
      "company": "string",
      "duration": "string",
      "location": "string"
    }
  ]
}

Required attributes must include:
- Governance Power (Industry Icon, Veteran Firm Owner, Established Leader, etc.)
- Experience Level (Founder & Advisor, Managing Partner, Firm Owner, etc.)
- Specialty (Tax Advisory, Accounting & Compliance, M&A & Exit Planning, etc.)
- Years in Practice (1-5 Years, 6-10 Years, 11-15 Years, etc.)
- Client Base (Small Businesses, Accounting Firms, etc.)
- Service Line Expertise (Accounting Technology, Media & Thought Leadership, etc.)

Analyze this LinkedIn profile and generate the NFT metadata according to the specified format:
${JSON.stringify(profileData, null, 2)}`;

    console.log('Generating content with Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text);
    
    try {
      const parsedResponse = JSON.parse(text);
      console.log('Parsed response:', parsedResponse);
      
      // Extract just the data object from the response if needed
      const nftMetadata = parsedResponse.data || parsedResponse;
      
      // Validate the required fields
      if (!nftMetadata.fullName || !nftMetadata.publicIdentifier || !Array.isArray(nftMetadata.attributes)) {
        throw new Error('Missing required fields in NFT metadata');
      }

      // Ensure all required attributes exist with non-null values
      const requiredAttributes = [
        "Governance Power",
        "Experience Level",
        "Specialty",
        "Years in Practice",
        "Client Base",
        "Service Line Expertise"
      ];

      const missingAttributes = requiredAttributes.filter(attr => 
        !nftMetadata.attributes.some(a => 
          a.trait_type === attr && a.value !== null
        )
      );

      if (missingAttributes.length > 0) {
        throw new Error(`Missing or null values for attributes: ${missingAttributes.join(', ')}`);
      }

      return nftMetadata;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse Gemini response');
    }
  } catch (error) {
    console.error('Error generating NFT metadata:', error);
    throw error;
  }
};
