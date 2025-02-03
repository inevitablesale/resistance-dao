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
    console.log('Initializing Gemini model...');
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.1, // Lower temperature for more consistent results
        topP: 0.8,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ],
    });

    console.log('Processing LinkedIn data with saved prompt...');
    // Use the saved prompt ID "linkedinToNFT" for processing
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: JSON.stringify(linkedInData) }] }],
      generationConfig: {
        promptId: "linkedinToNFT" // This should match your saved prompt ID in Vertex AI
      }
    });
    
    const response = await result.response;
    const text = response.text();
    
    try {
      console.log('Parsing Gemini response...');
      const metadata = JSON.parse(text);
      
      // Calculate and add Governance Voting Power
      const votingPower = calculateGovernanceVotingPower(
        metadata.experiences,
        metadata.attributes.find((a: any) => a.trait_type === "Service Line Expertise")?.value || {}
      );

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