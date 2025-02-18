
import { Buffer } from 'buffer';
import { ProposalMetadata } from '@/types/proposals';
import { IPFSContent } from '@/types/content';

const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
];

let currentGatewayIndex = 0;

export const getFromIPFS = async <T extends ProposalMetadata | IPFSContent>(
  hash: string,
  type: 'proposal' | 'content'
): Promise<T> => {
  try {
    const gateway = IPFS_GATEWAYS[currentGatewayIndex];
    const url = `${gateway}${hash}`;
    console.log('Fetching from IPFS gateway:', url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`IPFS fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw IPFS data:', JSON.stringify(data, null, 2));

    if (type === 'proposal') {
      // Map string values to enum types if needed
      const mappedData = {
        ...data,
        votingDuration: data.votingDuration || 604800, // Default to 7 days if not specified
      };
      console.log('Mapped proposal data:', JSON.stringify(mappedData, null, 2));
      return mappedData as T;
    } else {
      // Handle content type
      console.log('Mapped content data:', JSON.stringify(data, null, 2));
      return data as T;
    }
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw error;
  }
};

export const uploadToIPFS = async <T extends ProposalMetadata | IPFSContent>(
  content: T
): Promise<string> => {
  try {
    console.log('Uploading to IPFS:', JSON.stringify(content, null, 2));
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}`;
    return mockHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};
