import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

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

const calculateGovernanceVotingPower = (attributes: any[]) => {
  // Find years in practice
  const yearsAttribute = attributes.find(a => a.trait_type === "Years in Practice");
  const years = yearsAttribute?.value;
  let yearsValue = 0;
  
  if (typeof years === 'string') {
    if (years === "20+") yearsValue = 20;
    else yearsValue = parseInt(years);
  }

  // Calculate voting power (normalized to 0-1)
  const votingPower = Math.min(yearsValue / 20, 1);
  return Math.round(votingPower * 1000) / 1000;
};

export const generateNFTMetadata = async (linkedInData: any): Promise<NFTMetadata> => {
  try {
    console.log('Initializing Gemini model...');
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: HarmCategory.HARASSMENT,
          threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE
        }
      ],
    });

    console.log('Processing LinkedIn data...');
    const prompt = `Analyze this LinkedIn profile data and generate NFT metadata that represents the professional's accounting expertise and experience. Focus on their specialization, years of experience, and service offerings. Return the response in this exact JSON format:
    {
      "fullName": "Full Name",
      "publicIdentifier": "linkedin-identifier",
      "profilePic": "profile-picture-url",
      "attributes": [
        {"trait_type": "Governance Power", "value": "Level"},
        {"trait_type": "Experience Level", "value": "Senior/Junior/etc"},
        {"trait_type": "Specialty", "value": "Main Focus Area"},
        {"trait_type": "Years in Practice", "value": "Number or Range"},
        {"trait_type": "Client Base", "value": "Type of Clients"},
        {"trait_type": "Service Line Expertise", "value": "Main Service Area"}
      ]
    }`;

    const result = await model.generateContent([
      { role: "user", parts: [{ text: prompt + "\n\nLinkedIn Data:\n" + JSON.stringify(linkedInData) }] }
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    try {
      console.log('Parsing Gemini response...');
      const metadata = JSON.parse(text);
      
      // Calculate and add Governance Voting Power
      const votingPower = calculateGovernanceVotingPower(metadata.attributes);

      // Add Governance Voting Power to attributes if not present
      if (!metadata.attributes.find(a => a.trait_type === "Governance Voting Power")) {
        metadata.attributes.push({
          trait_type: "Governance Voting Power",
          value: votingPower
        });
      }

      // Add Fractional Ownership if not present
      if (!metadata.attributes.find(a => a.trait_type === "Fractional Ownership")) {
        metadata.attributes.push({
          trait_type: "Fractional Ownership",
          value: null
        });
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