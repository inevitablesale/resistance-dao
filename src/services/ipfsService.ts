
import { Buffer } from 'buffer';
import { ProposalMetadata } from '@/types/proposals';
import { IPFSContent } from '@/types/content';

// Mock credentials for development purposes
// In production, these would be securely retrieved from environment variables or a secure API
const PINATA_CREDENTIALS = {
  PINATA_API_KEY: process.env.PINATA_API_KEY || 'mock-api-key',
  PINATA_API_SECRET: process.env.PINATA_API_SECRET || 'mock-api-secret'
};

export const getFromIPFS = async <T extends ProposalMetadata | IPFSContent>(
  hash: string,
  type: 'proposal' | 'content'
): Promise<T> => {
  try {
    console.log('Getting Pinata credentials...');
    const credentials = PINATA_CREDENTIALS;

    if (!credentials.PINATA_API_KEY || !credentials.PINATA_API_SECRET) {
      console.error('Error getting Pinata credentials');
      throw new Error('Failed to get Pinata credentials');
    }

    const url = `https://api.pinata.cloud/data/pinList?status=pinned&hashContains=${hash}`;
    console.log('Fetching from Pinata API:', url);

    const response = await fetch(url, {
      headers: {
        'pinata_api_key': credentials.PINATA_API_KEY,
        'pinata_secret_api_key': credentials.PINATA_API_SECRET,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Pinata API response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Pinata API fetch failed: ${response.statusText}`);
    }

    const pinListData = await response.json();
    console.log('Pin list response:', pinListData);

    if (!pinListData.rows || pinListData.rows.length === 0) {
      throw new Error(`Content not found for hash: ${hash}`);
    }

    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;
    console.log('Fetching metadata from:', ipfsUrl);

    const metadataResponse = await fetch(ipfsUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!metadataResponse.ok) {
      console.error('Metadata fetch failed:', metadataResponse.status, metadataResponse.statusText);
      throw new Error(`Metadata fetch failed: ${metadataResponse.statusText}`);
    }

    const data = await metadataResponse.json();
    console.log('Raw metadata from Pinata:', JSON.stringify(data, null, 2));

    if (type === 'proposal') {
      const mappedData = {
        ...data,
        votingDuration: data.votingDuration || 604800, // Default to 7 days if not specified
      };
      console.log('Mapped proposal data:', JSON.stringify(mappedData, null, 2));
      return mappedData as T;
    } else {
      console.log('Mapped content data:', JSON.stringify(data, null, 2));
      return data as T;
    }
  } catch (error) {
    console.error('Error in IPFS retrieval:', error);
    throw error;
  }
};

export const uploadToIPFS = async <T extends ProposalMetadata | IPFSContent>(
  content: T
): Promise<string> => {
  try {
    console.log('\n=== Starting IPFS Upload ===');
    console.log('Content to upload:', JSON.stringify(content, null, 2));
    
    console.log('Getting Pinata credentials...');
    const credentials = PINATA_CREDENTIALS;

    if (!credentials.PINATA_API_KEY || !credentials.PINATA_API_SECRET) {
      console.error('Error getting Pinata credentials');
      throw new Error('Failed to get Pinata credentials');
    }

    console.log('Uploading content to Pinata...');
    
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': credentials.PINATA_API_KEY,
        'pinata_secret_api_key': credentials.PINATA_API_SECRET
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
    
    return ipfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

export const getModelFromIPFS = async (hash: string): Promise<string> => {
  try {
    console.log('\n=== Retrieving 3D Model from IPFS ===');
    console.log('Model hash:', hash);
    
    console.log('Getting Pinata credentials...');
    const credentials = PINATA_CREDENTIALS;

    if (!credentials.PINATA_API_KEY || !credentials.PINATA_API_SECRET) {
      console.error('Error getting Pinata credentials');
      throw new Error('Failed to get Pinata credentials');
    }

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
    
    console.log('Getting Pinata credentials...');
    const credentials = PINATA_CREDENTIALS;

    if (!credentials.PINATA_API_KEY || !credentials.PINATA_API_SECRET) {
      console.error('Error getting Pinata credentials');
      throw new Error('Failed to get Pinata credentials');
    }

    console.log('Preparing form data for model upload...');
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
    
    console.log('Uploading model to Pinata...');
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': credentials.PINATA_API_KEY,
        'pinata_secret_api_key': credentials.PINATA_API_SECRET
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
    
    return ipfsHash;
  } catch (error) {
    console.error('Error uploading model to IPFS:', error);
    throw error;
  }
};
