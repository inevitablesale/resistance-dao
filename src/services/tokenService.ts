
import { ethers } from "ethers";

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

export const checkTokenAllowance = async (
  provider: ethers.providers.Provider,
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string,
  requiredAmount: ethers.BigNumber
): Promise<boolean> => {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );

    const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
    
    console.log("Allowance check:", {
      tokenAddress,
      owner: ownerAddress,
      spender: spenderAddress,
      current: allowance.toString(),
      required: requiredAmount.toString(),
      hasEnough: allowance.gte(requiredAmount)
    });

    return allowance.gte(requiredAmount);
  } catch (error) {
    console.error('Error checking token allowance:', error);
    return false;
  }
};

export const approveExactAmount = async (
  provider: ethers.providers.Web3Provider,
  tokenAddress: string,
  spenderAddress: string,
  amount: ethers.BigNumber
): Promise<ethers.ContractTransaction> => {
  try {
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      signer
    );

    console.log("Approving exact amount:", {
      token: tokenAddress,
      spender: spenderAddress,
      amount: amount.toString()
    });

    return await tokenContract.approve(spenderAddress, amount);
  } catch (error) {
    console.error('Error approving tokens:', error);
    throw error;
  }
};

export const getTokenAllowance = async (
  provider: ethers.providers.Provider,
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string
): Promise<string> => {
  try {
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
  provider: ethers.providers.Provider,
  tokenAddress: string,
  ownerAddress: string
): Promise<string> => {
  try {
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
