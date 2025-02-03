import { generateNFTMetadata } from "./geminiService";

interface LinkedInProfile {
  success: boolean;
  status: number;
  data: {
    firstName: string;
    lastName: string;
    headline: string;
    skills: Array<{ title: string }>;
    experiences: Array<{
      title: string;
      subtitle: string;
      caption: string;
    }>;
    educations: Array<{
      title: string;
      subtitle: string;
    }>;
  };
}

export const analyzeLinkedInProfile = async (profileUrl: string) => {
  try {
    const response = await fetch('https://linkedin-bulk-data-scraper.p.rapidapi.com/person', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': 'b16ff54f96mshe700bf7347e9a71p141b59jsn89af9057b370',
        'X-RapidAPI-Host': 'linkedin-bulk-data-scraper.p.rapidapi.com'
      },
      body: JSON.stringify({ link: profileUrl })
    });

    if (!response.ok) {
      console.error('API Response not OK:', await response.text());
      throw new Error('Failed to analyze LinkedIn profile');
    }

    const linkedInData = await response.json();
    console.log('LinkedIn API Response:', linkedInData);

    // Generate NFT metadata using Gemini and return only the metadata
    const nftMetadata = await generateNFTMetadata(linkedInData);
    console.log('Generated NFT Metadata:', nftMetadata);

    return nftMetadata;
  } catch (error) {
    console.error('Error analyzing LinkedIn profile:', error);
    throw error;
  }
};