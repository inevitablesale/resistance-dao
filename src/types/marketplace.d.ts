
export interface MarketplaceMetadata {
  name: string;
  description: string;
  image: string;
  imageUrl?: string; // Add optional imageUrl for HTTP version of IPFS image
  contentType: string;
  category: string;
  experiences: Array<{
    title: string;
    company: string;
    duration: string;
    location: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
  }>;
  skills: Array<string>;
}

export interface Publication {
  id: string;
  title: string;
  content: string;
  contentType: string;
  category: string;
  publisher: string;
  publishedAt: number;
  metadata?: MarketplaceMetadata;
}
