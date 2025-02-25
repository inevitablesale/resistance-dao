
import { useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useWalletProvider } from "./useWalletProvider";

// Polygon Mainnet addresses
const NFT_CONTRACT_ADDRESS = "0xd3F9cA9d44728611dA7128ec71E40D0314FCE89C";
const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const MINT_PRICE = ethers.utils.parseUnits("50", 6); // 50 USDC with 6 decimals

const NFT_ABI = [
  "function mint(address to) external",
  "function safeMint(address to, string memory uri) external",
  "function setTokenURI(uint256 tokenId, string memory uri) external",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address owner) view returns (uint256)"
];

const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export const useNFTMinting = () => {
  const [isApproving, setIsApproving] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();
  const { getProvider } = useWalletProvider();

  const checkUSDCApproval = async (address: string) => {
    try {
      const provider = await getProvider();
      if (!provider?.provider) return false;

      const usdcContract = new ethers.Contract(
        USDC_ADDRESS,
        USDC_ABI,
        provider.provider
      );

      const allowance = await usdcContract.allowance(address, NFT_CONTRACT_ADDRESS);
      return allowance.gte(MINT_PRICE);
    } catch (error) {
      console.error("Error checking USDC approval:", error);
      return false;
    }
  };

  const getUSDCBalance = async (address: string) => {
    try {
      const provider = await getProvider();
      if (!provider?.provider) return "0";

      const usdcContract = new ethers.Contract(
        USDC_ADDRESS,
        USDC_ABI,
        provider.provider
      );

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
      console.log("Starting USDC approval process...");
      const provider = await getProvider();
      if (!provider?.provider) throw new Error("No provider available");

      const signer = provider.provider.getSigner();
      const usdcContract = new ethers.Contract(
        USDC_ADDRESS,
        USDC_ABI,
        signer
      );

      console.log("Approving USDC amount:", ethers.utils.formatUnits(MINT_PRICE, 6));
      const tx = await usdcContract.approve(NFT_CONTRACT_ADDRESS, MINT_PRICE);
      console.log("Approval transaction submitted:", tx.hash);

      await tx.wait();
      console.log("USDC approval complete");
      return true;
    } catch (error) {
      console.error("USDC approval failed:", error);
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
      console.log("Starting NFT mint process...");
      const provider = await getProvider();
      if (!provider?.provider) throw new Error("No provider available");

      const signer = provider.provider.getSigner();
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_ABI,
        signer
      );

      // First mint the token to the user
      console.log("Minting NFT...");
      const tx = await nftContract.mint(await signer.getAddress());
      console.log("Mint transaction submitted:", tx.hash);

      const receipt = await tx.wait();
      console.log("NFT minted successfully:", receipt);

      return true;
    } catch (error) {
      console.error("NFT minting failed:", error);
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
