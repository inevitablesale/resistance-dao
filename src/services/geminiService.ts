import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("YOUR_API_KEY"); // Replace with your API key

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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an AI Agent designed to process LinkedIn profile data into standardized NFT metadata objects.
      Please analyze this LinkedIn profile data and generate NFT metadata according to the specified format:
      ${JSON.stringify(linkedInData)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini Raw Response:", text);

    // Parse the response as JSON
    const metadata = JSON.parse(text);
    return metadata;
  } catch (error) {
    console.error("Error generating NFT metadata:", error);
    throw error;
  }
};