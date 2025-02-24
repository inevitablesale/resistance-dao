
import { Buffer } from 'buffer';
import { ProposalMetadata } from '@/types/proposals';
import { IPFSContent } from '@/types/content';
import { supabase } from "@/integrations/supabase/client";

export const getFromIPFS = async <T extends ProposalMetadata | IPFSContent>(
  hash: string,
  type: 'proposal' | 'content'
): Promise<T> => {
  try {
    console.log('Getting Pinata credentials from Supabase...');
    const { data: credentials, error: credentialsError } = await supabase
      .functions.invoke('get-pinata-credentials');

    if (credentialsError || !credentials.PINATA_API_KEY || !credentials.PINATA_API_SECRET) {
      console.error('Error getting Pinata credentials:', credentialsError);
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

    // Get the metadata URL from the pin list response
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
    
    console.log('Getting Pinata credentials from Supabase...');
    const { data: credentials, error: credentialsError } = await supabase
      .functions.invoke('get-pinata-credentials');

    if (credentialsError || !credentials.PINATA_API_KEY || !credentials.PINATA_API_SECRET) {
      console.error('Error getting Pinata credentials:', credentialsError);
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
