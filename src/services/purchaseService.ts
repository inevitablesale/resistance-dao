
import { ethers } from "ethers";
import { purchaseTokens } from "@/services/presaleContractService";

interface ShowAuthFlowOptions {
  view?: 'deposit';
}

export const handleCardPurchase = async (setShowAuthFlow: ((show: boolean, options?: ShowAuthFlowOptions) => void) | undefined) => {
  if (setShowAuthFlow) {
    setShowAuthFlow(true, { view: 'deposit' });
  }
};

export const handleMaticPurchase = async (
  walletClient: any,
  amount: string
): Promise<{ amount: string }> => {
  const signer = new ethers.providers.Web3Provider(walletClient).getSigner();
  return purchaseTokens(signer, amount);
};

export const fetchMaticPrice = async (): Promise<number> => {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
  const data = await response.json();
  return data['matic-network'].usd;
};
