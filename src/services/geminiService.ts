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
    console.log('Initializing API call to Gemini...');
    
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

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('Using API key:', apiKey ? 'Key is present' : 'Key is missing');

    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Response not OK:', errorText);
      throw new Error('Failed to generate NFT metadata');
    }

    const result = await response.json();
    console.log('Gemini API Response:', result);

    // Extract the generated text from the response
    const generatedText = result.candidates[0].content.parts[0].text;

    // Parse the JSON response from the generated text
    try {
      const metadata = JSON.parse(generatedText);
      console.log('Parsed NFT Metadata:', metadata);
      return metadata;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse NFT metadata from Gemini response');
    }
  } catch (error) {
    console.error('Error generating NFT metadata:', error);
    throw error;
  }
};