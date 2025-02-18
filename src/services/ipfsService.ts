import { Buffer } from 'buffer';
import { ProposalMetadata } from '@/types/proposals';

const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
];

let currentGatewayIndex = 0;

export const getFromIPFS = async <T extends ProposalMetadata>(
  hash: string,
  type: 'proposal'
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

    // Map string values to enum types if needed
    const mappedData = {
      ...data,
      votingDuration: data.votingDuration || 604800, // Default to 7 days if not specified
      // Keep all other fields as they are since we're accepting string values now
    };

    console.log('Mapped IPFS data:', JSON.stringify(mappedData, null, 2));
    return mappedData as T;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw error;
  }
};

export const uploadToIPFS = async <T extends ProposalMetadata>(content: T): Promise<string> => {
  try {
    // For now, we'll use a mock implementation
    // In production, this would interact with actual IPFS nodes
    console.log('Uploading to IPFS:', JSON.stringify(content, null, 2));
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}`;
    return mockHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};
