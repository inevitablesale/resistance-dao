
import { useQuery } from "@tanstack/react-query";
import { fetchCollectionInfo, fetchNFTsByContract, type OpenSeaNFT, type OpenSeaCollection } from "@/services/openseaService";
import { useState } from "react";

export const CONTRACT_ADDRESS = "0xdD44d15f54B799e940742195e97A30165A1CD285";

export const useNFTCollection = (limit: number = 20) => {
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [nfts, setNfts] = useState<OpenSeaNFT[]>([]);

  const {
    data: collection,
    isLoading: isLoadingCollection,
    error: collectionError,
  } = useQuery({
    queryKey: ['nftCollection', CONTRACT_ADDRESS],
    queryFn: () => fetchCollectionInfo(CONTRACT_ADDRESS),
  });

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['nfts', CONTRACT_ADDRESS, limit, nextCursor],
    queryFn: () => fetchNFTsByContract(CONTRACT_ADDRESS, limit, nextCursor),
    meta: {
      onSuccess: (data: any) => {
        if (data) {
          if (nextCursor === null) {
            // First page, replace NFTs
            setNfts(data.data || []);
          } else {
            // Subsequent pages, append NFTs
            setNfts(prev => [...prev, ...(data.data || [])]);
          }
          setNextCursor(data.next);
        }
      }
    },
  });

  const loadMore = async () => {
    if (data?.next) {
      setNextCursor(data.next);
    }
  };

  const hasMore = !!data?.next;

  return {
    nfts,
    collection,
    isLoading: isLoading || isLoadingCollection,
    isFetching,
    error: error || collectionError,
    loadMore,
    hasMore,
    refetch
  };
};
