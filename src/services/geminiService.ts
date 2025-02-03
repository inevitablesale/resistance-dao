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

🔹 NFT Trait Assignment Logic
Each NFT has six defined attribute layers, and you must select exactly one value per layer based on the user's profile data.

1️⃣ Governance Power (Influence & Leadership)
Values:
- Industry Icon (10,000+ followers, keynote speaker, national-level influence)
- Veteran Firm Owner (5,000-9,999 followers, 20+ years leading a practice)
- Established Leader (2,000-4,999 followers, regional influence)
- Independent Operator (500-1,999 followers, stable firm ownership)
- Innovator (Niche disruptor, AI-driven or automation-focused)
- Tax & Compliance Expert (Heavy tax planning focus)
- M&A & Growth Specialist (Specializing in firm acquisitions)
- Emerging Firm Owner (<500 followers, early-stage)

2️⃣ Experience Level (Hierarchy)
Values:
- Founder & Advisor (Firm founders who also consult/educate)
- Managing Partner (Owners of multi-partner firms)
- Firm Owner (Solo or small firm owners)
- Director (Senior leadership, not necessarily owner)
- Consultant (Advisory-focused, no firm ownership)

3️⃣ Specialty (Primary Service Focus)
Values:
- Tax Advisory (IRS representation, compliance)
- Accounting & Compliance (Audit, bookkeeping)
- M&A & Exit Planning (Firm sales, succession)
- Wealth Management (Estate planning, high-net-worth)
- Automation & Workflow (AI, digital transformation)
- Niche Accounting (Specialized industries)

4️⃣ Years in Practice (Longevity)
Values:
- 1-5 Years (New firm owners)
- 6-10 Years (Mid-career professionals)
- 11-15 Years (Established firm owners)
- 16-20 Years (Veteran firm operators)
- 20+ Years (Industry veterans)

5️⃣ Client Base (Market Focus)
Values:
- Small Businesses (General CPAs serving SMBs)
- Accounting Firms (White-label or B2B advisory)
- Private Equity & Investors (M&A-focused)
- High-Net-Worth Individuals (Estate planning)

6️⃣ Service Line Expertise (Top Ranked Skill)
Values:
- Accounting Technology (Cloud, AI-driven automation)
- Media & Thought Leadership (Educators, speakers)
- Advisory Services (CFO-level consulting)
- Automation & Workflow (Operational efficiency)
- Small Business Accounting (Generalist CPAs)
- Tax Planning & Compliance (IRS representation)
- M&A / Exit Planning (Firm sales)
- Wealth Management (Financial planning)

Return a valid JSON object with this structure:
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
