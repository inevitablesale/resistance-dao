import { useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useWalletProvider } from "./useWalletProvider";
import { uploadToIPFS } from "@/services/ipfsService";
import { IPFSContent } from "@/types/content";

// Contract addresses on Polygon
const NFT_CONTRACT_ADDRESS = "0xd3F9cA9d44728611dA7128ec71E40D0314FCE89C";
const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const MINT_PRICE = ethers.utils.parseUnits("50", 6); // 50 USDC with 6 decimals

const NFT_ABI = [
  "function mintNFT(string calldata tokenURI) external",
  "function safeMint(address recipient, string memory tokenURI) public",
  "function bulkMint(address[] calldata recipients, string[] calldata tokenURIs) external",
  "function owner() view returns (address)",
  "function tokenCounter() view returns (uint256)",
  "function MINT_PRICE() view returns (uint256)",
  "function treasury() view returns (address)",
  "function USDC_TOKEN() view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "event NFTMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI)"
];

const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export const useNFTMinting = () => {
  const [isApproving, setIsApproving] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const { toast } = useToast();
  const { getProvider } = useWalletProvider();

  const checkUSDCApproval = async (address: string): Promise<boolean> => {
    try {
      const provider = await getProvider();
      if (!provider?.provider) return false;

      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider.provider);
      const allowance = await usdcContract.allowance(address, NFT_CONTRACT_ADDRESS);
      return allowance.gte(MINT_PRICE);
    } catch (error) {
      console.error("Error checking USDC approval:", error);
      return false;
    }
  };

  const getUSDCBalance = async (address: string): Promise<string> => {
    try {
      const provider = await getProvider();
      if (!provider?.provider) return "0";

      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider.provider);
      const balance = await usdcContract.balanceOf(address);
      return ethers.utils.formatUnits(balance, 6); // USDC has 6 decimals
    } catch (error) {
      console.error("Error getting USDC balance:", error);
      return "0";
    }
  };

  const approveUSDC = async () => {
    setIsApproving(true);
    try {
      const provider = await getProvider();
      if (!provider?.provider) throw new Error("No provider available");

      const usdcContract = new ethers.Contract(
        USDC_ADDRESS,
        USDC_ABI,
        provider.provider.getSigner()
      );

      const tx = await usdcContract.approve(NFT_CONTRACT_ADDRESS, MINT_PRICE);
      await tx.wait();
      
      return true;
    } catch (error) {
      console.error("Error approving USDC:", error);
      toast({
        title: "Approval Failed",
        description: "Failed to approve USDC spending. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  const checkIfOwner = async () => {
    try {
      const provider = await getProvider();
      if (!provider?.provider) return false;

      const signer = provider.provider.getSigner();
      const address = await signer.getAddress();
      
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_ABI,
        provider.provider
      );
      
      const ownerAddress = await nftContract.owner();
      const isContractOwner = address.toLowerCase() === ownerAddress.toLowerCase();
      setIsOwner(isContractOwner);
      return isContractOwner;
    } catch (error) {
      console.error("Error checking owner:", error);
      return false;
    }
  };

  const createNFTMetadata = async (isCoreTeam: boolean) => {
    const metadata: IPFSContent = {
      title: "Resistance DAO Member NFT",
      description: "A member of the Resistance DAO community",
      image: "ipfs://QmavmeeRNGXrxewZkHnv9Yyc2k2ZDpmVNwU4XAYQXDbsD6", // Default Resistance DAO logo
      content: {
        type: "nft",
        properties: {
          membershipType: isCoreTeam ? "Core Member" : "Member",
          joinedDate: new Date().toISOString().split('T')[0],
          collection: "Resistance DAO Genesis"
        }
      }
    };

    console.log('Uploading NFT metadata to IPFS:', JSON.stringify(metadata, null, 2));
    const ipfsHash = await uploadToIPFS(metadata);
    console.log('Metadata uploaded to IPFS with hash:', ipfsHash);
    return `ipfs://${ipfsHash}`;
  };

  const ownerMint = async (recipient: string) => {
    setIsMinting(true);
    try {
      const provider = await getProvider();
      if (!provider?.provider) throw new Error("No provider available");

      const signer = provider.provider.getSigner();
      const address = await signer.getAddress();
      
      console.log("Checking if address is owner:", address);
      const ownerStatus = await checkIfOwner();
      console.log("Is owner?", ownerStatus);

      // If owner, use direct minting
      if (ownerStatus) {
        console.log("Owner detected, using safeMint");
        return await ownerMint(address);
      }

      // Regular user minting with USDC payment
      console.log("Regular user, proceeding with USDC payment mint");
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_ABI,
        signer
      );

      const metadataUri = await createNFTMetadata(false);
      console.log("Minting with metadata URI:", metadataUri);
      
      const tx = await nftContract.mintNFT(metadataUri);
      const receipt = await tx.wait();
      
      const mintEvent = receipt.events?.find((e: any) => e.event === 'NFTMinted');
      if (!mintEvent) {
        throw new Error('Mint event not found in transaction receipt');
      }

      return true;
    } catch (error) {
      console.error("Error in owner mint:", error);
      throw error;
    } finally {
      setIsMinting(false);
    }
  };

  const mintNFT = async () => {
    setIsMinting(true);
    try {
      const provider = await getProvider();
      if (!provider?.provider) throw new Error("No provider available");

      const signer = provider.provider.getSigner();
      const address = await signer.getAddress();
      
      console.log("Checking if address is owner:", address);
      const ownerStatus = await checkIfOwner();
      console.log("Is owner?", ownerStatus);

      // If owner, use direct minting
      if (ownerStatus) {
        console.log("Owner detected, using safeMint");
        return await ownerMint(address);
      }

      // Regular user minting with USDC payment
      console.log("Regular user, proceeding with USDC payment mint");
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_ABI,
        signer
      );

      const metadataUri = await createNFTMetadata(false);
      console.log("Minting with metadata URI:", metadataUri);
      
      const tx = await nftContract.mintNFT(metadataUri);
      const receipt = await tx.wait();
      
      const mintEvent = receipt.events?.find((e: any) => e.event === 'NFTMinted');
      if (!mintEvent) {
        throw new Error('Mint event not found in transaction receipt');
      }

      return true;
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    } finally {
      setIsMinting(false);
    }
  };

  return {
    isApproving,
    isMinting,
    isOwner,
    checkUSDCApproval,
    getUSDCBalance,
    approveUSDC,
    mintNFT,
    ownerMint,
    checkIfOwner,
    MINT_PRICE: "50",
  };
};
