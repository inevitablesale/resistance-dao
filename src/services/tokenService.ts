
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
  requiredAmount: string
): Promise<boolean> => {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );

    console.log("Checking allowance for:", {
      tokenAddress,
      owner: ownerAddress,
      spender: spenderAddress,
      requiredAmount
    });

    const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
    const requiredAmountBN = ethers.utils.parseUnits(requiredAmount, 18);
    
    console.log("Current allowance:", ethers.utils.formatUnits(allowance, 18));
    return allowance.gte(requiredAmountBN);
  } catch (error) {
    console.error('Error checking token allowance:', error);
    return false;
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

export const approveExactAmount = async (
  provider: ethers.providers.Provider,
  tokenAddress: string,
  spenderAddress: string,
  amount: string
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
      amount: amount,
      amountWei: ethers.utils.parseUnits(amount, 18).toString()
    });

    return await tokenContract.approve(
      spenderAddress, 
      ethers.utils.parseUnits(amount, 18)
    );
  } catch (error) {
    console.error('Error approving tokens:', error);
    throw error;
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
