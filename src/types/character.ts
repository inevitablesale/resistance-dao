
import { IPFSContent } from "./content";

export interface CharacterMetadata {
  ipfsCID: string;
  role: "SURVIVOR" | "SENTINEL" | "BOUNTY_HUNTER";
  name: string;
  description: string;
  image?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  modelUrl?: string;
  radiationCloudUrl?: string;
}

export interface CharacterType {
  id: number;
  name: string;
  ipfsCID: string;
}
