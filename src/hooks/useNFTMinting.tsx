import { useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useWalletProvider } from "./useWalletProvider";

const NFT_CONTRACT_ADDRESS = "0x6527b171AF1c61AE43bf405ABe53861b0487A369";
const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const MINT_PRICE = ethers.utils.parseUnits("50", 6);

const NFT_ABI = [
  "function mintNFT(string calldata tokenURI) external",
  "function safeMint(address recipient, string memory tokenURI) public",
  "function bulkMint(address[] calldata recipients, string[] calldata tokenURIs) external",
  "function owner() view returns (address)",
  "function MINT_PRICE() view returns (uint256)",
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
      return address.toLowerCase() === ownerAddress.toLowerCase();
    } catch (error) {
      console.error("Error checking owner:", error);
      return false;
    }
  };

  const ownerMint = async (recipient: string) => {
    console.log("Attempting owner mint for:", recipient);
    setIsMinting(true);
    try {
      const provider = await getProvider();
      if (!provider?.provider) throw new Error("No provider available");

      const signer = provider.provider.getSigner();
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_ABI,
        signer
      );

      const metadata = {
        name: "Resistance DAO Member NFT",
        description: "A member of the Resistance DAO community",
        image: "ipfs://QmYourDefaultImageHash",
        attributes: [
          {
            trait_type: "Membership Type",
            value: "Standard"
          },
          {
            trait_type: "Joined",
            value: new Date().toISOString()
          }
        ]
      };

      const metadataUri = `ipfs://QmYourIPFSHash`;
      console.log("Calling safeMint with URI:", metadataUri);
      const tx = await nftContract.safeMint(recipient, metadataUri);
      await tx.wait();
      
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

      if (ownerStatus) {
        console.log("Owner detected, using ownerMint");
        return await ownerMint(address);
      }

      console.log("Not owner, proceeding with regular mint");
      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider.provider);
      const balance = await usdcContract.balanceOf(address);
      if (balance.lt(MINT_PRICE)) {
        throw new Error(`Insufficient USDC balance. You need 50 USDC to mint.`);
      }

      const allowance = await usdcContract.allowance(address, NFT_CONTRACT_ADDRESS);
      if (allowance.lt(MINT_PRICE)) {
        throw new Error("USDC allowance too low. Please approve USDC first.");
      }

      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_ABI,
        signer
      );

      const metadata = {
        name: "Resistance DAO Member NFT",
        description: "A member of the Resistance DAO community",
        image: "ipfs://QmYourDefaultImageHash",
        attributes: [
          {
            trait_type: "Membership Type",
            value: "Standard"
          },
          {
            trait_type: "Joined",
            value: new Date().toISOString()
          }
        ]
      };

      const metadataUri = `ipfs://QmYourIPFSHash`;
      const tx = await nftContract.mintNFT(metadataUri);
      await tx.wait();
      
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
    ownerMint,
    bulkMint: async (recipients: string[], metadataUris: string[]) => {
      setIsMinting(true);
      try {
        const provider = await getProvider();
        if (!provider?.provider) throw new Error("No provider available");

        const signer = provider.provider.getSigner();
        const nftContract = new ethers.Contract(
          NFT_CONTRACT_ADDRESS,
          NFT_ABI,
          signer
        );

        const isContractOwner = await checkIfOwner();
        if (!isContractOwner) {
          throw new Error("Only the contract owner can bulk mint");
        }

        const tx = await nftContract.bulkMint(recipients, metadataUris);
        await tx.wait();
        
        return true;
      } catch (error) {
        console.error("Error in bulk mint:", error);
        throw error;
      } finally {
        setIsMinting(false);
      }
    },
    checkIfOwner,
    MINT_PRICE: "50",
  };
};
