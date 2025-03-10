
import { useQuery } from "@tanstack/react-query";
import { getNFTBalanceByContract, RESISTANCE_NFT_ADDRESS } from "@/services/alchemyService";
import { markTokenAsAirdrop, isTokenAirdrop } from "@/services/nftPurchaseEvents";

export const useNFTBalance = (address?: string) => {
  return useQuery({
    queryKey: ['nftBalance', address],
    queryFn: async () => {
      if (!address) return 0;
      
      // Use the Alchemy service to get the NFT balance
      const balance = await getNFTBalanceByContract(address, RESISTANCE_NFT_ADDRESS);
      return balance;
    },
    enabled: !!address,
  });
};

// Utility function to mark a token as an airdrop
export const markNFTAsAirdrop = (tokenId: string) => {
  if (!tokenId) return;
  markTokenAsAirdrop(tokenId);
};

// Utility function to check if a token is an airdrop
export const checkIfNFTIsAirdrop = (tokenId: string): boolean => {
  if (!tokenId) return false;
  return isTokenAirdrop(tokenId);
};
