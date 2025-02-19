
import { Buffer } from 'buffer';
import { ProposalMetadata } from '@/types/proposals';
import { IPFSContent } from '@/types/content';

const PINATA_GATEWAY = 'https://blue-shaggy-halibut-668.mypinata.cloud/ipfs/';
const PINATA_GATEWAY_TOKEN = 'LxW7Vt1WCzQk4x7VPUWYizgTK5BXllL4JMUQVXMeZEPqSoovWPXI-jmwcFsZ3hs';

export const getFromIPFS = async <T extends ProposalMetadata | IPFSContent>(
  hash: string,
  type: 'proposal' | 'content'
): Promise<T> => {
  try {
    const url = `${PINATA_GATEWAY}${hash}?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`;
    console.log('Fetching from Pinata gateway:', url);

    const response = await fetch(url);
    if (!response.ok) {
      console.error('Pinata gateway response not OK:', response.status, response.statusText);
      throw new Error(`IPFS fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw IPFS data from Pinata:', JSON.stringify(data, null, 2));

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
    console.error('Error fetching from Pinata gateway:', error);
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

