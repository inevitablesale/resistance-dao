import { useQuery } from "@tanstack/react-query";
import { type OpenSeaNFT } from "@/services/openseaService";
import { useState } from "react";
import { getAllCharacters, getCharactersGroupedByRole } from "@/services/characterMetadata";

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
    queryFn: async () => {
      // Return mock collection data
      return {
        collection: "resistance-wasteland",
        name: "Resistance Wasteland",
        description: "Survivors, Bounty Hunters, and Sentinels in the post-apocalyptic wasteland.",
        image_url: "/placeholder.svg",
        banner_image_url: "",
        owner: "0xdD44d15f54B799e940742195e97A30165A1CD285",
        safelist_status: "verified",
        category: "gaming",
        is_disabled: false,
        is_nsfw: false,
        traits: {
          "Role": {
            values: {
              "Sentinel": { count: 6, value: "Sentinel" },
              "Survivor": { count: 5, value: "Survivor" },
              "Bounty Hunter": { count: 5, value: "Bounty Hunter" }
            },
            count: 16
          },
          "Radiation Level": {
            values: {
              "High": { count: 5, value: "High" },
              "Medium": { count: 6, value: "Medium" },
              "Low": { count: 5, value: "Low" }
            },
            count: 16
          }
        },
        payment_tokens: [
          {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000"
          }
        ],
        creator_earnings: 2.5
      };
    },
  });

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['nfts', CONTRACT_ADDRESS, limit, nextCursor],
    queryFn: async () => {
      const { sentinels, survivors, bountyHunters } = await getCharactersGroupedByRole();
      const allNfts = [...sentinels, ...survivors, ...bountyHunters];
      
      // If limit is greater than total NFTs, return all NFTs
      if (limit >= allNfts.length) {
        return {
          data: allNfts,
          next: null,
          previous: null
        };
      }
      
      // If nextCursor is null, return first batch of NFTs
      if (nextCursor === null) {
        return {
          data: allNfts.slice(0, limit),
          next: limit < allNfts.length ? "next" : null,
          previous: null
        };
      }
      
      // Otherwise, return remaining NFTs
      return {
        data: allNfts.slice(limit),
        next: null,
        previous: "prev"
      };
    },
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
