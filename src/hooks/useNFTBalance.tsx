
import { useQuery } from "@tanstack/react-query";
import { getNFTBalanceByContract, fetchNFTsForAddress, RESISTANCE_NFT_ADDRESS } from "@/services/alchemyService";
import { markTokenAsAirdrop, isTokenAirdrop } from "@/services/nftPurchaseEvents";
import { useToast } from "@/hooks/use-toast";

export const useNFTBalance = (address?: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['nftBalance', address],
    queryFn: async () => {
      if (!address) return { balance: 0, nfts: [] };
      
      try {
        // Use the Alchemy service to get the NFT balance
        const balance = await getNFTBalanceByContract(address, RESISTANCE_NFT_ADDRESS);
        
        // Also fetch the NFTs to get their IDs and track which are airdrops
        const nfts = await fetchNFTsForAddress(address);
        
        // Check which NFTs are airdrops vs purchases
        const categorizedNfts = nfts.map(nft => ({
          ...nft,
          isAirdrop: isTokenAirdrop(nft.tokenId)
        }));
        
        return { 
          balance, 
          nfts: categorizedNfts,
          purchasedCount: categorizedNfts.filter(nft => !nft.isAirdrop).length,
          airdropCount: categorizedNfts.filter(nft => nft.isAirdrop).length
        };
      } catch (error) {
        console.error("Error fetching NFT balance:", error);
        toast({
          title: "Error",
          description: "Failed to load NFT data. Please try again.",
          variant: "destructive"
        });
        return { balance: 0, nfts: [] };
      }
    },
    enabled: !!address,
  });
};

// Utility function to mark a token as an airdrop
export const markNFTAsAirdrop = (tokenId: string) => {
  if (!tokenId) return;
  
  markTokenAsAirdrop(tokenId);
  
  // Show a toast notification
  const { toast } = useToast();
  toast({
    title: "NFT Marked as Airdrop",
    description: `Token ID ${tokenId} has been marked as an airdrop and won't trigger referral rewards.`,
  });
};

// Utility function to check if a token is an airdrop
export const checkIfNFTIsAirdrop = (tokenId: string): boolean => {
  if (!tokenId) return false;
  return isTokenAirdrop(tokenId);
};
