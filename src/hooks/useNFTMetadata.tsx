
import { useQuery } from "@tanstack/react-query";
import { fetchNFTByTokenId, type OpenSeaNFT } from "@/services/openseaService";
import { CONTRACT_ADDRESS } from "@/hooks/useNFTCollection";

export const useNFTMetadata = (tokenId: string) => {
  return useQuery({
    queryKey: ['nft', CONTRACT_ADDRESS, tokenId],
    queryFn: () => fetchNFTByTokenId(CONTRACT_ADDRESS, tokenId),
    enabled: !!tokenId,
  });
};
