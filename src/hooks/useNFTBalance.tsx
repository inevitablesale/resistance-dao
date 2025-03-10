
import { useQuery } from "@tanstack/react-query";
import { getNFTBalanceByContract, RESISTANCE_NFT_ADDRESS } from "@/services/alchemyService";

export const useNFTBalance = (address?: string) => {
  return useQuery({
    queryKey: ['nftBalance', address],
    queryFn: async () => {
      if (!address) return 0;
      
      // Use the updated Alchemy service to get the NFT balance
      const balance = await getNFTBalanceByContract(address);
      return balance;
    },
    enabled: !!address,
  });
};
