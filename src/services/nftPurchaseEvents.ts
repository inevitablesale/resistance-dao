import { ethers } from "ethers";
import { ResistanceNFT, RESISTANCE_NFT_ADDRESS } from "./alchemyService";
import { createReferral, getActiveReferral, updateReferralWithPurchase } from "./referralService";
import { useToast } from "@/hooks/use-toast";

// Admin wallet address that performs airdrops
export const ADMIN_WALLET_ADDRESS = "0x1d60Fbd2d31E5Ea8ea9565ef1b186D90639583d5";

export interface NFTPurchaseEvent {
  buyer: string;
  tokenId: string;
  price: ethers.BigNumber;
  timestamp: number;
  isAirdrop?: boolean;
}

// Keep track of airdropped token IDs
const airdropTokenIds = new Set<string>();

const NFT_TRANSFER_EVENT = "Transfer(address,address,uint256)";

export const markTokenAsAirdrop = (tokenId: string) => {
  airdropTokenIds.add(tokenId.toString());
  console.log(`Token ${tokenId} marked as airdrop`);
};

export const isTokenAirdrop = (tokenId: string): boolean => {
  return airdropTokenIds.has(tokenId.toString());
};

export const subscribeToPurchaseEvents = (
  provider: ethers.providers.Web3Provider,
  onPurchaseSuccess?: (event: NFTPurchaseEvent) => void
) => {
  const nftContract = new ethers.Contract(
    RESISTANCE_NFT_ADDRESS,
    [
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
      "function ownerOf(uint256 tokenId) view returns (address)"
    ],
    provider
  );

  console.log("Subscribing to NFT purchase events and airdrops...");

  // Listen for all Transfer events
  nftContract.on(NFT_TRANSFER_EVENT, async (from, to, tokenId, event) => {
    const tokenIdStr = tokenId.toString();
    
    // Handle new mints (from zero address)
    if (from === ethers.constants.AddressZero) {
      console.log("New NFT mint detected:", {
        from,
        to,
        tokenId: tokenIdStr,
        timestamp: Math.floor(Date.now() / 1000)
      });

      // If it's from zero address directly to user (not through admin), it's a direct mint
      const isDirectMint = to.toLowerCase() !== ADMIN_WALLET_ADDRESS.toLowerCase();
      
      // If direct mint, process as a purchase
      if (isDirectMint) {
        const purchaseEvent: NFTPurchaseEvent = {
          buyer: to,
          tokenId: tokenIdStr,
          price: ethers.utils.parseEther("0.1"), // Fixed price for now
          timestamp: Math.floor(Date.now() / 1000),
          isAirdrop: false
        };

        await processPurchase(purchaseEvent);
        onPurchaseSuccess?.(purchaseEvent);
      }
    }
    // Handle transfers from admin wallet (could be airdrops or sales)
    else if (from.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase()) {
      console.log("Transfer from admin wallet detected:", {
        to,
        tokenId: tokenIdStr,
        timestamp: Math.floor(Date.now() / 1000)
      });
      
      // Check if this token was explicitly marked as an airdrop
      const isAirdrop = isTokenAirdrop(tokenIdStr);
      
      if (isAirdrop) {
        console.log(`Token ${tokenIdStr} is an airdrop - skipping referral processing`);
      } else {
        console.log(`Processing transfer from admin as a purchase`);
        
        const purchaseEvent: NFTPurchaseEvent = {
          buyer: to,
          tokenId: tokenIdStr,
          price: ethers.utils.parseEther("0.1"), // Fixed price for now 
          timestamp: Math.floor(Date.now() / 1000),
          isAirdrop: false
        };

        await processPurchase(purchaseEvent);
        onPurchaseSuccess?.(purchaseEvent);
      }
    }
  });

  return () => {
    nftContract.removeAllListeners(NFT_TRANSFER_EVENT);
  };
};

const processPurchase = async (purchaseEvent: NFTPurchaseEvent) => {
  try {
    // Skip processing for airdrops
    if (purchaseEvent.isAirdrop) {
      console.log("Skipping referral processing for airdrop token:", purchaseEvent.tokenId);
      return;
    }
    
    // Check if buyer has an active referral
    const referral = await getActiveReferral(purchaseEvent.buyer);
    
    if (referral && !referral.nftPurchased) {
      console.log("Processing referral reward for purchase:", {
        referral,
        purchaseEvent
      });

      // Update referral with purchase information
      await updateReferralWithPurchase(purchaseEvent.buyer);

      // Process $20 reward payment
      await processReferralReward(referral.referrerAddress);
    }
  } catch (error) {
    console.error("Error processing NFT purchase:", error);
  }
};

const processReferralReward = async (referrerAddress: string) => {
  try {
    // For now, we'll just update the status
    // In production, this would integrate with a payment system
    console.log("Processing $20 reward payment for referrer:", referrerAddress);
    
    // Mock payment processing - in production this would be replaced
    // with actual payment processing logic
    setTimeout(() => {
      console.log("Reward payment processed for referrer:", referrerAddress);
    }, 2000);
  } catch (error) {
    console.error("Error processing referral reward:", error);
  }
};
