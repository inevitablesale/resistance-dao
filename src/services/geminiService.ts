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

      Standardized Field Rules:

      Personal & Identification Fields:
      - fullName: The full name of the individual
      - publicIdentifier: LinkedIn username or public profile identifier
      - profilePic: The profile image URL

      Professional Experience:
      - experiences: List of key professional roles, including:
        - title: Position title
        - company: Organization name
        - duration: Time spent in the role
        - location: City/remote work status

      Trait Categories & Scoring:
      - attributes: Standardized NFT trait assignments:
        - Experience Level: (e.g., Founder & Advisor, CEO, Director, Consultant)
        - Specialty: Determined by the primary industries they influence
        - Years in Practice: Extracted from the earliest experience date
        - Client Base: The primary market served (e.g., SMBs, Accounting Firms, Private Equity)
        - Governance Voting Power: Scale 0.0 - 1.0 based on role, influence, and industry contributions
        - Fractional Ownership: Defaults to null unless ownership is assigned
        - Service Line Expertise: Scores (0.0 - 10.0) based on experience and industry focus across:
          - Accounting Technology
          - Media & Thought Leadership
          - Advisory Services
          - Automation & Workflow
          - Small Business Accounting
          - Tax Planning & Compliance
          - M&A / Exit Planning
          - Wealth Management

      Rules for Scoring:
      - Governance Voting Power: Assigned based on influence, leadership, and role tenure
      - Fractional Ownership: Only included when explicitly provided
      - Service Line Expertise: Weighted based on role, tenure, and domain expertise
      - Experience Level: Defined based on highest role achieved
      - Client Base: Extracted from career focus areas

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