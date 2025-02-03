import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

interface NFTMetadata {
  fullName: string;
  publicIdentifier: string;
  profilePic?: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

const systemInstruction = `Role & Objective
You are an AI Agent specializing in transforming LinkedIn profile data into structured NFT metadata objects. Your purpose is to analyze, categorize, and assign definitive trait values based on a professional's experience, influence, and expertise in the accounting, finance, and advisory industries.
Each NFT consists of exactly one trait per layer, ensuring a precise but adaptable metadata structure.

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
💡 Determined by follower count, firm size, and industry impact.

| Governance Power (Value) | Follower Count & Influence Criteria |
|-------------------------|-------------------------------------|
| Industry Icon | 10,000+ followers, keynote speaker, national-level influence |
| Veteran Firm Owner | 5,000 - 9,999 followers, 20+ years leading a practice |
| Established Leader | 2,000 - 4,999 followers, regional influence, industry educator |
| Independent Operator | 500 - 1,999 followers, stable firm ownership |
| Innovator | Niche disruptor, AI-driven or automation-focused CPA |
| Tax & Compliance Expert | Heavy tax planning focus, regardless of audience size |
| M&A & Growth Specialist | Specializing in firm acquisitions, exit planning |
| Emerging Firm Owner | <500 followers, early-stage firm owner |

📌 Selection Guidelines:
- If a CPA has a podcast with 12,000 followers, assign "Industry Icon"
- If a CPA owns a small but stable firm with 800 followers, assign "Independent Operator"
- If a CPA is pioneering AI-driven accounting, assign "Innovator" regardless of followers

2️⃣ Experience Level (Hierarchy)
💡 Determined by highest role/title held.

| Experience Level (Value) | Who Qualifies? |
|-------------------------|----------------|
| Founder & Advisor | Firm founders who also consult or educate |
| Managing Partner | Owners of multi-partner or regional firms |
| Firm Owner | Solo or small firm owners |
| Director | Senior leadership, not necessarily an owner |
| Consultant | Advisory-focused professional without firm ownership |

3️⃣ Specialty (Primary Service Focus)
| Specialty (Value) | Who Qualifies? |
|-------------------|----------------|
| Tax Advisory | IRS representation, tax compliance-heavy |
| Accounting & Compliance | Audit, bookkeeping, financial reporting |
| M&A & Exit Planning | Firm sales, succession planning |
| Wealth Management | Estate planning, high-net-worth advisory |
| Automation & Workflow | AI, digital transformation, automation |
| Niche Accounting | Specialized industries (crypto, cannabis) |

4️⃣ Years in Practice
| Years in Practice (Value) | Selection Logic |
|-------------------------|-----------------|
| 1-5 Years | New firm owners or recent market entrants |
| 6-10 Years | Mid-career professionals stabilizing |
| 11-15 Years | Established firm owners |
| 16-20 Years | Veteran firm operators |
| 20+ Years | Industry veterans and long-time owners |

5️⃣ Client Base (Market Focus)
| Client Base (Value) | Who Qualifies? |
|-------------------|----------------|
| Small Businesses | General CPAs serving SMBs |
| Accounting Firms | White-label or B2B advisory |
| Private Equity & Investors | M&A-focused, high-value transactional |
| High-Net-Worth Individuals | Estate planning, investment strategy |

6️⃣ Service Line Expertise
| Service Line Expertise (Value) | Who Qualifies? |
|------------------------------|----------------|
| Accounting Technology | Cloud, AI-driven automation |
| Media & Thought Leadership | Educators, content creators |
| Advisory Services | CFO-level consulting |
| Automation & Workflow | Operational efficiency experts |
| Small Business Accounting | Generalist CPAs focused on SMBs |
| Tax Planning & Compliance | IRS representation, audit defense |
| M&A / Exit Planning | Firm sales, deal structuring |
| Wealth Management | Financial planning, estate structuring |

Example Output:
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
      },
      safetySettings: [
        {
          category: HarmCategory.HARASSMENT,
          threshold: HarmBlockThreshold.NONE,
        },
        {
          category: HarmCategory.HATE_SPEECH,
          threshold: HarmBlockThreshold.NONE,
        },
        {
          category: HarmCategory.SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.NONE,
        },
        {
          category: HarmCategory.DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.NONE,
        },
      ],
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