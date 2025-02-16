
import { ethers } from "ethers";
import { useDynamicUtils } from "@/hooks/useDynamicUtils";

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)"
];

export const checkTokenAllowance = async (
  tokenAddress: string,
  spenderAddress: string,
  requiredAmount: string
): Promise<boolean> => {
  try {
    const { getProvider } = useDynamicUtils();
    const provider = await getProvider();
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();

    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );

    const [allowance, balance] = await Promise.all([
      tokenContract.allowance(signerAddress, spenderAddress),
      tokenContract.balanceOf(signerAddress)
    ]);

    const requiredAmountBN = ethers.utils.parseUnits(requiredAmount, 18);
    
    // Check both allowance and balance
    return allowance.gte(requiredAmountBN) && balance.gte(requiredAmountBN);
  } catch (error) {
    console.error('Error checking token allowance:', error);
    return false;
  }
};

export const getTokenAllowance = async (
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string
): Promise<string> => {
  try {
    const { getProvider } = useDynamicUtils();
    const provider = await getProvider();
    
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );

    const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
    return ethers.utils.formatUnits(allowance, 18);
  } catch (error) {
    console.error('Error getting token allowance:', error);
    return '0';
  }
};

export const getTokenBalance = async (
  tokenAddress: string,
  ownerAddress: string
): Promise<string> => {
  try {
    const { getProvider } = useDynamicUtils();
    const provider = await getProvider();
    
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );

    const balance = await tokenContract.balanceOf(ownerAddress);
    return ethers.utils.formatUnits(balance, 18);
  } catch (error) {
    console.error('Error getting token balance:', error);
    return '0';
  }
};
