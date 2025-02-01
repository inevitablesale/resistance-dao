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

const calculateGovernanceVotingPower = (experiences: any[], serviceExpertise: { [key: string]: number }, connections: number = 0, followers: number = 0) => {
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

  // Leadership score based on titles
  const leadershipScore = experiences.some(exp => 
    exp.title.toLowerCase().includes('ceo') || 
    exp.title.toLowerCase().includes('founder') ||
    exp.title.toLowerCase().includes('chief') ||
    exp.title.toLowerCase().includes('president')
  ) ? 0.3 : experiences.some(exp =>
    exp.title.toLowerCase().includes('director') ||
    exp.title.toLowerCase().includes('principal') ||
    (exp.title.toLowerCase().includes('consultant') && totalYears >= 5)
  ) ? 0.2 : 0.1;

  // Network influence score (normalized to 0-0.2)
  const networkScore = Math.min(
    ((connections / 10000) + (followers / 15000)) / 2,
    0.2
  );

  // Calculate voting power (30% expertise, 30% experience, 20% leadership, 20% network)
  const votingPower = Math.min(
    ((averageExpertise / 10) * 0.3) + 
    ((totalYears / 20) * 0.3) + 
    leadershipScore +
    networkScore,
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
      You are an AI Agent designed to process LinkedIn profile data into standardized NFT metadata objects. Your goal is to analyze, categorize, and generate structured attributes based on the user's experience, expertise, and role in the professional services industry.

      Return ONLY a valid JSON object with no markdown formatting or additional text. The response should be a pure JSON object that can be parsed directly.

      Standardized Field Rules:
      Personal & Identification Fields:
      - fullName: The full name of the individual.
      - publicIdentifier: LinkedIn username or public profile identifier.
      - profilePic: The profile image URL.

      Professional Experience:
      - experiences: List of key professional roles, including:
        - title: Position title.
        - company: Organization name.
        - duration: Time spent in the role.
        - location: City/remote work status.

      Trait Categories & Scoring:
      attributes: Standardized NFT trait assignments:
      - Experience Level: (e.g., Founder & Advisor, CEO, Director, Consultant)
      - Specialty: Determined by the primary industries they influence.
      - Years in Practice: Extracted from the earliest experience date.
      - Client Base: The primary market served (e.g., SMBs, Accounting Firms, Private Equity).
      - Service Line Expertise: Scores (0.0 - 10.0) based on experience and industry focus across:
        - Accounting Technology
        - Media & Thought Leadership
        - Advisory Services
        - Automation & Workflow
        - Small Business Accounting
        - Tax Planning & Compliance
        - M&A / Exit Planning
        - Wealth Management

      Process this LinkedIn profile data and return ONLY the JSON object:
      ${JSON.stringify(linkedInData)}
    `;

    console.log('Generating content with Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      console.log('Raw Gemini response:', text);
      
      // Remove any markdown formatting or extra text
      const jsonStr = text.replace(/```json\n|\n```|```/g, '').trim();
      console.log('Cleaned JSON string:', jsonStr);
      
      const metadata = JSON.parse(jsonStr);
      
      // Calculate and add Governance Voting Power
      const votingPower = calculateGovernanceVotingPower(
        metadata.experiences,
        metadata.attributes.find((a: any) => a.trait_type === "Service Line Expertise")?.value || {},
        linkedInData.data?.connections,
        linkedInData.data?.followers
      );

      // Add Governance Voting Power to attributes if not present
      if (!metadata.attributes.find((a: any) => a.trait_type === "Governance Voting Power")) {
        metadata.attributes.push({
          trait_type: "Governance Voting Power",
          value: votingPower
        });
      }

      // Add Fractional Ownership if not present
      if (!metadata.attributes.find((a: any) => a.trait_type === "Fractional Ownership")) {
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