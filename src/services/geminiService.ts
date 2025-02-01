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

  // For high-level executives and experienced consultants, boost the score
  const seniorityBoost = experiences.some(exp => 
    exp.title.toLowerCase().includes('ceo') || 
    exp.title.toLowerCase().includes('chief') ||
    (exp.title.toLowerCase().includes('consultant') && totalYears >= 5)
  ) ? 0.2 : 0;

  // Calculate voting power (40% experience, 40% expertise, 20% seniority)
  const votingPower = Math.min(
    ((totalYears / 20) * 0.4) + 
    ((averageExpertise / 10) * 0.4) + 
    seniorityBoost,
    1
  );

  return Math.round(votingPower * 100) / 100;
};

export const generateNFTMetadata = async (linkedInData: any): Promise<NFTMetadata> => {
  try {
    console.log('Initializing Gemini model...');
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 8192,
      },
    });

    const prompt = `
      Analyze this LinkedIn profile data and generate NFT metadata that accurately represents the professional's experience and expertise in the accounting and professional services industry. Pay special attention to their roles, responsibilities, and duration of experience.

      Required Output Format:
      {
        "fullName": "string",
        "publicIdentifier": "string (LinkedIn handle)",
        "profilePic": "string (URL from input)",
        "attributes": [
          {
            "trait_type": "Experience Level",
            "value": "string (e.g., CEO & Consultant, Senior Manager, etc.)"
          },
          {
            "trait_type": "Specialty",
            "value": "string (Main focus area)"
          },
          {
            "trait_type": "Years in Practice",
            "value": "string (e.g., 5+, 10+)"
          },
          {
            "trait_type": "Client Base",
            "value": "string (Types of clients served)"
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
        "experiences": [Array of most recent positions with exact details from input]
      }

      Guidelines:
      1. Experience Level should reflect their most senior role and expertise level
      2. Specialty should focus on their primary area of expertise
      3. Years in Practice should be based on their total relevant experience
      4. Client Base should reflect the types of organizations they serve
      5. Service Line Expertise scores should be based on their experience and roles
      6. Keep company names and durations exactly as provided in the input

      Input LinkedIn Data:
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