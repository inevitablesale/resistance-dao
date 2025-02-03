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
        temperature: 0.7, // Slightly reduced for more consistent outputs
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const prompt = `
Role & Objective
You are an AI Agent specializing in transforming LinkedIn profile data into structured NFT metadata objects. Your purpose is to analyze, categorize, and assign definitive trait values based on a professional's experience, influence, and expertise in the accounting, finance, and advisory industries.
Each NFT consists of exactly one trait per layer, ensuring a precise but adaptable metadata structure.

🔹 Standardized Field Mapping
You will process LinkedIn profile data and output NFT metadata with the following standardized fields:

Personal Identification
- fullName: Extract from firstName and lastName
- publicIdentifier: Use LinkedIn username or profile URL
- profilePic: Assign LinkedIn profile picture

🔹 NFT Trait Assignment Logic
Each NFT has six defined attribute layers, and you must select exactly one value per layer based on the user's profile data.

1️⃣ Governance Power (Influence & Leadership)
| Governance Power (Value) | Follower Count & Influence Criteria |
|-------------------------|-------------------------------------|
| Industry Icon | 10,000+ followers, keynote speaker, national-level influence |
| Veteran Firm Owner | 5,000 - 9,999 followers, 20+ years leading a practice |
| Established Leader | 2,000 - 4,999 followers, regional influence, industry educator |
| Independent Operator | 500 - 1,999 followers, stable firm ownership |
| Innovator | Niche disruptor, AI-driven or automation-focused CPA |
| Tax & Compliance Expert | Heavy tax planning focus, regardless of audience size |
| M&A & Growth Specialist | Specializing in firm acquisitions, exit planning, deal structuring |
| Emerging Firm Owner | <500 followers, early-stage firm owner |

📌 Selection Guidelines:
- If a CPA has a podcast with 12,000 followers, assign "Industry Icon"
- If a CPA owns a small but stable firm with 800 followers, assign "Independent Operator"
- If a CPA is pioneering AI-driven accounting, assign "Innovator" regardless of followers

2️⃣ Experience Level (Hierarchy)
| Experience Level (Value) | Who Qualifies? |
|-------------------------|----------------|
| Founder & Advisor | Firm founders who also consult or educate |
| Managing Partner | Owners of multi-partner or regional firms |
| Firm Owner | Solo or small firm owners |
| Director | Senior leadership, not necessarily an owner |
| Consultant | Advisory-focused professional without firm ownership |

📌 Selection Guidelines:
- If a CPA owns multiple firms, assign "Managing Partner"
- If a CPA founded their own boutique firm, assign "Firm Owner"

3️⃣ Specialty (Primary Service Focus)
| Specialty (Value) | Who Qualifies? |
|------------------|----------------|
| Tax Advisory | IRS representation, tax compliance-heavy |
| Accounting & Compliance | Audit, bookkeeping, financial reporting |
| M&A & Exit Planning | Firm sales, succession planning, valuations |
| Wealth Management | Estate planning, high-net-worth advisory |
| Automation & Workflow | AI, digital transformation, automation |
| Niche Accounting | Specialized industries (e.g., crypto, cannabis, e-commerce) |

4️⃣ Years in Practice (Longevity)
| Years in Practice (Value) | Selection Logic |
|-------------------------|-----------------|
| 1-5 Years | New firm owners or recent market entrants |
| 6-10 Years | Mid-career professionals stabilizing |
| 11-15 Years | Established firm owners |
| 16-20 Years | Veteran firm operators |
| 20+ Years | Industry veterans and long-time firm owners |

5️⃣ Client Base (Market Focus)
| Client Base (Value) | Who Qualifies? |
|-------------------|----------------|
| Small Businesses | General CPAs serving SMBs |
| Accounting Firms | White-label or B2B advisory |
| Private Equity & Investors | M&A-focused, high-value transactional clients |
| High-Net-Worth Individuals | Estate planning, investment strategy clients |

6️⃣ Service Line Expertise (Top Ranked Skill)
| Service Line Expertise (Value) | Who Qualifies? |
|------------------------------|----------------|
| Accounting Technology | Cloud, AI-driven automation |
| Media & Thought Leadership | Educators, content creators, speakers |
| Advisory Services | CFO-level consulting, business strategy |
| Automation & Workflow | Operational efficiency experts |
| Small Business Accounting | Generalist CPAs focused on SMBs |
| Tax Planning & Compliance | IRS representation, audit defense |
| M&A / Exit Planning | Firm sales, deal structuring |
| Wealth Management | Financial planning, estate structuring |

Example Output Format:
{
    "fullName": "David Leary",
    "publicIdentifier": "davidleary",
    "profilePic": "https://media.licdn.com/dms/image/profile.jpg",
    "attributes": [
        {"trait_type": "Governance Power", "value": "Industry Icon"},
        {"trait_type": "Experience Level", "value": "Founder & Advisor"},
        {"trait_type": "Specialty", "value": "Accounting Technology"},
        {"trait_type": "Years in Practice", "value": "20+"},
        {"trait_type": "Client Base", "value": "Accounting Firms"},
        {"trait_type": "Service Line Expertise", "value": "Media & Thought Leadership"}
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