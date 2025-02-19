
import { Database, Link, Shield, Server } from "lucide-react";
import { LoadingState } from "@/types/loading";

export const loadingStates: LoadingState[] = [
  {
    message: "Connecting Wallet to Smart Contract",
    subtitle: "Verified on Polygon",
    progress: 20,
    icon: Database
  },
  {
    message: "Querying Polygon Network",
    subtitle: "Decentralized Storage",
    progress: 40,
    icon: Link
  },
  {
    message: "Verifying On-Chain Proposals",
    subtitle: "Smart Contract Protected",
    progress: 60,
    icon: Shield
  },
  {
    message: "Fetching IPFS Documents",
    subtitle: "Web3 Secured",
    progress: 80,
    icon: Server
  },
  {
    message: "Synchronizing with Latest Block",
    subtitle: "Blockchain Validated",
    progress: 100,
    icon: Database
  }
];
