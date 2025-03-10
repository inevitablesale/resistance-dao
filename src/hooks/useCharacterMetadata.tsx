
import { useState, useEffect } from 'react';
import { CharacterMetadata } from '@/types/character';

const PINATA_GATEWAY_URL = "https://gateway.pinata.cloud/ipfs/";

export const useCharacterMetadata = (ipfsCID: string, role: "SURVIVOR" | "SENTINEL" | "BOUNTY_HUNTER", characterName: string) => {
  const [metadata, setMetadata] = useState<CharacterMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!ipfsCID) {
        setIsLoading(false);
        setError("No IPFS CID provided");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Build the Pinata gateway URL
        const url = `${PINATA_GATEWAY_URL}${ipfsCID}`;
        
        // Fetch the metadata from IPFS
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Create a standardized metadata object with required fields
        const characterMetadata: CharacterMetadata = {
          ipfsCID,
          role,
          name: characterName,
          description: data.description || `A ${role.toLowerCase().replace('_', ' ')} character in the Resistance universe.`,
          image: data.image || `${PINATA_GATEWAY_URL}${ipfsCID}`,
          attributes: data.attributes || [],
          modelUrl: data.model_url || null,
          radiationCloudUrl: data.radiation_cloud_url || null
        };
        
        setMetadata(characterMetadata);
      } catch (err) {
        console.error("Error fetching character metadata:", err);
        setError(err instanceof Error ? err.message : "Unknown error fetching metadata");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [ipfsCID, role, characterName]);

  return { metadata, isLoading, error };
};

export default useCharacterMetadata;
