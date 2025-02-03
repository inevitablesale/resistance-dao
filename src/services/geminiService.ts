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

const systemInstruction = `Role & Objective
You are an AI Agent specializing in transforming LinkedIn profile data into structured NFT metadata objects. Your purpose is to analyze, categorize, and assign definitive trait values based on a professional's experience, influence, and expertise in the accounting, finance, and advisory industries.

🔹 Standardized Field Mapping
You will process LinkedIn profile data and output NFT metadata with the following standardized fields:

Personal Identification
- fullName: Extract from firstName and lastName
- publicIdentifier: Use LinkedIn username or profile URL
- profilePic: Assign LinkedIn profile picture

Professional Influence
- connections: Total LinkedIn connections
- followers: Total LinkedIn followers

Professional Experience
- experiences: List of key professional roles
  - title: Role in organization
  - company: Organization name
  - duration: Length of tenure
  - location: Work location

🔹 NFT Trait Assignment Logic
Each NFT has six defined attribute layers, and you must select exactly one value per layer based on the user's profile data.

1️⃣ Governance Power (Influence & Leadership)
Values & Criteria:
- Industry Icon (10,000+ followers, keynote speaker, national influence)
- Veteran Firm Owner (5,000-9,999 followers, 20+ years leading)
- Established Leader (2,000-4,999 followers, regional influence)
- Independent Operator (500-1,999 followers, stable ownership)
- Innovator (Niche disruptor, AI-driven focus)
- Tax & Compliance Expert (Heavy tax planning focus)
- M&A & Growth Specialist (Firm acquisitions focus)
- Emerging Firm Owner (<500 followers, early-stage)

2️⃣ Experience Level (Hierarchy)
Values:
- Founder & Advisor (Firm founders who educate)
- Managing Partner (Multi-partner firm owners)
- Firm Owner (Solo/small firm owners)
- Director (Senior leadership)
- Consultant (Advisory-focused)

3️⃣ Specialty (Primary Service Focus)
Values:
- Tax Advisory (IRS representation)
- Accounting & Compliance (Audit, bookkeeping)
- M&A & Exit Planning (Firm sales)
- Wealth Management (Estate planning)
- Automation & Workflow (AI, digital)
- Niche Accounting (Specialized industries)

4️⃣ Years in Practice
Values:
- 1-5 Years (New owners)
- 6-10 Years (Mid-career)
- 11-15 Years (Established)
- 16-20 Years (Veteran)
- 20+ Years (Industry veteran)

5️⃣ Client Base (Market Focus)
Values:
- Small Businesses (General SMB focus)
- Accounting Firms (B2B advisory)
- Private Equity & Investors (M&A focus)
- High-Net-Worth Individuals (Estate focus)

6️⃣ Service Line Expertise
Values:
- Accounting Technology (Cloud, AI)
- Media & Thought Leadership (Education)
- Advisory Services (CFO-level)
- Automation & Workflow (Efficiency)
- Small Business Accounting (General)
- Tax Planning & Compliance (IRS)
- M&A / Exit Planning (Deals)
- Wealth Management (Planning)

Example Outputs:

{
    "fullName": "David Leary",
    "publicIdentifier": "davidleary",
    "profilePic": "https://media.licdn.com/dms/image/v2/D5603AQEpktC47EPHAQ/profile-displayphoto-shrink_100_100/0/1670085350994?e=1743638400&v=beta&t=niaQ-OJA84JHbZSEAS5zDRkxNPJXF70GGKMN6uL_1k0",
    "attributes": [
        {"trait_type": "Governance Power", "value": "Industry Icon"},
        {"trait_type": "Experience Level", "value": "Founder & Advisor"},
        {"trait_type": "Specialty", "value": "Accounting Technology"},
        {"trait_type": "Years in Practice", "value": "20+"},
        {"trait_type": "Client Base", "value": "Accounting Firms"},
        {"trait_type": "Service Line Expertise", "value": "Media & Thought Leadership"}
    ]
}

{
    "fullName": "Tatiana Ritchie EA",
    "publicIdentifier": "tatianaritchie",
    "profilePic": "https://media.licdn.com/dms/image/v2/D5603AQGUZ5_th6vLCQ/profile-displayphoto-shrink_100_100/0/1736050905998?e=1744243200&v=beta&t=asVzqvPgnEsauKZTRLoG8Zr-LtfUl6nQffG-hgwzYMU",
    "attributes": [
        {"trait_type": "Governance Power", "value": "Established Leader"},
        {"trait_type": "Experience Level", "value": "Firm Owner"},
        {"trait_type": "Specialty", "value": "International Tax"},
        {"trait_type": "Years in Practice", "value": "16-20 Years"},
        {"trait_type": "Client Base", "value": "High-Net-Worth Individuals"},
        {"trait_type": "Service Line Expertise", "value": "Tax Planning & Compliance"}
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
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const jsonStr = jsonMatch[0];
      console.log('Extracted JSON:', jsonStr);
      
      const metadata = JSON.parse(jsonStr);
      
      if (!metadata.fullName || !metadata.publicIdentifier || !metadata.attributes) {
        throw new Error('Missing required fields in metadata');
      }
      
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
