
// Type definitions for OpenSea API
declare namespace OpenSea {
  export interface NFT {
    identifier: string;
    collection: string;
    contract: string;
    token_standard: string;
    name: string;
    description: string;
    image_url: string;
    metadata_url: string;
    created_at: string;
    updated_at: string;
    is_disabled: boolean;
    is_nsfw: boolean;
    traits: Array<{
      trait_type: string;
      value: string;
      display_type: string | null;
    }>;
    animation_url: string | null;
    is_suspicious: boolean;
    creator: string | null;
    owners: Array<{
      address: string;
      quantity: number;
    }>;
    rarity: {
      rank: number;
      score: number;
      total: number;
    } | null;
  }

  export interface Collection {
    collection: string;
    name: string;
    description: string;
    image_url: string;
    banner_image_url: string;
    owner: string;
    safelist_status: string;
    category: string;
    is_disabled: boolean;
    is_nsfw: boolean;
    traits: Record<string, {
      values: Record<string, {
        count: number;
        value: string;
      }>;
      count: number;
    }>;
    payment_tokens: Array<{
      name: string;
      symbol: string;
      decimals: number;
      address: string;
    }>;
    creator_earnings: number;
  }

  export interface ApiResponse<T> {
    data: T;
    next: string | null;
    previous: string | null;
  }
}
