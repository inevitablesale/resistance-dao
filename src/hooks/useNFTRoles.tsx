
import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { 
  checkNFTOwnership, 
  fetchNFTsForAddress, 
  getPrimaryRole, 
  NFTClass, 
  ResistanceNFT 
} from '@/services/alchemyService';

interface NFTRolesState {
  isLoading: boolean;
  error: Error | null;
  primaryRole: NFTClass;
  isSentinel: boolean;
  isSurvivor: boolean;
  isBountyHunter: boolean;
  nfts: ResistanceNFT[];
  refetch: () => Promise<void>;
}

export const useNFTRoles = (): NFTRolesState => {
  const { primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [primaryRole, setPrimaryRole] = useState<NFTClass>('Unknown');
  const [nfts, setNfts] = useState<ResistanceNFT[]>([]);
  
  const fetchData = async () => {
    if (!primaryWallet?.address) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all NFTs
      const fetchedNfts = await fetchNFTsForAddress(primaryWallet.address);
      setNfts(fetchedNfts);
      
      // Determine primary role
      const role = await getPrimaryRole(primaryWallet.address);
      setPrimaryRole(role);
    } catch (err) {
      console.error("Error fetching NFT roles:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [primaryWallet?.address]);

  return {
    isLoading,
    error,
    primaryRole,
    isSentinel: primaryRole === 'Sentinel',
    isSurvivor: primaryRole === 'Survivor',
    isBountyHunter: primaryRole === 'Bounty Hunter',
    nfts,
    refetch: fetchData
  };
};
