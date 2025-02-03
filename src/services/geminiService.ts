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
  experiences: Array<{
    title: string;
    company: string;
    duration: string;
    location: string;
  }>;
}

const systemInstruction = `Role & Objective
You are an AI Agent specializing in transforming LinkedIn profile data into structured NFT metadata objects. Your purpose is to analyze, categorize, and assign definitive trait values based on a professional's experience, influence, and expertise in the accounting, finance, and advisory industries.

Each NFT consists of exactly one trait per layer, ensuring a precise but adaptable metadata structure.

🔹 NFT Trait Assignment Logic
Each NFT has six defined attribute layers, and you must select exactly one value per layer based on the user's profile data:

1️⃣ Governance Power (Influence & Leadership)
2️⃣ Experience Level (Hierarchy)
3️⃣ Specialty (Primary Service Focus)
4️⃣ Years in Practice (Longevity)
5️⃣ Client Base (Market Focus)
6️⃣ Service Line Expertise (Top Ranked Skill)`;

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
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    const prompt = `${systemInstruction}

Analyze this LinkedIn profile and generate the NFT metadata according to the specified format:
${JSON.stringify(linkedInData)}`;

    console.log('Generating content with Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      console.log('Parsing Gemini response...');
      const metadata = JSON.parse(text);
      
      // Calculate and add Governance Voting Power
      const votingPower = calculateGovernanceVotingPower(
        metadata.experiences || [],
        metadata.attributes.find((a: any) => a.trait_type === "Service Line Expertise")?.value || {}
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