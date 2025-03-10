
import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { 
  checkNFTOwnership, 
  fetchNFTsForAddress, 
  getPrimaryRole, 
  NFTClass, 
  ResistanceNFT,
  SENTINEL_NFT_ADDRESS,
  SURVIVOR_NFT_ADDRESS,
  BOUNTY_HUNTER_NFT_ADDRESS,
  getNFTBalanceByContract
} from '@/services/alchemyService';

interface NFTRolesState {
  isLoading: boolean;
  error: Error | null;
  primaryRole: NFTClass;
  isSentinel: boolean;
  isSurvivor: boolean;
  isBountyHunter: boolean;
  nfts: ResistanceNFT[];
  counts: {
    sentinel: number;
    survivor: number;
    bountyHunter: number;
  };
  refetch: () => Promise<void>;
}

export const useNFTRoles = (): NFTRolesState => {
  const { primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [primaryRole, setPrimaryRole] = useState<NFTClass>('Unknown');
  const [nfts, setNfts] = useState<ResistanceNFT[]>([]);
  const [counts, setCounts] = useState({
    sentinel: 0,
    survivor: 0,
    bountyHunter: 0
  });
  
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
      
      // Get direct balance counts from contracts
      const sentinelCount = await getNFTBalanceByContract(primaryWallet.address, SENTINEL_NFT_ADDRESS);
      const survivorCount = await getNFTBalanceByContract(primaryWallet.address, SURVIVOR_NFT_ADDRESS);
      const bountyHunterCount = await getNFTBalanceByContract(primaryWallet.address, BOUNTY_HUNTER_NFT_ADDRESS);
      
      setCounts({
        sentinel: sentinelCount,
        survivor: survivorCount,
        bountyHunter: bountyHunterCount
      });
      
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
    counts,
    refetch: fetchData
  };
};
