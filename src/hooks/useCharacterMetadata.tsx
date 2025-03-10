
import { useState, useEffect } from 'react';
import { getFromIPFS } from '@/services/ipfsService';

export interface CharacterMetadata {
  name: string;
  description: string;
  image?: string;
  model_url?: string;
  radiation_cloud_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
  ipfsCID: string;
  role: 'SENTINEL' | 'SURVIVOR' | 'BOUNTY_HUNTER';
}

interface UseCharacterMetadataProps {
  ipfsCID: string;
  role: 'SENTINEL' | 'SURVIVOR' | 'BOUNTY_HUNTER';
  name: string;
}

export const useCharacterMetadata = ({ ipfsCID, role, name }: UseCharacterMetadataProps) => {
  const [metadata, setMetadata] = useState<CharacterMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Skip fetch if no CID provided
    if (!ipfsCID) {
      setLoading(false);
      return;
    }

    const fetchMetadata = async () => {
      try {
        setLoading(true);
        
        // Check if we have a cached version
        const cachedData = sessionStorage.getItem(`character-metadata-${ipfsCID}`);
        if (cachedData) {
          setMetadata(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        // Fetch from IPFS if not cached
        const data = await getFromIPFS(ipfsCID, 'content');
        
        // Build full metadata object
        const characterMetadata: CharacterMetadata = {
          ...data,
          ipfsCID,
          role,
          name: name || data.name
        };
        
        // Cache the result
        sessionStorage.setItem(`character-metadata-${ipfsCID}`, JSON.stringify(characterMetadata));
        
        setMetadata(characterMetadata);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching character metadata:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch character metadata'));
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [ipfsCID, role, name]);

  return { metadata, loading, error };
};
