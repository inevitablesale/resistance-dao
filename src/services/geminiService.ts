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
        temperature: 1,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const prompt = `
      You are an AI Agent designed to process LinkedIn profile data into standardized NFT metadata objects.
      Your goal is to analyze, categorize, and generate structured attributes based on the user's experience, expertise, and role in the professional services industry.

      Required Output Format:
      {
        "fullName": "string",
        "publicIdentifier": "string",
        "profilePic": "string (URL)",
        "attributes": [
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
            "value": {
              "Accounting Technology": number (0-10),
              "Media & Thought Leadership": number (0-10),
              "Advisory Services": number (0-10),
              "Automation & Workflow": number (0-10),
              "Small Business Accounting": number (0-10),
              "Tax Planning & Compliance": number (0-10),
              "M&A / Exit Planning": number (0-10),
              "Wealth Management": number (0-10)
            }
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

      Analyze this LinkedIn profile and generate the NFT metadata according to the specified format:
      ${JSON.stringify(linkedInData)}
    `;

    console.log('Generating content with Gemini...');
    const result = await model.generateContent(prompt);
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

      // Add Governance Voting Power to attributes
      metadata.attributes.push({
        trait_type: "Governance Voting Power",
        value: votingPower
      });

      // Add Fractional Ownership placeholder
      metadata.attributes.push({
        trait_type: "Fractional Ownership",
        value: null
      });

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