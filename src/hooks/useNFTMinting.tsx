
import { useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useWalletProvider } from "./useWalletProvider";
import { uploadToIPFS } from "@/services/ipfsService";
import { IPFSContent } from "@/types/content";

const NFT_CONTRACT_ADDRESS = "0xd3F9cA9d44728611dA7128ec71E40D0314FCE89C";
const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const MINT_PRICE = ethers.utils.parseUnits("50", 6); // 50 USDC with 6 decimals

const NFT_ABI = [
  "function mintNFT(string calldata tokenURI) external",
  "function safeMint(address recipient, string memory tokenURI) public",
  "function bulkMint(address[] calldata recipients, string[] calldata tokenURIs) external",
  "function owner() view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address owner) view returns (uint256)"
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
      return ethers.utils.formatUnits(balance, 6);
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

  const mintNFT = async () => {
    setIsMinting(true);
    try {
      const provider = await getProvider();
      if (!provider?.provider) throw new Error("No provider available");

      const signer = provider.provider.getSigner();
      console.log("Minting NFT with metadata URI:", "ipfs://bafkreib4ypwdplftehhyusbd4eltyubsgl6kwadlrdxw4j7g4o4wg6d6py");
      
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_ABI,
        signer
      );

      const tx = await nftContract.mintNFT("ipfs://bafkreib4ypwdplftehhyusbd4eltyubsgl6kwadlrdxw4j7g4o4wg6d6py");
      await tx.wait();
      
      console.log("NFT minted successfully!");
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
    checkUSDCApproval,
    getUSDCBalance,
    approveUSDC,
    mintNFT,
    MINT_PRICE: "50"
  };
};
