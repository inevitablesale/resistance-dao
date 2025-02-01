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

export const generateNFTMetadata = async (linkedInData: any): Promise<NFTMetadata> => {
  try {
    // Initialize the model with specific configuration
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    // Construct the prompt with clear instructions
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
            "trait_type": "Governance Voting Power",
            "value": number (0.0-1.0)
          },
          {
            "trait_type": "Fractional Ownership",
            "value": null
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

    // Generate content using the model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse and validate the response
    try {
      const metadata = JSON.parse(text);
      console.log("Generated NFT Metadata:", metadata);
      return metadata;
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      throw new Error("Failed to parse Gemini response");
    }
  } catch (error) {
    console.error("Error generating NFT metadata:", error);
    throw error;
  }
};