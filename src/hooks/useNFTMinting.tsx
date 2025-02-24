
import { useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useWalletProvider } from "./useWalletProvider";

const NFT_CONTRACT_ADDRESS = "0xd3F9cA9d44728611dA7128ec71E40D0314FCE89C";
const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Polygon USDC
const MINT_PRICE = ethers.utils.parseUnits("50", 6); // 50 USDC with 6 decimals

const NFT_ABI = [
  "function mintNFT(string calldata tokenURI) external",
  "function MINT_PRICE() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)"
];

const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)"
];

export const useNFTMinting = () => {
  const [isApproving, setIsApproving] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();
  const { getProvider } = useWalletProvider();

  const checkUSDCApproval = async (address: string): Promise<boolean> => {
    try {
      const provider = await getProvider();
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
      const usdcContract = new ethers.Contract(
        USDC_ADDRESS,
        USDC_ABI,
        provider.provider.getSigner()
      );

      const tx = await usdcContract.approve(NFT_CONTRACT_ADDRESS, MINT_PRICE);
      await tx.wait();
      
      toast({
        title: "USDC Approved",
        description: "You can now mint your Resistance DAO Member NFT",
      });
      return true;
    } catch (error) {
      console.error("Error approving USDC:", error);
      toast({
        title: "Approval Failed",
        description: "Failed to approve USDC. Please try again.",
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
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_ABI,
        provider.provider.getSigner()
      );

      const tx = await nftContract.mintNFT("ipfs://QmYourIPFSHash"); // Replace with actual metadata URI
      await tx.wait();
      
      toast({
        title: "NFT Minted!",
        description: "Welcome to Resistance DAO!",
      });
      return true;
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Minting Failed",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive",
      });
      return false;
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
    MINT_PRICE: "50",
  };
};

