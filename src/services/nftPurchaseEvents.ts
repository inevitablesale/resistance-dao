
import { ethers } from "ethers";
import { ResistanceNFT, RESISTANCE_NFT_ADDRESS } from "./alchemyService";
import { createReferral, getActiveReferral, updateReferralWithPurchase } from "./referralService";
import { useToast } from "@/hooks/use-toast";

export interface NFTPurchaseEvent {
  buyer: string;
  tokenId: string;
  price: ethers.BigNumber;
  timestamp: number;
}

const NFT_TRANSFER_EVENT = "Transfer(address,address,uint256)";

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

  console.log("Subscribing to NFT purchase events...");

  // Listen for Transfer events where 'from' is the zero address (new mints)
  nftContract.on(NFT_TRANSFER_EVENT, async (from, to, tokenId, event) => {
    // Only process new mints (from zero address)
    if (from === ethers.constants.AddressZero) {
      console.log("New NFT purchase detected:", {
        buyer: to,
        tokenId: tokenId.toString(),
        timestamp: Math.floor(Date.now() / 1000)
      });

      const purchaseEvent: NFTPurchaseEvent = {
        buyer: to,
        tokenId: tokenId.toString(),
        price: ethers.utils.parseEther("0.1"), // Fixed price for now
        timestamp: Math.floor(Date.now() / 1000)
      };

      await processPurchase(purchaseEvent);
      onPurchaseSuccess?.(purchaseEvent);
    }
  });

  return () => {
    nftContract.removeAllListeners(NFT_TRANSFER_EVENT);
  };
};

const processPurchase = async (purchaseEvent: NFTPurchaseEvent) => {
  try {
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
