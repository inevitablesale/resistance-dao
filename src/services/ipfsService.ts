
import { Buffer } from 'buffer';
import { ProposalMetadata } from '@/types/proposals';
import { IPFSContent } from '@/types/content';

// IPFS settings
const IPFS_API_URL = 'https://api.pinata.cloud';

// In a real application, these would come from environment variables
// For now, we'll use placeholders that will be replaced with actual credentials
const PINATA_CREDENTIALS = {
  PINATA_API_KEY: process.env.PINATA_API_KEY || 'mock-api-key',
  PINATA_API_SECRET: process.env.PINATA_API_SECRET || 'mock-api-secret'
};

export const getFromIPFS = async <T extends ProposalMetadata | IPFSContent>(
  hash: string,
  type: 'proposal' | 'content'
): Promise<T> => {
  try {
    console.log('\n=== Starting IPFS Retrieval ===');
    console.log('Getting data for hash:', hash);
    
    // In a development environment without actual IPFS access,
    // we can return mock data based on the hash
    if (hash.startsWith('mock-')) {
      console.log('Using mock data for development');
      return createMockDataFromHash(hash, type) as T;
    }
    
    // For real IPFS access, use Pinata gateway
    if (hash.startsWith('ipfs://')) {
      hash = hash.substring(7);
    }
    
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;
    console.log('Fetching from IPFS gateway:', gatewayUrl);
    
    const response = await fetch(gatewayUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Data retrieved from IPFS:', data);
    console.log('=== IPFS Retrieval Complete ===\n');
    
    return data as T;
  } catch (error) {
    console.error('Error in IPFS retrieval:', error);
    // In case of error, return a fallback response
    return createMockDataFromHash(hash, type) as T;
  }
};

export const uploadToIPFS = async <T extends object>(
  content: T
): Promise<string> => {
  try {
    console.log('\n=== Starting IPFS Upload ===');
    console.log('Content to upload:', JSON.stringify(content, null, 2));
    
    // For development environments without actual IPFS access, 
    // return a mock hash
    if (process.env.NODE_ENV === 'development' && !PINATA_CREDENTIALS.PINATA_API_KEY.startsWith('real-')) {
      const mockHash = `mock-${Math.random().toString(36).substring(2, 15)}`;
      console.log('Using mock IPFS hash for development:', mockHash);
      console.log('=== IPFS Upload Complete ===\n');
      return mockHash;
    }
    
    // For real Pinata API access
    const response = await fetch(`${IPFS_API_URL}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_CREDENTIALS.PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_CREDENTIALS.PINATA_API_SECRET
      },
      body: JSON.stringify(content)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pinata upload failed:', errorText);
      throw new Error('Failed to upload to Pinata');
    }
    
    const result = await response.json();
    const ipfsHash = result.IpfsHash;
    console.log('Upload successful! IPFS hash:', ipfsHash);
    console.log('=== IPFS Upload Complete ===\n');
    
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    // In case of error with real Pinata API, return a mock hash for development
    const mockHash = `mock-${Math.random().toString(36).substring(2, 15)}`;
    console.log('Using fallback mock IPFS hash due to error:', mockHash);
    return mockHash;
  }
};

// Helper function to create mock data based on a hash
function createMockDataFromHash(hash: string, type: 'proposal' | 'content'): any {
  if (type === 'proposal') {
    return {
      title: `Mock Proposal ${hash.substring(0, 8)}`,
      description: `This is a mock proposal generated for hash ${hash}`,
      category: 'Mock Category',
      image: 'https://via.placeholder.com/300',
      investment: {
        targetCapital: '1000',
        description: 'Mock investment description',
        drivers: ['Innovation', 'Growth', 'Sustainability']
      },
      votingDuration: 604800, // 7 days
      linkedInURL: 'https://linkedin.com/company/mock',
      submissionTimestamp: Math.floor(Date.now() / 1000),
      submitter: '0x1234567890123456789012345678901234567890',
      status: 'active'
    };
  } else {
    return {
      contentSchema: '1.0.0',
      contentType: 'article',
      title: `Mock Content ${hash.substring(0, 8)}`,
      content: `This is mock content generated for hash ${hash}`,
      metadata: {
        author: 'Mock Author',
        publishedAt: Math.floor(Date.now() / 1000),
        version: 1,
        language: 'en',
        tags: ['mock', 'content', 'ipfs']
      }
    };
  }
}

export const getModelFromIPFS = async (hash: string): Promise<string> => {
  try {
    console.log('\n=== Retrieving 3D Model from IPFS ===');
    console.log('Model hash:', hash);
    
    if (hash.startsWith('ipfs://')) {
      hash = hash.substring(7);
    }
    
    // Return gateway URL
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;
    console.log('Gateway URL for model:', gatewayUrl);
    console.log('=== Model Retrieval Complete ===\n');
    
    return gatewayUrl;
  } catch (error) {
    console.error('Error retrieving model from IPFS:', error);
    throw error;
  }
};

export const uploadModelToIPFS = async (
  modelFile: File
): Promise<string> => {
  try {
    console.log('\n=== Starting 3D Model Upload to IPFS ===');
    console.log('Uploading model:', modelFile.name);
    
    // For development environments, return a mock hash
    if (process.env.NODE_ENV === 'development' && !PINATA_CREDENTIALS.PINATA_API_KEY.startsWith('real-')) {
      const mockHash = `mock-model-${Math.random().toString(36).substring(2, 15)}`;
      console.log('Using mock IPFS hash for development:', mockHash);
      console.log('=== 3D Model Upload Complete ===\n');
      return mockHash;
    }
    
    // For real Pinata API access
    const formData = new FormData();
    formData.append('file', modelFile);
    
    const metadata = JSON.stringify({
      name: modelFile.name,
      keyvalues: {
        contentType: modelFile.type,
        size: modelFile.size.toString(),
        uploadDate: new Date().toISOString()
      }
    });
    
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 1
    });
    
    formData.append('pinataOptions', options);
    
    const response = await fetch(`${IPFS_API_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_CREDENTIALS.PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_CREDENTIALS.PINATA_API_SECRET
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pinata upload failed:', errorText);
      throw new Error('Failed to upload model to Pinata');
    }
    
    const result = await response.json();
    const ipfsHash = result.IpfsHash;
    console.log('Model upload successful! IPFS hash:', ipfsHash);
    console.log('=== 3D Model Upload Complete ===\n');
    
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error('Error uploading model to IPFS:', error);
    // Return a mock hash in case of error
    return `mock-model-${Math.random().toString(36).substring(2, 15)}`;
  }
};
