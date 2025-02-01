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

  // Return the value between 0 and 1 with two decimal places
  return Number(votingPower.toFixed(2));
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

    const prompt = `You are an AI Agent designed to process LinkedIn profile data into standardized NFT metadata objects. Your goal is to analyze, categorize, and generate structured attributes based on the user's experience, expertise, and role in the professional services industry.

Return ONLY a valid JSON object with the following structure, no markdown or additional text:

{
  "fullName": string,
  "publicIdentifier": string,
  "profilePic": string,
  "attributes": [
    {"trait_type": "Experience Level", "value": string},
    {"trait_type": "Specialty", "value": string},
    {"trait_type": "Years in Practice", "value": string},
    {"trait_type": "Client Base", "value": string},
    {"trait_type": "Governance Voting Power", "value": number},
    {"trait_type": "Fractional Ownership", "value": null},
    {"trait_type": "Service Line Expertise", "value": {
      "Accounting Technology": number,
      "Media & Thought Leadership": number,
      "Advisory Services": number,
      "Automation & Workflow": number,
      "Small Business Accounting": number,
      "Tax Planning & Compliance": number,
      "M&A / Exit Planning": number,
      "Wealth Management": number
    }}
  ],
  "experiences": [
    {
      "title": string,
      "company": string,
      "duration": string,
      "location": string
    }
  ]
}

Rules:
- Experience Level should be one of: "Founder & Advisor", "CEO", "Director", "Consultant"
- Specialty should reflect primary industry focus
- Years in Practice should be extracted from earliest experience
- Client Base should reflect primary market served
- Governance Voting Power should be a decimal between 0.0 and 1.0 based on influence
- Service Line Expertise scores should be 0.0-10.0

Process this LinkedIn profile data and return ONLY the JSON object with no additional text or formatting:
${JSON.stringify(linkedInData)}`;

    console.log('Generating content with Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text);
    
    // Parse the response as JSON
    const metadata = JSON.parse(text);
    console.log('Generated NFT Metadata:', metadata);
    
    return metadata;
  } catch (error) {
    console.error('Error generating NFT metadata:', error);
    throw error;
  }
};