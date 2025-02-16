
import { ethers } from "ethers";
import { PRESALE_ABI } from "./abis/presaleAbi";
import { LGR_TOKEN_ABI } from "./abis/lgrTokenAbi";

export const PRESALE_CONTRACT_ADDRESS = "0x123..."; // Replace with actual address
export const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";

export const getWorkingProvider = async () => {
  try {
    // First try getting the injected provider (MetaMask, etc)
    if (window.ethereum) {
      return new ethers.providers.Web3Provider(window.ethereum);
    }
    
    // Fallback to a public RPC if no injected provider
    return new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");
  } catch (error) {
    console.error("Failed to get provider:", error);
    throw new Error("No Web3 provider available");
  }
};

export const getLgrTokenContract = (providerOrSigner: ethers.providers.Provider | ethers.Signer) => {
  return new ethers.Contract(LGR_TOKEN_ADDRESS, LGR_TOKEN_ABI, providerOrSigner);
};

export const getPresaleContract = (providerOrSigner: ethers.providers.Provider | ethers.Signer) => {
  return new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, providerOrSigner);
};

export const fetchPresaleMaticPrice = async (): Promise<string> => {
  try {
    const provider = await getWorkingProvider();
    const contract = getPresaleContract(provider);
    const price = await contract.maticPrice();
    return ethers.utils.formatEther(price);
  } catch (error) {
    console.error("Error fetching MATIC price:", error);
    throw error;
  }
};

export const purchaseTokens = async (provider: ethers.providers.Web3Provider, amount: string) => {
  try {
    const signer = provider.getSigner();
    const contract = getPresaleContract(signer);
    const tx = await contract.purchaseTokens({
      value: ethers.utils.parseEther(amount)
    });
    const receipt = await tx.wait();
    
    // Parse the event to get the amount of tokens purchased
    const event = receipt.events?.find(e => e.event === 'TokensPurchased');
    const tokenAmount = event ? ethers.utils.formatUnits(event.args.amount, 18) : '0';
    
    return {
      amount: tokenAmount,
      hash: receipt.transactionHash
    };
  } catch (error) {
    console.error("Purchase error:", error);
    throw error;
  }
};
