import { supabase } from "@/integrations/supabase/client";

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export const uploadMetadataToPinata = async (metadata: any): Promise<string> => {
  try {
    const { data: { PINATA_API_KEY, PINATA_API_SECRET } } = await supabase
      .functions.invoke('get-pinata-credentials');

    if (!PINATA_API_KEY || !PINATA_API_SECRET) {
      throw new Error('Pinata credentials not found');
    }

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_API_SECRET
      },
      body: JSON.stringify(metadata)
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Pinata');
    }

    const result: PinataResponse = await response.json();
    return `ipfs://${result.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw error;
  }
};